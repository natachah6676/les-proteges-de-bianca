import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SiteShell } from "@/components/layout/SiteShell";
import { Gallery } from "@/components/media/Gallery";
import { PhotoFrame } from "@/components/media/PhotoFrame";
import { VideoBlock } from "@/components/media/VideoBlock";
import { getContent, getDogBySlug, getSettings } from "@/lib/data";
import { imageAlt, mediaPublicUrl } from "@/lib/media";
import {
  formatBirthDate,
  formatDateFr,
  interpolatePartner,
  sexLabel,
  statusLabel,
} from "@/lib/utils";
import type { DogWithMedia, Media } from "@/lib/types";

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
      <dd className="min-w-0 break-words font-medium">{value}</dd>
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

function Story({ text }: { text: string | null }) {
  if (!text?.trim()) return null;
  return (
    <section className="mt-8 min-w-0">
      <h2 className="font-serif text-2xl sm:text-3xl">Son histoire</h2>
      <p className="prose-site mt-3 text-ink-soft">{text}</p>
    </section>
  );
}

function importedVideos(media: Media[]) {
  return media.filter((item) => item.media_type === "video" && item.storage_path);
}

function ImportedVideos({ items, dogName }: { items: Media[]; dogName: string }) {
  const videos = importedVideos(items);
  if (videos.length === 0) return null;

  return (
    <section className="min-w-0">
      <h2 className="font-serif text-2xl sm:text-3xl">Vidéos</h2>
      <div className="mt-4 grid gap-4">
        {videos.map((video) => (
          <VideoBlock
            key={video.id}
            media={video}
            title={video.caption || `Vidéo de ${dogName}`}
          />
        ))}
      </div>
    </section>
  );
}

export default async function DogPage({ params }: Props) {
  const { slug } = await params;
  const preview = await canPreview();
  const dog = await getDogBySlug(slug, { includeUnpublished: preview });
  if (!dog) notFound();

  const [settings, content] = await Promise.all([getSettings(), getContent()]);
  const photos = dog.media.filter((item) => item.media_type === "photo");
  const videos = importedVideos(dog.media);
  const mainSrc = dog.mainPhoto ? mediaPublicUrl(dog.mainPhoto) : null;
  const showAdoption = dog.status === "available" || dog.status === "reserved";
  const facebookUrl = dog.facebook_url?.trim() || null;
  const adoptionText = interpolatePartner(
    content.adoption_text,
    settings.partnerAssociationName,
  );

  return (
    <SiteShell current="/nos-proteges">
      <article className="container-page overflow-x-clip py-10">
        <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start lg:gap-10">
          <div className="contents min-w-0 lg:flex lg:flex-col lg:gap-6">
            <div className="order-1 min-w-0 space-y-6 lg:order-none">
              <div className="photo-frame overflow-hidden rounded-[1.6rem]">
                <PhotoFrame
                  src={mainSrc}
                  alt={imageAlt(dog.mainPhoto?.caption, `Portrait de ${dog.name}`)}
                  emptyLabel="Les photos arrivent bientôt."
                  className="min-h-80"
                  imgClassName="object-cover"
                />
              </div>

              {photos.length > 0 ? (
                <section className="min-w-0">
                  <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                    <h2 className="font-serif text-2xl sm:text-3xl">Galerie</h2>
                    <p className="text-sm text-muted">
                      {photos.length} photo{photos.length > 1 ? "s" : ""}
                      {videos.length > 0
                        ? ` · ${videos.length} vidéo${videos.length > 1 ? "s" : ""}`
                        : null}
                    </p>
                  </div>
                  <Gallery
                    items={photos}
                    dogName={dog.name}
                    photosOnly
                    columnsClassName="columns-2 gap-3"
                  />
                </section>
              ) : null}
            </div>

            {videos.length > 0 ? (
              <div className="order-3 min-w-0 lg:order-none">
                <ImportedVideos items={dog.media} dogName={dog.name} />
              </div>
            ) : null}
          </div>

          <div className="contents min-w-0 lg:flex lg:flex-col">
            <div className="order-2 min-w-0 lg:order-none">
              <header>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-raspberry">
                  {statusLabel(dog.status)}
                </p>
                <h1 className="mt-2 break-words font-serif text-4xl sm:text-5xl">{dog.name}</h1>
                <dl className="mt-6 grid grid-cols-1 gap-4 min-[28rem]:grid-cols-2">
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

              <Story text={dog.story} />
              <HealthCares dog={dog} />

              {dog.additional_info?.trim() ? (
                <section className="mt-8 min-w-0">
                  <h2 className="font-serif text-2xl">Autres informations</h2>
                  <p className="prose-site mt-3 text-ink-soft">{dog.additional_info}</p>
                </section>
              ) : null}
            </div>

            {showAdoption || facebookUrl ? (
              <div className="order-4 min-w-0 lg:order-none">
                <SheetActions
                  dog={dog}
                  showAdoption={showAdoption}
                  adoptionText={adoptionText}
                  adoptionUrl={settings.adoptionFormUrl}
                  facebookUrl={facebookUrl}
                />
              </div>
            ) : null}
          </div>
        </div>
      </article>
    </SiteShell>
  );
}

function SheetActions({
  dog,
  showAdoption,
  adoptionText,
  adoptionUrl,
  facebookUrl,
}: {
  dog: DogWithMedia;
  showAdoption: boolean;
  adoptionText: string;
  adoptionUrl: string | null;
  facebookUrl: string | null;
}) {
  if (!showAdoption && !facebookUrl) return null;

  return (
    <section className="photo-frame mt-8 rounded-[1.5rem] p-6 sm:p-8">
      {showAdoption ? (
        <>
          <h2 className="font-serif text-3xl text-bordeaux-deep">Vous souhaitez adopter {dog.name} ?</h2>
          <p className="mt-3 text-ink-soft">{adoptionText}</p>
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
        </>
      ) : null}

      {facebookUrl ? (
        <div className={showAdoption ? "mt-8" : undefined}>
          <h2 className={`font-serif text-bordeaux-deep ${showAdoption ? "text-2xl" : "text-3xl"}`}>
            Vous voulez voir sa fiche sur Facebook ?
          </h2>
          <a
            href={facebookUrl}
            className="btn btn-ghost mt-6"
            target="_blank"
            rel="noopener noreferrer"
          >
            Voir {dog.name} sur Facebook
          </a>
        </div>
      ) : null}
    </section>
  );
}
