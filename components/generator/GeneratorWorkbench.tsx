"use client";

import { useCallback, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Dropzone from "@/components/generator/Dropzone";
import ResultCard from "@/components/generator/ResultCard";
import { prepareImage } from "@/lib/client/image";
import {
  addToHistory,
  clearHistory,
  formatTime,
  getHistoryServerSnapshot,
  getHistorySnapshot,
  subscribeHistory,
} from "@/lib/client/history";
import { PLATFORMS, buildCSV, buildJSON, buildTXT, type CsvRow } from "@/lib/csv/formats";
import type { GenerationResult, GeneratorSettings } from "@/lib/types";

interface WorkItem extends GenerationResult {
  previewUrl: string;
  platform: string;
}

const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/bmp"];

export default function GeneratorWorkbench({ settings }: { settings: GeneratorSettings }) {
  const [items, setItems] = useState<WorkItem[]>([]);
  const [platform, setPlatform] = useState("general");
  const [running, setRunning] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const history = useSyncExternalStore(
    subscribeHistory,
    getHistorySnapshot,
    getHistoryServerSnapshot
  );
  const idCounter = useRef(0);

  const doneItems = useMemo(() => items.filter((i) => i.status === "done"), [items]);
  const canExport = doneItems.length > 0;

  /* ------------------------------------------------------------------ */
  /* File intake                                                         */
  /* ------------------------------------------------------------------ */

  const addFiles = useCallback(
    (files: File[]) => {
      setItems((prev) => {
        const capacity = settings.max_images_per_batch - prev.length;
        if (capacity <= 0) return prev;
        const accepted = files.filter((f) => ACCEPTED.includes(f.type)).slice(0, capacity);
        return [
          ...prev,
          ...accepted.map((file) => ({
            id: `img_${Date.now()}_${idCounter.current++}`,
            filename: file.name,
            title: "",
            description: "",
            keywords: [],
            category: "",
            status: "pending" as const,
            previewUrl: URL.createObjectURL(file),
            platform,
          })),
        ];
      });
    },
    [settings.max_images_per_batch, platform]
  );

  function updateItem(id: string, patch: Partial<WorkItem>) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }

  function removeItem(id: string) {
    setItems((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((i) => i.id !== id);
    });
  }

  function clearAll() {
    if (running || items.length === 0) return;
    setItems([]);
  }

  /* ------------------------------------------------------------------ */
  /* Generation                                                          */
  /* ------------------------------------------------------------------ */

  async function generateOne(item: WorkItem): Promise<void> {
    updateItem(item.id, { status: "processing", error: undefined });
    try {
      const blob = await fetch(item.previewUrl).then((r) => r.blob());
      const file = new File([blob], item.filename, { type: blob.type || "image/jpeg" });
      const prepared = await prepareImage(file);
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: item.filename,
          mimeType: prepared.mimeType,
          imageBase64: prepared.base64,
          platform,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || `Request failed (${res.status})`);

      const meta = json.metadata as Required<GenerationResult>;
      updateItem(item.id, {
        status: "done",
        title: meta.title ?? "",
        description: meta.description ?? "",
        keywords: Array.isArray(meta.keywords) ? meta.keywords : [],
        category: meta.category ?? "",
      });

      addToHistory({
        id: item.id,
        filename: item.filename,
        title: meta.title ?? "",
        description: meta.description ?? "",
        keywords: Array.isArray(meta.keywords) ? meta.keywords : [],
        category: meta.category ?? "",
      });
    } catch (err) {
      updateItem(item.id, {
        status: "error",
        error: err instanceof Error ? err.message : "Generation failed.",
      });
    }
  }

  async function generateAll() {
    if (running) return;
    const pending = items.filter((i) => i.status === "pending");
    if (pending.length === 0) return;

    setRunning(true);
    // Sequential to stay inside provider rate limits.
    for (const item of pending) {
      // Re-read latest state for this item before generating.
      let current = item;
      setItems((prev) => {
        const found = prev.find((i) => i.id === item.id);
        if (found) current = found;
        return prev;
      });
      await generateOne(current);
    }
    setRunning(false);
  }

  async function regenerate(id: string) {
    const item = items.find((i) => i.id === id);
    if (!item || running) return;
    await generateOne(item);
  }

  /* ------------------------------------------------------------------ */
  /* Export                                                              */
  /* ------------------------------------------------------------------ */

  function exportRows(): CsvRow[] {
    return doneItems.map((item) => ({
      filename: item.filename,
      title: item.title,
      description: item.description,
      keywords: item.keywords,
      category: item.category || "",
    }));
  }

  function download(content: string, filename: string, mime: string) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function exportAs(format: "csv" | "json" | "txt") {
    if (!canExport) return;
    const rows = exportRows();
    const stamp = new Date().toISOString().slice(0, 10);
    if (format === "csv") download(buildCSV(platform, rows), `metadata-${stamp}.csv`, "text/csv;charset=utf-8");
    else if (format === "json") download(buildJSON(rows), `metadata-${stamp}.json`, "application/json;charset=utf-8");
    else download(buildTXT(rows), `metadata-${stamp}.txt`, "text/plain;charset=utf-8");
  }

  /* ------------------------------------------------------------------ */
  /* Render                                                              */
  /* ------------------------------------------------------------------ */

  return (
    <div className="space-y-6">
      {/* Controls bar */}
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label htmlFor="platform" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Export platform template
          </label>
          <select
            id="platform"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="rounded-lg border border-slate-300 dark:border-slate-700 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50"
          >
            {PLATFORMS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={generateAll}
          disabled={running || !items.some((i) => i.status === "pending")}
          className="rounded-lg bg-brand px-5 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-40"
        >
          {running ? "Generating…" : "Generate Metadata"}
        </button>
        <button
          onClick={clearAll}
          disabled={running || items.length === 0}
          className="rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-40"
        >
          Clear All
        </button>
      </div>

      <Dropzone onFiles={addFiles} disabled={running} maxFiles={settings.max_images_per_batch} />

      {items.length > settings.max_images_per_batch - 1 && (
        <p className="text-sm text-amber-600 dark:text-amber-400">
          Batch limit reached ({settings.max_images_per_batch} images).
        </p>
      )}

      {/* Results */}
      {items.length > 0 && (
        <div className="space-y-4">
          {items.map((item) => (
            <ResultCard
              key={item.id}
              item={item}
              onUpdate={(patch) => updateItem(item.id, patch)}
              onRegenerate={() => regenerate(item.id)}
              onRemove={() => removeItem(item.id)}
            />
          ))}
        </div>
      )}

      {/* Export */}
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm self-center text-slate-500 dark:text-slate-400">Export ({doneItems.length} ready):</span>
          <ExportBtn label="Download CSV" onClick={() => exportAs("csv")} disabled={!canExport} primary />
          <ExportBtn label="JSON" onClick={() => exportAs("json")} disabled={!canExport} />
          <ExportBtn label="TXT" onClick={() => exportAs("txt")} disabled={!canExport} />
        </div>
      )}

      {/* Local history */}
      {history.length > 0 && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setShowHistory((v) => !v)}
            className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold"
          >
            Recent generations (stored locally in your browser)
            <span>{showHistory ? "▲" : "▼"}</span>
          </button>
          {showHistory && (
            <div className="border-t border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 max-h-80 overflow-y-auto">
              {history.map((h) => (
                <div key={`${h.savedAt}-${h.filename}`} className="px-4 py-3 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium truncate">{h.filename}</span>
                    <span className="text-xs text-slate-400 shrink-0">{formatTime(h.savedAt)}</span>
                  </div>
                  <p className="mt-1 text-slate-600 dark:text-slate-400 line-clamp-1">{h.title}</p>
                </div>
              ))}
              <div className="px-4 py-2">
                <button
                  onClick={() => clearHistory()}
                  className="text-xs text-red-600 dark:text-red-400 hover:underline"
                >
                  Clear history
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ExportBtn({
  label,
  onClick,
  disabled,
  primary,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  primary?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg px-4 py-2 text-sm font-semibold transition-opacity disabled:opacity-40 ${
        primary
          ? "bg-brand text-white hover:opacity-90"
          : "border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
      }`}
    >
      {label}
    </button>
  );
}
