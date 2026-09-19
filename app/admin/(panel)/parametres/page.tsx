import { SettingsForm } from "@/components/admin/SettingsForm";
import { getAdminMedia, getSettings } from "@/lib/data";

export default async function SettingsPage() {
  const [settings, media] = await Promise.all([getSettings(), getAdminMedia()]);
  const photos = media.filter((item) => item.media_type === "photo");

  return (
    <div>
      <h1 className="font-serif text-3xl">Paramètres</h1>
      <p className="mt-2 mb-6 max-w-2xl text-ink-soft">
        Nom, logo, réseaux, association partenaire et boutons d’aide.
      </p>
      <SettingsForm settings={settings} photos={photos} />
    </div>
  );
}
