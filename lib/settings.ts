import { createAdminClient } from "@/lib/supabase/admin";
import {
  DEFAULT_GENERATOR_SETTINGS,
  DEFAULT_SITE_SETTINGS,
  type GeneratorSettings,
  type SiteSettings,
} from "@/lib/types";

/**
 * Load site settings with hard defaults as a fallback so the site still
 * renders even before Supabase is configured (first-run DX).
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();
    if (!data) return DEFAULT_SITE_SETTINGS;
    return {
      site_name: data.site_name || DEFAULT_SITE_SETTINGS.site_name,
      site_description: data.site_description || DEFAULT_SITE_SETTINGS.site_description,
      logo_url: data.logo_url ?? null,
      favicon_url: data.favicon_url ?? null,
      footer_text: data.footer_text || DEFAULT_SITE_SETTINGS.footer_text,
      primary_color: data.primary_color || DEFAULT_SITE_SETTINGS.primary_color,
      secondary_color: data.secondary_color || DEFAULT_SITE_SETTINGS.secondary_color,
      theme_mode: (["light", "dark", "system"].includes(data.theme_mode)
        ? data.theme_mode
        : "system") as SiteSettings["theme_mode"],
    };
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}

export async function getGeneratorSettings(): Promise<GeneratorSettings> {
  const fallback = DEFAULT_GENERATOR_SETTINGS;
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("generator_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();
    if (!data) return fallback;
    return {
      title_length_min: clampInt(data.title_length_min, 10, 300, fallback.title_length_min),
      title_length_max: clampInt(data.title_length_max, 20, 300, fallback.title_length_max),
      description_words_min: clampInt(data.description_words_min, 5, 200, fallback.description_words_min),
      description_words_max: clampInt(data.description_words_max, 10, 300, fallback.description_words_max),
      keywords_count_min: clampInt(data.keywords_count_min, 3, 100, fallback.keywords_count_min),
      keywords_count_max: clampInt(data.keywords_count_max, 5, 100, fallback.keywords_count_max),
      include_category: typeof data.include_category === "boolean" ? data.include_category : true,
      categories: Array.isArray(data.categories) && data.categories.length
        ? data.categories.map(String)
        : fallback.categories,
      language: data.language || fallback.language,
      custom_prompt: data.custom_prompt || "",
      max_images_per_batch: clampInt(data.max_images_per_batch, 1, 200, fallback.max_images_per_batch),
      rate_limit_per_hour: clampInt(data.rate_limit_per_hour, 0, 100000, fallback.rate_limit_per_hour),
    };
  } catch {
    return fallback;
  }
}

function clampInt(value: unknown, min: number, max: number, dflt: number): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return dflt;
  return Math.min(max, Math.max(min, Math.round(n)));
}
