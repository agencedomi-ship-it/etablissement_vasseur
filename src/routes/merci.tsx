import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/merci")({
  component: MerciPage,
  head: () => ({
    meta: [
      { title: "Demande envoyée — Ets Serrurier Vasseur" },
      {
        name: "description",
        content: "Votre demande de devis a bien été envoyée. Un artisan vous rappelle rapidement.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function pushGtmEvent(event: string, data: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const w = window as Window & { dataLayer?: Array<Record<string, unknown>> };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, ...data });
}

function MerciPage() {
  useEffect(() => {
    pushGtmEvent("thank_you_view", {
      form_name: "devis",
      conversion_type: "lead",
    });
  }, []);

  return (
    <main className="min-h-screen bg-navy-deep text-cream flex items-center justify-center px-5 py-12">
      <section className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-gold/35 bg-navy p-7 text-center shadow-card-hover sm:p-12">
        <div
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, #C9A04E 0, transparent 38%), radial-gradient(circle at 80% 80%, #C9A04E 0, transparent 38%)",
          }}
        />

        <div className="relative">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gold text-navy shadow-[0_8px_28px_rgba(201,160,78,0.35)]">
            <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            Demande bien envoyée
          </p>
          <h1 className="font-display text-4xl font-bold leading-tight sm:text-6xl">
            Merci pour votre demande
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-cream/85 sm:text-lg">
            Nous avons bien reçu vos informations. Un artisan vous rappelle rapidement afin de confirmer votre besoin et le tarif avant intervention.
          </p>

          <div className="mx-auto mt-8 max-w-md rounded-xl border border-gold/25 bg-navy-deep/55 p-5">
            <p className="font-display text-xl font-bold text-gold">Besoin d'une réponse immédiate ?</p>
            <p className="mt-1 text-sm text-cream/70">Appelez directement notre équipe, disponible 7j/7 de 8h à 22h.</p>
            <a
              href="tel:+33970708211"
              onClick={() => pushGtmEvent("phone_click", { phone: "+33970708211", source: "merci" })}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-md bg-gold px-6 py-3 font-bold text-navy transition hover:bg-[#B8902F]"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              09 70 70 82 11
            </a>
            <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-gold/80">Appel gratuit</p>
          </div>

          <Link
            to="/"
            className="mt-8 inline-flex items-center justify-center rounded-md border border-cream/35 px-5 py-2.5 text-sm font-semibold text-cream transition hover:border-gold hover:text-gold"
          >
            Retour à l'accueil
          </Link>
        </div>
      </section>
    </main>
  );
}
