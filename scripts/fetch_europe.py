"""Baixa as fontes das ligas europeias para data/raw/europe/.

Uso: python3 scripts/fetch_europe.py

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
}

CURRENT = date.today().year if date.today().month >= 7 else date.today().year - 1


def get(url, dest, force=False):
    if dest.exists() and not force:
        return True
    for attempt in range(4):
        try:
            with urllib.request.urlopen(url, timeout=60) as r:
                data = r.read()
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
    elif slug == "premier-league":
        for y in range(1992, CURRENT + 1):
            out.append((y, f"tablese/eng{yy(y) if y < 2009 else y + 1}.html"))
    return out


def main():
    for slug, (es, fd, of, fcsv) in LEAGUES.items():
        print(slug)
        get(f"{GH}/jalapic/engsoccerdata/master/data-raw/{es}.csv", RAW / "engsoccerdata" / f"{es}.csv")
        for y in range(1993, CURRENT + 1):
            s = f"{y % 100:02d}{(y + 1) % 100:02d}"
            get(f"{GH}/datasets/football-datasets/main/datasets/{fd}/season-{s}.csv",
                RAW / "football-data" / f"{fd}-{label(y)}.csv", force=y >= CURRENT - 1)
        for y in range(2010, CURRENT + 1):
            get(f"{GH}/openfootball/football.json/master/{label(y)}/{of}.json",
                RAW / "openfootball" / f"{label(y)}-{of}.json", force=y >= CURRENT - 1)
        if fcsv:
            repo, name = fcsv
            for y in range(1888, CURRENT + 1):
                get(f"{GH}/{repo}/master/{y // 10 * 10}s/{label(y)}/{name}",
                    RAW / "footballcsv" / f"{label(y)}-{name}")
        for _, page in rsssf_pages(slug):
            get(f"{RSSSF}/{page}", RAW / "rsssf" / Path(page).name)


if __name__ == "__main__":
    main()
