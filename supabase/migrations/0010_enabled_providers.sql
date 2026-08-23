-- Admin-selected AI providers: only these appear in the generator's
-- API Keys modal and are accepted by /api/generate.

alter table public.site_settings
  add column if not exists enabled_providers jsonb not null default '[
    "cloudflare", "groq", "gemini", "mistral", "openai", "openrouter",
    "nvidia", "github", "cohere", "together", "sambanova", "deepinfra",
    "cerebras"
  ]'::jsonb;
