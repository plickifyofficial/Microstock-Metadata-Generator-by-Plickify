"use client";

import { useState } from "react";
import { PROVIDER_TUTORIALS, type TutorialStep } from "@/lib/data/providerTutorials";

const LANGS = [
  { id: "en", label: "English" },
  { id: "bn", label: "বাংলা" },
] as const;

type LangId = (typeof LANGS)[number]["id"];

/**
 * CSV Tree-style step-by-step tutorial for obtaining an API key,
 * available in English and Bengali.
 */
export default function HowToGetApiModal({
  open,
  providerId,
  onClose,
}: {
  open: boolean;
  providerId: string | null;
  providerName?: string;
  onClose: () => void;
}) {
  const [lang, setLang] = useState<LangId>("en");
  if (!open) return null;

  const tutorial = providerId ? PROVIDER_TUTORIALS[providerId] : null;

  if (!tutorial) {
    return (
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" role="dialog" aria-modal>
        <button aria-hidden tabIndex={-1} onClick={onClose} className="absolute inset-0 bg-black/60 cursor-default" />
        <div className="relative w-full max-w-md rounded-2xl bg-background border border-slate-200 dark:border-slate-800 p-8 text-center text-sm">
          No tutorial available for this provider yet - see the official docs.
          <button onClick={onClose} className="mt-4 block mx-auto rounded-lg bg-brand px-4 py-2 font-semibold text-white">Close</button>
        </div>
      </div>
    );
  }

  const t = tutorial[lang];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" role="dialog" aria-modal>
      <button aria-hidden tabIndex={-1} onClick={onClose} className="absolute inset-0 bg-black/60 cursor-default" />
      <div className="relative w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-2xl bg-background border border-slate-200 dark:border-slate-800 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 bg-brand/5 dark:bg-brand/10 px-5 py-4 backdrop-blur">
          <div className="min-w-0 flex items-center gap-3">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand text-white">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4.5 w-4.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-brand truncate">How to get your API key</p>
              <h2 className="text-base font-bold truncate">{tutorial.name}</h2>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {/* Language switcher */}
            <div className="flex items-center p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 mr-1">
              {LANGS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setLang(l.id)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors ${
                    lang === l.id ? "bg-brand text-white" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
            <button onClick={onClose} aria-label="Close" className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* Summary */}
          <p className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {t.summary}
          </p>

          {/* Key format */}
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold">{lang === "bn" ? "Key format:" : "Key format:"}</span>
            <code className="rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs">{t.keyHint}</code>
          </div>

          {/* Steps */}
          <ol className="space-y-3">
            {t.steps.map((step: TutorialStep, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/15 text-[11px] font-bold text-brand">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{step.title}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{step.body}</p>
                  {step.link ? (
                    <a
                      href={step.link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline"
                    >
                      {step.link.label}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3 w-3"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                    </a>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>

          {/* Notes */}
          {t.notes.length > 0 ? (
            <div className="rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-950/30 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 mb-2">
                {lang === "bn" ? "মনে রাখবেন" : "Good to know"}
              </p>
              <ul className="space-y-1.5 list-disc list-inside text-sm text-amber-800 dark:text-amber-200/90">
                {t.notes.map((n, i) => (
                  <li key={i}>{n}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* Dashboard CTA */}
          <a
            href={tutorial.dashUrl}
            target="_blank"
            rel="noreferrer"
            className="block w-full rounded-lg bg-brand py-3 text-center text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          >
            {lang === "bn" ? "Dashboard খুলুন" : "Open dashboard"} →
          </a>
        </div>
      </div>
    </div>
  );
}
