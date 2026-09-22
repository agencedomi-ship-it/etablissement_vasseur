import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { EDITEUR } from "@/lib/editeur";

export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <main className="bg-cream text-ink min-h-screen">
      <header className="bg-navy-deep text-cream py-8">
        <div className="max-w-3xl mx-auto px-5 md:px-8 flex items-center justify-between gap-4">
          <Link to="/" className="text-cream/85 hover:text-gold text-sm transition-colors">
            ← Retour à l'accueil
          </Link>
          <p className="font-display text-xl text-cream font-bold">{EDITEUR.nomCommercial}</p>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-5 md:px-8 py-12 md:py-16 prose-content">
        <h1 className="font-display text-4xl md:text-5xl text-navy font-bold leading-tight">{title}</h1>
        <p className="text-sm text-ink/60 mt-2">Dernière mise à jour : {updated}</p>

        {children}

        <nav className="mt-12 pt-8 border-t border-parchment flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
          <Link to="/mentions-legales" className="text-navy hover:text-gold font-semibold transition-colors">Mentions légales</Link>
          <Link to="/cgv" className="text-navy hover:text-gold font-semibold transition-colors">Conditions générales</Link>
          <Link to="/rgpd" className="text-navy hover:text-gold font-semibold transition-colors">Confidentialité</Link>
          <Link to="/" className="text-navy hover:text-gold font-semibold transition-colors">Accueil</Link>
        </nav>
      </article>
    </main>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-10 space-y-4 leading-relaxed">
      <h2 className="font-display text-2xl text-navy font-bold">{title}</h2>
      {children}
    </section>
  );
}

export function PhoneLink() {
  return (
    <a href={EDITEUR.telephoneLien} className="text-gold font-semibold">
      {EDITEUR.telephone}
    </a>
  );
}
