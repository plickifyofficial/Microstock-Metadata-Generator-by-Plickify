"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AdminRow {
  id: string;
  user_id: string;
  email: string;
  name: string | null;
  status: string;
  created_at: string;
}

export default function AdminsManager({ currentEmail }: { currentEmail: string }) {
  const router = useRouter();
  const [rows, setRows] = useState<AdminRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/admins");
      const json = await res.json();
      if (res.ok) setRows(json.admins ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Deferred so the fetch's setState calls happen in a callback, not
    // synchronously within the effect body.
    const t = setTimeout(() => void refresh(), 0);
    return () => clearTimeout(t);
  }, [refresh]);

  async function addAdmin(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to add admin.");
      setEmail("");
      setMessage({ ok: true, text: "Admin added." });
      await refresh();
      router.refresh();
    } catch (err) {
      setMessage({ ok: false, text: err instanceof Error ? err.message : "Failed." });
    } finally {
      setBusy(false);
    }
  }

  async function setStatus(row: AdminRow, status: "active" | "disabled") {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/admins", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: row.id, status }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed.");
      await refresh();
      router.refresh();
    } catch (err) {
      setMessage({ ok: false, text: err instanceof Error ? err.message : "Failed." });
    } finally {
      setBusy(false);
    }
  }

  async function remove(row: AdminRow) {
    if (!confirm(`Remove ${row.email} from admins?`)) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/admins", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: row.id }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed.");
      await refresh();
      router.refresh();
    } catch (err) {
      setMessage({ ok: false, text: err instanceof Error ? err.message : "Failed." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Add form */}
      <form onSubmit={addAdmin} className="rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Add admin by Google email
          </span>
          <div className="flex gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="person@gmail.com"
              className="flex-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50"
            />
            <button
              type="submit"
              disabled={busy}
              className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
            >
              Add
            </button>
          </div>
        </label>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          The person must have signed in with Google at least once so their account exists.
        </p>
        {message ? (
          <p
            className={`rounded-lg px-3 py-2 text-sm ${
              message.ok
                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300"
                : "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300"
            }`}
          >
            {message.text}
          </p>
        ) : null}
      </form>

      {/* List */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-sm">
          <thead className="bg-surface dark:bg-surface text-left text-xs uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Added</th>
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {loading ? (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-slate-500">Loading…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-slate-500">No admins yet.</td></tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id}>
                  <td className="px-4 py-3">
                    {row.email}
                    {row.email.toLowerCase() === currentEmail.toLowerCase() ? (
                      <span className="ml-2 rounded-full bg-brand/15 px-2 py-0.5 text-[10px] font-bold text-brand">YOU</span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-medium ${row.status === "active" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap" suppressHydrationWarning>
                    {new Date(row.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2 text-xs">
                      {row.status === "active" ? (
                        <button onClick={() => setStatus(row, "disabled")} disabled={busy} className="text-amber-600 hover:underline disabled:opacity-40">
                          Disable
                        </button>
                      ) : (
                        <button onClick={() => setStatus(row, "active")} disabled={busy} className="text-emerald-600 hover:underline disabled:opacity-40">
                          Enable
                        </button>
                      )}
                      <button onClick={() => remove(row)} disabled={busy} className="text-red-600 hover:underline disabled:opacity-40">
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
