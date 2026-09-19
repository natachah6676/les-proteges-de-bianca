import type { ReactNode } from "react";
import Link from "next/link";
import { getSettings } from "@/lib/data";
import { siteMediaUrl } from "@/lib/media";

type HeaderProps = {
  current?: string;
};

const links = [
  { href: "/", label: "Accueil" },
  { href: "/nos-proteges", label: "Nos protégés", emphasize: true },
  { href: "/adoptes", label: "Adoptés" },
  { href: "/bianca", label: "Bianca" },
  { href: "/nous-aider", label: "Nous aider" },
];

function Logo({ name, logoUrl }: { name: string; logoUrl: string | null }) {
  if (logoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={logoUrl} alt={name} className="h-12 w-auto max-w-[220px] object-contain" />
    );
  }

  return (
    <span className="font-serif text-[1.15rem] leading-tight text-bordeaux-deep sm:text-xl">
      Les Protégés
      <span className="block text-[0.92rem] font-normal italic text-ink-soft">
        de Bianca
      </span>
    </span>
  );
}

export async function Header({ current }: HeaderProps) {
  const settings = await getSettings();
  const logoUrl = siteMediaUrl(settings.logoPath);

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-cream/90 backdrop-blur-sm">
      <div className="container-page flex items-center justify-between gap-4 py-3">
        <Link href="/" className="shrink-0" aria-label="Accueil — Les Protégés de Bianca">
          <Logo name={settings.associationName} logoUrl={logoUrl} />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigation principale">
          {links.map((link) => {
            const active = current === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3.5 py-2 text-[0.95rem] ${
                  link.emphasize
                    ? "bg-bordeaux text-white hover:bg-bordeaux-deep"
                    : active
                      ? "text-bordeaux-deep"
                      : "text-ink-soft hover:text-bordeaux"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <MobileNav current={current} />
      </div>
    </header>
  );
}

function MobileNav({ current }: { current?: string }) {
  return (
    <details className="relative lg:hidden">
      <summary
        className="flex h-11 w-11 list-none items-center justify-center rounded-full border border-line bg-paper text-ink"
        aria-label="Ouvrir le menu"
      >
        <span className="sr-only">Menu</span>
        <span className="flex flex-col gap-1.5" aria-hidden="true">
          <span className="block h-0.5 w-5 bg-current" />
          <span className="block h-0.5 w-5 bg-current" />
          <span className="block h-0.5 w-3.5 bg-current" />
        </span>
      </summary>
      <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-line bg-paper p-2 shadow-lg">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block rounded-xl px-3 py-3 ${
              link.emphasize
                ? "bg-bordeaux text-white"
                : current === link.href
                  ? "bg-powder-soft text-bordeaux-deep"
                  : "text-ink"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </details>
  );
}

export async function Footer() {
  const settings = await getSettings();

  return (
    <footer className="mt-16 border-t border-line bg-cream-deep/70">
      <div className="container-page grid gap-8 py-12 md:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="font-serif text-2xl text-bordeaux-deep">{settings.associationName}</p>
          <p className="mt-1 italic text-ink-soft">{settings.slogan}</p>
          {settings.rna ? (
            <p className="mt-3 text-sm text-muted">RNA {settings.rna}</p>
          ) : null}
          <p className="mt-4 max-w-xl text-[0.98rem] text-ink-soft">
            {settings.adoptionLegalText ||
              "Les démarches d’adoption sont réalisées par notre association partenaire."}
          </p>
          {settings.partnerAssociationName ? (
            <p className="mt-2 text-[0.98rem] text-ink-soft">
              Association partenaire : {settings.partnerAssociationName}.
            </p>
          ) : null}
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">
            Aller vers
          </p>
          <ul className="mt-3 space-y-2">
            <li>
              <Link href="/nos-proteges" className="hover:text-bordeaux">
                Nos protégés
              </Link>
            </li>
            <li>
              <Link href="/adoptes" className="hover:text-bordeaux">
                Adoptés
              </Link>
            </li>
            <li>
              <Link href="/bianca" className="hover:text-bordeaux">
                Bianca
              </Link>
            </li>
            <li>
              <Link href="/nous-aider" className="hover:text-bordeaux">
                Nous aider
              </Link>
            </li>
            {settings.facebookUrl ? (
              <li>
                <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer">
                  Facebook
                </a>
              </li>
            ) : null}
            {settings.instagramUrl ? (
              <li>
                <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              </li>
            ) : null}
          </ul>
          <p className="mt-6 text-sm text-muted">
            Mentions légales et politique de confidentialité à venir.
          </p>
        </div>
      </div>
    </footer>
  );
}

export function SiteShell({
  children,
  current,
}: {
  children: ReactNode;
  current?: string;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#contenu" className="skip-link">
        Aller au contenu
      </a>
      <Header current={current} />
      <main id="contenu" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
