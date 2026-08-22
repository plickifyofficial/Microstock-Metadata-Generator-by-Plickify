import { NextResponse } from "next/server";
import { requireAdminOrReturn } from "@/lib/api/guard";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const ALLOWED = new Set(["image/png", "image/jpeg", "image/svg+xml", "image/x-icon", "image/vnd.microsoft.icon", "image/webp"]);
const MAX_SIZE = 2 * 1024 * 1024; // 2 MB

/**
 * Uploads a branding asset (logo / favicon) to the public
 * `branding-assets` storage bucket and returns its public URL.
 */
export async function POST(request: Request) {
  const guard = await requireAdminOrReturn();
  if (guard) return guard;

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Expected multipart form data." }, { status: 400 });
  }

  const kind = String(form.get("kind") || "");
  if (!["logo", "favicon"].includes(kind)) {
    return NextResponse.json({ error: "kind must be 'logo' or 'favicon'." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file." }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File must be under 2 MB." }, { status: 413 });
  }
  if (file.type && !ALLOWED.has(file.type)) {
    return NextResponse.json(
      { error: "Use PNG, JPG, SVG, ICO or WebP." },
      { status: 400 }
    );
  }

  try {
    const admin = createAdminClient();
    const ext = extFromName(file.name, file.type);
    const path = `${kind}-${Date.now()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    // Overwrite-safe: unique path per upload; old files can be cleaned in
    // the Supabase dashboard or via a scheduled cleanup later.
    const { error } = await admin.storage
      .from("branding-assets")
      .upload(path, buffer, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });
    if (error) throw error;

    const { data } = admin.storage.from("branding-assets").getPublicUrl(path);
    return NextResponse.json({ url: data.publicUrl });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed." },
      { status: 500 }
    );
  }
}

function extFromName(name: string, type: string): string {
  const m = name.match(/\.([a-zA-Z0-9]+)$/);
  if (m) return m[1].toLowerCase();
  if (type === "image/png") return "png";
  if (type === "image/jpeg") return "jpg";
  if (type === "image/svg+xml") return "svg";
  if (type === "image/webp") return "webp";
  return "ico";
}
