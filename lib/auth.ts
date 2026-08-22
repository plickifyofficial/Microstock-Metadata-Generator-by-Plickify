import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export interface AdminCheckResult {
  user: {
    id: string;
    email: string;
    name?: string;
    avatarUrl?: string;
  } | null;
  isAdmin: boolean;
}

/**
 * Full server-side authorization: authenticated Supabase session AND an
 * active row in admin_users. Used by the admin layout and every admin
 * API route. Never rely on client-side checks alone.
 */
export async function getAdminStatus(): Promise<AdminCheckResult> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return { user: null, isAdmin: false };

    const user = data.user;
    const email = user.email ?? "";
    let isAdmin = false;

    // Prefer the optional bootstrap allowlist (ADMIN_EMAIL env var) so the
    // very first admin can sign in before any DB row exists.
    const bootstrapEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
    if (bootstrapEmail && email.toLowerCase() === bootstrapEmail) {
      isAdmin = true;
      await ensureAdminRow(user.id, email);
    }

    if (!isAdmin) {
      const admin = createAdminClient();
      const { data: rows } = await admin
        .from("admin_users")
        .select("status")
        .eq("user_id", user.id)
        .limit(1);
      isAdmin = !!rows?.[0] && rows[0].status === "active";
    }

    return { user: { id: user.id, email }, isAdmin };
  } catch {
    // Misconfigured environment - fail closed.
    return { user: null, isAdmin: false };
  }
}

/** Best-effort upsert of the bootstrap admin row so it appears in the DB. */
async function ensureAdminRow(userId: string, email: string) {
  try {
    const admin = createAdminClient();
    await admin.from("admin_users").upsert(
      {
        user_id: userId,
        email,
        status: "active",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );
  } catch {
    // Non-fatal.
  }
}
