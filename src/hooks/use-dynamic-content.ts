// Hooks de personnalisation dynamique de la landing :
// - useDynamicH1() lit le keyword Google Ads dans ?kw= et renvoie le H1 à afficher
// - useGeoDept() interroge /api/geo (département calculé côté serveur, async, non bloquant) et
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

/**
 * Renvoie le H1 à afficher : mot-clé de l'annonce (?kw=) s'il y en a un, sinon
 * « Serrurier <département> (<code>) » si le département du visiteur est connu, sinon la marque.
 */
export function useDynamicH1(): string {
  const [kw, setKw] = useState<string | null>(null);
  const geo = useGeoDept();
  useEffect(() => {
    try {
      setKw(sanitizeKw(new URLSearchParams(window.location.search).get("kw")));
    } catch {
      /* noop : on garde le fallback */
    }
  }, []);
  if (kw) return kw;
  if (geo.deptName && geo.deptCode) return `Serrurier ${geo.deptName} (${geo.deptCode})`;
  return FALLBACK_H1;
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
  /** Pool de villes (dept visiteur + voisins) — utilisé pour réécrire les avis */
  cityPool: string[];
};

const EMPTY: GeoData = {
  deptCode: null,
  deptName: null,
  deptLabel: null,
  neighborsLabel: null,
  neighborCities: null,
  footerLabel: null,
  cityPool: [],
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

  // Pool de villes pour réécrire les avis
  const cityPool: string[] = [];
  [code, ...adjList].forEach((c) => {
    if (DEPT_CITIES[c]) cityPool.push(...DEPT_CITIES[c]);
  });

  return { deptCode: code, deptName: name, deptLabel: `${code} — ${name}`, neighborsLabel, neighborCities, footerLabel, cityPool };
}

// Une seule requête par visite, partagée par tous les composants qui utilisent le hook.
let geoPromise: Promise<GeoData> | null = null;
function loadGeo(): Promise<GeoData> {
  const params = new URLSearchParams(window.location.search);
  // ?dep=07 : département imposé par l'URL de l'annonce (prioritaire sur la localisation IP).
  const dep = (params.get("dep") || "").toUpperCase();
  if (FR_DEPT[dep]) return Promise.resolve(buildGeo(dep));
  // ?cp=07000 : simule un visiteur de ce code postal (test).
  const testCp = params.get("cp");
  if (testCp && /^\d{5}$/.test(testCp)) return Promise.resolve(buildGeo(deriveDeptCode(testCp)));
  geoPromise ??= fetch("/api/geo", { cache: "no-store" })
    .then((r) => (r.ok ? r.json() : null))
    .then((d: { dept?: string | null } | null) => buildGeo(d?.dept))
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
