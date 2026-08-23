import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PUBLIC_PATHS = ["/login", "/auth/callback"];

/**
 * 1. Refreshes the Supabase auth session on every request.
 * 2. Gates the ENTIRE site behind authentication: only signed-in users can
 *    view any page. Authorization (admin vs regular Google account) is then
 *    enforced per-route server-side (/admin layout, /api routes).
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser(); // IMPORTANT: no code between client creation and getUser()

  const { pathname } = request.nextUrl;
  const isPublic =
    PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`)) ||
    pathname.startsWith("/_next") ||
    /\.(?:svg|png|jpg|jpeg|gif|webp|ico)$/.test(pathname);

  // Signed-out visitors: everything redirects to /login.
  if (!user && !isPublic && pathname !== "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = `?next=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
