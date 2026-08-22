import { resolveProvider } from "@/lib/ai/providers";

export const metadata = { title: "AI Settings" };
export const dynamic = "force-dynamic";

/**
 * AI configuration is environment-only (AI_PROVIDER / AI_API_KEY / AI_MODEL)
 * so secrets never touch the database or client bundle. This page shows a
 * read-only status of what is currently configured.
 */
export default function AdminAiSettingsPage() {
  const resolved = resolveProvider();

  return (
    <div>
      <h1 className="text-2xl font-bold">AI Settings</h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        The AI provider is configured with environment variables so your API
        key stays out of the database, the code and the browser.
      </p>

      <div className="mt-6 space-y-4 max-w-xl">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Status</p>
          {resolved ? (
            <>
              <p className="mt-1 flex items-center gap-2 font-medium text-emerald-600 dark:text-emerald-400">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                Configured
              </p>
              <dl className="mt-3 space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
                <Row label="Provider" value={resolved.def.name} />
                <Row label="Model" value={resolved.model} />
                <Row label="API Key" value={`${resolved.apiKey.slice(0, 4)}…${resolved.apiKey.slice(-4)} (hidden)`} />
              </dl>
            </>
          ) : (
            <>
              <p className="mt-1 flex items-center gap-2 font-medium text-red-600 dark:text-red-400">
                <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
                Not configured - generation will fail
              </p>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                Set these variables in your <code>.env.local</code> (local) or
                Vercel Project Settings → Environment Variables (production):
              </p>
              <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-950 text-slate-100 text-xs p-3">{`AI_PROVIDER=groq
AI_API_KEY=your-key-here
# optional overrides:
# AI_MODEL=meta-llama/llama-4-scout-17b-16e-instruct
# AI_BASE_URL=https://your-openai-compatible-endpoint/v1`}</pre>
            </>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-5 text-sm">
          <h2 className="font-semibold">Supported providers</h2>
          <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-slate-600 dark:text-slate-400">
            <li><code>AI_PROVIDER=groq</code> (default)</li>
            <li><code>AI_PROVIDER=openai</code></li>
            <li><code>AI_PROVIDER=gemini</code></li>
            <li><code>AI_PROVIDER=openrouter</code></li>
            <li><code>AI_PROVIDER=mistral</code></li>
            <li><code>AI_PROVIDER=custom</code></li>
          </ul>
          <p className="mt-3 text-xs text-slate-500">
            Any OpenAI-compatible vision endpoint works via{" "}
            <code>AI_PROVIDER=custom</code> + <code>AI_BASE_URL</code>.
          </p>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt>{label}</dt>
      <dd className="font-medium text-right truncate">{value}</dd>
    </div>
  );
}
