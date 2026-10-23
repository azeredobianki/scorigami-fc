"""Leitor das páginas jogo a jogo do RSSSF da Argentina e do México.

As páginas são texto quase livre: títulos em <h>/<b>/<i> ou em linha solta,
rodadas ("Round 3", "Fecha 3"), datas entre colchetes sem ano ("[Mar 14]") e
jogos "Mandante 2-1 Visitante [notas]". `parse` devolve os jogos com o
caminho de títulos acima de cada um; `classify` (Argentina) e `gate`
(México) dizem se o jogo é da primeira divisão.
"""

import re
import html
from pathlib import Path
from datetime import date

MONTHS = {m: i + 1 for i, m in enumerate("jan feb mar apr may jun jul aug sep oct nov dec".split())}
MONTHS.update({"ene": 1, "abr": 4, "ago": 8, "set": 9, "dic": 12})
T = r"[A-Za-zÀ-ſ'\"(.]"
SCORE = r"(?P<hg>\d{1,2})\s*[-:–]\s*(?P<ag>\d{1,2})"
MATCH = re.compile(rf"^\s*(?P<h>{T}[^\[\]\t]*?)(?:\s+|(?<=\)))\s*{SCORE}(?P<aet>\s*(?:aet|a\.e\.t\.?|\(aet\)|asdet))?\s+(?P<a>{T}[^\[\]\t]*?)(?P<rest>(?:\s{{2,}}|\t|\s*\[).*)?$", re.I)
TAIL = re.compile(r"\s+(?:\(?a\.?e\.?t\.?\)?|\(?asdet\)?|awd|abd|\(?pen.*|on pk.*|at\s+[A-Z].*|\(at\s.*)$", re.I)
ROUND = re.compile(r"^\s*(?:(?:Round|Fecha|Matchday|Jornada|Rond|Rd\.?)\s*(\d+(?:\.\s*\d+)?)|(\d+)(?:st|nd|rd|th|º|ª)\s+(?:Round|Fecha))", re.I)
DATE4 = re.compile(r"^\s*\[?\s*(\d{1,2})\.(\d{1,2})\.(\d{4})\s*\]?\s*:?\s*$")
DATE5 = re.compile(r"\[\s*(\d{1,2})\s+([A-Z][a-z]{2})[a-z]*\.?(?:,?\s*(\d{4}))?\s*(?:[,\s][^\]]*)?\]")
DATE1 = re.compile(r"\[\s*([A-Z][a-z]{2})[a-z]*\.?\s+(\d{1,2})(?:st|nd|rd|th)?\??(?:,?\s*(\d{4}))?(?:[,\s][^\]]*)?\]")
DATE2 = re.compile(r"^\s*(?:[A-Z][a-z]+day,?\s+)?(\d{1,2})(?:st|nd|rd|th)?\s+(?:of\s+)?([A-Z][a-z]+)(?:,?\s*(\d{4}))?\s*:?\s*$")
DATE3 = re.compile(r"^\s*([A-Z][a-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?(?:,?\s*(\d{4}))?\s*:\s*$")
HEAD = {"h1": 1, "h2": 2, "h3": 3, "h4": 4, "b": 5, "i": 6, "u": 6, "a": 6}


def text_lines(path):
    raw = path.read_bytes()
    if raw[:2] in (b"\xff\xfe", b"\xfe\xff"):
        raw = raw.decode("utf-16").encode("utf-8")
    try:
        s = raw.decode("utf-8")
    except UnicodeDecodeError:
        s = raw.decode("latin-1")
    s = s.replace("\r\n", "\n").replace("\r", "\n")
    if path.name == "arg20.html":  # título em <b> logo depois de <pre>
        s = re.sub(r"<pre\b[^>]*>", "\n", s, flags=re.I)
    # títulos: <hN>, <b>, <i>, <a name> que ocupam a linha
    def head(m):
        tag = m[1].lower()
        inner = html.unescape(re.sub(r"<[^>]+>", "", m[2])).strip()
        if not inner or MATCH.match(inner) or len(inner) > 120:
            return m[0]
        return f"\n§{HEAD[tag]}§{inner}\n"
    s = re.sub(r"<(h[1-4])\b[^>]*>(.*?)</\1\s*>", head, s, flags=re.I | re.S)
    s = re.sub(r"(?m)^\s*<(b|i|u)\b[^>]*>(.*?)</\1\s*>(?=[ \t:]*(?:<[^>]+>[ \t]*)*$)", head, s, flags=re.I | re.S)
    s = re.sub(r"(?m)^\s*<(a)\s+name=[^>]*>(.*?)</a\s*>(?=[ \t:]*(?:<[^>]+>[ \t]*)*$)", head, s, flags=re.I | re.S)
    s = re.sub(r"<[^>]+>", "", s)
    s = html.unescape(s).replace("\xa0", " ")
    if path.name.startswith("mex"):  # "Guadalajara 4 León 0"
        s = re.sub(r"(?m)^([A-Za-zÀ-ſ][^\[\d\n:]{0,28}?)[ \t]+(\d{1,2})[ \t]+([A-Za-zÀ-ſ][^\[\d\n:]{0,28}?)[ \t]+(\d{1,2})(?=[ \t]*(\[|$))", r"\1 \2-\4 \3", s)
    # 1988-89: empate decidido nos pênaltis, "Ferro  [3]0-0[1]  Newell's"
    s = re.sub(r"(?m)^(.*?)\s*\[(\d+)\](\d+-\d+)\[(\d+)\](.*)$", r"\1  \3\5  [pen \2-\4]", s)
    lines = s.splitlines()
    if path.name == "mex84.html":  # colunas de hora e TV antes do jogo
        lines = [ln[23:] if len(ln) > 30 and re.match(r"^(\d{1,2}:\d{2}\s|\s*(Televisa|Canal|Imevisi)|\s+$)", ln[:23]) and ln[23] != " "
                 and not re.search(r"\d\s*-\s*\d", ln[:23]) else ln for ln in lines]
    return lines


def note_date(ctx, d):
    ctx["recent"] = (ctx["recent"] + [d])[-5:]
    if ctx["rf"] is None and ctx["in_round"]:
        ctx["rf"] = d
    ctx["fresh"] = False
    if ctx["sec_first"] is None:
        ctx["sec_first"] = d


def mk_date(mon, day, year, ctx):
    """Data sem ano. Logo depois de um título: a primeira ocorrência a partir
    do início da seção (folga de 30 dias). No meio da seção: a mais perto da
    mediana dos últimos jogos, com peso dobrado para trás, para que um jogo
    adiado fora de ordem não empurre as rodadas seguintes para outro ano."""
    mo = MONTHS.get(mon[:3].lower())
    if not mo:
        return None
    try:
        if year:
            d = date(int(year), mo, int(day))
            ref = ctx["rf"] or ctx["prev_rf"] or (sorted(ctx["recent"])[(len(ctx["recent"]) - 1) // 2] if ctx["recent"] else None)
            if ref and abs((d - ref).days) > 150:
                return d  # jogo muito fora de ordem (desempate, jogo adiado): não vira referência
        else:
            cands = []
            for y in range(ctx["y1"] - 1, ctx["y1"] + 3):
                try:
                    cands.append(date(y, mo, int(day)))
                except ValueError:
                    pass
            if ctx["fresh"] or not ctx["recent"]:
                anchor = ctx["anchor"]
                ok = [c for c in cands if (c - anchor).days >= -30]
                d = min(ok) if ok else None
            else:
                # referência: o primeiro jogo da rodada (ou da anterior); jogo
                # adiado costuma vir listado depois dos jogos do dia
                ref = ctx["rf"] or ctx["prev_rf"] or sorted(ctx["recent"])[(len(ctx["recent"]) - 1) // 2]
                cost = lambda c: (c - ref).days if c >= ref else 2 * (ref - c).days
                d = min(cands, key=cost) if cands else None
    except ValueError:
        return None
    if d:
        note_date(ctx, d)
    return d


def new_section(ctx, top):
    """Título: o próximo jogo sem ano conta a partir do começo da seção."""
    if top:
        ctx["anchor"], ctx["sec_first"] = ctx["start"], None
    else:
        ctx["anchor"] = ctx["sec_first"] or ctx["start"]
    ctx["fresh"] = True
    ctx["recent"], ctx["rf"], ctx["prev_rf"], ctx["in_round"] = [], None, None, False


def new_round(ctx):
    ctx["prev_rf"], ctx["rf"] = ctx["rf"] or ctx["prev_rf"], None
    ctx["in_round"] = True


PSEUDO = re.compile(r"\s(abd|awd|ppd|n/p|ann|wp|lp|w|l|d)\s*[:-]?\s*(wp|lp|w|l|d)?\s", re.I)
IGNORE = re.compile(r"^(final |aggregate |general |overall )?(table|standings|tie.?break|notes?|tickets|referee|top ?scorers)\b", re.I)


KO = re.compile(r"^(first|second|third|1st|2nd|3rd)\s+(leg|match|game)|^(semi|quarter|final|replay|play-?off|round of|1/\d|octavos|cuartos|semif)", re.I)


def starts_block(ln):
    return bool(ROUND.match(ln) or ln.strip().startswith("[") or MATCH.match(ln) or DATE2.match(ln) or DATE3.match(ln)
                or IGNORE.match(ln.strip()) or re.match(r"\s*No\.\s+Team|\s*1\.\s*\S", ln))


KEYW = re.compile(r"torneo|apertura|clausura|metropolitan|nacional|national|campeonato|copa|cup|championship|group|grupo|zone|zona|"
                  r"semi|final|quarter|leg\b|play-?off|promo|releg|reclasific|liguilla|octogonal|petit|reducido|tournament|"
                  r"primera|divisi|interzon|inter.?group|stage|phase|fase|step|rueda|superliga|transici|inicial|liga\b|league|"
                  r"desempate|regular season|friendl|amistos|regional|reserv|segunda|second|round of|cuartos|octavos|"
                  r"repechaje|reclassif|invierno|verano|temporada|season|federa|asociaci|association|match(es)?\b|winner|place", re.I)


STRONG = re.compile(r"torneo|apertura|clausura|metropolitan|nacional|national|campeonato|championship|primera|liga\b|copa|"
                    r"superliga|group|grupo|zone|zona|division|división|league|regular season|stage|fase|phase|"
                    r"invierno|verano|transici|inicial|temporada|season", re.I)


def sentence(ln):
    t = ln.strip()
    return (t.endswith(".") and len(t.split()) > 3) or len(t.split()) > 12


def hard(x):
    return bool(ROUND.match(x) or x.strip().startswith("[") or MATCH.match(x) or DATE2.match(x)
                or DATE3.match(x) or DATE4.match(x))


def head_like(ln):
    return (KEYW.search(ln) and not sentence(ln) and len(re.findall(r"(?:^|\s)\d+(?=\s|$)", ln)) < 3 and not re.search(r"\bbye\b|\d+'|\d+m\b|\battendance|\batt\.|field:|ref\.|referee", ln, re.I) and ln[:1] not in " \t[(-=*" and len(ln.strip()) < 80 and not re.match(r"^\s*\d+[.)]", ln)
            and not PSEUDO.search(ln + " ") and not IGNORE.match(ln) and not MATCH.match(ln)
            and not ln.startswith(("No.", "Bye", "NB", "Note", "§")))


HARD_STOP = re.compile(r"segunda divisi|tercera divisi|second level|third level|fourth level|primera divisi[oó]n\s*[\"']?a\b|ascenso|liga premier|expansi[oó]n", re.I)
SOFT_OFF = re.compile(r"\bcopa\b|nuevos valores|\bcup\b|campe[oó]n de campeones|relegation|promoci|descenso|libertadores|interliga|friendl|all-star|estrellas|playoff match for", re.I)
SOFT_ON = re.compile(r"regular season|championship|prode|liguilla|fase final|final phase|repechaje|reclasific|recalific|reclassif|invierno|verano|apertura|clausura|extraordinary", re.I)


TOUR = re.compile(r"invierno|verano|apertura|clausura|prode|m[eé]xico\s*(70|86)|extraordinary", re.I)
KOPH = re.compile(r"championship|liguilla|play-?offs?\b|repechaje|reclasif|recalif|reclassif|quarter|semi|\bfinals?\b|fase final|final phase|round of", re.I)
LGPH = re.compile(r"regular season|first phase|second phase|first stage|second stage|group phase|primera fase|segunda fase", re.I)


def gate(ln, g):
    """Seção da página do México. g = [estado, torneio, fase]; estado 'on'
    (primeira divisão), 'off' (copa, rebaixamento: pode voltar) ou 'stop'
    (divisões inferiores até o fim da página); fase 'liga' ou 'mata'."""
    state = g[0]
    t = re.sub(r"^§\d§", "", ln.strip())
    if state == "stop" or not t or t[0] in "[(*-=" or ":" in t or len(t) > 90 or MATCH.match(ln) \
            or sentence(t) or (t[0].isdigit() and not re.match(r"\d{4}", t)) or t[0].islower():
        return g
    if HARD_STOP.search(t) and (re.match(r"(m[eé]xico\s+)?(\d{2,4}\S*\s+)?(segunda|tercera|primera divisi[oó]n\s*[\"']?a\b|second|third|fourth)", t, re.I)
                                or re.search(r"\((second|third|fourth) level\)", t, re.I)):
        return ["stop", g[1], g[2]]
    if len(re.findall(r"\d+", t)) >= 3 and not TOUR.search(t):
        return g
    if SOFT_OFF.search(t):
        return ["off", g[1], g[2]]
    tour, ph = g[1], g[2]
    mt = TOUR.search(t)
    if mt and not re.search(r"champion|campe[oó]n", t, re.I):
        tour, ph = t, "liga"
    if LGPH.search(t) and not KOPH.search(t) and (ph != "mata" or re.search(r"regular season", t, re.I)):
        ph = "liga"
        if re.match(r"(first|second) (phase|stage)$", t, re.I) and not mt:
            tour = re.sub(r" / .*", "", tour) + " / " + t
    elif KOPH.search(t) and not re.search(r"group|relegation|table", t, re.I) and len(t.split()) <= 5:
        ph = "mata"
    if (SOFT_ON.search(t) or mt) and not re.search(r"group|relegation", t, re.I):
        state = "on"
    return [state, tour, ph]


def parse(path, y1, split):
    start = date(y1, 7, 1) if split else date(y1, 1, 1)
    ctx = dict(y1=y1, split=split, start=start, anchor=start, sec_first=None, recent=[], fresh=True, rf=None, prev_rf=None, in_round=False)
    heads = []  # (nível, texto)
    rnd, d = "", None
    out = []
    lines = [ln for ln in text_lines(path) if ln.strip()]
    prev_head = False
    gst = ["on", "", "liga"]
    tb = False  # linha solta "Playoff to define..." antes do jogo: desempate
    for i, ln in enumerate(lines):
        if path.name.startswith("mex"):
            gst = gate(ln, gst)
        if re.fullmatch(r"(§\d§)?\s*discrepancies\s*:?\s*", ln.strip(), re.I):
            break  # notas de fim de página com versões alternativas dos jogos
        was, prev_head = prev_head, False
        nxt = lines[i + 1] if i + 1 < len(lines) else ""
        if ln.startswith("§"):
            lvl, txt = int(ln[1]), ln[3:].strip()
            if IGNORE.match(txt) or len(re.findall(r"(?:^|\s)\d+(?=\s|$)", txt)) >= 4:
                continue
            if lvl >= 5 and (sentence(txt) or not KEYW.search(txt) or not ((starts_block if STRONG.search(txt) else hard)(nxt)
                                                   or nxt.startswith("§") or head_like(nxt))):
                continue  # negrito/itálico solto no meio de notas
            heads = [h for h in heads if h[0] < lvl] + [(lvl, txt)]
            rnd = ""
            new_section(ctx, lvl <= 4)
            tb = False
            md = DATE1.search(txt)
            if md:
                d = mk_date(md[1], md[2], md[3], ctx) or d
            continue
        mr = ROUND.match(ln)
        if mr:
            rnd = re.sub(r"\s", "", mr[1] or mr[2])
            new_round(ctx)
            tb = False
            heads = [h for h in heads if h[0] < 5 or not re.search(r"play-?off|place|desempate|tie", h[1], re.I)]
            m6 = re.search(r"\d\s*[.:]?\s+(\d{1,2})\s+([A-Za-z]{3})[a-z]*\.?(?:\s+(\d{4}))?\s*$", ln)
            if m6:
                d = mk_date(m6[2], m6[1], m6[3], ctx) or d
                continue
        m4 = DATE4.match(ln)
        if m4:
            try:
                d = date(int(m4[3]), int(m4[2]), int(m4[1]))
                note_date(ctx, d)
            except ValueError:
                pass
            continue
        m5 = DATE5.search(ln) if not MATCH.match(ln) else None
        if m5 and (mr or ln.strip().startswith("[")):
            d = mk_date(m5[2], m5[1], m5[3], ctx) or d
            continue
        md = DATE1.search(ln) if not MATCH.match(ln) else None
        if md and (mr or ln.strip().startswith("[")):
            d = mk_date(md[1], md[2], md[3], ctx) or d
            continue
        if mr:
            continue
        for rx in (DATE2, DATE3):
            m2 = rx.match(ln)
            if m2:
                a, b, c = m2.groups()
                dd = mk_date(b, a, c, ctx) if rx is DATE2 else mk_date(a, b, c, ctx)
                if dd:
                    d = dd
                break
        else:
            if re.match(r"\s*(playoff|desempate|tie.?break)\b", ln, re.I) and not MATCH.match(ln):
                tb = True
            m = MATCH.match(ln) if not ln.lstrip().startswith(("[", ".", "-", "*", "(")) else None
            if m and not re.search(r"(^|\s)\d+(\s|$)", m["h"]) and not re.search(r"(^|\s)\d+(\s|$)", m["a"].split("  ")[0]):
                rest = (m["rest"] or "")
                away = m["a"].strip()
                t = TAIL.search(away)
                if t:
                    rest = t[0] + " " + rest
                    away = away[:t.start()]
                home = m["h"].strip().rstrip(".")
                flags = "tb" if tb else ""
                for side in ("home", "away"):
                    v = home if side == "home" else away
                    t2 = re.search(r"\s+(wp|lp)$" if side == "home" else r"^(wp|lp)\s+", v)
                    if t2:
                        flags = "awd"
                        v = (v[:t2.start()] if side == "home" else v[t2.end():])
                    if side == "home":
                        home = v
                    else:
                        away = v
                md2 = re.search(r"\s*\((\d{1,2})\s+([A-Z][a-z]{2})[a-z]*\)\s*$", away)
                when = d
                if md2:
                    away = away[:md2.start()]
                    when = mk_date(md2[2], md2[1], None, dict(ctx, recent=list(ctx["recent"]))) or d
                out.append(dict(path=[h[1] for h in heads], round=rnd, date=when, home=home, flags=flags,
                                away=away.strip().rstrip(".,"), hg=int(m["hg"]), ag=int(m["ag"]),
                                aet=bool(m["aet"]) or bool(re.search(r"\baet\b|a\.e\.t|asdet|extra", rest, re.I)),
                                rest=rest.strip(), line=ln, gate=gst[0], tour=gst[1], phase=gst[2]))
                continue
            nxt2 = lines[i + 2] if i + 2 < len(lines) else ""
            ok = starts_block if STRONG.search(ln) else hard
            if head_like(ln) and (ok(nxt) or (head_like(nxt) and starts_block(nxt2))):
                lvl = 10 if was or (any(h[0] == 10 for h in heads) and KO.match(ln.strip())) else 9
                heads = [h for h in heads if h[0] < lvl] + [(lvl, ln.strip())]
                new_section(ctx, False)
                prev_head = True
                continue
    return out




# ------------------------------------------------------------ Argentina

EXC = re.compile(r"friendl|amistos|regional|combined|national team|selecci|copa argentina|supercopa|supercup|trofeo de campeones|"
                 r"lipton|newton|promoci|promotion|relegation|descenso|reclasific|promocional|second level|third level|fourth|fifth|"
                 r"segunda|primera\s*\"?b\"?\b|b nacional|primera nacional|primera\s*\"?[cd]\"?\b|argentino\s*\"?[ab]\"?|federal|"
                 r"ascenso|reserv|intermedia|libertadores|clasificaci|classification|octogonal|petit|tie.?break|desempate|badget|"
                 r"upcountry|preparaci|preparation|\bu-?\d\d\b|youth|play-?off|runner-up|copa de oro|copa de competencia|ibarguren|"
                 r"liguilla|reducido|trofeo|summer|verano|national teams|afa regional|friendly|interprovincial|sudamerican|south american", re.I)
KOX = re.compile(r"semi|quarter|cuartos|octavos|\bfinal\b|1/8|1/4|round of|winners|losers|knock|eliminat|leg\b|playoffs?\b", re.I)


def classify(m):
    """Caminho de títulos do jogo, ou None se não é da primeira divisão."""
    path = m["path"][1:]
    if "tb" in m["flags"]:
        return None
    if any(EXC.search(p) for p in path):
        return None
    return path


def tkey(path):
    """Torneio do jogo: o caminho sem grupos, rodadas e fases."""
    keep = [x for x in path if not KOX.search(x) and not re.search(r"group|zone|zona|grupo|inter|round|fecha|step|phase|fase|stage", x, re.I)]
    return " > ".join(keep)[:90]


def skip(m):
    """Jogo abandonado e não completado."""
    r = m["rest"].lower()
    return bool(re.search(r"abandon|suspend|annul|not played|n/p", r)) and not re.search(r"continu|resum|complet|stood|replay", r)


def pages(folder, prefix, first=0, last=9999):
    """(arquivo, ano de início, temporada dividida, título) das páginas de temporada."""
    out = []
    for p in sorted(folder.glob(prefix + "*.html")):
        if re.search(r"hist|champ", p.name) or ("-" in p.name and p.name != "arg-hon36.html"):
            continue
        if prefix == "mex":
            # mexYY: temporada que termina em YY; mex2011 em diante com 4 dígitos;
            # mex6970 = 1969-70 e mex70 = torneio México 70 (entre 1969-70 e 1970-71)
            n = re.fullmatch(r"mex(\d+)\.html", p.name)
            if not n:
                continue
            n = n[1]
            if n in ("6970", "70"):
                y1 = 1969
            elif len(n) == 4:
                y1 = int(n) - 1
            else:
                y1 = (1900 + int(n) if int(n) >= 43 else 2000 + int(n)) - 1
            if first <= y1 <= last:
                out.append((p, y1, True, p.name))
            continue
        t = re.search(r"<title>([^<]*)", p.read_text(encoding="latin-1"), re.I)
        y = re.search(r"(\d{4})", t[1]) if t else None
        if not y or not first <= int(y[1]) <= last:
            continue
        out.append((p, int(y[1]), "/" in t[1], t[1].strip()))
    return out
