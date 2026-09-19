"use client";

import { deleteMediaAction, saveMediaMetaAction } from "@/lib/actions";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { mediaPublicUrl } from "@/lib/media";
import type { Dog, Media, MediaCategory } from "@/lib/types";

const categories: Array<{ value: MediaCategory; label: string }> = [
  { value: "dog", label: "Chien" },
  { value: "bianca", label: "Bianca" },
  { value: "daily", label: "Quotidien" },
  { value: "hero", label: "Accueil" },
  { value: "other", label: "Autre" },
];

type Item = Media & { dog_name?: string | null };

export function MediaLibrary({
  items,
  dogs,
  maxPhotoMb,
  maxVideoMb,
}: {
  items: Item[];
  dogs: Dog[];
  maxPhotoMb: number;
  maxVideoMb: number;
}) {
  return (
    <div className="space-y-8">
      <MediaUploader category="daily" maxPhotoMb={maxPhotoMb} maxVideoMb={maxVideoMb} bucket="dog-media" />
      <ul className="space-y-4">
        {items.map((item) => {
          const src = mediaPublicUrl(item);
          return (
            <li key={item.id} className="photo-frame rounded-2xl p-4">
              <div className="grid gap-4 md:grid-cols-[160px_minmax(0,1fr)]">
                {item.media_type === "photo" && src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={src} alt={item.caption || ""} className="h-36 w-full rounded-xl object-cover" />
                ) : (
                  <div className="grid h-36 place-items-center rounded-xl bg-[#2a211c] text-white">
                    Vidéo
                  </div>
                )}
                <form action={saveMediaMetaAction} className="grid gap-3 sm:grid-cols-2">
                  <input type="hidden" name="id" value={item.id} />
                  <div className="sm:col-span-2">
                    <label className="admin-label" htmlFor={`caption-${item.id}`}>
                      Légende
                    </label>
                    <input
                      id={`caption-${item.id}`}
                      name="caption"
                      className="admin-input"
                      defaultValue={item.caption ?? ""}
                    />
                  </div>
                  <div>
                    <label className="admin-label" htmlFor={`category-${item.id}`}>
                      Catégorie
                    </label>
                    <select
                      id={`category-${item.id}`}
                      name="category"
                      className="admin-select"
                      defaultValue={item.category}
                    >
                      {categories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="admin-label" htmlFor={`dog-${item.id}`}>
                      Chien associé
                    </label>
                    <select
                      id={`dog-${item.id}`}
                      name="dog_id"
                      className="admin-select"
                      defaultValue={item.dog_id ?? ""}
                    >
                      <option value="">Aucun</option>
                      {dogs.map((dog) => (
                        <option key={dog.id} value={dog.id}>
                          {dog.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="admin-label" htmlFor={`order-${item.id}`}>
                      Ordre
                    </label>
                    <input
                      id={`order-${item.id}`}
                      name="sort_order"
                      type="number"
                      className="admin-input"
                      defaultValue={item.sort_order}
                    />
                  </div>
                  <div className="flex items-end gap-3">
                    <button type="submit" className="btn btn-ghost">
                      Enregistrer
                    </button>
                  </div>
                </form>
                <form
                  action={deleteMediaAction}
                  className="md:col-start-2"
                  onSubmit={(event) => {
                    if (!confirm("Supprimer ce média ?")) event.preventDefault();
                  }}
                >
                  <input type="hidden" name="id" value={item.id} />
                  <button type="submit" className="text-sm text-[var(--danger)]">
                    Supprimer
                  </button>
                </form>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
