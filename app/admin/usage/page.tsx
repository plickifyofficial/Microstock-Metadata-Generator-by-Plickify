import { createAdminClient } from "@/lib/supabase/admin";

export const metadata = { title: "Usage" };
export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

interface LogRow {
  id: number;
  created_at: string;
  filename: string | null;
  success: boolean;
  provider: string | null;
  model: string | null;
  duration_ms: number | null;
  title_length: number | null;
  keyword_count: number | null;
  error_message: string | null;
}

async function loadLogs(): Promise<{ rows: LogRow[]; error: boolean }> {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("usage_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(PAGE_SIZE);
    if (error) throw error;
    return { rows: (data ?? []) as unknown as LogRow[], error: false };
  } catch {
    return { rows: [], error: true };
  }
}

export default async function AdminUsagePage() {
  const { rows, error } = await loadLogs();

  return (
    <div>
      <h1 className="text-2xl font-bold">Usage</h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        System-level generation log (last {PAGE_SIZE} entries). No personal
        data is stored.
      </p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-sm">
          <thead className="bg-surface dark:bg-surface text-left text-xs uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-4 py-3 font-semibold">Time</th>
              <th className="px-4 py-3 font-semibold">File</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Provider</th>
              <th className="px-4 py-3 font-semibold">Duration</th>
              <th className="px-4 py-3 font-semibold">Title / Keywords</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {error ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-500">
                  Could not load logs. Check your Supabase configuration and migrations.
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-500">
                  No generations logged yet.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} title={row.error_message || undefined}>
                  <td className="px-4 py-2.5 whitespace-nowrap text-slate-500" suppressHydrationWarning>
                    {new Date(row.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-2.5 max-w-[180px] truncate">{row.filename || "—"}</td>
                  <td className="px-4 py-2.5">
                    <span className={row.success ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-red-600 dark:text-red-400 font-medium"}>
                      {row.success ? "OK" : "Error"}
                    </span>
                    {!row.success && row.error_message ? (
                      <span className="block max-w-[220px] truncate text-xs text-slate-400">{row.error_message}</span>
                    ) : null}
                  </td>
                  <td className="px-4 py-2.5 text-slate-500">
                    {row.provider ? `${row.provider}${row.model ? ` · ${row.model}` : ""}` : "—"}
                  </td>
                  <td className="px-4 py-2.5 text-slate-500">
                    {row.duration_ms != null ? `${(row.duration_ms / 1000).toFixed(1)}s` : "—"}
                  </td>
                  <td className="px-4 py-2.5 text-slate-500">
                    {row.title_length != null ? `${row.title_length} chars` : "—"} /{" "}
                    {row.keyword_count != null ? `${row.keyword_count} kw` : ""}
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
