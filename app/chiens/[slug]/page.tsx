import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SiteShell } from "@/components/layout/SiteShell";
import { Gallery } from "@/components/media/Gallery";
import { PhotoFrame } from "@/components/media/PhotoFrame";
import { getContent, getDogBySlug, getSettings } from "@/lib/data";
import { imageAlt, mediaPublicUrl } from "@/lib/media";
import {
  formatBirthDate,
  formatDateFr,
  interpolatePartner,
  sexLabel,
  statusLabel,
} from "@/lib/utils";
import type { DogWithMedia } from "@/lib/types";

type Props = { params: Promise<{ slug: string }> };

async function canPreview() {
  const supabase = await createClient();
  if (!supabase) return false;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return Boolean(user);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const dog = await getDogBySlug(slug, { includeUnpublished: await canPreview() });
  if (!dog) return { title: "Chien introuvable" };

  const description = dog.short_summary?.trim()
    ? dog.short_summary
    : `${dog.name} est accueilli chez Bianca. Découvrir sa fiche, ses photos et les modalités d’adoption.`;

  return {
    title: dog.name,
    description,
    openGraph: {
      title: `${dog.name} | Les Protégés de Bianca`,
      description,
    },
  };
}

function Info({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}

function HealthCares({ dog }: { dog: DogWithMedia }) {
  const cares = [
    { label: "Vacciné", done: dog.is_vaccinated },
    { label: "Identifié", done: dog.is_identified },
    { label: "Vermifugé", done: dog.is_dewormed },
    { label: "Déparasité", done: dog.is_parasite_treated },
  ].filter((item) => item.done);

  if (cares.length === 0) return null;

  return (
    <section className="mt-8" aria-label="Soins">
      <ul className="flex flex-wrap gap-2">
        {cares.map((item) => (
          <li
            key={item.label}
            className="rounded-full bg-cream px-3.5 py-2 text-[0.95rem] text-ink"
          >
            <span aria-hidden="true">✓ </span>
            {item.label}
          </li>
        ))}
      </ul>
    </section>
  );
}

function Section({ title, text }: { title: string; text: string | null }) {
  if (!text?.trim()) return null;
  return (
    <section className="mt-8">
      <h2 className="font-serif text-2xl sm:text-3xl">{title}</h2>
      <p className="prose-site mt-3 text-ink-soft">{text}</p>
    </section>
  );
}

export default async function DogPage({ params }: Props) {
  const { slug } = await params;
  const preview = await canPreview();
  const dog = await getDogBySlug(slug, { includeUnpublished: preview });
  if (!dog) notFound();

  const [settings, content] = await Promise.all([getSettings(), getContent()]);
  const photoCount = dog.media.filter((item) => item.media_type === "photo").length;
  const videoCount = dog.media.filter((item) => item.media_type === "video").length;
  const mainSrc = dog.mainPhoto ? mediaPublicUrl(dog.mainPhoto) : null;
  const showAdoption = dog.status === "available" || dog.status === "reserved";
  const adoptionText = interpolatePartner(
    content.adoption_text,
    settings.partnerAssociationName,
  );

  return (
    <SiteShell current="/nos-proteges">
      <article className="container-page py-10">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="photo-frame overflow-hidden rounded-[1.6rem]">
            <PhotoFrame
              src={mainSrc}
              alt={imageAlt(dog.mainPhoto?.caption, `Portrait de ${dog.name}`)}
              emptyLabel="Les photos arrivent bientôt."
              className="min-h-80"
              imgClassName="object-cover"
            />
          </div>
          <header>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-raspberry">
              {statusLabel(dog.status)}
            </p>
            <h1 className="mt-2 font-serif text-5xl">{dog.name}</h1>
            <dl className="mt-6 grid grid-cols-2 gap-4">
              <Info label="Sexe" value={sexLabel(dog.sex)} />
              <Info
                label="Naissance"
                value={formatBirthDate(dog.birth_date, dog.birth_date_approximate)}
              />
              <Info label="Localisation actuelle" value={dog.current_location} />
              <Info label="Taille estimée adulte" value={dog.estimated_size} />
              <Info label="Poids estimé" value={dog.estimated_weight} />
              <Info
                label="Adopté le"
                value={dog.status === "adopted" ? formatDateFr(dog.adoption_date) : null}
              />
            </dl>
          </header>
        </div>

        <Section title="Son histoire" text={dog.story} />

        <HealthCares dog={dog} />

        {dog.additional_info?.trim() ? (
          <section className="mt-8">
            <h2 className="font-serif text-2xl">Autres informations</h2>
            <p className="prose-site mt-3 text-ink-soft">{dog.additional_info}</p>
          </section>
        ) : null}

        <section className="mt-12">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <h2 className="font-serif text-3xl">Galerie</h2>
            {photoCount + videoCount > 0 ? (
              <p className="text-sm text-muted">
                {photoCount > 0 ? `${photoCount} photo${photoCount > 1 ? "s" : ""}` : null}
                {photoCount > 0 && videoCount > 0 ? " · " : null}
                {videoCount > 0 ? `${videoCount} vidéo${videoCount > 1 ? "s" : ""}` : null}
              </p>
            ) : null}
          </div>
          <Gallery items={dog.media} dogName={dog.name} />
        </section>

        {showAdoption ? (
          <AdoptionBlock
            dog={dog}
            adoptionText={adoptionText}
            adoptionUrl={settings.adoptionFormUrl}
          />
        ) : null}
      </article>
    </SiteShell>
  );
}

function AdoptionBlock({
  dog,
  adoptionText,
  adoptionUrl,
}: {
  dog: DogWithMedia;
  adoptionText: string;
  adoptionUrl: string | null;
}) {
  return (
    <section className="photo-frame mt-12 rounded-[1.5rem] p-6 sm:p-8">
      <h2 className="font-serif text-3xl">Vous souhaitez adopter {dog.name} ?</h2>
      <p className="mt-3 max-w-2xl text-ink-soft">{adoptionText}</p>
      {adoptionUrl?.trim() ? (
        <a
          href={adoptionUrl.trim()}
          className="btn btn-primary mt-6"
          target="_blank"
          rel="noopener noreferrer"
        >
          Faire une demande d’adoption
        </a>
      ) : null}
    </section>
  );
}
