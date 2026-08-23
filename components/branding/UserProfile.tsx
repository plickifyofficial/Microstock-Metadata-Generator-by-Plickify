"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface ProfileInfo {
  email: string;
  name: string;
  avatarUrl: string;
}

/**
 * CSV Tree-style header profile: avatar button + dropdown with identity,
 * badges, quick links and sign out.
 */
export default function UserProfile({ isAdmin }: { isAdmin?: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<ProfileInfo | null>(null);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let active = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      if (data.user) {
        const meta = (data.user.user_metadata ?? {}) as Record<string, unknown>;
        setProfile({
          email: data.user.email ?? "",
          name:
            (typeof meta.full_name === "string" && meta.full_name) ||
            (typeof meta.name === "string" && meta.name) ||
            (data.user.email ?? "User"),
          avatarUrl:
            (typeof meta.avatar_url === "string" && meta.avatar_url) ||
            (typeof meta.picture === "string" && meta.picture) ||
            "",
        });
      } else {
        setProfile(null);
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      if (session?.user) {
        const meta = (session.user.user_metadata ?? {}) as Record<string, unknown>;
        setProfile({
          email: session.user.email ?? "",
          name:
            (typeof meta.full_name === "string" && meta.full_name) ||
            (typeof meta.name === "string" && meta.name) ||
            (session.user.email ?? "User"),
          avatarUrl:
            (typeof meta.avatar_url === "string" && meta.avatar_url) ||
            (typeof meta.picture === "string" && meta.picture) ||
            "",
        });
      } else {
        setProfile(null);
      }
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function signOut() {
    setOpen(false);
    setSigningOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  }

  if (!profile) return <div className="h-8 w-8" aria-hidden />;

  const initial = (profile.name || profile.email || "U").charAt(0).toUpperCase();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Account menu"
        className="h-8 w-8 rounded-full bg-brand flex items-center justify-center overflow-hidden hover:opacity-90 transition-opacity ring-2 ring-transparent hover:ring-brand/30"
      >
        {profile.avatarUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={profile.avatarUrl} alt="" className="h-8 w-8 rounded-full object-cover" referrerPolicy="no-referrer" />
        ) : (
          <span className="text-[11px] font-bold text-white">{initial}</span>
        )}
      </button>

      {open ? (
        <>
          <button
            aria-hidden
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default"
          />
          <div className="absolute right-0 top-full mt-2 w-60 rounded-xl shadow-2xl bg-background border border-slate-200 dark:border-slate-800 py-1 z-50">
            {/* Identity */}
            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
              <p className="text-sm font-semibold truncate">{profile.name || "User"}</p>
              <p className="text-xs text-slate-500 truncate">{profile.email}</p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="rounded bg-brand/15 px-1.5 py-0.5 text-[9px] font-bold uppercase text-brand">
                  Admin
                </span>
              </div>
            </div>

            {/* Links */}
            <Link
              href="/generator"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-3.5 w-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" /></svg>
              Generator
            </Link>
            <Link
              href="/generator?keys=1"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-3.5 w-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" /></svg>
              API Keys
            </Link>
            {isAdmin !== false ? (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-brand hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-3.5 w-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                Admin Panel
              </Link>
            ) : null}

            {/* Sign out */}
            <div className="border-t border-slate-100 dark:border-slate-800 mt-1">
              <button
                onClick={signOut}
                disabled={signingOut}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors disabled:opacity-50"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-3.5 w-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" /></svg>
                {signingOut ? "Signing out…" : "Sign Out"}
              </button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
