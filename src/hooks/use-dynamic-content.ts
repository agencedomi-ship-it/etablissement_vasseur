// Hooks de personnalisation dynamique de la landing :
// - useKeyword() lit le mot-clé Google Ads dans ?kw= (ligne dédiée sous le sous-titre de l'en-tête)
// - useDynamicH1() renvoie le H1 (département Google Ads ou marque)
// - useGeoDept() renvoie le département Google Ads (?loc=, voir lib/geo-ads) avec ses voisins.
//   Sans lieu Google Ads certain : contenu générique.

import { useEffect, useMemo, useState } from "react";
import { FR_DEPT, DEPT_ADJ, DEPT_CITY } from "@/lib/geo-data";
import { useLieuGoogleAds } from "@/lib/geo-ads";

const FALLBACK_H1 = "Serrurier Vantory";

function sanitizeKw(raw: string | null): string | null {
  if (!raw) return null;
  const cleaned = raw.replace(/[^a-zA-ZÀ-ÿ0-9 \-]/g, "").slice(0, 60).trim();
  if (!cleaned) return null;
  // Title Case respectant les accents
  return cleaned
    .toLowerCase()
    .replace(/(^|[\s\-])([a-zà-ÿ])/g, (_, sep, ch) => sep + ch.toUpperCase());
}

/** Mot-clé de l'annonce (?kw=) mis en forme, ou null s'il n'y en a pas. */
export function useKeyword(): string | null {
  const [kw, setKw] = useState<string | null>(null);
  useEffect(() => {
    try {
      setKw(sanitizeKw(new URLSearchParams(window.location.search).get("kw")));
    } catch {
      /* noop : pas de mot-clé */
    }
  }, []);
  return kw;
}

/** H1 : « Serrurier <département> (<code>) » si le département du visiteur est connu, sinon la marque. */
export function useDynamicH1(): string {
  const geo = useGeoDept();
  if (geo.deptName && geo.deptCode) return `Serrurier ${geo.deptName} (${geo.deptCode})`;
  return FALLBACK_H1;
}

export type GeoData = {
  /** "07" et "Ardèche", ou null si le département n'est pas connu */
  deptCode: string | null;
  deptName: string | null;
  /** "07 — Ardèche" ou null tant que la géoloc n'a pas répondu / non localisé */
  deptLabel: string | null;
  /** "Hauts-de-Seine (92), Seine-Saint-Denis (93), Val-de-Marne (94)" */
  neighborsLabel: string | null;
  /** "Nanterre (92), Bobigny (93) et Créteil (94)" — villes top des voisins */
  neighborCities: string | null;
  /** Texte court pour le footer : "tout le 07 — Ardèche et les départements limitrophes" */
  footerLabel: string | null;
};

const EMPTY: GeoData = {
  deptCode: null,
  deptName: null,
  deptLabel: null,
  neighborsLabel: null,
  neighborCities: null,
  footerLabel: null,
};

function buildGeo(code: string | null | undefined): GeoData {
  if (!code) return EMPTY;
  const name = FR_DEPT[code];
  if (!name) return EMPTY;

  const adjList = (DEPT_ADJ[code] || "").split(" ").filter(Boolean);

  // Liste des noms de départements voisins (max 4) — pour la zone d'intervention
  const neighborsLabel = adjList.length
    ? adjList
        .slice(0, 4)
        .map((c) => FR_DEPT[c] && `${FR_DEPT[c]} (${c})`)
        .filter(Boolean)
        .join(", ")
    : null;

  // Villes chef-lieu des voisins (max 4) — pour le paragraphe 2 de la zone
  const cities = adjList
    .slice(0, 4)
    .map((c) => (DEPT_CITY[c] ? `${DEPT_CITY[c]} (${c})` : null))
    .filter(Boolean) as string[];
  const neighborCities =
    cities.length === 0
      ? null
      : cities.length === 1
        ? cities[0]
        : cities.slice(0, -1).join(", ") + " et " + cities[cities.length - 1];

  // Footer
  const footerLabel = adjList.length
    ? `tout le ${code} — ${name} et les départements limitrophes`
    : `tout le ${code} — ${name}`;


  return { deptCode: code, deptName: name, deptLabel: `${code} — ${name}`, neighborsLabel, neighborCities, footerLabel };
}

/** Département du visiteur d'après Google Ads (?loc=) ; EMPTY tant qu'il n'est pas connu avec certitude. */
export function useGeoDept(): GeoData {
  const lieu = useLieuGoogleAds();
  const code = lieu?.departementNumero ?? null;
  return useMemo(() => buildGeo(code), [code]);
}
