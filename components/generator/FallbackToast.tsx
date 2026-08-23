"use client";

import { useEffect } from "react";

/**
 * Transient bottom-right toast used for auto-fallback notifications
 * ("Groq failed - switching to Gemini...") - CSV Tree behaviour.
 */
export default function FallbackToast({
  message,
  onDone,
}: {
  message: string | null;
  onDone: () => void;
}) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onDone, 4000);
    return () => clearTimeout(t);
  }, [message, onDone]);

  if (!message) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-xs rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/80 px-4 py-3 shadow-lg text-sm text-amber-800 dark:text-amber-200 flex items-start gap-2 backdrop-blur">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4 mt-0.5 shrink-0">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
      </svg>
      <span>{message}</span>
    </div>
  );
}
