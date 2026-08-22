"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { StatusMessage } from "@/components/admin/SiteSettingsForm";
import type { SiteSettings } from "@/lib/types";

export default function BrandingForm({ initial }: { initial: SiteSettings }) {
  const router = useRouter();
  const [logoUrl, setLogoUrl] = useState(initial.logo_url || "");
  const [faviconUrl, setFaviconUrl] = useState(initial.favicon_url || "");
  const [primaryColor, setPrimaryColor] = useState(initial.primary_color);
  const [secondaryColor, setSecondaryColor] = useState(initial.secondary_color);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<"logo" | "favicon" | null>(null);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const logoInput = useRef<HTMLInputElement>(null);
  const faviconInput = useRef<HTMLInputElement>(null);

  async function uploadAsset(kind: "logo" | "favicon", file: File) {
    setUploading(kind);
    setMessage(null);
    try {
      const form = new FormData();
      form.set("kind", kind);
      form.set("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Upload failed.");
      if (kind === "logo") setLogoUrl(json.url);
      else setFaviconUrl(json.url);
      setMessage({ ok: true, text: `Uploaded. Press Save to apply.` });
    } catch (err) {
      setMessage({
        ok: false,
        text: err instanceof Error ? err.message : "Upload failed.",
      });
    } finally {
      setUploading(null);
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/site-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          logo_url: logoUrl || null,
          favicon_url: faviconUrl || null,
          primary_color: primaryColor,
          secondary_color: secondaryColor,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Save failed.");
      setMessage({ ok: true, text: "Saved. Reload the public site to see changes." });
      router.refresh();
    } catch (err) {
      setMessage({ ok: false, text: err instanceof Error ? err.message : "Save failed." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save} className="space-y-6 max-w-xl">
      {/* Logo */}
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Logo
        </p>
        <div className="flex items-center gap-3">
          {logoUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={logoUrl} alt="Current logo" className="h-10 w-auto max-w-[140px] object-contain rounded border border-slate-200 dark:border-slate-700 p-1" />
          ) : (
            <span className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-800 grid place-items-center text-xs text-slate-400">None</span>
          )}
          <input ref={logoInput} type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" hidden
            onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadAsset("logo", f); e.target.value = ""; }} />
          <button type="button" onClick={() => logoInput.current?.click()} disabled={uploading !== null}
            className="rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50">
            {uploading === "logo" ? "Uploading…" : "Upload Logo"}
          </button>
          {logoUrl ? (
            <button type="button" onClick={() => setLogoUrl("")} className="text-sm text-red-600 hover:underline">Remove</button>
          ) : null}
        </div>
      </div>

      {/* Favicon */}
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Favicon
        </p>
        <div className="flex items-center gap-3">
          {faviconUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={faviconUrl} alt="Current favicon" className="h-8 w-8 object-contain rounded border border-slate-200 dark:border-slate-700 p-0.5" />
          ) : (
            <span className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800 grid place-items-center text-xs text-slate-400">?</span>
          )}
          <input ref={faviconInput} type="file" accept="image/png,image/x-icon,image/vnd.microsoft.icon,image/svg+xml,image/webp" hidden
            onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadAsset("favicon", f); e.target.value = ""; }} />
          <button type="button" onClick={() => faviconInput.current?.click()} disabled={uploading !== null}
            className="rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50">
            {uploading === "favicon" ? "Uploading…" : "Upload Favicon"}
          </button>
          {faviconUrl ? (
            <button type="button" onClick={() => setFaviconUrl("")} className="text-sm text-red-600 hover:underline">Remove</button>
          ) : null}
        </div>
      </div>

      {/* Colors */}
      <ColorInput label="Primary Color" value={primaryColor} onChange={setPrimaryColor} />
      <ColorInput label="Secondary Color" value={secondaryColor} onChange={setSecondaryColor} />

      <StatusMessage message={message} />

      <button type="submit" disabled={saving || uploading !== null}
        className="rounded-lg bg-brand px-5 py-2.5 font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50">
        {saving ? "Saving…" : "Save Branding"}
      </button>
    </form>
  );
}

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const valid = /^#[0-9a-fA-F]{6}$/.test(value);
  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={valid ? value : "#000000"}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          className="h-9 w-12 cursor-pointer rounded border border-slate-300 dark:border-slate-700 bg-transparent"
          aria-label={`${label} picker`}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#16A34A"
          className={`w-32 rounded-lg border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-brand/50 ${
            valid ? "border-slate-300 dark:border-slate-700" : "border-red-400"
          }`}
        />
      </div>
    </div>
  );
}
