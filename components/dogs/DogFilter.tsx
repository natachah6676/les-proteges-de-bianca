"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { DogWithMedia } from "@/lib/types";
import { DogCard } from "@/components/dogs/DogCard";

export function DogFilter({ dogs }: { dogs: DogWithMedia[] }) {
  const [sex, setSex] = useState<"all" | "female" | "male">("all");
  const filtered = useMemo(() => {
    if (sex === "all") return dogs;
    return dogs.filter((dog) => dog.sex === sex);
  }, [dogs, sex]);

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrer par sexe">
        {[
          { id: "all", label: "Tous" },
          { id: "female", label: "Femelles" },
          { id: "male", label: "Mâles" },
        ].map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setSex(option.id as typeof sex)}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              sex === option.id
                ? "bg-bordeaux text-white"
                : "border border-line bg-paper text-ink-soft"
            }`}
            aria-pressed={sex === option.id}
          >
            {option.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-8 text-ink-soft">
          Aucun protégé ne correspond à ce filtre pour le moment.
        </p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((dog) => (
            <DogCard key={dog.id} dog={dog} />
          ))}
        </div>
      )}
    </div>
  );
}

export function EmptyDogs({
  title,
  href,
  cta,
}: {
  title: string;
  href?: string;
  cta?: string;
}) {
  return (
    <div className="photo-frame rounded-[1.4rem] p-8 text-center">
      <p className="text-ink-soft">{title}</p>
      {href && cta ? (
        <Link href={href} className="btn btn-ghost mt-4">
          {cta}
        </Link>
      ) : null}
    </div>
  );
}
