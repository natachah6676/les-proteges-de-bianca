"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Media, MediaCategory } from "@/lib/types";
import { validateMediaFile } from "@/lib/utils";
import { mediaPublicUrl } from "@/lib/media";
import {
  createExternalVideoAction,
  deleteMediaAction,
  reorderDogMediaAction,
  saveMediaMetaAction,
  setMainPhotoAction,
} from "@/lib/actions";

type UploaderProps = {
  dogId?: string | null;
  category?: MediaCategory;
  maxPhotoMb: number;
  maxVideoMb: number;
  existing?: Media[];
  mainPhotoId?: string | null;
  bucket?: "dog-media" | "site-media";
};

export function MediaUploader({
  dogId = null,
  category = "other",
  maxPhotoMb,
  maxVideoMb,
  existing = [],
  mainPhotoId,
  bucket = "dog-media",
}: UploaderProps) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function uploadFiles(files: FileList | null, kind: "photo" | "video") {
    if (!files?.length) return;
    setError(null);
    setMessage(null);
    setBusy(true);

    try {
      const supabase = createClient();
      let uploaded = 0;

      for (const file of Array.from(files)) {
        const problem = validateMediaFile(
          file,
          kind,
          kind === "photo" ? maxPhotoMb : maxVideoMb,
        );
        if (problem) {
          setError(problem);
          continue;
        }

        const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "-").slice(-80);
        const folder = dogId ?? "library";
        const path = `${folder}/${Date.now()}-${safeName}`;
        const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, {
          cacheControl: "3600",
          upsert: false,
        });

        if (uploadError) {
          setError("Le fichier n’a pas pu être envoyé.");
          continue;
        }

        const { data: inserted, error: insertError } = await supabase
          .from("media")
          .insert({
            dog_id: dogId,
            media_type: kind,
            storage_path: path,
            caption: null,
            category: dogId ? "dog" : category,
            sort_order: existing.length + uploaded,
            published: true,
          })
          .select("id")
          .single();

        if (insertError || !inserted) {
          setError("Le fichier a été envoyé mais n’a pas pu être enregistré.");
          continue;
        }

        if (kind === "photo" && dogId && uploaded === 0) {
          const { data: currentDog } = await supabase
            .from("dogs")
            .select("main_photo_id")
            .eq("id", dogId)
            .maybeSingle();
          if (!currentDog?.main_photo_id) {
            await supabase.from("dogs").update({ main_photo_id: inserted.id }).eq("id", dogId);
          }
        }
        uploaded += 1;
      }

      if (uploaded > 0) {
        setMessage(
          uploaded === 1
            ? "Le fichier a été ajouté."
            : `${uploaded} fichiers ont été ajoutés.`,
        );
        router.refresh();
      }
    } catch {
      setError("Le fichier n’a pas pu être envoyé.");
    } finally {
      setBusy(false);
    }
  }

  const photos = existing.filter((item) => item.media_type === "photo");
  const videos = existing.filter((item) => item.media_type === "video");

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="photo-frame block cursor-pointer rounded-2xl p-4">
          <span className="admin-label">Ajouter des photos</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
            multiple
            className="mt-2 block w-full text-sm"
            disabled={busy}
            onChange={(event) => {
              void uploadFiles(event.target.files, "photo");
              event.target.value = "";
            }}
          />
          <p className="mt-2 text-xs text-muted">JPG, PNG ou WebP — {maxPhotoMb} Mo maximum par photo.</p>
        </label>
        <label className="photo-frame block cursor-pointer rounded-2xl p-4">
          <span className="admin-label">Ajouter des vidéos</span>
          <input
            type="file"
            accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
            multiple
            className="mt-2 block w-full text-sm"
            disabled={busy}
            onChange={(event) => {
              void uploadFiles(event.target.files, "video");
              event.target.value = "";
            }}
          />
          <p className="mt-2 text-xs text-muted">MP4, WebM ou MOV — {maxVideoMb} Mo maximum par vidéo.</p>
        </label>
      </div>

      <form action={createExternalVideoAction} className="photo-frame rounded-2xl p-4">
        <p className="admin-label">Ajouter une vidéo par lien</p>
        {dogId ? <input type="hidden" name="dog_id" value={dogId} /> : null}
        <input type="hidden" name="category" value={dogId ? "dog" : category} />
        <label className="sr-only" htmlFor="external_url">
          URL de la vidéo
        </label>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input
            id="external_url"
            name="external_url"
            type="url"
            className="admin-input"
            placeholder="https://"
          />
          <button type="submit" className="btn btn-ghost shrink-0">
            Ajouter le lien
          </button>
        </div>
      </form>

      {error ? (
        <p className="text-sm text-[var(--danger)]" role="alert">
          {error}
        </p>
      ) : null}
      {message ? <p className="text-sm text-[var(--ok)]">{message}</p> : null}
      {busy ? <p className="text-sm text-muted">Envoi en cours…</p> : null}

      {existing.length === 0 ? (
        <div className="empty-photo min-h-28 rounded-2xl">
          <p>
            {dogId
              ? "Ajoutez les premières photos de ce protégé."
              : "Ajoutez les premières photos ou vidéos."}
          </p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((item) => (
            <MediaAdminCard
              key={item.id}
              item={item}
              dogId={dogId}
              isMain={item.id === mainPhotoId}
            />
          ))}
          {videos.map((item) => (
            <MediaAdminCard key={item.id} item={item} dogId={dogId} />
          ))}
        </ul>
      )}
    </div>
  );
}

function MediaAdminCard({
  item,
  dogId,
  isMain,
}: {
  item: Media;
  dogId?: string | null;
  isMain?: boolean;
}) {
  const src = mediaPublicUrl(item);

  return (
    <li className="photo-frame overflow-hidden rounded-2xl">
      {item.media_type === "photo" && src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={item.caption || ""} className="h-40 w-full object-cover" />
      ) : (
        <div className="grid h-40 place-items-center bg-[#2a211c] text-sm text-white">Vidéo</div>
      )}
      <div className="space-y-2 p-3">
        <form action={saveMediaMetaAction} className="space-y-2">
          <input type="hidden" name="id" value={item.id} />
          <input type="hidden" name="category" value={item.category} />
          <input type="hidden" name="dog_id" value={dogId ?? item.dog_id ?? ""} />
          <input type="hidden" name="sort_order" value={item.sort_order} />
          <label className="sr-only" htmlFor={`caption-${item.id}`}>
            Légende
          </label>
          <input
            id={`caption-${item.id}`}
            name="caption"
            className="admin-input"
            defaultValue={item.caption ?? ""}
            placeholder="Légende"
          />
          <button type="submit" className="text-sm text-ink-soft hover:text-bordeaux">
            Enregistrer la légende
          </button>
        </form>
        <div className="flex flex-wrap gap-2">
          {dogId ? (
            <>
              <form action={reorderDogMediaAction}>
                <input type="hidden" name="id" value={item.id} />
                <input type="hidden" name="dog_id" value={dogId} />
                <input type="hidden" name="direction" value="up" />
                <button type="submit" className="text-sm text-ink-soft hover:text-bordeaux">
                  Monter
                </button>
              </form>
              <form action={reorderDogMediaAction}>
                <input type="hidden" name="id" value={item.id} />
                <input type="hidden" name="dog_id" value={dogId} />
                <input type="hidden" name="direction" value="down" />
                <button type="submit" className="text-sm text-ink-soft hover:text-bordeaux">
                  Descendre
                </button>
              </form>
              {item.media_type === "photo" ? (
                <form action={setMainPhotoAction}>
                  <input type="hidden" name="dog_id" value={dogId} />
                  <input type="hidden" name="media_id" value={item.id} />
                  <button type="submit" className="text-sm text-bordeaux">
                    {isMain ? "Photo principale" : "Choisir comme principale"}
                  </button>
                </form>
              ) : null}
            </>
          ) : null}
          <form
            action={deleteMediaAction}
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
      </div>
    </li>
  );
}
