import Link from "next/link";
import SiteHeader from "@/components/branding/SiteHeader";
import SiteFooter from "@/components/branding/SiteFooter";
import { getSiteSettings } from "@/lib/settings";

export default async function HomePage() {
  const s = await getSiteSettings();

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(700px circle at 15% 0%, color-mix(in srgb, var(--brand) 16%, transparent), transparent), radial-gradient(600px circle at 85% 15%, color-mix(in srgb, var(--brand-secondary) 14%, transparent), transparent)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
              backgroundSize: "44px 44px",
              maskImage: "radial-gradient(ellipse 80% 60% at 50% 20%, black, transparent)",
            }}
          />
          <div className="mx-auto max-w-6xl px-4 pt-20 pb-24 text-center">
            {s.hero_badge ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-xs font-semibold text-brand">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand animate-pulse" />
                {s.hero_badge}
              </span>
            ) : null}
            <h1 className="mt-6 mx-auto max-w-3xl text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-balance leading-[1.1]">
              {s.hero_title}
            </h1>
            <p className="mt-6 mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              {s.hero_subtitle}
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/generator"
                className="group inline-flex items-center gap-2 rounded-xl bg-brand px-7 py-3.5 font-semibold text-white shadow-lg shadow-brand/25 hover:shadow-brand/40 hover:-translate-y-0.5 transition-all"
              >
                Open Generator
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4 transition-transform group-hover:translate-x-0.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>

            {/* Trust strip */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
              <span>Adobe Stock</span>
              <span>Shutterstock</span>
              <span>Freepik</span>
              <span>Vecteezy</span>
              <span>Dreamstime</span>
              <span>+ 4 more</span>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-6xl px-4 pb-24">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {s.features.map((f, i) => (
              <div
                key={i}
                className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-surface dark:bg-surface p-6 hover:border-brand/40 hover:shadow-lg hover:shadow-brand/5 transition-all"
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand mb-4">
                  <FeatureIcon index={i} />
                </div>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="border-t border-slate-200 dark:border-slate-800 bg-surface dark:bg-surface-dark/50">
          <div className="mx-auto max-w-6xl px-4 py-20">
            <h2 className="text-center text-3xl font-bold tracking-tight">How it works</h2>
            <p className="mt-3 text-center text-slate-500 dark:text-slate-400">
              Three steps from raw images to upload-ready metadata.
            </p>
            <ol className="mt-12 grid gap-6 sm:grid-cols-3 relative">
              <div aria-hidden className="hidden sm:block absolute top-8 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent" />
              {s.steps.map((step, i) => (
                <li key={i} className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-background p-6 text-center shadow-sm">
                  <span className="mx-auto -mt-11 mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-brand text-xl font-bold text-white shadow-lg shadow-brand/30">
                    {i + 1}
                  </span>
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{step.body}</p>
                </li>
              ))}
            </ol>

            {/* CTA */}
            <div className="mt-16 text-center">
              <Link
                href="/generator"
                className="inline-flex items-center gap-2 rounded-xl bg-brand px-8 py-4 font-semibold text-white shadow-lg shadow-brand/25 hover:shadow-brand/40 hover:-translate-y-0.5 transition-all"
              >
                Start Generating - It&apos;s Free
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function FeatureIcon({ index }: { index: number }) {
  const paths = [
    // sparkles
    "M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z",
    // queue/list
    "M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z",
    // download
    "M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3",
    // cpu/bolt
    "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z",
  ];
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d={paths[index % paths.length]} />
    </svg>
  );
}
