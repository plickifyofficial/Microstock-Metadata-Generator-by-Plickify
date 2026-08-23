import { getSiteSettings } from "@/lib/settings";
import { DEVELOPER } from "@/lib/core/license";

export default async function SiteFooter() {
  const s = await getSiteSettings();
  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-slate-800">
      <div className="mx-auto max-w-6xl px-4 py-5">
        <div className="grid gap-2 sm:grid-cols-3 items-center text-sm text-slate-500 dark:text-slate-400">
          {/* Left: footer text */}
          <p className="text-center sm:text-left truncate">{s.footer_text}</p>

          {/* Center: copyright */}
          <p className="text-center font-medium">
            © {new Date().getFullYear()} {s.site_name}
          </p>

          {/* Right: made by (website only) */}
          <div className="flex items-center justify-center sm:justify-end gap-1.5 text-xs">
            <span>{DEVELOPER.tagline}</span>
            <a
              href={DEVELOPER.website}
              target="_blank"
              rel="noreferrer"
              title={DEVELOPER.website}
              className="inline-flex items-center hover:opacity-80 transition-opacity"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/plickify-logo.png" alt={DEVELOPER.name} className="h-4 w-auto" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
