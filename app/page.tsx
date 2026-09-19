import Link from "next/link";
import { SiteShell } from "@/components/layout/SiteShell";
import { DogCard } from "@/components/dogs/DogCard";
import { HelpCards } from "@/components/help/HelpCards";
import { PhotoFrame } from "@/components/media/PhotoFrame";
import { VideoBlock } from "@/components/media/VideoBlock";
import {
  getContent,
  getMediaById,
  getPublishedDogs,
  getRecentLifestyleMedia,
  getSettings,
} from "@/lib/data";
import { imageAlt, mediaPublicUrl } from "@/lib/media";

export default async function HomePage() {
  const [settings, content, dogs, lifestyle] = await Promise.all([
    getSettings(),
    getContent(),
    getPublishedDogs({ statuses: ["available", "reserved"], limit: 6 }),
    getRecentLifestyleMedia(6),
  ]);
  const [heroMedia, biancaPhoto] = await Promise.all([
    getMediaById(settings.heroMediaId),
    getMediaById(settings.biancaPhotoId),
  ]);

  const heroUrl = heroMedia ? mediaPublicUrl(heroMedia) : null;
  const biancaUrl = biancaPhoto ? mediaPublicUrl(biancaPhoto) : null;

  return (
    <SiteShell current="/">
      <section className="container-page mt-6 grid items-stretch gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="flex flex-col justify-center rounded-[1.8rem] bg-paper px-6 py-10 shadow-[0_10px_30px_rgba(70,42,32,0.06)] sm:px-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-raspberry">
            Association
          </p>
          <h1 className="mt-3 font-serif text-4xl text-bordeaux-deep sm:text-5xl">
            {content.hero_title || "Les Protégés de Bianca"}
          </h1>
          <p className="mt-3 font-serif text-xl italic text-ink-soft sm:text-2xl">
            {content.hero_slogan || settings.slogan}
          </p>
          {content.hero_intro ? (
            <p className="mt-5 max-w-xl text-ink-soft">{content.hero_intro}</p>
          ) : null}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/nos-proteges" className="btn btn-primary">
              Découvrir nos protégés
            </Link>
            <Link href="/bianca" className="btn btn-ghost">
              Découvrir Bianca
            </Link>
          </div>
        </div>
        <div className="photo-frame min-h-[280px] overflow-hidden rounded-[1.8rem]">
          <PhotoFrame
            src={heroUrl}
            alt={imageAlt(heroMedia?.caption, "Chez Bianca, avec les chiens")}
            emptyLabel="Les photos arrivent bientôt."
            className="h-full min-h-[280px] lg:min-h-[460px]"
            imgClassName="object-cover"
          />
        </div>
      </section>

      {content.home_intro ? (
        <section className="container-page mt-16 max-w-3xl">
          <p className="prose-site text-lg text-ink-soft">{content.home_intro}</p>
        </section>
      ) : null}

      <section className="container-page mt-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-serif text-3xl sm:text-4xl">À la recherche de leur famille</h2>
          <Link href="/nos-proteges" className="btn btn-ghost">
            Voir tous nos protégés
          </Link>
        </div>
        {dogs.length === 0 ? (
          <p className="text-ink-soft">Les fiches des protégés seront publiées ici.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {dogs.map((dog) => (
              <DogCard key={dog.id} dog={dog} />
            ))}
          </div>
        )}
      </section>

      <section className="container-page mt-16 grid items-center gap-8 lg:grid-cols-2">
        <div className="photo-frame overflow-hidden rounded-[1.6rem]">
          <PhotoFrame
            src={biancaUrl}
            alt={imageAlt(biancaPhoto?.caption, "Bianca avec ses protégés")}
            emptyLabel="Les photos arrivent bientôt."
            className="min-h-72"
          />
        </div>
        <div>
          <h2 className="font-serif text-3xl sm:text-4xl">
            {content.bianca_section_title || "Chez Bianca, ils apprennent la vie de famille."}
          </h2>
          {content.bianca_excerpt ? (
            <p className="mt-4 text-lg text-ink-soft">{content.bianca_excerpt}</p>
          ) : null}
          <Link href="/bianca" className="btn btn-primary mt-6">
            Découvrir Bianca et son histoire
          </Link>
        </div>
      </section>

      <section className="container-page mt-16">
        <h2 className="font-serif text-3xl sm:text-4xl">Leur quotidien chez Bianca</h2>
        {lifestyle.length === 0 ? (
          <div className="empty-photo mt-6 min-h-40 rounded-[1.4rem]">
            <p>Les photos arrivent bientôt.</p>
          </div>
        ) : (
          <div className="mt-6 columns-2 gap-3 sm:columns-3">
            {lifestyle.map((item) => {
              if (item.media_type === "video") {
                return (
                  <div key={item.id} className="mb-3 break-inside-avoid">
                    <VideoBlock media={item} title={item.caption || "Vidéo du quotidien"} />
                  </div>
                );
              }
              const src = mediaPublicUrl(item);
              if (!src) return null;
              return (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={item.id}
                  src={src}
                  alt={imageAlt(item.caption, "Instant du quotidien chez Bianca")}
                  className="mb-3 w-full break-inside-avoid rounded-xl"
                />
              );
            })}
          </div>
        )}
      </section>

      <section className="container-page mt-16 mb-8">
        <h2 className="font-serif text-3xl sm:text-4xl">Nous aider</h2>
        {content.help_text ? (
          <p className="mt-3 mb-8 max-w-2xl text-ink-soft">{content.help_text}</p>
        ) : (
          <div className="mb-8" />
        )}
        <HelpCards settings={settings} />
      </section>
    </SiteShell>
  );
}
