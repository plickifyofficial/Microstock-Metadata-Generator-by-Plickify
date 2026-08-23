"use client";

import { useState } from "react";

export interface DeveloperInfo {
  name: string;
  website: string;
  facebook: string;
}

/**
 * CSV Tree-style developer item in the nav: a small icon button that
 * opens a modern popup with the developer brand and links.
 */
export default function DeveloperMenu({ dev }: { dev: DeveloperInfo }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title={`Developer: ${dev.name}`}
        aria-label={`Developer: ${dev.name}`}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        {/* Code brackets - developer icon */}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4 text-slate-500 dark:text-slate-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
        </svg>
      </button>

      {/* Modern popup */}
      {open ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" role="dialog" aria-modal>
          <button
            aria-hidden
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-default"
          />
          <div className="relative w-full max-w-sm rounded-2xl bg-background border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            {/* Brand header */}
            <div className="relative px-8 pt-9 pb-7 text-center">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(300px circle at 50% 0%, color-mix(in srgb, var(--brand) 14%, transparent), transparent)",
                }}
              />
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="absolute top-3 right-3 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
              </button>

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/plickify-logo.png"
                alt={dev.name}
                className="relative mx-auto h-14 w-auto drop-shadow-lg"
              />
              <p className="relative mt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                Developed by
              </p>
              <h2 className="relative mt-0.5 text-xl font-extrabold">{dev.name}</h2>
            </div>

            {/* Links */}
            <div className="px-6 pb-7 space-y-2.5">
              <a
                href={dev.website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918" /></svg>
                Visit plickifyacademy.com
              </a>
              <a
                href={dev.facebook}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-3 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-[#1877F2]"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047v-2.66c0-3.026 1.792-4.697 4.533-4.697 1.313 0 2.686.236 2.686.236v2.97H15.83c-1.491 0-1.956.93-1.956 1.886v2.265h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073Z" /></svg>
                Follow on Facebook
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
