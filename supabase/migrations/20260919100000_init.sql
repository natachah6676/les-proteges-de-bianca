-- Les Protégés de Bianca — schéma initial
-- Public : lecture seule des contenus publiés
-- Admin : utilisateur authentifié (compte créé manuellement, inscriptions publiques désactivées)

create extension if not exists "pgcrypto";

do $$ begin
  create type public.dog_sex as enum ('male', 'female', 'unknown');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.dog_status as enum ('available', 'reserved', 'adopted', 'unpublished');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.tri_state as enum ('yes', 'no', 'unknown');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.media_type as enum ('photo', 'video');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.media_category as enum ('dog', 'bianca', 'daily', 'hero', 'other');
exception when duplicate_object then null;
end $$;

create table if not exists public.dogs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  sex public.dog_sex not null default 'unknown',
  birth_date date,
  birth_date_approximate boolean not null default false,
  status public.dog_status not null default 'available',
  adoption_date date,
  current_location text,
  estimated_size text,
  estimated_weight text,
  short_summary text,
  story text,
  personality text,
  life_with_bianca text,
  ok_dogs public.tri_state not null default 'unknown',
  ok_cats public.tri_state not null default 'unknown',
  ok_children public.tri_state not null default 'unknown',
  vaccinated public.tri_state not null default 'unknown',
  identified public.tri_state not null default 'unknown',
  dewormed public.tri_state not null default 'unknown',
  parasite_treated public.tri_state not null default 'unknown',
  sterilized public.tri_state not null default 'unknown',
  passport public.tri_state not null default 'unknown',
  additional_info text,
  main_photo_id uuid,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  dog_id uuid references public.dogs(id) on delete set null,
  media_type public.media_type not null,
  storage_path text,
  external_url text,
  caption text,
  category public.media_category not null default 'other',
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  constraint media_has_source check (
    storage_path is not null or (external_url is not null and length(trim(external_url)) > 0)
  )
);

do $$ begin
  alter table public.dogs
    add constraint dogs_main_photo_id_fkey
    foreign key (main_photo_id) references public.media(id) on delete set null;
exception when duplicate_object then null;
end $$;

create table if not exists public.site_content (
  key text primary key,
  value text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id integer primary key default 1 check (id = 1),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists dogs_set_updated_at on public.dogs;
create trigger dogs_set_updated_at
  before update on public.dogs
  for each row execute procedure public.set_updated_at();

drop trigger if exists site_content_set_updated_at on public.site_content;
create trigger site_content_set_updated_at
  before update on public.site_content
  for each row execute procedure public.set_updated_at();

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute procedure public.set_updated_at();

create index if not exists dogs_status_idx on public.dogs (status);
create index if not exists dogs_published_idx on public.dogs (published);
create index if not exists dogs_sort_order_idx on public.dogs (sort_order, created_at);
create index if not exists media_dog_id_idx on public.media (dog_id);
create index if not exists media_category_idx on public.media (category);
create index if not exists media_created_at_idx on public.media (created_at desc);

alter table public.dogs enable row level security;
alter table public.media enable row level security;
alter table public.site_content enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "anon_read_published_dogs" on public.dogs;
create policy "anon_read_published_dogs"
  on public.dogs for select
  to anon
  using (published = true and status <> 'unpublished');

drop policy if exists "authenticated_all_dogs" on public.dogs;
create policy "authenticated_all_dogs"
  on public.dogs for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "anon_read_published_media" on public.media;
create policy "anon_read_published_media"
  on public.media for select
  to anon
  using (
    published = true
    and (
      dog_id is null
      or exists (
        select 1 from public.dogs d
        where d.id = media.dog_id
          and d.published = true
          and d.status <> 'unpublished'
      )
    )
  );

drop policy if exists "authenticated_all_media" on public.media;
create policy "authenticated_all_media"
  on public.media for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "anon_read_site_content" on public.site_content;
create policy "anon_read_site_content"
  on public.site_content for select
  to anon
  using (true);

drop policy if exists "authenticated_all_site_content" on public.site_content;
create policy "authenticated_all_site_content"
  on public.site_content for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "anon_read_site_settings" on public.site_settings;
create policy "anon_read_site_settings"
  on public.site_settings for select
  to anon
  using (true);

drop policy if exists "authenticated_all_site_settings" on public.site_settings;
create policy "authenticated_all_site_settings"
  on public.site_settings for all
  to authenticated
  using (true)
  with check (true);

-- Storage
insert into storage.buckets (id, name, public)
values
  ('dog-media', 'dog-media', true),
  ('site-media', 'site-media', true)
on conflict (id) do update set public = true;

drop policy if exists "anon_read_dog_media" on storage.objects;
create policy "anon_read_dog_media"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id in ('dog-media', 'site-media'));

drop policy if exists "authenticated_insert_media" on storage.objects;
create policy "authenticated_insert_media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id in ('dog-media', 'site-media'));

drop policy if exists "authenticated_update_media" on storage.objects;
create policy "authenticated_update_media"
  on storage.objects for update
  to authenticated
  using (bucket_id in ('dog-media', 'site-media'))
  with check (bucket_id in ('dog-media', 'site-media'));

drop policy if exists "authenticated_delete_media" on storage.objects;
create policy "authenticated_delete_media"
  on storage.objects for delete
  to authenticated
  using (bucket_id in ('dog-media', 'site-media'));

-- Contenus initiaux (textes fournis / factuels uniquement)
insert into public.site_content (key, value) values
  ('hero_title', 'Les Protégés de Bianca'),
  ('hero_slogan', 'Petits chiens, grandes histoires.'),
  ('hero_intro', 'Bianca accueille chez elle, en famille, des chiens principalement petits à moyens. Les Protégés de Bianca soutient son action en Roumanie.'),
  ('home_intro', 'Chez Bianca, les chiens ne vivent pas à l’écart. Ils partagent la maison, le jardin et le quotidien d’une famille — aux côtés de son mari, de leurs enfants et de leurs propres chiens.

Les Protégés de Bianca fait connaître ces accueils. Les démarches d’adoption sont réalisées par notre association partenaire.'),
  ('bianca_section_title', 'Chez Bianca, ils apprennent la vie de famille.'),
  ('bianca_excerpt', 'Moi, c’est Bianca. Je tends la main aux petits chiens qui n’ont jamais eu la chance d’avoir une vraie famille.'),
  ('bianca_presentation', 'Moi, c’est Bianca. Je tends la main aux petits chiens qui n’ont jamais eu la chance d’avoir une vraie famille.

Grâce à mon travail, déjà 130 chiens ont trouvé leur famille pour la vie. Des mamans et leurs bébés, des chiots nés seuls dans la rue, des chiens abandonnés par des éleveurs, mais aussi des chiens que les aléas de la vie, comme un décès, ont laissés sans foyer…

Leur histoire est souvent différente, mais je les accueille tous avec le même amour. Ils n’ont rien fait de mal, si ce n’est d’avoir croisé la route de la solitude.

Chez moi, mes protégés ne vivent pas à l’écart. Ils apprennent ou réapprennent la vie au cœur d’une famille. Ils partagent notre maison, notre jardin et notre quotidien, aux côtés de mon mari, de nos deux enfants de 6 ans et 1 an, et de nos propres chiens. Ils connaissent la maison, la laisse.

C’est aussi ce qui me permet de vraiment les connaître : leur caractère, leurs petites habitudes, leurs ententes et leurs besoins. Je peux ainsi savoir quelle famille pourra leur correspondre.

Ils grandissent entourés d’humains, d’enfants et d’autres chiens, avec l’objectif de les préparer au mieux à leur future vie. Ils sont également suivis sur le plan sanitaire : vaccinés, déparasités et vermifugés avant leur départ.

Et puis arrive le moment que j’attends pour chacun d’entre eux : celui où sa famille le remarque enfin.

Offrir un foyer à l’un de mes protégés, ce n’est pas seulement changer la vie d’un chien.

C’est aussi laisser entrer dans la vôtre un amour immense.

Bianca

Petits chiens, grandes histoires.'),
  ('help_text', 'Vous pouvez soutenir l’accueil des protégés de Bianca. Les dons et le parrainage seront proposés ici dès qu’ils seront en place.'),
  ('adoption_text', 'Les démarches d’adoption sont réalisées par notre association partenaire {partner}.'),
  ('footer_text', ''),
  ('adopted_intro', 'Ils ont grandi chez Bianca. Voici celles et ceux qui ont depuis rejoint leur famille.')
on conflict (key) do nothing;

insert into public.site_settings (id, data) values (
  1,
  jsonb_build_object(
    'associationName', 'Les Protégés de Bianca',
    'slogan', 'Petits chiens, grandes histoires.',
    'logoPath', null,
    'heroMediaId', null,
    'biancaPhotoId', null,
    'email', null,
    'facebookUrl', null,
    'instagramUrl', null,
    'partnerAssociationName', 'Les Pattes Oubliées',
    'adoptionFormUrl', null,
    'donationUrl', null,
    'donationsActive', false,
    'sponsorshipUrl', null,
    'sponsorshipActive', false,
    'supportUrl', null,
    'supportActive', false,
    'donationButtonText', 'Faire un don',
    'sponsorshipButtonText', 'Parrainer / aider un protégé',
    'supportButtonText', 'Soutenir l’association',
    'adoptionLegalText', 'Les démarches d’adoption sont réalisées par notre association partenaire.',
    'rna', 'W951002589',
    'maxPhotoSizeMb', 10,
    'maxVideoSizeMb', 80
  )
)
on conflict (id) do nothing;

insert into public.dogs (name, slug, sex, birth_date, status, published, sort_order)
values
  ('Fred', 'fred', 'male', '2026-05-10', 'available', true, 10),
  ('Francky', 'francky', 'male', '2026-05-10', 'available', true, 20),
  ('Fadette', 'fadette', 'female', '2026-05-10', 'available', true, 30),
  ('Florie', 'florie', 'female', '2026-05-10', 'available', true, 40),
  ('Filomène', 'filomene', 'female', '2026-05-10', 'available', true, 50),
  ('Fiona', 'fiona', 'female', '2026-05-10', 'available', true, 60)
on conflict (slug) do nothing;

grant usage on schema public to anon, authenticated;
grant select on table public.dogs, public.media, public.site_content, public.site_settings to anon, authenticated;
grant insert, update, delete on table public.dogs, public.media, public.site_content, public.site_settings to authenticated;
