"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const SEEN_KEY = "mmg-seen-version";

/**
 * CSV Tree-style updates bell: dot badge when a newer version exists than
 * the one last acknowledged, popover with the highlights and a link to the
 * full changelog page.
 */
export default function UpdateBell({ latestVersion, latestTitle }: { latestVersion: string; latestTitle: string }) {
  const [open, setOpen] = useState(false);
  const [seen, setSeen] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        setSeen(localStorage.getItem(SEEN_KEY) || "0.0.0");
      } catch {
        setSeen("0.0.0");
      }
    }, 0);
    return () => clearTimeout(t);
  }, []);

  function markSeen() {
    try {
      localStorage.setItem(SEEN_KEY, latestVersion);
    } catch {}
    setSeen(latestVersion);
  }

  const unseen =
    seen !== null &&
    seen !== latestVersion &&
    versionCompare(latestVersion, seen) > 0;

  return (
    <div className="relative">
      <button
        onClick={() => {
          setOpen((v) => !v);
          if (!open && unseen) markSeen();
        }}
        title="Updates"
        aria-label="Updates"
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4 text-slate-500 dark:text-slate-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
        </svg>
        {unseen ? (
          <span className="absolute -top-0.5 -right-0.5 inline-flex h-3 w-3 rounded-full bg-brand ring-2 ring-background animate-pulse" />
        ) : null}
      </button>

      {open ? (
        <>
          <button
            aria-hidden
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default"
          />
          <div className="mm-pop-in absolute right-0 top-full mt-2 w-72 rounded-xl border border-slate-200 dark:border-slate-800 bg-background shadow-2xl z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Latest update
              </p>
              <span className="rounded-full bg-brand/15 px-2 py-0.5 text-[10px] font-bold text-brand">
                v{latestVersion}
              </span>
            </div>
            <div className="px-4 py-3">
              <p className="text-sm font-semibold">{latestTitle}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                See the full changelog for bug fixes, SQL migrations and any
                action your site needs.
              </p>
            </div>
            <Link
              href="/updates"
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 border-t border-slate-100 dark:border-slate-800 text-sm font-semibold text-brand hover:bg-brand/5 transition-colors"
            >
              View all updates →
            </Link>
          </div>
        </>
      ) : null}
    </div>
  );
}

function versionCompare(a: string, b: string): number {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < 3; i++) {
    const d = (pa[i] || 0) - (pb[i] || 0);
    if (d !== 0) return d;
  }
  return 0;
}
