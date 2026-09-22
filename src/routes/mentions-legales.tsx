import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage, LegalSection, PhoneLink } from "@/components/legal-page";
import { EDITEUR, HEBERGEUR } from "@/lib/editeur";

export const Route = createFileRoute("/mentions-legales")({
  component: MentionsLegalesPage,
  head: () => ({
    meta: [
      { title: `Mentions légales — ${EDITEUR.nomCommercial}` },
      { name: "robots", content: "noindex,follow" },
      { name: "description", content: `Mentions légales du site ${EDITEUR.nomCommercial}.` },
    ],
  }),
});

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid sm:grid-cols-[13rem_1fr] gap-x-4 py-2 border-b border-parchment/70">
      <dt className="font-semibold text-navy">{label}</dt>
      <dd className="text-ink/85">{children}</dd>
    </div>
  );
}

function MentionsLegalesPage() {
  return (
    <LegalPage title="Mentions légales" updated="septembre 2026">
      <LegalSection title="Éditeur du site">
        <dl>
          <Row label="Nom commercial">{EDITEUR.nomCommercial}</Row>
          <Row label="Société">{EDITEUR.raisonSociale}, {EDITEUR.forme} au capital de {EDITEUR.capital}</Row>
          <Row label="Siège social">{EDITEUR.siege}</Row>
          <Row label="Immatriculation">{EDITEUR.rcs}</Row>
          <Row label="SIRET">{EDITEUR.siret}</Row>
          <Row label="TVA intracommunautaire">{EDITEUR.tva}</Row>
          <Row label="Téléphone"><PhoneLink /></Row>
          {EDITEUR.email && (
            <Row label="E-mail">
              <a href={`mailto:${EDITEUR.email}`} className="text-gold font-semibold">{EDITEUR.email}</a>
            </Row>
          )}
          <Row label="Directeur de la publication">{EDITEUR.president}, président</Row>
        </dl>
      </LegalSection>

      <LegalSection title="Hébergeur">
        <dl>
          <Row label="Société">{HEBERGEUR.nom}</Row>
          <Row label="Adresse">{HEBERGEUR.adresse}</Row>
          <Row label="Site">
            <a href={HEBERGEUR.site} target="_blank" rel="noopener noreferrer" className="text-gold underline">www.cloudflare.com</a>
          </Row>
        </dl>
      </LegalSection>

      <LegalSection title="Service proposé">
        <p>
          Les conditions dans lesquelles {EDITEUR.nomCommercial} traite votre demande et organise l'intervention sont
          décrites dans les <Link to="/cgv" className="text-gold underline">conditions générales</Link>.
        </p>
      </LegalSection>

      <LegalSection title="Textes et photographies">
        <p>
          Les textes du site appartiennent à {EDITEUR.raisonSociale} ; leur reproduction sans autorisation est interdite.
          Les photographies sont des illustrations : elles ne représentent pas nécessairement le technicien qui interviendra chez vous.
        </p>
      </LegalSection>

      <LegalSection title="Données personnelles">
        <p>
          Le traitement de vos données est décrit dans la{" "}
          <Link to="/rgpd" className="text-gold underline">politique de confidentialité</Link>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
