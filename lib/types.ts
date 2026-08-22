export interface SiteSettings {
  site_name: string;
  site_description: string;
  logo_url: string | null;
  favicon_url: string | null;
  footer_text: string;
  primary_color: string;
  secondary_color: string;
  theme_mode: "light" | "dark" | "system";
}

export interface GeneratorSettings {
  title_length_min: number;
  title_length_max: number;
  description_words_min: number;
  description_words_max: number;
  keywords_count_min: number;
  keywords_count_max: number;
  include_category: boolean;
  categories: string[];
  language: string;
  custom_prompt: string;
  max_images_per_batch: number;
  rate_limit_per_hour: number;
}

export interface GeneratedMetadata {
  title: string;
  description: string;
  keywords: string[];
  category?: string;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  site_name: "Microstock Metadata Generator",
  site_description: "AI-powered metadata generation for microstock contributors.",
  logo_url: null,
  favicon_url: null,
  footer_text: "Free AI-powered metadata generator for microstock contributors.",
  primary_color: "#16A34A",
  secondary_color: "#0F172A",
  theme_mode: "system",
};

export const DEFAULT_GENERATOR_SETTINGS: GeneratorSettings = {
  title_length_min: 40,
  title_length_max: 100,
  description_words_min: 30,
  description_words_max: 60,
  keywords_count_min: 20,
  keywords_count_max: 30,
  include_category: true,
  categories: [
    "Animals", "Buildings and Architecture", "Business", "Drinks",
    "The Environment", "States of Mind", "Food", "Graphic Resources",
    "Hobbies and Leisure", "Industry", "Landscapes", "Lifestyle",
    "People", "Plants and Flowers", "Culture and Religion", "Science",
    "Social Issues", "Sports", "Technology", "Transport", "Travel",
  ],
  language: "en",
  custom_prompt: "",
  max_images_per_batch: 10,
  rate_limit_per_hour: 30,
};

/** Result item tracked client-side per uploaded image. */
export interface GenerationResult extends GeneratedMetadata {
  id: string;
  filename: string;
  status: "pending" | "processing" | "done" | "error";
  error?: string;
}
