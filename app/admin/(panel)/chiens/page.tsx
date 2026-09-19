import Link from "next/link";
import { getAdminDogs } from "@/lib/data";
import { sexLabel, statusLabel } from "@/lib/utils";

export default async function AdminDogsPage() {
  const dogs = await getAdminDogs();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-3xl">Chiens</h1>
        <Link href="/admin/chiens/nouveau" className="btn btn-primary">
          Ajouter un chien
        </Link>
      </div>
      <div className="mt-6 overflow-x-auto photo-frame rounded-2xl">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-line bg-cream/80">
            <tr>
              <th className="px-4 py-3 font-semibold">Prénom</th>
              <th className="px-4 py-3 font-semibold">Sexe</th>
              <th className="px-4 py-3 font-semibold">Statut</th>
              <th className="px-4 py-3 font-semibold">Publié</th>
              <th className="px-4 py-3 font-semibold">Ordre</th>
              <th className="px-4 py-3 font-semibold">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {dogs.map((dog) => (
              <tr key={dog.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-medium">{dog.name}</td>
                <td className="px-4 py-3">{sexLabel(dog.sex) ?? "—"}</td>
                <td className="px-4 py-3">{statusLabel(dog.status)}</td>
                <td className="px-4 py-3">{dog.published ? "Oui" : "Non"}</td>
                <td className="px-4 py-3">{dog.sort_order}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/chiens/${dog.id}`} className="text-bordeaux hover:underline">
                    Modifier
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {dogs.length === 0 ? (
          <p className="px-4 py-8 text-ink-soft">Aucun chien pour le moment.</p>
        ) : null}
      </div>
    </div>
  );
}
