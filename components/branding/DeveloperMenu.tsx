"use client";

import { useState } from "react";

export interface DeveloperInfo {
  name: string;
  website: string;
  facebook: string;
}

/**
 * CSV Tree-style developer dropdown in the header: brand mark + links to
 * the developer website and Facebook page. Values come from the server
 * (license module) - not editable from the Admin Panel.
 */
export default function DeveloperMenu({ dev }: { dev: DeveloperInfo }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        title="Developer"
        aria-label="Developer"
        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 px-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        {/* Plickify mark */}
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-brand to-brand-secondary text-[10px] font-extrabold text-white">
          P
        </span>
        <span className="hidden sm:inline text-xs font-semibold">Developer</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3 w-3 text-slate-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open ? (
        <>
          <button aria-hidden tabIndex={-1} onClick={() => setOpen(false)} className="fixed inset-0 z-40 cursor-default" />
          <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-slate-200 dark:border-slate-800 bg-background shadow-xl z-50 overflow-hidden">
            <div className="px-4 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-secondary text-lg font-extrabold text-white shadow">
                P
              </span>
              <div>
                <p className="text-sm font-bold">{dev.name}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Developer &amp; Maintainer</p>
              </div>
            </div>
            <div className="py-1">
              <a
                href={dev.website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4 text-brand"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918" /></svg>
                {dev.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
              </a>
              <a
                href={dev.facebook}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-[#1877F2]"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047v-2.66c0-3.026 1.792-4.697 4.533-4.697 1.313 0 2.686.236 2.686.236v2.97H15.83c-1.491 0-1.956.93-1.956 1.886v2.265h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073Z" /></svg>
                facebook.com/plickify
              </a>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
