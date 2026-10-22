"""Normaliza as fontes brutas em data/matches/<liga>.csv.

Uso: python3 scripts/ingest.py

Cada fonte vira linhas no mesmo formato. Nomes de clubes passam pelo cadastro
em data/clubs.json; um nome desconhecido interrompe a carga para não criar
clubes duplicados por grafia diferente.
"""

import csv
import json
import sys
from collections import Counter
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "data" / "raw"
OUT = ROOT / "data" / "matches"

FIELDS = [
    "league", "season", "date", "stage", "round", "home", "away",
    "home_goals", "away_goals", "extra_time", "pens_home", "pens_away",
    "neutral", "status", "note", "source",
]

# Total de jogos esperado por temporada (Série A), para conferência.
# 2016: Chapecoense x Atlético-MG da última rodada não foi disputado.
EXPECTED = {
    2003: 552, 2004: 552, 2005: 462, 2016: 379,
    **{y: 380 for y in range(2006, 2026) if y != 2016},
}


def load_clubs():
    clubs = json.loads((ROOT / "data" / "clubs.json").read_text(encoding="utf-8"))
    alias = {}
    for c in clubs:
        for n in [c["name"], *c.get("aliases", [])]:
            alias[n] = c["slug"]
    return clubs, alias


def resolve(alias, name, unknown):
    slug = alias.get(name.strip())
    if slug is None:
        unknown.add(name)
    return slug


def from_adaoduque(alias, unknown):
    path = RAW / "adaoduque-campeonato-brasileiro-full.csv"
    with path.open(encoding="utf-8") as f:
        for r in csv.DictReader(f):
            d, m, y = (int(x) for x in r["data"].split("/"))
            day = date(y, m, d)
            # A temporada 2020 terminou em fevereiro de 2021 (pandemia).
            season = 2020 if day < date(2021, 4, 1) and y == 2021 else y
            yield {
                "season": season,
                "date": day.isoformat(),
                "stage": "",
                "round": r["rodata"],
                "home": resolve(alias, r["mandante"], unknown),
                "away": resolve(alias, r["visitante"], unknown),
                "home_goals": int(r["mandante_Placar"]),
                "away_goals": int(r["visitante_Placar"]),
                "source": "adaoduque/Brasileirao_Dataset",
            }


def from_openfootball(alias, unknown, season):
    path = RAW / f"openfootball-{season}-br.1.json"
    data = json.loads(path.read_text(encoding="utf-8"))
    for m in data["matches"]:
        score = m.get("score")
        if isinstance(score, dict):
            score = score.get("ft")
        if not score:
            continue  # jogo ainda não disputado
        yield {
            "season": season,
            "date": m["date"],
            "stage": "",
            "round": m["round"].replace("Matchday ", ""),
            "home": resolve(alias, m["team1"], unknown),
            "away": resolve(alias, m["team2"], unknown),
            "home_goals": int(score[0]),
            "away_goals": int(score[1]),
            "source": "openfootball/football.json",
        }


def main():
    _, alias = load_clubs()
    unknown = set()
    rows = list(from_adaoduque(alias, unknown))
    covered = {r["season"] for r in rows}
    for season in (2025, 2026):
        if season not in covered:
            rows.extend(from_openfootball(alias, unknown, season))

    if unknown:
        sys.exit(f"Clubes sem cadastro em data/clubs.json: {sorted(unknown)}")

    defaults = {"league": "brasileirao", "extra_time": "", "pens_home": "",
                "pens_away": "", "neutral": "", "status": "", "note": ""}
    rows = [{**defaults, **r} for r in rows]
    rows.sort(key=lambda r: (r["date"], r["season"], r["home"]))

    counts = Counter(r["season"] for r in rows)
    problems = [f"{s}: {counts[s]} jogos, esperado {n}"
                for s, n in EXPECTED.items() if counts.get(s, 0) != n]
    dupes = [k for k, n in Counter((r["date"], r["home"], r["away"]) for r in rows).items() if n > 1]
    if problems or dupes:
        sys.exit("Conferência falhou:\n" + "\n".join(problems + [f"duplicado: {d}" for d in dupes]))

    OUT.mkdir(parents=True, exist_ok=True)
    with (OUT / "brasileirao.csv").open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=FIELDS)
        w.writeheader()
        w.writerows(rows)
    print(f"brasileirao: {len(rows)} jogos, temporadas {min(counts)}–{max(counts)}")
    for s in sorted(counts):
        print(f"  {s}: {counts[s]}")


if __name__ == "__main__":
    main()
