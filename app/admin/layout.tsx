import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminStatus } from "@/lib/auth";
import AdminLogout from "@/components/admin/AdminLogout";

export const metadata = { title: "Admin" };

const NAV = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/settings", label: "Site Settings" },
  { href: "/admin/branding", label: "Branding" },
  { href: "/admin/theme", label: "Theme" },
  { href: "/admin/generator", label: "Generator Settings" },
  { href: "/admin/ai", label: "AI Settings" },
  { href: "/admin/admins", label: "Admins" },
  { href: "/admin/usage", label: "Usage" },
];

/**
 * Server-side guard for every /admin route. Unauthenticated visitors are
 * redirected to login; authenticated non-admins see Access Denied.
 * Never rely on client-side checks alone.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAdmin } = await getAdminStatus();

  if (!user) {
    redirect("/login?next=/admin");
  }

  if (!isAdmin) {
    return (
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md rounded-2xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 p-8 text-center">
          <h1 className="text-2xl font-bold text-red-700 dark:text-red-300">Access Denied</h1>
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">
            Your account ({user.email}) is not authorized as an admin. If you
            believe this is a mistake, add your user to the{" "}
            <code className="px-1 rounded bg-red-100 dark:bg-red-900">admin_users</code>{" "}
            table (see README).
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/"
              className="rounded-lg border border-red-300 dark:border-red-800 px-4 py-2 text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
            >
              Back to site
            </Link>
            <AdminLogout compact />
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="flex-1 flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className="hidden md:flex w-56 shrink-0 flex-col border-r border-slate-200 dark:border-slate-800 p-4 gap-1">
        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Admin Panel
        </p>
        {NAV.map((item) => (
          <AdminNavLink key={item.href} {...item} />
        ))}
        <div className="mt-auto space-y-1">
          <Link
            href="/"
            className="block rounded-lg px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            ← View Site
          </Link>
          <AdminLogout />
        </div>
      </aside>

      {/* Mobile nav */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-slate-200 dark:border-slate-800 bg-background/95 backdrop-blur p-2 overflow-x-auto">
        <div className="flex gap-1 w-max">
          {NAV.map((item) => (
            <AdminNavLink key={item.href} {...item} mobile />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-x-hidden pb-24 md:pb-8">
        <div className="mx-auto max-w-3xl px-4 py-8">{children}</div>
      </div>
    </div>
  );
}

async function AdminNavLink({
  href,
  label,
  exact,
  mobile,
}: {
  href: string;
  label: string;
  exact?: boolean;
  mobile?: boolean;
}) {
  // Server component links; active state handled by CSS via aria-current is
  // not available server-side, so we keep it simple and style uniformly.
  void exact;
  return (
    <Link
      href={href}
      className={`block whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
        mobile ? "border border-slate-200 dark:border-slate-700" : ""
      }`}
    >
      {label}
    </Link>
  );
}
