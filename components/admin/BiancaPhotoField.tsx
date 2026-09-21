"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { saveBiancaPhotoAction } from "@/lib/actions";
import { siteMediaUrl } from "@/lib/media";
import { createClient } from "@/lib/supabase/client";
import { validateMediaFile } from "@/lib/utils";

export function BiancaPhotoField({
  currentUrl,
  maxPhotoMb,
}: {
  currentUrl: string | null;
  maxPhotoMb: number;
}) {
  const router = useRouter();
  const [previewUrl, setPreviewUrl] = useState(currentUrl);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setPreviewUrl(currentUrl);
  }, [currentUrl]);

  async function persistPath(path: string | null, remove = false) {
    const formData = new FormData();
    if (path) formData.set("biancaPhotoPath", path);
    if (remove) formData.set("remove", "1");
    return saveBiancaPhotoAction(formData);
  }

  async function uploadPhoto(files: FileList | null) {
    if (!files?.[0]) return;
    const file = files[0];
    const problem = validateMediaFile(file, "photo", maxPhotoMb);
    if (problem) {
      setError(problem);
      setMessage(null);
      return;
    }

    setBusy(true);
    setError(null);
    setMessage(null);
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    try {
      const supabase = createClient();
      const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "-").slice(-80);
      const path = `bianca/${Date.now()}-${safeName}`;
      const { error: uploadError } = await supabase.storage.from("site-media").upload(path, file, {
        upsert: true,
      });
      if (uploadError) {
        setPreviewUrl(currentUrl);
        setError("Le fichier n’a pas pu être envoyé.");
        return;
      }

      const result = await persistPath(path);
      if (result.error) {
        setPreviewUrl(currentUrl);
        setError(result.error);
        return;
      }

      setPreviewUrl(siteMediaUrl(path) ?? localPreview);
      setMessage(result.success ?? "La photo de Bianca a été enregistrée.");
      router.refresh();
    } catch {
      setPreviewUrl(currentUrl);
      setError("Le fichier n’a pas pu être envoyé.");
    } finally {
      URL.revokeObjectURL(localPreview);
      setBusy(false);
    }
  }

  async function removePhoto() {
    if (!confirm("Retirer la photo de Bianca de l’accueil ?")) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const result = await persistPath(null, true);
      if (result.error) {
        setError(result.error);
        return;
      }
      setPreviewUrl(null);
      setMessage(result.success ?? "La photo de Bianca a été retirée.");
      router.refresh();
    } catch {
      setError("La photo n’a pas pu être retirée.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="photo-frame rounded-2xl p-5">
      <p className="admin-label">Photo de Bianca</p>
      <p className="mt-1 text-sm text-muted">
        Cette photo s’affiche à côté de la présentation, sur la page d’accueil.
      </p>

      {previewUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={previewUrl}
          alt="Photo actuelle de Bianca"
          className="mt-4 h-48 w-36 rounded-xl object-cover object-center"
        />
      ) : (
        <p className="mt-4 text-sm text-muted">Aucune photo pour le moment.</p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label className="btn btn-ghost cursor-pointer">
          {previewUrl ? "Remplacer la photo" : "Importer une photo"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
            className="sr-only"
            disabled={busy}
            onChange={(event) => {
              void uploadPhoto(event.target.files);
              event.target.value = "";
            }}
          />
        </label>
        {previewUrl ? (
          <button type="button" className="btn btn-ghost" disabled={busy} onClick={() => void removePhoto()}>
            Supprimer la photo
          </button>
        ) : null}
      </div>

      <p className="mt-2 text-xs text-muted">JPG, PNG ou WebP — {maxPhotoMb} Mo maximum.</p>
      {busy ? <p className="mt-2 text-sm text-muted">Envoi en cours…</p> : null}
      {error ? (
        <p className="mt-2 text-sm text-[var(--danger)]" role="alert">
          {error}
        </p>
      ) : null}
      {message ? <p className="mt-2 text-sm text-[var(--ok)]">{message}</p> : null}
    </div>
  );
}
