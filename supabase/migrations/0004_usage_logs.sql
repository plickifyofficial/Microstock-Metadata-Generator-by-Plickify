-- System-level generation history (admin-visible). No personal data is
-- stored: the IP is stored only as a salted hash for abuse monitoring.

create table if not exists public.usage_logs (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  ip_hash text,
  filename text,
  file_size bigint,
  success boolean not null default true,
  error_message text,
  provider text,
  model text,
  duration_ms integer,
  title_length integer,
  keyword_count integer
);

create index if not exists idx_usage_logs_created_at on public.usage_logs (created_at desc);
create index if not exists idx_usage_logs_success on public.usage_logs (success);
