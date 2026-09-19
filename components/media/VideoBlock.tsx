"use client";

import { useState } from "react";
import type { Media } from "@/lib/types";
import { isExternalVideoPage, mediaPublicUrl, vimeoId, youtubeId } from "@/lib/media";

export function VideoBlock({ media, title }: { media: Media; title: string }) {
  const [playing, setPlaying] = useState(false);
  const url = mediaPublicUrl(media);
  if (!url) return null;

  const yt = youtubeId(url);
  const vim = vimeoId(url);

  if (!playing) {
    return (
      <button
        type="button"
        onClick={() => setPlaying(true)}
        className="group relative block aspect-video w-full overflow-hidden rounded-2xl bg-[#2a211c] text-left"
        aria-label={`Lire : ${title}`}
      >
        {yt ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`https://i.ytimg.com/vi/${yt}/hqdefault.jpg`}
            alt=""
            className="h-full w-full object-cover opacity-80"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[#3a2a27] to-[#1d1512]" />
        )}
        <span className="absolute inset-0 grid place-items-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-bordeaux">
            <span className="ml-0.5 text-lg" aria-hidden="true">
              ▶
            </span>
          </span>
        </span>
        <span className="absolute bottom-3 left-3 right-3 text-sm text-white">
          {media.caption || title}
        </span>
      </button>
    );
  }

  if (yt) {
    return (
      <div className="aspect-video overflow-hidden rounded-2xl bg-black">
        <iframe
          title={title}
          src={`https://www.youtube-nocookie.com/embed/${yt}?autoplay=1`}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  if (vim) {
    return (
      <div className="aspect-video overflow-hidden rounded-2xl bg-black">
        <iframe
          title={title}
          src={`https://player.vimeo.com/video/${vim}?autoplay=1`}
          className="h-full w-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  if (isExternalVideoPage(url)) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
        Voir la vidéo
      </a>
    );
  }

  return (
    <video
      className="w-full rounded-2xl bg-black"
      controls
      preload="metadata"
      playsInline
      autoPlay
    >
      <source src={url} />
      Votre navigateur ne peut pas lire cette vidéo.
    </video>
  );
}
