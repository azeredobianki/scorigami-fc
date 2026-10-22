"""Gera data/matches/<liga>.csv das cinco grandes ligas europeias.

Uso: python3 scripts/fetch_europe.py && python3 scripts/ingest_europe.py [liga ...]

Fonte principal: engsoccerdata (jalapic), da primeira temporada até 2024-25.
Conferência jogo a jogo, e preenchimento do que falta, com:
  - footballcsv (cópia do openfootball): Bundesliga 1963-2020, Premier 1992-2020;
  - openfootball/football.json: 2010-11 em diante (varia por liga), única fonte de 2025-26+;
  - football-data.co.uk (via datasets/football-datasets): 1993-94 em diante.
Conferência por temporada com a tabela final do RSSSF (J, V, E, D, GP, GC de cada time).

Temporada = ano de início (2024 = 2024-25). Os nomes das outras fontes viram
clubes por votação: jogos com a mesma data (±3 dias) e o mesmo placar.
"""

import csv
import json
import re
import sys
import unicodedata
from collections import Counter, defaultdict
from datetime import date, timedelta
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from europe_clubs import ALIASES, COUNTRY, DISPLAY, FIXES, MERGE  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "data" / "raw" / "europe"
OUT = ROOT / "data" / "matches"

FIELDS = [
    "league", "season", "date", "stage", "round", "home", "away",
    "home_goals", "away_goals", "extra_time", "pens_home", "pens_away",
    "neutral", "status", "note", "source",
]

LEAGUES = {
    "premier-league": dict(es="england", fd="premier-league", of="en.1", fcsv="eng.1.csv",
                           name="Premier League", short="Premier League", flag="🏴󠁧󠁢󠁥󠁮󠁧󠁿"),
    "la-liga": dict(es="spain", fd="la-liga", of="es.1", fcsv=None,
                    name="La Liga", short="La Liga", flag="🇪🇸"),
    "serie-a": dict(es="italy", fd="serie-a", of="it.1", fcsv=None,
                    name="Serie A", short="Serie A", flag="🇮🇹"),
    "bundesliga": dict(es="germany", fd="bundesliga", of="de.1", fcsv="de.1.csv",
                       name="Bundesliga", short="Bundesliga", flag="🇩🇪"),
    "ligue-1": dict(es="france", fd="ligue-1", of="fr.1", fcsv=None,
                    name="Ligue 1", short="Ligue 1", flag="🇫🇷"),
}

SRC_ES = "jalapic/engsoccerdata"
SRC_FCSV = "footballcsv (openfootball)"
SRC_OF = "openfootball/football.json"
SRC_FD = "football-data.co.uk"
SRC_RSSSF = "RSSSF"

# Temporadas em que o engsoccerdata traz a mesma data para o campeonato
# inteiro (1º de julho do ano seguinte) e não há outra fonte com datas.
NO_DATES = {"ligue-1": set(range(1932, 1937))}


def label(y):
    return f"{y}-{(y + 1) % 100:02d}"


def norm(s):
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode().lower()
    s = re.sub(r"[^a-z0-9 ]", " ", s)
    drop = {"fc", "afc", "cf", "sc", "ac", "as", "ssc", "cfc", "club", "de", "calcio", "rc", "rcd",
            "ud", "cd", "sd", "us", "sv", "vfl", "vfb", "tsg", "the", "1", "fk", "ca", "real"}
    return " ".join(w for w in s.split() if w not in drop and not re.fullmatch(r"\d{4}", w))


def slugify(s):
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")


def parse_date(s):
    s = s.strip()
    if re.fullmatch(r"\d{4}-\d{2}-\d{2}", s):
        return date.fromisoformat(s)
    m = re.fullmatch(r"(\d{1,2})/(\d{1,2})/(\d{2,4})", s)
    if m:
        d, mo, y = (int(x) for x in m.groups())
        if y < 100:
            y += 1900 if y > 50 else 2000
        return date(y, mo, d)
    m = re.fullmatch(r"\w{3} (\w{3}) (\d{1,2}) (\d{4})", s)
    if m:
        return date(int(m[3]), "JanFebMarAprMayJunJulAugSepOctNovDec".index(m[1]) // 3 + 1, int(m[2]))
    raise ValueError(f"data: {s!r}")


def in_season(d, season):
    """Julho do ano de início a agosto do ano seguinte (2019-20 acabou em agosto)."""
    return date(season, 7, 1) <= d <= date(season + 1, 8, 31)


# ---------------------------------------------------------------- fontes


def load_engsoccer(cfg):
    rows = []
    with (RAW / "engsoccerdata" / f"{cfg['es']}.csv").open(encoding="utf-8") as f:
        for r in csv.DictReader(f):
            if r["tier"] != "1":
                continue
            stage = "Fase 2" if r.get("round") == "phase2" else ""
            rows.append(dict(season=int(r["Season"]), date=date.fromisoformat(r["Date"]), stage=stage,
                             round="", home_raw=r["home"], away_raw=r["visitor"],
                             hg=int(r["hgoal"]), ag=int(r["vgoal"]), source=SRC_ES))
    return rows


def load_fcsv(cfg):
    rows = []
    if not cfg["fcsv"]:
        return rows
    for p in sorted((RAW / "footballcsv").glob(f"*-{cfg['fcsv']}")):
        season = int(p.name[:4])
        with p.open(encoding="utf-8") as f:
            for r in csv.DictReader(f, skipinitialspace=True):
                m = re.fullmatch(r"(\d+)-(\d+)", (r.get("FT") or "").strip())
                if not m:
                    continue
                rows.append(dict(season=season, date=parse_date(r["Date"]), round=(r.get("Matchday") or r.get("Round") or "").strip(),
                                 home_raw=r["Team 1"].strip(), away_raw=r["Team 2"].strip(),
                                 hg=int(m[1]), ag=int(m[2]), source=SRC_FCSV))
    return rows


def load_of(cfg):
    rows = []
    for p in sorted((RAW / "openfootball").glob(f"*-{cfg['of']}.json")):
        season = int(p.name[:4])
        for m in json.loads(p.read_text(encoding="utf-8"))["matches"]:
            score = m.get("score")
            if isinstance(score, dict):
                score = score.get("ft")
            if not score:
                continue
            rnd = re.sub(r"^Matchday ", "", m.get("round", ""))
            rows.append(dict(season=season, date=date.fromisoformat(m["date"]), round=rnd,
                             home_raw=m["team1"], away_raw=m["team2"],
                             hg=int(score[0]), ag=int(score[1]), source=SRC_OF))
    return rows


def load_fd(cfg):
    rows = []
    for p in sorted((RAW / "football-data").glob(f"{cfg['fd']}-*.csv")):
        season = int(p.name[len(cfg["fd"]) + 1:][:4])
        with p.open(encoding="utf-8-sig", errors="replace") as f:
            for r in csv.DictReader(f):
                if not r.get("HomeTeam") or r.get("FTHG") in ("", None):
                    continue
                rows.append(dict(season=season, date=parse_date(r["Date"]), round="",
                                 home_raw=r["HomeTeam"].strip(), away_raw=r["AwayTeam"].strip(),
                                 hg=int(float(r["FTHG"])), ag=int(float(r["FTAG"])), source=SRC_FD))
    return rows


IT_MONTHS = {m: i + 1 for i, m in enumerate("gen feb mar apr mag giu lug ago set ott nov dic".split())}
IT_DATE = r"(\d{1,2})[ -]+([a-z]{3})[a-z]*[ -]+(\d{4})"


def it_date(m):
    return date(int(m[3]), IT_MONTHS[m[2].lower()], int(m[1]))


def load_rsssf_ita(cfg):
    """Resultados rodada a rodada das páginas italianas do RSSSF (italYY.html).
    Placar de campo: quando a nota diz que o jogo terminou com outro placar
    ("in campo", "finished", "with the score of"), vale esse, com status."""
    if cfg["es"] != "italy":
        return []
    rows = []
    for p in sorted((RAW / "rsssf").glob("ital*.html")):
        m = re.fullmatch(r"ital(\d{2})\.html", p.name)
        if not m:
            continue
        n = int(m[1])
        season = (1900 + n if n > 25 else 2000 + n) - 1
        lines = re.sub(r"<[^>]+>", " ", p.read_text(encoding="latin-1")).replace("\r", "").splitlines()
        cur, rnd, seen_result, pending = None, "", False, []
        notes = {}

        def flush():
            for r, mark in pending:
                note = notes.get(mark, "")
                d = re.search(r"played (?:on )?" + IT_DATE, note, re.I)
                d2 = re.search(r"played (?:on )?(\d{1,2})-(\d{1,2})-(\d{2,4})", note)
                if d and "between" not in note and " or " not in note:
                    r["date"] = it_date(d)
                elif d2:
                    y = int(d2[3]) + (1900 if int(d2[3]) < 100 else 0)
                    r["date"] = date(y, int(d2[2]), int(d2[1]))
                field = re.search(r"(\d+)-(\d+) in campo|finished (\d+)-(\d+)|score of (\d+)-(\d+)", note)
                if field:
                    g = [int(x) for x in field.groups() if x is not None]
                    r["hg"], r["ag"] = g
                    r["status"] = "resultado alterado"
                elif re.search(r"tavolino|awarded|forfait", note, re.I):
                    r["status"] = "sem placar de campo"
                if note:
                    r["note"] = note
                rows.append(r)
            pending.clear()
            notes.clear()

        for ln in lines:
            h = re.match(r"\s*(\d+)a GIORNATA\s+" + IT_DATE, ln, re.I)
            if h:
                flush()
                cur, rnd = date(int(h[4]), IT_MONTHS[h[3].lower()], int(h[2])), h[1]
                continue
            if seen_result and (re.fullmatch(r"\s*(SERIE B|Serie B|Italy Cup.*)\s*", ln)
                                or re.match(r"\s*(\[\*+\]|\(\*+\))?\s*(Relegation|Decisive|Spareggi|Play-?off|Play-?out)",
                                            ln, re.I)):
                break  # desempates e playoffs ficam fora, como no engsoccerdata
            r = re.match(r"(\S.*?)\s+-\s+(\S.*?)\s+(\d{1,2})-(\d{1,2})\s*(\[\*+\]|\(\*+\d?\)|\*+\d?|\(\d\))?(?:\s|$)", ln)
            if r and cur:
                seen_result = True
                mark = (r[5] or "").strip("()[]")
                pending.append((dict(season=season, date=cur, round=rnd, home_raw=r[1].strip(),
                                     away_raw=r[2].strip(), hg=int(r[3]), ag=int(r[4]), source=SRC_RSSSF), mark))
                continue
            nm = re.match(r"\s*(\[\*+\]|\(\*+\d?\)|\*+\d?|\(\d\))\s*(.*)", ln)
            if nm and pending:
                notes[nm[1].strip("()[]")] = nm[2].strip()
        flush()
    return rows


def load_rsssf_fra(cfg):
    """Tabelas de cruzamento (mandante na linha) de franfullhist.html, 1932-1998.
    Não têm data: servem para conferir placares, não para acrescentar jogos."""
    if cfg["es"] != "france":
        return []
    text = re.sub(r"<[^>]+>", " ", (RAW / "rsssf" / "franfullhist.html").read_text(encoding="latin-1"))
    parts = re.split(r"\n\s*(\d{4})-\d{4}\s*\n", text)
    rows = []
    cell = r"\d+-\d+|\*\*\*|---|xxx"
    for i in range(1, len(parts), 2):
        season = int(parts[i])
        block = []
        for ln in parts[i + 1].splitlines() + [""]:
            cells = re.findall(cell, ln)
            name = re.split(cell, ln)[0].strip() if cells else ""
            if len(cells) >= 8 and name and "***" in cells:
                block.append((name, cells))
                continue
            if block:
                names = [n for n, _ in block]
                if all(len(c) == len(block) for _, c in block):
                    for a, (home, cs) in enumerate(block):
                        for b, c in enumerate(cs):
                            m = re.fullmatch(r"(\d+)-(\d+)", c)
                            if a != b and m:
                                rows.append(dict(season=season, date=None, round="", home_raw=home,
                                                 away_raw=names[b], hg=int(m[1]), ag=int(m[2]), source=SRC_RSSSF))
                block = []
    return rows


def map_crosstable(sec, rows, clubs):
    """Nome da tabela de cruzamento -> clube da temporada, por semelhança do
    nome; confirma pelos placares."""
    from difflib import SequenceMatcher
    by_season = defaultdict(set)
    for r in rows:
        by_season[r["season"]] |= {r["home"], r["away"]}
    names_of = {slug: [norm(n) for n in [e["name"], *e["aliases"]]] for slug, e in clubs.entries.items()}
    raw_by_season = defaultdict(set)
    for m in sec:
        raw_by_season[m["season"]] |= {m["home_raw"], m["away_raw"]}
    assign = {}
    for season, raws in raw_by_season.items():
        ours = by_season.get(season, set())
        sims = []
        for raw in raws:
            for slug in ours:
                sim = max(SequenceMatcher(None, norm(raw), n).ratio() for n in names_of[slug])
                sims.append((sim, raw, slug))
        used_raw, used_slug = set(), set()
        for sim, raw, slug in sorted(sims, reverse=True):
            if raw not in used_raw and slug not in used_slug:
                assign[(season, raw)] = slug
                used_raw.add(raw)
                used_slug.add(slug)
    # Troca nomes mal casados: troca dois nomes enquanto isso aumenta os placares que batem.
    score = {(r["season"], r["home"], r["away"]): (r["hg"], r["ag"]) for r in rows}
    by_s = defaultdict(list)
    for m in sec:
        by_s[m["season"]].append(m)

    def hits(season, amap):
        return sum(score.get((season, amap.get(m["home_raw"]), amap.get(m["away_raw"]))) == (m["hg"], m["ag"])
                   for m in by_s[season])

    for season, ms in by_s.items():
        amap = {raw: assign[(season, raw)] for raw in raw_by_season[season] if (season, raw) in assign}
        best = hits(season, amap)
        improved = True
        while improved:
            improved = False
            keys = list(amap)
            for i in range(len(keys)):
                for j in range(i + 1, len(keys)):
                    a, b = keys[i], keys[j]
                    amap[a], amap[b] = amap[b], amap[a]
                    h = hits(season, amap)
                    if h > best:
                        best, improved = h, True
                    else:
                        amap[a], amap[b] = amap[b], amap[a]
        for raw, slug in amap.items():
            assign[(season, raw)] = slug
    out = []
    for m in sec:
        h, a = assign.get((m["season"], m["home_raw"])), assign.get((m["season"], m["away_raw"]))
        if h and a:
            out.append({**m, "home": h, "away": a})
    agree = Counter()
    total = Counter()
    for m in out:
        k = (m["season"], m["home"], m["away"])
        if k in score:
            total[m["season"]] += 1
            agree[m["season"]] += score[k] == (m["hg"], m["ag"])
    bad = {s for s in total if agree[s] < 0.8 * total[s]}
    return [m for m in out if m["season"] not in bad], sorted(bad)


# ---------------------------------------------------------------- clubes


class Clubs:
    """Clubes de uma liga: nome do engsoccerdata -> slug, e o cadastro a gravar."""

    def __init__(self, league, prim, existing):
        self.league = league
        self.country, self.code = COUNTRY[league]
        merge, display = MERGE[league], DISPLAY[league]
        taken = {c["slug"]: c for c in existing}
        # grafias que já são de clube de outro país não viram apelido (ingest.py usa apelidos globais)
        self.foreign = {n for c in existing if c.get("country", "Brasil") != self.country
                        for n in [c["name"], *c.get("aliases", [])]}
        seasons = defaultdict(set)
        for r in prim:
            for n in (r["home_raw"], r["away_raw"]):
                seasons[n].add(r["season"])
        self.slug_of = {}  # nome bruto -> slug
        self.entries = {}  # slug -> cadastro
        canon = sorted({merge.get(n, (n, None))[0] for n in seasons} | {c for c, _ in merge.values()})
        for c in canon:
            self._add(c, display.get(c, c), taken)
        for n in seasons:
            c, old = merge.get(n, (n, None))
            slug = self.slug_of[c]
            self.slug_of[n] = slug
            e = self.entries[slug]
            if n != c and old:
                e.setdefault("_old", []).append((old, min(seasons[n]), max(seasons[n])))
            if n != e["name"] and n not in self.foreign:
                e["aliases"].append(n)
        for slug, e in self.entries.items():
            olds = sorted(e.pop("_old", []), key=lambda x: x[1])
            if olds:
                names = [{"name": o, "from": a, "to": b} for o, a, b in olds]
                names.append({"name": e["name"], "from": olds[-1][2] + 1})
                names[0].pop("from")
                e["names"] = names

    def _add(self, raw, name, taken):
        slug = slugify(name)
        other = taken.get(slug)
        if other is not None and other.get("country") != self.country:
            slug = f"{slug}-{self.code}"
        if slug in self.entries:
            self.slug_of[raw] = slug
            return slug
        # o cadastro dos clubes desta liga é refeito a cada execução
        self.entries[slug] = {"slug": slug, "name": name, "state": "", "country": self.country, "aliases": []}
        self.slug_of[raw] = slug
        return slug

    def new_club(self, raw, name, existing):
        return self._add(raw, name, {c["slug"]: c for c in existing})

    def add_alias(self, slug, name):
        e = self.entries[slug]
        if name != e["name"] and name not in e["aliases"] and name not in self.foreign:
            e["aliases"].append(name)


def map_names(sec, rows, clubs, existing, log, strict=True):
    """Atribui slug a home/away de cada jogo de `sec`, por votação contra `rows`."""
    idx = defaultdict(list)
    for r in rows:
        idx[(r["date"], r["hg"], r["ag"])].append((r["home"], r["away"]))
    votes = defaultdict(Counter)
    for m in sec:
        for dd in (0, -1, 1, -2, 2, -3, 3):
            c = idx.get((m["date"] + timedelta(days=dd), m["hg"], m["ag"]))
            if c and len(c) == 1:
                votes[(m["season"], m["home_raw"])][c[0][0]] += 1
                votes[(m["season"], m["away_raw"])][c[0][1]] += 1
                break
    per_season = {}
    overall = defaultdict(Counter)
    for (season, name), cnt in votes.items():
        (best, n), *rest = cnt.most_common(2) + [(None, 0)]
        if n >= 3 and n >= 3 * rest[0][1]:
            per_season[(season, name)] = best
            overall[name][best] += season  # temporada mais recente pesa mais
    by_norm = defaultdict(set)
    for slug, e in clubs.entries.items():
        for n in [e["name"], *e["aliases"]]:
            by_norm[norm(n)].add(slug)
    aliases = ALIASES[clubs.league]
    resolved = {}
    for name in {m["home_raw"] for m in sec} | {m["away_raw"] for m in sec}:
        if name in aliases:
            target = aliases[name]
            if target.startswith("NEW:"):
                resolved[name] = clubs.new_club(name, target[4:], existing)
                log.append(f"clube novo: {target[4:]} ({name})")
            else:
                resolved[name] = clubs.slug_of[target]
        elif overall[name]:
            resolved[name] = overall[name].most_common(1)[0][0]
        elif len(by_norm.get(norm(name), ())) == 1:
            resolved[name] = next(iter(by_norm[norm(name)]))
    unknown = sorted(({m["home_raw"] for m in sec} | {m["away_raw"] for m in sec}) - set(resolved))
    if unknown and strict:
        sys.exit(f"{clubs.league}: nomes sem clube ({sec[0]['source']}): {unknown}")
    if unknown:
        sec[:] = [m for m in sec if m["home_raw"] in resolved and m["away_raw"] in resolved]
    for m in sec:
        for side in ("home", "away"):
            raw = m[f"{side}_raw"]
            m[side] = per_season.get((m["season"], raw), resolved[raw])
            if strict:  # grafias do RSSSF trazem marcas de nota (*, (1)): não viram apelido
                clubs.add_alias(m[side], raw)
    bad = defaultdict(set)
    for m in sec:
        bad[(m["season"], m["home"])].add(m["home_raw"])
    for (season, slug), names in bad.items():
        if len(names) > 1 and strict:
            sys.exit(f"{clubs.league} {season}: {sorted(names)} viraram o mesmo clube {slug} ({sec[0]['source']})")


# ---------------------------------------------------------------- conferência


def suspicious_dates(rows):
    """Datas do engsoccerdata que não podem estar certas: mais jogos no dia
    do que cabem numa rodada, ou time jogando duas vezes no mesmo dia."""
    out = set()
    by = defaultdict(list)
    for r in rows:
        by[r["season"]].append(r)
    for season, rs in by.items():
        teams = {r["home"] for r in rs} | {r["away"] for r in rs}
        per_day = Counter(r["date"] for r in rs)
        days = sorted(per_day)
        lonely = set()  # data sem nenhum outro dia de jogo a menos de 3 semanas
        for i, d in enumerate(days):
            before = (d - days[i - 1]).days if i else 999
            after = (days[i + 1] - d).days if i + 1 < len(days) else 999
            if min(before, after) > 21:
                lonely.add(d)
        twice = Counter((r["date"], t) for r in rs for t in (r["home"], r["away"]))
        for r in rs:
            if (per_day[r["date"]] > len(teams) // 2 or r["date"] in lonely or twice[(r["date"], r["home"])] > 1
                    or twice[(r["date"], r["away"])] > 1 or not in_season(r["date"], season)):
                out.add(id(r))
    return out


def crosscheck(rows, sec, sus, stats, notes, whole_seasons=True):
    """Casa os jogos de `sec` com `rows` (mesmo mandante e visitante na
    temporada, data mais próxima). Corrige datas suspeitas, completa rodadas e
    acrescenta o que falta. Devolve as divergências de placar."""
    src = sec[0]["source"] if sec else ""
    by_pair = defaultdict(list)
    for r in rows:
        by_pair[(r["season"], r["home"], r["away"])].append(r)
    covered = {m["season"] for m in sec}
    used = set()
    diffs = []
    added = []
    have = {r["season"] for r in rows}
    for m in sorted(sec, key=lambda m: m["date"] or date.min):
        cands = [r for r in by_pair[(m["season"], m["home"], m["away"])] if id(r) not in used]
        if not cands and m["date"] is None:
            stats[(m["season"], src)]["nodate"] += 1
            notes.append(f"{label(m['season'])} {m['home']} x {m['away']} {m['hg']}-{m['ag']}: só no {src}, "
                         "sem data; fica de fora")
            continue
        if not cands:
            # mando trocado no principal: B x A repetido na temporada, placar invertido, mesma data
            rev = [r for r in by_pair[(m["season"], m["away"], m["home"])] if id(r) not in used]
            hit = next((r for r in rev if len(by_pair[(m["season"], m["away"], m["home"])]) > 1
                        and (r["ag"], r["hg"]) == (m["hg"], m["ag"])
                        and abs((r["date"] - m["date"]).days) <= 3), None)
            if hit is not None:
                by_pair[(m["season"], m["away"], m["home"])].remove(hit)
                hit["home"], hit["away"], hit["hg"], hit["ag"] = m["home"], m["away"], m["hg"], m["ag"]
                by_pair[(m["season"], m["home"], m["away"])].append(hit)
                used.add(id(hit))
                hit.setdefault("seen", []).append(src)
                stats[(m["season"], src)]["matched"] += 1
                notes.append(f"{label(m['season'])} {hit['date']} {m['home']} x {m['away']}: mando corrigido ({src})")
                continue
            if (whole_seasons or m["season"] in have) and m.get("status") != "sem placar de campo":
                added.append(m)
            continue
        r = min(cands, key=lambda r: (id(r) in sus, abs((r["date"] - m["date"]).days) if m["date"] else 0))
        used.add(id(r))
        st = stats[(m["season"], src)]
        st["matched"] += 1
        if (r["hg"], r["ag"]) != (m["hg"], m["ag"]):
            diffs.append((r, m))
        if m["date"] is not None and r["date"] == m["date"]:
            sus.discard(id(r))  # outra fonte confirma a data
        if m["date"] is not None and r["date"] != m["date"]:
            if id(r) in sus and in_season(m["date"], m["season"]):
                notes.append(f"{label(r['season'])} {r['home']} x {r['away']}: data {r['date']} -> {m['date']} ({src})")
                r["date"] = m["date"]
                sus.discard(id(r))
                st["date_fixed"] += 1
            else:
                st["date_diff"] += 1
                r.setdefault("date_diffs", []).append((src, m["date"]))
        if not r["round"] and m["round"]:
            r["round"] = m["round"]
        if m.get("status") and not r.get("status"):
            r["status"], r["note"] = m["status"], m.get("note", "")
        r.setdefault("seen", []).append(src)
    for m in added:
        stats[(m["season"], src)]["added"] += 1
        rows.append({**m, "stage": "", "seen": []})
    for r in rows:
        if r["season"] in covered and id(r) not in used and r["source"] != src and src not in r.get("seen", []):
            stats[(r["season"], src)]["missing"] += 1
    return diffs


def table(rows):
    """time -> (J V E D GP GC, J + casa V E D GP GC + fora V E D GP GC)."""
    t = defaultdict(lambda: [0] * 11)
    for r in rows:
        for team, gf, ga, o in ((r["home"], r["hg"], r["ag"], 1), (r["away"], r["ag"], r["hg"], 6)):
            x = t[team]
            x[0] += 1
            x[o + (0 if gf > ga else 1 if gf == ga else 2)] += 1
            x[o + 3] += gf
            x[o + 4] += ga
    out = {}
    for team, x in t.items():
        total = [x[0]] + [x[1 + i] + x[6 + i] for i in range(5)]
        out[team] = (total, x)
    return out


def is_subseq(needle, hay):
    it = iter(hay)
    return all(any(h == n for h in it) for n in needle)


def rsssf_blocks(league):
    """temporada -> texto da página do RSSSF com a tabela final."""
    d = RAW / "rsssf"
    text = lambda p: re.sub(r"<[^>]+>", " ", p.read_text(encoding="latin-1"))
    out = {}
    pre = {"serie-a": "ital", "bundesliga": "duit", "premier-league": "eng", "la-liga": "span", "ligue-1": "fran"}[league]
    for p in d.glob(f"{pre}*.html"):
        m = re.fullmatch(rf"{pre}(\d{{2}}|\d{{4}})\.html", p.name)
        if m:
            n = int(m[1])
            y = n - 1 if n > 1900 else (1900 + n if n > 25 else 2000 + n) - 1
            out[y] = text(p)
    if league == "la-liga":
        for p in d.glob("spanhist*.html"):
            parts = re.split(r"\n\s*Spain (\d{4})/\d{2,4}\s*\n", text(p))
            for i in range(1, len(parts), 2):
                out[int(parts[i])] = parts[i + 1]
    if league == "ligue-1":
        parts = re.split(r"\n\s*(\d{4})-\d{4}\s*\n", text(d / "franfullhist.html"))
        for i in range(1, len(parts), 2):
            out[int(parts[i])] = parts[i + 1]
    return out


def rsssf_lines(text):
    lines = [[int(x) for x in re.findall(r"\d+", ln)] for ln in text.splitlines()]
    return [ln for ln in lines if len(ln) >= 6]


def fits(row, lines):
    x, split = row
    return any(is_subseq(x, ln) or is_subseq(split, ln) for ln in lines)


def propose(rows, season, bad, blocks):
    """Placar de um jogo entre dois times divergentes que faz as duas linhas
    baterem com a tabela do RSSSF."""
    lines = rsssf_lines(blocks[season])
    rs = [r for r in rows if r["season"] == season]
    teams = {t for t, _ in bad}
    out = []
    for r in rs:
        if r["home"] not in teams or r["away"] not in teams:
            continue
        hits = []
        for hg in range(0, 11):
            for ag in range(0, 11):
                if (hg, ag) == (r["hg"], r["ag"]):
                    continue
                alt = [x for x in rs if x is not r] + [{**r, "hg": hg, "ag": ag}]
                t = table(alt)
                if fits(t[r["home"]], lines) and fits(t[r["away"]], lines):
                    hits.append((hg, ag))
        if len(hits) == 1:
            out.append((r, hits[0]))
    return out


def standings_check(rows, blocks):
    """Para cada temporada, quantos times batem com uma linha da tabela do RSSSF."""
    by = defaultdict(list)
    for r in rows:
        by[r["season"]].append(r)
    res = {}
    for season, rs in by.items():
        text = blocks.get(season)
        if text is None:
            continue
        lines = rsssf_lines(text)
        free = list(range(len(lines)))
        bad = []
        t = table(rs)
        for team, (x, split) in sorted(t.items()):
            hit = next((i for i in free if is_subseq(x, lines[i]) or is_subseq(split, lines[i])), None)
            if hit is None:
                bad.append((team, x))
            else:
                free.remove(hit)
        res[season] = (len(t), bad)
    return res


# ---------------------------------------------------------------- carga


def build(league, existing, blocks):
    cfg = LEAGUES[league]
    log, notes = [], []
    prim = load_engsoccer(cfg)
    clubs = Clubs(league, prim, existing)
    for r in prim:
        r["home"], r["away"] = clubs.slug_of[r["home_raw"]], clubs.slug_of[r["away_raw"]]
    excluded = [r for r in prim if r["season"] in NO_DATES.get(league, ())]
    rows = [r for r in prim if r["season"] not in NO_DATES.get(league, ())]
    sus = suspicious_dates(rows)
    stats = defaultdict(Counter)
    all_diffs = []
    secs = []
    for loader in (load_fcsv, load_rsssf_ita, load_rsssf_fra, load_of, load_fd):
        sec = loader(cfg)
        if not sec:
            continue
        rsssf = loader in (load_rsssf_ita, load_rsssf_fra)
        if loader is load_rsssf_fra:
            sec, bad = map_crosstable(sec, rows, clubs)
            if bad:
                log.append("RSSSF (cruzamento) ignorado em " + ", ".join(label(s) for s in bad)
                           + ": menos de 80% dos placares batem, nomes não casaram")
        else:
            map_names(sec, rows, clubs, existing, log, strict=not rsssf)
        secs.append(sec)
        all_diffs += [(r, m) for r, m in crosscheck(rows, sec, sus, stats, notes, whole_seasons=not rsssf)]
    # Jogo do engsoccerdata com data impossível que nenhuma fonte tem e cujo
    # confronto aparece duas vezes na temporada: é cópia de outra temporada.
    pairs = Counter((r["season"], r["home"], r["away"]) for r in rows)
    games = Counter((r["season"], t) for r in rows for t in (r["home"], r["away"]))
    dropped = [r for r in rows if id(r) in sus and not r.get("seen") and r["source"] == SRC_ES
               and (pairs[(r["season"], r["home"], r["away"])] > 1
                    or min(games[(r["season"], r["home"])], games[(r["season"], r["away"])]) < 3)]
    for r in dropped:
        notes.append(f"{label(r['season'])} {r['date']} {r['home']} x {r['away']} {r['hg']}-{r['ag']}: "
                     "removido (data impossível, confronto repetido ou time de outra temporada, não está em outra fonte)")
        sus.discard(id(r))
    rows[:] = [r for r in rows if not any(r is d for d in dropped)]
    # Desempates (spareggi, playoffs de vaga): em temporada de turno e
    # returno, o 3º encontro de um par em diante sai. O engsoccerdata traz
    # alguns e não outros; ficam todos de fora para a liga ser só o
    # campeonato de pontos corridos.
    by_season = defaultdict(list)
    for r in rows:
        by_season[r["season"]].append(r)
    extra = []
    for season, rs in by_season.items():
        if any(r.get("stage") for r in rs):
            continue
        teams = {r["home"] for r in rs} | {r["away"] for r in rs}
        games = Counter(t for r in rs for t in (r["home"], r["away"]))
        base = 2 * (len(teams) - 1)
        if sum(1 for t in teams if games[t] == base) < len(teams) / 2:
            continue
        meet = defaultdict(list)
        for r in sorted(rs, key=lambda r: r["date"]):
            meet[frozenset((r["home"], r["away"]))].append(r)
        for lst in meet.values():
            extra += lst[2:]
        # playoff contra time de fora da liga (só aparece em um ou dois jogos)
        extra += [r for r in rs if min(games[r["home"]], games[r["away"]]) <= 2 and r not in extra]
    for r in extra:
        notes.append(f"{label(r['season'])} {r['date']} {r['home']} x {r['away']} {r['hg']}-{r['ag']}: "
                     f"removido (jogo de desempate, fora do turno e returno; {r['source']})")
    rows[:] = [r for r in rows if not any(r is x for x in extra)]
    # Placar divergente. Ordem: correção manual (FIXES); a versão com que a
    # tabela final do RSSSF bate; as outras fontes, quando concordam entre si e
    # nenhuma confirma o engsoccerdata. Ida e volta trocadas (A x B de uma
    # fonte = B x A da outra) não contam: só muda o mando.
    by_row = defaultdict(list)
    for r, m in all_diffs:
        by_row[id(r)].append((r, m))
    score_notes = []
    lines_of = {}
    by_pair = {(r["season"], r["home"], r["away"]): r for r in rows}
    for lst in by_row.values():
        r = lst[0][0]
        old = (r["hg"], r["ag"])
        alts = {(m["hg"], m["ag"]) for _, m in lst}
        tag = f"{label(r['season'])} {r['date']} {r['home']} x {r['away']}: "
        srcs = "; ".join(f"{m['source']} {m['hg']}-{m['ag']}" for _, m in lst)
        back = by_pair.get((r["season"], r["away"], r["home"]))
        if back is not None and alts == {(back["ag"], back["hg"])}:
            score_notes.append(tag + f"mantido {old[0]}-{old[1]} (outra fonte troca o mando com a volta); {srcs}")
            continue
        choice, why = None, ""
        season_text = blocks.get(r["season"])
        if season_text is not None:
            lines = lines_of.setdefault(r["season"], rsssf_lines(season_text))
            rs = [x for x in rows if x["season"] == r["season"] and x is not r]
            fit = []
            for v in [old, *sorted(alts)]:
                t = table(rs + [{**r, "hg": v[0], "ag": v[1]}])
                if fits(t[r["home"]], lines) and fits(t[r["away"]], lines):
                    fit.append(v)
            if len(fit) == 1:
                choice, why = fit[0], "tabela do RSSSF"
        if choice is None:
            agree = len(r.get("seen", [])) - len(lst)
            choice, why = (next(iter(alts)), "outras fontes") if len(alts) == 1 and agree == 0 else (old, "")
        if choice != old:
            r["hg"], r["ag"] = choice
            score_notes.append(tag + f"{old[0]}-{old[1]} -> {choice[0]}-{choice[1]} ({why}); {srcs}")
        else:
            score_notes.append(tag + f"mantido {old[0]}-{old[1]}" + (f" ({why})" if why else "") + f"; {srcs}")
    for (season, home, away), fix in FIXES.get(league, {}).items():
        hit = [r for r in rows if (r["season"], r["home"], r["away"]) == (season, home, away)]
        if len(hit) != 1:
            sys.exit(f"{league}: correção manual sem jogo único: {season} {home} x {away}")
        r = hit[0]
        tag = f"{label(season)} {r['date']} {home} x {away} {r['hg']}-{r['ag']}: "
        if fix.get("drop"):
            rows.remove(r)
            score_notes.append(tag + f"removido ({fix['note']})")
            continue
        if "score" in fix:
            r["hg"], r["ag"] = fix["score"]
        if "date" in fix:
            r["date"] = date.fromisoformat(fix["date"])
            sus.discard(id(r))
        r["status"], r["note"] = fix.get("status", ""), fix["note"]
        score_notes.append(tag + f"correção manual -> {r['hg']}-{r['ag']} {r['date']} ({fix['note']})")
    still = [r for r in rows if id(r) in sus]
    for r in still:
        r["note"] = (r.get("note", "") + "; " if r.get("note") else "") + "data incerta (engsoccerdata, sem outra fonte)"
    return dict(rows=rows, clubs=clubs, stats=stats, notes=notes, score_notes=score_notes,
                still_sus=still, excluded=excluded, log=log)


def write(league, res, existing):
    rows = res["rows"]
    out = []
    for r in sorted(rows, key=lambda r: (r["date"], r["home"])):
        out.append(dict(league=league, season=r["season"], date=r["date"].isoformat(), stage=r.get("stage", ""),
                        round=r["round"], home=r["home"], away=r["away"], home_goals=r["hg"],
                        away_goals=r["ag"], extra_time="", pens_home="", pens_away="", neutral="",
                        status=r.get("status", ""), note=r.get("note", ""), source=r["source"]))
    with (OUT / f"{league}.csv").open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=FIELDS)
        w.writeheader()
        w.writerows(out)
    return out


def report(league, res, out, checks):
    cfg = LEAGUES[league]
    seasons = Counter(r["season"] for r in out)
    st = res["stats"]
    L = [f"# {cfg['name']}: relatório da carga", "",
         "Gerado por `scripts/ingest_europe.py`. Não editar à mão: rode o script de novo.", "",
         f"- {len(out)} jogos de {label(min(seasons))} a {label(max(seasons))}; temporada = ano de início.",
         f"- Fonte principal: engsoccerdata até 2024-25; depois openfootball. Conferência jogo a jogo com "
         f"footballcsv, openfootball e football-data.co.uk onde existem, e tabela final do RSSSF.",
         ]
    if res["excluded"]:
        ex = Counter(r["season"] for r in res["excluded"])
        L.append(f"- Fora: {', '.join(label(s) for s in sorted(ex))} ({sum(ex.values())} jogos): "
                 f"o engsoccerdata dá a mesma data para o campeonato inteiro e não há outra fonte com datas.")
    L.append(f"- {len(res['still_sus'])} jogos com data suspeita sem outra fonte para corrigir (ver abaixo).")
    L += ["", "## Jogos por temporada", "",
          "Colunas das fontes: jogos casados / divergências de data / jogos que só a fonte tinha (acrescentados). "
          "RSSSF: times cuja linha (J V E D GP GC) bate com a tabela final.", "",
          "| Temporada | Jogos | footballcsv | RSSSF (jogos) | openfootball | football-data | RSSSF (tabela) |", "|---|---|---|---|---|---|---|"]
    for s in sorted(seasons):
        cells = []
        for src in (SRC_FCSV, SRC_RSSSF, SRC_OF, SRC_FD):
            x = st.get((s, src))
            cells.append(f"{x['matched']} / {x['date_diff']} / {x['added']}" if x else "–")
        c = checks.get(s)
        cells.append("–" if c is None else f"{c[0] - len(c[1])}/{c[0]}")
        L.append(f"| {label(s)} | {seasons[s]} | " + " | ".join(cells) + " |")
    bad = {s: c for s, c in checks.items() if c[1]}
    if bad:
        L += ["", "## Tabela final diferente do RSSSF", "",
              "Times cuja campanha (J V E D GP GC) não aparece na tabela do RSSSF. Os casos conferidos são "
              "resultados do tribunal (a tabela usa o placar do tribunal; aqui vale o de campo), erro de "
              "digitação na página do RSSSF ou temporada com mais de uma fase. Onde um placar só faria a "
              "tabela bater, ele aparece abaixo, para conferência.", ""]
        for s, (_, b) in sorted(bad.items()):
            L.append(f"- {label(s)}: " + "; ".join(f"{t} {x[0]}" for t, x in b))
            for r, (hg, ag) in res["proposals"].get(s, []):
                L.append(f"  - a tabela bate se {r['date']} {r['home']} x {r['away']} ({r['hg']}-{r['ag']}) for {hg}-{ag}")
    if res["score_notes"]:
        L += ["", "## Placares divergentes", ""] + [f"- {n}" for n in res["score_notes"]]
    if res["notes"]:
        L += ["", "## Datas corrigidas", ""] + [f"- {n}" for n in res["notes"]]
    if res["still_sus"]:
        L += ["", "## Datas suspeitas mantidas", ""]
        L += [f"- {label(r['season'])} {r['date']} {r['home']} x {r['away']}" for r in sorted(res["still_sus"], key=lambda r: r["date"])]
    if res["log"]:
        L += ["", "## Clubes", ""] + [f"- {n}" for n in res["log"]]
    (OUT / f"{league}-relatorio.md").write_text("\n".join(L) + "\n", encoding="utf-8")


def main():
    wanted = sys.argv[1:] or list(LEAGUES)
    clubs_path = ROOT / "data" / "clubs.json"
    for league in wanted:
        existing = json.loads(clubs_path.read_text(encoding="utf-8"))
        blocks = rsssf_blocks(league)
        res = build(league, existing, blocks)
        out = write(league, res, existing)
        checks = standings_check(res["rows"], blocks)
        res["proposals"] = {y: propose(res["rows"], y, b, blocks) for y, (_, b) in checks.items() if b}
        report(league, res, out, checks)
        # cadastro: substitui só os clubes desta liga, mantém o resto como está
        existing = json.loads(clubs_path.read_text(encoding="utf-8"))
        mine = res["clubs"].entries
        used = {r["home"] for r in out} | {r["away"] for r in out}
        merged = [c for c in existing if c["slug"] not in mine]
        merged += [e for s, e in mine.items() if s in used]
        merged.sort(key=lambda c: c["slug"])
        clubs_path.write_text("[\n" + ",\n".join("  " + json.dumps(c, ensure_ascii=False) for c in merged) + "\n]\n",
                              encoding="utf-8")
        lp = ROOT / "data" / "leagues.json"
        leagues = json.loads(lp.read_text(encoding="utf-8"))
        entry = {"slug": league, "name": LEAGUES[league]["name"], "short": LEAGUES[league]["short"],
                 "country": COUNTRY[league][0], "flag": LEAGUES[league]["flag"],
                 "since": min(r["season"] for r in out)}
        old = next((lg for lg in leagues if lg["slug"] == league), {})
        entry = {**old, **entry, "split": True, "fem": True}  # temporada 2024/25; "da Premier League"
        leagues = [entry if lg["slug"] == league else lg for lg in leagues] if old else leagues + [entry]
        lp.write_text("[\n" + ",\n".join("  " + json.dumps(lg, ensure_ascii=False) for lg in leagues) + "\n]\n",
                      encoding="utf-8")
        bad = sum(1 for c in checks.values() if c[1])
        print(f"{league}: {len(out)} jogos, {len(set(r['season'] for r in out))} temporadas, "
              f"{len(res['score_notes'])} placares divergentes, {len(res['notes'])} datas corrigidas, "
              f"{len(res['still_sus'])} datas suspeitas, RSSSF diferente em {bad} temporadas")


if __name__ == "__main__":
    main()
