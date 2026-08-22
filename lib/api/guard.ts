import { NextResponse } from "next/server";
import { getAdminStatus } from "@/lib/auth";

/**
 * Verifies the caller is an authenticated, active admin.
 * Returns null when authorized; otherwise a NextResponse to return early.
 */
export async function requireAdminOrReturn(): Promise<NextResponse | null> {
  try {
    const { isAdmin } = await getAdminStatus();
    if (isAdmin) return null;
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  } catch {
    return NextResponse.json({ error: "Authorization check failed." }, { status: 500 });
  }
}
