import type { SiteSettings } from "@/lib/types";

export function HelpCards({ settings }: { settings: SiteSettings }) {
  const href = settings.donationUrl;

  return (
    <article className="photo-frame max-w-xl rounded-[1.3rem] p-5">
      <h2 className="font-serif text-2xl">Faire un don</h2>
      <p className="mt-2 mb-5 text-ink-soft">
        Soutenir financièrement l’accueil des chiens chez Bianca.
      </p>
      {href ? (
        <a href={href} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
          Faire un don
        </a>
      ) : null}
    </article>
  );
}

export function ShareAndFollow({ settings }: { settings: SiteSettings }) {
  return (
    <article className="photo-frame max-w-xl rounded-[1.3rem] p-5">
        <h3 className="font-serif text-2xl">Suivre l’association</h3>
        <p className="mt-2 text-ink-soft">
          Retrouver les nouvelles de Bianca et des chiens sur les réseaux.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {settings.facebookUrl ? (
            <a
              href={settings.facebookUrl}
              className="btn btn-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook
            </a>
          ) : null}
          {settings.instagramUrl ? (
            <a
              href={settings.instagramUrl}
              className="btn btn-ghost"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
          ) : null}
          {settings.tiktokUrl ? (
            <a
              href={settings.tiktokUrl}
              className="btn btn-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              TikTok
            </a>
          ) : null}
          {!settings.facebookUrl && !settings.instagramUrl && !settings.tiktokUrl ? (
            <p className="text-sm text-muted">Les liens seront ajoutés dans l’administration.</p>
          ) : null}
        </div>
      </article>
  );
}
