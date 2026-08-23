/**
 * AI provider registry - full port of CSV Tree's 13-provider BYOK system.
 *
 * Providers are configured per-browser by the admin (API Keys modal) and/or
 * via server env (AI_PROVIDER/AI_API_KEY) as a fallback. All provider calls
 * are dispatched through the server API route, so CORS-blocked providers
 * (Cloudflare, NVIDIA) work without any proxy.
 */

export type ProviderKind = "openai-compatible" | "gemini" | "cloudflare";

export interface ProviderDef {
  id: string;
  name: string;
  /** Human-friendly model label shown in the UI. */
  model: string;
  /** Exact model id sent to the API (unless AI_MODEL overrides env path). */
  modelId: string;
  kind: ProviderKind;
  description: string;
  freeLimit: string;
  docsUrl: string;
  free: boolean;
  featured?: boolean;
  /** Requests-per-minute throttle applied client-side. */
  rpm: number;
  keyPrefix: string;
  /** Format hint for composite keys, e.g. Cloudflare's ACCOUNT_ID:TOKEN. */
  keyHint?: string;
  /** Text-only providers can't analyze images - used as last resort only. */
  textOnly?: boolean;
}

export const PROVIDERS: ProviderDef[] = [
  {
    id: "cloudflare",
    name: "Cloudflare Workers AI",
    model: "Llama 4 Scout 17B (vision)",
    modelId: "@cf/meta/llama-4-scout-17b-16e-instruct",
    kind: "cloudflare",
    description: "Llama 4 Vision on Cloudflare's edge. Paste as ACCOUNT_ID:API_TOKEN.",
    freeLimit: "10K neurons/day (~2K vision gens/day) · 60 RPM",
    docsUrl: "https://dash.cloudflare.com/profile/api-tokens",
    free: true,
    featured: true,
    rpm: 60,
    keyPrefix: "",
    keyHint: "ACCOUNT_ID:API_TOKEN",
  },
  {
    id: "groq",
    name: "Groq",
    model: "Llama 4 Scout",
    modelId: "meta-llama/llama-4-scout-17b-16e-instruct",
    kind: "openai-compatible",
    description: "Lightning-fast Llama 4 Vision on Groq LPU hardware.",
    freeLimit: "30 RPM · 14.4K req/day · 500K tokens/day",
    docsUrl: "https://console.groq.com/keys",
    free: true,
    featured: true,
    rpm: 30,
    keyPrefix: "gsk_",
  },
  {
    id: "gemini",
    name: "Google Gemini",
    model: "Gemini 2.5 Flash Lite (auto-fallback)",
    modelId: "gemini-2.5-flash-lite",
    kind: "gemini",
    description:
      "Google's multimodal model. Strong image understanding. Auto-falls back Lite → 2.0 Flash → 2.5 Flash.",
    freeLimit: "10 RPM · ~1000 req/day (Lite)",
    docsUrl: "https://aistudio.google.com/app/apikey",
    free: true,
    featured: true,
    rpm: 10,
    keyPrefix: "AIza",
  },
  {
    id: "mistral",
    name: "Mistral AI",
    model: "Pixtral 12B",
    modelId: "pixtral-12b-2409",
    kind: "openai-compatible",
    description: "Mistral's open vision model. Best as a backup provider.",
    freeLimit: "10 RPM · low daily quota",
    docsUrl: "https://console.mistral.ai/api-keys/",
    free: true,
    rpm: 10,
    keyPrefix: "",
  },
  {
    id: "openai",
    name: "OpenAI",
    model: "GPT-4o Mini",
    modelId: "gpt-4o-mini",
    kind: "openai-compatible",
    description: "GPT-4o Mini vision. Highest accuracy. Paid billing required.",
    freeLimit: "Paid only · ~60 RPM · pay per token",
    docsUrl: "https://platform.openai.com/api-keys",
    free: false,
    rpm: 60,
    keyPrefix: "sk-",
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    model: "Llama 3.2 Vision (free)",
    modelId: "meta-llama/llama-3.2-11b-vision-instruct:free",
    kind: "openai-compatible",
    description: "Single API key, access to 200+ models. Free tier limited but flexible.",
    freeLimit: "20 RPM · 50 req/day free",
    docsUrl: "https://openrouter.ai/keys",
    free: true,
    rpm: 20,
    keyPrefix: "sk-or-",
  },
  {
    id: "nvidia",
    name: "NVIDIA NIM",
    model: "Llama 3.2 90B Vision",
    modelId: "meta/llama-3.2-90b-vision-instruct",
    kind: "openai-compatible",
    description: "Llama 3.2 90B Vision on NVIDIA hosted infra.",
    freeLimit: "40 RPM · generous daily quota",
    docsUrl: "https://build.nvidia.com/explore/discover",
    free: true,
    rpm: 40,
    keyPrefix: "nvapi-",
  },
  {
    id: "github",
    name: "GitHub Models",
    model: "GPT-4o (vision)",
    modelId: "openai/gpt-4o",
    kind: "openai-compatible",
    description: "Free GPT-4o vision via your GitHub PAT. High quality, low daily count.",
    freeLimit: "15 RPM · 50-150 req/day (free)",
    docsUrl: "https://github.com/settings/personal-access-tokens",
    free: true,
    rpm: 15,
    keyPrefix: "ghp_",
  },
  {
    id: "cohere",
    name: "Cohere",
    model: "Command-A Vision",
    modelId: "command-a-vision-07-2025",
    kind: "openai-compatible",
    description: "Cohere's multilingual VLM. Permanent free tier.",
    freeLimit: "20 RPM · 1000 req/month · permanent free",
    docsUrl: "https://dashboard.cohere.com/api-keys",
    free: true,
    rpm: 20,
    keyPrefix: "",
  },
  {
    id: "together",
    name: "Together AI",
    model: "Llama 3.2 11B Vision (free)",
    modelId: "meta-llama/Llama-Vision-Free",
    kind: "openai-compatible",
    description: "Open vision models on Together's infra.",
    freeLimit: "6 RPM · low free quota",
    docsUrl: "https://api.together.xyz/settings/api-keys",
    free: true,
    rpm: 6,
    keyPrefix: "",
  },
  {
    id: "sambanova",
    name: "SambaNova Cloud",
    model: "Llama 3.2 90B Vision",
    modelId: "Llama-3.2-90B-Vision-Instruct",
    kind: "openai-compatible",
    description: "Fast Llama 3.2 90B Vision on SambaNova RDU hardware.",
    freeLimit: "10 RPM · free tier daily cap",
    docsUrl: "https://cloud.sambanova.ai/apis",
    free: true,
    rpm: 10,
    keyPrefix: "",
  },
  {
    id: "deepinfra",
    name: "DeepInfra",
    model: "Llama 3.2 90B Vision",
    modelId: "meta-llama/Llama-3.2-90B-Vision-Instruct",
    kind: "openai-compatible",
    description: "OpenAI-compatible vision endpoint. Starter credits then pay-per-token.",
    freeLimit: "30 RPM · ~$1 starter credit",
    docsUrl: "https://deepinfra.com/dash/api_keys",
    free: false,
    rpm: 30,
    keyPrefix: "",
  },
  {
    id: "cerebras",
    name: "Cerebras",
    model: "Llama 3.3 70B (text only)",
    modelId: "llama-3.3-70b",
    kind: "openai-compatible",
    description: "Fastest open inference. Text-only — last-resort backup.",
    freeLimit: "30 RPM · 1M tokens/day · text only",
    docsUrl: "https://cloud.cerebras.ai",
    free: true,
    rpm: 30,
    keyPrefix: "csk-",
    textOnly: true,
  },
];

export function getProvider(id: string): ProviderDef | undefined {
  return PROVIDERS.find((p) => p.id === id);
}

/* ------------------------------------------------------------------ */
/* Env-based default (server-side fallback when no client keys exist). */
/* ------------------------------------------------------------------ */

export interface ResolvedProvider {
  def: ProviderDef;
  apiKey: string;
  model: string;
  endpoint: string;
}

const OPENAI_COMPAT_ENDPOINTS: Record<string, string> = {
  groq: "https://api.groq.com/openai/v1/chat/completions",
  openai: "https://api.openai.com/v1/chat/completions",
  openrouter: "https://openrouter.ai/api/v1/chat/completions",
  mistral: "https://api.mistral.ai/v1/chat/completions",
  nvidia: "https://integrate.api.nvidia.com/v1/chat/completions",
  github: "https://models.inference.ai.azure.com/chat/completions",
  cohere: "https://api.cohere.ai/compatibility/v1/chat/completions",
  together: "https://api.together.xyz/v1/chat/completions",
  sambanova: "https://api.sambanova.ai/v1/chat/completions",
  deepinfra: "https://api.deepinfra.com/v1/openai/chat/completions",
  cerebras: "https://api.cerebras.ai/v1/chat/completions",
};

/**
 * Resolve credentials for a generation attempt. Explicit override wins
 * (visitor-supplied key), otherwise falls back to server env config.
 */
export function resolveProvider(override?: {
  provider?: string;
  apiKey?: string;
}): ResolvedProvider | null {
  const explicit = override?.apiKey?.trim();
  const providerId = (override?.provider || process.env.AI_PROVIDER || "groq")
    .toLowerCase()
    .trim();

  if (explicit) {
    const def = getProvider(providerId);
    if (!def) return null;
    if (def.kind === "cloudflare") {
      // key format ACCOUNT_ID:API_TOKEN - endpoint built per-call.
      return { def, apiKey: explicit, model: def.modelId, endpoint: "" };
    }
    let endpoint = OPENAI_COMPAT_ENDPOINTS[def.id] ?? "";
    if (def.id === "custom") {
      const base = (process.env.AI_BASE_URL || "").trim().replace(/\/+$/, "");
      endpoint = base ? `${base}/chat/completions` : "";
    }
    if (!endpoint && def.kind !== "gemini") return null;
    return { def, apiKey: explicit, model: def.modelId, endpoint };
  }

  // Server env fallback.
  const apiKey = (process.env.AI_API_KEY || "").trim();
  if (!apiKey) return null;
  const def =
    getProvider(providerId) ??
    ({
      id: "custom",
      name: "Custom",
      model: "Custom model",
      modelId: "",
      kind: "openai-compatible",
      description: "",
      freeLimit: "",
      docsUrl: "",
      free: false,
      rpm: 60,
      keyPrefix: "",
    } as ProviderDef);

  if (def.kind === "cloudflare" && !process.env.CLOUDFLARE_ACCOUNT_ID) return null;

  let endpoint = OPENAI_COMPAT_ENDPOINTS[def.id] ?? "";
  if (!endpoint) {
    if (def.kind === "gemini") endpoint = "";
    else {
      const base = (process.env.AI_BASE_URL || "").trim().replace(/\/+$/, "");
      endpoint = base ? `${base}/chat/completions` : "";
    }
  }
  if (!endpoint && def.kind === "openai-compatible") return null;

  const modelOverride = (process.env.AI_MODEL || "").trim();
  return {
    def,
    apiKey,
    model: def.kind === "cloudflare"
      ? def.modelId
      : modelOverride || def.modelId,
    endpoint,
  };
}
