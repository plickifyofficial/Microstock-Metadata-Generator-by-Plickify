-- Single-row generator defaults controlled from the Admin Panel.
-- These values seed the AI prompt and client UI; individual visitors can
-- still override some options locally for their own generation runs.

create table if not exists public.generator_settings (
  id integer primary key default 1 check (id = 1),
  title_length_min integer not null default 40
    check (title_length_min between 10 and 300),
  title_length_max integer not null default 100
    check (title_length_max between 20 and 300),
  description_words_min integer not null default 30
    check (description_words_min between 5 and 200),
  description_words_max integer not null default 60
    check (description_words_max between 10 and 300),
  keywords_count_min integer not null default 20
    check (keywords_count_min between 3 and 100),
  keywords_count_max integer not null default 30
    check (keywords_count_max between 5 and 100),
  include_category boolean not null default true,
  categories jsonb not null default '[
    "Animals", "Buildings and Architecture", "Business", "Drinks",
    "The Environment", "States of Mind", "Food", "Graphic Resources",
    "Hobbies and Leisure", "Industry", "Landscapes", "Lifestyle",
    "People", "Plants and Flowers", "Culture and Religion", "Science",
    "Social Issues", "Sports", "Technology", "Transport", "Travel"
  ]'::jsonb,
  language text not null default 'en',
  custom_prompt text not null default '',
  max_images_per_batch integer not null default 10
    check (max_images_per_batch between 1 and 50),
  rate_limit_per_hour integer not null default 30
    check (rate_limit_per_hour between 1 and 1000),
  updated_at timestamptz not null default now(),
  constraint gs_bounds_valid check (
    title_length_min < title_length_max
    and description_words_min < description_words_max
    and keywords_count_min <= keywords_count_max
  )
);

insert into public.generator_settings (id) values (1) on conflict (id) do nothing;
