import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getGeneratorSettings } from "@/lib/settings";
import { buildMetadataPrompt } from "@/lib/ai/prompts";
import { generateMetadata } from "@/lib/ai/generate";
import { hashIp, rateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const maxDuration = 60;

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/bmp",
]);
const MAX_BASE64_LENGTH = 10 * 1024 * 1024; // ~7.5 MB decoded

function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

export async function POST(request: Request) {
  let body: {
    filename?: string;
    mimeType?: string;
    imageBase64?: string;
    platform?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { filename, mimeType, imageBase64, platform } = body;

  if (!mimeType || !ALLOWED_MIME.has(mimeType)) {
    return NextResponse.json(
      { error: "Unsupported image type. Use JPEG, PNG, WebP, GIF or BMP." },
      { status: 400 }
    );
  }
  if (!imageBase64 || typeof imageBase64 !== "string") {
    return NextResponse.json({ error: "Missing image data." }, { status: 400 });
  }
  const cleanBase64 = imageBase64.includes(",")
    ? imageBase64.slice(imageBase64.indexOf(",") + 1)
    : imageBase64;
  if (cleanBase64.length > MAX_BASE64_LENGTH) {
    return NextResponse.json(
      { error: "Image too large. Please upload an image under 7 MB." },
      { status: 413 }
    );
  }

  const settings = await getGeneratorSettings();

  // Rate limit BEFORE calling the AI provider.
  const rl = rateLimit(hashIp(clientIp(request)), settings.rate_limit_per_hour);
  if (!rl.allowed) {
    return NextResponse.json(
      {
        error: `Rate limit reached (${settings.rate_limit_per_hour} generations/hour). Try again in ${Math.ceil(rl.retryAfterSeconds / 60)} minute(s).`,
      },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } }
    );
  }

  const prompt = buildMetadataPrompt({
    settings,
    platform: typeof platform === "string" ? platform : "general",
  });

  try {
    const outcome = await generateMetadata(
      {
        imageBase64: cleanBase64,
        mimeType,
        prompt,
      },
      settings
    );

    logUsage({
      ipHash: hashIp(clientIp(request)),
      filename,
      success: true,
      provider: outcome.provider,
      model: outcome.model,
      durationMs: outcome.durationMs,
      titleLength: outcome.metadata.title.length,
      keywordCount: outcome.metadata.keywords.length,
    });

    return NextResponse.json({ metadata: outcome.metadata });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Generation failed unexpectedly.";
    logUsage({
      ipHash: hashIp(clientIp(request)),
      filename,
      success: false,
      errorMessage: message,
    });
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

/** Fire-and-forget usage logging - never blocks or breaks generation. */
function logUsage(entry: Record<string, unknown>) {
  try {
    const admin = createAdminClient();
    admin
      .from("usage_logs")
      .insert({ ...entry })
      .then(undefined, () => {});
  } catch {
    // Service role not configured yet (first run) - ignore.
  }
}
