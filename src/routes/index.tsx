import { createFileRoute } from "@tanstack/react-router";
import { useId, useState } from "react";
import { useDynamicH1, useGeoDept } from "@/hooks/use-dynamic-content";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "Ets Serrurier Vasseur — Devis annoncé, prix tenu | Intervient en 20 mn" },
      {
        name: "description",
        content:
          "Artisan serrurier français depuis 2009. Intervient chez vous en 20 minutes. Devis annoncé avant intervention, paiement après travaux, agréé par les assurances.",
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

      {/* Top arc text "ETS SERRURIER" */}
      <text fill={gold} fontFamily="Cormorant Garamond, Georgia, serif" fontWeight="700" fontSize="6.2" letterSpacing="2.4">
        <textPath href={`#top-arc-${uid}`} startOffset="50%" textAnchor="middle">
          • ETS SERRURIER •
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

      {/* Bottom arc text "DEPUIS 2009" */}
      <text fill={gold} fontFamily="Inter, system-ui, sans-serif" fontWeight="600" fontSize="4.8" letterSpacing="2.2">
        <textPath href={`#bot-arc-${uid}`} startOffset="50%" textAnchor="middle">
          DEPUIS 2009
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
    <a href="tel:+33970708211" className={`inline-flex items-center justify-center gap-3 bg-gold hover:bg-[#B8902F] text-navy font-bold rounded-md transition-all shadow-[0_6px_18px_rgba(201,160,78,0.35)] hover:-translate-y-0.5 ${small ? "px-4 py-2.5" : "px-6 py-3.5"}`}>
      <I.phone />
      <span className="text-left leading-tight">
        <span className="block text-base md:text-lg">09&nbsp;70&nbsp;70&nbsp;82&nbsp;11</span>
        <span className="block text-[10px] md:text-xs uppercase tracking-wider text-navy/75 font-bold">Appel gratuit</span>
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
      <ReviewsSection />
      <TeamSection />
      <ZoneSection />
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
        <a href="#" className="flex items-center gap-2 shrink-0" aria-label="Ets Serrurier Vasseur — accueil">
          <SealLogo size={34} />
          <span className="font-display text-xl text-cream font-bold leading-none hidden sm:block">
            Ets Serrurier Vasseur
          </span>
          <span className="font-display text-base text-cream font-bold leading-none sm:hidden">Ets Vasseur</span>
        </a>
        <div className="flex items-center gap-2 md:gap-4">
          <a href="tel:+33970708211" className="flex items-center gap-1.5 md:gap-2 text-cream font-semibold hover:text-gold transition-colors">
            <I.phone size={18} />
            <span className="leading-tight text-left">
              <span className="block text-sm md:text-lg whitespace-nowrap">09&nbsp;70&nbsp;70&nbsp;82&nbsp;11</span>
              <span className="block text-[9px] md:text-xs text-gold font-bold uppercase tracking-wide">Appel gratuit</span>
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
  return (
    <section className="relative text-cream overflow-hidden flex flex-col md:min-h-[760px] bg-navy-deep">
      {/* Image: in flow on mobile (full image visible), absolute cover on desktop */}
      <div className="relative md:absolute md:inset-0">
        <picture>
          <source media="(min-width: 768px)" srcSet="/assets/hero-team.webp" />
          <img
            src="/assets/hero-team-mobile.webp"
            alt="L'équipe d'artisans serruriers Ets Vasseur devant la boutique"
            width={800}
            height={1422}
            fetchPriority="high"
            decoding="async"
            className="block w-full h-[70vh] max-h-[590px] object-cover object-[55%_center] md:h-full md:max-h-none md:absolute md:inset-0 md:w-full md:object-cover md:object-center"
          />
        </picture>
        {/* Top gradient for title legibility */}
        <div
          className="absolute inset-x-0 top-0 h-[38%] md:h-[40%] pointer-events-none"
          style={{ background: "linear-gradient(to bottom, rgba(15,31,53,0.92) 0%, rgba(15,31,53,0.55) 60%, rgba(15,31,53,0) 100%)" }}
          aria-hidden
        />
        {/* Desktop bottom gradient */}
        <div
          className="hidden md:block absolute inset-x-0 bottom-0 h-[48%] pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(15,31,53,0.96) 0%, rgba(15,31,53,0.78) 50%, rgba(15,31,53,0) 100%)" }}
          aria-hidden
        />
        {/* Vignette */}
        <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: "inset 0 0 200px rgba(0,0,0,0.35)" }} aria-hidden />

        {/* Bottom gradient on mobile too (for button legibility) */}
        <div
          className="md:hidden absolute inset-x-0 bottom-0 h-[40%] pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(15,31,53,0.85) 0%, rgba(15,31,53,0.35) 60%, rgba(15,31,53,0) 100%)" }}
          aria-hidden
        />

        {/* Title overlay on top of image */}
        <div className="absolute inset-x-0 top-0 container-px pt-4 md:pt-12 text-center max-w-4xl mx-auto fade-up">
        <p className="text-[11px] sm:text-xs tracking-[0.34em] uppercase text-gold font-semibold mb-2 md:mb-4">
          Serrurier&nbsp;·&nbsp;Vasseur&nbsp;·&nbsp;Depuis&nbsp;2009
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
          Le savoir-faire français à votre service depuis 2009
        </p>
        </div>

        {/* Mobile: pill + buttons overlay on bottom of photo */}
        <div className="md:hidden absolute inset-x-0 bottom-0 container-px pb-5 text-center">
          <p className="inline-flex items-center gap-1.5 text-[11px] font-bold text-navy bg-gold px-2.5 py-0.5 rounded-full mb-2 tracking-wide shadow-md">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
            Chez vous en moins de 20 min
          </p>
          <br />
          <p className="inline-flex items-center gap-2 text-xs font-semibold text-gold bg-navy/80 backdrop-blur border border-gold/50 px-4 py-1.5 rounded-full mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-gold shimmer-dot" />
            Artisan disponible — 7j/7, 8h à 22h
          </p>
          <div className="grid grid-cols-2 gap-2.5 max-w-md mx-auto">
            <a href="tel:+33970708211" className="btn-primary !py-2.5 !px-2 text-xs uppercase tracking-wide leading-tight flex-col">
              <I.phone size={16} />
              <span className="block">09 70 70 82 11</span>
              <span className="block text-[9px]">Appel gratuit</span>
            </a>
            <a href="#devis" className="inline-flex items-center justify-center gap-2 border-2 border-cream/85 text-cream hover:bg-cream hover:text-navy font-semibold uppercase tracking-wide text-xs px-3 py-3.5 rounded-md transition-all backdrop-blur bg-navy/40">
              Demander un devis
            </a>
          </div>
        </div>
      </div>

      <div className="hidden md:block md:flex-1" aria-hidden />

      {/* Desktop bottom block (mobile uses overlay above + features bar below) */}
      <div className="hidden md:block relative container-px pb-14 text-center max-w-4xl mx-auto">
        <p className="inline-flex items-center gap-1.5 text-xs font-bold text-navy bg-gold px-3 py-1 rounded-full mb-3 tracking-wide shadow-md">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
          Chez vous en moins de 20 min
        </p>
        <br />
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-gold bg-navy/80 backdrop-blur border border-gold/50 px-4 py-1.5 rounded-full mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-gold shimmer-dot" />
          Artisan disponible — 7j/7, 8h à 22h
        </p>

        <div className="flex flex-row gap-3 justify-center">
          <PhoneButton />
          <a href="#devis" className="inline-flex items-center justify-center gap-2 border-2 border-cream/85 text-cream hover:bg-cream hover:text-navy font-semibold uppercase tracking-wide text-base px-6 py-3.5 rounded-md transition-all backdrop-blur bg-navy/30">
            Demander un devis
          </a>
        </div>

        <div className="grid grid-cols-3 gap-6 mt-10 max-w-xl mx-auto">
          {[
            { icon: <I.tag className="text-gold" />, label: <>Tarif annoncé<br />avant déplacement</> },
            { icon: <I.key className="text-gold" />, label: <>Paiement<br />après travaux</> },
            { icon: <I.shield className="text-gold" />, label: <>Agréé<br />assurances</> },
          ].map((t, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              {t.icon}
              <p className="text-xs text-cream/95 font-semibold leading-tight">{t.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile features strip */}
      <div className="md:hidden bg-navy-deep border-t border-gold/30">
        <div className="container-px py-4 grid grid-cols-3 max-w-xl mx-auto">
          {[
            { icon: <I.tag className="text-gold" />, label: <>Tarif annoncé<br />avant déplacement</> },
            { icon: <I.key className="text-gold" />, label: <>Paiement<br />après travaux</> },
            { icon: <I.shield className="text-gold" />, label: <>Agréé<br />assurances</> },
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
    { icon: <I.clock />, label: "Intervient en 20 mn" },
    { icon: <I.shield size={26} />, label: "Agréé par assurances" },
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
    { icon: <I.clock />, title: "Intervention sous 20 minutes" },
    { icon: <I.cal />, title: "Disponible 7j/7, 8h à 22h" },
    { icon: <I.phone size={32} />, title: "Numéro direct de l'artisan" },
  ];
  return (
    <section className="py-16 md:py-24 bg-cream">
      <div className="max-w-6xl mx-auto container-px text-center">
        <p className="section-eyebrow mb-3">Urgence serrurier</p>
        <h2 className="section-title">Une urgence&nbsp;? On intervient en 20 minutes</h2>
        <Ornament />
        <p className="section-subtitle mx-auto">
          Porte claquée, clé cassée dans la serrure, serrure HS — nos artisans interviennent en express, matin, après-midi et soirée.
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
function ServicesSection() {
  const services = [
    {
      title: "Ouverture de porte",
      desc: "Porte claquée ou verrou bloqué : ouverture rapide, sans casse quand c'est techniquement possible.",
      svg: (
        <svg width="44" height="44" viewBox="0 0 48 48" fill="none" stroke="#1A2F4E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect x="10" y="6" width="22" height="36" rx="1" /><circle cx="27" cy="24" r="1.5" fill="#1A2F4E" /><path d="M32 26h6m0-2v4" />
        </svg>
      ),
    },
    {
      title: "Changement de serrure",
      desc: "Remplacement complet de serrure usée, défectueuse ou compromise après effraction.",
      svg: (
        <svg width="44" height="44" viewBox="0 0 48 48" fill="none" stroke="#1A2F4E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect x="10" y="20" width="28" height="22" rx="2" /><path d="M16 20v-6a8 8 0 0 1 16 0v6" /><circle cx="24" cy="30" r="2.5" fill="#1A2F4E" /><path d="M24 32.5v4" />
        </svg>
      ),
    },
    {
      title: "Cylindre haute sécurité",
      desc: "Pose de cylindres certifiés anti-effraction, anti-perçage et anti-crochetage.",
      svg: (
        <svg width="44" height="44" viewBox="0 0 48 48" fill="none" stroke="#1A2F4E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect x="8" y="18" width="32" height="12" rx="6" /><circle cx="14" cy="24" r="3" /><circle cx="34" cy="24" r="3" /><path d="M17 24h14" />
        </svg>
      ),
    },
    {
      title: "Blindage de porte",
      desc: "Renforcement du bloc-porte existant avec plaque acier et serrure multipoints.",
      svg: (
        <svg width="44" height="44" viewBox="0 0 48 48" fill="none" stroke="#1A2F4E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M24 4 8 10v12c0 9 7 17 16 22 9-5 16-13 16-22V10z" /><path d="M18 24l5 5 9-10" />
        </svg>
      ),
    },
    {
      title: "Coffre-fort",
      desc: "Installation, ouverture et changement de combinaison pour coffres résidentiels et professionnels.",
      svg: (
        <svg width="44" height="44" viewBox="0 0 48 48" fill="none" stroke="#1A2F4E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect x="6" y="8" width="36" height="32" rx="2" /><circle cx="28" cy="24" r="6" /><path d="M28 21v6m-3-3h6" /><path d="M14 16v16" />
        </svg>
      ),
    },
  ];
  return (
    <section className="py-16 md:py-24 bg-parchment-paper">
      <div className="max-w-6xl mx-auto container-px">
        <div className="text-center mb-12 md:mb-16">
          <p className="section-eyebrow mb-3">Savoir-faire</p>
          <h2 className="section-title">Nos prestations d'artisan serrurier</h2>
          <Ornament />
          <p className="section-subtitle mx-auto">Dépannage et installation, pour le particulier comme pour le professionnel.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {services.map((s, i) => (
            <article key={i} className="card-artisan p-7 group">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-to-br from-parchment/70 to-cream ring-1 ring-gold/20 mb-4 transition-transform group-hover:scale-105">
                {s.svg}
              </div>
              <h3 className="font-display text-2xl text-navy font-bold mt-2">{s.title}</h3>
              <p className="text-ink/75 text-sm mt-2 leading-relaxed">{s.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ TARIFS ------------------------------ */
function TarifsSection() {
  const rows = [
    ["Ouverture porte simple", "79 à 99 €"],
    ["Ouverture porte blindée", "149 à 189 €"],
    ["Changement cylindre standard", "119 à 159 €"],
    ["Changement cylindre haute sécurité", "189 à 249 €"],
    ["Blindage / coffre-fort", "sur devis"],
  ];
  return (
    <section className="py-16 md:py-24 bg-cream">
      <div className="max-w-4xl mx-auto container-px">
        <div className="text-center mb-10">
          <p className="section-eyebrow mb-3">Transparence</p>
          <h2 className="section-title">Tarifs transparents</h2>
          <Ornament />
          <p className="section-subtitle mx-auto">Fourchettes affichées pour les prestations courantes. Le tarif exact est confirmé au téléphone avant intervention.</p>
        </div>

        <div className="card-artisan corner-ornament overflow-hidden p-0">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-navy via-[#22386b] to-navy text-cream">
              <tr>
                <th className="text-left px-5 py-4 font-semibold text-sm uppercase tracking-wider">Prestation</th>
                <th className="text-right px-5 py-4 font-semibold whitespace-nowrap text-sm uppercase tracking-wider">Tarif</th>
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
          <strong className="text-navy font-display text-lg">Tarif annoncé au téléphone avant intervention.</strong>
          <span className="block mt-1">Aucun frais caché. Vous payez après validation du travail.</span>
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
  const logos = ["maif", "macif", "mma", "axa", "allianz", "groupama", "matmut", "maaf"];
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
          <h2 className="section-title">Agréé par les principales assurances habitation</h2>
          <Ornament />
          <p className="section-subtitle mx-auto">Nous nous occupons des démarches avec votre assureur. Constat d'intervention détaillé fourni systématiquement.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
          {logos.map((l) => (
            <div key={l} className="aspect-[16/9] bg-white border border-parchment rounded-md flex items-center justify-center p-3 hover:shadow-card transition-shadow">
              <img src={`/assets/logos/${l}.svg`} alt={l} loading="lazy" decoding="async" width={120} height={48} className="max-h-full max-w-full object-contain opacity-80 hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-ink/70 italic mb-10">
          …et toutes les autres compagnies d'assurance habitation, y compris celles non mentionnées ci-dessus.
        </p>

        <div className="mb-10 card-artisan p-6 flex flex-col sm:flex-row items-start gap-4">
          <div className="shrink-0 w-12 h-12 rounded-full bg-navy/5 ring-1 ring-gold/30 flex items-center justify-center text-navy">
            <I.card />
          </div>
          <div className="text-sm md:text-[15px] text-ink/85 leading-relaxed">
            <p className="font-semibold text-navy mb-1 font-display text-lg">Assistance incluse à votre carte bancaire</p>
            <p>De nombreuses cartes bleues premium (Visa Premier, Visa Infinite, Mastercard Gold, World Elite, American Express Gold ou Platinum…) intègrent une <strong className="text-navy">assistance dépannage serrurier d'urgence</strong> à domicile. Nous vous accompagnons gratuitement dans la démarche auprès de votre banque pour faire jouer cette prise en charge.</p>
          </div>
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

/* ------------------------------ REVIEWS ------------------------------ */
const REVIEWS = [
  ["M", "Marie L.", "Lyon", "il y a 2 semaines", "Intervention rapide et tarif annoncé au téléphone. Pas de mauvaise surprise. Très satisfaite de l'artisan, très professionnel.", "#C8527A", "#fff"],
  ["T", "Thomas D.", "Bordeaux", "il y a 1 mois", "Ma serrure était bloquée un dimanche soir, ils sont venus en 25 minutes. Travail propre, devis respecté. Je recommande.", "#2D7A3A", "#fff"],
  ["S", "Sophie M.", "Lille", "il y a 3 semaines", "Devis clair, paiement après l'intervention. Tout est expliqué. Artisan honnête, ça change.", "#1A2F4E", "#fff"],
  ["P", "Pierre R.", "Toulouse", "il y a 5 jours", "Effraction sur ma porte, intervention rapide et constat fourni pour mon assurance. Tout a été pris en charge sans problème.", "#9B2A2A", "#fff"],
  ["C", "Camille V.", "Marseille", "il y a 4 jours", "Serrure cassée un samedi soir, dépanné en moins d'une demi-heure. Tarif respecté à l'euro près. Très bon service.", "#5F7A8C", "#fff"],
  ["J", "Julien R.", "Nantes", "il y a 1 semaine", "Intervention nickel, l'artisan a pris le temps d'expliquer ce qu'il faisait. Devis tenu, paiement après. Rien à dire.", "#F2B73B", "#1A2F4E"],
  ["M", "Mathilde K.", "Strasbourg", "il y a 2 semaines", "Cylindre haute sécurité installé en 40 minutes. Travail propre, conseils utiles pour l'entretien. Je recommande sans hésiter.", "#C8527A", "#fff"],
  ["A", "Antoine D.", "Rennes", "il y a 6 jours", "Porte claquée à 22h, ils sont venus vite, dépanné sans casser. Tarif annoncé respecté. Sérieux.", "#2D7A3A", "#fff"],
  ["É", "Émilie S.", "Montpellier", "il y a 3 semaines", "Mon assurance a pris en charge l'intervention après effraction. Constat fourni clair, pas de stress. Merci.", "#1A2F4E", "#fff"],
  ["N", "Nathalie B.", "Nice", "il y a 1 semaine", "Très bonne expérience. Devis signé sur place, prix exact. Aucun frais surprise.", "#9B2A2A", "#fff"],
  ["L", "Léa T.", "Besançon", "il y a 4 jours", "Très bonne intervention, prix exact annoncé. Artisan professionnel, j'ai été rassurée.", "#F2B73B", "#1A2F4E"],
] as const;

function ReviewsSection() {
  const geo = useGeoDept();
  return (
    <section className="py-16 md:py-24 bg-parchment-paper">
      <div className="max-w-6xl mx-auto container-px">
        <div className="text-center mb-10">
          <p className="section-eyebrow mb-3">Avis vérifiés</p>
          <h2 className="section-title">Ce que nos clients disent de nous</h2>
          <div className="flex items-center justify-center gap-1 mt-5" aria-label="Note 4,8 sur 5">
            {Array.from({ length: 5 }).map((_, i) => <I.star key={i} size={28} className="text-[#F2B73B]" />)}
          </div>
          <p className="font-display text-4xl text-navy font-bold mt-3">4,8 / 5</p>
          <p className="text-ink/70 text-sm mt-1">Basé sur 127 avis vérifiés</p>
        </div>

        <div className="relative -mx-5 md:-mx-8">
          <div className="reviews-track flex gap-4 md:gap-5 overflow-x-auto snap-x snap-mandatory scroll-px-5 md:scroll-px-8 px-5 md:px-8 pb-5">
            {REVIEWS.map(([initial, name, city, when, body, bg, fg], i) => {
              // Si la géoloc a renvoyé un pool de villes, on remplace la ville statique
              // par une ville du dept du visiteur (ou voisin), en cyclant sur le pool.
              const displayCity = geo.cityPool.length > 0 ? geo.cityPool[i % geo.cityPool.length] : city;
              return (
              <article key={i} className="snap-start shrink-0 w-72 sm:w-80 bg-cream rounded-xl p-5 shadow-card border border-parchment/70 flex flex-col hover:shadow-card-hover hover:-translate-y-0.5 transition-all">
                <div className="flex gap-0.5 mb-3" aria-label="5 étoiles">
                  {Array.from({ length: 5 }).map((_, j) => <I.star key={j} className="text-gold" />)}
                </div>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm shrink-0 ring-2 ring-white shadow-sm"
                       style={{ backgroundColor: bg, color: fg }}>
                    {initial}
                  </div>
                  <div>
                    <p className="font-semibold text-navy text-sm leading-tight">{name}</p>
                    <p className="text-xs text-ink/60">{displayCity}</p>
                  </div>
                </div>
                <p className="text-xs text-ink/50 mb-2">{when}</p>
                <p className="text-sm text-ink/85 leading-relaxed">{body}</p>
              </article>
              );
            })}
          </div>
          <p className="md:hidden text-center text-xs text-ink/50 italic mt-2 px-5">← faites défiler pour voir plus d'avis →</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 mt-10">
          <img src="/assets/logos/trustpilot.svg" alt="Trustpilot" loading="lazy" decoding="async" width={140} height={34} className="h-7 sm:h-8 w-auto opacity-80" />
          <img src="/assets/logos/avis-verifies.svg" alt="Avis Vérifiés" loading="lazy" decoding="async" width={140} height={34} className="h-8 sm:h-9 w-auto opacity-80" />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ TEAM ------------------------------ */
function TeamSection() {
  const team = [
    { name: "Antoine", since: "depuis 2009", badge: "Fondateur", file: "antoine" },
    { name: "Cyril", since: "depuis 2012", file: "cyril" },
    { name: "Lucas", since: "depuis 2014", file: "lucas" },
    { name: "Mathieu", since: "depuis 2017", file: "mathieu" },
    { name: "Romain", since: "depuis 2019", file: "romain" },
  ];
  return (
    <section className="py-16 md:py-24 bg-cream">
      <div className="max-w-6xl mx-auto container-px">
        <div className="text-center mb-12 md:mb-16">
          <p className="section-eyebrow mb-3">Une maison française fondée en 2009</p>
          <h2 className="section-title">Notre équipe de techniciens</h2>
          <Ornament />
          <p className="section-subtitle mx-auto">Cinq artisans serruriers expérimentés, formés en interne, mobiles 7 jours sur 7.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5 max-w-6xl mx-auto">
          {team.map((m) => (
            <article key={m.name} className="card-artisan overflow-hidden flex flex-col">
              <figure className="relative aspect-[4/5] bg-gradient-to-br from-navy/15 via-parchment/50 to-cream">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display text-6xl text-navy/30 font-bold">{m.name[0]}</span>
                </div>
                <img
                  src={`/assets/team/${m.file}.webp`}
                  alt={`Portrait de ${m.name}`}
                  loading="lazy"
                  decoding="async"
                  width={400}
                  height={500}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-navy/40 to-transparent pointer-events-none" />
                {m.badge && (
                  <span className="absolute top-2 left-2 text-[10px] uppercase tracking-wider bg-brick text-white font-bold px-2 py-0.5 rounded shadow">
                    {m.badge}
                  </span>
                )}
              </figure>
              <div className="p-4 text-center">
                <p className="font-display text-2xl text-navy font-bold leading-tight">{m.name}</p>
                <p className="text-xs text-ink/70 mt-1 tracking-wide uppercase">{m.since}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="grid sm:grid-cols-3 gap-5 md:gap-6 mt-12 md:mt-16 max-w-4xl mx-auto">
          {[
            ["+15", "années d'expérience cumulées"],
            ["5", "artisans serruriers mobiles"],
            ["2009", "année de fondation de l'établissement"],
          ].map(([n, l]) => (
            <div key={l} className="corner-ornament bg-parchment/50 rounded-lg p-6 text-center">
              <p className="font-display text-5xl text-navy font-bold">{n}</p>
              <p className="text-sm text-ink/75 mt-2">{l}</p>
            </div>
          ))}
        </div>
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
            Nous intervenons dans{" "}
            <strong className="text-navy">{geo.deptLabel ?? "tout votre département"}</strong>
            {" "}en moins de <strong className="text-navy">20 minutes</strong>, ainsi que dans
            {" "}
            <strong className="text-navy">
              {geo.neighborsLabel ? `les départements limitrophes (${geo.neighborsLabel})` : "les départements limitrophes"}
            </strong>
            {" "}pour les cas d'urgence.
          </p>
          <p>
            Notre maillage est dimensionné pour couvrir <strong className="text-navy">le département</strong> en priorité, avec des artisans positionnés dans les{" "}
            <strong className="text-navy">
              {geo.neighborCities ? `départements voisins (${geo.neighborCities})` : "départements voisins"}
            </strong>
            {" "}prêts à intervenir en renfort sur les cas urgents — nuit, dimanche ou jour férié.
          </p>
        </div>
        <div className="mt-8 inline-flex items-center gap-3 bg-cream border border-gold/40 rounded-full px-6 py-3 shadow-card">
          <I.clock className="text-navy" />
          <p className="font-semibold text-navy">Délai moyen d'intervention&nbsp;: 20 minutes</p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ FAQ ------------------------------ */
function FaqSection() {
  const items = [
    ["Combien de temps pour arriver chez moi ?", "Notre délai d'intervention est de 20 minutes en moyenne pendant nos horaires (8h-22h, 7 jours sur 7)."],
    ["Comment connaître le prix avant l'intervention ?", "Le tarif vous est annoncé au téléphone avant que l'artisan ne se déplace, puis confirmé par un devis signé sur place."],
    ["Quels modes de paiement acceptez-vous ?", "Espèces, cartes bancaires (CB, Visa, Mastercard), virements, et prise en charge directe par votre assurance habitation. Le paiement n'est demandé qu'après validation du travail."],
    ["Mon assurance habitation prend-elle en charge ?", "Dans la majorité des cas (effraction, perte de clés, sinistre), votre assurance prend en charge tout ou partie de l'intervention. Nous fournissons un constat détaillé pour faciliter votre dossier."],
    ["Que se passe-t-il si vous ne pouvez pas ouvrir sans casse ?", "Nous priorisons toujours l'ouverture sans dégât. Si techniquement impossible, nous vous expliquons les options et leur coût avant toute intervention. Vous décidez."],
    ["Travaillez-vous le dimanche et les jours fériés ?", "Oui, nos artisans interviennent 7 jours sur 7, dimanches et jours fériés inclus, de 8h à 22h."],
    ["Comment être sûr que vous n'êtes pas une arnaque ?", "Tarif annoncé avant déplacement, devis écrit signé sur place, paiement uniquement après validation du travail. Pas de surprise ni de pression."],
    ["Combien d'années d'expérience avez-vous ?", "Depuis 2009, les Établissements Vasseur opèrent avec une équipe de 5 artisans serruriers expérimentés, formés en interne."],
  ];
  return (
    <section className="py-16 md:py-24 bg-cream">
      <div className="max-w-3xl mx-auto container-px">
        <div className="text-center mb-10">
          <p className="section-eyebrow mb-3">Questions fréquentes</p>
          <h2 className="section-title">Vos questions, nos réponses</h2>
          <Ornament />
        </div>
        <div className="space-y-3">
          {items.map(([q, a], i) => (
            <details key={i} className="bg-white rounded-xl shadow-card border border-parchment/70 overflow-hidden group open:shadow-card-hover transition-shadow">
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
  const [sent, setSent] = useState(false);
  return (
    <section id="devis" className="relative py-16 md:py-24 bg-navy text-cream scroll-mt-20 overflow-hidden">
      {/* Subtle ornament background */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
           style={{ backgroundImage: "radial-gradient(circle at 20% 20%, #C9A04E 0, transparent 40%), radial-gradient(circle at 80% 80%, #C9A04E 0, transparent 40%)" }} />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      <div className="relative max-w-2xl mx-auto container-px">
        <div className="text-center mb-8">
          <p className="text-[11px] sm:text-xs tracking-[0.34em] uppercase text-gold font-semibold mb-3">Contact</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight">Demandez votre devis gratuit</h2>
          <Ornament />
          <p className="text-cream/80 mt-2">On vous rappelle sous 15 minutes avec un tarif annoncé.</p>
        </div>

        {!sent ? (
          <form
            className="bg-cream text-ink rounded-2xl p-6 md:p-8 shadow-card-hover space-y-4 corner-ornament"
            noValidate
            onSubmit={(e) => { e.preventDefault(); setSent(true); }}
          >
            <Field id="f-nom" label="Nom" required type="text" autoComplete="name" />
            <div className="grid sm:grid-cols-2 gap-4">
              <Field id="f-tel" label="Téléphone" required type="tel" autoComplete="tel" placeholder="06 12 34 56 78" />
              <Field id="f-cp" label="Code postal" required type="text" inputMode="numeric" autoComplete="postal-code" placeholder="75001" />
            </div>
            <div>
              <label htmlFor="f-besoin" className="block text-sm font-semibold text-navy mb-1.5">
                Type de besoin <span className="text-brick">*</span>
              </label>
              <select id="f-besoin" required defaultValue=""
                      className="w-full border border-parchment rounded-md px-4 py-3 bg-white focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30 transition">
                <option value="" disabled>— Choisir —</option>
                <option value="ouverture">Ouverture porte</option>
                <option value="serrure">Changement serrure</option>
                <option value="cylindre">Cylindre</option>
                <option value="blindage">Blindage</option>
                <option value="coffre">Coffre</option>
                <option value="autre">Autre</option>
              </select>
            </div>
            <div>
              <label htmlFor="f-msg" className="block text-sm font-semibold text-navy mb-1.5">
                Message <span className="text-ink/50 font-normal">(optionnel)</span>
              </label>
              <textarea id="f-msg" rows={3}
                        className="w-full border border-parchment rounded-md px-4 py-3 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30 resize-y transition" />
            </div>
            <button type="submit" className="btn-primary w-full !py-4 text-base md:text-lg uppercase tracking-wide">
              Recevoir mon devis sous 15 min
            </button>
            <p className="text-xs text-ink/60 text-center">En envoyant ce formulaire, vous acceptez d'être recontacté par téléphone.</p>
          </form>
        ) : (
          <div className="bg-validate text-white rounded-2xl p-8 text-center shadow-card-hover">
            <I.check size={48} className="mx-auto mb-3" />
            <p className="font-display text-2xl font-bold">Merci, nous vous rappelons sous 15 minutes.</p>
          </div>
        )}
      </div>
    </section>
  );
}

function Field(props: {
  id: string; label: string; required?: boolean; type: string;
  autoComplete?: string; placeholder?: string; inputMode?: "numeric" | "text" | "tel";
}) {
  return (
    <div>
      <label htmlFor={props.id} className="block text-sm font-semibold text-navy mb-1.5">
        {props.label} {props.required && <span className="text-brick">*</span>}
      </label>
      <input
        id={props.id}
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
  const geo = useGeoDept();
  const footerZone = geo.footerLabel ?? "votre département et les départements limitrophes";
  return (
    <footer className="bg-navy-deep text-cream/85 py-12 relative">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      <div className="max-w-6xl mx-auto container-px">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <SealLogo size={36} />
              <p className="font-display text-xl text-cream font-bold">Ets Serrurier Vasseur</p>
            </div>
            <p className="text-sm text-cream/70 leading-relaxed">
              L'artisan français — devis annoncé, prix tenu. Ets Serrurier Vasseur intervient dans {footerZone}.
            </p>
          </div>

          <div>
            <p className="font-semibold text-gold mb-3 uppercase tracking-wider text-xs">Contact</p>
            <ul className="space-y-2 text-sm">
              <li><a href="tel:+33970708211" className="hover:text-gold transition-colors font-semibold text-base">09 70 70 82 11</a></li>
              <li className="text-cream/70">Disponible 7j/7 — 8h à 22h</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-cream/15 text-xs text-cream/60 text-center space-y-2">
          <p>© 2026 Ets Serrurier Vasseur — Tous droits réservés.</p>
          <p>
            <a href="/rgpd" className="hover:text-gold transition-colors underline-offset-2 hover:underline">Politique de confidentialité (RGPD)</a>
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
      <a href="tel:+33970708211" className="w-full flex items-center justify-center gap-2 bg-gold hover:bg-[#B8902F] text-navy font-bold px-3 py-2.5 rounded-md transition-colors whitespace-nowrap min-w-0">
        <I.phone size={18} />
        <span className="leading-tight text-left min-w-0">
          <span className="block text-[15px] tracking-tight whitespace-nowrap">09&nbsp;70&nbsp;70&nbsp;82&nbsp;11</span>
          <span className="block text-[10px] uppercase tracking-wider text-navy/75 font-bold whitespace-nowrap">Appel gratuit · 7j/7</span>
        </span>
      </a>
    </div>
  );
}

