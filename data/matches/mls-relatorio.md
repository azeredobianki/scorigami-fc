# MLS: relatório da carga

Gerado por `scripts/ingest_europe.py`. Não editar à mão: rode o script de novo.

- 9535 jogos de 1996 a 2026; temporada = ano de início.
- Fonte principal: engsoccerdata até 2024-25; depois openfootball. Conferência jogo a jogo com footballcsv, openfootball e football-data.co.uk onde existem, e tabela final do RSSSF.
- 0 jogos com data suspeita sem outra fonte para corrigir (ver abaixo).

## Jogos por temporada

Colunas das fontes: jogos casados / divergências de data / jogos que só a fonte tinha (acrescentados). RSSSF: times cuja linha (J V E D GP GC) bate com a tabela final.

| Temporada | Jogos | footballcsv | RSSSF (jogos) | ESPN | openfootball | football-data | RSSSF (tabela) |
|---|---|---|---|---|---|---|---|
| 1996 | 177 | – | – | – | – | – | – |
| 1997 | 173 | – | – | – | – | – | – |
| 1998 | 206 | – | – | – | – | – | – |
| 1999 | 208 | – | – | – | – | – | – |
| 2000 | 209 | – | – | – | – | – | – |
| 2001 | 176 | – | – | – | – | – | – |
| 2002 | 157 | – | – | – | – | – | – |
| 2003 | 161 | – | – | 161 / 5 / 0 | – | – | – |
| 2004 | 161 | – | – | 161 / 1 / 0 | – | – | – |
| 2005 | 203 | – | – | 203 / 41 / 0 | – | – | – |
| 2006 | 203 | – | – | 203 / 28 / 0 | – | – | – |
| 2007 | 206 | – | – | 206 / 26 / 0 | – | – | – |
| 2008 | 221 | – | – | 221 / 38 / 0 | – | – | – |
| 2009 | 236 | – | – | 236 / 50 / 0 | – | – | – |
| 2010 | 251 | – | – | 251 / 52 / 0 | – | – | – |
| 2011 | 319 | – | – | 319 / 83 / 0 | – | – | – |
| 2012 | 338 | – | – | 338 / 72 / 0 | – | 338 / 198 / 0 | – |
| 2013 | 339 | – | – | 338 / 74 / 0 | – | 337 / 175 / 1 | – |
| 2014 | 338 | – | – | 337 / 72 / 1 | – | 338 / 175 / 0 | – |
| 2015 | 357 | – | – | 357 / 0 / 0 | – | 357 / 264 / 0 | – |
| 2016 | 357 | – | – | 357 / 0 / 0 | – | 357 / 247 / 0 | – |
| 2017 | 391 | – | – | 0 / 0 / 391 | – | 391 / 283 / 0 | – |
| 2018 | 408 | – | – | 0 / 0 / 408 | – | 408 / 280 / 0 | – |
| 2019 | 421 | – | – | 0 / 0 / 421 | – | 421 / 290 / 0 | – |
| 2020 | 324 | – | – | 0 / 0 / 309 | – | 309 / 243 / 15 | – |
| 2021 | 472 | – | – | 0 / 0 / 472 | – | 472 / 351 / 0 | – |
| 2022 | 489 | – | – | 0 / 0 / 489 | – | 489 / 336 / 0 | – |
| 2023 | 521 | – | – | 0 / 0 / 521 | – | 521 / 470 / 0 | – |
| 2024 | 522 | – | – | 0 / 0 / 522 | – | 522 / 447 / 0 | – |
| 2025 | 540 | – | – | 0 / 0 / 540 | – | 540 / 439 / 0 | – |
| 2026 | 451 | – | – | 0 / 0 / 451 | – | 451 / 379 / 0 | – |

## Placares divergentes

- 2003 2003-11-15 san-jose-earthquakes x sporting-kansas-city: 2-2 -> 3-2 (outras fontes); ESPN 3-2
- 2003 2003-11-23 chicago-fire x san-jose-earthquakes: 2-4 -> 1-5 (outras fontes); ESPN 1-5
- 2014 2014-10-12 chivas-usa x colorado-rapids: 2-0 -> 2-1 (outras fontes); ESPN 2-1; football-data.co.uk 2-1
- 2015 2015-09-12 colorado-rapids x d-c-united: 1-0 -> 1-1 (outras fontes); ESPN 1-1; football-data.co.uk 1-1
- 2015 2015-09-19 new-york-city-fc x san-jose-earthquakes: 3-0 -> 3-2 (outras fontes); ESPN 3-2; football-data.co.uk 3-2
- 2003 2003-11-23 chicago-fire x san-jose-earthquakes 1-5: correção manual -> 2-4 2003-11-23 (final da MLS Cup 2003, San Jose 4-2 (a ESPN traz 1-5))

## Datas corrigidas

- 2006 2006-11-12 new-england-revolution x houston-dynamo: mando corrigido (ESPN)
- 2009 2009-11-22 real-salt-lake x la-galaxy: mando corrigido (ESPN)

## Clubes

- clube novo: Los Angeles FC (LAFC)
- clube novo: Minnesota United (Minnesota United FC)
- clube novo: Nashville SC (Nashville SC)
- clube novo: Charlotte FC (Charlotte FC)
- clube novo: Atlanta United (Atlanta United FC)
- clube novo: FC Cincinnati (FC Cincinnati)
- clube novo: Austin FC (Austin FC)
- clube novo: San Diego FC (San Diego FC)
- clube novo: Inter Miami (Inter Miami CF)
- clube novo: St. Louis City SC (St. Louis CITY SC)
- clube novo: Inter Miami (Inter Miami)
- clube novo: St. Louis City SC (St. Louis City)
- clube novo: Minnesota United (Minnesota United)
- clube novo: Los Angeles FC (Los Angeles FC)
- clube novo: Nashville SC (Nashville SC)
- clube novo: FC Cincinnati (FC Cincinnati)
- clube novo: Austin FC (Austin FC)
- clube novo: San Diego FC (San Diego FC)
- clube novo: Charlotte FC (Charlotte)
- clube novo: Atlanta United (Atlanta Utd)
