import Link from "next/link";
import type { SiteSettings } from "@/lib/types";

function HelpButton({
  active,
  href,
  label,
}: {
  active: boolean;
  href: string | null;
  label: string;
}) {
  if (active && href) {
    return (
      <a
        href={href}
        className="btn btn-primary w-full"
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {label}
      </a>
    );
  }

  return (
    <p className="rounded-full border border-dashed border-line px-4 py-3 text-center text-sm text-muted">
      Bientôt disponible
    </p>
  );
}

export function HelpCards({ settings }: { settings: SiteSettings }) {
  const items = [
    {
      title: "Faire un don",
      text: "Soutenir financièrement l’accueil des chiens chez Bianca.",
      active: settings.donationsActive,
      href: settings.donationUrl,
      label: settings.donationButtonText,
    },
    {
      title: "Parrainer / aider un protégé",
      text: "Participer aux soins ou au quotidien d’un chien accueilli.",
      active: settings.sponsorshipActive,
      href: settings.sponsorshipUrl,
      label: settings.sponsorshipButtonText,
    },
    {
      title: "Soutenir l’association",
      text: "Aider Les Protégés de Bianca à poursuivre son action.",
      active: settings.supportActive,
      href: settings.supportUrl,
      label: settings.supportButtonText,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((item) => (
        <article key={item.title} className="photo-frame rounded-[1.3rem] p-5">
          <h3 className="font-serif text-2xl">{item.title}</h3>
          <p className="mt-2 mb-5 text-ink-soft">{item.text}</p>
          <HelpButton active={item.active} href={item.href} label={item.label} />
        </article>
      ))}
    </div>
  );
}

export function ShareAndFollow({ settings }: { settings: SiteSettings }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <article className="photo-frame rounded-[1.3rem] p-5">
        <h3 className="font-serif text-2xl">Partager nos protégés</h3>
        <p className="mt-2 text-ink-soft">
          Faire connaître un chien, c’est parfois le premier pas vers une famille.
        </p>
        <Link href="/nos-proteges" className="btn btn-ghost mt-5">
          Voir nos protégés
        </Link>
      </article>
      <article className="photo-frame rounded-[1.3rem] p-5">
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
              className="btn btn-ghost"
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
    </div>
  );
}
