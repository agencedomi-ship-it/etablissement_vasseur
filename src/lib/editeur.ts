// Identité légale de l'éditeur — source : registre national des entreprises (fiche Pappers
// VANTORY, SIREN 102 609 203), relevée le 22 septembre 2026.
export const SITE_URL = "https://serrurier-vantory.fr";

export const EDITEUR = {
  nomCommercial: "Serrurier Vantory",
  raisonSociale: "VANTORY",
  forme: "SASU",
  capital: "5 200 €",
  siege: "149 avenue du Maine, 75014 Paris",
  rcs: "RCS Paris 102 609 203",
  siren: "102 609 203",
  siret: "102 609 203 00017",
  tva: "FR61102609203",
  president: "Karim Ait Abdelmalek",
  telephone: "09 70 70 82 11",
  // Frais de déplacement TTC (arrêté du 24/01/2017), sauf prestations « déplacement compris ».
  fraisDeplacement: "49 € TTC",
  telephoneLien: "tel:+33970708211",
  // Adresse électronique de contact (obligatoire, art. 6 LCEN) : boîte OVH MX Plan.
  email: "contact@serrurier-vantory.fr" as string | null,
  // Médiateur de la consommation : null = formule d'attente. Format : { nom, adresse, site }.
  mediateur: null as { nom: string; adresse: string; site: string } | null,
};

export const HEBERGEUR = {
  nom: "Cloudflare, Inc.",
  adresse: "101 Townsend Street, San Francisco, CA 94107, États-Unis",
  site: "https://www.cloudflare.com",
};
