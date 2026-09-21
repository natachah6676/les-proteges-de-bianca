import { ContentForm } from "@/components/admin/ContentForm";
import { getBiancaHomePhoto, getContent, getSettings } from "@/lib/data";

export default async function ContentPage() {
  const [content, settings] = await Promise.all([getContent(), getSettings()]);
  const biancaPhoto = await getBiancaHomePhoto(settings);

  return (
    <div>
      <h1 className="font-serif text-3xl">Textes du site</h1>
      <p className="mt-2 mb-6 max-w-2xl text-ink-soft">
        Modifiez ici les textes visibles par les visiteurs, y compris la présentation de Bianca.
      </p>
      <ContentForm
        content={content}
        biancaPhotoUrl={biancaPhoto?.url ?? null}
        maxPhotoMb={settings.maxPhotoSizeMb}
      />
    </div>
  );
}
