"use client";

import { useState } from "react";
import type { Media } from "@/lib/types";
import {
  isDirectVideoFileUrl,
  isFacebookUrl,
  mediaPublicUrl,
  vimeoId,
  youtubeId,
} from "@/lib/media";

export function VideoBlock({ media, title }: { media: Media; title: string }) {
  const fileUrl = media.storage_path ? mediaPublicUrl(media) : null;
  const externalUrl = media.external_url?.trim() || null;

  if (fileUrl) {
    return <ImportedVideo src={fileUrl} title={title} caption={media.caption} />;
  }

  // Les liens Facebook ne sont jamais lus ici : le bouton de la fiche chien s’en charge.
  if (!externalUrl || isFacebookUrl(externalUrl)) {
    return null;
  }

  return <HostedVideoLink url={externalUrl} title={title} caption={media.caption} />;
}

function ImportedVideo({
  src,
  title,
  caption,
}: {
  src: string;
  title: string;
  caption: string | null;
}) {
  return (
    <figure className="min-w-0">
      <video
        className="w-full rounded-2xl bg-black"
        controls
        preload="metadata"
        playsInline
        title={title}
      >
        <source src={src} />
        Votre navigateur ne peut pas lire cette vidéo.
      </video>
      {caption ? <figcaption className="mt-2 text-sm text-muted">{caption}</figcaption> : null}
    </figure>
  );
}

function HostedVideoLink({
  url,
  title,
  caption,
}: {
  url: string;
  title: string;
  caption: string | null;
}) {
  const [playing, setPlaying] = useState(false);
  const yt = youtubeId(url);
  const vim = vimeoId(url);

  if (yt || vim) {
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
            {caption || title}
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

  if (isDirectVideoFileUrl(url)) {
    return <ImportedVideo src={url} title={title} caption={caption} />;
  }

  return (
    <div className="photo-frame rounded-[1.4rem] p-5">
      <p className="text-ink-soft">{caption?.trim() || title}</p>
      <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-4">
        Voir la vidéo
      </a>
    </div>
  );
}
