"use client";

import type { GeneratedMetadata } from "@/lib/types";

export interface HistoryEntry extends GeneratedMetadata {
  id: string;
  filename: string;
  savedAt: number;
}

const KEY = "mmg-history-v1";
const MAX_ENTRIES = 50;
const EVENT = "mmg-history-change";

/* External store so components can use useSyncExternalStore (no
   setState-in-effect, SSR-safe). */

let snapshotCache: HistoryEntry[] | null = null;
const listeners = new Set<() => void>();

export function subscribeHistory(cb: () => void) {
  listeners.add(cb);
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

export function getHistorySnapshot(): HistoryEntry[] {
  if (!snapshotCache) snapshotCache = loadHistory();
  return snapshotCache;
}

export function getHistoryServerSnapshot(): HistoryEntry[] {
  return EMPTY;
}
const EMPTY: HistoryEntry[] = [];

export function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.slice(0, MAX_ENTRIES) : [];
  } catch {
    return [];
  }
}

/** Prepends an entry and persists. */
export function addToHistory(entry: Omit<HistoryEntry, "savedAt">): void {
  const list = [{ ...entry, savedAt: Date.now() }, ...loadHistory()].slice(0, MAX_ENTRIES);
  persist(list);
}

export function clearHistory(): void {
  persist([]);
}

function persist(list: HistoryEntry[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // Storage full/blocked - history is best-effort only.
  }
  snapshotCache = null;
  window.dispatchEvent(new Event(EVENT));
}

export function formatTime(ts: number): string {
  return new Date(ts).toLocaleString();
}
