"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { SiteSettings } from "@/lib/types";

export default function SiteSettingsForm({ initial }: { initial: SiteSettings }) {
  const router = useRouter();
  const [siteName, setSiteName] = useState(initial.site_name);
  const [siteDescription, setSiteDescription] = useState(initial.site_description);
  const [footerText, setFooterText] = useState(initial.footer_text);
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
          site_name: siteName,
          site_description: siteDescription,
          footer_text: footerText,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Save failed.");
      setMessage({ ok: true, text: "Saved. Changes are live." });
      router.refresh();
    } catch (err) {
      setMessage({ ok: false, text: err instanceof Error ? err.message : "Save failed." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save} className="space-y-5 max-w-xl">
      <LabeledInput
        label="Site Name"
        value={siteName}
        onChange={setSiteName}
        required
        placeholder="My Stock Metadata"
      />
      <LabeledInput
        label="Site Description"
        value={siteDescription}
        onChange={setSiteDescription}
        placeholder="AI-powered metadata generation for microstock contributors."
      />
      <LabeledInput
        label="Footer Text"
        value={footerText}
        onChange={setFooterText}
        placeholder="Free AI-powered metadata generator for microstock contributors."
      />

      {message ? (
        <p
          className={`rounded-lg px-3 py-2 text-sm ${
            message.ok
              ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300"
              : "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300"
          }`}
        >
          {message.text}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={saving}
        className="rounded-lg bg-brand px-5 py-2.5 font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save Settings"}
      </button>
    </form>
  );
}

export function LabeledInput({
  label,
  value,
  onChange,
  placeholder,
  required,
  type,
  min,
  max,
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
  min?: number;
  max?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <input
        type={type || "text"}
        value={value}
        required={required}
        min={min}
        max={max}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50"
      />
    </label>
  );
}

export function SaveButton({
  saving,
  label,
}: {
  saving: boolean;
  label?: string;
}) {
  return (
    <button
      type="submit"
      disabled={saving}
      className="rounded-lg bg-brand px-5 py-2.5 font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
    >
      {saving ? "Saving…" : label || "Save"}
    </button>
  );
}

export function StatusMessage({ message }: { message: { ok: boolean; text: string } | null }) {
  if (!message) return null;
  return (
    <p
      className={`rounded-lg px-3 py-2 text-sm ${
        message.ok
          ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300"
          : "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300"
      }`}
    >
      {message.text}
    </p>
  );
}
