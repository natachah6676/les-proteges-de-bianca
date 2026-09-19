-- Soins sanitaires en booléens, Oui par défaut.
-- Les anciennes colonnes tri-état (vaccinated, identified, dewormed, parasite_treated)
-- et les textes personality / life_with_bianca sont conservées, mais ne sont plus utilisées par l’application.

alter table public.dogs
  add column if not exists is_vaccinated boolean not null default true,
  add column if not exists is_dewormed boolean not null default true,
  add column if not exists is_identified boolean not null default true,
  add column if not exists is_parasite_treated boolean not null default true;

update public.dogs
set
  is_vaccinated = true,
  is_dewormed = true,
  is_identified = true,
  is_parasite_treated = true;
