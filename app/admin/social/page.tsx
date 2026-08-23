import Link from "next/link";
import SocialManager from "@/components/admin/SocialManager";

export const metadata = { title: "Community Posts" };
export const dynamic = "force-dynamic";

export default function AdminSocialPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Community Posts</h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Publish marketplace news, tips and announcements to the{" "}
        <Link href="/community" className="text-brand hover:underline">/community</Link>{" "}
        feed. Pinned posts stay on top.
      </p>
      <div className="mt-6">
        <SocialManager />
      </div>
    </div>
  );
}
