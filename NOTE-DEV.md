# Note pour le dev — Landing Page Ets Serrurier Vasseur

## 🛠 Stack technique

- **React 18** + **TanStack Start** (SSR via Vite) + **Cloudflare Workers** (runtime edge)
- **Vite 7** (build)
- **Tailwind CSS 4** (`@tailwindcss/vite`)
- **shadcn/ui** (`src/components/ui/`, 40+ composants Radix UI)
- **TypeScript** strict (tsconfig present)
- File-based routing : tout `src/routes/*.tsx` devient une URL

## 🚀 Lancement

```bash
npm install              # ou bun install (bun.lock présent)
npm run dev              # http://localhost:8080 (vite + HMR)
npm run build            # output statique dans dist/
npm run preview          # serveur statique pour tester le build
```

## ☁️ Déploiement Cloudflare Pages

Config déjà présente dans `wrangler.jsonc`. Déploiement :

```bash
npm run build
npx wrangler pages deploy dist
```

Ou via le dashboard Cloudflare Pages → connecter le repo Git → build command `npm run build`, output directory `dist`.

## 📁 Structure

```
src/
├── routes/
│   ├── __root.tsx              # layout global (head, fonts Google)
│   ├── index.tsx               # LP complète (1000+ lignes, tous composants inline)
│   └── rgpd.tsx                # /rgpd — politique de confidentialité (noindex)
├── hooks/
│   ├── use-dynamic-content.ts  # H1 dynamique kw + géoloc IP (critique)
│   └── use-mobile.tsx
├── lib/
│   ├── geo-data.ts             # 96 dépts FR + adjacence + 560 villes (constants)
│   ├── utils.ts                # cn() shadcn
│   └── error-*.ts
├── components/ui/              # shadcn (40+ composants Radix)
├── routeTree.gen.ts            # généré auto par TanStack Router — NE PAS modifier à la main
├── router.tsx, server.ts, start.ts
public/assets/
├── hero-team.webp              # desktop landscape
├── hero-team-mobile.webp       # mobile portrait
├── team/[5 portraits].webp
└── logos/[10 SVG]              # assurances + Trustpilot + Avis Vérifiés
```

## ⚡ Dynamiques côté client

### 1. H1 dynamique via param URL `?kw=...`

Hook `useDynamicH1()` dans `src/hooks/use-dynamic-content.ts`.

Lit `?kw=` depuis `window.location.search`, sanitize (regex stricte `[a-zA-ZÀ-ÿ0-9 -]`, max 60 chars, Title Case), injecte dans le H1.

**URL Google Ads à utiliser** (dans le champ "URL finale" ou template d'URL final) :
```
{lpurl}?kw={keyword}
```

Exemple : Google tape "serrurier urgence 92" → l'URL devient `https://ets-serrurier-vasseur.fr/?kw=serrurier+urgence+92` → le H1 affiche **"Serrurier Urgence 92"**.

Fallback statique = `"Ets Serrurier Vasseur"` si pas de `?kw=` ou paramètre invalide.

### 2. Géoloc IP visiteur

Hook `useGeoDept()` dans le même fichier.

- Fetch `https://ipapi.co/json/` au chargement (async, non bloquant, AbortController 4.5s)
- Si visiteur FR + postal valide → résout le département + 4 limitrophes + pool de villes
- Injecte le contenu dynamique à **4 endroits** :
  - `Hero` → (rien, juste le H1)
  - `ZoneSection` → "le 93 — Seine-Saint-Denis" + liste des voisins avec villes
  - `ReviewsSection` → réécrit la ville des 11 cartes d'avis (cycle sur le pool)
  - `Footer` → "intervient dans Seine-Saint-Denis (93) et les départements limitrophes"
- Si hors France / DOM / postal KO / timeout → fallback statique sans cassure visuelle

**Couverture** : 96 départements métropole + Corse 2A/2B, ~560 communes.

**⚠️ Quota ipapi.co free tier = 1 000 req/jour**. Si volume Google Ads soutenu (> 800 clics/jour), basculer sur Cloudflare Pages Function — détails dans le commentaire en haut du hook.

## 📋 À faire AVANT mise en prod

1. **Brancher le formulaire de devis** (`src/routes/index.tsx`, function `ContactForm`)
   - `// TODO: connect to Formspree or backend` en commentaire dans le code
   - Options : [Formspree](https://formspree.io) (gratuit jusqu'à 50 soumissions/mois), [Web3Forms](https://web3forms.com), backend custom

2. **Ajouter le tracking** :
   - GA4 dans `src/routes/__root.tsx` (head)
   - Tag de conversion Google Ads (sur le `submit` du formulaire ET le click sur le téléphone)

3. **Remplacer les placeholders** :
   - Si tu ré-ajoutes un bloc "Informations légales" dans le footer → remplir le SIRET réel (placeholder retiré)

4. **Variables d'environnement** : aucune nécessaire pour la version actuelle (tout est côté client). Si tu ajoutes un backend, créer `.env`.

## 🛡️ RGPD

Page `/rgpd` créée et déployée (validée HTTP 200, contient mention ipapi.co + droits + méthode d'opposition + méta `noindex`).

Lien discret dans le footer sous le copyright.

Base légale invoquée : **intérêt légitime** (art. 6.1.f du RGPD) pour la géoloc.

## 🚫 Interdictions strictes (Quality Score Google Ads)

Termes à ne JAMAIS introduire dans le code, sous peine de plomber le QS :

- ❌ "serrurerie" (toujours "serrurier")
- ❌ "garanti", "garantie", "garantir"
- ❌ Marques de serrures : Picard, Fichet, Bricard, Vachette, Mottura, Mul-T-Lock, Pollux
- ❌ "reproduction de clé", "double de clé", auto/voiture/véhicule
- ❌ Superlatifs : "le meilleur", "n°1", "leader"

Audit grep validé à 0 occurrence au moment du livrage.

## ⚙️ Performance cible

- PageSpeed mobile > 92
- LCP < 2 s (image hero preload + WebP)
- CLS = 0 (dimensions explicites partout)
- Mobile-first, sticky CTA tel respecte safe-area iPhone

## 📞 Téléphone

Numéro `09 70 70 82 11` partout. Format `tel:+33970708211` pour les liens. C'est un numéro non surtaxé donc "Appel gratuit" est mentionné sous chaque CTA téléphone.

## 🎨 Palette (Tailwind config + utilities)

| Token | Hex | Usage |
|---|---|---|
| `navy-deep` | #0E1A2E | bg foncé header/footer |
| `navy` | #1A2F4E | text, accents, sceau |
| `gold` | #C9A04E | CTAs primary, accents, kerning |
| `parchment-paper` | #EBE4D2 | bg sections claires |
| `cream` | #F8F6F1 | bg body |
| `ink` | #2A2A2A | text principal |

Fonts : **Cormorant Garamond** (titres) + **Inter** (body), chargées via Google Fonts dans `__root.tsx`.

## 📝 Contact

Pour toute question sur le code livré, contacter le responsable du projet.

---

**Date du livrage** : mai 2026
**Tests passés** : TypeScript ✓, build prod ✓, route /rgpd HTTP 200 ✓, grep mots interdits = 0, géo coverage 96/96 dépts
