import type { GeneratorSettings } from "@/lib/types";

/**
 * Metadata prompt - ported from the CSV Tree Generator Tool and extended
 * with a category field (required by microstock platforms such as Adobe
 * Stock). Produces STRICT JSON output from vision LLMs.
 */
export function buildMetadataPrompt(options: {
  settings: GeneratorSettings;
  platform?: string;
}): string {
  const s = options.settings;
  const platformLabel = options.platform === "general" || !options.platform
    ? "all microstock platforms"
    : options.platform;

  const schemaLines = [
    `  "title": "descriptive title between ${s.title_length_min} and ${s.title_length_max} characters",`,
    `  "description": "detailed description with ${s.description_words_min}-${s.description_words_max} words",`,
    `  "keywords": ["keyword1", "keyword2", ...]`,
  ];
  if (s.include_category) {
    schemaLines.push(`  ,"category": "one category exactly from this list: ${s.categories.join(" | ")}"`);
  }

  const keywordTarget = Math.round((s.keywords_count_min + s.keywords_count_max) / 2);
  const titleCharTarget = Math.round((s.title_length_min + s.title_length_max) / 2);

  let prompt = `You are a microstock metadata expert. Analyze this image and generate metadata optimized for ${platformLabel}.

Generate the following in valid JSON format:
{
${schemaLines.join("\n")}
}

Requirements:
- Title (STRICT): MUST be between ${s.title_length_min} and ${s.title_length_max} characters long. Aim for around ${titleCharTarget} characters. Count characters carefully. Descriptive and SEO-friendly.
- Description: ${s.description_words_min} to ${s.description_words_max} words, natural and detailed.
- Keywords (STRICT): MUST return between ${s.keywords_count_min} and ${s.keywords_count_max} keywords. Aim for around ${keywordTarget} keywords. Each keyword should be 1-3 words. No duplicates.`;

  if (s.include_category) {
    prompt += `\n- Category: choose EXACTLY one category from the provided list.`;
  }
  if (s.language && s.language !== "en") {
    prompt += `\n- Write all metadata in language code: ${s.language}.`;
  }
  if (s.custom_prompt) {
    prompt += `\n\nAdditional instructions: ${s.custom_prompt}`;
  }
  prompt += `\n\nReturn ONLY valid JSON, no markdown formatting or code blocks.`;
  return prompt;
}
