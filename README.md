# Scorigami FC

Site de scorigami para futebol (scorigamifc.com), começando pelo Brasileirão Série A.

## Como rodar

```bash
npm install
npm run ingest         # normaliza data/raw/* em data/matches/brasileirao.csv (confere totais por temporada)
npm run dev            # http://localhost:4321
npm run build          # site estático em dist/
npm run build:preview  # versão com links .html relativos, para hospedar sem URLs bonitas
```

## Estrutura

- `data/raw/`: fontes baixadas, sem alteração.
- `data/clubs.json`: cadastro único de clubes (slug, nome atual, UF, grafias aceitas, nomes históricos).
- `data/leagues.json`: ligas. Uma liga nova é uma linha aqui mais `data/matches/<slug>.csv`.
- `data/matches/<liga>.csv`: uma linha por jogo (placar de campo; pênaltis em `pens_home`/`pens_away`).
- `scripts/ingest.py`: carga e conferência das fontes.
- `src/lib/core.ts`: cálculos (grid, scorigamis, destaques), usados no build e no navegador.
- `src/lib/render.ts`: HTML do grid e dos blocos, o mesmo no build e nos filtros.
- `src/pages/`: home (`/`), `/<liga>/placar/<a-b>`, `/<liga>/scorigamis[/ano]`, `/<liga>/times`, `/<liga>/time/<slug>`, `/timelapse`, `/sobre`.

## Regras

- Scorigami = primeira vez que um placar acontece **na liga**. Filtros de time e era não mudam isso.
- Vale o placar de campo, com prorrogação. Pênaltis são só nota.

## Fontes

- 2003–2024: [adaoduque/Brasileirao_Dataset](https://github.com/adaoduque/Brasileirao_Dataset)
- 2025–2026: [openfootball/football.json](https://github.com/openfootball/football.json) (domínio público)
- 1959–2002: [RSSSF Brasil](https://rsssfbrasil.com/historical.htm), via `scripts/ingest_rsssf.py` → `data/matches/brasileirao-historico.csv` (relatório da carga ao lado)
