import Link from "next/link";
import { SiteShell } from "@/components/layout/SiteShell";
import { PhotoFrame } from "@/components/media/PhotoFrame";
import { getBiancaHomePhoto, getContent, getMediaById, getSettings } from "@/lib/data";
import { mediaPublicUrl } from "@/lib/media";

export default async function HomePage() {
  const [settings, content] = await Promise.all([getSettings(), getContent()]);
  const biancaPhoto = await getBiancaHomePhoto(settings);
  const heroPhoto = await getMediaById(settings.heroMediaId);
  const heroUrl = heroPhoto ? mediaPublicUrl(heroPhoto) : null;
  const presentation = content.bianca_presentation || content.bianca_excerpt;
  const paragraphs = presentation
    .replace(/\r\n/g, "\n")
    .split(/\n\n+/)
    .map((part) => part.trim())
    .filter(Boolean);

  return (
    <SiteShell current="/">
      <section className="home-banner" aria-label="Identité">
        {heroUrl ? (
          <div className="home-banner-media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={heroUrl} alt="" />
          </div>
        ) : (
          <HomeBannerDecor />
        )}
        <div className="container-page home-banner-copy">
          <p className="home-banner-title">Des petits chiens, grandes histoires</p>
          <p className="home-banner-kicker">Sauver · Soigner · Protéger · Offrir un avenir</p>
        </div>
      </section>

      <section
        id="bianca"
        className={`container-page mt-8 mb-16 scroll-mt-24 ${
          biancaPhoto
            ? "grid items-start gap-6 lg:mt-10 lg:grid-cols-[minmax(18rem,26rem)_minmax(0,1fr)] lg:gap-10"
            : "mx-auto max-w-3xl lg:mt-10"
        }`}
      >
        {biancaPhoto ? (
          <div className="relative mx-auto w-full max-w-[24rem] lg:mx-0 lg:max-w-none">
            <div className="home-photo-back" aria-hidden="true" />
            <div className="photo-frame relative aspect-[3/4] overflow-hidden rounded-[1.6rem]">
              <PhotoFrame
                src={biancaPhoto.url}
                alt={biancaPhoto.alt}
                className="absolute inset-0 h-full w-full"
                imgClassName="object-cover object-center"
              />
            </div>
          </div>
        ) : null}
        <div>
          <p className="mb-3 h-6 w-6 text-raspberry" aria-hidden="true">
            <HeartMark />
          </p>
          <h1 className="font-serif text-[2.35rem] leading-[1.12] text-bordeaux-deep sm:text-5xl">
            <span className="home-title-mark">Chez Bianca,</span>
            <span className="mt-1 block italic text-[0.92em] text-bordeaux">en Roumanie</span>
          </h1>
          {paragraphs.length > 0 ? (
            <div className="home-story mt-6 text-[1.08rem] leading-[1.8] text-ink">
              {paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          ) : null}
          <Link href="/nos-proteges" className="home-cta mt-9">
            Voir nos protégés à adopter
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}

function HomeBannerDecor() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <span className="home-deco top-4 left-[6%] h-7 w-7">
        <PawMark />
      </span>
      <span className="home-deco right-[7%] bottom-3 h-5 w-5">
        <HeartMark />
      </span>
    </div>
  );
}

function PawMark() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full">
      <circle cx="7" cy="6.5" r="2.1" />
      <circle cx="12" cy="4.6" r="2.2" />
      <circle cx="17" cy="6.5" r="2.1" />
      <circle cx="19.2" cy="11" r="1.8" />
      <ellipse cx="11.5" cy="16.2" rx="5.4" ry="4.2" />
    </svg>
  );
}

function HeartMark() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full">
      <path d="M12 20.4S4.8 15.5 2.7 11.7C1.3 9.1 2 5.8 4.8 4.6c2-.9 4.3-.1 7.2 2.8 2.9-2.9 5.2-3.7 7.2-2.8 2.8 1.2 3.5 4.5 2.1 7.1C19.2 15.5 12 20.4 12 20.4z" />
    </svg>
  );
}
