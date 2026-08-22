/**
 * Server-side AI provider layer.
 *
 * The active provider is configured purely via environment variables so
 * forkers never touch code:
 *
 *   AI_PROVIDER  - groq | openai | openrouter | mistral | gemini | custom
 *   AI_API_KEY   - secret key for the chosen provider
 *   AI_MODEL     - optional model override
 *   AI_BASE_URL  - optional OpenAI-compatible base URL (AI_PROVIDER=custom)
 */

export type ProviderKind = "openai-compatible" | "gemini";

export interface ProviderDef {
  id: string;
  name: string;
  kind: ProviderKind;
  defaultModel: string;
  /** OpenAI-compatible chat completions endpoint. */
  endpoint?: string;
}

export const PROVIDERS: Record<string, ProviderDef> = {
  groq: {
    id: "groq",
    name: "Groq",
    kind: "openai-compatible",
    defaultModel: "meta-llama/llama-4-scout-17b-16e-instruct",
    endpoint: "https://api.groq.com/openai/v1/chat/completions",
  },
  openai: {
    id: "openai",
    name: "OpenAI",
    kind: "openai-compatible",
    defaultModel: "gpt-4o-mini",
    endpoint: "https://api.openai.com/v1/chat/completions",
  },
  openrouter: {
    id: "openrouter",
    name: "OpenRouter",
    kind: "openai-compatible",
    defaultModel: "meta-llama/llama-3.2-11b-vision-instruct:free",
    endpoint: "https://openrouter.ai/api/v1/chat/completions",
  },
  mistral: {
    id: "mistral",
    name: "Mistral AI",
    kind: "openai-compatible",
    defaultModel: "pixtral-12b-2409",
    endpoint: "https://api.mistral.ai/v1/chat/completions",
  },
  gemini: {
    id: "gemini",
    name: "Google Gemini",
    kind: "gemini",
    defaultModel: "gemini-2.0-flash-lite",
  },
  custom: {
    id: "custom",
    name: "Custom (OpenAI-compatible)",
    kind: "openai-compatible",
    defaultModel: "",
  },
};

export interface ResolvedProvider {
  def: ProviderDef;
  apiKey: string;
  model: string;
  endpoint: string;
}

export function resolveProvider(): ResolvedProvider | null {
  const id = (process.env.AI_PROVIDER || "groq").toLowerCase().trim();
  const def = PROVIDERS[id];
  const apiKey = (process.env.AI_API_KEY || "").trim();
  if (!def || !apiKey) return null;

  const baseUrl = (process.env.AI_BASE_URL || "").trim().replace(/\/+$/, "");
  let endpoint = "";
  if (def.kind === "openai-compatible") {
    endpoint =
      baseUrl
        ? `${baseUrl}/chat/completions`
        : def.endpoint || "";
  }
  if (!endpoint && def.kind === "gemini") {
    // Built below per-request (model embedded in path).
    endpoint = "";
  }
  if (def.kind === "openai-compatible" && !endpoint) return null;

  return { def, apiKey, model: (process.env.AI_MODEL || "").trim() || def.defaultModel, endpoint };
}
