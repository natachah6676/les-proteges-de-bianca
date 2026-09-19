import { ContentForm } from "@/components/admin/ContentForm";
import { getContent } from "@/lib/data";

export default async function ContentPage() {
  const content = await getContent();

  return (
    <div>
      <h1 className="font-serif text-3xl">Textes du site</h1>
      <p className="mt-2 mb-6 max-w-2xl text-ink-soft">
        Modifiez ici les textes visibles par les visiteurs, y compris la présentation de Bianca.
      </p>
      <ContentForm content={content} />
    </div>
  );
}
