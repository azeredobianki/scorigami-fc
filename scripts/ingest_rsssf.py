"""Gera data/matches/brasileirao-historico.csv a partir das páginas do RSSSF Brasil.

Uso: python3 scripts/ingest_rsssf.py [--names]

Fontes (salvas em data/raw/rsssf/):
  cbr1959..cbr1968  Taça Brasil
  rgp1967..rgp1970  Torneio Roberto Gomes Pedrosa (Robertão)
  br1971..br2002    Campeonato Brasileiro

As páginas são texto pré-formatado com convenções que mudam ao longo dos anos.
Só entram jogos com data e placar de campo conhecidos. O placar inclui a
prorrogação; pênaltis ficam em pens_home/pens_away. Jogos decididos por W.O.,
abandonados ou sem data ficam de fora e vão para o relatório, junto com a
conferência da contagem por temporada contra data/raw/crosscheck-rodrigoazs/.

--names lista os nomes de clubes encontrados que ainda não estão em clubs.json.
"""

import csv
import html
import json
import re
import sys
from collections import Counter, defaultdict
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "data" / "raw" / "rsssf"
CROSS = ROOT / "data" / "raw" / "crosscheck-rodrigoazs"
OUT = ROOT / "data" / "matches" / "brasileirao-historico.csv"
REPORT = ROOT / "data" / "matches" / "brasileirao-historico-relatorio.md"

FIELDS = [
    "league", "season", "date", "stage", "round", "home", "away",
    "home_goals", "away_goals", "extra_time", "pens_home", "pens_away",
    "neutral", "status", "note", "source",
]

MONTHS = {m: i + 1 for i, m in enumerate(
    "jan feb mar apr may jun jul aug sep oct nov dec".split())}
MONTHS.update({"fev": 2, "abr": 4, "mai": 5, "ago": 8, "set": 9, "out": 10, "dez": 12})

MON = r"(?:[A-Z][a-z]{2})\.?"
DATE_ITEM = rf"(?:{MON}\s*)?\d{{1,2}}(?:/\d{{2,4}})?"
DATE_BRACKET = re.compile(
    rf"\[\s*({MON}\s*\d{{1,2}}(?:/\d{{2,4}})?(?:\s*(?:,|and|&|e|-)\s*{DATE_ITEM})*)\s*\]")
SCORE = r"\d+\s*-\s*\d+"
SPECIAL = r"awd|dns|abd|w\.?o\.?|wo-\d|\d-wo"
MATCH = re.compile(
    rf"^(?P<h>[^\[\(\d\s][^\[\]]*?)\s+(?P<s1>{SCORE}|{SPECIAL})"
    rf"(?:\s+(?P<s2>{SCORE}|{SPECIAL}))?\s+(?P<a>[^\[\(\s\d][^\[\]\(]*?)\s*(?P<rest>[\[\(].*)?$",
    re.I)
MATCH_X = re.compile(
    r"^(?P<h>[^\d\[\(].*?)\s+(?P<hg>\d+)\s*x\s*(?P<ag>\d+)\s+(?P<a>[^\d\[\(][^\[\(]*?)\s*(?P<rest>[\[\(].*)?$")
RGP_DATE = re.compile(r"^(\d{1,2})\.(\d{1,2})\.(\d{4})$")
TABLE_ROW = re.compile(r"^\s*\d+\s*[\.\-º°]")
HEADING = re.compile(
    r"\b(phase|stage|group|finals?|semi-?finals?|quarter-?finals?|eighth-?finals?|playoffs?|"
    r"play-offs?|zone|module|decision|tie-?br[ea]+king|repescagem|fase|grupo|turno|"
    r"third place|extra match|torneio|knockout|quadrangular|triangular|hexagonal|"
    r"round of \d+|second round|first round|1[ªa]|2[ªa]|3[ªa])\b", re.I)
NOT_HEADING = re.compile(
    r"^\*|[,;.()\[\]]|\b(table|classification|qualified|teams|champions?|byes?)\b", re.I)

# Partes das páginas que não são da disputa principal. A chave é o cabeçalho em
# que a seção começa; o valor é o rótulo que vai em stage, ou None para pular.
SECTIONS = {
    # Copa União 1987: Módulos Verde e Amarelo e o cruzamento final (Sport e
    # Guarani) contam para o título reconhecido pela CBF. Azul e Branco não.
    1987: {"I COPA UNIÃO/GREEN MODULE (Taça João Havelange)": "Módulo Verde",
           "Yellow Module (Taça Roberto Gomes Pedrosa)": "Módulo Amarelo",
           "Brazilian Championship 1987 - White Module (Taça Rubens Moreira)": None,
           "Brazilian Championship 1987 - Blue Module (Taça Heleno Nunes)": None},
    # Copa Brasil 1986: o Torneio Paralelo (Grupos E-H) era o segundo nível e só
    # classificava para a segunda fase. Volta a valer em "Second Phase".
    1986: {"Chave 2 - Parallel Tournament (Second Level)": None, "Second Phase": ""},
    # Seletiva para a Libertadores 2000, disputada depois do campeonato.
    1999: {"Qualification Copa Libertadores 2000:": None},
    # Copa João Havelange: Módulo Azul (elite) e a fase final, que reuniu
    # clubes de todos os módulos. Módulos Amarelo, Verde e Branco ficam de fora.
    2000: {"Blue Module": "Módulo Azul", "Yellow Module": None, "Green Module": None,
           "White Module": None, "Green and White Module Playoffs": None,
           "Championship Eighthfinals": "Fase final"},
}
COMPETITION = {"cbr": "Taça Brasil", "rgp": "Robertão", "br": ""}

# Jogos cuja data falta na página mas é conhecida com segurança.
OVERRIDES = [
    # Final de 1980, 2º jogo no Maracanã: a página só traz a data do 1º.
    dict(season=1980, date=date(1980, 6, 1), stage="Final", round="", home="Flamengo-RJ",
         away="Atlético-MG", home_goals=3, away_goals=2, extra_time="", pens_home="",
         pens_away="", status="", note="data do 2º jogo da final completada (não consta na página)",
         file="br1980.htm"),
]


def pages():
    for y in range(1959, 1969):
        yield y, "cbr", RAW / f"cbr{y}.htm"
    for y in range(1967, 1971):
        yield y, "rgp", RAW / f"rgp{y}.htm"
    for y in range(1971, 2003):
        yield y, "br", RAW / f"br{y}.htm"


def text_lines(path):
    t = path.read_bytes().decode("cp1252", errors="replace")
    t = re.sub(r"(?is)<script.*?</script>", "", t)
    t = re.sub(r"<[^>]+>", "", t)
    t = html.unescape(t).replace("\xa0", " ").replace("\t", "        ")
    return t.splitlines()


def parse_dates(spec):
    """'Aug 23 and 30' -> [(8, 23, None), (8, 30, None)]; 'Mar 3/60' -> [(3, 3, 1960)]."""
    out, mon = [], None
    for item in re.split(r"\s*(?:,|and|&|\be\b|-)\s*", spec.strip()):
        m = re.match(r"(?:([A-Za-z]{3})\.?\s*)?(\d{1,2})(?:/(\d{2,4}))?$", item.strip())
        if not m:
            return []
        if m.group(1):
            mon = MONTHS.get(m.group(1).lower())
        if mon is None:
            return []
        y = m.group(3)
        if y is not None:
            y = int(y)
            y = y + 1900 if y < 100 else y
        out.append((mon, int(m.group(2)), y))
    # "[Jan 31 and Feb 4/87]": o ano escrito vale para as outras datas do colchete.
    known = [(mo, y) for mo, _, y in out if y]
    if known:
        km, ky = known[-1]
        out = [(mo, d, y or (ky if mo <= km else ky - 1)) for mo, d, y in out]
    return out


class Calendar:
    """Converte (mês, dia) em data. O RSSSF escreve o ano ("[Mar 3/60]") quando
    o jogo não é no ano da temporada; sem ano, vale o da temporada."""

    def __init__(self, season):
        self.season = season
        self.last = None

    def resolve(self, mon, day, year=None):
        try:
            self.last = date(year or self.season, mon, day)
        except ValueError:
            return None
        return self.last


def norm_name(n):
    return re.sub(r"\s+", " ", n.strip().rstrip("*]").strip())


def plausible_team(n):
    """Descarta frases em prosa que por acaso têm um placar no meio."""
    return (len(n) <= 32 and len(n.split()) <= 4 and n[:1].isupper()
            and not re.search(r"\b(the|and|but|in|of|was|were|match)\b", n))


def parse_notes(rest):
    """Extrai prorrogação, pênaltis e demais observações de '[aet 1-0, pen 4-3]'."""
    info = {"aet": None, "pen": None, "date": None, "legs": None, "flags": set(), "text": "",
            "original": None}
    if not rest:
        return info
    body = re.sub(r"\s+", " ", " ".join(re.findall(r"[\[\(]([^\]\)]*)[\]\)]?", rest))).strip()
    info["text"] = body
    m = DATE_BRACKET.search(rest)
    if m:
        ds = parse_dates(m.group(1))
        if len(ds) == 1:
            info["date"] = ds[0]
        elif len(ds) == 2:
            info["legs"] = ds
    m = re.search(r"\baet\b:?\s*(\d+)\s*-\s*(\d+)", body, re.I)
    if m:
        info["aet"] = (int(m.group(1)), int(m.group(2)))
    elif re.search(r"\baet\b", body, re.I):
        info["aet"] = (0, 0)
    m = re.search(r"\bpen(?:alties|s)?\.?\s*(\d+)\s*-\s*(\d+)", body, re.I)
    if m:
        info["pen"] = (int(m.group(1)), int(m.group(2)))
    low = body.lower()
    if "abandon" in low or re.search(r"\bat \d+'", low):
        info["flags"].add("result stood" if "result stood" in low else "abandoned")
    if "awarded" in low:
        info["flags"].add("awarded")
    if "?" in body:
        info["flags"].add("doubtful")
    m = re.search(r"or[a-z]*nal+y\s+(\d+)\s*-\s*(\d+)", low)
    if m:
        info["original"] = (int(m.group(1)), int(m.group(2)))
    if re.search(r"played (?:in|at)\b", low):
        info["flags"].add("venue")
    return info


STAGE_PT = [
    (r"\b1st stage\b|\bfirst stage\b", "1ª etapa"), (r"\b2nd stage\b|\bsecond stage\b", "2ª etapa"),
    (r"\bfirst phase\b|\b1ª fase\b", "1ª fase"), (r"\bsecond phase\b", "2ª fase"),
    (r"\bthird phase\b", "3ª fase"), (r"\bfourth phase\b", "4ª fase"),
    (r"\bfirst round\b", "1ª fase"), (r"\bsecond round\b", "2ª fase"),
    (r"\bsemifinal phase\b", "Fase semifinal"), (r"\bfinal phase\b", "Fase final"),
    (r"\bquadrangular final\b", "Quadrangular final"),
    (r"\beighthfinals\b|\b1/8 finals\b|\bround of 16\b", "Oitavas de final"),
    (r"\bquarter-?finals?\b", "Quartas de final"), (r"\bsemi-?finals?\b", "Semifinal"),
    (r"\bfinal match\b|\bfinal playoff\b|\bfinals?\b", "Final"),
    (r"\bgroups ([a-z0-9]) and ([a-z0-9])\b", "Grupos \\1 e \\2"), (r"\bgroup\b", "Grupo"),
    (r"\bplayoff\b", "Desempate"), (r"\bqualifying\b", "Classificatório"),
    (r"\bknockout\b", "Mata-mata"), (r"\boverall record\b", "Classificação geral"),
    (r"\bnorthern zone decision\b", "Final da Zona Norte"),
    (r"\bsouthern zone decision\b", "Final da Zona Sul"),
    (r"\bnorthern zone\b", "Zona Norte"), (r"\bsouthern zone\b", "Zona Sul"),
    (r"\btie-?br[ea]+king match for (first|second) place in\b", "Desempate"),
]


def stage_pt(stage):
    """Traduz os nomes de fase do RSSSF (em inglês) para o site."""
    out = []
    for part in stage.split(" - "):
        p = part
        for pat, sub in STAGE_PT:
            p = re.sub(pat, sub, p, flags=re.I)
        out.append(p[:1].upper() + p[1:])
    return " - ".join(out)


def join_stage(*parts):
    return " - ".join(x for x in parts if x)


class Page:
    def __init__(self, season, kind, path):
        self.season, self.kind, self.path = season, kind, path
        self.cal = Calendar(season)
        self.rows, self.excluded = [], []
        self.label = COMPETITION[kind]
        self.phase = self.group = self.rnd = ""
        self.ctx = []                 # datas do último cabeçalho [..]
        self.leg_ctx = None           # "(1st leg Nov 27,28; 2nd leg Nov 30, Dec 1)"
        self.after_date = False       # linha anterior era um cabeçalho de data
        self.ctx_pairs = Counter()    # confrontos já vistos sob esse cabeçalho

    def set_ctx(self, dates, legs=None):
        self.ctx, self.ctx_pairs, self.leg_ctx = dates, Counter(), legs

    def parse(self):
        lines = text_lines(self.path)
        sections = SECTIONS.get(self.season, {})
        rgp_date = None
        i = 0
        while i < len(lines):
            line = lines[i].strip()
            i += 1
            if not line:
                continue
            if line.startswith("About this document"):
                break
            if line in sections:
                self.label = sections[line]
                self.phase = "Eighthfinals" if self.label == "Fase final" else ""
                self.group = self.rnd = ""
                self.set_ctx([])
                if self.label == "":
                    self.heading(line)
                continue
            if self.label is None:
                continue

            # Data no estilo do Robertão: 05.03.1967
            m = RGP_DATE.match(line)
            if m:
                rgp_date = date(int(m.group(3)), int(m.group(2)), int(m.group(1)))
                self.cal.last = rgp_date
                continue
            if TABLE_ROW.match(line):
                continue

            after_date, self.after_date = self.after_date, False
            if line.endswith("]") and "[" not in line:
                line = line[:-1].rstrip()
            mm = MATCH.match(line)
            if mm:
                rest = mm.group("rest") or ""
                # Nota que continua nas linhas seguintes, alinhada na mesma coluna.
                # O que vier à esquerda dessa coluna é outra linha do texto.
                if rest.count("[") > rest.count("]"):
                    col = lines[i - 1].find("[", len(lines[i - 1]) - len(lines[i - 1].lstrip()) + mm.start("rest"))
                    j = i
                    while rest.count("[") > rest.count("]") and j < len(lines) and j < i + 8:
                        nxt = lines[j]
                        if col > 0 and len(nxt) > col and nxt[:col].strip():
                            rest += " " + nxt[col:].strip()
                            lines[j] = nxt[:col]
                        else:
                            rest += " " + nxt.strip()
                            lines[j] = ""
                        j += 1
                if self.kind != "rgp" or not MATCH_X.match(line):
                    self.emit_dash(mm, rest, after_date)
                    continue

            if self.kind == "rgp":
                mx = MATCH_X.match(line)
                if mx:
                    h, a = norm_name(mx.group("h")), norm_name(mx.group("a"))
                    info = parse_notes(mx.group("rest"))
                    if "abandoned" in info["flags"]:
                        self.skip("abandonado: " + info["text"], h, a, rgp_date, line)
                    else:
                        self.add(rgp_date, False, h, a, int(mx.group("hg")), int(mx.group("ag")))
                    continue

            # Cabeçalho de data, com ou sem "Round N"
            db = DATE_BRACKET.search(line)
            rm = re.match(r"^(?:Round|Rodada)\s+(\d+)", line, re.I)
            if rm:
                self.rnd = rm.group(1)
                self.set_ctx([])
            if db and (line.startswith("[") or rm or len(line) < 50):
                self.set_ctx(parse_dates(db.group(1)))
                self.after_date = True
                head = line[:db.start()].strip()
                if head and not rm and HEADING.search(head) and not re.search(r"\bleg\b", head, re.I):
                    self.heading(head)
                    self.set_ctx(parse_dates(db.group(1)))
                continue
            if rm or line.startswith("["):
                continue

            if "(1st leg" in line and HEADING.search(line):
                self.heading(line)
                continue
            if (len(line) < 60 and len(line.split()) <= 7 and HEADING.search(line)
                    and not NOT_HEADING.search(line.rstrip(":")) and not re.search(r"\d+-\d+", line)):
                if re.search(r"\bleg\b", line, re.I):
                    continue
                self.heading(line.rstrip(":"))
        return self

    def heading(self, text):
        legs = None
        m = re.search(r"\(1st leg ([^;]+); 2nd leg ([^)]+)\)", text)
        if m:
            legs = [parse_dates(m.group(1)), parse_dates(m.group(2))]
            text = text[:m.start()].strip()
        if re.match(r"^(group|grupo|chave)\b", text, re.I):
            self.group = text
        else:
            self.phase, self.group = text, ""
        self.rnd = ""
        self.set_ctx([], legs if legs and all(legs) else None)

    def stage(self):
        return join_stage(self.label, self.phase, self.group)

    def add(self, d, approx, home, away, hg, ag, et="", ph="", pa="", status="", note=""):
        if d is None:
            return self.skip("sem data", home, away, score=(hg, ag))
        if approx:
            note = "; ".join(x for x in ("data aproximada (rodada em mais de um dia)", note) if x)
        self.rows.append(dict(season=self.season, date=d, stage=self.stage(), round=self.rnd,
                              home=home, away=away, home_goals=hg, away_goals=ag, extra_time=et,
                              pens_home=ph, pens_away=pa, status=status, note=note,
                              file=self.path.name))

    def skip(self, reason, home, away, d=None, raw="", score=None):
        self.excluded.append(dict(season=self.season, date=d, stage=self.stage(), home=home,
                                  away=away, reason=reason, raw=raw, score=score,
                                  file=self.path.name))

    def pick_date(self, info, leg, nlegs, pair):
        """Devolve (data, aproximada?)."""
        if nlegs == 1 and info.get("date"):
            return self.cal.resolve(*info["date"]), False
        if nlegs == 2 and info.get("legs"):
            return self.cal.resolve(*info["legs"][leg]), False
        if nlegs == 2 and self.leg_ctx:
            ds = self.leg_ctx[leg]
            return self.cal.resolve(*ds[0]), len(ds) > 1
        ctx = self.ctx
        if not ctx:
            return None, False
        if nlegs == 2:
            # Um só dia no cabeçalho de ida e volta: vale só para a ida.
            if len(ctx) < 2:
                return (self.cal.resolve(*ctx[0]), False) if leg == 0 else (None, False)
            return self.cal.resolve(*ctx[leg]), False
        # Um só placar sob cabeçalho com vários dias: se o mesmo confronto se
        # repete (ida e volta listadas em linhas separadas), avança a data.
        k = self.ctx_pairs[pair]
        self.ctx_pairs[pair] += 1
        if len(ctx) > 1 and k > 0 and k < len(ctx):
            return self.cal.resolve(*ctx[k]), False
        return self.cal.resolve(*ctx[0]), len(ctx) > 1

    def emit_dash(self, mm, rest, after_date=False):
        home, away = norm_name(mm.group("h")), norm_name(mm.group("a"))
        raw = mm.group(0).strip()
        if not (plausible_team(home) and plausible_team(away)):
            return
        # Linhas em maiúsculas repetem jogos na ficha técnica das finais, a não
        # ser quando vêm logo abaixo de uma data (único registro do jogo).
        if (self.kind != "rgp" and not after_date and home.isupper() and away.isupper()
                and max(len(home), len(away)) > 4):
            return
        s1, s2 = mm.group("s1"), mm.group("s2")
        info = parse_notes(rest)
        pair = frozenset((home, away))
        scores = [s1] + ([s2] if s2 else [])
        for k, s in enumerate(scores):
            last = k == len(scores) - 1
            d, approx = self.pick_date(info, k, len(scores), pair)
            h, a = (home, away) if k == 0 else (away, home)
            if not re.match(SCORE, s):
                orig = info["original"]
                if s.lower() == "awd" and orig and "abandoned" not in info["flags"] and len(scores) == 1:
                    self.add(d, approx, h, a, orig[0], orig[1], status="awarded",
                             note="placar de campo; resultado alterado no tribunal (" + info["text"] + ")")
                else:
                    self.skip(f"sem placar de campo ({s}): {info['text']}", h, a, d, raw)
                continue
            lg, rg = (int(x) for x in re.split(r"\s*-\s*", s))
            hg, ag = (lg, rg) if k == 0 else (rg, lg)
            if last and "abandoned" in info["flags"]:
                self.skip("abandonado: " + info["text"], h, a, d, raw)
                continue
            if last and "doubtful" in info["flags"]:
                self.skip("placar duvidoso: " + info["text"], h, a, d, raw)
                continue
            et = ph = pa = status = ""
            notes = []
            if last and "result stood" in info["flags"]:
                status = "abandoned"
                notes.append("jogo interrompido, placar mantido (" + info["text"] + ")")
            if last and info["aet"]:
                el, er = info["aet"]
                et = "1"
                hg, ag = (hg + el, ag + er) if k == 0 else (hg + er, ag + el)
            if last and info["pen"]:
                pl, pr = info["pen"]
                ph, pa = (pl, pr) if k == 0 else (pr, pl)
            if last and "awarded" in info["flags"]:
                status = "awarded"
                notes.append("placar de campo; resultado alterado no tribunal (" + info["text"] + ")")
            elif last and "venue" in info["flags"]:
                notes.append(info["text"])
            self.add(d, approx, h, a, hg, ag, et, ph, pa, status, "; ".join(notes))


# Nomes que na página significam clubes diferentes conforme o ano.
SEASON_ALIASES = {
    "Atlético": {y: "atletico-mg" for y in (1963, 1964, 1967, 1995)},
    "América": {1961: "america-rj", 1969: "america-rj", 1970: "america-rj", 1988: "america-rj",
                1993: "america-mg", 2001: "america-mg"},
    "America": {1997: "america-rn"},
    "Santa Cruz": {1961: "santa-cruz-se"},
    "Ferroviário": {1959: "ferroviario-ma", 1966: "ferroviario-pr", 1967: "ferroviario-pr"},
    "Olímpico": {1965: "olimpico-sc", 1968: "olimpico-am"},
    "Operário": {1968: "operario-mt", 1976: "operario-ms", 1977: "operario-ms"},
    # Campo Grande era Mato Grosso até 1979.
    "Comercial": {y: "comercial-ms" for y in (1973, 1975, 1983, 1986)},
    "Comercial-MT": {1978: "comercial-ms"},
    "XV de Novembro": {1977: "xv-piracicaba", 1978: "xv-piracicaba", 1982: "xv-jau"},
    "Auto Esporte": {1959: "auto-esporte-pb", 1984: "auto-esporte-pi"},
    # No Módulo Amarelo de 1987, "Internacional" é o de Limeira.
    "Internacional": {(1987, "Módulo Amarelo"): "internacional-limeira"},
}

# Datas de rodada claramente trocadas na página: (página, rodada, mês escrito, mês certo).
# 1999, rodada 11: "[Aug 18]" e "[Aug 19]" entre a 10ª (15/9) e a 12ª rodada;
# em 18/8 esses clubes jogaram a 5ª rodada.
DATE_FIXES = [("br1999.htm", "11", 8, 9)]

# Erros de digitação e anotações coladas ao nome na página.
FIXES = {
    "Brangantino": "Bragantino", "Payssandu": "Paysandu", "Corinthiians": "Corinthians",
    "Flumienense": "Fluminense", "Chapecoenses": "Chapecoense", "Inter": "Internacional",
    "Corinthians Pacaembu": "Corinthians",
}


def load_clubs():
    clubs = json.loads((ROOT / "data" / "clubs.json").read_text(encoding="utf-8"))
    alias = {}
    for c in clubs:
        for n in [c["name"], *c.get("aliases", [])]:
            alias[n.casefold()] = c["slug"]
    return clubs, alias


def resolve(alias, season, name, stage=""):
    """Slug do clube; nomes em maiúsculas (Robertão) valem sem diferenciar caixa."""
    name = FIXES.get(name, name)
    for key in (name, name.title()):
        by_year = SEASON_ALIASES.get(key, {})
        for k in ((season, stage.split(" - ")[0]), season):
            if k in by_year:
                return by_year[k]
    return alias.get(name.casefold())


def crosscheck(rows):
    """Compara a contagem de jogos por temporada com o dataset rodrigoazs."""
    out = {}
    for f in sorted(CROSS.glob("*.csv")):
        y = int(f.stem)
        with f.open(encoding="utf-8") as fh:
            ref = list(csv.DictReader(fh))
        mine = [r for r in rows if r["season"] == y]
        key = lambda d, h, a: (d, int(h), int(a))
        a = Counter(key(r["date"], r["home_goals"], r["away_goals"]) for r in mine)
        b = Counter(key(r["date"], r["home_score"], r["away_score"]) for r in ref)
        out[y] = (len(mine), len(ref), sum((a - b).values()), sum((b - a).values()))
    return out


def main():
    rows, excluded = [], []
    for season, kind, path in pages():
        p = Page(season, kind, path).parse()
        rows.extend(r for r in p.rows)
        excluded.extend(p.excluded)
    for o in OVERRIDES:
        rows.append(dict(o))
    for r in rows:
        for f, rnd, wrong, right in DATE_FIXES:
            if r["file"] == f and r["round"] == rnd and r["date"].month == wrong:
                r["date"] = r["date"].replace(month=right)
                r["note"] = "; ".join(x for x in (r["note"], "mês corrigido: a página traz agosto") if x)
    # Jogo sem data que repete outro já carregado é a ficha técnica de uma final.
    have = {(r["season"], r["home"], r["away"], r["home_goals"], r["away_goals"]) for r in rows}
    excluded = [e for e in excluded
                if not (e["score"] and (e["season"], e["home"], e["away"], *e["score"]) in have)]

    _, alias = load_clubs()
    if "--names" in sys.argv:
        names = Counter((r["file"], n) for r in rows for n in (r["home"], r["away"])
                        if resolve(alias, r["season"], n) is None)
        for (f, n), c in sorted(names.items()):
            print(f"{f}\t{n}\t{c}")
        return
    if "--json" in sys.argv:
        for r in rows:
            r["date"] = r["date"].isoformat()
        json.dump({"rows": rows, "excluded": excluded}, sys.stdout, ensure_ascii=False, default=str)
        return

    unknown = sorted({f"{r['season']} {n}" for r in rows for n in (r["home"], r["away"])
                      if resolve(alias, r["season"], n) is None})
    if unknown:
        sys.exit(f"Clubes sem cadastro em data/clubs.json: {unknown}")

    out, seen, dupes = [], set(), []
    for r in sorted(rows, key=lambda r: (r["date"], r["season"])):
        rec = {"league": "brasileirao", "season": r["season"], "date": r["date"].isoformat(),
               "stage": stage_pt(r["stage"]), "round": r["round"],
               "home": resolve(alias, r["season"], r["home"], r["stage"]),
               "away": resolve(alias, r["season"], r["away"], r["stage"]),
               "home_goals": r["home_goals"], "away_goals": r["away_goals"],
               "extra_time": r["extra_time"], "pens_home": r["pens_home"],
               "pens_away": r["pens_away"], "neutral": "", "status": r["status"],
               "note": r["note"], "source": "rsssfbrasil"}
        k = (rec["date"], rec["home"], rec["away"])
        if k in seen:
            dupes.append(k)
            continue
        seen.add(k)
        out.append(rec)

    # Clube com dois jogos no mesmo dia: erro de data na própria página.
    per_day = Counter((r["date"], s) for r in out for s in (r["home"], r["away"]))
    clashes = []
    for r in out:
        if per_day[(r["date"], r["home"])] > 1 or per_day[(r["date"], r["away"])] > 1:
            r["note"] = "; ".join(x for x in (r["note"], "data suspeita: na página o clube tem outro jogo no mesmo dia") if x)
            clashes.append(r)

    with OUT.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=FIELDS)
        w.writeheader()
        w.writerows(out)

    counts = Counter(r["season"] for r in out)
    write_report(out, excluded, dupes, clashes, counts, crosscheck(out))
    print(f"brasileirao-historico: {len(out)} jogos, temporadas {min(counts)}–{max(counts)}")


def write_report(out, excluded, dupes, clashes, counts, cross):
    exc = Counter(e["season"] for e in excluded)
    lines = ["# Brasileirão 1959–2002: relatório da carga", "",
             "Gerado por `scripts/ingest_rsssf.py` a partir das páginas do RSSSF Brasil "
             "(`data/raw/rsssf/`). Não editar à mão: rode o script de novo.", "",
             f"- {len(out)} jogos de {min(counts)} a {max(counts)}; {len(excluded)} jogos excluídos.",
             f"- {sum('aproximada' in r['note'] for r in out)} jogos com data aproximada "
             "(a página dá a rodada em mais de um dia e o jogo não traz o dia; vai o primeiro).",
             f"- {sum(1 for r in out if r['status'])} jogos com status (resultado alterado no tribunal "
             "ou jogo interrompido com placar mantido): vale o placar de campo.", "",
             "## Escopo", "",
             "- 1959–1968: Taça Brasil. 1967–1970: Robertão (em 1967 e 1968 os dois torneios "
             "estão na mesma temporada; o `stage` começa com o nome do torneio).",
             "- 1971–2002: Campeonato Brasileiro, todas as fases da disputa principal.",
             "- 1986: fica de fora o Torneio Paralelo (Grupos E–H), classificado pelo RSSSF "
             "como segundo nível.",
             "- 1987: Módulo Verde (Copa União), Módulo Amarelo e a decisão Sport x Guarani; "
             "ficam de fora os Módulos Azul e Branco.",
             "- 1999: fica de fora a seletiva para a Libertadores disputada depois do campeonato.",
             "- 2000 (Copa João Havelange): Módulo Azul e a fase final; ficam de fora os grupos "
             "dos Módulos Amarelo, Verde e Branco.", "",
             "## Jogos por temporada", "",
             "Conferência com o dataset "
             "[rodrigoazs/football-matches-dataset](https://github.com/rodrigoazs/football-matches-dataset) "
             "(`data/raw/crosscheck-rodrigoazs/`, só tem 1971–2002), comparando data e placar. "
             "As diferenças foram conferidas na página do RSSSF: são datas que o outro dataset "
             "erra (ano não lido em \"[Jan 24/87]\", 2º jogo de ida e volta, ano bissexto), "
             "prorrogação somada aqui, os módulos de 1986/1987/2000 que ele inclui e os "
             "jogos excluídos abaixo. Para 1959–1970 não há segunda fonte acessível: o "
             "Robertão bate com o regulamento (todos contra todos + quadrangular) e na Taça "
             "Brasil todo confronto tem 2 ou 3 jogos.", "",
             "| Temporada | Jogos no CSV | rodrigoazs | Só no CSV | Só em rodrigoazs | Excluídos |",
             "|---|---|---|---|---|---|"]
    for s in sorted(counts):
        c = cross.get(s)
        ref = f"{c[1]} | {c[2]} | {c[3]}" if c else "– | – | –"
        lines.append(f"| {s} | {counts[s]} | {ref} | {exc.get(s, 0)} |")
    lines += ["", "## Jogos excluídos", "",
              "| Temporada | Data | Jogo | Motivo | Página |", "|---|---|---|---|---|"]
    for e in excluded:
        d = e["date"].isoformat() if e["date"] else "?"
        reason = e["reason"].replace("|", "/")
        lines.append(f"| {e['season']} | {d} | {e['home']} x {e['away']} | {reason} | {e['file']} |")
    if clashes:
        lines += ["", "## Datas suspeitas (mantidas, com nota)", "",
                  "O clube aparece com dois jogos no mesmo dia na página do RSSSF.", "",
                  "| Data | Jogo | Fase | Rodada |", "|---|---|---|---|"]
        for r in clashes:
            lines.append(f"| {r['date']} | {r['home']} {r['home_goals']}-{r['away_goals']} {r['away']} "
                         f"| {r['stage']} | {r['round']} |")
    if dupes:
        lines += ["", "## Duplicados descartados", ""] + [f"- {d}" for d in dupes]
    REPORT.write_text("\n".join(lines) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
