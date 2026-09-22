#!/usr/bin/env python3
"""
Génère src/lib/google-lieux-fr.json : Geo Target ID Google Ads → [département, ville | null].

Sources (officielles uniquement) :
  - Google Ads Geo Targets (CSV) : https://developers.google.com/google-ads/api/data/geotargets
    → identifiant, nom, type (City, Postal Code, Department, District…) et région parente.
  - Communes françaises : https://geo.api.gouv.fr/communes (API de l'État) → nom officiel,
    département, région, population, codes postaux.
  - Base Adresse Nationale : https://api-adresse.data.gouv.fr (lieux-dits, anciennes communes).

Règles (aucune supposition) :
  - Postal Code : département déduit du code ; ville seulement si le code ne couvre qu'une commune.
  - Department : rapprochement par le nom ; pas de ville.
  - City / Municipality / District : nom identique à une commune officielle de la
    même région (sinon lieu-dit ou ancienne commune au nom identique dans la Base Adresse) ; la ville
    retenue est la commune officielle. Les cantons et arrondissements ne donnent pas de ville.
  - Neighborhood (quartier) : uniquement les cas vérifiés à la main (table MANUEL, par identifiant).
  - Petite commune (< 1 500 hab.) homonyme d'une ancienne commune située dans un autre département
    de la région : écartée (doute).
  - Tout ce qui n'est pas certain est écarté : le site garde alors son contenu générique.

Usage (depuis le dossier du site) :
  python3 outils/table_lieux_google.py
  → télécharge le dernier fichier Geo Targets de Google et les communes, puis écrit la table.
  (options : --geotargets fichier.csv pour utiliser un CSV déjà téléchargé, --sortie autre-fichier.json)
"""
import argparse, collections, csv, io, json, os, re, tempfile, time, unicodedata, urllib.parse, urllib.request, zipfile
import concurrent.futures as cf

REGIONS = {"Ile-de-France": "11", "Centre-Val de Loire": "24", "Bourgogne-Franche-Comte": "27", "Burgundy": "27",
           "Franche-Comte": "27", "Normandy": "28", "Lower Normandy": "28", "Upper Normandy": "28", "Hauts-de-France": "32",
           "Nord-Pas-de-Calais": "32", "Picardy": "32", "Grand Est": "44", "Alsace": "44", "Champagne-Ardenne": "44",
           "Lorraine": "44", "Pays de la Loire": "52", "Brittany": "53", "Nouvelle-Aquitaine": "75", "Aquitaine": "75",
           "Limousin": "75", "Poitou-Charentes": "75", "Occitanie": "76", "Languedoc-Roussillon": "76", "Midi-Pyrenees": "76",
           "Auvergne-Rhone-Alpes": "84", "Auvergne": "84", "Rhone-Alpes": "84", "Provence-Alpes-Cote d'Azur": "93", "Corsica": "94"}
NOM_REGION = {"11": "ile de france", "24": "centre val de loire", "27": "bourgogne franche comte", "28": "normandie",
              "32": "hauts de france", "44": "grand est", "52": "pays de la loire", "53": "bretagne", "75": "nouvelle aquitaine",
              "76": "occitanie", "84": "auvergne rhone alpes", "93": "provence alpes cote d azur", "94": "corse"}
# « 15th arrondissement » : arrondissements municipaux de Paris, Marseille et Lyon.
ARRONDISSEMENTS = {"11": ("75", "Paris"), "93": ("13", "Marseille"), "84": ("69", "Lyon")}
# Cas vérifiés à la main, repérés par leur Geo Target ID (un même nom peut exister dans plusieurs
# régions, ex. « Montereau » 77 et 45) : anciennes communes fusionnées, noms Google différents du nom
# officiel, arrondissements classés « Department », quartiers d'Île-de-France. Les quartiers ne sont
# jamais rapprochés automatiquement : un quartier porte souvent le nom d'une commune située ailleurs.
PARIS = ["75", "Paris"]
MANUEL = {
    "1006042": ["78", "Le Chesnay-Rocquencourt"],   # Le Chesnay (City, IDF)
    "1006102": ["78", "Le Chesnay-Rocquencourt"],   # Rocquencourt (City, IDF)
    "9049895": ["85", "Montaigu-Vendée"],           # Montaigu (City, Pays de la Loire)
    "1006013": ["95", "Éragny-sur-Oise"],           # Eragny (City, IDF)
    "9049901": ["77", "Montereau-Fault-Yonne"],     # Montereau (City, IDF)
    "9209275": ["91", None],                        # Arrondissement of Palaiseau
    "9214480": ["69", None],                        # Arrondissement of Lyon
    "9216244": ["78", None],                        # Arrondissement de Mantes-la-Jolie
    "9072486": PARIS,                               # Belleville (quartier)
    "9072491": PARIS,                               # Bercy
    "9196363": PARIS,                               # Bel-Air
    "9198678": PARIS,                               # Picpus
    "9197673": PARIS,                               # Beaugrenelle
    "9193636": PARIS,                               # Auteuil (Paris 16e)
    "9072487": PARIS,                               # Les Halles
    "9072488": PARIS,                               # Place Vendôme
    "9072489": PARIS,                               # Sorbonne
    "9072490": PARIS,                               # Saint-Germain-des-Prés
    "9212141": ["78", "Saint-Germain-en-Laye"],     # Fourqueux
    "1006030": ["78", "Thiverval-Grignon"],         # Grignon
    "1006029": ["77", "Évry-Grégy-sur-Yerre"],      # Grégy-sur-Yerre
    "9233346": ["92", None],                        # Bécon-les-Bruyères (Courbevoie / Asnières)
    "9060748": PARIS, "9060749": PARIS, "9060750": PARIS,  # 2e, 3e, 9e arrondissements (quartiers)
}


def norm(s):
    s = (s or "").replace("’", " ").replace("'", " ")
    s = unicodedata.normalize("NFD", s).encode("ascii", "ignore").decode().lower()
    s = re.sub(r"[^a-z0-9]+", " ", s)
    return re.sub(r"\bsaint\b", "st", re.sub(r"\bsainte\b", "ste", s)).strip()


def dept_cp(p):
    if re.fullmatch(r"97[1-6]\d{2}", p): return p[:3]
    if re.fullmatch(r"20\d{3}", p): return "2A" if int(p[2]) <= 1 else "2B"
    if re.fullmatch(r"\d{5}", p): return p[:2]
    return None


def adresse(q, limit=10):
    url = "https://api-adresse.data.gouv.fr/search/?" + urllib.parse.urlencode({"q": q, "limit": limit})
    for essai in range(4):
        try:
            with urllib.request.urlopen(url, timeout=20) as f:
                return [x["properties"] for x in json.load(f).get("features", [])]
        except Exception:
            time.sleep(1.5 * (essai + 1))
    return None


PAGE_GEOTARGETS = "https://developers.google.com/google-ads/api/data/geotargets"


def telecharger_geotargets(dossier):
    """Télécharge le fichier Geo Targets le plus récent publié par Google et renvoie le chemin du CSV."""
    page = urllib.request.urlopen(PAGE_GEOTARGETS, timeout=60).read().decode("utf-8", "ignore")
    liens = sorted(set(re.findall(r'/static/google-ads/api/data/geo/geotargets-(\d{4}-\d{2}-\d{2})\.csv\.zip', page)))
    if not liens:
        raise SystemExit("Lien du fichier Geo Targets introuvable sur " + PAGE_GEOTARGETS)
    date = liens[-1]
    url = f"https://developers.google.com/static/google-ads/api/data/geo/geotargets-{date}.csv.zip"
    print(f"Téléchargement du fichier Google du {date}…")
    with zipfile.ZipFile(io.BytesIO(urllib.request.urlopen(url, timeout=300).read())) as z:
        nom = next(n for n in z.namelist() if n.endswith(".csv"))
        chemin = os.path.join(dossier, os.path.basename(nom))
        with open(chemin, "wb") as f:
            f.write(z.read(nom))
    return chemin


def main():
    a = argparse.ArgumentParser()
    a.add_argument("--geotargets", help="CSV Geo Targets déjà téléchargé (sinon : dernier fichier Google)")
    a.add_argument("--communes", help="JSON des communes déjà téléchargé (sinon : téléchargé)")
    a.add_argument("--geo-data", default="src/lib/geo-data.ts")
    a.add_argument("--sortie", default="src/lib/google-lieux-fr.json")
    args = a.parse_args()
    temp = tempfile.mkdtemp(prefix="geotargets-")
    if not args.geotargets:
        args.geotargets = telecharger_geotargets(temp)
    if not args.communes or not os.path.exists(args.communes):
        args.communes = args.communes or os.path.join(temp, "communes.json")
        print("Téléchargement des communes officielles…")
        urllib.request.urlretrieve("https://geo.api.gouv.fr/communes?fields=nom,codeDepartement,codeRegion,population,codesPostaux&format=json", args.communes)
    print("Génération de la table (environ 10 minutes)…")
    communes_liste = json.load(open(args.communes, encoding="utf-8"))
    communes = collections.defaultdict(list)          # (nom normalisé, région) → [(population, dept, nom officiel)]
    par_cp = collections.defaultdict(set)             # code postal → {(dept, nom officiel)}
    for c in communes_liste:
        communes[(norm(c["nom"]), c.get("codeRegion"))].append((c.get("population") or 0, c["codeDepartement"], c["nom"]))
        for p in c.get("codesPostaux", []):
            par_cp[p].add((c["codeDepartement"], c["nom"]))

    txt = open(args.geo_data, encoding="utf-8").read()
    bloc = txt[txt.index("FR_DEPT"):txt.index("};", txt.index("FR_DEPT"))]
    fr_dept = dict(re.findall(r'"?([0-9AB]{2,3})"?\s*:\s*"([^"]+)"', bloc))
    nom_dept = {norm(v): k for k, v in fr_dept.items()}

    rows = [r for r in csv.DictReader(open(args.geotargets, encoding="utf-8")) if r["Country Code"] == "FR"]
    byid = {r["Criteria ID"]: r for r in rows}
    table, stats, a_chercher, petites = {}, collections.Counter(), [], []

    for r in rows:
        i, t, nom = r["Criteria ID"], r["Target Type"], r["Name"]
        region = REGIONS.get(byid.get(r["Parent ID"], {}).get("Name", ""))
        if i in MANUEL:
            table[i] = list(MANUEL[i]); stats["manuel"] += 1
        elif t == "Postal Code":
            d = dept_cp(nom)
            if d:
                villes = {v for dd, v in par_cp.get(nom, set()) if dd == d}
                table[i] = [d, villes.pop() if len(villes) == 1 else None]; stats["code postal"] += 1
        elif t == "Department":
            d = nom_dept.get(norm(nom))
            if d: table[i] = [d, None]; stats["département"] += 1
            else: stats["département non reconnu"] += 1
        elif t == "Neighborhood":
            stats["quartier non vérifié (écarté)"] += 1
        elif t in ("City", "Municipality", "District", "Canton"):
            canton = t == "Canton" or nom.startswith(("Canton of ", "Arrondissement of "))
            propre = re.sub(r"-\d+$", "", re.sub(r"^(Canton|Arrondissement) of ", "", nom))
            if re.fullmatch(r"\d+(st|nd|rd|th) arrondissement( of (Paris|Marseille|Lyon))?", propre, re.I) and region in ARRONDISSEMENTS:
                table[i] = list(ARRONDISSEMENTS[region]); stats["arrondissement municipal"] += 1
                continue
            cands = communes.get((norm(propre), region), [])
            if cands:
                pop, d, officiel = max(cands)
                table[i] = [d, None if canton else officiel]; stats[f"{t} : commune"] += 1
                if pop < 1500 and not canton: petites.append((i, propre, region, d))
            else:
                a_chercher.append((r, propre, region, canton))
        else:
            stats[f"ignoré ({t})"] += 1

    def via_adresse(item):
        r, nom, region, canton = item
        props = adresse(nom)
        if props is None: return r, None
        cible, trouves = norm(nom), set()
        for p in props:
            if region and not norm(p.get("context", "")).endswith(NOM_REGION.get(region, "?")): continue
            exact = cible in {norm(p.get("name")), norm(p.get("city")), norm(p.get("oldcity"))}
            if exact and (p.get("type") in ("municipality", "locality") or cible == norm(p.get("oldcity"))):
                trouves.add((p["context"].split(",")[0].strip(), p.get("city")))
        depts = {d for d, _ in trouves}
        if len(depts) != 1: return r, None
        d = depts.pop(); villes = {v for dd, v in trouves if dd == d and v}
        return r, [d, None if canton or len(villes) != 1 else villes.pop()]

    def homonyme(item):
        i, nom, region, d = item
        props = adresse(nom, 15) or []
        return i, any(norm(nom) == norm(p.get("oldcity")) and norm(p.get("context", "")).endswith(NOM_REGION.get(region, "?"))
                      and p["context"].split(",")[0].strip() != d for p in props)

    with cf.ThreadPoolExecutor(max_workers=8) as ex:
        for r, v in ex.map(via_adresse, a_chercher):
            stats[f"{r['Target Type']} : {'base adresse' if v else 'écarté'}"] += 1
            if v: table[r["Criteria ID"]] = v
        for i, doute in ex.map(homonyme, petites):
            if doute and i not in MANUEL:
                del table[i]; stats["écarté (homonyme ancienne commune)"] += 1

    json.dump(dict(sorted(table.items(), key=lambda kv: int(kv[0]))), open(args.sortie, "w", encoding="utf-8"),
              ensure_ascii=False, separators=(",", ":"))
    print(json.dumps(dict(sorted(stats.items())), ensure_ascii=False, indent=1))
    print(f"{len(table)} lieux sur {len(rows)} → {args.sortie}")


if __name__ == "__main__":
    main()
