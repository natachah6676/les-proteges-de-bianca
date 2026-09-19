-- Recrée les buckets médias s’ils n’existent pas.
-- À exécuter dans le SQL Editor Supabase si Storage indique "Bucket not found".

insert into storage.buckets (id, name, public)
values
  ('dog-media', 'dog-media', true),
  ('site-media', 'site-media', true)
on conflict (id) do update set public = true;
