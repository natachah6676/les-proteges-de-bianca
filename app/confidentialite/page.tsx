import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Politique de confidentialité du site Les Protégés de Bianca.",
};

export default function ConfidentialitePage() {
  return (
    <SiteShell>
      <article className="container-page py-10">
        <h1 className="font-serif text-4xl sm:text-5xl">Politique de confidentialité</h1>
        <p className="mt-3 text-sm text-muted">Dernière mise à jour : septembre 2026</p>
        <div className="mt-8 max-w-3xl space-y-10">
          <p className="prose-site text-ink-soft">
            L’association Les Protégés de Bianca accorde une attention particulière à la protection des
            données personnelles.
            {"\n\n"}
            Cette page explique les traitements de données liés au fonctionnement actuel du site.
          </p>

          <section>
            <h2 className="font-serif text-2xl text-bordeaux-deep">Responsable du traitement</h2>
            <p className="prose-site mt-3 text-ink-soft">
              Les Protégés de Bianca
              {"\n"}
              Association loi 1901
              {"\n"}
              RNA : W951002589
              {"\n"}
              2 allée des Petits Clos – Appartement 215 – 95390 Saint-Prix – France
              {"\n"}
              <a href="mailto:lesprotegesdebianca@gmail.com" className="text-bordeaux-deep underline-offset-2 hover:underline">
                lesprotegesdebianca@gmail.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-bordeaux-deep">Données des visiteurs</h2>
            <div className="prose-site mt-3 text-ink-soft">
              <p>
                Le site ne comporte actuellement aucun formulaire public de contact, de création de compte,
                de newsletter ou d’adoption.
              </p>
              <p>Les visiteurs ne saisissent donc directement aucune donnée personnelle sur le site.</p>
              <p>
                La demande d’adoption est réalisée sur un service externe proposé par l’association
                partenaire. Lorsque le visiteur clique sur ce lien, il quitte le site Les Protégés de Bianca.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-bordeaux-deep">Données techniques</h2>
            <div className="prose-site mt-3 text-ink-soft">
              <p>
                Comme pour tout site internet, certaines données techniques peuvent être traitées par les
                prestataires nécessaires au fonctionnement et à la sécurité du service, notamment des
                informations de connexion telles que l’adresse IP, le navigateur utilisé, la date et l’heure
                de la requête ou les ressources consultées.
              </p>
              <p>
                Ces traitements ont pour finalité d’assurer la mise à disposition, le fonctionnement et la
                sécurité technique du site.
              </p>
              <p>
                La base légale applicable à ces traitements est l’intérêt légitime lié au fonctionnement et
                à la sécurisation du site.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-bordeaux-deep">Administration du site</h2>
            <div className="prose-site mt-3 text-ink-soft">
              <p>L’accès à l’administration est réservé aux personnes autorisées.</p>
              <p>
                Les données nécessaires à leur authentification, notamment leur adresse e-mail et leurs
                informations d’authentification, sont traitées afin de sécuriser et gérer l’accès à
                l’administration.
              </p>
              <p>Elles ne sont pas utilisées à des fins commerciales.</p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-bordeaux-deep">Prestataires techniques</h2>
            <div className="prose-site mt-3 text-ink-soft">
              <p>Le fonctionnement du site repose notamment sur :</p>
              <p>Vercel : hébergement et mise à disposition du site.</p>
              <p>
                Supabase : base de données, authentification de l’administration et stockage des médias.
              </p>
              <p>
                Ces prestataires peuvent traiter les données techniques strictement nécessaires à la
                fourniture et à la sécurisation de leurs services.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-bordeaux-deep">Cookies et traceurs</h2>
            <div className="prose-site mt-3 text-ink-soft">
              <p>
                Le site public n’utilise actuellement aucun outil publicitaire ou de mesure d’audience tel
                que Google Analytics, Meta Pixel ou équivalent.
              </p>
              <p>Aucun cookie publicitaire ou statistique n’est déposé par le site.</p>
              <p>
                L’espace d’administration utilise les mécanismes techniques nécessaires au maintien de la
                session des administrateurs.
              </p>
              <p>
                Dans la configuration actuelle du site public, aucun bandeau de consentement aux cookies
                n’est nécessaire.
              </p>
              <p>
                Si des outils de mesure d’audience, des contenus tiers intégrés ou d’autres traceurs
                nécessitant un consentement étaient ajoutés ultérieurement, cette politique et, le cas
                échéant, le mécanisme de recueil du consentement seraient adaptés.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-bordeaux-deep">Liens externes</h2>
            <div className="prose-site mt-3 text-ink-soft">
              <p>
                Le site comporte des liens pouvant diriger vers des services tiers, notamment Facebook,
                Instagram et le formulaire d’adoption de l’association partenaire.
              </p>
              <p>
                Le simple affichage d’une fiche chien ne charge pas de contenu Facebook intégré : les liens
                Facebook sont ouverts uniquement lorsque le visiteur choisit de les consulter.
              </p>
              <p>
                Une fois sur un service externe, les traitements de données sont soumis à la politique de
                confidentialité de ce service.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-bordeaux-deep">Durée de conservation</h2>
            <div className="prose-site mt-3 text-ink-soft">
              <p>
                Les données liées aux comptes administrateurs sont conservées pendant la durée nécessaire à
                leur accès à l’administration et sont supprimées ou désactivées lorsqu’elles ne sont plus
                nécessaires.
              </p>
              <p>
                Les éventuels journaux techniques sont conservés selon les durées appliquées par les
                prestataires techniques concernés et les nécessités de sécurité du service.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-bordeaux-deep">Vos droits</h2>
            <div className="prose-site mt-3 text-ink-soft">
              <p>
                Conformément à la réglementation applicable en matière de protection des données
                personnelles, les personnes concernées peuvent, selon les conditions prévues par la
                réglementation, exercer leurs droits d’accès, de rectification, d’effacement, de limitation
                et, lorsque cela est applicable, d’opposition ou de portabilité.
              </p>
              <p>Pour toute question concernant les données personnelles ou pour exercer vos droits :</p>
              <p>
                <a href="mailto:lesprotegesdebianca@gmail.com" className="text-bordeaux-deep underline-offset-2 hover:underline">
                  lesprotegesdebianca@gmail.com
                </a>
              </p>
              <p>
                Une personne concernée dispose également du droit d’introduire une réclamation auprès de la{" "}
                <a
                  href="https://www.cnil.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-bordeaux-deep underline-offset-2 hover:underline"
                >
                  Commission nationale de l’informatique et des libertés (CNIL)
                </a>
                .
              </p>
            </div>
          </section>
        </div>
      </article>
    </SiteShell>
  );
}
