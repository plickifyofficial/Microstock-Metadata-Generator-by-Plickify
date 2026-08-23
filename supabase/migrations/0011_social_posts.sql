-- Community feed: manual posts from the admin (marketplace news, tips,
-- announcements). Public read; writes go through the server only.

create table if not exists public.social_posts (
  id bigint generated always as identity primary key,
  title text not null,
  body text not null,
  link_url text,
  link_label text,
  pinned boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.social_posts enable row level security;

drop policy if exists "public read social posts" on public.social_posts;
create policy "public read social posts"
  on public.social_posts
  for select
  to anon, authenticated
  using (true);

create index if not exists idx_social_posts_created
  on public.social_posts (pinned desc, created_at desc);
