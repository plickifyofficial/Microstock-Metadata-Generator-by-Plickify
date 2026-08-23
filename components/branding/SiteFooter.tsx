import { getSiteSettings } from "@/lib/settings";
import { DEVELOPER } from "@/lib/core/license";

export default async function SiteFooter() {
  const s = await getSiteSettings();
  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-slate-800">
      <div className="mx-auto max-w-6xl px-4 py-6 space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-slate-500 dark:text-slate-400">
          <p>{s.footer_text}</p>
          <p>© {new Date().getFullYear()} {s.site_name}</p>
        </div>
        {/* Required developer attribution - protected by lib/core/license.ts */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3">
          <span>{DEVELOPER.tagline}</span>
          <a
            href={DEVELOPER.website}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 font-semibold text-brand hover:underline"
          >
            <span className="inline-flex h-4 w-4 items-center justify-center rounded bg-gradient-to-br from-brand to-brand-secondary text-[8px] font-extrabold text-white">
              P
            </span>
            {DEVELOPER.name}
          </a>
          <span aria-hidden>·</span>
          <a
            href={DEVELOPER.facebook}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 hover:text-[#1877F2] transition-colors"
            title="Facebook"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047v-2.66c0-3.026 1.792-4.697 4.533-4.697 1.313 0 2.686.236 2.686.236v2.97H15.83c-1.491 0-1.956.93-1.956 1.886v2.265h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073Z" /></svg>
            /plickify
          </a>
        </div>
      </div>
    </footer>
  );
}
