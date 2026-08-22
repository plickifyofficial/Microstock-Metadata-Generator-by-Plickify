"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { StatusMessage } from "@/components/admin/SiteSettingsForm";
import type { SiteSettings } from "@/lib/types";

const PRESETS = ["#16A34A", "#2563EB", "#7C3AED", "#DC2626", "#EA580C", "#0891B2", "#DB2777", "#65A30D"];

export default function ThemeForm({ initial }: { initial: SiteSettings }) {
  const router = useRouter();
  const [themeMode, setThemeMode] = useState<SiteSettings["theme_mode"]>(initial.theme_mode);
  const [primaryColor, setPrimaryColor] = useState(initial.primary_color);
  const [secondaryColor, setSecondaryColor] = useState(initial.secondary_color);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  async function save(e?: React.FormEvent) {
    e?.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/site-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theme_mode: themeMode,
          primary_color: primaryColor,
          secondary_color: secondaryColor,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Save failed.");
      setMessage({ ok: true, text: "Saved. Visitors see the new theme immediately." });
      router.refresh();
    } catch (err) {
      setMessage({ ok: false, text: err instanceof Error ? err.message : "Save failed." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save} className="space-y-6 max-w-xl">
      {/* Mode */}
      <fieldset>
        <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Default Theme
        </legend>
        <div className="flex gap-2">
          {(["light", "dark", "system"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setThemeMode(mode)}
              className={`rounded-lg border px-4 py-2 text-sm font-medium capitalize transition-colors ${
                themeMode === mode
                  ? "border-brand bg-brand text-white"
                  : "border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Presets */}
      <fieldset>
        <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Preset Colors
        </legend>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setPrimaryColor(color)}
              aria-label={`Use ${color}`}
              className={`h-9 w-9 rounded-lg border-2 transition-transform hover:scale-105 ${
                primaryColor.toLowerCase() === color.toLowerCase()
                  ? "border-brand ring-2 ring-brand/40 scale-110"
                  : "border-transparent"
              }`}
              style={{ background: color }}
            />
          ))}
        </div>
      </fieldset>

      {/* Custom hex */}
      <HexInput label="Primary Color (HEX)" value={primaryColor} onChange={setPrimaryColor} />
      <HexInput label="Secondary Color (HEX)" value={secondaryColor} onChange={setSecondaryColor} />

      <StatusMessage message={message} />

      <div className="flex items-center gap-3">
        <button type="submit" disabled={saving}
          className="rounded-lg bg-brand px-5 py-2.5 font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50">
          {saving ? "Saving…" : "Save Theme"}
        </button>
        <span
          className="inline-flex h-8 items-center rounded-full px-3 text-xs font-semibold text-white"
          style={{ background: /^#[0-9a-fA-F]{6}$/.test(primaryColor) ? primaryColor : "#000" }}
        >
          Preview
        </span>
      </div>
    </form>
  );
}

function HexInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block w-48">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="#16A34A"
        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50"
      />
    </label>
  );
}
