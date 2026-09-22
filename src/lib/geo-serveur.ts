// Département du visiteur, calculé côté serveur à partir de la localisation que Cloudflare
// associe à la requête (request.cf) :
//   1. code postal fourni par Cloudflare ;
//   2. à défaut, coordonnées approximatives → commune via geo.api.gouv.fr (API publique de l'État).
// Aucune adresse IP n'est transmise ni stockée.

export type CfGeo = {
  country?: string;
  postalCode?: string;
  latitude?: string;
  longitude?: string;
};

export type GeoVisiteur = {
  country: string | null;
  dept: string | null;
  source: "code postal" | "coordonnées" | "outre-mer" | "inconnu" | "hors France";
};

// Cloudflare renvoie un code pays propre aux départements d'outre-mer.
const PAYS_OUTRE_MER: Record<string, string> = { GP: "971", MQ: "972", GF: "973", RE: "974", YT: "976" };

export function deptDepuisCodePostal(postal: unknown): string | null {
  if (!postal) return null;
  const p = String(postal).trim();
  if (/^97[1-6]\d{2}$/.test(p)) return p.slice(0, 3);
  if (/^20\d{3}$/.test(p)) return parseInt(p.slice(2, 3), 10) <= 1 ? "2A" : "2B";
  if (/^\d{5}$/.test(p)) return p.slice(0, 2);
  return null;
}

async function deptDepuisCoordonnees(lat: number, lon: number): Promise<string | null> {
  const url = `https://geo.api.gouv.fr/communes?lat=${lat.toFixed(2)}&lon=${lon.toFixed(2)}&fields=codeDepartement&format=json`;
  try {
    const r = await fetch(url, {
      signal: AbortSignal.timeout(2500),
      // Mise en cache côté Cloudflare : une même zone (~1 km) n'est interrogée qu'une fois par jour.
      cf: { cacheTtl: 86400, cacheEverything: true },
    } as RequestInit);
    if (!r.ok) return null;
    const communes = (await r.json()) as { codeDepartement?: string }[];
    return communes[0]?.codeDepartement ?? null;
  } catch {
    return null;
  }
}

export async function departementDuVisiteur(cf: CfGeo | undefined): Promise<GeoVisiteur> {
  const country = cf?.country ?? null;
  if (country && PAYS_OUTRE_MER[country]) return { country: "FR", dept: PAYS_OUTRE_MER[country], source: "outre-mer" };
  if (country !== "FR") return { country, dept: null, source: "hors France" };

  const parCodePostal = deptDepuisCodePostal(cf?.postalCode);
  if (parCodePostal) return { country, dept: parCodePostal, source: "code postal" };

  const lat = Number(cf?.latitude);
  const lon = Number(cf?.longitude);
  if (cf?.latitude && cf?.longitude && Number.isFinite(lat) && Number.isFinite(lon)) {
    const parCoordonnees = await deptDepuisCoordonnees(lat, lon);
    if (parCoordonnees) return { country, dept: parCoordonnees, source: "coordonnées" };
  }
  return { country, dept: null, source: "inconnu" };
}
