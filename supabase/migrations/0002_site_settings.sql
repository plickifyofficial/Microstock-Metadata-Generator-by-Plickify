-- Single-row site settings. Controls all dynamic branding/theme values.
-- Public read is required so server components can render branding;
-- writes are restricted to the service role (Admin Panel API routes).

create table if not exists public.site_settings (
  id integer primary key default 1 check (id = 1),
  site_name text not null default 'Microstock Metadata Generator',
  site_description text not null default 'AI-powered metadata generation for microstock contributors.',
  logo_url text,
  favicon_url text,
  footer_text text not null default 'Free AI-powered metadata generator for microstock contributors.',
  primary_color text not null default '#16A34A',
  secondary_color text not null default '#0F172A',
  theme_mode text not null default 'system' check (theme_mode in ('light', 'dark', 'system')),
  updated_at timestamptz not null default now()
);

insert into public.site_settings (id) values (1) on conflict (id) do nothing;
