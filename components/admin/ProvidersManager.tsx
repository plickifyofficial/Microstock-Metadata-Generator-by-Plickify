"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PROVIDERS } from "@/lib/ai/providers";

export default function ProvidersManager({
  initialEnabled,
  hasEnvFallbackKey,
}: {
  initialEnabled: string[];
  hasEnvFallbackKey: boolean;
}) {
  const router = useRouter();
  const [enabled, setEnabled] = useState<string[]>(initialEnabled);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  function toggle(id: string) {
    setEnabled((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }

  async function save() {
    if (enabled.length === 0 && !hasEnvFallbackKey) {
      setMessage({
        ok: false,
        text:
          "No providers enabled and no server AI key is configured - generation would be impossible. Enable at least one provider or set AI_API_KEY.",
      });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/site-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled_providers: enabled }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Save failed.");
      setMessage({ ok: true, text: "Saved. The API Keys modal now shows only these providers." });
      router.refresh();
    } catch (err) {
      setMessage({ ok: false, text: err instanceof Error ? err.message : "Save failed." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2">
        {PROVIDERS.map((p) => {
          const on = enabled.includes(p.id);
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => toggle(p.id)}
              className={`text-left rounded-xl border p-4 transition-all ${
                on
                  ? "border-brand bg-brand/5 shadow-sm"
                  : "border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-[10px] font-bold ${
                      on ? "bg-brand text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                    }`}
                  >
                    {p.name.slice(0, 2).toUpperCase()}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold truncate">{p.name}</span>
                    <span className="block text-[11px] text-slate-500 truncate">{p.model}</span>
                  </span>
                </div>
                {/* Toggle */}
                <span
                  className={`w-9 h-5 rounded-full flex items-center transition-colors shrink-0 ${
                    on ? "bg-brand justify-end" : "bg-slate-200 dark:bg-slate-700 justify-start"
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-white shadow-sm mx-0.5" />
                </span>
              </div>
              <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">{p.freeLimit}</p>
            </button>
          );
        })}
      </div>

      <p className="rounded-lg bg-slate-50 dark:bg-slate-800/60 px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
        Enabled providers appear in the generator&apos;s API Keys modal and are accepted by the
        generation API. Keys are added per-browser by whoever uses the tool.
        {hasEnvFallbackKey
          ? " A server env key (AI_API_KEY) is configured as a fallback when no personal keys exist."
          : " No server env key is configured - enable at least one provider."}
      </p>

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
        onClick={save}
        disabled={saving}
        className="rounded-lg bg-brand px-5 py-2.5 font-semibold text-white hover:opacity-90 disabled:opacity-50"
      >
        {saving ? "Saving…" : `Save Providers (${enabled.length} enabled)`}
      </button>
    </div>
  );
}
