import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { Gallery } from "@/components/media/Gallery";
import { PhotoFrame } from "@/components/media/PhotoFrame";
import { getBiancaMedia, getContent, getMediaById, getSettings } from "@/lib/data";
import { imageAlt, mediaPublicUrl } from "@/lib/media";

export const metadata: Metadata = {
  title: "Bianca",
  description:
    "Bianca accueille chez elle, en famille, des chiens principalement petits à moyens, en Roumanie.",
};

export default async function BiancaPage() {
  const [settings, content, gallery] = await Promise.all([
    getSettings(),
    getContent(),
    getBiancaMedia(),
  ]);
  const photo = await getMediaById(settings.biancaPhotoId);
  const portrait = photo ? mediaPublicUrl(photo) : null;

  return (
    <SiteShell current="/bianca">
      <section className="container-page grid gap-8 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="photo-frame overflow-hidden rounded-[1.6rem]">
          <PhotoFrame
            src={portrait}
            alt={imageAlt(photo?.caption, "Bianca")}
            emptyLabel="Les photos arrivent bientôt."
            className="min-h-80"
          />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-raspberry">
            Accueil familial
          </p>
          <h1 className="mt-2 font-serif text-4xl sm:text-5xl">Moi, c’est Bianca.</h1>
          <div className="prose-site mt-6 max-w-2xl text-[1.05rem] text-ink">
            {content.bianca_presentation || content.bianca_excerpt}
          </div>
        </div>
      </section>

      <section className="container-page pb-12">
        <h2 className="font-serif text-3xl">Chez Bianca</h2>
        <p className="mt-2 mb-6 max-w-2xl text-ink-soft">
          Photos et vidéos du quotidien, au milieu de la maison et de la famille.
        </p>
        <Gallery items={gallery} dogName="Bianca" />
      </section>
    </SiteShell>
  );
}
