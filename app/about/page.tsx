import Link from "next/link";
import SiteHeader from "@/components/branding/SiteHeader";
import SiteFooter from "@/components/branding/SiteFooter";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-16">
          <h1 className="text-3xl font-bold">About</h1>
          <div className="mt-6 space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed">
            <p>
              The Microstock Metadata Generator helps stock contributors write
              better titles, descriptions, keywords and categories for their
              images - in seconds instead of minutes.
            </p>
            <p>
              Upload one or more images and an AI vision model analyzes each
              photo, producing marketplace-optimized metadata you can review,
              edit, copy, or export as a CSV matching your platform&apos;s
              upload template (Adobe Stock, Shutterstock, Freepik, Vecteezy,
              Dreamstime, 123RF, Depositphotos, Pond5 and more).
            </p>
            <p>
              The generator is free to use without an account. Uploaded images
              are processed transiently in memory and are never stored
              permanently on the server.
            </p>
          </div>

          <h2 className="mt-10 text-xl font-semibold">For site owners</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            This project is open source and self-hostable. Fork the repository,
            connect your own Supabase project and Vercel deployment, and run
            your own branded metadata generator. See the README for complete
            A-Z setup instructions.
          </p>

          <Link
            href="/generator"
            className="mt-8 inline-block rounded-xl bg-brand px-6 py-3 font-semibold text-white hover:opacity-90 transition-opacity"
          >
            Try the Generator
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
