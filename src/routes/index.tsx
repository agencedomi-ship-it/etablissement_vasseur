import { createFileRoute } from "@tanstack/react-router";
import { type FormEvent, useId, useState } from "react";
import { useDynamicH1, useGeoDept, useKeyword } from "@/hooks/use-dynamic-content";
import { ouvrirBandeauCookies } from "@/lib/consentement";
import { EDITEUR, SITE_URL } from "@/lib/editeur";

function pushGtmEvent(event: string, data: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const w = window as Window & { dataLayer?: Array<Record<string, unknown>> };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, ...data });
}


export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "Serrurier Vantory — Dépannage 7j/7, devis avant travaux" },
      {
        name: "description",
        content:
          "Serrurier Vantory : mise en relation avec un artisan serrurier près de chez vous, 7j/7 de 8h à 22h. Tarif annoncé, devis avant travaux, paiement après.",
      },
      { property: "og:url", content: `${SITE_URL}/` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: EDITEUR.nomCommercial,
          legalName: EDITEUR.raisonSociale,
          url: `${SITE_URL}/`,
          image: `${SITE_URL}/og-vantory.jpg`,
          telephone: "+33970708211",
          description: "Mise en relation avec des artisans serruriers partenaires, 7j/7 de 8h à 22h.",
          address: {
            "@type": "PostalAddress",
            streetAddress: "149 avenue du Maine",
            postalCode: "75014",
            addressLocality: "Paris",
            addressCountry: "FR",
          },
          identifier: EDITEUR.siret,
        }),
      },
    ],
  }),
});

/* ------------------------------ ICONS (inline) ------------------------------ */
const I = {
  phone: (p: { className?: string; size?: number }) => (
    <svg width={p.size ?? 22} height={p.size ?? 22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={p.className}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  clock: (p: { className?: string }) => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={p.className}>
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  shield: (p: { className?: string; size?: number }) => (
    <svg width={p.size ?? 22} height={p.size ?? 22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={p.className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" />
    </svg>
  ),
  tag: (p: { className?: string }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={p.className}>
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  ),
  key: (p: { className?: string }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={p.className}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  doc: (p: { className?: string }) => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={p.className}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  cal: (p: { className?: string }) => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={p.className}>
      <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  card: (p: { className?: string }) => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={p.className}>
      <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /><line x1="6" y1="15" x2="10" y2="15" />
    </svg>
  ),
  check: (p: { className?: string; size?: number }) => (
    <svg width={p.size ?? 22} height={p.size ?? 22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={p.className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  x: (p: { className?: string; size?: number }) => (
    <svg width={p.size ?? 22} height={p.size ?? 22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={p.className}>
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  star: (p: { className?: string; size?: number }) => (
    <svg width={p.size ?? 16} height={p.size ?? 16} viewBox="0 0 24 24" fill="currentColor" aria-hidden className={p.className}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
};

/* ------------------------------ SEAL LOGO ------------------------------ */
function SealLogo({ size = 38, dark = false }: { size?: number; dark?: boolean }) {
  const bg = dark ? "#EBE4D2" : "#0F1F38";
  const gold = "#C9A04E";
  const goldBright = "#E6C474";
  const cream = "#F4ECD6";
  const uid = useId().replace(/:/g, "");
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      aria-hidden
      className="shrink-0 drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)]"
    >
      <defs>
        <radialGradient id={`seal-bg-${uid}`} cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor={dark ? "#FBF5E4" : "#22406B"} />
          <stop offset="100%" stopColor={bg} />
        </radialGradient>
        <linearGradient id={`seal-gold-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={goldBright} />
          <stop offset="55%" stopColor={gold} />
          <stop offset="100%" stopColor="#A0782F" />
        </linearGradient>
        <path id={`top-arc-${uid}`} d="M 18 40 A 22 22 0 0 1 62 40" fill="none" />
        <path id={`bot-arc-${uid}`} d="M 18 42 A 22 22 0 0 0 62 42" fill="none" />
      </defs>

      {/* Outer gold rim */}
      <circle cx="40" cy="40" r="38" fill={`url(#seal-gold-${uid})`} />
      {/* Inner navy field */}
      <circle cx="40" cy="40" r="35" fill={`url(#seal-bg-${uid})`} />
      {/* Gold double rings */}
      <circle cx="40" cy="40" r="32" fill="none" stroke={gold} strokeWidth="0.8" />
      <circle cx="40" cy="40" r="29.5" fill="none" stroke={gold} strokeOpacity="0.55" strokeWidth="0.5" strokeDasharray="1.5 2" />

      {/* Decorative dots */}
      {[0, 90, 180, 270].map((a) => {
        const r = (a * Math.PI) / 180;
        const cx = 40 + Math.cos(r) * 32;
        const cy = 40 + Math.sin(r) * 32;
        return <circle key={a} cx={cx} cy={cy} r="1.1" fill={goldBright} />;
      })}

      {/* Top arc text "SERRURIER" */}
      <text fill={gold} fontFamily="Cormorant Garamond, Georgia, serif" fontWeight="700" fontSize="6.2" letterSpacing="2.4">
        <textPath href={`#top-arc-${uid}`} startOffset="50%" textAnchor="middle">
          • SERRURIER •
        </textPath>
      </text>

      {/* Center monogram V with key bow accent */}
      <g>
        <text
          x="40"
          y="48"
          textAnchor="middle"
          fontFamily="Cormorant Garamond, Georgia, serif"
          fontWeight="700"
          fontSize="32"
          fill={`url(#seal-gold-${uid})`}
          style={{ paintOrder: "stroke" }}
          stroke={dark ? "#0F1F38" : "#0F1F38"}
          strokeWidth="0.4"
        >
          V
        </text>
      </g>

      {/* Small flourish above V */}
      <path d="M 30 23 Q 40 18 50 23" fill="none" stroke={gold} strokeWidth="0.7" strokeLinecap="round" />
      <circle cx="40" cy="20.5" r="0.9" fill={goldBright} />

      {/* Bottom arc text "VANTORY" */}
      <text fill={gold} fontFamily="Inter, system-ui, sans-serif" fontWeight="600" fontSize="4.8" letterSpacing="2.2">
        <textPath href={`#bot-arc-${uid}`} startOffset="50%" textAnchor="middle">
          VANTORY
        </textPath>
      </text>

      {/* Inner highlight */}
      <circle cx="40" cy="40" r="35" fill="none" stroke={cream} strokeOpacity="0.06" strokeWidth="1" />
    </svg>
  );
}

/* ------------------------------ DECORATIVE ORNAMENT ------------------------------ */
function Ornament() {
  return (
    <div className="ornament-divider my-5">
      <svg width="22" height="14" viewBox="0 0 22 14" fill="none" aria-hidden>
        <path d="M1 7 Q5 1 11 7 Q17 13 21 7" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        <circle cx="11" cy="7" r="1.6" fill="currentColor" />
      </svg>
    </div>
  );
}

/* ------------------------------ PHONE BUTTON ------------------------------ */
function PhoneButton({ small = false }: { small?: boolean }) {
  return (
    <a href="tel:+33970708211" onClick={() => pushGtmEvent("phone_click", { phone: "+33970708211" })} className={`inline-flex items-center justify-center gap-3 bg-gold hover:bg-[#B8902F] text-navy font-bold rounded-md transition-all shadow-[0_6px_18px_rgba(201,160,78,0.35)] hover:-translate-y-0.5 ${small ? "px-4 py-2.5" : "px-6 py-3.5"}`}>
      <I.phone />
      <span className="text-left leading-tight">
        <span className="block text-base md:text-lg">09&nbsp;70&nbsp;70&nbsp;82&nbsp;11</span>
        <span className="block text-[10px] md:text-xs uppercase tracking-wider text-navy/75 font-bold">Appel non surtaxé</span>
      </span>
    </a>
  );
}

/* ============================== PAGE ============================== */
function HomePage() {
  return (
    <div className="bg-cream text-ink">
      <Header />
      <Hero />
      <TrustBar />
      <UrgenceSection />
      <ServicesSection />
      <TarifsSection />
      <AntiArnaqueSection />
      <AssuranceSection />
      <ZoneSection />
      <QuiSommesNousSection />
      <FonctionnementSection />
      <FaqSection />
      <DevisForm />
      <Footer />
      <MobileStickyCta />
    </div>
  );
}

/* ------------------------------ HEADER ------------------------------ */
function Header() {
  return (
    <header className="sticky top-0 z-40 bg-navy-deep/95 backdrop-blur-md border-b border-navy-deep">
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
      <div className="max-w-6xl mx-auto container-px min-h-16 py-2 flex items-center justify-between gap-2">
        <a href="#" className="flex items-center gap-2 shrink-0" aria-label="Serrurier Vantory — accueil">
          <SealLogo size={34} />
          <span className="font-display text-xl text-cream font-bold leading-none hidden sm:block">
            Serrurier Vantory
          </span>
          <span className="font-display text-base text-cream font-bold leading-none sm:hidden">Vantory</span>
        </a>
        <div className="flex items-center gap-2 md:gap-4">
          <a href="tel:+33970708211" onClick={() => pushGtmEvent("phone_click", { phone: "+33970708211" })} className="flex items-center gap-1.5 md:gap-2 text-cream font-semibold hover:text-gold transition-colors">
            <I.phone size={18} />
            <span className="leading-tight text-left">
              <span className="block text-sm md:text-lg whitespace-nowrap">09&nbsp;70&nbsp;70&nbsp;82&nbsp;11</span>
              <span className="block text-[9px] md:text-xs text-gold font-bold uppercase tracking-wide">Appel non surtaxé</span>
            </span>
          </a>
          <a href="#devis" className="btn-primary !py-2 !px-3 text-[11px] md:text-sm uppercase tracking-wide leading-tight text-center">
            Devis gratuit
          </a>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------ HERO ------------------------------ */
function Hero() {
  const dynamicH1 = useDynamicH1();
  const keyword = useKeyword();
  return (
    <section className="relative text-cream overflow-hidden bg-navy-deep">
      {/* Photo terrain en fond (technicien de dos, sans visage) */}
      <picture>
        <source media="(min-width: 768px)" srcSet="/assets/terrain/hero-palier.webp" width={1920} height={1078} />
        <img
          src="/assets/terrain/hero-palier-mobile.webp"
          alt=""
          width={720}
          height={1280}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover object-[60%_center] md:object-center"
        />
      </picture>
      {/* Voile bleu nuit pour la lisibilité */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, rgba(15,31,53,0.90) 0%, rgba(15,31,53,0.72) 45%, rgba(15,31,53,0.92) 100%)" }}
        aria-hidden
      />
      <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: "inset 0 0 220px rgba(0,0,0,0.45)" }} aria-hidden />

      <div className="relative max-w-4xl mx-auto container-px pt-9 pb-10 md:pt-20 md:pb-24 md:min-h-[720px] flex flex-col justify-center">
        <div className="text-center fade-up">
          <div className="flex justify-center mb-4 md:mb-6">
            <SealLogo size={80} />
          </div>
          <p className="text-[11px] sm:text-xs tracking-[0.34em] uppercase text-gold font-semibold mb-2 md:mb-4">
            Serrurier&nbsp;·&nbsp;Vantory&nbsp;·&nbsp;7j/7
          </p>
          <Ornament />
          <h1 id="hero-h1" className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-cream font-bold leading-[1.05] text-balance mt-1"
            style={{ textShadow: "0 2px 24px rgba(0,0,0,0.4)" }}>
            {dynamicH1}
          </h1>
          <p className="font-display italic text-xl sm:text-3xl md:text-4xl text-gold mt-1.5 md:mt-4 leading-tight"
            style={{ textShadow: "0 2px 16px rgba(0,0,0,0.45)" }}>
            Devis annoncé, prix tenu.
          </p>
          <p className="font-display italic text-base sm:text-xl text-cream/95 mt-3 sm:mt-4 max-w-xl mx-auto leading-relaxed tracking-wide"
            style={{ textShadow: "0 2px 12px rgba(0,0,0,0.45)" }}>
            Un artisan près de chez vous
          </p>
          {keyword && (
            <p className="font-display text-2xl sm:text-3xl text-cream font-bold mt-3 leading-tight"
              style={{ textShadow: "0 2px 16px rgba(0,0,0,0.45)" }}>
              {keyword}
            </p>
          )}

          <div className="mt-7 md:mt-8">
            <p className="inline-flex items-center gap-1.5 text-[11px] md:text-xs font-bold text-navy bg-gold px-2.5 md:px-3 py-0.5 md:py-1 rounded-full mb-2 md:mb-3 tracking-wide shadow-md">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              Chez vous en 30 min en moyenne
            </p>
            <br />
            <p className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-gold bg-navy/80 backdrop-blur border border-gold/50 px-4 py-1.5 rounded-full mb-4 md:mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-gold shimmer-dot" />
              <span className="md:hidden">Artisan partenaire dispo — 7j/7, 8h à 22h</span>
              <span className="hidden md:inline">Artisan partenaire disponible — 7j/7, 8h à 22h</span>
            </p>
          </div>

          {/* Mobile : boutons compacts */}
          <div className="md:hidden grid grid-cols-2 gap-2.5 max-w-md mx-auto">
            <a href="tel:+33970708211" onClick={() => pushGtmEvent("phone_click", { phone: "+33970708211" })} className="btn-primary !py-2.5 !px-2 text-xs uppercase tracking-wide leading-tight flex-col">
              <I.phone size={16} />
              <span className="block">09 70 70 82 11</span>
              <span className="block text-[9px]">Appel non surtaxé</span>
            </a>
            <a href="#devis" className="inline-flex items-center justify-center gap-2 border-2 border-cream/85 text-cream hover:bg-cream hover:text-navy font-semibold uppercase tracking-wide text-xs px-3 py-3.5 rounded-md transition-all backdrop-blur bg-navy/40">
              Demander un devis
            </a>
            <a href="#tarifs" className="col-span-2 inline-flex items-center justify-center gap-2 border-2 border-gold text-gold hover:bg-gold hover:text-navy font-semibold uppercase tracking-wide text-xs px-3 py-3 rounded-md transition-all backdrop-blur bg-navy/40">
              Voir nos prix
            </a>
          </div>

          {/* Ordinateur : boutons + garanties */}
          <div className="hidden md:flex flex-row flex-wrap gap-3 justify-center">
            <PhoneButton />
            <a href="#devis" className="inline-flex items-center justify-center gap-2 border-2 border-cream/85 text-cream hover:bg-cream hover:text-navy font-semibold uppercase tracking-wide text-base px-6 py-3.5 rounded-md transition-all backdrop-blur bg-navy/30">
              Demander un devis
            </a>
            <a href="#tarifs" className="inline-flex items-center justify-center gap-2 border-2 border-gold text-gold hover:bg-gold hover:text-navy font-semibold uppercase tracking-wide text-base px-6 py-3.5 rounded-md transition-all backdrop-blur bg-navy/30">
              Nos prix
            </a>
          </div>

          <div className="hidden md:grid grid-cols-3 gap-6 mt-10 max-w-xl mx-auto">
            {[
              { icon: <I.tag className="text-gold" />, label: <>Tarif annoncé<br />avant déplacement</> },
              { icon: <I.key className="text-gold" />, label: <>Paiement<br />après travaux</> },
              { icon: <I.shield className="text-gold" />, label: <>Prise en charge<br />assurance possible</> },
            ].map((t, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                {t.icon}
                <p className="text-xs text-cream/95 font-semibold leading-tight">{t.label}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Mobile features strip */}
      <div className="md:hidden relative bg-navy-deep border-t border-gold/30">
        <div className="container-px py-4 grid grid-cols-3 max-w-xl mx-auto">
          {[
            { icon: <I.tag className="text-gold" />, label: <>Tarif annoncé<br />avant déplacement</> },
            { icon: <I.key className="text-gold" />, label: <>Paiement<br />après travaux</> },
            { icon: <I.shield className="text-gold" />, label: <>Prise en charge<br />assurance possible</> },
          ].map((t, i) => (
            <div
              key={i}
              className={`flex items-center justify-center gap-2 px-1 ${i > 0 ? "border-l border-gold/25" : ""}`}
            >
              <span className="shrink-0">{t.icon}</span>
              <p className="text-[10px] text-cream/95 font-semibold leading-tight text-left">{t.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ TRUST BAR ------------------------------ */
function TrustBar() {
  const items = [
    { icon: <I.doc />, label: "Devis annoncé" },
    { icon: <I.clock />, label: "30 min en moyenne" },
    { icon: <I.shield size={26} />, label: "Prise en charge assurance possible" },
    { icon: <I.card />, label: "Paiement après travaux" },
  ];
  return (
    <section className="hidden md:block bg-parchment-paper border-y border-navy/10 relative">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      <div className="max-w-6xl mx-auto container-px py-7 md:py-9 grid grid-cols-2 md:grid-cols-4 gap-5 text-center">
        {items.map((t, i) => (
          <div key={i} className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3 text-navy">
            <span className="text-navy">{t.icon}</span>
            <p className="text-sm font-semibold text-navy">{t.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------ URGENCE ------------------------------ */
function UrgenceSection() {
  const cards = [
    { icon: <I.clock />, title: "Intervention en 30 min en moyenne" },
    { icon: <I.cal />, title: "Disponible 7j/7, 8h à 22h" },
    { icon: <I.phone size={32} />, title: "Un conseiller répond, un artisan se déplace" },
  ];
  return (
    <section className="py-16 md:py-24 bg-cream">
      <div className="max-w-6xl mx-auto container-px text-center">
        <p className="section-eyebrow mb-3">Urgence serrurier</p>
        <h2 className="section-title">Une urgence&nbsp;? Un serrurier chez vous en 30 minutes en moyenne</h2>
        <Ornament />
        <p className="section-subtitle mx-auto">
          Porte claquée, clé cassée dans la serrure, serrure HS — un artisan près de chez vous, matin, midi et soir, 7j/7 de 8h à 22h.
        </p>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8 mt-12">
          {cards.map((c, i) => (
            <div key={i} className="card-artisan p-8">
              <div className="w-16 h-16 rounded-full bg-navy/5 flex items-center justify-center mx-auto mb-5 ring-1 ring-gold/30">
                <span className="text-navy">{c.icon}</span>
              </div>
              <p className="font-display text-xl text-navy font-bold">{c.title}</p>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <PhoneButton />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ SERVICES ------------------------------ */
const PRESTATIONS = [
  {
    title: "Ouverture de porte",
    desc: "Porte claquée ou verrou bloqué : ouverture rapide, sans casse quand c'est techniquement possible.",
    img: "ouverture-porte",
    prix: "dès 79 €",
  },
  {
    title: "Changement de serrure",
    desc: "Remplacement complet de serrure usée, défectueuse ou compromise après effraction.",
    img: "changement-serrure",
    prix: "sur devis",
  },
  {
    title: "Cylindre haute sécurité",
    desc: "Pose de cylindres haute sécurité, résistants au perçage et au crochetage.",
    img: "cylindre-haute-securite",
    prix: "dès 189 €",
  },
  {
    title: "Blindage de porte",
    desc: "Renforcement du bloc-porte existant avec plaque acier et serrure multipoints.",
    img: "blindage-porte",
    prix: "sur devis",
  },
  {
    title: "Coffre-fort",
    desc: "Installation, ouverture et changement de combinaison pour coffres résidentiels et professionnels.",
    img: "coffre-fort",
    prix: "sur devis",
  },
  {
    title: "Ouverture de rideau métallique",
    desc: "Rideau de commerce bloqué ou serrure de rideau grippée : ouverture et remise en service.",
    img: "rideau-metallique-nuit",
    prix: "dès 89 €",
  },
];

function PrixButton({ prix }: { prix: string }) {
  return (
    <a
      href="#tarifs"
      className="inline-flex items-center gap-2 rounded-md bg-navy hover:bg-navy-deep text-cream text-sm font-semibold px-4 py-2.5 transition-colors"
    >
      Prix : <span className="text-gold">{prix}</span>
      <span aria-hidden>→</span>
    </a>
  );
}

function ServicesSection() {
  return (
    <section className="py-16 md:py-24 bg-parchment-paper">
      <div className="max-w-6xl mx-auto container-px">
        <div className="text-center mb-12 md:mb-16">
          <p className="section-eyebrow mb-3">Savoir-faire</p>
          <h2 className="section-title">Prestations de serrurerie</h2>
          <Ornament />
          <p className="section-subtitle mx-auto">Dépannage et installation par nos artisans partenaires, pour le particulier comme pour le professionnel.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {PRESTATIONS.map((s) => (
            <article key={s.title} className="card-illustree group flex flex-col">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={`/assets/prestations/${s.img}.webp`}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  width={720}
                  height={540}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="px-6 pb-6 pt-2 flex flex-col flex-1">
                <h3 className="font-display text-2xl text-navy font-bold">{s.title}</h3>
                <p className="text-ink/75 text-sm mt-2 leading-relaxed flex-1">{s.desc}</p>
                <div className="mt-5">
                  <PrixButton prix={s.prix} />
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="card-illustree mt-5 md:mt-6 p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-5 md:gap-8">
          <div className="flex-1">
            <h3 className="font-display text-2xl text-navy font-bold">Tout autre service de serrurier</h3>
            <p className="text-ink/75 text-sm mt-2 leading-relaxed">
              Une demande qui ne figure pas ci-dessus&nbsp;? Toute autre prestation de serrurerie est réalisée sur devis, établi avant les travaux.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <PrixButton prix="sur devis" />
            <a href="#devis" className="inline-flex items-center rounded-md border-2 border-navy text-navy hover:bg-navy hover:text-cream text-sm font-semibold px-4 py-2 transition-colors">
              Demander un devis
            </a>
          </div>
        </div>

        <div className="mt-8 space-y-3 max-w-4xl mx-auto">
          <p className="bg-cream/80 border-l-4 border-gold rounded-r-md px-5 py-4 text-sm md:text-[15px] text-ink/85 leading-relaxed">
            <strong className="text-navy">Doubles de clés&nbsp;:</strong> nous ne réalisons pas la reproduction de clés. Pour faire faire un double, rapprochez-vous d'un cordonnier.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ TARIFS ------------------------------ */
function TarifsSection() {
  const rows = [
    ["Ouverture de porte claquée (déplacement compris)", "79 à 99 €"],
    ["Ouverture porte blindée", "149 à 189 €"],
    ["Changement cylindre standard", "119 à 159 €"],
    ["Changement cylindre haute sécurité", "189 à 249 €"],
    ["Ouverture de rideau métallique", "dès 89 €"],
    ["Changement de serrure, blindage, coffre-fort", "sur devis"],
    ["Tout autre service de serrurier", "sur devis"],
    ["Déplacement (si non compris)", "49 €"],
  ];
  return (
    <section id="tarifs" className="py-16 md:py-24 bg-cream scroll-mt-20">
      <div className="max-w-4xl mx-auto container-px">
        <div className="text-center mb-10">
          <p className="section-eyebrow mb-3">Transparence</p>
          <h2 className="section-title">Tarifs transparents</h2>
          <Ornament />
          <p className="section-subtitle mx-auto">Fourchettes de prix TTC pour les prestations courantes. Le tarif exact est confirmé au téléphone avant tout déplacement. Devis gratuit.</p>
        </div>

        <div className="card-artisan corner-ornament overflow-hidden p-0">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-navy via-[#22386b] to-navy text-cream">
              <tr>
                <th className="text-left px-5 py-4 font-semibold text-sm uppercase tracking-wider">Prestation</th>
                <th className="text-right px-5 py-4 font-semibold whitespace-nowrap text-sm uppercase tracking-wider">Tarif TTC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-parchment">
              {rows.map(([p, t], i) => (
                <tr key={i} className="hover:bg-parchment/30 transition-colors">
                  <td className="px-5 py-4 text-ink">{p}</td>
                  <td className="px-5 py-4 text-right font-bold text-navy whitespace-nowrap font-display text-lg">{t}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 bg-parchment/60 border-l-4 border-gold rounded-r-md p-5 text-ink/85 leading-relaxed shadow-card">
          <strong className="text-navy font-display text-lg">Devis avant travaux&nbsp;:</strong>{" "}
          un devis détaillé vous est remis et soumis à votre accord avant tout commencement des travaux, conformément à l'article&nbsp;4 de l'arrêté du 24&nbsp;janvier&nbsp;2017 relatif à la publicité des prix des prestations de dépannage, de réparation et d'entretien dans le secteur du bâtiment et de l'équipement de la maison.
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ ANTI ARNAQUE ------------------------------ */
function AntiArnaqueSection() {
  const ok = [
    "Tarif annoncé clairement par téléphone avant tout déplacement",
    "Devis signé sur place avant tout démarrage",
    "Aucun frais de déplacement caché",
    "Paiement uniquement après validation du travail",
    "Facture détaillée systématique",
  ];
  const no = [
    "Prix doublé au moment de la facture",
    "Travaux supplémentaires imposés sur place",
    "Refus de fournir un devis écrit",
    "Pression au paiement comptant immédiat",
    "Facturation sans détail des prestations",
  ];
  return (
    <section className="py-16 md:py-24 bg-parchment-paper">
      <div className="max-w-6xl mx-auto container-px">
        <div className="text-center mb-12">
          <p className="section-eyebrow mb-3">Éthique du métier</p>
          <h2 className="section-title">Comment nous évitons les arnaques courantes</h2>
          <Ornament />
          <p className="section-subtitle mx-auto">Le secteur du dépannage souffre de pratiques douteuses. Voici nos engagements concrets.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="card-artisan overflow-hidden">
            <div className="bg-validate text-white px-6 py-4 flex items-center gap-3">
              <I.check size={28} />
              <h3 className="font-display text-2xl font-bold">Nos engagements</h3>
            </div>
            <ul className="p-6 space-y-4">
              {ok.map((t, i) => (
                <li key={i} className="flex gap-3">
                  <I.check size={22} className="text-validate shrink-0 mt-0.5" />
                  <span className="text-ink">{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card-artisan overflow-hidden">
            <div className="bg-warning text-white px-6 py-4 flex items-center gap-3">
              <I.x size={28} />
              <h3 className="font-display text-2xl font-bold">Ce que nous refusons</h3>
            </div>
            <ul className="p-6 space-y-4">
              {no.map((t, i) => (
                <li key={i} className="flex gap-3">
                  <I.x size={22} className="text-warning shrink-0 mt-0.5" />
                  <span className="text-ink">{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ ASSURANCES ------------------------------ */
function AssuranceSection() {
  const covered = [
    "Intervention serrurier d'urgence",
    "Sécurisation immédiate de la porte",
    "Changement de serrure après effraction",
    "Remplacement de porte si endommagée",
    "Honoraires d'expertise",
  ];
  return (
    <section className="py-16 md:py-24 bg-cream">
      <div className="max-w-5xl mx-auto container-px">
        <div className="text-center mb-10">
          <p className="section-eyebrow mb-3">Prise en charge</p>
          <h2 className="section-title">Souvent pris en charge par votre assurance habitation</h2>
          <Ornament />
          <p className="section-subtitle mx-auto">En cas d'effraction ou de sinistre, beaucoup de contrats prévoient une prise en charge. L'artisan vous remet une facture détaillée à transmettre à votre assureur&nbsp;; la prise en charge dépend des garanties de votre contrat.</p>
        </div>

        <div className="mb-10 card-illustree p-6 text-sm md:text-[15px] text-ink/85 leading-relaxed">
          <p className="font-semibold text-navy mb-1 font-display text-lg">Assistance de votre carte bancaire</p>
          <p>Certaines cartes bancaires haut de gamme incluent une assistance dépannage à domicile. Vérifiez les garanties de votre carte auprès de votre banque avant l'intervention.</p>
        </div>

        <div className="bg-parchment/70 rounded-lg p-6 md:p-8 corner-ornament">
          <p className="font-semibold text-navy mb-3 font-display text-xl">Ce qui est généralement couvert par votre assurance habitation :</p>
          <ul className="space-y-2 text-ink/85">
            {covered.map((c, i) => (
              <li key={i} className="flex gap-2.5">
                <I.check size={18} className="text-validate shrink-0 mt-1" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ QUI SOMMES-NOUS ------------------------------ */
function QuiSommesNousSection() {
  const exigences = [
    {
      n: "I",
      title: "Qualification",
      desc: "Des serruriers professionnels, expérimentés dans le dépannage comme dans l'installation de serrures et de portes.",
    },
    {
      n: "II",
      title: "Prix",
      desc: "Une charte tarifaire commune à tout le réseau : tarif annoncé avant le déplacement, respecté sur place, et devis détaillé remis avant tout commencement des travaux.",
    },
    {
      n: "III",
      title: "Assurance",
      desc: "Des artisans couverts par une assurance professionnelle pour les travaux qu'ils réalisent chez vous.",
    },
  ];
  return (
    <section id="qui-sommes-nous" className="py-16 md:py-24 bg-parchment-paper scroll-mt-20">
      <div className="max-w-6xl mx-auto container-px">
        <div className="text-center mb-12 md:mb-14">
          <p className="section-eyebrow mb-3">Qui sommes-nous</p>
          <h2 className="section-title">Un réseau de serruriers sélectionnés</h2>
          <Ornament />
          <p className="section-subtitle mx-auto">
            Serrurier Vantory est un réseau de mise en relation&nbsp;: nous vous mettons en contact avec des artisans serruriers
            indépendants qui répondent à nos exigences de qualification, de prix et d'assurance.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 md:gap-6 max-w-5xl mx-auto">
          {exigences.map((e) => (
            <div key={e.title} className="card-illustree p-7 text-center">
              <p className="font-display text-5xl text-brick font-bold leading-none">{e.n}</p>
              <h3 className="font-display text-2xl text-navy font-bold mt-3">{e.title}</h3>
              <p className="text-ink/75 text-sm mt-2 leading-relaxed">{e.desc}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-ink/70 mt-8 max-w-2xl mx-auto leading-relaxed">
          L'intervention est réalisée par l'artisan missionné, qui vous remet son devis puis sa facture. Le détail figure dans nos{" "}
          <a href="/cgv" className="underline underline-offset-2 hover:text-navy">conditions générales</a>.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------ FONCTIONNEMENT ------------------------------ */
function FonctionnementSection() {
  const steps = [
    {
      icon: <I.phone size={26} />,
      title: "Vous appelez",
      desc: "Un conseiller Vantory écoute votre besoin et vous annonce le tarif avant tout déplacement.",
    },
    {
      icon: <I.key />,
      title: "Nous missionnons un artisan",
      desc: "Nous contactons l'artisan serrurier partenaire le plus proche et disponible, puis vous indiquons son délai d'arrivée.",
    },
    {
      icon: <I.check size={26} />,
      title: "L'artisan intervient",
      desc: "Devis signé sur place avant de commencer, paiement uniquement après validation du travail.",
    },
  ];
  return (
    <section className="py-16 md:py-24 bg-cream">
      <div className="max-w-6xl mx-auto container-px">
        <div className="text-center mb-12 md:mb-16">
          <p className="section-eyebrow mb-3">Notre fonctionnement</p>
          <h2 className="section-title">Un appel, un artisan près de chez vous</h2>
          <Ornament />
          <p className="section-subtitle mx-auto">
            Serrurier Vantory coordonne un réseau d'artisans serruriers indépendants&nbsp;: nous prenons votre demande, puis nous missionnons le plus proche de chez vous.
          </p>
        </div>

        <ol className="grid md:grid-cols-3 gap-5 md:gap-6 max-w-5xl mx-auto">
          {steps.map((st, i) => (
            <li key={st.title} className="corner-ornament bg-parchment/50 rounded-lg p-7 text-center">
              <div className="w-14 h-14 rounded-full bg-navy text-gold flex items-center justify-center mx-auto mb-4 ring-2 ring-gold/40">
                {st.icon}
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-brick">Étape {i + 1}</p>
              <h3 className="font-display text-2xl text-navy font-bold mt-1">{st.title}</h3>
              <p className="text-ink/75 text-sm mt-2 leading-relaxed">{st.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------ ZONE ------------------------------ */
function ZoneSection() {
  const geo = useGeoDept();
  return (
    <section className="py-16 md:py-24 bg-parchment-paper">
      <div className="max-w-3xl mx-auto container-px text-center">
        <p className="section-eyebrow mb-3">Zone d'intervention</p>
        <h2 className="section-title">Où nous intervenons</h2>
        <Ornament />
        <div className="mt-6 space-y-4 text-lg text-ink/85 leading-relaxed">
          <p>
            Nous recherchons pour vous l'artisan partenaire disponible le plus proche, dans{" "}
            {geo.deptLabel ? (
              <>
                tout le <strong className="text-navy">{geo.deptLabel}</strong>
              </>
            ) : (
              <strong className="text-navy">tout votre département</strong>
            )}
            , et nous vous annonçons son délai d'arrivée avant tout déplacement.
          </p>
          <p>Service joignable 7 jours sur 7, de 8h à 22h, dimanches et jours fériés compris.</p>
        </div>
        <div className="mt-8 inline-flex items-center gap-3 bg-cream border border-gold/40 rounded-full px-6 py-3 shadow-card">
          <I.clock className="text-navy" />
          <p className="font-semibold text-navy">Délai moyen d'intervention&nbsp;: 30 minutes</p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ FAQ ------------------------------ */
function FaqSection() {
  const items = [
    ["Combien de temps pour arriver chez moi ?", "L'artisan partenaire missionné arrive en 30 minutes en moyenne pendant nos horaires (8h-22h, 7 jours sur 7)."],
    ["Comment connaître le prix avant l'intervention ?", "Le tarif vous est annoncé au téléphone avant que l'artisan ne se déplace, puis confirmé par un devis signé sur place."],
    ["Quels modes de paiement sont acceptés ?", "Le paiement se fait auprès de l'artisan, uniquement après validation du travail : carte bancaire, espèces ou virement selon l'artisan. Sa facture détaillée vous permet ensuite de faire jouer votre assurance si votre contrat le prévoit."],
    ["Mon assurance habitation prend-elle en charge ?", "Cela dépend de votre contrat : une effraction ou un sinistre sont souvent couverts, en tout ou partie. L'artisan vous remet une facture détaillée pour votre dossier ; renseignez-vous auprès de votre assureur."],
    ["Que se passe-t-il si vous ne pouvez pas ouvrir sans casse ?", "L'artisan privilégie toujours l'ouverture sans dégât. Si c'est techniquement impossible, il vous explique les options et leur coût avant toute intervention. Vous décidez."],
    ["Travaillez-vous le dimanche et les jours fériés ?", "Oui, notre standard répond et nos artisans partenaires interviennent 7 jours sur 7, dimanches et jours fériés inclus, de 8h à 22h."],
    ["Comment être sûr que vous n'êtes pas une arnaque ?", "Tarif annoncé avant déplacement, devis écrit signé sur place, paiement uniquement après validation du travail. Pas de surprise ni de pression. Tous les artisans de notre réseau sont soumis à une charte bien définie : qualification, respect des tarifs annoncés, devis écrit avant travaux, assurance professionnelle et comportement irréprochable chez le client."],
    ["Faites-vous les doubles de clés ?", "Non, nous ne réalisons pas la reproduction de clés. Pour faire faire un double, rapprochez-vous d'un cordonnier."],
    ["Qui intervient chez moi ?", "Un artisan serrurier indépendant de notre réseau, choisi parce qu'il est le plus proche et disponible. Serrurier Vantory prend votre appel, vous annonce le tarif et missionne l'artisan, qui réalise l'intervention."],
  ];
  return (
    <section className="py-16 md:py-24 bg-parchment-paper">
      <div className="max-w-3xl mx-auto container-px">
        <div className="text-center mb-10">
          <p className="section-eyebrow mb-3">Questions fréquentes</p>
          <h2 className="section-title">Vos questions, nos réponses</h2>
          <Ornament />
        </div>
        <div className="space-y-3">
          {items.map(([q, a], i) => (
            <details key={i} className="bg-[#fbf4e8] rounded-xl shadow-card border border-gold/20 overflow-hidden group open:shadow-card-hover transition-shadow">
              <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none font-semibold text-navy font-display text-lg">
                <span>{q}</span>
                <svg className="faq-chevron shrink-0 text-gold" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </summary>
              <div className="px-5 pb-5 text-ink/85 leading-relaxed">{a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ FORM ------------------------------ */
function DevisForm() {
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [ouvertLe] = useState(() => Date.now());

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (isSending) return;

    const form = e.currentTarget;
    const formData = new FormData(form);

    const nom = String(formData.get("nom") || "").trim();
    const tel = String(formData.get("tel") || "").trim();
    const codepostal = String(formData.get("codepostal") || "").trim();
    const besoin = String(formData.get("besoin") || "").trim();
    const messageClient = String(formData.get("message") || "").trim();

    // Robots : champ piège rempli ou envoi quasi instantané → rien n'est transmis.
    if (String(formData.get("site_web") || "") || Date.now() - ouvertLe < 2500) {
      window.location.assign("/merci");
      return;
    }

    if (!nom || !tel || !codepostal || !besoin) {
      setErrorMessage("Merci de remplir tous les champs obligatoires.");
      return;
    }
    if (!/^(?:\+33\s?|0)[1-9](?:[\s.-]?\d{2}){4}$/.test(tel)) {
      setErrorMessage("Merci d'indiquer un numéro de téléphone français valide (ex. 06 12 34 56 78).");
      return;
    }
    if (!/^\d{5}$/.test(codepostal)) {
      setErrorMessage("Merci d'indiquer un code postal à 5 chiffres.");
      return;
    }

    setIsSending(true);
    setErrorMessage("");

    try {
      const response = await fetch(
        "https://mrdispatch.app.n8n.cloud/webhook/form-leads",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            site: "Serrurier Vantory",
            nom,
            tel,
            codepostal,
            ville: "",
            message:
              `Prestation : ${besoin}\n` +
              (messageClient || "(aucun message)"),
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`Erreur webhook n8n : ${response.status}`);
      }

      pushGtmEvent("form_submit", {
        form_name: "devis",
        site: "Serrurier Vantory",
      });

      window.location.assign("/merci");
    } catch (error) {
      console.error("Erreur lors de l'envoi du formulaire :", error);
      pushGtmEvent("form_error", {
        form_name: "devis",
        site: "Serrurier Vantory",
      });
      setErrorMessage(
        "L'envoi n'a pas fonctionné. Merci de réessayer ou de nous appeler.",
      );
      setIsSending(false);
    }
  }

  return (
    <section id="devis" className="relative py-16 md:py-24 bg-navy text-cream scroll-mt-20 overflow-hidden">
      {/* Subtle ornament background */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, #C9A04E 0, transparent 40%), radial-gradient(circle at 80% 80%, #C9A04E 0, transparent 40%)",
        }}
      />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

      <div className="relative max-w-2xl mx-auto container-px">
        <div className="text-center mb-8">
          <p className="text-[11px] sm:text-xs tracking-[0.34em] uppercase text-gold font-semibold mb-3">
            Contact
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight">
            Demandez votre devis gratuit
          </h2>
          <Ornament />
          <p className="text-cream/80 mt-2">
            Un conseiller vous rappelle rapidement pour vous annoncer le tarif.
          </p>
        </div>

        <form
          className="bg-cream text-ink rounded-2xl p-6 md:p-8 shadow-card-hover space-y-4 corner-ornament"
          onSubmit={handleSubmit}
        >
          {/* Champ piège invisible pour les personnes, rempli par les robots de spam. */}
          <div aria-hidden="true" className="absolute -left-[9999px] top-auto w-px h-px overflow-hidden">
            <label htmlFor="f-site">Site web</label>
            <input id="f-site" name="site_web" type="text" tabIndex={-1} autoComplete="off" />
          </div>
          <Field
            id="f-nom"
            name="nom"
            label="Nom"
            required
            type="text"
            autoComplete="name"
          />

          <div className="grid sm:grid-cols-2 gap-4">
            <Field
              id="f-tel"
              name="tel"
              label="Téléphone"
              required
              type="tel"
              autoComplete="tel"
              placeholder="06 12 34 56 78"
            />

            <Field
              id="f-cp"
              name="codepostal"
              label="Code postal"
              required
              type="text"
              inputMode="numeric"
              autoComplete="postal-code"
              placeholder="75001"
            />
          </div>

          <div>
            <label
              htmlFor="f-besoin"
              className="block text-sm font-semibold text-navy mb-1.5"
            >
              Type de besoin <span className="text-brick">*</span>
            </label>

            <select
              id="f-besoin"
              name="besoin"
              required
              defaultValue=""
              className="w-full border border-parchment rounded-md px-4 py-3 bg-white focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30 transition"
            >
              <option value="" disabled>
                — Choisir —
              </option>
              <option value="Ouverture de porte">Ouverture de porte</option>
              <option value="Changement de serrure">
                Changement de serrure
              </option>
              <option value="Cylindre">Cylindre</option>
              <option value="Blindage">Blindage</option>
              <option value="Coffre-fort">Coffre-fort</option>
              <option value="Autre">Autre</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="f-msg"
              className="block text-sm font-semibold text-navy mb-1.5"
            >
              Message{" "}
              <span className="text-ink/70 font-normal">(optionnel)</span>
            </label>

            <textarea
              id="f-msg"
              name="message"
              rows={3}
              className="w-full border border-parchment rounded-md px-4 py-3 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30 resize-y transition"
            />
          </div>

          {errorMessage && (
            <p
              role="alert"
              className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
            >
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isSending}
            className="btn-primary w-full !py-4 text-base md:text-lg uppercase tracking-wide disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSending
              ? "Envoi en cours…"
              : "Être rappelé pour un devis"}
          </button>

          <p className="text-xs text-ink/60 text-center">
            En envoyant ce formulaire, vous acceptez d'être recontacté par
            téléphone, selon nos{" "}
            <a href="/cgv" className="underline underline-offset-2 hover:text-navy">conditions générales</a>.
          </p>
        </form>
      </div>
    </section>
  );
}

function Field(props: {
  id: string;
  name: string;
  label: string;
  required?: boolean;
  type: string;
  autoComplete?: string;
  placeholder?: string;
  inputMode?: "numeric" | "text" | "tel";
}) {
  return (
    <div>
      <label
        htmlFor={props.id}
        className="block text-sm font-semibold text-navy mb-1.5"
      >
        {props.label}{" "}
        {props.required && <span className="text-brick">*</span>}
      </label>

      <input
        id={props.id}
        name={props.name}
        type={props.type}
        required={props.required}
        autoComplete={props.autoComplete}
        placeholder={props.placeholder}
        inputMode={props.inputMode}
        className="w-full border border-parchment rounded-md px-4 py-3 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30 transition"
      />
    </div>
  );
}

/* ------------------------------ FOOTER ------------------------------ */
function Footer() {
  return (
    <footer className="bg-navy-deep text-cream/85 py-12 relative">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      <div className="max-w-6xl mx-auto container-px">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <SealLogo size={36} />
              <p className="font-display text-xl text-cream font-bold">Serrurier Vantory</p>
            </div>
            <p className="text-sm text-cream/70 leading-relaxed">
              Centrale de dépannage en serrurerie : mise en relation avec des artisans serruriers partenaires. Devis annoncé, prix tenu.
            </p>
          </div>

          <div>
            <p className="font-semibold text-gold mb-3 uppercase tracking-wider text-xs">Contact</p>
            <ul className="space-y-2 text-sm">
              <li><a href="tel:+33970708211" onClick={() => pushGtmEvent("phone_click", { phone: "+33970708211" })} className="hover:text-gold transition-colors font-semibold text-base">09 70 70 82 11</a></li>
              <li className="text-cream/70">Disponible 7j/7 — 8h à 22h</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-cream/15 text-xs text-cream/60 text-center space-y-2">
          <p>© 2026 Serrurier Vantory — {EDITEUR.raisonSociale} {EDITEUR.forme}, {EDITEUR.siege} — SIRET {EDITEUR.siret} — Tous droits réservés.</p>
          <p className="flex flex-wrap justify-center gap-x-5 gap-y-1">
            <a href="/mentions-legales" className="hover:text-gold transition-colors underline-offset-2 hover:underline">Mentions légales</a>
            <a href="/cgv" className="hover:text-gold transition-colors underline-offset-2 hover:underline">Conditions générales</a>
            <a href="/rgpd" className="hover:text-gold transition-colors underline-offset-2 hover:underline">Politique de confidentialité (RGPD)</a>
            <button type="button" onClick={ouvrirBandeauCookies} className="hover:text-gold transition-colors underline-offset-2 hover:underline">Gérer les cookies</button>
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------ MOBILE STICKY CTA ------------------------------ */
function MobileStickyCta() {
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-cream/95 backdrop-blur border-t border-parchment p-3 shadow-[0_-4px_14px_rgba(0,0,0,0.08)] pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <a href="tel:+33970708211" onClick={() => pushGtmEvent("phone_click", { phone: "+33970708211" })} className="w-full flex items-center justify-center gap-2 bg-gold hover:bg-[#B8902F] text-navy font-bold px-3 py-2.5 rounded-md transition-colors whitespace-nowrap min-w-0">
        <I.phone size={18} />
        <span className="leading-tight text-left min-w-0">
          <span className="block text-[15px] tracking-tight whitespace-nowrap">09&nbsp;70&nbsp;70&nbsp;82&nbsp;11</span>
          <span className="block text-[10px] uppercase tracking-wider text-navy/75 font-bold whitespace-nowrap">Non surtaxé · 7j/7</span>
        </span>
      </a>
    </div>
  );
}
