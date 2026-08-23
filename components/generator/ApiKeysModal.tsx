"use client";

import { useEffect, useState } from "react";
import { PROVIDERS } from "@/lib/ai/providers";
import {
  addKey,
  removeKey,
  setActiveKey,
  listKeysMasked,
  getSelectedProvider,
  setSelectedProvider,
  getAutoFallback,
  setAutoFallback,
} from "@/lib/client/apiKeys";

interface MaskedKey {
  id: string;
  masked: string;
  status: string;
  health: string;
  lastFailedAt?: number;
  cooldownMs?: number;
}

export default function ApiKeysModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [selected, setSelected] = useState("groq");
  const [keysByProvider, setKeysByProvider] = useState<Record<string, MaskedKey[]>>({});
  const [newKey, setNewKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fallbackOn, setFallbackOn] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function refresh() {
    setSelected(getSelectedProvider());
    setFallbackOn(getAutoFallback());
    const map: Record<string, MaskedKey[]> = {};
    let total = 0;
    for (const p of PROVIDERS) {
      const keys = listKeysMasked(p.id);
      map[p.id] = keys;
      total += keys.length;
    }
    setKeysByProvider(map);
    if (!expanded && total > 0) {
      const firstWithKeys = PROVIDERS.find((p) => map[p.id]?.length);
      if (firstWithKeys) setExpanded(firstWithKeys.id);
    }
  }

  function handleAdd(providerId: string) {
    setError(null);
    try {
      addKey(providerId, newKey);
      setSelectedProvider(providerId);
      setNewKey("");
      refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save the key.");
    }
  }

  if (!open) return null;

  const ordered = [...PROVIDERS].sort((a, b) => {
    const aHas = (keysByProvider[a.id]?.length ?? 0) > 0 ? 0 : 1;
    const bHas = (keysByProvider[b.id]?.length ?? 0) > 0 ? 0 : 1;
    if (aHas !== bHas) return aHas - bHas;
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return 0;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal>
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-background shadow-xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 bg-background px-5 py-4">
          <div>
            <h2 className="text-lg font-bold">API Keys</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Bring your own keys - stored only in this browser. Rotation & fallback are automatic.
            </p>
          </div>
          <button onClick={onClose} aria-label="Close" className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Tutorial */}
        <div className="mx-5 mt-4 rounded-xl border border-brand/30 bg-brand/5 p-4 text-sm">
          <p className="font-semibold text-brand">How it works</p>
          <ol className="mt-2 space-y-1 text-slate-600 dark:text-slate-400 list-decimal list-inside">
            <li>Pick a provider below and click its docs link to create a free API key.</li>
            <li>Paste the key and press Add. The first key of a provider becomes active.</li>
            <li>Generation always uses your active provider first; if it fails or hits a rate limit, other saved providers are tried automatically (when Auto-fallback is on).</li>
            <li>Failing keys cool down for ~5 minutes (quota errors ~1 hour) and recover automatically.</li>
            <li>No keys? The server&apos;s own AI_PROVIDER / AI_API_KEY is used as a fallback.</li>
          </ol>
          <label className="mt-3 flex items-center gap-2 text-sm font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={fallbackOn}
              onChange={(e) => {
                setAutoFallback(e.target.checked);
                setFallbackOn(e.target.checked);
              }}
              className="h-4 w-4 accent-[var(--brand)]"
            />
            Auto-fallback to other providers
          </label>
        </div>

        {error ? (
          <p className="mx-5 mt-3 rounded-lg bg-red-50 dark:bg-red-950/40 px-3 py-2 text-sm text-red-700 dark:text-red-300">{error}</p>
        ) : null}

        {/* Provider list */}
        <div className="p-5 space-y-2">
          {ordered.map((p) => {
            const keys = keysByProvider[p.id] || [];
            const isOpen = expanded === p.id;
            const isSel = selected === p.id && keys.length > 0;
            const unhealthy = keys.filter((k) => k.health === "unhealthy").length;
            return (
              <div key={p.id} className={`rounded-xl border transition-colors ${isSel ? "border-brand" : "border-slate-200 dark:border-slate-700"}`}>
                <button
                  onClick={() => setExpanded(isOpen ? null : p.id)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left"
                >
                  <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-[10px] font-bold ${keys.length ? "bg-brand text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400"}`}>
                    {p.name.slice(0, 2).toUpperCase()}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-semibold truncate">
                      {p.name}
                      {isSel ? <span className="ml-2 rounded-full bg-brand/15 px-2 py-0.5 text-[10px] font-bold text-brand">ACTIVE</span> : null}
                      {unhealthy ? (
                        <span className="ml-2 rounded-full bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300">
                          {unhealthy} cooling down
                        </span>
                      ) : null}
                    </span>
                    <span className="block text-xs text-slate-500 dark:text-slate-400 truncate">
                      {p.model} · {p.freeLimit}
                    </span>
                  </span>
                  <span className="text-xs font-semibold text-slate-400">{keys.length ? `${keys.length} key${keys.length > 1 ? "s" : ""}` : p.free ? "Free" : "Paid"}</span>
                  <span className="text-slate-400">{isOpen ? "▲" : "▼"}</span>
                </button>

                {isOpen && (
                  <div className="border-t border-slate-100 dark:border-slate-800 px-4 py-3 space-y-3">
                    <p className="text-xs text-slate-500 dark:text-slate-400">{p.description}</p>

                    {/* Add form */}
                    <div className="flex gap-2">
                      <input
                        type="password"
                        autoComplete="off"
                        value={expanded === p.id ? newKey : ""}
                        onFocus={() => setExpanded(p.id)}
                        onChange={(e) => setNewKey(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAdd(p.id)}
                        placeholder={p.keyHint || (p.keyPrefix ? `e.g. ${p.keyPrefix}...` : "Paste your API key")}
                        className="flex-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand"
                      />
                      <button
                        onClick={() => handleAdd(p.id)}
                        disabled={!newKey.trim()}
                        className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-40"
                      >
                        Add
                      </button>
                    </div>
                    <p className="text-xs text-slate-400">
                      Get a key:{" "}
                      <a href={p.docsUrl} target="_blank" rel="noreferrer" className="text-brand hover:underline">
                        {p.docsUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                      </a>
                      {p.textOnly ? " · Text-only model: works only when vision providers are exhausted." : ""}
                    </p>

                    {/* Saved keys */}
                    {keys.length > 0 && (
                      <ul className="space-y-1.5">
                        {keys.map((k) => (
                          <li key={k.id} className="flex items-center gap-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 px-3 py-2">
                            <code className="text-xs flex-1 truncate">{k.masked}</code>
                            {k.status === "active" ? (
                              <span className="rounded-full bg-brand/15 px-2 py-0.5 text-[10px] font-bold text-brand">ACTIVE</span>
                            ) : k.health === "unhealthy" && k.lastFailedAt ? (
                              <CooldownBadge lastFailedAt={k.lastFailedAt} cooldownMs={k.cooldownMs || 300000} />
                            ) : (
                              <span className="rounded-full bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">READY</span>
                            )}
                            {k.status !== "active" && (
                              <button
                                onClick={() => { setActiveKey(p.id, k.id); refresh(); }}
                                className="text-xs text-slate-500 hover:text-brand"
                              >
                                Set active
                              </button>
                            )}
                            <button
                              onClick={() => { removeKey(p.id, k.id); refresh(); }}
                              className="text-xs text-red-500 hover:underline"
                            >
                              Remove
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}

                    {keys.length > 0 && !isSel && (
                      <button
                        onClick={() => { setSelectedProvider(p.id); refresh(); }}
                        className="rounded-lg border border-brand px-3 py-1.5 text-xs font-semibold text-brand hover:bg-brand/5"
                      >
                        Use {p.name} as primary
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CooldownBadge({ lastFailedAt, cooldownMs }: { lastFailedAt: number; cooldownMs: number }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    const t0 = setTimeout(tick, 0);
    const t = setInterval(tick, 15000);
    return () => {
      clearTimeout(t0);
      clearInterval(t);
    };
  }, []);
  const elapsed = now == null ? 0 : now - lastFailedAt;
  const left = Math.max(0, cooldownMs - elapsed);
  if (left <= 0) return <span className="rounded-full bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">READY</span>;
  return (
    <span className="rounded-full bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300">
      retry in {Math.ceil(left / 60000)}m
    </span>
  );
}
