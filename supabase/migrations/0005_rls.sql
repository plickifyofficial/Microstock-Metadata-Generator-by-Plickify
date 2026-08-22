-- ============================================================================
-- Row Level Security
--
-- Principle: everything sensitive is written exclusively through the server
-- (service role key, which bypasses RLS). Clients get the narrow read access
-- needed to render public pages and check their own admin status.
-- ============================================================================

alter table public.admin_users enable row level security;
alter table public.site_settings enable row level security;
alter table public.generator_settings enable row level security;
alter table public.usage_logs enable row level security;

-- admin_users: a signed-in user may read only their own row (used by the
-- client to know whether to expose admin UI). No client writes ever.
drop policy if exists "admins read own row" on public.admin_users;
create policy "admins read own row"
  on public.admin_users
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- site_settings: publicly readable (branding is rendered for every visitor).
drop policy if exists "site settings public read" on public.site_settings;
create policy "site settings public read"
  on public.site_settings
  for select
  to anon, authenticated
  using (true);

-- generator_settings: publicly readable (generator defaults shown in UI).
drop policy if exists "generator settings public read" on public.generator_settings;
create policy "generator settings public read"
  on public.generator_settings
  for select
  to anon, authenticated
  using (true);

-- usage_logs: no client policies at all. Server-only via service role.
