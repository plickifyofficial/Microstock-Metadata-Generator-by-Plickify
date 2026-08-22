import type { GeneratedMetadata, GeneratorSettings } from "@/lib/types";
import { resolveProvider } from "@/lib/ai/providers";

const REQUEST_TIMEOUT_MS = 60_000;

export interface GenerateInput {
  imageBase64: string; // raw base64, no data: prefix
  mimeType: string;
  prompt: string;
}

export interface GenerateOutcome {
  metadata: GeneratedMetadata;
  provider: string;
  model: string;
  durationMs: number;
}

/**
 * Calls the configured vision LLM and returns parsed + enforced metadata.
 * Throws with a readable message on configuration or API failure.
 */
export async function generateMetadata(
  input: GenerateInput,
  settings: GeneratorSettings
): Promise<GenerateOutcome> {
  const started = Date.now();
  const resolved = resolveProvider();
  if (!resolved) {
    throw new Error(
      "AI is not configured. Set AI_PROVIDER and AI_API_KEY in your environment."
    );
  }

  const rawText =
    resolved.def.kind === "gemini"
      ? await callGemini(resolved, input)
      : await callOpenAICompatible(resolved, input);

  const parsed = parseJsonResponse(rawText);
  const metadata = enforceBounds(parsed, settings);

  return {
    metadata,
    provider: resolved.def.id,
    model: resolved.model,
    durationMs: Date.now() - started,
  };
}

async function callOpenAICompatible(
  provider: NonNullable<ReturnType<typeof resolveProvider>>,
  input: GenerateInput
): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(provider.endpoint, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${provider.apiKey}`,
      },
      body: JSON.stringify({
        model: provider.model,
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: input.prompt },
              {
                type: "image_url",
                image_url: { url: `data:${input.mimeType};base64,${input.imageBase64}` },
              },
            ],
          },
        ],
        temperature: 0.4,
        max_tokens: 1024,
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`AI request failed (${res.status}): ${truncate(body, 300)}`);
    }
    const json = await res.json();
    const content = json?.choices?.[0]?.message?.content;
    return normalizeContent(content);
  } finally {
    clearTimeout(timer);
  }
}

async function callGemini(
  provider: NonNullable<ReturnType<typeof resolveProvider>>,
  input: GenerateInput
): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${provider.model}:generateContent?key=${encodeURIComponent(provider.apiKey)}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: "POST",
      signal: controller.signal,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: input.prompt },
              { inline_data: { mime_type: input.mimeType, data: input.imageBase64 } },
            ],
          },
        ],
        generationConfig: { temperature: 0.4, maxOutputTokens: 1024 },
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`AI request failed (${res.status}): ${truncate(body, 300)}`);
    }
    const json = await res.json();
    const parts = json?.candidates?.[0]?.content?.parts;
    if (!Array.isArray(parts)) return "";
    return parts
      .map((p: { text?: unknown }) => (typeof p?.text === "string" ? p.text : ""))
      .join("");
  } finally {
    clearTimeout(timer);
  }
}

/** Some providers return content as an array of parts instead of a string. */
function normalizeContent(content: unknown): string {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((p) =>
        typeof p === "string"
          ? p
          : typeof p?.text === "string"
            ? p.text
            : ""
      )
      .join("");
  }
  if (content && typeof content === "object") {
    const c = content as { text?: unknown; content?: unknown };
    if (typeof c.text === "string") return c.text;
    if (typeof c.content === "string") return c.content;
  }
  return "";
}

/**
 * Vision LLMs love wrapping JSON in code fences / prose even when told not
 * to. Salvage the first balanced JSON object found in the text.
 */
export function parseJsonResponse(raw: string): Partial<GeneratedMetadata> {
  let text = String(raw || "").trim();

  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) text = fence[1].trim();

  const start = text.indexOf("{");
  if (start !== -1) {
    let depth = 0;
    let inString = false;
    let escaped = false;
    for (let i = start; i < text.length; i++) {
      const ch = text[i];
      if (escaped) { escaped = false; continue; }
      if (ch === "\\") { escaped = true; continue; }
      if (ch === '"') inString = !inString;
      if (inString) continue;
      if (ch === "{") depth++;
      else if (ch === "}") {
        depth--;
        if (depth === 0) {
          const candidate = text.slice(start, i + 1);
          try {
            return JSON.parse(candidate);
          } catch {
            break;
          }
        }
      }
    }
  }
  throw new Error("Could not parse the AI response as JSON. Please try again.");
}

/**
 * Deterministic post-processing so the output always respects the admin's
 * configured bounds regardless of how well the model followed instructions.
 */
export function enforceBounds(
  meta: Partial<GeneratedMetadata>,
  s: GeneratorSettings
): GeneratedMetadata {
  let title = typeof meta.title === "string" ? meta.title.trim() : "";
  let description = typeof meta.description === "string" ? meta.description.trim() : "";
  let keywords = Array.isArray(meta.keywords) ? meta.keywords.map(String) : [];
  let category = typeof meta.category === "string" ? meta.category.trim() : "";

  title = truncateAtWord(title, s.title_length_max);

  // Dedupe keywords case-insensitively, trim, drop empties.
  const seen = new Set<string>();
  keywords = keywords
    .map((k) => k.trim().replace(/\s+/g, " "))
    .filter((k) => k.length > 0 && k.length <= 60)
    .filter((k) => {
      const key = k.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, Math.max(s.keywords_count_max, s.keywords_count_min));

  description = truncateAtWord(description, 2000);

  if (
    category &&
    Array.isArray(s.categories) &&
    s.categories.length > 0
  ) {
    const match = s.categories.find(
      (c) => c.toLowerCase() === category.toLowerCase()
    );
    category = match || category;
  }

  return { title, description, keywords, category: category || undefined };
}

export function truncateAtWord(text: string, maxChars: number): string {
  if (!text || text.length <= maxChars) return text;
  const cut = text.slice(0, maxChars);
  const lastSpace = cut.lastIndexOf(" ");
  return lastSpace > maxChars * 0.5 ? cut.slice(0, lastSpace) : cut;
}

function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max)}...` : text;
}
