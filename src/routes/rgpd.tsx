import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, PhoneLink } from "@/components/legal-page";
import { EDITEUR } from "@/lib/editeur";

export const Route = createFileRoute("/rgpd")({
  component: RgpdPage,
  head: () => ({
    meta: [
      { title: `Politique de confidentialité (RGPD) — ${EDITEUR.nomCommercial}` },
      { name: "robots", content: "noindex,follow" },
      {
        name: "description",
        content:
          `Politique de confidentialité et données personnelles — ${EDITEUR.nomCommercial}`,
      },
    ],
  }),
});

function RgpdPage() {
  return (
    <LegalPage title="Politique de confidentialité" updated="septembre 2026">
      <section className="mt-10 space-y-4 leading-relaxed">
        <h2 className="font-display text-2xl text-navy font-bold">1. Responsable du traitement</h2>
        <p>
          Le responsable du traitement est la société <strong>{EDITEUR.raisonSociale}</strong> ({EDITEUR.forme}, {EDITEUR.rcs}),
          {" "}{EDITEUR.siege}, qui exploite le service {EDITEUR.nomCommercial}. Pour toute question relative à vos données
          personnelles, vous pouvez nous contacter au <PhoneLink />.
        </p>
      </section>

      <section className="mt-10 space-y-4 leading-relaxed">
        <h2 className="font-display text-2xl text-navy font-bold">2. Données collectées via le formulaire de devis</h2>
        <p>
          Lorsque vous remplissez le formulaire de demande de devis, nous collectons les
          informations suivantes : nom, numéro de téléphone, code postal, type de besoin et,
          le cas échéant, votre message.
        </p>
        <p>
          <strong>Finalité</strong> : vous recontacter sous 15 minutes pour vous proposer un devis annoncé.
          Pour organiser l'intervention, votre nom, votre téléphone, votre code postal et votre besoin sont
          transmis au technicien de notre réseau missionné chez vous, et à lui seul. Vos données ne sont jamais
          vendues. Elles sont conservées pendant une durée maximale de 12 mois à compter de votre demande, puis supprimées.
        </p>
        <p>
          <strong>Base légale</strong> : exécution de mesures précontractuelles à votre demande (article 6.1.b du RGPD).
        </p>
      </section>

      <section className="mt-10 space-y-4 leading-relaxed">
        <h2 className="font-display text-2xl text-navy font-bold">3. Personnalisation selon la zone de l'annonce Google</h2>
        <p>
          Si vous arrivez sur le site en cliquant sur une annonce Google, le lien peut contenir un identifiant de zone
          géographique fourni par Google (paramètre « loc »). Le site le convertit, grâce à une table interne, en nom de
          département et, lorsqu'elle est connue avec certitude, de commune, afin d'adapter certains textes de la page.
        </p>
        <p>
          <strong>Données utilisées</strong> : uniquement l'identifiant de zone Google présent dans le lien. Aucune
          géolocalisation par adresse IP ou par GPS n'est réalisée, et aucune autorisation de localisation ne vous est demandée.<br />
          <strong>Destinataires</strong> : aucun ; la conversion est faite par notre site.<br />
          <strong>Conservation</strong> : la zone reconnue est gardée dans le stockage de session de votre navigateur pour
          conserver l'affichage d'une page à l'autre ; elle est effacée à la fermeture de l'onglet. Aucun cookie n'est posé à cette fin.
        </p>
        <p>
          <strong>Base légale</strong> : intérêt légitime (article 6.1.f du RGPD) pour fournir une information pertinente géographiquement.
        </p>
        <p className="text-sm text-ink/70 italic">
          Sans identifiant de zone reconnu (accès direct au site, lien partagé, zone inconnue…), le site affiche simplement
          sa formulation générique.
        </p>
      </section>

      <section className="mt-10 space-y-4 leading-relaxed">
        <h2 className="font-display text-2xl text-navy font-bold">4. Cookies et traceurs</h2>
        <p>
          Aucun cookie publicitaire ni tracker tiers n'est déposé par défaut sur ce site.
        </p>
        <p>
          Le suivi des conversions Google Ads et la mesure d'audience Google Analytics 4
          peuvent être activés ultérieurement — dans ce cas un bandeau de consentement sera affiché
          conformément à la directive ePrivacy.
        </p>
      </section>

      <section className="mt-10 space-y-4 leading-relaxed">
        <h2 className="font-display text-2xl text-navy font-bold">5. Vos droits</h2>
        <p>Conformément au RGPD et à la loi Informatique et Libertés, vous disposez des droits suivants :</p>
        <ul className="list-disc list-inside space-y-1 text-ink/85">
          <li>Droit d'accès à vos données</li>
          <li>Droit de rectification</li>
          <li>Droit à l'effacement</li>
          <li>Droit à la limitation du traitement</li>
          <li>Droit à la portabilité</li>
          <li>Droit d'opposition</li>
        </ul>
        <p>
          Pour exercer ces droits, contactez-nous au{" "}
          <PhoneLink />.
          Vous disposez également du droit d'introduire une réclamation auprès de la{" "}
          <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-gold underline">CNIL</a>.
        </p>
      </section>

      <section className="mt-10 space-y-4 leading-relaxed">
        <h2 className="font-display text-2xl text-navy font-bold">6. Hébergement</h2>
        <p>
          Le site est hébergé par <strong>Cloudflare, Inc.</strong>, dont les serveurs sont répartis dans le monde entier
          au sein de leur réseau edge. Cloudflare est certifié Data Privacy Framework UE-US.
        </p>
      </section>

    </LegalPage>
  );
}
