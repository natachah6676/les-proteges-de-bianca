import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales du site Les Protégés de Bianca.",
};

export default function MentionsLegalesPage() {
  return (
    <SiteShell>
      <article className="container-page py-10">
        <h1 className="font-serif text-4xl sm:text-5xl">Mentions légales</h1>
        <div className="mt-8 max-w-3xl space-y-10">
          <section>
            <h2 className="font-serif text-2xl text-bordeaux-deep">Éditeur du site</h2>
            <div className="prose-site mt-3 text-ink-soft">
              <p>Le présent site est édité par :</p>
              <p>
                Les Protégés de Bianca
                {"\n"}
                Association régie par la loi du 1er juillet 1901
                {"\n"}
                RNA : W951002589
                {"\n"}
                Siège social : 2 allée des Petits Clos – Appartement 215 – 95390 Saint-Prix – France
                {"\n"}
                E-mail :{" "}
                <a href="mailto:lesprotegesdebianca@gmail.com" className="text-bordeaux-deep underline-offset-2 hover:underline">
                  lesprotegesdebianca@gmail.com
                </a>
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-bordeaux-deep">Direction de la publication</h2>
            <p className="prose-site mt-3 text-ink-soft">
              La directrice de la publication est la Présidente de l’association Les Protégés de Bianca.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-bordeaux-deep">Objet du site</h2>
            <div className="prose-site mt-3 text-ink-soft">
              <p>
                Le site a pour objet de présenter l’action de l’association Les Protégés de Bianca, les
                chiens qu’elle accompagne, les chiens ayant trouvé une famille ainsi que les différentes
                possibilités de soutenir son action.
              </p>
              <p>
                Les démarches d’adoption ne sont pas réalisées directement par Les Protégés de Bianca.
                Elles sont prises en charge par l’association partenaire indiquée sur le site, actuellement
                Les Pattes Oubliées.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-bordeaux-deep">Hébergement</h2>
            <p className="prose-site mt-3 text-ink-soft">
              Le site est hébergé par Vercel Inc.
              {"\n"}
              Site officiel :{" "}
              <a
                href="https://vercel.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-bordeaux-deep underline-offset-2 hover:underline"
              >
                vercel.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-bordeaux-deep">Prestataire technique</h2>
            <p className="prose-site mt-3 text-ink-soft">
              Le site utilise Supabase pour la base de données, l’authentification de l’administration et le
              stockage des photos et vidéos.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-bordeaux-deep">Propriété intellectuelle</h2>
            <div className="prose-site mt-3 text-ink-soft">
              <p>
                Les textes, éléments graphiques, photographies, vidéos et autres contenus présents sur ce
                site sont protégés par les règles applicables en matière de propriété intellectuelle et de
                droit à l’image.
              </p>
              <p>
                Sauf autorisation ou disposition légale contraire, leur reproduction, modification ou
                utilisation en dehors d’un usage strictement personnel n’est pas autorisée sans l’accord
                préalable de l’association ou du titulaire des droits concerné.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-bordeaux-deep">Liens vers des sites externes</h2>
            <div className="prose-site mt-3 text-ink-soft">
              <p>
                Le site peut contenir des liens vers des services ou sites externes, notamment Facebook,
                Instagram, l’association partenaire chargée des démarches d’adoption et, lorsqu’ils sont
                activés, des services permettant de soutenir financièrement l’association.
              </p>
              <p>
                Lorsque le visiteur clique sur l’un de ces liens, il quitte le site Les Protégés de Bianca.
                Les traitements de données éventuellement réalisés sur le site externe sont alors soumis aux
                règles et politiques du service concerné.
              </p>
            </div>
          </section>
        </div>
      </article>
    </SiteShell>
  );
}
