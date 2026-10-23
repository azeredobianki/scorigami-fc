"""Baixa as fontes das ligas (Europa, MLS, Argentina e México) para data/raw/europe/.

Uso: python3 scripts/fetch_europe.py [liga ...]

Só baixa o que ainda não existe (apague o arquivo para baixar de novo). As
temporadas em andamento (openfootball e football-data do ano corrente) são
sempre baixadas de novo.
"""

import sys
import time
import urllib.error
import urllib.request
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "data" / "raw" / "europe"
GH = "https://raw.githubusercontent.com"
RSSSF = "https://www.rsssf.org"

# slug da liga: (arquivo engsoccerdata, pasta football-data, código openfootball,
#                (repo footballcsv, arquivo) ou None, páginas RSSSF por temporada)
LEAGUES = {
    "premier-league": ("england", "premier-league", "en.1", ("footballcsv/england", "eng.1.csv")),
    "la-liga": ("spain", "la-liga", "es.1", None),
    "serie-a": ("italy", "serie-a", "it.1", None),
    "bundesliga": ("germany", "bundesliga", "de.1", ("footballcsv/deutschland", "de.1.csv")),
    "ligue-1": ("france", "ligue-1", "fr.1", None),
    "eredivisie": ("holland", "eredivisie", "nl.1", None),
    "primeira-liga": ("portugal", "primeira-liga", "pt.1", None),
    "mls": ("mls", "mls", None, None),
    "primera-argentina": (None, "primera-argentina", None, None),
    "liga-mx": (None, "liga-mx", None, None),
}
# Ligas fora do espelho datasets/football-datasets: arquivos direto do football-data.co.uk
FD_DIRECT = {"eredivisie": ("mmz", "N1"), "primeira-liga": ("mmz", "P1"), "mls": ("new", "USA"),
             "primera-argentina": ("new", "ARG"), "liga-mx": ("new", "MEX")}
# ESPN (placar com prorrogação e pênaltis): código da liga e primeiro ano com dados
ESPN = {"mls": ("usa.1", 2003),  # 2001-02 da ESPN tem placares e mandos errados
        "primera-argentina": ("arg.1", 2001), "liga-mx": ("mex.1", 2001)}
# outras competições da ESPN que contam para a liga: código, primeiro e último ano
ESPN_EXTRA = {"primera-argentina": [("arg.copa_lpf", 2021, 2024)]}  # Copa de la Liga Profesional
# openfootball fora do padrão temporada/ano de início (pasta, código)
OF_EXTRA = {"primera-argentina": [("2025", "ar.1")], "liga-mx": [("2020-21", "mx.1"), ("2024-25", "mx.1")]}
UA = {"User-Agent": "Mozilla/5.0 (scorigamifc data loader)"}

CURRENT = date.today().year if date.today().month >= 7 else date.today().year - 1


def get(url, dest, force=False):
    if dest.exists() and not force:
        return True
    for attempt in range(4):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60) as r:
                data = r.read()
                if r.headers.get("Content-Encoding") == "gzip":
                    import gzip
                    data = gzip.decompress(data)
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_bytes(data)
            return True
        except urllib.error.HTTPError as e:
            if e.code == 404:
                return False
            time.sleep(2 ** attempt)
        except OSError:
            time.sleep(2 ** attempt)
    print(f"falhou: {url}", file=sys.stderr)
    return False


def label(y):
    return f"{y}-{(y + 1) % 100:02d}"


def rsssf_pages(slug):
    """(temporada, url, arquivo) das páginas do RSSSF com a tabela final."""
    yy = lambda y: f"{(y + 1) % 100:02d}"
    out = []
    if slug == "serie-a":
        for y in range(1929, CURRENT + 1):
            out.append((y, f"tablesi/ital{yy(y) if y < 2009 else y + 1}.html"))
    elif slug == "bundesliga":
        for y in range(1963, CURRENT + 1):
            out.append((y, f"tablesd/duit{yy(y) if y < 2009 else y + 1}.html"))
    elif slug == "la-liga":
        for d in ("2839", "3949", "4959", "5969", "6979", "7989", "8999", "9909"):
            out.append((None, f"tabless/spanhist{d}.html"))
        for y in range(2009, CURRENT + 1):
            out.append((y, f"tabless/span{yy(y) if y < 2009 else y + 1}.html"))
    elif slug == "ligue-1":
        out.append((None, "tablesf/franfullhist.html"))
        for y in range(1998, CURRENT + 1):
            out.append((y, f"tablesf/fran{yy(y) if y < 2009 else y + 1}.html"))
    elif slug == "eredivisie":
        for y in range(1956, CURRENT + 1):
            out.append((y, f"tablesn/ned{yy(y) if y < 2009 else y + 1}.html"))
    elif slug == "primeira-liga":
        for y in range(1934, 2005):
            out.append((y, f"tablesp/porthist{y}{y + 1}.html"))
        for y in range(2005, CURRENT + 1):
            out.append((y, f"tablesp/port{yy(y) if y < 2009 else y + 1}.html"))
    elif slug == "primera-argentina":
        # página com o nome do ano; 1910-2009 com dois dígitos
        for y in range(1891, CURRENT + 2):
            out.append((y, f"tablesa/arg{y if y < 1910 or y > 2009 else f'{y % 100:02d}'}.html"))
        out.append((2015, "tablesa/arg2015a.html"))
        # campeonatos amadores oficiais de 1931-34 e a Copa de Honor de 1936
        out += [(y, f"tablesa/arg{y % 100}a.html") for y in range(1931, 1935)] + [(1936, "tablesa/arg-hon36.html")]
        # tabelas finais por década (as páginas de temporada antigas não trazem a tabela)
        out += [(None, f"tablesa/arghist-ama{d}s.html") for d in range(1890, 1940, 10)]
        out += [(None, f"tablesa/arghist-pro{d}s.html") for d in range(1930, 2010, 10)]
    elif slug == "liga-mx":
        # página com o ano em que a temporada termina; dois dígitos até 2008-09
        for y in range(1943, CURRENT + 1):
            out.append((y, f"tablesm/mex{yy(y) if y < 2009 else y + 1}.html"))
        out += [(1969, "tablesm/mex6970.html")]  # 1969-70 (mex70 é o torneio México 70)
    elif slug == "premier-league":
        for y in range(1992, CURRENT + 1):
            out.append((y, f"tablese/eng{yy(y) if y < 2009 else y + 1}.html"))
    return out


def main():
    wanted = sys.argv[1:]
    for slug, (es, fd, of, fcsv) in LEAGUES.items():
        print(slug)
        if wanted and slug not in wanted:
            continue
        if es:
            get(f"{GH}/jalapic/engsoccerdata/master/data-raw/{es}.csv", RAW / "engsoccerdata" / f"{es}.csv")
        kind, code = FD_DIRECT.get(slug, ("mirror", None))
        for y in range(1993, CURRENT + 1):
            s = f"{y % 100:02d}{(y + 1) % 100:02d}"
            if kind == "mirror":
                url = f"{GH}/datasets/football-datasets/main/datasets/{fd}/season-{s}.csv"
            elif kind == "mmz":
                url = f"https://www.football-data.co.uk/mmz4281/{s}/{code}.csv"
            else:
                break
            dest = RAW / "football-data" / f"{fd}-{label(y)}.csv"
            if get(url, dest, force=y >= CURRENT - 1) and code:
                lines = dest.read_text(encoding="utf-8-sig", errors="replace").splitlines()
                if len(lines) < 2 or not lines[1].startswith(code + ","):
                    dest.unlink()  # o football-data às vezes serve outra liga no lugar (P1 de 1993-94 é a Espanha)
        if kind == "new":
            get(f"https://www.football-data.co.uk/new/{code}.csv", RAW / "football-data" / f"{fd}-all.csv", force=True)
        for y in range(2010, CURRENT + 1) if of else ():
            get(f"{GH}/openfootball/football.json/master/{label(y)}/{of}.json",
                RAW / "openfootball" / f"{label(y)}-{of}.json", force=y >= CURRENT - 1)
        for folder, code in OF_EXTRA.get(slug, ()):
            get(f"{GH}/openfootball/football.json/master/{folder}/{code}.json",
                RAW / "openfootball" / f"{folder}-{code}.json", force=True)
        if fcsv:
            repo, name = fcsv
            for y in range(1888, CURRENT + 1):
                get(f"{GH}/{repo}/master/{y // 10 * 10}s/{label(y)}/{name}",
                    RAW / "footballcsv" / f"{label(y)}-{name}")
        if slug in ESPN:
            code, first = ESPN[slug]
            for y in range(first, date.today().year + 1):
                url = f"https://site.api.espn.com/apis/site/v2/sports/soccer/{code}/scoreboard?dates={y}&limit=1000"
                get(url, RAW / "espn" / code / f"{y}.json", force=y >= date.today().year - 1)
        for code, first, last in ESPN_EXTRA.get(slug, ()):
            for y in range(first, last + 1):
                url = f"https://site.api.espn.com/apis/site/v2/sports/soccer/{code}/scoreboard?dates={y}&limit=1000"
                get(url, RAW / "espn" / code / f"{y}.json")
        for _, page in rsssf_pages(slug):
            get(f"{RSSSF}/{page}", RAW / "rsssf" / Path(page).name)


if __name__ == "__main__":
    main()
