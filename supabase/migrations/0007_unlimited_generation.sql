-- Allow unlimited generation: 0 means "no hourly limit".
-- Also raises the per-batch image cap.

alter table public.generator_settings
  drop constraint if exists generator_settings_rate_limit_per_hour_check;
alter table public.generator_settings
  drop constraint if exists generator_settings_max_images_per_batch_check;

alter table public.generator_settings
  add constraint generator_settings_rate_limit_per_hour_check
  check (rate_limit_per_hour >= 0 and rate_limit_per_hour <= 100000);

alter table public.generator_settings
  add constraint generator_settings_max_images_per_batch_check
  check (max_images_per_batch >= 1 and max_images_per_batch <= 200);

-- Existing installs get unlimited by default going forward.
update public.generator_settings set rate_limit_per_hour = 0 where id = 1;
