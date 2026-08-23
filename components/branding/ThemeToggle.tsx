"use client";

import { useCallback, useEffect, useState } from "react";

const KEY = "mmg-theme";
const EVENT = "mmg-theme-change";

function apply(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
}

/**
 * Single-icon theme toggle reflecting the current state:
 * sun = light mode active, moon = dark mode active.
 */
export default function ThemeToggle() {
  const [dark, setDark] = useState<boolean | null>(null); // null = not mounted

  useEffect(() => {
    const read = () =>
      setDark(document.documentElement.classList.contains("dark"));
    read();
    window.addEventListener(EVENT, read);
    return () => window.removeEventListener(EVENT, read);
  }, []);

  const toggle = useCallback(() => {
    if (document.documentElement.classList.contains("dark")) {
      apply(false);
      try {
        localStorage.setItem(KEY, "light");
      } catch {}
      setDark(false);
    } else {
      apply(true);
      try {
        localStorage.setItem(KEY, "dark");
      } catch {}
      setDark(true);
    }
    window.dispatchEvent(new Event(EVENT));
  }, []);

  if (dark === null) {
    return <span className="inline-block h-9 w-9" aria-hidden />;
  }

  return (
    <button
      onClick={toggle}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
    >
      {dark ? (
        /* Sun - currently dark, click for light */
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4.5 w-4.5 text-amber-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
        </svg>
      ) : (
        /* Moon - currently light, click for dark */
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4.5 w-4.5 text-slate-600 dark:text-slate-300">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
        </svg>
      )}
    </button>
  );
}
