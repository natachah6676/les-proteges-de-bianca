import { MediaLibrary } from "@/components/admin/MediaLibrary";
import { getAdminDogs, getAdminMedia, getSettings } from "@/lib/data";

export default async function AdminMediaPage() {
  const [items, dogs, settings] = await Promise.all([
    getAdminMedia(),
    getAdminDogs(),
    getSettings(),
  ]);

  return (
    <div>
      <h1 className="font-serif text-3xl">Médias</h1>
      <p className="mt-2 mb-6 max-w-2xl text-ink-soft">
        Ajoutez ici les photos et vidéos du quotidien, de Bianca ou de l’accueil. Les photos de chaque
        chien peuvent aussi être gérées depuis sa fiche.
      </p>
      <MediaLibrary
        items={items}
        dogs={dogs}
        maxPhotoMb={settings.maxPhotoSizeMb}
        maxVideoMb={settings.maxVideoSizeMb}
      />
    </div>
  );
}
