import Link from "next/link";
import { getAdminDogs } from "@/lib/data";

export default async function AdminDashboardPage() {
  const dogs = await getAdminDogs();
  const available = dogs.filter((dog) => dog.status === "available" && dog.published).length;
  const adopted = dogs.filter((dog) => dog.status === "adopted").length;

  return (
    <div>
      <h1 className="font-serif text-3xl">Tableau de bord</h1>
      <p className="mt-2 text-ink-soft">Vue simple de l’activité du site.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat label="À l’adoption" value={available} />
        <Stat label="Adoptés" value={adopted} />
        <Stat label="Total des chiens" value={dogs.length} />
      </div>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/admin/chiens/nouveau" className="btn btn-primary">
          Ajouter un chien
        </Link>
        <Link href="/admin/contenus" className="btn btn-ghost">
          Modifier la présentation de Bianca
        </Link>
        <Link href="/admin/parametres" className="btn btn-ghost">
          Paramètres
        </Link>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="photo-frame rounded-2xl p-5">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 font-serif text-4xl">{value}</p>
    </div>
  );
}
