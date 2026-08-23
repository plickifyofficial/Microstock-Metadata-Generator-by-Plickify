import SiteHeader from "@/components/branding/SiteHeader";
import SiteFooter from "@/components/branding/SiteFooter";
import GeneratorWorkbench from "@/components/generator/GeneratorWorkbench";
import { getGeneratorSettings, getSiteSettings } from "@/lib/settings";

export const metadata = {
  title: "AI Metadata Generator",
  description: "Upload images and generate titles, descriptions, keywords and categories instantly.",
};

export default async function GeneratorPage() {
  const [settings, siteSettings] = await Promise.all([
    getGeneratorSettings(),
    getSiteSettings(),
  ]);

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-10">
          <h1 className="text-3xl font-bold">AI Metadata Generator</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Upload one or more images. No account needed.
          </p>
          <div className="mt-8">
            <GeneratorWorkbench
              settings={settings}
              enabledProviders={siteSettings.enabled_providers}
            />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
