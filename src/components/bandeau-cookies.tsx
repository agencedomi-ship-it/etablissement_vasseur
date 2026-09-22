import { useEffect, useState } from "react";
import { enregistrerChoix, lireChoix, type Choix } from "@/lib/consentement";

// Bandeau de consentement : « Refuser » et « Accepter » ont la même importance visuelle (exigence CNIL).
// Il s'affiche tant qu'aucun choix valide n'est mémorisé, et se rouvre via « Gérer les cookies ».
export function BandeauCookies() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!lireChoix()) setVisible(true);
    const ouvrir = () => setVisible(true);
    window.addEventListener("vantory:cookies", ouvrir);
    return () => window.removeEventListener("vantory:cookies", ouvrir);
  }, []);

  if (!visible) return null;

  const choisir = (choix: Choix) => {
    setVisible(false);
    enregistrerChoix(choix);
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Gestion des cookies"
      className="fixed inset-x-3 z-[60] bottom-[calc(5rem+env(safe-area-inset-bottom))] md:bottom-5 md:inset-x-auto md:right-5 md:max-w-md rounded-xl border border-gold/40 bg-navy-deep text-cream shadow-[0_12px_40px_rgba(0,0,0,0.35)] p-4 md:p-5"
    >
      <p className="font-display text-lg font-bold">Vos choix de cookies</p>
      <p className="mt-1.5 text-sm text-cream/85 leading-relaxed">
        Avec votre accord, nous utilisons des traceurs Google pour mesurer l'efficacité de nos annonces et des appels.
        Si vous refusez, le site fonctionne exactement de la même façon.{" "}
        <a href="/rgpd#cookies" className="underline underline-offset-2 text-cream hover:text-gold">En savoir plus</a>
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => choisir("refuse")}
          className="rounded-md border-2 border-cream/80 px-3 py-2.5 text-sm font-semibold hover:bg-cream hover:text-navy transition-colors"
        >
          Refuser
        </button>
        <button
          type="button"
          onClick={() => choisir("accepte")}
          className="rounded-md border-2 border-cream/80 px-3 py-2.5 text-sm font-semibold hover:bg-cream hover:text-navy transition-colors"
        >
          Accepter
        </button>
      </div>
    </div>
  );
}
