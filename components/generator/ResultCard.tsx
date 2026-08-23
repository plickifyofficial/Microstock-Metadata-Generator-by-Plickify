"use client";

import { useState } from "react";
import type { GenerationMode, GenerationResult, GeneratedMetadata } from "@/lib/types";

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for non-secure contexts.
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

export interface CardItem {
  id: string;
  filename: string;
  mode: GenerationMode;
  status: "pending" | "processing" | "done" | "error";
  error?: string;
  previewUrl?: string;
  // metadata result
  title: string;
  description: string;
  keywords: string[];
  category?: string;
  prompt?: string; // freepik extra
  baseModel?: string;
  // img2prompt result
  promptText?: string;
}

export function metadataToText(item: CardItem): string {
  if (item.mode === "img2prompt") {
    return `${item.filename}\n${item.promptText || ""}`;
  }
  return [
    `File: ${item.filename}`,
    `Title: ${item.title}`,
    `Description: ${item.description}`,
    `Keywords: ${item.keywords.join(", ")}`,
    item.category ? `Category: ${item.category}` : "",
    item.prompt ? `Prompt: ${item.prompt}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

interface Props {
  item: CardItem;
  onUpdate: (patch: Partial<CardItem>) => void;
  onRegenerate: () => void;
  onRemove: () => void;
}

export default function ResultCard({ item, onUpdate, onRegenerate, onRemove }: Props) {
  const [copied, setCopied] = useState<string | null>(null);

  async function doCopy(label: string, text: string) {
    const ok = await copyText(text);
    setCopied(ok ? label : "failed");
    setTimeout(() => setCopied(null), 1500);
  }

  const busy = item.status === "processing" || item.status === "pending";

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-surface dark:bg-surface p-4 sm:p-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {item.previewUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={item.previewUrl}
              alt={item.filename}
              className="h-12 w-12 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
            />
          ) : null}
          <div className="min-w-0">
            <p className="text-sm font-medium truncate" title={item.filename}>
              {item.filename}
            </p>
            <p className="text-xs">
              {item.status === "done" && (
                <span className="text-emerald-600 dark:text-emerald-400">
                  Done
                  {item.mode === "metadata"
                    ? ` - ${item.keywords.length} keywords`
                    : ` - ${(item.promptText || "").length} chars`}
                </span>
              )}
              {item.status === "processing" && (
                <span className="text-amber-600 dark:text-amber-400">Generating…</span>
              )}
              {item.status === "pending" && <span className="text-slate-500">Queued</span>}
              {item.status === "error" && (
                <span className="text-red-600 dark:text-red-400" title={item.error}>
                  Error{item.error ? ` - ${truncate(item.error, 80)}` : ""}
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {!busy && (
            <>
              <IconBtn
                title={item.status === "error" ? "Retry" : "Regenerate"}
                onClick={onRegenerate}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
                </svg>
              </IconBtn>
              <IconBtn title="Remove" onClick={onRemove}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </IconBtn>
            </>
          )}
          {busy && (
            <span
              className="h-5 w-5 animate-spin rounded-full border-2 border-brand border-t-transparent"
              aria-label="Processing"
            />
          )}
        </div>
      </div>

      {/* Fields */}
      {item.status !== "error" &&
        (item.mode === "img2prompt" ? (
          <div className="mt-4">
            <Field
              label={`Prompt (${(item.promptText || "").length} chars)`}
              value={item.promptText || ""}
              rows={6}
              disabled={busy}
              onChange={(v) => onUpdate({ promptText: v })}
              onCopy={() => doCopy("prompt", item.promptText || "")}
              copied={copied === "prompt"}
            />
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            <Field
              label={`Title (${item.title.length} chars)`}
              value={item.title}
              rows={2}
              disabled={busy}
              onChange={(v) => onUpdate({ title: v })}
              onCopy={() => doCopy("title", item.title)}
              copied={copied === "title"}
            />
            <Field
              label="Description"
              value={item.description}
              rows={3}
              disabled={busy}
              onChange={(v) => onUpdate({ description: v })}
              onCopy={() => doCopy("description", item.description)}
              copied={copied === "description"}
            />
            <Field
              label={`Keywords (${item.keywords.length})`}
              value={item.keywords.join(", ")}
              rows={2}
              disabled={busy}
              onChange={(v) =>
                onUpdate({
                  keywords: v
                    .split(",")
                    .map((k) => k.trim())
                    .filter(Boolean),
                })
              }
              onCopy={() => doCopy("keywords", item.keywords.join(", "))}
              copied={copied === "keywords"}
            />
            <Field
              label="Category"
              value={item.category || ""}
              rows={1}
              disabled={busy}
              onChange={(v) => onUpdate({ category: v })}
              onCopy={() => doCopy("category", item.category || "")}
              copied={copied === "category"}
            />
            {item.prompt !== undefined && (
              <Field
                label="Prompt"
                value={item.prompt || ""}
                rows={2}
                disabled={busy}
                onChange={(v) => onUpdate({ prompt: v })}
                onCopy={() => doCopy("fprompt", item.prompt || "")}
                copied={copied === "fprompt"}
              />
            )}
          </div>
        ))}

      {/* Footer actions */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => doCopy("all", metadataToText(item))}
          disabled={busy || item.status !== "done"}
          className="rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-40"
        >
          {copied === "all" ? "Copied!" : "Copy All"}
        </button>
        <button
          onClick={onRegenerate}
          disabled={busy}
          className="rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-40"
        >
          Regenerate
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  rows,
  disabled,
  onChange,
  onCopy,
  copied,
}: {
  label: string;
  value: string;
  rows: number;
  disabled?: boolean;
  onChange: (value: string) => void;
  onCopy: () => void;
  copied?: boolean;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {label}
        </label>
        <button
          onClick={onCopy}
          disabled={disabled || !value}
          className="text-xs text-brand font-medium hover:underline disabled:opacity-40"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <textarea
        value={value}
        rows={rows}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 disabled:opacity-60 resize-y"
      />
    </div>
  );
}

function IconBtn({
  title,
  onClick,
  children,
}: {
  title: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      aria-label={title}
      className="rounded-lg p-1.5 text-slate-500 hover:text-brand hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
    >
      {children}
    </button>
  );
}

function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

// Re-export so callers can build typed results.
export type { GenerationResult, GeneratedMetadata };
