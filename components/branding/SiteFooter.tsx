import { getSiteSettings } from "@/lib/settings";

export default async function SiteFooter() {
  const s = await getSiteSettings();
  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-slate-800">
      <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>{s.footer_text}</p>
        <p>© {new Date().getFullYear()} {s.site_name}</p>
      </div>
    </footer>
  );
}
