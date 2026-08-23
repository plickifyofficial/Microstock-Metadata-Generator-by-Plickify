"use client";

import { useEffect, useRef, useState } from "react";

export interface DeveloperInfo {
  name: string;
  website: string;
  facebook: string;
}

/**
 * CSV Tree-style developer item in the nav: a small icon button whose
 * popup opens directly beneath it as a compact dropdown.
 */
export default function DeveloperMenu({ dev }: { dev: DeveloperInfo }) {
  const [open, setOpen] = useState(false);
  const [logoOk, setLogoOk] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={rootRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        title={`Developer: ${dev.name}`}
        aria-label={`Developer: ${dev.name}`}
        aria-expanded={open}
        className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${
          open
            ? "border-brand bg-brand/10"
            : "border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className={`h-4 w-4 ${open ? "text-brand" : "text-slate-500 dark:text-slate-400"}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
        </svg>
      </button>

      {open ? (
        <div className="mm-pop-in absolute right-0 top-full mt-2 w-64 rounded-2xl border border-slate-200 dark:border-slate-800 bg-background shadow-2xl z-50 overflow-hidden">
          {/* Brand header */}
          <div className="relative px-4 pt-4 pb-4 text-center border-b border-slate-100 dark:border-slate-800">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-full"
              style={{
                background:
                  "linear-gradient(to bottom, color-mix(in srgb, var(--brand) 8%, transparent), transparent)",
              }}
            />
            <div className="relative mx-auto h-12 w-12 rounded-xl bg-white dark:bg-white/95 shadow-md ring-1 ring-black/5 grid place-items-center overflow-hidden">
              {logoOk ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src="/plickify-logo.png"
                  alt={dev.name}
                  className="max-h-10 max-w-10 object-contain p-1"
                  onError={() => setLogoOk(false)}
                />
              ) : (
                <span className="text-xl font-extrabold text-brand">P</span>
              )}
            </div>
            <p className="relative mt-2.5 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Developed by
            </p>
            <p className="relative text-sm font-extrabold">{dev.name}</p>
          </div>

          {/* Links */}
          <div className="p-2 space-y-1">
            <a
              href={dev.website}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-2.5 rounded-xl px-3 py-2 hover:bg-brand/5 transition-colors"
            >
              <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-3.5 w-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918" /></svg>
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-xs font-semibold">Website</span>
                <span className="block text-[11px] text-slate-500 truncate">plickifyacademy.com</span>
              </span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3 w-3 text-slate-400 group-hover:text-brand group-hover:translate-x-0.5 transition-all">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </a>

            <a
              href={dev.facebook}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-2.5 rounded-xl px-3 py-2 hover:bg-[#1877F2]/5 transition-colors"
            >
              <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#1877F2]/10 text-[#1877F2]">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047v-2.66c0-3.026 1.792-4.697 4.533-4.697 1.313 0 2.686.236 2.686.236v2.97H15.83c-1.491 0-1.956.93-1.956 1.886v2.265h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073Z" /></svg>
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-xs font-semibold">Facebook</span>
                <span className="block text-[11px] text-slate-500 truncate">fb.com/plickify</span>
              </span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3 w-3 text-slate-400 group-hover:text-[#1877F2] group-hover:translate-x-0.5 transition-all">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
}
