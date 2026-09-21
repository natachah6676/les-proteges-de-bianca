"use client";

import { useEffect, useMemo, useState } from "react";
import type { Media } from "@/lib/types";
import { imageAlt, mediaPublicUrl } from "@/lib/media";
import { VideoBlock } from "@/components/media/VideoBlock";

type GalleryProps = {
  items: Media[];
  dogName?: string;
  photosOnly?: boolean;
  columnsClassName?: string;
};

export function Gallery({
  items,
  dogName,
  photosOnly = false,
  columnsClassName = "columns-2 gap-3 sm:columns-3 lg:columns-4",
}: GalleryProps) {
  const photos = items.filter((item) => item.media_type === "photo");
  const videos = photosOnly
    ? []
    : items.filter((item) => item.media_type === "video" && item.storage_path);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (photos.length === 0 && videos.length === 0) {
    return photosOnly ? null : (
      <div className="empty-photo min-h-40 rounded-[1.2rem]">
        <p>Les photos arrivent bientôt.</p>
      </div>
    );
  }

  return (
    <div className="min-w-0 space-y-8">
      {photos.length > 0 ? (
        <div className={columnsClassName}>
          {photos.map((photo, index) => {
            const src = mediaPublicUrl(photo);
            if (!src) return null;
            return (
              <button
                key={photo.id}
                type="button"
                onClick={() => setOpenIndex(index)}
                className="mb-3 block w-full break-inside-avoid overflow-hidden rounded-xl focus-visible:outline-offset-2"
                aria-label={`Agrandir la photo${photo.caption ? ` : ${photo.caption}` : ""}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={imageAlt(photo.caption, dogName ? `Photo de ${dogName}` : "Photo")}
                  className="w-full h-auto"
                />
              </button>
            );
          })}
        </div>
      ) : (
        <div className="empty-photo min-h-32 rounded-[1.2rem]">
          <p>Les photos arrivent bientôt.</p>
        </div>
      )}

      {videos.length > 0 ? (
        <div>
          <h3 className="font-serif text-2xl">Vidéos</h3>
          <div className="mt-4 grid max-w-xl gap-4">
            {videos.map((video) => (
              <VideoBlock
                key={video.id}
                media={video}
                title={video.caption || (dogName ? `Vidéo de ${dogName}` : "Vidéo")}
              />
            ))}
          </div>
        </div>
      ) : null}

      {openIndex !== null ? (
        <Lightbox
          photos={photos}
          index={openIndex}
          onClose={() => setOpenIndex(null)}
          onIndexChange={setOpenIndex}
          dogName={dogName}
        />
      ) : null}
    </div>
  );
}

function Lightbox({
  photos,
  index,
  onClose,
  onIndexChange,
  dogName,
}: {
  photos: Media[];
  index: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
  dogName?: string;
}) {
  const photo = photos[index];
  const src = useMemo(() => (photo ? mediaPublicUrl(photo) : null), [photo]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") onIndexChange((index + 1) % photos.length);
      if (event.key === "ArrowLeft") {
        onIndexChange((index - 1 + photos.length) % photos.length);
      }
    }
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [index, onClose, onIndexChange, photos.length]);

  if (!photo || !src) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1d1512]/90 p-3"
      role="dialog"
      aria-modal="true"
      aria-label="Photo en grand"
      onClick={onClose}
    >
      <div
        className="relative max-h-[92vh] max-w-[min(1100px,100%)]"
        onClick={(event) => event.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={imageAlt(photo.caption, dogName ? `Photo de ${dogName}` : "Photo")}
          className="max-h-[84vh] w-auto max-w-full object-contain"
        />
        {photo.caption ? (
          <p className="mt-3 text-center text-sm text-[#f7eee8]">{photo.caption}</p>
        ) : null}
        <div className="mt-4 flex items-center justify-between gap-3 text-white">
          <button type="button" className="btn btn-light" onClick={() => onIndexChange((index - 1 + photos.length) % photos.length)}>
            Précédente
          </button>
          <button type="button" className="btn btn-light" onClick={onClose}>
            Fermer
          </button>
          <button type="button" className="btn btn-light" onClick={() => onIndexChange((index + 1) % photos.length)}>
            Suivante
          </button>
        </div>
      </div>
    </div>
  );
}
