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
          personnelles, vous pouvez nous contacter au <PhoneLink /> ou à{" "}
          <a href={`mailto:${EDITEUR.email}`} className="text-navy font-semibold underline underline-offset-2">{EDITEUR.email}</a>.
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
          <strong>Finalité</strong> : vous recontacter pour vous annoncer le tarif et organiser l'intervention.
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

      <section id="cookies" className="mt-10 space-y-4 leading-relaxed scroll-mt-6">
        <h2 className="font-display text-2xl text-navy font-bold">4. Cookies et traceurs</h2>
        <p>
          <strong>Sans votre accord, aucun traceur publicitaire n'est déposé</strong> et aucun outil Google n'est chargé.
          Un bandeau vous propose de les accepter ou de les refuser, avec la même facilité ; le site fonctionne de la même
          façon dans les deux cas.
        </p>
        <p>
          <strong>Avec votre accord</strong>, les outils suivants sont activés : Google Tag Manager (chargement des outils
          ci-après), Google Ads (mesure des demandes et des appels issus de nos annonces, remarketing) et le suivi des appels
          de Google, qui peut afficher un numéro de suivi redirigeant vers notre standard. Ces outils sont fournis par Google
          Ireland Ltd et peuvent déposer des cookies d'une durée de vie de 13 mois au plus.
        </p>
        <p>
          <strong>Sans accord nécessaire</strong> : la mesure d'audience Cloudflare Web Analytics, sans cookie ni identifiant
          personnel, et le stockage de session décrit au point 3.
        </p>
        <p>
          Votre choix est conservé 6 mois. Vous pouvez le modifier à tout moment grâce au lien « Gérer les cookies » en bas
          de chaque page ; un refus supprime les cookies Google déjà déposés.
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
          Pour exercer ces droits, contactez-nous au <PhoneLink /> ou à{" "}
          <a href={`mailto:${EDITEUR.email}`} className="text-navy font-semibold underline underline-offset-2">{EDITEUR.email}</a>.
          Vous disposez également du droit d'introduire une réclamation auprès de la{" "}
          <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-navy underline underline-offset-2">CNIL</a>.
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
