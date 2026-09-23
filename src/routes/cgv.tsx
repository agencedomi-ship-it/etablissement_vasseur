import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage, LegalSection, PhoneLink } from "@/components/legal-page";
import { EDITEUR } from "@/lib/editeur";

export const Route = createFileRoute("/cgv")({
  component: CgvPage,
  head: () => ({
    meta: [
      { title: `Conditions générales — ${EDITEUR.nomCommercial}` },
      { name: "robots", content: "noindex,follow" },
      { name: "description", content: `Conditions générales de vente du service ${EDITEUR.nomCommercial}.` },
    ],
  }),
});

function CgvPage() {
  return (
    <LegalPage title="Conditions générales de vente" updated="septembre 2026">
      <LegalSection title="1. Objet">
        <p>
          Les présentes conditions encadrent le service proposé sous le nom <strong>{EDITEUR.nomCommercial}</strong> par la
          société {EDITEUR.raisonSociale}, {EDITEUR.forme} au capital de {EDITEUR.capital}, dont le siège est situé {EDITEUR.siege}{" "}
          ({EDITEUR.rcs}).
        </p>
        <p>
          {EDITEUR.nomCommercial} vous met en relation avec un technicien de son <strong>réseau de techniciens serruriers sélectionnés</strong>,
          professionnels indépendants intervenant près de chez vous, pour le dépannage, l'ouverture de porte, le changement
          de serrure et la sécurisation de votre logement ou de vos locaux.
        </p>
      </LegalSection>

      <LegalSection title="2. Rôle de chacun">
        <p>
          <strong>{EDITEUR.nomCommercial}</strong> reçoit votre demande par téléphone ou par le formulaire, vous annonce un tarif
          indicatif, puis missionne le technicien du réseau le plus proche et disponible.
        </p>
        <p>
          <strong>Le technicien</strong> est un professionnel indépendant. Il réalise l'intervention, établit le devis et la
          facture à son nom et reste seul responsable des travaux qu'il exécute.
        </p>
        <p>
          <strong>Vous</strong> restez libre d'accepter ou de refuser le devis avant tout commencement des travaux.
        </p>
      </LegalSection>

      <LegalSection title="3. Prix et devis">
        <p>
          Un tarif indicatif vous est communiqué au téléphone avant le déplacement du technicien. Sur place, celui-ci vous
          remet un devis écrit et détaillé, conformément à l'article 4 de l'arrêté du 24 janvier 2017 relatif à la publicité des
          prix des prestations de dépannage, de réparation et d'entretien dans le secteur du bâtiment et de l'équipement de la maison. Aucun travail n'est
          commencé sans votre accord signé sur ce devis.
        </p>
        <p>
          Les frais de déplacement s'élèvent à <strong>{EDITEUR.fraisDeplacement}</strong>. Ils sont déjà compris dans le prix de
          certaines prestations, signalées « déplacement compris » dans nos tarifs, comme l'ouverture de porte claquée&nbsp;: ils ne
          sont alors pas facturés en plus. Dans tous les cas, ils vous sont annoncés au téléphone avant le déplacement et figurent
          sur le devis.
        </p>
      </LegalSection>

      <LegalSection title="4. Délai d'intervention">
        <p>
          Le délai de 30 minutes annoncé est un délai moyen, pendant les horaires du service (de 8h à 22h du lundi au jeudi, et 24h/24 du vendredi au dimanche).
          Il peut varier selon la circulation, la météo ou la disponibilité des techniciens ; le délai prévu vous est confirmé
          au moment de la prise en charge.
        </p>
      </LegalSection>

      <LegalSection title="5. Droit de rétractation">
        <p>
          Lorsqu'un contrat est conclu à votre domicile, vous disposez en principe d'un délai de rétractation de 14 jours.
          Ce droit ne s'applique pas aux travaux de réparation réalisés en urgence à votre domicile et expressément sollicités
          par vous, dans la limite des pièces et travaux strictement nécessaires pour répondre à l'urgence
          (article L.&nbsp;221-28, 8° du Code de la consommation). Tout travail allant au-delà fait l'objet d'un devis distinct.
        </p>
      </LegalSection>

      <LegalSection title="6. Paiement">
        <p>
          Le paiement est dû au technicien après réalisation et validation des travaux, sur présentation de sa facture.
          Il peut être réglé par carte bancaire, espèces ou virement, ou pris en charge par votre assurance habitation
          lorsque votre contrat le prévoit.
        </p>
      </LegalSection>

      <LegalSection title="7. Garanties">
        <p>
          Les travaux sont couverts par les garanties légales dues par le technicien qui les réalise (garantie de conformité
          et garantie des vices cachés). Ses coordonnées figurent sur son devis et sa facture.
        </p>
      </LegalSection>

      <LegalSection title={`8. Responsabilité de ${EDITEUR.raisonSociale}`}>
        <p>
          La responsabilité de {EDITEUR.raisonSociale} porte sur le traitement de votre demande et le missionnement du
          technicien. Elle ne peut être recherchée pour l'exécution des travaux, qui relève du technicien intervenant.
        </p>
      </LegalSection>

      <LegalSection title="9. Réclamations">
        <p>
          Toute réclamation peut être adressée par téléphone au <PhoneLink />, par e-mail à{" "}
          <a href={`mailto:${EDITEUR.email}`} className="text-navy font-semibold underline underline-offset-2">{EDITEUR.email}</a>{" "}
          ou par courrier à {EDITEUR.raisonSociale}, {EDITEUR.siege}. Nous nous engageons à vous répondre dans les meilleurs délais.
        </p>
      </LegalSection>

      <LegalSection title="10. Médiation de la consommation">
        <p>
          Conformément aux articles L.&nbsp;611-1 et suivants du Code de la consommation, vous pouvez recourir gratuitement à
          un médiateur de la consommation lorsqu'une réclamation écrite est restée sans solution.
        </p>
        {EDITEUR.mediateur ? (
          <p>
            Le médiateur compétent est {EDITEUR.mediateur.nom}, {EDITEUR.mediateur.adresse} ({EDITEUR.mediateur.site}).
          </p>
        ) : (
          <p>
            {EDITEUR.raisonSociale} finalise son adhésion à un dispositif de médiation de la consommation ; les coordonnées du
            médiateur seront publiées sur cette page dès sa désignation.
          </p>
        )}
        <p>
          Pour un différend portant sur les travaux, le médiateur compétent est celui du technicien intervenant, indiqué sur
          son devis ou sa facture.
        </p>
      </LegalSection>

      <LegalSection title="11. Données personnelles">
        <p>
          Le traitement de vos données est décrit dans la{" "}
          <Link to="/rgpd" className="text-navy underline underline-offset-2">politique de confidentialité</Link>.
        </p>
      </LegalSection>

      <LegalSection title="12. Droit applicable">
        <p>Les présentes conditions sont soumises au droit français.</p>
      </LegalSection>
    </LegalPage>
  );
}
