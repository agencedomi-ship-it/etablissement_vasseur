# Régénération de src/lib/google-lieux-fr.json à partir du fichier geotargets de Google Ads :
# python3 outils/table_lieux_google.py <dossier contenant third_party/…/geotargets-*.csv et communes.json> src/lib/geo-data.ts src/lib/google-lieux-fr.json
# (communes.json : https://geo.api.gouv.fr/communes?fields=nom,codeDepartement,codeRegion,population&format=json)
# Table stricte « identifiant de lieu Google Ads » → département (France). Aucun rapprochement approximatif.
import csv, json, re, sys, time, glob, unicodedata, urllib.request, urllib.parse, concurrent.futures as cf, collections
S, FR_DEPT_TS, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
def norm(s):
    s = (s or "").replace("’", " ").replace("'", " ")
    s = unicodedata.normalize("NFD", s).encode("ascii", "ignore").decode().lower()
    s = re.sub(r"[^a-z0-9]+", " ", s)
    return re.sub(r"\bsaint\b", "st", re.sub(r"\bsainte\b", "ste", s)).strip()
REGIONS = {"Ile-de-France": "11", "Centre-Val de Loire": "24", "Bourgogne-Franche-Comte": "27", "Burgundy": "27", "Franche-Comte": "27", "Normandy": "28",
  "Lower Normandy": "28", "Upper Normandy": "28", "Hauts-de-France": "32", "Nord-Pas-de-Calais": "32", "Picardy": "32", "Grand Est": "44", "Alsace": "44",
  "Champagne-Ardenne": "44", "Lorraine": "44", "Pays de la Loire": "52", "Brittany": "53", "Nouvelle-Aquitaine": "75", "Aquitaine": "75", "Limousin": "75",
  "Poitou-Charentes": "75", "Occitanie": "76", "Languedoc-Roussillon": "76", "Midi-Pyrenees": "76", "Auvergne-Rhone-Alpes": "84", "Auvergne": "84",
  "Rhone-Alpes": "84", "Provence-Alpes-Cote d'Azur": "93", "Corsica": "94"}
NOM_REGION = {"11": "ile de france", "24": "centre val de loire", "27": "bourgogne franche comte", "28": "normandie", "32": "hauts de france", "44": "grand est",
  "52": "pays de la loire", "53": "bretagne", "75": "nouvelle aquitaine", "76": "occitanie", "84": "auvergne rhone alpes", "93": "provence alpes cote d azur", "94": "corse"}
ARRONDISSEMENTS = {"11": "75", "93": "13", "84": "69"}
MANUEL = {"Arrondissement of Palaiseau": "91", "Arrondissement of Lyon": "69"}
txt = open(FR_DEPT_TS, encoding="utf-8").read(); bloc = txt[txt.index("FR_DEPT"):txt.index("};", txt.index("FR_DEPT"))]
FR_DEPT = dict(re.findall(r'"?([0-9AB]{2,3})"?\s*:\s*"([^"]+)"', bloc)); nom_dept = {norm(v): k for k, v in FR_DEPT.items()}
communes = collections.defaultdict(list)
for c in json.load(open(S + "/communes.json")):
    communes[(norm(c["nom"]), c.get("codeRegion"))].append((c.get("population") or 0, c["codeDepartement"]))
def dept_cp(p):
    if re.fullmatch(r"97[1-6]\d{2}", p): return p[:3]
    if re.fullmatch(r"20\d{3}", p): return "2A" if int(p[2]) <= 1 else "2B"
    if re.fullmatch(r"\d{5}", p): return p[:2]
rows = [r for r in csv.DictReader(open(glob.glob(S + "/third_party/**/*.csv", recursive=True)[0], encoding="utf-8")) if r["Country Code"] == "FR"]
byid = {r["Criteria ID"]: r for r in rows}
table, stats, adresse = {}, collections.Counter(), []
for r in rows:
    i, t, nom = r["Criteria ID"], r["Target Type"], r["Name"]
    region = REGIONS.get(byid.get(r["Parent ID"], {}).get("Name", ""))
    if t == "Postal Code":
        d = dept_cp(nom); stats["code postal" if d else "code postal invalide"] += 1
    elif t == "Department":
        d = nom_dept.get(norm(nom)); stats["département" if d else "département ?"] += 1
    elif nom in MANUEL:
        d = MANUEL[nom]; stats["manuel"] += 1
    elif t in ("City", "Municipality", "District", "Neighborhood", "Canton"):
        propre = re.sub(r"-\d+$", "", re.sub(r"^(Canton|Arrondissement) of ", "", nom))
        if re.fullmatch(r"\d+(st|nd|rd|th) arrondissement", propre, re.I) and region in ARRONDISSEMENTS:
            d = ARRONDISSEMENTS[region]; stats["arrondissement"] += 1
        else:
            cands = communes.get((norm(propre), region), [])
            d = max(cands)[1] if cands else None
            if d: stats[f"{t} : commune exacte"] += 1
            else: adresse.append((r, propre, region))
    else:
        d = None; stats[f"ignoré ({t})"] += 1
    if d: table[i] = d
def chercher(item):
    r, nom, region = item
    q = urllib.parse.urlencode({"q": nom, "limit": 10})
    for essai in range(4):
        try:
            with urllib.request.urlopen(f"https://api-adresse.data.gouv.fr/search/?{q}", timeout=20) as f: feats = json.load(f).get("features", []); break
        except Exception: time.sleep(1.5 * (essai + 1))
    else: return r, None, "erreur"
    cible = norm(nom); deps = set()
    for f in feats:
        p = f["properties"]
        if region and not norm(p.get("context", "")).endswith(NOM_REGION.get(region, "?")): continue
        noms = {norm(p.get("name")), norm(p.get("city")), norm(p.get("oldcity"))}
        if cible in noms and p.get("type") in ("municipality", "locality", "street") and (p.get("type") != "street" or cible == norm(p.get("oldcity"))):
            deps.add(p["context"].split(",")[0].strip())
    if len(deps) == 1: return r, deps.pop(), "adresse exacte"
    return r, None, "ambigu" if deps else "écarté"
with cf.ThreadPoolExecutor(max_workers=8) as ex:
    for r, d, how in ex.map(chercher, adresse):
        stats[f"{r['Target Type']} : {how}"] += 1
        if d: table[r["Criteria ID"]] = d
json.dump(dict(sorted(table.items(), key=lambda kv: int(kv[0]))), open(OUT, "w", encoding="utf-8"), separators=(",", ":"))
print(json.dumps(dict(sorted(stats.items())), ensure_ascii=False, indent=1)); print("lieux couverts :", len(table), "/", len(rows))
