import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/rgpd")({
  component: RgpdPage,
  head: () => ({
    meta: [
      { title: "Politique de confidentialité (RGPD) — Ets Serrurier Vasseur" },
      { name: "robots", content: "noindex,follow" },
      {
        name: "description",
        content:
          "Politique de confidentialité et données personnelles — Ets Serrurier Vasseur",
      },
    ],
  }),
});

function RgpdPage() {
  return (
    <main className="bg-cream text-ink min-h-screen">
      <header className="bg-navy-deep text-cream py-8">
        <div className="max-w-3xl mx-auto px-5 md:px-8 flex items-center justify-between">
          <Link to="/" className="text-cream/85 hover:text-gold text-sm transition-colors">
            ← Retour à l'accueil
          </Link>
          <p className="font-display text-xl text-cream font-bold">Ets Serrurier Vasseur</p>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-5 md:px-8 py-12 md:py-16 prose-content">
        <h1 className="font-display text-4xl md:text-5xl text-navy font-bold leading-tight">
          Politique de confidentialité
        </h1>
        <p className="text-sm text-ink/60 mt-2">Dernière mise à jour : mai 2026</p>

        <section className="mt-10 space-y-4 leading-relaxed">
          <h2 className="font-display text-2xl text-navy font-bold">1. Responsable du traitement</h2>
          <p>
            Le présent site est édité par les <strong>Établissements Serrurier Vasseur</strong>.
            Pour toute question relative à vos données personnelles, vous pouvez nous contacter au{" "}
            <a href="tel:+33970708211" className="text-gold font-semibold">09 70 70 82 11</a>.
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
            Vos données ne sont jamais cédées ni vendues à des tiers. Elles sont conservées pendant
            une durée maximale de 12 mois à compter de votre demande, puis supprimées.
          </p>
          <p>
            <strong>Base légale</strong> : exécution de mesures précontractuelles à votre demande (article 6.1.b du RGPD).
          </p>
        </section>

        <section className="mt-10 space-y-4 leading-relaxed">
          <h2 className="font-display text-2xl text-navy font-bold">3. Géolocalisation par adresse IP — service tiers ipapi.co</h2>
          <p>
            Afin d'adapter dynamiquement le nom de votre département dans la section
            <em>« Où nous intervenons »</em> et de personnaliser la liste des communes affichées
            dans les avis clients, votre <strong>adresse IP</strong> est transmise au service tiers{" "}
            <a href="https://ipapi.co/privacy/" target="_blank" rel="noopener noreferrer" className="text-gold underline">ipapi.co</a>,
            édité par Kloudend, Inc., et qui agit en tant que sous-traitant.
          </p>
          <p>
            <strong>Données transmises</strong> : votre adresse IP uniquement.<br />
            <strong>Données reçues</strong> : code département, ville approximative, code postal (lecture seule, en mémoire navigateur, le temps de votre visite).<br />
            <strong>Finalité</strong> : personnaliser l'affichage de la zone d'intervention.<br />
            <strong>Stockage</strong> : aucun. Nous ne conservons pas votre adresse IP ni les données géographiques retournées. Aucun cookie n'est posé.<br />
            <strong>Hébergement</strong> : ipapi.co est basé aux États-Unis ; le service est conforme au RGPD et au Data Privacy Framework UE-US (cf. leur{" "}
            <a href="https://ipapi.co/privacy/" target="_blank" rel="noopener noreferrer" className="text-gold underline">politique de confidentialité</a>).
          </p>
          <p>
            <strong>Base légale</strong> : intérêt légitime (article 6.1.f du RGPD) pour fournir une expérience pertinente géographiquement.
          </p>
          <p className="text-sm text-ink/70 italic">
            Vous pouvez bloquer cet appel en désactivant JavaScript dans votre navigateur ou en utilisant
            une extension de blocage de tiers (uBlock Origin, etc.). Le site reste alors entièrement fonctionnel,
            le texte de la zone d'intervention affiche simplement la formulation générique par défaut.
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
            <a href="tel:+33970708211" className="text-gold font-semibold">09 70 70 82 11</a>.
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

        <div className="mt-12 pt-8 border-t border-parchment text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-navy hover:text-gold font-semibold transition-colors">
            ← Retour à l'accueil
          </Link>
        </div>
      </article>
    </main>
  );
}
