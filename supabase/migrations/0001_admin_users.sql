-- Admin authorization table. A row with status = 'active' grants access
-- to the Admin Panel. Rows are managed via the Supabase dashboard / SQL
-- editor using the service role (no client-side writes).

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  email text not null,
  name text,
  avatar_url text,
  status text not null default 'active' check (status in ('active', 'disabled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_admin_users_email on public.admin_users (email);
