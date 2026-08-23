"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Post {
  id: number;
  title: string;
  body: string;
  link_url: string | null;
  link_label: string | null;
  pinned: boolean;
  created_at: string;
}

const EMPTY_FORM = { title: "", body: "", link_url: "", link_label: "", pinned: false };

export default function SocialManager() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/social");
      const json = await res.json();
      if (res.ok) setPosts(json.posts ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => void refresh(), 0);
    return () => clearTimeout(t);
  }, [refresh]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/social", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingId ? { ...form, id: editingId } : form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Save failed.");
      setForm(EMPTY_FORM);
      setEditingId(null);
      setMessage({ ok: true, text: editingId ? "Post updated." : "Post published to the Community feed." });
      await refresh();
      router.refresh();
    } catch (err) {
      setMessage({ ok: false, text: err instanceof Error ? err.message : "Failed." });
    } finally {
      setBusy(false);
    }
  }

  function startEdit(p: Post) {
    setEditingId(p.id);
    setForm({
      title: p.title,
      body: p.body,
      link_url: p.link_url || "",
      link_label: p.link_label || "",
      pinned: p.pinned,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function remove(p: Post) {
    if (!confirm("Delete this post?")) return;
    setBusy(true);
    try {
      await fetch("/api/admin/social", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: p.id }),
      });
      await refresh();
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function togglePin(p: Post) {
    setBusy(true);
    try {
      await fetch("/api/admin/social", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: p.id, pinned: !p.pinned }),
      });
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Editor */}
      <form onSubmit={submit} className="rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">{editingId ? `Edit post #${editingId}` : "New post"}</h2>
          {editingId ? (
            <button
              type="button"
              onClick={() => { setEditingId(null); setForm(EMPTY_FORM); }}
              className="text-xs text-slate-500 hover:underline"
            >
              Cancel edit
            </button>
          ) : null}
        </div>
        <input
          required
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          placeholder="Post title, e.g. Adobe Stock keyword rules changed"
          maxLength={150}
          className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50"
        />
        <textarea
          required
          rows={5}
          value={form.body}
          onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
          placeholder="Write the update... (blank line = new paragraph)"
          className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50"
        />
        <div className="grid gap-3 sm:grid-cols-[1fr_160px]">
          <input
            value={form.link_url}
            onChange={(e) => setForm((f) => ({ ...f, link_url: e.target.value }))}
            placeholder="Optional link URL (https://...)"
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50"
          />
          <input
            value={form.link_label}
            onChange={(e) => setForm((f) => ({ ...f, link_label: e.target.value }))}
            placeholder="Link label"
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50"
          />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.pinned}
            onChange={(e) => setForm((f) => ({ ...f, pinned: e.target.checked }))}
            className="h-4 w-4 accent-[var(--brand)]"
          />
          Pin to top of the feed
        </label>

        {message ? (
          <p className={`rounded-lg px-3 py-2 text-sm ${
            message.ok
              ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300"
              : "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300"
          }`}>
            {message.text}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-brand px-5 py-2.5 font-semibold text-white hover:opacity-90 disabled:opacity-50"
        >
          {busy ? "Saving…" : editingId ? "Update Post" : "Publish Post"}
        </button>
      </form>

      {/* List */}
      <div className="space-y-3">
        {loading ? (
          <p className="text-sm text-slate-500">Loading…</p>
        ) : posts.length === 0 ? (
          <p className="text-sm text-slate-500">No posts yet. Publish the first one above.</p>
        ) : (
          posts.map((p) => (
            <article key={p.id} className="rounded-xl border border-slate-200 dark:border-slate-800 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {p.pinned ? (
                      <span className="rounded-full bg-brand/15 px-2 py-0.5 text-[10px] font-bold uppercase text-brand">Pinned</span>
                    ) : null}
                    <span className="text-xs text-slate-400" suppressHydrationWarning>
                      {new Date(p.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="mt-1 font-semibold truncate">{p.title}</h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{p.body}</p>
                </div>
                <div className="flex flex-col gap-1 shrink-0 text-xs">
                  <button onClick={() => startEdit(p)} className="text-brand hover:underline">Edit</button>
                  <button onClick={() => togglePin(p)} disabled={busy} className="text-slate-500 hover:underline disabled:opacity-40">
                    {p.pinned ? "Unpin" : "Pin"}
                  </button>
                  <button onClick={() => remove(p)} disabled={busy} className="text-red-500 hover:underline disabled:opacity-40">Delete</button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
