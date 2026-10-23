"""Gera data/matches/primera-argentina.csv e data/matches/liga-mx.csv.

Uso: python3 scripts/fetch_europe.py primera-argentina liga-mx
     python3 scripts/ingest_latam.py [primera-argentina] [liga-mx]

Fonte principal:
  - RSSSF (páginas jogo a jogo) até os torneios que começam antes de
    jul/2003 (Argentina) e jul/2001 (México);
  - ESPN depois disso (arg.1, arg.copa_lpf e mex.1).
Conferência jogo a jogo (mesmo mandante e visitante, data a até 3 dias):
ESPN x RSSSF nos anos em que as duas existem, páginas do RSSSF de 2003-04 a
2011 (Argentina) e 2001-02 em diante (México), football-data.co.uk (2012 em
diante) e openfootball. Conferência por torneio com a tabela do RSSSF.

Temporada:
  - Argentina: ano civil do primeiro jogo do torneio (Apertura 2003 = 2003,
    Clausura 2004 = 2004; temporada longa 1985-86 = 1985).
  - México: ano de início (Apertura 2024 e Clausura 2025 = 2024).
O torneio (Apertura, Clausura, Metropolitano...) vai no `stage` quando a
temporada tem mais de um, junto com a fase de mata-mata.
"""

import bisect
import csv
import json
import re
import sys
from collections import Counter, defaultdict
from datetime import date, datetime, timedelta
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import latam_clubs as LC  # noqa: E402
import rsssf_rounds as R  # noqa: E402
from ingest_europe import FIELDS, parse_date, slugify  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "data" / "raw" / "europe"
OUT = ROOT / "data" / "matches"
RS = RAW / "rsssf"

SRC_RSSSF, SRC_ESPN, SRC_FD, SRC_OF = "RSSSF", "ESPN", "football-data.co.uk", "openfootball/football.json"

LEAGUES = {
    "primera-argentina": dict(
        prefix="arg", rsssf=(0, 2002), check=(2003, 2011), espn=["arg.1", "arg.copa_lpf"], espn_from=date(2003, 7, 1),
        tz=-3, fd="primera-argentina", of=["2025-ar.1"], split=False, country="Argentina", code="arg",
        names=LC.ARG, recent=LC.ARG_RECENT, name="Primera División Argentina", short="Primera Argentina", flag="🇦🇷"),
    "liga-mx": dict(
        prefix="mex", rsssf=(1943, 2000), check=(2001, 2030), espn=["mex.1"], espn_from=date(2001, 7, 1),
        tz=-6, fd="liga-mx", of=["2020-21-mx.1", "2024-25-mx.1"], split=True, country="México", code="mex",
        names=LC.MEX, recent=LC.MEX_RECENT, name="Liga MX", short="Liga MX", flag="🇲🇽"),
}

# Jogos da ESPN fora do campeonato: promoção/rebaixamento, classificação para
# copas, desempates e a final entre campeões (2014); um "final" de 2013 é de outra liga.
ESPN_SKIP = re.compile(r"promocion|^pre-|triangular|playoff|relegation")
ESPN_SKIP_SLUGS = {"torneo-apertura-2006---final", "torneo-clausura-2010---final", "torneo-final-2013---final",
                   "torneo-final-2014---final"}

PHASES = [  # fase de mata-mata: (regex, rótulo)
    (r"round.of.16|octavos|1/8|eighth", "oitavas de final"),
    (r"quarter|cuartos|1/4", "quartas de final"),
    (r"semi", "semifinal"),
    (r"repechaje|reclasif|recalif|reclassif|place.vs|seed.game|play.?in", "repescagem"),
    (r"fase.campe", "fase campeão"),
    (r"complementaci", "fase complementação"),
    (r"\bfinals?\b", "final"),
]


def phase_label(texts):
    """Fase de mata-mata a partir dos títulos (do mais interno para fora)."""
    for t in reversed(texts):
        t = t.replace("-", " ")
        for rx, lab in PHASES:
            if re.search(rx, t, re.I):
                if lab in ("fase campeão", "fase complementação") and re.search(r"\bfinal\b", t, re.I):
                    return "final" if lab == "fase campeão" else "final da fase complementação"
                return lab
    return ""


def q10(dates):
    """Data do primeiro décimo dos jogos: o começo do torneio, sem se deixar levar por um jogo com data errada."""
    ds = sorted(dates)
    return ds[len(ds) // 10]


# ------------------------------------------------------------- nomes


class Names:
    def __init__(self, cfg):
        self.old = LC.build_map(cfg["names"])
        both = dict(cfg["names"])
        for k, v in cfg["recent"].items():
            both[k] = list(both.get(k, [])) + list(v)
        self.recent = LC.build_map(both)
        self.unknown = Counter()

    def canon(self, raw, year, recent=False):
        m = self.recent if recent else self.old
        c = LC.resolve(m, raw, year)
        words = raw.split()
        for k in range(len(words) - 1, 0, -1):  # nome seguido do estádio ou da cidade
            if c is not None:
                break
            c = LC.resolve(m, " ".join(words[:k]), year)
        if c is None:
            self.unknown[raw] += 1
        return c


# ------------------------------------------------------------- RSSSF


def table_lines(paths):
    out = []
    for p in paths:
        for ln in R.text_lines(p):
            if R.MATCH.match(ln):
                continue
            nums = [int(x) for x in re.findall(r"\d+", ln)]
            if len(nums) >= 6:
                out.append(nums)
    return out


def is_subseq(needle, hay):
    it = iter(hay)
    return all(any(h == n for h in it) for n in needle)


def record(games):
    t = defaultdict(lambda: [0] * 6)
    for g in games:
        for team, gf, ga in ((g["home"], g["hg"], g["ag"]), (g["away"], g["ag"], g["hg"])):
            x = t[team]
            x[0] += 1
            x[1 + (0 if gf > ga else 1 if gf == ga else 2)] += 1
            x[4] += gf
            x[5] += ga
    return t


ARG_LONG = {"arg86", "arg87", "arg88", "arg89", "arg90"}  # 1985-86 a 1989-90, temporada à europeia
# página com um torneio sem título reconhecível; "" = Metropolitano e Nacional misturados na mesma seção
PAGE_TOURN = {"arg36": "Copa Campeonato", "arg85": "Nacional", "arg70": "", "arg74": "", "arg80": "", "arg81": ""}
ARG_DISSIDENT = {1912, 1913, 1914, 1919, 1920, 1921, 1922, 1923, 1924, 1925, 1926}


def arg_tourn(key, page, y1):
    k = key.lower()
    if re.fullmatch(r"arg3[1-4]a", page):
        return "Asociación Argentina (amadores)"
    if page == "arg-hon36":
        return "Copa de Honor"
    if re.fullmatch(r"arg3[1-4]", page):
        return "Liga Argentina (profissional)"
    if y1 in ARG_DISSIDENT:
        if "federaci" in k or (y1 == 1914 and "primera" in k):
            return "Federación (FAF)"
        if "amateur" in k or ("primera" in k and y1 >= 1919):
            return "Asociación Amateurs (AAm)"
        return "Asociación Argentina (AAF)"
    for rx, lab in ((r"apertura", "Apertura"), (r"clausura", "Clausura"), (r"metropolitan", "Metropolitano"),
                    (r"nacional|national", "Nacional"), (r"transici", "Transición"), (r"inicial", "Inicial"),
                    (r"copa de honor", "Copa de Honor")):
        if re.search(rx, k):
            return lab
    return "Nacional" if page == "arg73" else ""  # segunda fase do Nacional 1973 sem título


def mex_tourn(tour):
    t = tour.lower()
    for rx, lab in ((r"invierno", "Invierno"), (r"verano", "Verano"), (r"apertura", "Apertura"), (r"clausura", "Clausura"),
                    (r"extraordinary|m[eé]xico\s*70", "México 70"), (r"prode", "Prode 85"), (r"m[eé]xico\s*86", "México 86")):
        if re.search(rx, t):
            return lab
    return ""


def load_rsssf(league, cfg, names, first, last, primary=True):
    """Jogos das páginas do RSSSF. Devolve (jogos, estatísticas, conferência com a tabela)."""
    rows, stats, checks = [], Counter(), []
    arg = cfg["prefix"] == "arg"
    for p, y1, split, title in R.pages(RS, cfg["prefix"], first, last):
        ms = R.parse(p, y1, split)
        keep = []
        for m in ms:
            ok = R.classify(m) is not None if arg else m["gate"] == "on"
            if not ok:
                continue
            if R.skip(m):
                stats["abandonados"] += 1
                continue
            if m["date"] is None:
                stats["sem data"] += 1
                continue
            h, a = names.canon(m["home"], y1), names.canon(m["away"], y1)
            if h is None or a is None:
                stats["sem clube"] += 1
                continue
            m["home"], m["away"] = h, a
            keep.append(m)
        # torneios na ordem da página; grupo pequeno (fase final listada à parte) vai com o anterior
        groups, order = defaultdict(list), []
        for m in keep:
            k = ("" if p.stem in ARG_LONG else R.tkey(m["path"][1:])) if arg else m["tour"]
            if k not in groups:
                order.append(k)
            groups[k].append(m)
        merged, prev = defaultdict(list), None
        for k in order:
            if arg and y1 >= 1990 and p.stem not in ARG_LONG and not re.search(r"apertura|clausura", k, re.I):
                stats["fora do campeonato"] += len(groups[k])  # acesso, pré-Libertadores, final entre campeões
                continue
            if len(groups[k]) < 10 and prev is not None:
                merged[prev] += groups[k]
            else:
                merged[k] += groups[k]
                prev = k
        tlines = None
        for k, games in merged.items():
            if arg and p.stem in ARG_LONG:
                season, tourn = y1, f"Temporada {y1}-{(y1 + 1) % 100:02d}"  # em duas metades na página
            elif arg:
                # ano civil da página; nas páginas de Apertura/Clausura, o ano do começo de cada torneio
                season = q10([g["date"] for g in games]).year if split else y1
                tourn = PAGE_TOURN.get(p.stem, arg_tourn(k, p.stem, y1))
            else:
                season, tourn = y1, mex_tourn(k)
            for m in games:
                ko = any(R.KOX.search(x) for x in m["path"][1:]) if arg else m["phase"] == "mata"
                ph = phase_label(m["path"][1:]) if ko else ""
                if ko and not ph:
                    ph = "mata-mata" if arg else "liguilla"
                note = ""
                if re.search(r"award|awd|w\.?o\.", m["rest"], re.I):
                    note = "placar de campo; resultado alterado no tribunal"
                pen = re.search(r"\[pen (\d+)-(\d+)\]", m["rest"])
                rows.append(dict(season=season, date=m["date"], tourn=tourn, phase=ph, ko=ko,
                                 pens_home=pen[1] if pen else "", pens_away=pen[2] if pen else "",
                                 round=m["round"] if not ko else "", home=m["home"], away=m["away"],
                                 hg=m["hg"], ag=m["ag"], extra_time="1" if m["aet"] else "", note=note,
                                 source=SRC_RSSSF, page=p.stem, tkey=k))
            if primary:
                if tlines is None:
                    hist = []
                    if arg:
                        dec = y1 // 10 * 10
                        hist = list(RS.glob(f"arghist-*{dec}s.html"))
                        if y1 % 10 == 0:
                            hist += list(RS.glob(f"arghist-*{dec - 10}s.html"))
                    tlines = table_lines([p] + hist)
                lg = [r for r in rows[-len(games):] if not r["ko"]]
                rec = record(lg)
                bad = [(t, x) for t, x in rec.items() if not any(is_subseq(x, ln) for ln in tlines)]
                checks.append(dict(page=p.stem, key=k, season=season, teams=len(rec), bad=bad, games=lg, lines=tlines))
    return rows, stats, checks


# ------------------------------------------------------------- ESPN e outras


def espn_base(code, slug):
    if code == "arg.copa_lpf":
        return "copa-de-la-liga"
    b = slug.split("---")[0]
    b = re.sub(r"^\d{4}-\d{2}-", "", b)
    return re.sub(r"^torneo-", "", b)


def espn_tourn(base):
    for rx, lab in ((r"copa-de-la-liga", "Copa de la Liga"), (r"maradona", "Copa Diego Maradona"),
                    (r"apertura", "Apertura"), (r"clausura", "Clausura"), (r"inicial", "Inicial"),
                    (r"^final", "Final"), (r"de-primera-division-2014|1ra-division-2016$", "Transición"),
                    (r"liga-profesional", "Liga Profesional"), (r"superliga", "Superliga")):
        if re.search(rx, base):
            return lab
    return "Primera División"


def load_espn(cfg, names):
    rows, seen = [], set()
    groups = defaultdict(list)
    for code in cfg["espn"]:
        for p in sorted((RAW / "espn" / code).glob("*.json")):
            for e in json.loads(p.read_text(encoding="utf-8")).get("events", []):
                c = e["competitions"][0]
                st = c["status"]["type"]["name"]
                slug = (e.get("season") or {}).get("slug") or ""
                if e["id"] in seen or st not in ("STATUS_FULL_TIME", "STATUS_FINAL_AET", "STATUS_FINAL_PEN"):
                    continue
                if ESPN_SKIP.search(slug) or slug in ESPN_SKIP_SLUGS:
                    continue
                seen.add(e["id"])
                when = datetime.fromisoformat(e["date"].replace("Z", "+00:00")) + timedelta(hours=cfg["tz"])
                side = {x["homeAway"]: x for x in c["competitors"]}
                h, a = side["home"], side["away"]
                row = dict(date=when.date(), home_raw=h["team"]["displayName"], away_raw=a["team"]["displayName"],
                           hg=int(h["score"]), ag=int(a["score"]), source=SRC_ESPN, round="", note="",
                           extra_time="" if st == "STATUS_FULL_TIME" else "1")
                if h.get("shootoutScore") is not None and st == "STATUS_FINAL_PEN":
                    row["pens_home"], row["pens_away"] = str(int(h["shootoutScore"])), str(int(a["shootoutScore"]))
                sub = slug.split("---")[1] if "---" in slug else (slug if code == "arg.copa_lpf" else "")
                if re.search(r"maradona", slug) and not sub:
                    sub = ""
                row["phase"] = "" if re.search(r"group-stage", sub) else phase_label([sub]) if sub else ""
                row["ko"] = bool(row["phase"])
                base = espn_base(code, slug)
                row["tourn"] = espn_tourn(base)
                groups[(code, (e.get("season") or {}).get("year"), base)].append(row)
                rows.append(row)
    for key, rs in groups.items():
        start = q10([r["date"] for r in rs])
        for r in rs:
            r["tstart"] = start
            r["season"] = start.year if not cfg["split"] else (start.year if start.month >= 7 else start.year - 1)
    fr = [(n, date.fromisoformat(a), date.fromisoformat(b), c) for n, a, b, c in LC.ESPN_FRANCHISE] \
        if cfg["prefix"] == "mex" else []
    out = []
    for r in rows:
        y = r["date"].year
        r["home"], r["away"] = names.canon(r["home_raw"], y, True), names.canon(r["away_raw"], y, True)
        for side in ("home", "away"):
            for n, a, b, c in fr:
                if r[side + "_raw"] == n and a <= r["date"] <= b:
                    r[side] = c
        if r["home"] and r["away"]:
            out.append(r)
    return out


def load_fd(cfg, names):
    rows = []
    p = RAW / "football-data" / f"{cfg['fd']}-all.csv"
    if not p.exists():
        return rows
    with p.open(encoding="utf-8-sig", errors="replace") as f:
        for r in csv.DictReader(f):
            if r.get("HG") in ("", None):
                continue
            d = parse_date(r["Date"])
            h, a = names.canon(r["Home"].strip(), d.year, True), names.canon(r["Away"].strip(), d.year, True)
            if h and a:
                rows.append(dict(date=d, home=h, away=a, hg=int(float(r["HG"])), ag=int(float(r["AG"])), source=SRC_FD))
    return rows


def load_of(cfg, names):
    rows = []
    for name in cfg["of"]:
        p = RAW / "openfootball" / f"{name}.json"
        if not p.exists():
            continue
        for m in json.loads(p.read_text(encoding="utf-8"))["matches"]:
            score = m.get("score")
            if isinstance(score, dict):
                score = score.get("ft")
            if not score:
                continue
            d = date.fromisoformat(m["date"])
            h, a = names.canon(m["team1"], d.year, True), names.canon(m["team2"], d.year, True)
            if h and a:
                rows.append(dict(date=d, home=h, away=a, hg=int(score[0]), ag=int(score[1]), source=SRC_OF))
    return rows


# ------------------------------------------------------------- conferência


def crosscheck(prim, sec, stats, src, period):
    """Casa cada jogo da outra fonte com o principal (mesmos clubes, até 3 dias).
    Devolve os votos de placar por jogo principal e os jogos que só a outra fonte tem."""
    idx = defaultdict(list)
    for i, r in enumerate(prim):
        idx[(r["home"], r["away"])].append(i)
    votes, only = defaultdict(dict), []
    lo, hi = period
    for s in sec:
        if not lo <= s["date"] <= hi:
            continue
        cands = [i for i in idx[(s["home"], s["away"])] if abs((prim[i]["date"] - s["date"]).days) <= 3]
        if not cands:
            only.append(s)
            continue
        i = min(cands, key=lambda i: abs((prim[i]["date"] - s["date"]).days))
        r = prim[i]
        st = stats[(r["season"], src)]
        st["matched"] += 1
        if r["date"] != s["date"]:
            st["date_diff"] += 1
        if src == SRC_FD and r.get("extra_time"):
            continue  # football-data traz o placar dos 90 minutos
        votes[i][src] = (s["hg"], s["ag"])
        if (s["hg"], s["ag"]) != (r["hg"], r["ag"]):
            st["score_diff"] += 1
    # só conta o jogo de dois clubes que estão no campeonato naquela temporada
    # (as páginas novas do RSSSF trazem também o acesso, com clubes de mesmo nome)
    days = [r["date"] for r in prim]  # prim está em ordem de data
    clubs = defaultdict(set)
    for r in prim:
        clubs[r["season"]] |= {r["home"], r["away"]}
    kept = []
    for s in only:
        j = bisect.bisect_left(days, s["date"])
        near = [k for k in (j - 1, j) if 0 <= k < len(prim) and abs((days[k] - s["date"]).days) <= 20]
        if near:
            season = prim[near[0]]["season"]
            if s["home"] in clubs[season] and s["away"] in clubs[season]:
                stats[(season, src)]["only"] += 1
                kept.append(s)
    return votes, kept


def table_fits(check, row, score):
    """A tabela do torneio bate com este placar no lugar do atual?"""
    games = [dict(g) for g in check["games"]]
    for g in games:
        if g["date"] == row["date"] and g["home"] == row["home"] and g["away"] == row["away"]:
            g["hg"], g["ag"] = score
    rec = record(games)
    return sum(1 for t, x in rec.items() if not any(is_subseq(x, ln) for ln in check["lines"]))


def build(league):
    cfg = LEAGUES[league]
    names = Names(cfg)
    rs_rows, rs_stats, checks = load_rsssf(league, cfg, names, *cfg["rsssf"])
    espn = load_espn(cfg, names)
    cut = cfg["espn_from"]
    # RSSSF: torneios que começam antes do corte; ESPN: o resto
    tdates = defaultdict(list)
    for r in rs_rows:
        tdates[(r["page"], r["tkey"])].append(r["date"])
    first_of = {k: q10(v) for k, v in tdates.items()}
    prim = [r for r in rs_rows if q10_first(first_of, r) < cut] + [r for r in espn if r["tstart"] >= cut]
    prim.sort(key=lambda r: (r["date"], r["home"]))
    stats = defaultdict(Counter)
    notes, changes = [], []
    lo = min(r["date"] for r in prim)
    hi = max(r["date"] for r in prim)
    secs = []
    old_espn = [r for r in espn if r["tstart"] < cut]
    if old_espn:
        secs.append((SRC_ESPN, old_espn))
    chk_rows, _, _ = load_rsssf(league, cfg, Names(cfg), *cfg["check"], primary=False)
    secs.append((SRC_RSSSF, [r for r in chk_rows if r["date"] >= cut]))
    secs.append((SRC_FD, load_fd(cfg, names)))
    secs.append((SRC_OF, load_of(cfg, names)))
    allvotes = defaultdict(dict)
    only = {}
    for src, rows in secs:
        v, o = crosscheck(prim, rows, stats, src, (lo, hi))
        for i, d in v.items():
            allvotes[i].update(d)
        only[src] = o
    # placar: fica o da fonte principal, salvo quando as outras fontes (duas ou
    # mais) concordam entre si contra ele, ou quando a tabela do RSSSF só bate com o outro
    check_of = {}
    for c in checks:
        for g in c["games"]:
            check_of[(g["date"], g["home"], g["away"])] = c
    for i, v in sorted(allvotes.items()):
        r = prim[i]
        mine = (r["hg"], r["ag"])
        if not v or mine in v.values():
            continue
        alts = set(v.values())
        desc = ", ".join(f"{s}: {h}-{a}" for s, (h, a) in sorted(v.items()))
        c = check_of.get((r["date"], r["home"], r["away"]))
        if len(alts) == 1:
            alt = alts.pop()
            if len(v) >= 2 or (c is not None and table_fits(c, r, alt) < table_fits(c, r, mine)):
                changes.append(f"{r['date']} {r['home']} x {r['away']}: {mine[0]}-{mine[1]} ({r['source']}) → "
                               f"{alt[0]}-{alt[1]} ({desc})")
                r["hg"], r["ag"] = alt
                r["note"] = (r.get("note") + "; " if r.get("note") else "") + f"placar conferido: {desc}"
                continue
        notes.append(f"{r['date']} {r['home']} x {r['away']}: {mine[0]}-{mine[1]} ({r['source']}); {desc}")
    # stage: torneio quando a temporada tem mais de um, mais a fase
    tourns = defaultdict(set)
    for r in prim:
        tourns[r["season"]].add(r["tourn"])
    for y, ts in tourns.items():  # Metropolitano e Nacional: o torneio sem título é o outro
        for a, b in (("Metropolitano", "Nacional"), ("Nacional", "Metropolitano")):
            if ts == {a, ""}:
                for r in prim:
                    if r["season"] == y and not r["tourn"]:
                        r["tourn"] = b
                tourns[y] = {a, b}
    for r in prim:
        t = r["tourn"] if len(tourns[r["season"]]) > 1 else ""
        if len(tourns[r["season"]]) > 1 and not t:
            t = "Campeonato"
        r["stage"] = ": ".join(x for x in (t, r["phase"]) if x)
    return dict(rows=prim, stats=stats, rs_stats=rs_stats, checks=checks, notes=notes, changes=changes,
                only=only, unknown=names.unknown, cfg=cfg)


def q10_first(first_of, r):
    if r["source"] != SRC_RSSSF:
        return r["date"]
    return first_of[(r["page"], r["tkey"])]


# ------------------------------------------------------------- saída


class Clubs:
    def __init__(self, cfg, existing):
        self.cfg = cfg
        self.taken = {c["slug"]: c for c in existing}
        self.foreign = {n for c in existing if c.get("country", "Brasil") != cfg["country"]
                        for n in [c["name"], *c.get("aliases", [])]}
        self.slug_of, self.entries = {}, {}

    def slug(self, name):
        if name in self.slug_of:
            return self.slug_of[name]
        s = slugify(name)
        other = self.taken.get(s)
        if other is not None and other.get("country", "Brasil") != self.cfg["country"]:
            s = f"{s}-{self.cfg['code']}"
        self.slug_of[name] = s
        self.entries[s] = {"slug": s, "name": name, "state": "", "country": self.cfg["country"], "aliases": []}
        return s


def label(cfg, y):
    return f"{y}-{(y + 1) % 100:02d}" if cfg["split"] else str(y)


def write(league, res, existing):
    cfg = res["cfg"]
    clubs = Clubs(cfg, existing)
    # grafias de cada clube nas fontes viram apelidos
    spell = defaultdict(set)
    for club, ns in list(cfg["names"].items()) + list(cfg["recent"].items()):
        for n in ns:
            spell[club].add(n[0] if isinstance(n, tuple) else n)
    out = []
    for r in sorted(res["rows"], key=lambda r: (r["date"], r["home"])):
        out.append(dict(league=league, season=r["season"], date=r["date"].isoformat(), stage=r["stage"],
                        round=r.get("round", ""), home=clubs.slug(r["home"]), away=clubs.slug(r["away"]),
                        home_goals=r["hg"], away_goals=r["ag"], extra_time=r.get("extra_time", ""),
                        pens_home=r.get("pens_home", ""), pens_away=r.get("pens_away", ""), neutral="",
                        status="", note=r.get("note", ""), source=r["source"]))
    for name, s in clubs.slug_of.items():
        e = clubs.entries[s]
        e["aliases"] = sorted(n for n in spell.get(name, ()) if n != name and n not in clubs.foreign)
    with (OUT / f"{league}.csv").open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=FIELDS)
        w.writeheader()
        w.writerows(out)
    return out, clubs


def report(league, res, out):
    cfg = res["cfg"]
    lab = lambda y: label(cfg, y)
    seasons = Counter(r["season"] for r in out)
    src = Counter(r["source"] for r in out)
    st = res["rs_stats"]
    arg = cfg["prefix"] == "arg"
    L = [f"# {cfg['name']}: relatório da carga", "",
         "Gerado por `scripts/ingest_latam.py`. Não editar à mão: rode o script de novo.", "",
         f"- {len(out)} jogos de {lab(min(seasons))} a {lab(max(seasons))}: "
         + ", ".join(f"{n} do {s}" for s, n in src.most_common()) + ".",
         ("- Temporada = ano civil do primeiro jogo do torneio (Apertura 2003 = 2003, Clausura 2004 = 2004; "
          "as temporadas longas 1985-86 a 1990-91 ficam no ano de início)." if arg else
          "- Temporada = ano de início (Apertura 2024 e Clausura 2025 = 2024-25). O torneio México 70 fica em 1969-70."),
         f"- Fonte principal: RSSSF para os torneios que começam antes de {cfg['espn_from'].strftime('%m/%Y')}; "
         "ESPN depois. Conferência jogo a jogo com a outra fonte nos anos em que as duas existem, "
         + ("páginas do RSSSF de 2003-04 a 2011, " if arg else "páginas do RSSSF de 2001-02 em diante, ")
         + "football-data.co.uk (2012 em diante) e openfootball.",
         "- Placar de campo, com prorrogação quando houve. Pênaltis nos jogos da ESPN"
         + (" e nos empates de 1988-89 (o empate ia para os pênaltis valendo ponto)." if arg else "."),
         f"- Fora da carga: {st['abandonados']} jogos abandonados e não completados, {st['sem data']} sem data, "
         f"{st['sem clube']} linhas do RSSSF que não são jogo de clube conhecido (notas, artilharia).",
         ]
    if arg:
        L += ["- Incluídos: campeonatos dissidentes oficiais (FAF 1912-14, AAm 1919-26), os amadores da AAF "
              "1931-34 e a Copa de Honor 1936; fases finais previstas no regulamento (Metropolitano e Nacional, "
              "Copa de la Liga, Copa Maradona, Apertura e Clausura de 2025 em diante).",
              "- Fora: desempates, promoção/rebaixamento, Reclasificatorio, Promocional, Petit e Octogonal, "
              "Liguilla pré-Libertadores, Copa Argentina, supercopas e Trofeo de Campeones, Copa de la Superliga, "
              "a final entre campeões de 2014 e divisões de acesso."]
    else:
        L += ["- Incluídos: temporada regular, liguilla e repescagem (repechaje, reclasificación, play-in).",
              "- Fora: Copa México, Campeón de Campeones, rebaixamento, pré-Libertadores, torneios de "
              "novos valores e divisões de acesso."]
    if res["changes"]:
        L.append(f"- {len(res['changes'])} placares trocados pela conferência (lista abaixo).")
    L += ["", "## Jogos por temporada", "",
          "Colunas das fontes: jogos casados / com data diferente (1 a 3 dias) / com placar diferente / "
          "jogos que só a outra fonte tem (não acrescentados). RSSSF (tabela): times cuja campanha "
          "(J V E D GP GC) bate com a tabela do torneio.", "",
          "| Temporada | Jogos | Fonte | ESPN | RSSSF | football-data | openfootball | RSSSF (tabela) |",
          "|---|---|---|---|---|---|---|---|"]
    by_season_src = defaultdict(Counter)
    for r in out:
        by_season_src[r["season"]][r["source"]] += 1
    tab = defaultdict(lambda: [0, 0])
    for c in res["checks"]:
        tab[c["season"]][0] += c["teams"]
        tab[c["season"]][1] += len(c["bad"])
    for s in sorted(seasons):
        cells = []
        for sname in (SRC_ESPN, SRC_RSSSF, SRC_FD, SRC_OF):
            x = res["stats"].get((s, sname))
            cells.append(f"{x['matched']} / {x['date_diff']} / {x['score_diff']} / {x['only']}" if x else "–")
        t = tab.get(s)
        cells.append(f"{t[0] - t[1]}/{t[0]}" if t else "–")
        fonte = "+".join(k for k, _ in by_season_src[s].most_common())
        L.append(f"| {lab(s)} | {seasons[s]} | {fonte} | " + " | ".join(cells) + " |")
    bad = [c for c in res["checks"] if c["bad"]]
    if bad:
        L += ["", "## Tabela do RSSSF diferente", "",
              "Times cuja campanha nos jogos carregados não aparece na tabela do torneio. Nos casos conferidos: "
              "jogo decidido no tribunal ou por W.O. (conta na tabela e não tem placar), jogo que falta na página, "
              "temporadas de 1988-89 e 1989-90 (empate decidido nos pênaltis muda as colunas), grupos que a "
              "tabela soma de outro jeito.", ""]
        for c in bad:
            L.append(f"- {lab(c['season'])} ({c['page']}, {c['key'][:60] or 'torneio'}): "
                     + "; ".join(f"{t} {x}" for t, x in c["bad"][:8]) + (" ..." if len(c["bad"]) > 8 else ""))
    if res["changes"]:
        L += ["", "## Placares trocados", ""] + [f"- {n}" for n in res["changes"]]
    if res["notes"]:
        L += ["", "## Placares divergentes mantidos", "",
              "Só uma fonte discorda, ou as outras não concordam entre si; fica o da fonte principal.", ""]
        L += [f"- {n}" for n in res["notes"]]
    extra = [(s, r) for s, rows in res["only"].items() for r in rows
             if min(x["date"] for x in res["rows"]) <= r["date"]]
    if extra:
        L += ["", "## Jogos que só outra fonte tem (não acrescentados)", ""]
        for s, r in sorted(extra, key=lambda x: x[1]["date"])[:300]:
            L.append(f"- {r['date']} {r['home']} x {r['away']} {r['hg']}-{r['ag']} ({s})")
        if len(extra) > 300:
            L.append(f"- ... e mais {len(extra) - 300}")
    unk = [(n, c) for n, c in res["unknown"].most_common() if c >= 1]
    if unk:
        L += ["", "## Nomes sem clube (linhas ignoradas)", "", ", ".join(f"{n} ({c})" for n, c in unk[:80])]
    (OUT / f"{league}-relatorio.md").write_text("\n".join(L) + "\n", encoding="utf-8")


def main():
    wanted = sys.argv[1:] or list(LEAGUES)
    clubs_path = ROOT / "data" / "clubs.json"
    for league in wanted:
        cfg = LEAGUES[league]
        res = build(league)
        existing = json.loads(clubs_path.read_text(encoding="utf-8"))
        out, clubs = write(league, res, existing)
        report(league, res, out)
        # cadastro: refaz só os clubes desta liga (lido de novo agora: outras cargas gravam no mesmo arquivo)
        existing = json.loads(clubs_path.read_text(encoding="utf-8"))
        used = {r["home"] for r in out} | {r["away"] for r in out}
        mine = {s: e for s, e in clubs.entries.items() if s in used}
        merged = [c for c in existing if c["slug"] not in mine]
        merged += list(mine.values())
        merged.sort(key=lambda c: c["slug"])
        clubs_path.write_text("[\n" + ",\n".join("  " + json.dumps(c, ensure_ascii=False) for c in merged) + "\n]\n",
                              encoding="utf-8")
        lp = ROOT / "data" / "leagues.json"
        leagues = json.loads(lp.read_text(encoding="utf-8"))
        entry = {"slug": league, "name": cfg["name"], "short": cfg["short"], "country": cfg["country"],
                 "flag": cfg["flag"], "since": min(r["season"] for r in out), "split": cfg["split"], "fem": True}
        old = next((lg for lg in leagues if lg["slug"] == league), None)
        leagues = [({**old, **entry} if lg["slug"] == league else lg) for lg in leagues] if old else leagues + [entry]
        lp.write_text("[\n" + ",\n".join("  " + json.dumps(lg, ensure_ascii=False) for lg in leagues) + "\n]\n",
                      encoding="utf-8")
        nb = sum(len(c["bad"]) for c in res["checks"])
        nt = sum(c["teams"] for c in res["checks"])
        print(f"{league}: {len(out)} jogos, {len(set(r['season'] for r in out))} temporadas, "
              f"{len(res['changes'])} placares trocados, {len(res['notes'])} divergentes mantidos, "
              f"tabela RSSSF {nt - nb}/{nt} times, {len(mine)} clubes, sem nome: {sum(res['unknown'].values())}")


if __name__ == "__main__":
    main()
