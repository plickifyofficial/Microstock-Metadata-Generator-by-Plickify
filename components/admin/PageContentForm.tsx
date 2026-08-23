"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LabeledInput, StatusMessage } from "@/components/admin/SiteSettingsForm";
import type { ContentBlock, SiteSettings } from "@/lib/types";

export default function PageContentForm({ initial }: { initial: SiteSettings }) {
  const router = useRouter();
  const [heroBadge, setHeroBadge] = useState(initial.hero_badge);
  const [heroTitle, setHeroTitle] = useState(initial.hero_title);
  const [heroSubtitle, setHeroSubtitle] = useState(initial.hero_subtitle);
  const [aboutTitle, setAboutTitle] = useState(initial.about_title);
  const [aboutBody, setAboutBody] = useState(initial.about_body);
  const [features, setFeatures] = useState<ContentBlock[]>(initial.features);
  const [steps, setSteps] = useState<ContentBlock[]>(initial.steps);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/site-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hero_badge: heroBadge,
          hero_title: heroTitle,
          hero_subtitle: heroSubtitle,
          about_title: aboutTitle,
          about_body: aboutBody,
          features,
          steps,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Save failed.");
      setMessage({ ok: true, text: "Saved. The public pages are updated." });
      router.refresh();
    } catch (err) {
      setMessage({ ok: false, text: err instanceof Error ? err.message : "Save failed." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save} className="space-y-6 max-w-2xl">
      {/* Home - hero */}
      <fieldset className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
        <legend className="px-1 text-sm font-semibold">Home - Hero Section</legend>
        <LabeledInput label="Badge Text" value={heroBadge} onChange={setHeroBadge}
          placeholder="Free - built for microstock contributors" />
        <LabeledInput label="Headline" value={heroTitle} onChange={setHeroTitle} required />
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Sub-headline
          </span>
          <textarea
            rows={2}
            value={heroSubtitle}
            onChange={(e) => setHeroSubtitle(e.target.value)}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50"
          />
        </label>
      </fieldset>

      {/* Home - feature cards */}
      <BlockEditor
        title="Home - Feature Cards"
        hint="Shown as cards under the hero (max 8)."
        blocks={features}
        onChange={setFeatures}
      />

      {/* Home - steps */}
      <BlockEditor
        title="Home - How It Works Steps"
        hint="The numbered steps section (max 8, 3 recommended)."
        blocks={steps}
        onChange={setSteps}
      />

      {/* About page */}
      <fieldset className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
        <legend className="px-1 text-sm font-semibold">About Page</legend>
        <LabeledInput label="Page Title" value={aboutTitle} onChange={setAboutTitle} />
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Body (blank line = new paragraph)
          </span>
          <textarea
            rows={8}
            value={aboutBody}
            onChange={(e) => setAboutBody(e.target.value)}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50"
          />
        </label>
        <p className="text-xs text-slate-400">
          Feature cards from above are also shown on the About page.
        </p>
      </fieldset>

      <StatusMessage message={message} />

      <button
        type="submit"
        disabled={saving}
        className="rounded-lg bg-brand px-5 py-2.5 font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save Page Content"}
      </button>
    </form>
  );
}

function BlockEditor({
  title,
  hint,
  blocks,
  onChange,
}: {
  title: string;
  hint?: string;
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}) {
  function updateBlock(index: number, patch: Partial<ContentBlock>) {
    onChange(blocks.map((b, i) => (i === index ? { ...b, ...patch } : b)));
  }

  return (
    <fieldset className="rounded-xl border border-slate-200 dark:border-slate-800 p-5">
      <legend className="px-1 text-sm font-semibold">{title}</legend>
      {hint ? <p className="mb-3 text-xs text-slate-400">{hint}</p> : null}
      <div className="space-y-3">
        {blocks.map((block, i) => (
          <div key={i} className="rounded-lg border border-slate-200 dark:border-slate-700 p-3 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                #{i + 1}
              </span>
              <input
                value={block.title}
                onChange={(e) => updateBlock(i, { title: e.target.value })}
                placeholder="Card title"
                className="flex-1 rounded-md border border-slate-200 dark:border-slate-700 bg-background px-2.5 py-1.5 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-brand"
              />
              <button
                type="button"
                onClick={() => onChange(blocks.filter((_, j) => j !== i))}
                disabled={blocks.length <= 1}
                className="text-xs text-red-500 hover:underline disabled:opacity-30"
              >
                Remove
              </button>
            </div>
            <textarea
              rows={2}
              value={block.body}
              onChange={(e) => updateBlock(i, { body: e.target.value })}
              placeholder="Card description"
              className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-background px-2.5 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...blocks, { title: "", body: "" }])}
        disabled={blocks.length >= 8}
        className="mt-3 rounded-lg border border-dashed border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-medium text-slate-500 hover:border-brand hover:text-brand transition-colors disabled:opacity-40"
      >
        + Add Card
      </button>
    </fieldset>
  );
}
