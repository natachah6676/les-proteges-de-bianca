import { notFound } from "next/navigation";
import { DogForm } from "@/components/admin/DogForm";
import { getAdminDog, getSettings } from "@/lib/data";

export default async function EditDogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [dog, settings] = await Promise.all([getAdminDog(id), getSettings()]);
  if (!dog) notFound();

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl">Modifier {dog.name}</h1>
      <DogForm dog={dog} maxPhotoMb={settings.maxPhotoSizeMb} maxVideoMb={settings.maxVideoSizeMb} />
    </div>
  );
}
