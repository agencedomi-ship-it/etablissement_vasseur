// Hooks de personnalisation dynamique de la landing :
// - useKeyword() lit le mot-clé Google Ads dans ?kw= (ligne dédiée sous le sous-titre de l'en-tête)
// - useDynamicH1() renvoie le H1 (département Google Ads ou marque)
// - useGeoDept() renvoie le département Google Ads (?loc=, voir lib/geo-ads).
//   Sans lieu Google Ads certain : contenu générique.

import { useEffect, useMemo, useState } from "react";
import { FR_DEPT } from "@/lib/geo-data";
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
  /** "92" et "Hauts-de-Seine", ou null si le département n'est pas connu avec certitude */
  deptCode: string | null;
  deptName: string | null;
  /** "92 — Hauts-de-Seine" (zone d'intervention) */
  deptLabel: string | null;
};

const EMPTY: GeoData = { deptCode: null, deptName: null, deptLabel: null };

function buildGeo(code: string | null | undefined): GeoData {
  if (!code) return EMPTY;
  const name = FR_DEPT[code];
  if (!name) return EMPTY;
  return { deptCode: code, deptName: name, deptLabel: `${code} — ${name}` };
}

/** Département du visiteur d'après Google Ads (?loc=) ; EMPTY tant qu'il n'est pas connu avec certitude. */
export function useGeoDept(): GeoData {
  const lieu = useLieuGoogleAds();
  const code = lieu?.departementNumero ?? null;
  return useMemo(() => buildGeo(code), [code]);
}
