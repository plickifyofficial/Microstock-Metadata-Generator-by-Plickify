import { NextResponse } from "next/server";
import { requireAdminOrReturn } from "@/lib/api/guard";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/** List every post (newest first, pinned on top). */
export async function GET() {
  const guard = await requireAdminOrReturn();
  if (guard) return guard;
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("social_posts")
      .select("*")
      .order("pinned", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw error;
    return NextResponse.json({ posts: data ?? [] });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load posts." },
      { status: 500 }
    );
  }
}

/** Create a post. */
export async function POST(request: Request) {
  const guard = await requireAdminOrReturn();
  if (guard) return guard;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }

  const title = clean(body.title, 150);
  const content = clean(body.body, 5000);
  if (!title || !content) {
    return NextResponse.json({ error: "Title and body are required." }, { status: 400 });
  }

  try {
    const admin = createAdminClient();
    const { error } = await admin.from("social_posts").insert({
      title,
      body: content,
      link_url: clean(body.link_url, 500) || null,
      link_label: clean(body.link_label, 60) || null,
      pinned: Boolean(body.pinned),
    });
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create post." },
      { status: 500 }
    );
  }
}

/** Update a post. */
export async function PATCH(request: Request) {
  const guard = await requireAdminOrReturn();
  if (guard) return guard;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }
  const id = Number(body.id);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: "id is required." }, { status: 400 });
  }

  const patch: Record<string, unknown> = {};
  if ("title" in body) patch.title = clean(body.title, 150);
  if ("body" in body) patch.body = clean(body.body, 5000);
  if ("link_url" in body) patch.link_url = clean(body.link_url, 500) || null;
  if ("link_label" in body) patch.link_label = clean(body.link_label, 60) || null;
  if ("pinned" in body) patch.pinned = Boolean(body.pinned);

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  try {
    const admin = createAdminClient();
    const { error } = await admin.from("social_posts").update(patch).eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to update post." },
      { status: 500 }
    );
  }
}

/** Delete a post. */
export async function DELETE(request: Request) {
  const guard = await requireAdminOrReturn();
  if (guard) return guard;

  let body: { id?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }
  if (!Number.isFinite(Number(body.id))) {
    return NextResponse.json({ error: "id is required." }, { status: 400 });
  }

  try {
    const admin = createAdminClient();
    const { error } = await admin.from("social_posts").delete().eq("id", Number(body.id));
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to delete post." },
      { status: 500 }
    );
  }
}
