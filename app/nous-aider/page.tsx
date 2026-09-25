import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { HelpCards, ShareAndFollow } from "@/components/help/HelpCards";
import { getContent, getSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Nous aider",
  description: "Soutenir Les Protégés de Bianca par un don.",
};

export default async function NousAiderPage() {
  const [settings, content] = await Promise.all([getSettings(), getContent()]);

  return (
    <SiteShell current="/nous-aider">
      <section className="container-page py-10">
        <h1 className="font-serif text-4xl sm:text-5xl">Nous aider</h1>
        <p className="mt-4 max-w-2xl text-lg text-ink-soft">{content.help_text}</p>
        <div className="mt-10">
          <HelpCards settings={settings} />
        </div>
        <div className="mt-6">
          <ShareAndFollow settings={settings} />
        </div>
      </section>
    </SiteShell>
  );
}
