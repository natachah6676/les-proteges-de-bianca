import Link from "next/link";
import type { DogWithMedia } from "@/lib/types";
import { mediaPublicUrl } from "@/lib/media";
import { formatBirthDate, sexLabel, statusLabel, traitsFromSummary } from "@/lib/utils";
import { PhotoFrame } from "@/components/media/PhotoFrame";

export function DogCard({ dog }: { dog: DogWithMedia }) {
  const photo = dog.mainPhoto ? mediaPublicUrl(dog.mainPhoto) : null;
  const sex = sexLabel(dog.sex);
  const birth = formatBirthDate(dog.birth_date, dog.birth_date_approximate);
  const traits = traitsFromSummary(dog.short_summary);
  const status = dog.status === "reserved" || dog.status === "adopted" ? statusLabel(dog.status) : null;

  return (
    <article className="photo-frame overflow-hidden rounded-[1.4rem]">
      <Link href={`/chiens/${dog.slug}`} className="block">
        <PhotoFrame
          src={photo}
          alt={dog.mainPhoto?.caption || `Portrait de ${dog.name}`}
          emptyLabel="Les photos arrivent bientôt."
          className="aspect-[4/5]"
        />
      </Link>
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-serif text-2xl">{dog.name}</h3>
          {status ? (
            <span className="rounded-full bg-powder-soft px-2.5 py-1 text-xs font-semibold text-bordeaux-deep">
              {status}
            </span>
          ) : null}
        </div>
        <p className="mt-1 text-sm text-ink-soft">
          {[sex, birth].filter(Boolean).join(" · ")}
        </p>
        {traits.length > 0 ? (
          <p className="mt-2 text-sm text-muted">{traits.join(" · ")}</p>
        ) : null}
        <Link href={`/chiens/${dog.slug}`} className="btn btn-ghost mt-4 w-full">
          Découvrir {dog.name}
        </Link>
      </div>
    </article>
  );
}
