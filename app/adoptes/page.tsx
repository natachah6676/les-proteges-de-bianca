import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { DogCard } from "@/components/dogs/DogCard";
import { EmptyDogs } from "@/components/dogs/DogFilter";
import { getContent, getPublishedDogs } from "@/lib/data";

export const metadata: Metadata = {
  title: "Adoptés",
  description: "Les protégés de Bianca qui ont trouvé leur famille.",
};

export default async function AdoptesPage() {
  const [dogs, content] = await Promise.all([
    getPublishedDogs({ statuses: ["adopted"] }),
    getContent(),
  ]);

  return (
    <SiteShell current="/adoptes">
      <section className="container-page py-10">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-raspberry">
          Familles trouvées
        </p>
        <h1 className="mt-2 font-serif text-4xl sm:text-5xl">Ils ont trouvé leur famille</h1>
        <p className="mt-4 max-w-2xl text-lg text-ink-soft">
          {content.adopted_intro}
        </p>
        <div className="mt-10">
          {dogs.length === 0 ? (
            <EmptyDogs title="Aucun chien adopté n’est encore présenté ici." />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {dogs.map((dog) => (
                <DogCard key={dog.id} dog={dog} />
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
