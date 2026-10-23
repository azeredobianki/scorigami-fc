# Scorigami FC

Site de scorigami para futebol ([scorigamifc.com](https://scorigamifc.com), [@ScorigamiFC](https://x.com/ScorigamiFC)), em português, inglês e espanhol.

Uma scorigami é um placar final que nunca tinha acontecido antes numa competição. O site mostra todos os placares da
história de 11 ligas (cerca de 288 mil jogos): Brasileirão (desde 1959), Premier League (com a First Division, desde
1888/89), La Liga, Serie A, Bundesliga, Ligue 1, Eredivisie, Primeira Liga, MLS, Primera División argentina e Liga MX.

## Como rodar

```bash
npm install
npm run dev            # http://localhost:4321
npm run build          # site estático em dist/ (as três línguas)
npm run build:preview  # versão com links .html relativos, para hospedar sem URLs bonitas
npm test
```

Variável opcional: `PUBLIC_REPORT_ENDPOINT`, a URL (Formspree, Worker etc.) que recebe por POST, em JSON, os pedidos do
formulário "Solicitar ajuste".

## Estrutura

- `data/leagues.json`: ligas. Uma liga nova é uma linha aqui mais `data/matches/<slug>.csv`.
- `data/clubs.json`: cadastro único de clubes (slug, nome atual, nomes históricos, grafias aceitas).
- `data/matches/<liga>.csv`: uma linha por jogo (placar de campo; pênaltis em `pens_home`/`pens_away`), com o relatório
  da carga ao lado (`<liga>-relatorio.md`).
- `scripts/`: carga e conferência das fontes (`ingest*.py`), mais o ajuste da prévia (`preview-fix.mjs`).
- `src/lib/core.ts`: cálculos (grid, scorigamis, destaques), usados no build e no navegador.
- `src/lib/render.ts` e `src/lib/pages.ts`: HTML dos blocos e das páginas de placar, time e temporada.
- `src/lib/i18n.ts`: textos em português, inglês e espanhol.
- `src/views/`: conteúdo de cada página. `src/pages/` tem uma rota fina por idioma (raiz em português, `/en/` e `/es/`).

## Regras

- Scorigami = primeira vez que um placar acontece **na liga**. No filtro Geral, em todas as ligas juntas.
- Vale o placar de campo, com prorrogação. Pênaltis são só nota.

## Fontes

RSSSF e RSSSF Brasil, [adaoduque/Brasileirao_Dataset](https://github.com/adaoduque/Brasileirao_Dataset),
[openfootball/football.json](https://github.com/openfootball/football.json),
[engsoccerdata](https://github.com/jalapic/engsoccerdata), [footballcsv](https://github.com/footballcsv),
[football-data.co.uk](https://www.football-data.co.uk/) e ESPN. Os detalhes de cada liga estão na página Sobre e nos
relatórios de carga.
