import { logoutAction } from "@/lib/actions";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};

const links = [
  { href: "/admin", label: "Tableau de bord" },
  { href: "/admin/chiens", label: "Chiens" },
  { href: "/admin/chiens/nouveau", label: "Ajouter un chien" },
  { href: "/admin/contenus", label: "Textes" },
  { href: "/admin/medias", label: "Médias" },
  { href: "/admin/parametres", label: "Paramètres" },
];

export default async function AdminPanelLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  if (!supabase) redirect("/admin/login");
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-cream">
      <a href="#admin-contenu" className="skip-link">
        Aller au contenu
      </a>
      <div className="lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="border-b border-line bg-paper lg:min-h-screen lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between px-4 py-4 lg:block">
            <p className="font-serif text-lg text-bordeaux-deep">Administration</p>
            <details className="lg:hidden">
              <summary className="btn btn-ghost">Menu</summary>
              <nav className="mt-3 grid gap-1" aria-label="Administration">
                {links.map((link) => (
                  <Link key={link.href} href={link.href} className="rounded-lg px-3 py-2 hover:bg-powder-soft">
                    {link.label}
                  </Link>
                ))}
                <Link href="/" className="rounded-lg px-3 py-2 text-sm text-muted">
                  Voir le site
                </Link>
                <form action={logoutAction}>
                  <button type="submit" className="rounded-lg px-3 py-2 text-sm text-muted">
                    Se déconnecter
                  </button>
                </form>
              </nav>
            </details>
          </div>
          <nav className="hidden px-2 pb-6 lg:grid" aria-label="Administration">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-[0.98rem] text-ink-soft hover:bg-powder-soft hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/" className="mt-4 rounded-lg px-3 py-2 text-sm text-muted hover:text-ink">
              Voir le site
            </Link>
            <form action={logoutAction} className="px-3 pt-2">
              <button type="submit" className="text-sm text-muted hover:text-bordeaux">
                Se déconnecter
              </button>
            </form>
          </nav>
        </aside>
        <div id="admin-contenu" className="px-4 py-6 sm:px-8">
          {children}
        </div>
      </div>
    </div>
  );
}
