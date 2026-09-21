-- Lien Facebook public propre à chaque chien (album, publication ou page).
-- Distinct des vidéos importées dans Storage et du Facebook de l’association.

alter table public.dogs
  add column if not exists facebook_url text;
