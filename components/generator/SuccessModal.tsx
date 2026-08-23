"use client";

import type { GenerationMode } from "@/lib/types";

interface Props {
  open: boolean;
  onClose: () => void;
  count: number;
  failedCount: number;
  mode: GenerationMode;
  onDownloadCsv: () => void;
  onDownloadTxt?: () => void;
}

/**
 * Post-batch success popup (CSV Tree parity): confirms the batch finished
 * and offers the correct downloads - metadata exports CSV only,
 * prompt exports CSV + TXT.
 */
export default function SuccessModal({
  open,
  onClose,
  count,
  failedCount,
  mode,
  onDownloadCsv,
  onDownloadTxt,
}: Props) {
  if (!open) return null;

  const title = mode === "img2prompt" ? "Prompts Generated!" : "Metadata Generated!";
  const subtitle =
    count > 0
      ? `Successfully generated ${count} ${count === 1 ? (mode === "img2prompt" ? "prompt" : "metadata") : mode === "img2prompt" ? "prompts" : "metadata items"}.`
      : "Batch finished.";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal>
      <button aria-hidden tabIndex={-1} onClick={onClose} className="absolute inset-0 bg-black/50 cursor-default" />
      <div className="relative w-full max-w-sm rounded-2xl bg-background border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Header band */}
        <div className="bg-brand px-6 py-5 text-white text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/20 mb-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} className="h-7 w-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </span>
          <h2 className="text-lg font-bold">{title}</h2>
          <p className="text-xs text-white/85 mt-0.5">{subtitle}</p>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {failedCount > 0 ? (
            <p className="rounded-lg bg-amber-50 dark:bg-amber-950/40 px-3 py-2 text-xs text-amber-700 dark:text-amber-300 text-center">
              {failedCount} item{failedCount > 1 ? "s" : ""} failed even after retry. Regenerate them individually from the cards below.
            </p>
          ) : null}

          <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Download
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              <button
                onClick={() => {
                  onDownloadCsv();
                  onClose();
                }}
                disabled={count === 0}
                className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-40"
              >
                {mode === "img2prompt" ? "all-prompts.csv" : "Download CSV"}
              </button>
              {mode === "img2prompt" && onDownloadTxt ? (
                <button
                  onClick={() => {
                    onDownloadTxt();
                    onClose();
                  }}
                  disabled={count === 0}
                  className="rounded-lg border border-slate-300 dark:border-slate-600 px-5 py-2.5 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-40"
                >
                  all-prompts.txt
                </button>
              ) : null}
            </div>
            <p className="mt-3 text-[11px] text-slate-400">
              You can still download later from the toolbar.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full rounded-lg py-2 text-sm font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
