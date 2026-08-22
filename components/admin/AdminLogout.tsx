"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminLogout({ compact }: { compact?: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={logout}
      disabled={loading}
      className={`text-sm font-medium text-left rounded-lg transition-colors ${
        compact
          ? "px-4 py-2 border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40"
          : "px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
      }`}
    >
      {loading ? "Signing out…" : "Sign out"}
    </button>
  );
}
