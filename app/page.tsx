import Link from "next/link";
import SiteHeader from "@/components/branding/SiteHeader";
import SiteFooter from "@/components/branding/SiteFooter";
import { getSiteSettings } from "@/lib/settings";

export default async function HomePage() {
  const s = await getSiteSettings();

  const features = [
    {
      title: "AI Metadata",
      body: "Upload any image and get an optimized title, description, keywords and category in seconds.",
    },
    {
      title: "Bulk Processing",
      body: "Queue multiple images at once and let the generator process them one by one.",
    },
    {
      title: "Platform CSV Export",
      body: "Export ready-to-upload metadata for Adobe Stock, Shutterstock, Freepik, Vecteezy, Dreamstime and more.",
    },
    {
      title: "No Account Needed",
      body: "The generator is free and open to every visitor. No registration required.",
    },
  ];

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
                "radial-gradient(600px circle at 20% 10%, color-mix(in srgb, var(--brand) 14%, transparent), transparent), radial-gradient(500px circle at 80% 20%, color-mix(in srgb, var(--brand-secondary) 12%, transparent), transparent)",
            }}
          />
          <div className="mx-auto max-w-6xl px-4 py-24 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-balance">
              AI-powered metadata for your{" "}
              <span className="text-brand">microstock</span> uploads
            </h1>
            <p className="mt-5 mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-400">
              {s.site_description}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/generator"
                className="rounded-xl bg-brand px-6 py-3 font-semibold text-white shadow hover:opacity-90 transition-opacity"
              >
                Open Generator
              </Link>
              <Link
                href="/about"
                className="rounded-xl border border-slate-300 dark:border-slate-700 px-6 py-3 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-6xl px-4 pb-24 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-surface dark:bg-surface p-6"
            >
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand font-bold mb-3">
                ✦
              </div>
              <h3 className="font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{f.body}</p>
            </div>
          ))}
        </section>

        {/* How it works */}
        <section className="border-t border-slate-200 dark:border-slate-800">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <h2 className="text-center text-2xl font-bold">How it works</h2>
            <ol className="mt-8 grid gap-6 sm:grid-cols-3 text-sm">
              {[
                ["Upload", "Drag & drop or select one or more images."],
                ["Generate", "The AI analyzes each image and writes metadata."],
                ["Export", "Review, edit if needed, then copy or export a CSV."],
              ].map(([t, b], i) => (
                <li key={t} className="rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                  <span className="text-xs font-semibold text-brand">STEP {i + 1}</span>
                  <h3 className="mt-1 font-semibold">{t}</h3>
                  <p className="mt-1 text-slate-600 dark:text-slate-400">{b}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
