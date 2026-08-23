"use client";

import { useState } from "react";

interface Health {
  db: boolean;
  ai: boolean;
  version: string;
  ok: boolean;
}

/**
 * CSV Tree-style system health widget in the header: a status dot that
 * expands into a small popover with database / AI / version checks.
 */
export default function HealthBadge() {
  const [open, setOpen] = useState(false);
  const [health, setHealth] = useState<Health | null>(null);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  async function load() {
    setLoading(true);
    setFailed(false);
    try {
      const res = await fetch("/api/health", { cache: "no-store" });
      if (!res.ok) throw new Error("bad status");
      setHealth(await res.json());
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }

  function toggle() {
    const next = !open;
    setOpen(next);
    if (next && !health && !loading) void load();
  }

  const dot = failed
    ? "bg-red-500"
    : loading || (!health && !failed)
      ? "bg-slate-300 dark:bg-slate-600"
      : health?.ok
        ? "bg-emerald-500 animate-pulse"
        : "bg-amber-500";

  return (
    <div className="relative">
      <button
        onClick={toggle}
        title="Web health"
        aria-label="Web health"
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <span className={`inline-block h-2.5 w-2.5 rounded-full ${dot}`} />
      </button>

      {open ? (
        <>
          <button aria-hidden tabIndex={-1} onClick={() => setOpen(false)} className="fixed inset-0 z-40 cursor-default" />
          <div className="absolute right-0 top-full mt-2 w-60 rounded-xl border border-slate-200 dark:border-slate-800 bg-background shadow-xl z-50 py-1">
            <p className="px-4 pt-2.5 pb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Web Health
            </p>
            <div className="px-4 py-2 space-y-2 text-sm">
              <Row
                label="Website"
                ok={!failed}
                value={failed ? "Unreachable" : "Online"}
              />
              <Row
                label="Database"
                ok={!!health?.db}
                value={health ? (health.db ? "Connected" : "Down") : "…"}
              />
              <Row
                label="AI Provider"
                ok={!!health?.ai}
                value={health ? (health.ai ? "Configured" : "Not configured") : "…"}
              />
              <Row
                label="Version"
                ok
                value={health?.version ?? (loading ? "…" : "-")}
              />
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

function Row({ label, ok, value }: { label: string; ok: boolean; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-slate-500 dark:text-slate-400">{label}</span>
      <span className={`font-medium flex items-center gap-1.5 ${ok ? "" : "text-red-500"}`}>
        <span className={`inline-block h-1.5 w-1.5 rounded-full ${ok ? "bg-emerald-500" : "bg-red-500"}`} />
        {value}
      </span>
    </div>
  );
}
