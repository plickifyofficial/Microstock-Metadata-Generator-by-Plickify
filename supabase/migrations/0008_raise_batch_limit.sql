-- Raise existing installs to the new higher batch ceiling so the
-- upload card stops showing the old 10-image limit.

update public.generator_settings
set max_images_per_batch = 200
where id = 1 and max_images_per_batch < 200;
