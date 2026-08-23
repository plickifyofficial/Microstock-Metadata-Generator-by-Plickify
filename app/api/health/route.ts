import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { resolveProvider } from "@/lib/ai/providers";
import versionFile from "../../../version.json";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Lightweight system-health probe used by the header "Web Health" widget.
 * Returns only booleans + version - no sensitive data.
 */
export async function GET() {
  let db = false;
  try {
    const admin = createAdminClient();
    const { error } = await admin.from("site_settings").select("id").limit(1);
    db = !error;
  } catch {
    db = false;
  }

  const ai = !!resolveProvider();

  return NextResponse.json({
    db,
    ai,
    version: versionFile?.version ?? "unknown",
    ok: db && ai,
  });
}
