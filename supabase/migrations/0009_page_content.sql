-- Page content managed from Admin > Page Content.
-- Everything public-facing on the home & about pages lives here.

alter table public.site_settings
  add column if not exists hero_badge text not null default 'Free - built for microstock contributors',
  add column if not exists hero_title text not null default 'AI-powered metadata for your microstock uploads',
  add column if not exists hero_subtitle text not null default 'Upload images and instantly get optimized titles, descriptions, keywords and categories - ready to export for every major stock platform.',
  add column if not exists about_title text not null default 'About',
  add column if not exists about_body text not null default 'The Microstock Metadata Generator helps stock contributors write better titles, descriptions, keywords and categories for their images - in seconds instead of minutes.

Upload one or more images and an AI vision model analyzes each photo, producing marketplace-optimized metadata you can review, edit, copy, or export as a CSV matching your platform upload template.

Uploaded images are processed transiently in memory and are never stored permanently on the server.',
  add column if not exists features jsonb not null default '[
    {"title": "AI Metadata", "body": "Upload any image and get an optimized title, description, keywords and category in seconds."},
    {"title": "Bulk Processing", "body": "Queue multiple images at once with live progress, automatic retries and a stop button."},
    {"title": "Platform CSV Export", "body": "Ready-to-upload CSVs for Adobe Stock, Shutterstock, Freepik, Vecteezy, Dreamstime and more."},
    {"title": "13 AI Providers", "body": "Bring your own keys - Groq, Gemini, OpenAI and more rotate automatically with cross-provider fallback."}
  ]'::jsonb,
  add column if not exists steps jsonb not null default '[
    {"title": "Upload", "body": "Drag && drop or select one or more images."},
    {"title": "Generate", "body": "The AI analyzes each image and writes marketplace-ready metadata."},
    {"title": "Export", "body": "Review, tweak if needed, then download a platform-perfect CSV."}
  ]'::jsonb;
