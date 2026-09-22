# Note pour le dev — Landing Page Serrurier Vantory

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
```

## ⚡ Dynamiques côté client

### 1. Mot-clé Google Ads `?kw=...`

Hook `useKeyword()` (`src/hooks/use-dynamic-content.ts`) : lit `?kw=`, nettoie (lettres, chiffres, espaces,
tirets, 60 caractères max, majuscule à chaque mot) et l'affiche sur une ligne dédiée sous « Un artisan près
de chez vous ». Sans `?kw=`, la ligne n'existe pas.

### 2. Personnalisation géographique Google Ads `?loc=...`

**Suffixe d'URL finale Google Ads** (compte ou campagne) :
```
kw={keyword}&loc={loc_physical_ms}&loci={loc_interest_ms}
```
`{loc_physical_ms}` est un **Geo Target ID Google** (ex. 1005969 = Boulogne-Billancourt), jamais un numéro
de département.

**Fichiers**
- `src/lib/google-lieux-fr.json` — table locale `Geo Target ID → [département, ville | null]` (France).
- `outils/table_lieux_google.py` — génère cette table à partir des données officielles.
- `src/lib/geo-serveur.ts` — `lieuDepuisGeoId()` : lecture de la table (côté serveur, jamais envoyée au navigateur).
- `src/server.ts` — `GET /api/geo?loc=<ID>` → `{ lieu: { geoId, ville, departementNumero, departementNom } | null }`
  (réponse mise en cache 24 h, aucune géolocalisation IP).
- `src/lib/geo-ads.ts` — côté navigateur : lecture de `?loc=`, validation, mémorisation `sessionStorage`,
  mise à jour des éléments `data-dynamic-*`, hook `useLieuGoogleAds()`.
- `src/routes/__root.tsx` — démarre le module sur toutes les pages (`demarrerGeoAds()`).
- `src/hooks/use-dynamic-content.ts` — `useGeoDept()` alimente la zone d'intervention, le H1 et le pied de
  page à partir du même lieu. Les avis clients n'affichent aucune ville.

**Correspondance Geo Target ID → localisation → département**
1. Le CSV officiel Google Ads Geo Targets donne pour chaque ID : nom, type (City, Postal Code, Department,
   District, Neighborhood…) et région parente. Google ne rattache pas les villes à leur département.
2. Le département est retrouvé avec les données officielles de l'État :
   - Postal Code → département déduit du code ; ville seulement si le code ne couvre qu'une commune ;
   - Department → nom du département ;
   - City / Municipality / District → commune officielle au nom identique dans la même région
     (geo.api.gouv.fr), sinon ancienne commune ou lieu-dit au nom identique (Base Adresse Nationale) ;
   - Neighborhood → uniquement les quartiers vérifiés à la main (table `MANUEL` du script) ;
   - arrondissements municipaux de Paris / Lyon / Marseille → 75 / 69 / 13.
3. Tout cas douteux est écarté : l'ID n'est pas dans la table et le site reste générique.

**Mettre la table à jour** (Google publie un nouveau fichier quelques fois par an), depuis le dossier du site :
```bash
cd ~/etablissement-vasseur
python3 outils/table_lieux_google.py
```
Le script télécharge lui-même le dernier fichier Google et les communes officielles (~10 min), puis réécrit
`src/lib/google-lieux-fr.json`. Vérifier le résumé affiché, puis `npm run build && npx wrangler deploy`.

**Afficher le département ou la ville** dans n'importe quelle page : marquer l'élément, le texte d'origine
sert de contenu générique.
```html
<span data-dynamic-department>Île-de-France</span>   → « Hauts-de-Seine (92) »
<span data-dynamic-city>votre secteur</span>          → « Boulogne-Billancourt »
```
(En JSX : `<span data-dynamic-department>Île-de-France</span>`.) La ville n'est remplacée que si elle est
connue avec certitude ; sinon le texte générique reste.

**Règles**
- Sans `?loc=` : lieu mémorisé pendant la session (sessionStorage, effacé à la fermeture de l'onglet).
- `?loc=` présent (nouveau clic) : il remplace l'ancien lieu ; s'il est vide, non numérique ou inconnu,
  le lieu est effacé et le contenu reste générique.
- Jamais de géolocalisation IP ni GPS, jamais de demande d'autorisation.
- L'URL n'est jamais modifiée : `gclid`, `gbraid`, `wbraid`, `kw`, `loc`, `loci` restent intacts.

**Tester** : `https://serrurier-vantory.fr/?loc=1005969` (Boulogne-Billancourt, 92),
`?loc=1006138` (Versailles, 78), `?loc=abc` ou `?loc=999999999` (générique).
Vérifier ensuite dans l'onglet Réseau que l'URL et les appels Google (gtm.js, gtag, collect) contiennent
toujours `gclid`/`kw` inchangés.

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

Page `/rgpd` : droits, personnalisation par zone Google Ads (sans IP ni GPS), cookies, méta `noindex`.

**Consentement** : `src/lib/consentement.ts` + `src/components/bandeau-cookies.tsx`. Google Tag Manager
(GTM-WCGZJJ8H, donc Google Ads, remarketing et suivi d'appels) n'est chargé qu'après « Accepter » ; mode de
consentement Google v2 « refusé » par défaut (script en tête de `__root.tsx`). Choix conservé 6 mois, modifiable
via « Gérer les cookies » (pied de page). Un refus supprime les cookies `_gcl_*` / `_ga*`.

Lien discret dans le footer sous le copyright.

Base légale invoquée : **intérêt légitime** (art. 6.1.f du RGPD) pour la personnalisation géographique.

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
