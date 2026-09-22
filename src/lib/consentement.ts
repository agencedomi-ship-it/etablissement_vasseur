// Consentement aux traceurs (CNIL / mode de consentement Google v2).
//
// Aucun outil Google (Tag Manager, Google Ads, suivi des appels) n'est chargé avant un « Accepter ».
// Le script placé dans <head> (__root.tsx) déclare le consentement « refusé » par défaut et ne charge
// Tag Manager que si un accord valide est déjà mémorisé. Le choix est conservé 6 mois.

export type Choix = "accepte" | "refuse";

const CLE = "vantory-consentement";
const DUREE_MS = 182 * 86400_000; // ~6 mois, durée recommandée par la CNIL

type FenetreGoogle = Window & { dataLayer?: unknown[]; __chargerGTM?: () => void };

export function lireChoix(): Choix | null {
  try {
    const v = JSON.parse(localStorage.getItem(CLE) || "null") as { choix?: Choix; t?: number } | null;
    if (v && (v.choix === "accepte" || v.choix === "refuse") && Date.now() - (v.t ?? 0) < DUREE_MS) return v.choix;
  } catch {
    /* stockage indisponible : le bandeau sera reproposé */
  }
  return null;
}

// Même fonctionnement que le gtag() officiel : on pousse l'objet « arguments » dans dataLayer.
function gtag(..._args: unknown[]) {
  const w = window as FenetreGoogle;
  w.dataLayer = w.dataLayer || [];
  // eslint-disable-next-line prefer-rest-params
  w.dataLayer.push(arguments);
}

function supprimerCookiesGoogle() {
  const hotes = [location.hostname, "." + location.hostname.replace(/^www\./, "")];
  document.cookie.split(";").forEach((c) => {
    const nom = c.split("=")[0].trim();
    if (/^(_gcl_|_ga|_gid|_gat|FPAU|FPGCL)/.test(nom)) {
      hotes.forEach((h) => (document.cookie = `${nom}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${h}`));
      document.cookie = `${nom}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    }
  });
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith("_gcl"))
      .forEach((k) => localStorage.removeItem(k));
  } catch {
    /* rien */
  }
}

export function enregistrerChoix(choix: Choix) {
  const avant = lireChoix();
  try {
    localStorage.setItem(CLE, JSON.stringify({ choix, t: Date.now() }));
  } catch {
    /* le choix vaut pour la page en cours */
  }
  if (choix === "accepte") {
    gtag("consent", "update", {
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
      analytics_storage: "granted",
    });
    (window as FenetreGoogle).__chargerGTM?.();
  } else {
    gtag("consent", "update", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
    });
    supprimerCookiesGoogle();
    // Retrait d'un accord donné auparavant : on recharge pour décharger Tag Manager.
    if (avant === "accepte") location.reload();
  }
}

/** Rouvre le bandeau (lien « Gérer les cookies »). */
export function ouvrirBandeauCookies() {
  window.dispatchEvent(new Event("vantory:cookies"));
}
