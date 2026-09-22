// Personnalisation géographique Google Ads, côté navigateur.
//
// 1. Lit le paramètre ?loc= (Geo Target ID Google rempli par {loc_physical_ms}) SANS modifier l'URL :
//    gclid, gbraid, wbraid, kw, loc, loci… restent intacts pour Google Ads, GA4 et GTM.
// 2. Valide la valeur (entier de 4 à 10 chiffres) puis demande la correspondance au serveur
//    (/api/geo : lecture de la table locale, réponse mise en cache). Aucun appel externe.
// 3. Mémorise le lieu pour la session (sessionStorage) afin de le conserver d'une page à l'autre.
//    Un nouveau ?loc= remplace l'ancien ; s'il est vide, invalide ou inconnu, le lieu est effacé.
// 4. Met à jour les éléments marqués data-dynamic-department / data-dynamic-city.
//
// Aucune géolocalisation IP ou GPS, aucune demande d'autorisation : sans lieu certain,
// le contenu générique déjà présent dans la page reste affiché.

import { useSyncExternalStore } from "react";
import type { LieuGoogleAds } from "./geo-serveur";

export type { LieuGoogleAds };

const CLE_SESSION = "vantory-geo-ads";
const GEO_ID_VALIDE = /^\d{4,10}$/;

let lieu: LieuGoogleAds | null = null;
let demarre = false;
const abonnes = new Set<() => void>();

function estLieu(v: unknown): v is LieuGoogleAds {
  const l = v as LieuGoogleAds | null;
  return (
    !!l &&
    typeof l.geoId === "string" &&
    GEO_ID_VALIDE.test(l.geoId) &&
    typeof l.departementNumero === "string" &&
    typeof l.departementNom === "string" &&
    (l.ville === null || typeof l.ville === "string")
  );
}

function lireSession(): LieuGoogleAds | null {
  try {
    const v: unknown = JSON.parse(sessionStorage.getItem(CLE_SESSION) || "null");
    return estLieu(v) ? v : null;
  } catch {
    return null;
  }
}

function ecrireSession(l: LieuGoogleAds | null) {
  try {
    if (l) sessionStorage.setItem(CLE_SESSION, JSON.stringify(l));
    else sessionStorage.removeItem(CLE_SESSION);
  } catch {
    /* stockage indisponible (navigation privée stricte) : le lieu vaut pour la page en cours */
  }
}

function definirLieu(l: LieuGoogleAds | null) {
  lieu = l;
  ecrireSession(l);
  appliquerContenuDynamique();
  abonnes.forEach((f) => f());
}

/** Texte affiché dans les éléments data-dynamic-department, ex. « Hauts-de-Seine (92) ». */
export function texteDepartement(l: LieuGoogleAds): string {
  return `${l.departementNom} (${l.departementNumero})`;
}

function remplacer(el: Element, texte: string) {
  if (el.textContent !== texte) el.textContent = texte;
}

/**
 * Remplace le contenu des éléments marqués :
 *   <span data-dynamic-department>Île-de-France</span>  → « Hauts-de-Seine (92) »
 *   <span data-dynamic-city>votre secteur</span>          → « Boulogne-Billancourt »
 * Sans lieu connu (ou sans ville connue), le texte générique d'origine n'est pas touché.
 */
export function appliquerContenuDynamique(racine: ParentNode = document) {
  if (!lieu || typeof document === "undefined") return;
  const l = lieu;
  racine.querySelectorAll("[data-dynamic-department]").forEach((el) => remplacer(el, texteDepartement(l)));
  if (l.ville) racine.querySelectorAll("[data-dynamic-city]").forEach((el) => remplacer(el, l.ville as string));
}

/** À appeler une fois, après l'hydratation, sur toutes les pages (voir __root.tsx). */
export function demarrerGeoAds() {
  if (demarre || typeof window === "undefined") return;
  demarre = true;

  const params = new URLSearchParams(window.location.search);
  if (params.has("loc")) {
    // Nouveau clic d'annonce : seul ce ?loc= compte, l'ancien lieu mémorisé est oublié.
    const loc = (params.get("loc") || "").trim();
    definirLieu(null);
    if (GEO_ID_VALIDE.test(loc)) {
      fetch(`/api/geo?loc=${loc}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((d: { lieu?: unknown } | null) => {
          const nouveau = d?.lieu;
          if (estLieu(nouveau) && nouveau.geoId === loc) definirLieu(nouveau);
        })
        .catch(() => {
          /* échec réseau : contenu générique conservé */
        });
    }
  } else {
    // Pas de ?loc= : on reprend le lieu mémorisé pendant la session, s'il existe.
    definirLieu(lireSession());
  }

  // Éléments ajoutés plus tard (navigation interne sans rechargement, contenu chargé à la volée).
  new MutationObserver(() => appliquerContenuDynamique()).observe(document.body, { childList: true, subtree: true });
}

/** Lieu Google Ads courant pour les composants React (null tant qu'il n'est pas connu). */
export function useLieuGoogleAds(): LieuGoogleAds | null {
  return useSyncExternalStore(
    (f) => {
      abonnes.add(f);
      return () => abonnes.delete(f);
    },
    () => lieu,
    () => null,
  );
}
