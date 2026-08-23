"use client";

import { useEffect, useState } from "react";

export interface DeveloperInfo {
  name: string;
  website: string;
  facebook: string;
}

/**
 * CSV Tree-style developer item in the nav: a small icon button that
 * opens a friendly, modern popup with the developer brand and links.
 */
export default function DeveloperMenu({ dev }: { dev: DeveloperInfo }) {
  const [open, setOpen] = useState(false);
  const [logoOk, setLogoOk] = useState(true);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title={`Developer: ${dev.name}`}
        aria-label={`Developer: ${dev.name}`}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4 text-slate-500 dark:text-slate-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
        </svg>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Developer: ${dev.name}`}
        >
          {/* Backdrop */}
          <button
            aria-hidden
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="mm-fade-in absolute inset-0 bg-black/45 backdrop-blur-[2px] cursor-default"
          />

          {/* Card */}
          <div className="mm-pop-in relative w-full max-w-xs rounded-3xl border border-slate-200 dark:border-slate-800 bg-background shadow-2xl overflow-hidden">
            {/* Top brand band */}
            <div className="relative px-7 pt-8 pb-6 text-center">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-32"
                style={{
                  background:
                    "linear-gradient(to bottom, color-mix(in srgb, var(--brand) 10%, transparent), transparent)",
                }}
              />
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="absolute top-3 right-3 rounded-full p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Logo with graceful fallback */}
              <div className="relative mx-auto h-16 w-16 rounded-2xl bg-white dark:bg-white/95 shadow-lg ring-1 ring-black/5 grid place-items-center overflow-hidden">
                {logoOk ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src="/plickify-logo.png"
                    alt={dev.name}
                    className="max-h-12 max-w-12 object-contain p-1"
                    onError={() => setLogoOk(false)}
                  />
                ) : (
                  <span className="text-2xl font-extrabold text-brand">P</span>
                )}
              </div>

              <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                Developed by
              </p>
              <h2 className="mt-0.5 text-lg font-extrabold tracking-tight">{dev.name}</h2>
            </div>

            {/* Links */}
            <div className="px-5 pb-6 space-y-2">
              <a
                href={dev.website}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 hover:border-brand hover:bg-brand/5 transition-all"
              >
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918" /></svg>
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-semibold">Website</span>
                  <span className="block text-xs text-slate-500 truncate">plickifyacademy.com</span>
                </span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3.5 w-3.5 text-slate-400 group-hover:text-brand transition-transform group-hover:translate-x-0.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </a>

              <a
                href={dev.facebook}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 hover:border-[#1877F2] hover:bg-[#1877F2]/5 transition-all"
              >
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#1877F2]/10 text-[#1877F2]">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047v-2.66c0-3.026 1.792-4.697 4.533-4.697 1.313 0 2.686.236 2.686.236v2.97H15.83c-1.491 0-1.956.93-1.956 1.886v2.265h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073Z" /></svg>
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-semibold">Facebook</span>
                  <span className="block text-xs text-slate-500 truncate">fb.com/plickify</span>
                </span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#1877F2] transition-transform group-hover:translate-x-0.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
