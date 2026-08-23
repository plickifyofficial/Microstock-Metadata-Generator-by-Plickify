import { NextResponse } from "next/server";
import { requireAdminOrReturn } from "@/lib/api/guard";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSiteSettings } from "@/lib/settings";

const HEX = /^#[0-9a-fA-F]{6}$/;

export async function POST(request: Request) {
  const guard = await requireAdminOrReturn();
  if (guard) return guard;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const patch: Record<string, string | null> = {};

  const textFields = ["site_name", "site_description", "footer_text"] as const;
  for (const f of textFields) {
    if (typeof body[f] === "string") {
      const v = (body[f] as string).trim();
      if (!v && f === "site_name") {
        return NextResponse.json({ error: "Site name cannot be empty." }, { status: 400 });
      }
      patch[f] = v;
    }
  }

  for (const f of ["logo_url", "favicon_url"] as const) {
    if (f in body) patch[f] = typeof body[f] === "string" ? (body[f] as string).trim() : null;
  }

  if (typeof body.primary_color === "string") {
    if (!HEX.test(body.primary_color)) {
      return NextResponse.json({ error: "Primary color must be a HEX value like #16A34A." }, { status: 400 });
    }
    patch.primary_color = body.primary_color;
  }
  if (typeof body.secondary_color === "string") {
    if (!HEX.test(body.secondary_color)) {
      return NextResponse.json({ error: "Secondary color must be a HEX value like #0F172A." }, { status: 400 });
    }
    patch.secondary_color = body.secondary_color;
  }

  if ("theme_mode" in body) {
    if (!["light", "dark", "system"].includes(String(body.theme_mode))) {
      return NextResponse.json({ error: "Invalid theme mode." }, { status: 400 });
    }
    patch.theme_mode = String(body.theme_mode);
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  try {
    // Merge with the existing row so partial updates don't blank other
    // fields, then UPSERT - if the row is missing (migrations not run yet)
    // it is created instead of silently updating zero rows.
    const current = await getSiteSettings();
    const merged = { ...current, ...patch } as Record<string, unknown>;
    delete merged.updated_at;

    const admin = createAdminClient();
    const { error } = await admin.from("site_settings").upsert({
      id: 1,
      ...merged,
      updated_at: new Date().toISOString(),
    });
    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to save settings." },
      { status: 500 }
    );
  }
}
