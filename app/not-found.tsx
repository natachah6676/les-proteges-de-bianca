import Link from "next/link";
import { SiteShell } from "@/components/layout/SiteShell";

export default function NotFound() {
  return (
    <SiteShell>
      <section className="container-page py-20 text-center">
        <h1 className="font-serif text-4xl">Page introuvable</h1>
        <p className="mt-3 text-ink-soft">Cette page n’existe pas, ou n’est plus disponible.</p>
        <Link href="/" className="btn btn-primary mt-6">
          Retour à l’accueil
        </Link>
      </section>
    </SiteShell>
  );
}
