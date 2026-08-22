"use client";

import { useCallback, useSyncExternalStore } from "react";

type Mode = "light" | "dark" | "system";

const KEY = "mmg-theme";
const EVENT = "mmg-theme-change";

function getSnapshot(): Mode {
  try {
    const stored = localStorage.getItem(KEY);
    return stored === "light" || stored === "dark" || stored === "system"
      ? stored
      : "system";
  } catch {
    return "system";
  }
}

function getServerSnapshot(): Mode {
  return "system";
}

const listeners = new Set<() => void>();

function apply(mode: Mode) {
  const dark =
    mode === "dark" ||
    (mode === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

export default function ThemeToggle() {
  const mode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const change = useCallback((next: Mode) => {
    try {
      localStorage.setItem(KEY, next);
      listeners.forEach((l) => l());
      window.dispatchEvent(new Event(EVENT));
    } catch {}
    apply(next);
  }, []);

  return (
    <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden text-xs">
      {(["light", "dark", "system"] as Mode[]).map((m) => (
        <button
          key={m}
          onClick={() => change(m)}
          title={`Theme: ${m}`}
          aria-label={`Theme: ${m}`}
          className={`px-2 py-1.5 capitalize transition-colors ${
            mode === m
              ? "bg-brand text-white"
              : "hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          {m === "light" ? "Light" : m === "dark" ? "Dark" : "Auto"}
        </button>
      ))}
    </div>
  );
}
