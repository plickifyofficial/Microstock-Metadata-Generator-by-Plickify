import Link from "next/link";
import SiteHeader from "@/components/branding/SiteHeader";
import SiteFooter from "@/components/branding/SiteFooter";
import { getSiteSettings } from "@/lib/settings";

export const metadata = { title: "About" };

export default async function AboutPage() {
  const s = await getSiteSettings();
  const paragraphs = s.about_body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-16">
          <span className="inline-flex items-center rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-xs font-semibold text-brand">
            {s.site_name}
          </span>
          <h1 className="mt-5 text-4xl font-bold tracking-tight">{s.about_title}</h1>

          <div className="mt-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-surface dark:bg-surface p-7 sm:p-9">
            <div className="space-y-5 text-slate-600 dark:text-slate-400 leading-relaxed">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>

          {/* Feature recap */}
          {s.features.length > 0 ? (
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {s.features.map((f, i) => (
                <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                  <h3 className="font-semibold text-sm">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">{f.body}</p>
                </div>
              ))}
            </div>
          ) : null}

          <h2 className="mt-12 text-xl font-semibold">For site owners</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            This project is open source and self-hostable. Fork the repository,
            connect your own Supabase project and Vercel deployment, and run
            your own branded metadata generator. The README has complete A-Z
            setup instructions.
          </p>

          <Link
            href="/generator"
            className="mt-9 inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 font-semibold text-white shadow-lg shadow-brand/25 hover:shadow-brand/40 hover:-translate-y-0.5 transition-all"
          >
            Try the Generator
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
