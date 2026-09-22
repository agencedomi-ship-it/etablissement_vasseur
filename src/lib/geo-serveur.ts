// Correspondance Geo Target ID Google Ads → ville / département, côté serveur.
// La table google-lieux-fr.json (ID → [département, ville | null]) est générée par
// outils/table_lieux_google.py à partir des données officielles Google Ads Geo Targets et des
// communes de l'État. Un ID absent de la table n'est jamais « deviné » : le site reste générique.
// Aucune géolocalisation IP ni GPS.

import LIEUX from "./google-lieux-fr.json";
import { FR_DEPT } from "./geo-data";

export type LieuGoogleAds = {
  geoId: string;
  ville: string | null;
  departementNumero: string;
  departementNom: string;
};

const lieux = LIEUX as unknown as Record<string, [string, string | null]>;

/** Un Geo Target ID Google est un entier (ex. 1005969) ; tout le reste est refusé. */
export const GEO_ID_VALIDE = /^\d{4,10}$/;

export function lieuDepuisGeoId(geoId: string | null | undefined): LieuGoogleAds | null {
  if (!geoId || !GEO_ID_VALIDE.test(geoId)) return null;
  const entree = lieux[geoId];
  if (!entree) return null;
  const [departementNumero, ville] = entree;
  const departementNom = FR_DEPT[departementNumero];
  if (!departementNom) return null;
  return { geoId, ville: ville ?? null, departementNumero, departementNom };
}
