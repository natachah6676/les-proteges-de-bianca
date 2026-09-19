import { DogForm } from "@/components/admin/DogForm";
import { getSettings } from "@/lib/data";

export default async function NewDogPage() {
  const settings = await getSettings();

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl">Nouveau chien</h1>
      <DogForm maxPhotoMb={settings.maxPhotoSizeMb} maxVideoMb={settings.maxVideoSizeMb} />
    </div>
  );
}
