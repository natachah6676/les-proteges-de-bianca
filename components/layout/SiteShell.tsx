import type { ReactNode } from "react";
import Link from "next/link";
import { getSettings } from "@/lib/data";
import { siteMediaUrl } from "@/lib/media";

type HeaderProps = {
  current?: string;
};

const links = [
  { href: "/", label: "Accueil" },
  { href: "/nos-proteges", label: "Nos protégés à adopter" },
  { href: "/adoptes", label: "Nos protégés adoptés" },
  { href: "/nous-aider", label: "Nous aider" },
];

function Logo({ name, logoUrl }: { name: string; logoUrl: string | null }) {
  if (logoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={logoUrl} alt={name} className="site-logo" />
    );
  }

  return (
    <span className="font-serif text-lg leading-tight text-nav-cream sm:text-xl">
      Les Protégés
      <span className="block text-[0.82rem] font-normal italic opacity-80">de Bianca</span>
    </span>
  );
}

export async function Header({ current }: HeaderProps) {
  const settings = await getSettings();
  const logoUrl = siteMediaUrl(settings.logoPath);

  return (
    <header className="site-header sticky top-0 z-40">
      <div className="container-page flex items-center justify-between gap-4 py-1.5 md:py-2">
        <Link href="/" className="flex shrink-0 items-center" aria-label="Accueil — Les Protégés de Bianca">
          <Logo name={settings.associationName} logoUrl={logoUrl} />
        </Link>

        <nav className="hidden items-center gap-3 lg:flex xl:gap-4" aria-label="Navigation principale">
          {links.map((link) => {
            const active = current === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`site-nav-link ${active ? "is-active" : ""}`}
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
        className="flex h-11 w-11 list-none items-center justify-center rounded-full border border-white/35 text-nav-cream"
        aria-label="Ouvrir le menu"
      >
        <span className="sr-only">Menu</span>
        <span className="flex flex-col gap-1.5" aria-hidden="true">
          <span className="block h-0.5 w-5 bg-current" />
          <span className="block h-0.5 w-5 bg-current" />
          <span className="block h-0.5 w-3.5 bg-current" />
        </span>
      </summary>
      <div className="absolute right-0 z-50 mt-2 w-60 rounded-2xl border border-line bg-paper p-2 shadow-lg">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block rounded-xl px-3 py-3 text-[1.05rem] font-semibold ${
              current === link.href ? "bg-raspberry text-white" : "mobile-nav-link"
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
    <footer className="site-footer mt-16">
      <div className="container-page grid gap-8 py-10 md:grid-cols-[1.4fr_1fr] md:py-12">
        <div>
          <p className="font-serif text-2xl text-white">{settings.associationName}</p>
          <p className="mt-1 italic text-nav-cream/80">{settings.slogan}</p>
          {settings.rna ? (
            <p className="mt-3 text-sm text-nav-cream/70">RNA {settings.rna}</p>
          ) : null}
          <p className="mt-2 text-sm">
            <a href="mailto:lesprotegesdebianca@gmail.com" className="hover:text-white">
              lesprotegesdebianca@gmail.com
            </a>
          </p>
          <p className="mt-4 max-w-xl text-[0.98rem] text-nav-cream/85">
            {settings.adoptionLegalText ||
              "Les démarches d’adoption sont réalisées par notre association partenaire."}
          </p>
          {settings.partnerAssociationName ? (
            <p className="mt-2 text-[0.98rem] text-nav-cream/85">
              Association partenaire : {settings.partnerAssociationName}.
            </p>
          ) : null}
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-nav-cream/65">
            Aller vers
          </p>
          <ul className="mt-3 space-y-2">
            <li>
              <Link href="/nos-proteges" className="hover:text-white">
                Nos protégés à adopter
              </Link>
            </li>
            <li>
              <Link href="/adoptes" className="hover:text-white">
                Nos protégés adoptés
              </Link>
            </li>
            <li>
              <Link href="/nous-aider" className="hover:text-white">
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
            {settings.tiktokUrl ? (
              <li>
                <a href={settings.tiktokUrl} target="_blank" rel="noopener noreferrer">
                  TikTok
                </a>
              </li>
            ) : null}
          </ul>
          <p className="mt-6 text-sm text-nav-cream/65">
            <Link href="/mentions-legales" className="hover:text-white">
              Mentions légales
            </Link>
            <span aria-hidden="true"> | </span>
            <Link href="/confidentialite" className="hover:text-white">
              Politique de confidentialité
            </Link>
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
