import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { DogFilter, EmptyDogs } from "@/components/dogs/DogFilter";
import { getPublishedDogs } from "@/lib/data";

export const metadata: Metadata = {
  title: "Nos protégés",
  description:
    "Les chiens actuellement accueillis chez Bianca et en recherche de famille.",
};

export default async function NosProtegesPage() {
  const dogs = await getPublishedDogs({ statuses: ["available", "reserved"] });

  return (
    <SiteShell current="/nos-proteges">
      <section className="container-page py-10">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-raspberry">
          À l’adoption
        </p>
        <h1 className="mt-2 font-serif text-4xl sm:text-5xl">Nos protégés</h1>
        <p className="mt-4 max-w-2xl text-lg text-ink-soft">
          Ils vivent aujourd’hui chez Bianca, en famille. Les démarches d’adoption
          sont réalisées par notre association partenaire.
        </p>
        <div className="mt-10">
          {dogs.length === 0 ? (
            <EmptyDogs title="Aucun protégé n’est publié pour le moment." />
          ) : (
            <DogFilter dogs={dogs} />
          )}
        </div>
      </section>
    </SiteShell>
  );
}
