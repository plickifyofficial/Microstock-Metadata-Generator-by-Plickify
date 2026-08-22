-- Storage buckets.
--
-- branding-assets  : public bucket for logo/favicon uploads from Admin Panel.
-- generator-images : private bucket; uploaded images are processed transiently
--                    and periodically cleaned up (see README - Storage).

insert into storage.buckets (id, name, public)
values ('branding-assets', 'branding-assets', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('generator-images', 'generator-images', false)
on conflict (id) do nothing;

-- Public read for branding assets only.
drop policy if exists "public read branding assets" on storage.objects;
create policy "public read branding assets"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'branding-assets');

-- Only active admins may write/delete branding assets. The service role
-- bypasses RLS anyway; this policy additionally allows direct dashboard /
-- authenticated uploads if ever used.
drop policy if exists "admin write branding assets" on storage.objects;
create policy "admin write branding assets"
  on storage.objects
  for all
  to authenticated
  using (
    bucket_id = 'branding-assets'
    and exists (
      select 1 from public.admin_users a
      where a.user_id = (select auth.uid())
        and a.status = 'active'
    )
  )
  with check (
    bucket_id = 'branding-assets'
    and exists (
      select 1 from public.admin_users a
      where a.user_id = (select auth.uid())
        and a.status = 'active'
    )
  );
