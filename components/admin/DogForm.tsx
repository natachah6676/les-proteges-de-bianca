"use client";

import { useActionState, useMemo, useState } from "react";
import Link from "next/link";
import { deleteDogAction, saveDogAction, type DogFormState } from "@/lib/actions";
import { slugify } from "@/lib/utils";
import type { DogWithMedia } from "@/lib/types";
import { MediaUploader } from "@/components/admin/MediaUploader";

export function DogForm({
  dog,
  maxPhotoMb,
  maxVideoMb,
}: {
  dog?: DogWithMedia;
  maxPhotoMb: number;
  maxVideoMb: number;
}) {
  const [name, setName] = useState(dog?.name ?? "");
  const [slug, setSlug] = useState(dog?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(dog?.slug));
  const [state, action, pending] = useActionState(saveDogAction, {} as DogFormState);
  const previewHref = useMemo(() => (slug ? `/chiens/${slug}` : null), [slug]);

  return (
    <div className="space-y-8">
      <form action={action} className="space-y-8">
        {dog ? <input type="hidden" name="id" value={dog.id} /> : null}

        <section className="photo-frame rounded-2xl p-5">
          <h2 className="font-serif text-2xl">Identité</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="admin-label" htmlFor="name">
                Prénom *
              </label>
              <input
                id="name"
                name="name"
                required
                className="admin-input"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  if (!slugTouched) setSlug(slugify(event.target.value));
                }}
              />
            </div>
            <div>
              <label className="admin-label" htmlFor="slug">
                Slug (adresse de la fiche)
              </label>
              <input
                id="slug"
                name="slug"
                className="admin-input"
                value={slug}
                onChange={(event) => {
                  setSlugTouched(true);
                  setSlug(event.target.value);
                }}
              />
            </div>
            <div>
              <label className="admin-label" htmlFor="sex">
                Sexe
              </label>
              <select id="sex" name="sex" className="admin-select" defaultValue={dog?.sex ?? "unknown"}>
                <option value="unknown">Non renseigné</option>
                <option value="male">Mâle</option>
                <option value="female">Femelle</option>
              </select>
            </div>
            <div>
              <label className="admin-label" htmlFor="birth_date">
                Date de naissance
              </label>
              <input
                id="birth_date"
                name="birth_date"
                type="date"
                className="admin-input"
                defaultValue={dog?.birth_date ?? ""}
              />
            </div>
            <label className="flex items-center gap-2 pt-6 text-sm">
              <input
                type="checkbox"
                name="birth_date_approximate"
                defaultChecked={dog?.birth_date_approximate}
              />
              Date de naissance approximative
            </label>
          </div>
        </section>

        <section className="photo-frame rounded-2xl p-5">
          <h2 className="font-serif text-2xl">Statut</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="admin-label" htmlFor="status">
                Statut
              </label>
              <select id="status" name="status" className="admin-select" defaultValue={dog?.status ?? "available"}>
                <option value="available">À l’adoption</option>
                <option value="reserved">Réservé</option>
                <option value="adopted">Adopté</option>
                <option value="unpublished">Non publié</option>
              </select>
            </div>
            <div>
              <label className="admin-label" htmlFor="adoption_date">
                Date d’adoption
              </label>
              <input
                id="adoption_date"
                name="adoption_date"
                type="date"
                className="admin-input"
                defaultValue={dog?.adoption_date ?? ""}
              />
            </div>
            <div>
              <label className="admin-label" htmlFor="current_location">
                Localisation actuelle
              </label>
              <input
                id="current_location"
                name="current_location"
                className="admin-input"
                defaultValue={dog?.current_location ?? ""}
              />
            </div>
            <div>
              <label className="admin-label" htmlFor="estimated_size">
                Taille estimée
              </label>
              <input
                id="estimated_size"
                name="estimated_size"
                className="admin-input"
                defaultValue={dog?.estimated_size ?? ""}
              />
            </div>
            <div>
              <label className="admin-label" htmlFor="estimated_weight">
                Poids estimé
              </label>
              <input
                id="estimated_weight"
                name="estimated_weight"
                className="admin-input"
                defaultValue={dog?.estimated_weight ?? ""}
              />
            </div>
            <div>
              <label className="admin-label" htmlFor="sort_order">
                Ordre d’affichage
              </label>
              <input
                id="sort_order"
                name="sort_order"
                type="number"
                className="admin-input"
                defaultValue={dog?.sort_order ?? 0}
              />
            </div>
            <label className="flex items-center gap-2 pt-6 text-sm">
              <input type="checkbox" name="published" defaultChecked={dog?.published ?? true} />
              Publié sur le site
            </label>
          </div>
        </section>

        <section className="photo-frame rounded-2xl p-5">
          <h2 className="font-serif text-2xl">Textes</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="admin-label" htmlFor="short_summary">
                Résumé court (2 ou 3 traits, séparés par une virgule)
              </label>
              <input
                id="short_summary"
                name="short_summary"
                className="admin-input"
                defaultValue={dog?.short_summary ?? ""}
              />
            </div>
            <div>
              <label className="admin-label" htmlFor="story">
                Histoire
              </label>
              <textarea id="story" name="story" className="admin-textarea" defaultValue={dog?.story ?? ""} />
            </div>
          </div>
        </section>

        <section className="photo-frame rounded-2xl p-5">
          <h2 className="font-serif text-2xl">Soins</h2>
          <p className="mt-1 text-sm text-muted">
            Coché = Oui. Décochez seulement si ce soin n’a pas encore été fait.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <CareCheck
              name="is_vaccinated"
              label="Vacciné"
              defaultChecked={dog?.is_vaccinated ?? true}
            />
            <CareCheck
              name="is_identified"
              label="Identifié"
              defaultChecked={dog?.is_identified ?? true}
            />
            <CareCheck
              name="is_dewormed"
              label="Vermifugé"
              defaultChecked={dog?.is_dewormed ?? true}
            />
            <CareCheck
              name="is_parasite_treated"
              label="Déparasité"
              defaultChecked={dog?.is_parasite_treated ?? true}
            />
          </div>
        </section>

        <section className="photo-frame rounded-2xl p-5">
          <h2 className="font-serif text-2xl">Autre</h2>
          <div className="mt-4">
            <label className="admin-label" htmlFor="additional_info">
              Informations complémentaires
            </label>
            <textarea
              id="additional_info"
              name="additional_info"
              className="admin-textarea"
              defaultValue={dog?.additional_info ?? ""}
            />
          </div>
        </section>

        {dog?.main_photo_id ? (
          <input type="hidden" name="main_photo_id" value={dog.main_photo_id} />
        ) : null}

        {state.error ? (
          <p className="text-sm text-[var(--danger)]" role="alert">
            {state.error}
          </p>
        ) : null}
        {state.success ? <p className="text-sm text-[var(--ok)]">{state.success}</p> : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="submit" className="btn btn-primary" disabled={pending}>
            {pending ? "Enregistrement…" : "Enregistrer"}
          </button>
          {previewHref ? (
            <Link href={previewHref} className="btn btn-ghost" target="_blank">
              Prévisualiser
            </Link>
          ) : null}
        </div>
      </form>

      {dog ? (
        <section>
          <h2 className="font-serif text-2xl">Photos et vidéos</h2>
          <p className="mt-1 mb-4 text-sm text-muted">
            Vous pouvez ajouter autant de fichiers que nécessaire. Choisissez ensuite la photo principale.
          </p>
          <MediaUploader
            dogId={dog.id}
            category="dog"
            maxPhotoMb={maxPhotoMb}
            maxVideoMb={maxVideoMb}
            existing={dog.media}
            mainPhotoId={dog.main_photo_id}
          />
        </section>
      ) : (
        <p className="text-ink-soft">Enregistrez d’abord la fiche pour y ajouter des photos et des vidéos.</p>
      )}

      {dog ? (
        <form
          action={deleteDogAction}
          onSubmit={(event) => {
            if (!confirm(`Supprimer définitivement ${dog.name} ?`)) {
              event.preventDefault();
            }
          }}
          className="border-t border-line pt-6"
        >
          <input type="hidden" name="id" value={dog.id} />
          <button type="submit" className="text-sm text-[var(--danger)]">
            Supprimer ce chien
          </button>
        </form>
      ) : null}
    </div>
  );
}

function CareCheck({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="admin-check" htmlFor={name}>
      <input
        id={name}
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
      />
      <span>{label}</span>
    </label>
  );
}
