"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LabeledInput, StatusMessage } from "@/components/admin/SiteSettingsForm";
import type { GeneratorSettings } from "@/lib/types";

export default function GeneratorSettingsForm({ initial }: { initial: GeneratorSettings }) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [categoriesText, setCategoriesText] = useState(initial.categories.join("\n"));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  function set<K extends keyof GeneratorSettings>(key: K, value: GeneratorSettings[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/generator-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          categories: categoriesText
            .split("\n")
            .map((c) => c.trim())
            .filter(Boolean),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Save failed.");
      setMessage({ ok: true, text: "Saved. New generations will use these settings." });
      router.refresh();
    } catch (err) {
      setMessage({ ok: false, text: err instanceof Error ? err.message : "Save failed." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save} className="space-y-6 max-w-xl">
      <fieldset className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-4">
        <legend className="px-1 text-sm font-semibold">Title & Description</legend>
        <div className="grid grid-cols-2 gap-3">
          <LabeledInput label="Title Min Chars" type="number" min={10} max={300}
            value={form.title_length_min} onChange={(v) => set("title_length_min", Number(v))} />
          <LabeledInput label="Title Max Chars" type="number" min={20} max={300}
            value={form.title_length_max} onChange={(v) => set("title_length_max", Number(v))} />
          <LabeledInput label="Description Min Words" type="number" min={5} max={200}
            value={form.description_words_min} onChange={(v) => set("description_words_min", Number(v))} />
          <LabeledInput label="Description Max Words" type="number" min={10} max={300}
            value={form.description_words_max} onChange={(v) => set("description_words_max", Number(v))} />
        </div>
      </fieldset>

      <fieldset className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-4">
        <legend className="px-1 text-sm font-semibold">Keywords</legend>
        <div className="grid grid-cols-2 gap-3">
          <LabeledInput label="Keywords Min" type="number" min={3} max={100}
            value={form.keywords_count_min} onChange={(v) => set("keywords_count_min", Number(v))} />
          <LabeledInput label="Keywords Max" type="number" min={5} max={100}
            value={form.keywords_count_max} onChange={(v) => set("keywords_count_max", Number(v))} />
        </div>
      </fieldset>

      <fieldset className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-4">
        <legend className="px-1 text-sm font-semibold">Category</legend>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.include_category}
            onChange={(e) => set("include_category", e.target.checked)}
            className="h-4 w-4 accent-[var(--brand)]"
          />
          Generate a category (chosen from the list below)
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Categories (one per line)
          </span>
          <textarea
            rows={6}
            value={categoriesText}
            onChange={(e) => setCategoriesText(e.target.value)}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 font-mono"
          />
        </label>
      </fieldset>

      <fieldset className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-4">
        <legend className="px-1 text-sm font-semibold">Behavior & Limits</legend>
        <div className="grid grid-cols-2 gap-3">
          <LabeledInput label="Language Code" value={form.language}
            onChange={(v) => set("language", v)} placeholder="en" />
          <LabeledInput label="Max Images / Batch" type="number" min={1} max={200}
            value={form.max_images_per_batch} onChange={(v) => set("max_images_per_batch", Number(v))} />
          <LabeledInput label="Rate Limit / Hour / IP (0 = unlimited)" type="number" min={0} max={100000}
            value={form.rate_limit_per_hour} onChange={(v) => set("rate_limit_per_hour", Number(v))} />
        </div>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Extra AI Instructions (optional)
          </span>
          <textarea
            rows={3}
            value={form.custom_prompt}
            onChange={(e) => set("custom_prompt", e.target.value)}
            placeholder="e.g. Avoid mentioning seasons or holidays."
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50"
          />
        </label>
      </fieldset>

      <StatusMessage message={message} />

      <button type="submit" disabled={saving}
        className="rounded-lg bg-brand px-5 py-2.5 font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50">
        {saving ? "Saving…" : "Save Generator Settings"}
      </button>
    </form>
  );
}
