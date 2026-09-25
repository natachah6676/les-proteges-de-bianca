"use client";

import { useActionState, useState } from "react";
import { saveSettingsAction } from "@/lib/actions";
import { createClient } from "@/lib/supabase/client";
import { siteMediaUrl } from "@/lib/media";
import { validateMediaFile } from "@/lib/utils";
import type { Media, SiteSettings } from "@/lib/types";

export function SettingsForm({
  settings,
  photos,
}: {
  settings: SiteSettings;
  photos: Media[];
}) {
  const [logoPath, setLogoPath] = useState(settings.logoPath ?? "");
  const [logoError, setLogoError] = useState<string | null>(null);
  const [logoBusy, setLogoBusy] = useState(false);
  const [state, action, pending] = useActionState(
    async (_prev: { error?: string; success?: string } | null, formData: FormData) => {
      return saveSettingsAction(formData);
    },
    null,
  );

  async function uploadLogo(files: FileList | null) {
    if (!files?.[0]) return;
    const file = files[0];
    const problem = validateMediaFile(file, "photo", settings.maxPhotoSizeMb);
    if (problem) {
      setLogoError(problem);
      return;
    }
    setLogoBusy(true);
    setLogoError(null);
    try {
      const supabase = createClient();
      const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "-").slice(-80);
      const path = `logo/${Date.now()}-${safeName}`;
      const { error } = await supabase.storage.from("site-media").upload(path, file, {
        upsert: true,
      });
      if (error) {
        setLogoError("Le fichier n’a pas pu être envoyé.");
        return;
      }
      setLogoPath(path);
    } catch {
      setLogoError("Le fichier n’a pas pu être envoyé.");
    } finally {
      setLogoBusy(false);
    }
  }

  const logoUrl = siteMediaUrl(logoPath);

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="logoPath" value={logoPath} />

      <section className="photo-frame rounded-2xl p-5">
        <h2 className="font-serif text-2xl">Identité</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field id="associationName" label="Nom de l’association" defaultValue={settings.associationName} />
          <Field id="slogan" label="Slogan" defaultValue={settings.slogan} />
          <Field id="rna" label="RNA" defaultValue={settings.rna} />
          <Field id="email" label="E-mail" type="email" defaultValue={settings.email ?? ""} />
        </div>
        <div className="mt-4">
          <p className="admin-label">Logo</p>
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="Logo actuel" className="mb-3 h-16 w-auto object-contain" />
          ) : (
            <p className="mb-3 text-sm text-muted">Aucun logo pour le moment.</p>
          )}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
            onChange={(event) => {
              void uploadLogo(event.target.files);
              event.target.value = "";
            }}
          />
          {logoBusy ? <p className="mt-2 text-sm text-muted">Envoi du logo…</p> : null}
          {logoError ? (
            <p className="mt-2 text-sm text-[var(--danger)]" role="alert">
              {logoError}
            </p>
          ) : null}
        </div>
      </section>

      <section className="photo-frame rounded-2xl p-5">
        <h2 className="font-serif text-2xl">Photos d’accueil</h2>
        <p className="mt-1 text-sm text-muted">
          Choisissez une photo déjà envoyée dans Médias. Si aucune n’est choisie, un emplacement neutre
          s’affiche.
        </p>
        <div className="mt-4">
          <label className="admin-label" htmlFor="heroMediaId">
            Photo du bandeau d’accueil
          </label>
          <select
            id="heroMediaId"
            name="heroMediaId"
            className="admin-select"
            defaultValue={settings.heroMediaId ?? ""}
          >
            <option value="">Aucune</option>
            {photos.map((photo) => (
              <option key={photo.id} value={photo.id}>
                {photo.caption || photo.storage_path || photo.id.slice(0, 8)}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="photo-frame rounded-2xl p-5">
        <h2 className="font-serif text-2xl">Réseaux et contact</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field id="facebookUrl" label="Facebook" type="url" defaultValue={settings.facebookUrl ?? ""} />
          <Field id="instagramUrl" label="Instagram" type="url" defaultValue={settings.instagramUrl ?? ""} />
          <Field id="tiktokUrl" label="TikTok" type="url" defaultValue={settings.tiktokUrl ?? ""} />
        </div>
      </section>

      <section className="photo-frame rounded-2xl p-5">
        <h2 className="font-serif text-2xl">Adoption</h2>
        <div className="mt-4 grid gap-4">
          <Field
            id="partnerAssociationName"
            label="Nom de l’association partenaire"
            defaultValue={settings.partnerAssociationName}
          />
          <Field
            id="adoptionFormUrl"
            label="URL du formulaire d’adoption"
            type="url"
            defaultValue={settings.adoptionFormUrl ?? ""}
          />
          <div>
            <label className="admin-label" htmlFor="adoptionLegalText">
              Texte légal d’adoption
            </label>
            <textarea
              id="adoptionLegalText"
              name="adoptionLegalText"
              className="admin-textarea"
              defaultValue={settings.adoptionLegalText}
            />
          </div>
        </div>
      </section>

      <section className="photo-frame rounded-2xl p-5">
        <h2 className="font-serif text-2xl">Nous aider</h2>
        <div className="mt-4 max-w-xl">
          <Field
            id="donationUrl"
            label="Lien pour faire un don"
            type="url"
            defaultValue={settings.donationUrl ?? ""}
          />
          <p className="mt-2 text-sm text-muted">
            Lien vers la cagnotte ou la page de don HelloAsso.
          </p>
        </div>
      </section>

      <section className="photo-frame rounded-2xl p-5">
        <h2 className="font-serif text-2xl">Limites d’envoi</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field
            id="maxPhotoSizeMb"
            label="Taille max des photos (Mo)"
            type="number"
            defaultValue={String(settings.maxPhotoSizeMb)}
          />
          <Field
            id="maxVideoSizeMb"
            label="Taille max des vidéos (Mo)"
            type="number"
            defaultValue={String(settings.maxVideoSizeMb)}
          />
        </div>
      </section>

      {state?.error ? (
        <p className="text-sm text-[var(--danger)]" role="alert">
          {state.error}
        </p>
      ) : null}
      {state?.success ? <p className="text-sm text-[var(--ok)]">{state.success}</p> : null}

      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? "Enregistrement…" : "Enregistrer les paramètres"}
      </button>
    </form>
  );
}

function Field({
  id,
  label,
  defaultValue,
  type = "text",
}: {
  id: string;
  label: string;
  defaultValue: string;
  type?: string;
}) {
  return (
    <div>
      <label className="admin-label" htmlFor={id}>
        {label}
      </label>
      <input id={id} name={id} type={type} className="admin-input" defaultValue={defaultValue} />
    </div>
  );
}

