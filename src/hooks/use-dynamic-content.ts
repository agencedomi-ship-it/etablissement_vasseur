// Hooks de personnalisation dynamique de la landing :
// - useDynamicH1() lit le keyword Google Ads dans ?kw= et renvoie le H1 à afficher
// - useGeoDept() interroge /api/geo (localisation Cloudflare, async, non bloquant) et
//   renvoie les informations de département + voisins + pool de villes pour les avis.

import { useEffect, useState } from "react";
import { FR_DEPT, DEPT_ADJ, DEPT_CITIES, DEPT_CITY } from "@/lib/geo-data";

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

/** Renvoie le H1 à afficher : keyword sanitisé depuis ?kw= sinon fallback marque. */
export function useDynamicH1(): string {
  const [h1, setH1] = useState<string>(FALLBACK_H1);
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const kw = sanitizeKw(params.get("kw"));
      if (kw) setH1(kw);
    } catch {
      /* noop : on garde le fallback */
    }
  }, []);
  return h1;
}

function deriveDeptCode(postal: unknown): string | null {
  if (!postal) return null;
  const p = String(postal).trim();
  if (/^97[1-6]\d{2}$/.test(p)) return p.slice(0, 3);
  if (/^20\d{3}$/.test(p)) {
    return parseInt(p.slice(2, 3), 10) <= 1 ? "2A" : "2B";
  }
  if (/^\d{5}$/.test(p)) return p.slice(0, 2);
  return null;
}

export type GeoData = {
  /** "Ardèche (07)" ou null tant que la géoloc n'a pas répondu / hors FR */
  deptLabel: string | null;
  /** "Hauts-de-Seine (92), Seine-Saint-Denis (93), Val-de-Marne (94)" */
  neighborsLabel: string | null;
  /** "Nanterre (92), Bobigny (93) et Créteil (94)" — villes top des voisins */
  neighborCities: string | null;
  /** Texte court pour le footer : "votre département (Ardèche, 07) et les départements limitrophes" */
  footerLabel: string | null;
  /** Pool de villes (dept visiteur + voisins) — utilisé pour réécrire les avis */
  cityPool: string[];
};

const EMPTY: GeoData = {
  deptLabel: null,
  neighborsLabel: null,
  neighborCities: null,
  footerLabel: null,
  cityPool: [],
};

function buildGeo(d: { country?: string | null; postal?: string | null } | null): GeoData {
  if (!d || d.country !== "FR") return EMPTY;
  const code = deriveDeptCode(d.postal);
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
    ? `votre département (${name}, ${code}) et les départements limitrophes`
    : `votre département (${name}, ${code})`;

  // Pool de villes pour réécrire les avis
  const cityPool: string[] = [];
  [code, ...adjList].forEach((c) => {
    if (DEPT_CITIES[c]) cityPool.push(...DEPT_CITIES[c]);
  });

  return { deptLabel: `${name} (${code})`, neighborsLabel, neighborCities, footerLabel, cityPool };
}

// Une seule requête par visite, partagée par tous les composants qui utilisent le hook.
let geoPromise: Promise<GeoData> | null = null;
function loadGeo(): Promise<GeoData> {
  // Test : ?cp=07000 simule un visiteur de ce code postal (affichage local uniquement).
  const testCp = new URLSearchParams(window.location.search).get("cp");
  if (testCp && /^\d{5}$/.test(testCp)) return Promise.resolve(buildGeo({ country: "FR", postal: testCp }));
  geoPromise ??= fetch("/api/geo", { cache: "no-store" })
    .then((r) => (r.ok ? r.json() : null))
    .then(buildGeo)
    .catch(() => EMPTY);
  return geoPromise;
}

/** Renvoie les infos géo du visiteur. Fallback silencieux si hors FR ou échec. */
export function useGeoDept(): GeoData {
  const [data, setData] = useState<GeoData>(EMPTY);

  useEffect(() => {
    let cancelled = false;
    loadGeo().then((d) => {
      if (!cancelled) setData(d);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return data;
}
