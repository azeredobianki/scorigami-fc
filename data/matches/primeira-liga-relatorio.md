# Primeira Liga: relatório da carga

Gerado por `scripts/ingest_europe.py`. Não editar à mão: rode o script de novo.

- 9336 jogos de 1994-95 a 2026-27; temporada = ano de início.
- Fonte principal: engsoccerdata até 2024-25; depois openfootball. Conferência jogo a jogo com footballcsv, openfootball e football-data.co.uk onde existem, e tabela final do RSSSF.
- 0 jogos com data suspeita sem outra fonte para corrigir (ver abaixo).

## Jogos por temporada

Colunas das fontes: jogos casados / divergências de data / jogos que só a fonte tinha (acrescentados). RSSSF: times cuja linha (J V E D GP GC) bate com a tabela final.

| Temporada | Jogos | footballcsv | RSSSF (jogos) | openfootball | football-data | RSSSF (tabela) |
|---|---|---|---|---|---|---|
| 1994-95 | 306 | – | – | – | 306 / 0 / 0 | – |
| 1995-96 | 306 | – | – | – | 306 / 0 / 0 | – |
| 1996-97 | 306 | – | – | – | 306 / 0 / 0 | – |
| 1997-98 | 306 | – | – | – | 306 / 0 / 0 | – |
| 1998-99 | 306 | – | – | – | 306 / 0 / 0 | – |
| 1999-00 | 306 | – | – | – | 306 / 0 / 0 | – |
| 2000-01 | 306 | – | – | – | 306 / 0 / 0 | – |
| 2001-02 | 306 | – | – | – | 306 / 0 / 0 | – |
| 2002-03 | 306 | – | – | – | 306 / 0 / 0 | – |
| 2003-04 | 306 | – | – | – | 306 / 0 / 0 | – |
| 2004-05 | 306 | – | – | – | 306 / 0 / 0 | – |
| 2005-06 | 306 | – | – | – | 306 / 0 / 0 | 18/18 |
| 2006-07 | 240 | – | – | – | 240 / 0 / 0 | 16/16 |
| 2007-08 | 240 | – | – | – | 240 / 0 / 0 | 14/16 |
| 2008-09 | 240 | – | – | – | 240 / 0 / 0 | 16/16 |
| 2009-10 | 240 | – | – | – | 240 / 0 / 0 | 16/16 |
| 2010-11 | 240 | – | – | – | 240 / 0 / 0 | 16/16 |
| 2011-12 | 240 | – | – | – | 240 / 0 / 0 | 16/16 |
| 2012-13 | 240 | – | – | – | 240 / 0 / 0 | 16/16 |
| 2013-14 | 240 | – | – | – | 240 / 0 / 0 | 16/16 |
| 2014-15 | 306 | – | – | – | 306 / 1 / 0 | 18/18 |
| 2015-16 | 306 | – | – | – | 306 / 0 / 0 | 18/18 |
| 2016-17 | 306 | – | – | – | 306 / 0 / 0 | 18/18 |
| 2017-18 | 306 | – | – | – | 306 / 0 / 0 | 18/18 |
| 2018-19 | 306 | – | – | 306 / 0 / 0 | 306 / 0 / 0 | 18/18 |
| 2019-20 | 306 | – | – | 306 / 1 / 0 | 306 / 1 / 0 | 18/18 |
| 2020-21 | 306 | – | – | 306 / 1 / 0 | 306 / 1 / 0 | 18/18 |
| 2021-22 | 306 | – | – | 306 / 0 / 0 | 306 / 0 / 0 | 18/18 |
| 2022-23 | 306 | – | – | 306 / 0 / 0 | 306 / 0 / 0 | 18/18 |
| 2023-24 | 306 | – | – | 306 / 0 / 0 | 306 / 0 / 0 | 18/18 |
| 2024-25 | 306 | – | – | 306 / 0 / 0 | 306 / 0 / 0 | 18/18 |
| 2025-26 | 306 | – | – | 0 / 0 / 306 | 306 / 0 / 0 | 18/18 |
| 2026-27 | 72 | – | – | 0 / 0 / 62 | 62 / 0 / 10 | – |

## Tabela final diferente do RSSSF

Times cuja campanha (J V E D GP GC) não aparece na tabela do RSSSF. Os casos conferidos são resultados do tribunal (a tabela usa o placar do tribunal; aqui vale o de campo), erro de digitação na página do RSSSF ou temporada com mais de uma fase. Onde um placar só faria a tabela bater, ele aparece abaixo, para conferência.

- 2007-08: belenenses 30; naval 30
  - a tabela bate se 2008-01-13 belenenses x naval (2-1) for 0-3

## Placares divergentes

- 2025-26 2026-05-16 moreirense x avs: 0-1 -> 0-0 (tabela do RSSSF); football-data.co.uk 0-0
- 2025-26 2026-05-16 casa-pia x rio-ave: 2-1 -> 1-1 (tabela do RSSSF); football-data.co.uk 1-1

## Clubes

- clube novo: Académico de Viseu (Académico de Viseu FC)
