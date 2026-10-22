# Ligue 1: relatório da carga

Gerado por `scripts/ingest_europe.py`. Não editar à mão: rode o script de novo.

- 29147 jogos de 1938-39 a 2026-27; temporada = ano de início.
- Fonte principal: engsoccerdata até 2024-25; depois openfootball. Conferência jogo a jogo com footballcsv, openfootball e football-data.co.uk onde existem, e tabela final do RSSSF.
- Fora: 1932-33, 1933-34, 1934-35, 1935-36, 1936-37 (1142 jogos): o engsoccerdata dá a mesma data para o campeonato inteiro e não há outra fonte com datas.
- 59 jogos com data suspeita sem outra fonte para corrigir (ver abaixo).

## Jogos por temporada

Colunas das fontes: jogos casados / divergências de data / jogos que só a fonte tinha (acrescentados). RSSSF: times cuja linha (J V E D GP GC) bate com a tabela final.

| Temporada | Jogos | footballcsv | RSSSF (jogos) | openfootball | football-data | RSSSF (tabela) |
|---|---|---|---|---|---|---|
| 1938-39 | 240 | – | 240 / 0 / 0 | – | – | 16/16 |
| 1945-46 | 306 | – | 306 / 0 / 0 | – | – | 18/18 |
| 1946-47 | 340 | – | 340 / 0 / 0 | – | – | 0/20 |
| 1947-48 | 306 | – | 306 / 0 / 0 | – | – | 18/18 |
| 1948-49 | 306 | – | 306 / 0 / 0 | – | – | 18/18 |
| 1949-50 | 306 | – | 306 / 0 / 0 | – | – | 18/18 |
| 1950-51 | 306 | – | 306 / 0 / 0 | – | – | 18/18 |
| 1951-52 | 306 | – | 306 / 0 / 0 | – | – | 18/18 |
| 1952-53 | 306 | – | 306 / 0 / 0 | – | – | 17/18 |
| 1953-54 | 306 | – | 306 / 0 / 0 | – | – | 18/18 |
| 1954-55 | 306 | – | 306 / 0 / 0 | – | – | 18/18 |
| 1955-56 | 306 | – | 306 / 0 / 0 | – | – | 18/18 |
| 1956-57 | 306 | – | 306 / 0 / 0 | – | – | 18/18 |
| 1957-58 | 306 | – | 306 / 0 / 0 | – | – | 18/18 |
| 1958-59 | 380 | – | 380 / 0 / 0 | – | – | 20/20 |
| 1959-60 | 380 | – | 380 / 0 / 0 | – | – | 20/20 |
| 1960-61 | 380 | – | 380 / 0 / 0 | – | – | 20/20 |
| 1961-62 | 380 | – | 380 / 0 / 0 | – | – | 20/20 |
| 1962-63 | 380 | – | 380 / 0 / 0 | – | – | 20/20 |
| 1963-64 | 306 | – | 306 / 0 / 0 | – | – | 18/18 |
| 1964-65 | 306 | – | 306 / 0 / 0 | – | – | 18/18 |
| 1965-66 | 380 | – | 380 / 0 / 0 | – | – | 20/20 |
| 1966-67 | 380 | – | 380 / 0 / 0 | – | – | 20/20 |
| 1967-68 | 380 | – | 380 / 0 / 0 | – | – | 20/20 |
| 1968-69 | 306 | – | 306 / 0 / 0 | – | – | 18/18 |
| 1969-70 | 306 | – | 306 / 0 / 0 | – | – | 18/18 |
| 1970-71 | 380 | – | 380 / 0 / 0 | – | – | 20/20 |
| 1971-72 | 380 | – | 380 / 0 / 0 | – | – | 20/20 |
| 1972-73 | 380 | – | 380 / 0 / 0 | – | – | 20/20 |
| 1973-74 | 380 | – | 380 / 0 / 0 | – | – | 20/20 |
| 1974-75 | 380 | – | 380 / 0 / 0 | – | – | 20/20 |
| 1975-76 | 380 | – | 380 / 0 / 0 | – | – | 20/20 |
| 1976-77 | 380 | – | 380 / 0 / 0 | – | – | 20/20 |
| 1977-78 | 380 | – | 380 / 0 / 0 | – | – | 20/20 |
| 1978-79 | 380 | – | 380 / 0 / 0 | – | – | 20/20 |
| 1979-80 | 380 | – | 380 / 0 / 0 | – | – | 20/20 |
| 1980-81 | 380 | – | 380 / 0 / 0 | – | – | 20/20 |
| 1981-82 | 380 | – | 380 / 0 / 0 | – | – | 20/20 |
| 1982-83 | 380 | – | 380 / 0 / 0 | – | – | 20/20 |
| 1983-84 | 380 | – | 380 / 0 / 0 | – | – | 20/20 |
| 1984-85 | 380 | – | 380 / 0 / 0 | – | – | 20/20 |
| 1985-86 | 380 | – | 380 / 0 / 0 | – | – | 20/20 |
| 1986-87 | 380 | – | 380 / 0 / 0 | – | – | 18/20 |
| 1987-88 | 380 | – | 380 / 0 / 0 | – | – | 20/20 |
| 1988-89 | 380 | – | 380 / 0 / 0 | – | – | 20/20 |
| 1989-90 | 380 | – | 380 / 0 / 0 | – | – | 20/20 |
| 1990-91 | 380 | – | 380 / 0 / 0 | – | – | 18/20 |
| 1991-92 | 380 | – | – | – | – | 20/20 |
| 1992-93 | 380 | – | 380 / 0 / 0 | – | – | 19/20 |
| 1993-94 | 380 | – | – | – | 380 / 29 / 0 | 20/20 |
| 1994-95 | 380 | – | – | – | 0 / 0 / 380 | 18/20 |
| 1995-96 | 380 | – | 380 / 0 / 0 | – | 380 / 20 / 0 | 20/20 |
| 1996-97 | 380 | – | – | – | 380 / 1 / 0 | 20/20 |
| 1997-98 | 306 | – | 306 / 0 / 0 | – | 306 / 1 / 0 | 0/18 |
| 1998-99 | 306 | – | – | – | 306 / 10 / 0 | 18/18 |
| 1999-00 | 306 | – | – | – | 306 / 26 / 0 | 18/18 |
| 2000-01 | 306 | – | – | – | 306 / 1 / 0 | 14/18 |
| 2001-02 | 306 | – | – | – | 306 / 0 / 0 | 18/18 |
| 2002-03 | 380 | – | – | – | 380 / 0 / 0 | 20/20 |
| 2003-04 | 380 | – | – | – | 380 / 0 / 0 | 20/20 |
| 2004-05 | 380 | – | – | – | 380 / 0 / 0 | 20/20 |
| 2005-06 | 380 | – | – | – | 380 / 0 / 0 | 20/20 |
| 2006-07 | 380 | – | – | – | 379 / 0 / 1 | 18/20 |
| 2007-08 | 380 | – | – | – | 380 / 0 / 0 | 20/20 |
| 2008-09 | 380 | – | – | – | 380 / 1 / 0 | 20/20 |
| 2009-10 | 380 | – | – | – | 380 / 1 / 0 | 20/20 |
| 2010-11 | 380 | – | – | – | 380 / 1 / 0 | 20/20 |
| 2011-12 | 380 | – | – | – | 380 / 0 / 0 | 20/20 |
| 2012-13 | 380 | – | – | – | 380 / 0 / 0 | 20/20 |
| 2013-14 | 380 | – | – | – | 380 / 0 / 0 | 18/20 |
| 2014-15 | 380 | – | – | 380 / 0 / 0 | 380 / 0 / 0 | 20/20 |
| 2015-16 | 380 | – | – | 380 / 0 / 0 | 380 / 0 / 0 | 20/20 |
| 2016-17 | 379 | – | – | 380 / 0 / 0 | 380 / 0 / 0 | 18/20 |
| 2017-18 | 380 | – | – | 380 / 0 / 0 | 380 / 0 / 0 | 20/20 |
| 2018-19 | 380 | – | – | 380 / 0 / 0 | 380 / 0 / 0 | 20/20 |
| 2019-20 | 279 | – | – | 279 / 0 / 0 | 279 / 0 / 0 | 20/20 |
| 2020-21 | 380 | – | – | 380 / 0 / 0 | 380 / 0 / 0 | 20/20 |
| 2021-22 | 380 | – | – | 380 / 0 / 0 | 380 / 0 / 0 | 20/20 |
| 2022-23 | 380 | – | – | 380 / 0 / 0 | 380 / 0 / 0 | 20/20 |
| 2023-24 | 306 | – | – | 306 / 0 / 0 | 306 / 0 / 0 | 18/18 |
| 2024-25 | 306 | – | – | 306 / 0 / 0 | 306 / 0 / 0 | 18/18 |
| 2025-26 | 306 | – | – | 0 / 0 / 305 | 305 / 0 / 1 | 18/18 |
| 2026-27 | 45 | – | – | 0 / 0 / 45 | – | – |

## Tabela final diferente do RSSSF

Times cuja campanha (J V E D GP GC) não aparece na tabela do RSSSF. Os casos conferidos são resultados do tribunal (a tabela usa o placar do tribunal; aqui vale o de campo), erro de digitação na página do RSSSF ou temporada com mais de uma fase. Onde um placar só faria a tabela bater, ele aparece abaixo, para conferência.

- 1946-47: as-cannes 34; as-nancy 34; as-saint-etienne 34; fc-metz 34; fc-rouen 34; fc-sete 34; girondins-de-bordeaux 34; le-havre-ac 34; lille-osc 34; olympique-de-marseille 34; racing-club-de-france 34; rc-lens 34; rc-roubaix 34; rc-strasbourg 34; red-star 34; so-montpellier 34; stade-de-reims 34; stade-francais 34; stade-rennais 34; toulouse-fc 34
- 1952-53: racing-club-de-france 34
- 1986-87: as-nancy 38; racing-club-de-france 38
- 1990-91: paris-saint-germain 38; sporting-toulon-var 38
- 1992-93: olympique-de-marseille 38
- 1994-95: as-saint-etienne 38; girondins-de-bordeaux 38
  - a tabela bate se 1995-01-21 as-saint-etienne x girondins-de-bordeaux (4-1) for 2-1
- 1997-98: aj-auxerre 34; as-cannes 34; as-monaco 34; ea-guingamp 34; fc-metz 34; fc-nantes 34; girondins-de-bordeaux 34; lb-chateauroux 34; le-havre-ac 34; montpellier-hsc 34; olympique-de-marseille 34; olympique-lyonnais 34; paris-saint-germain 34; rc-lens 34; rc-strasbourg 34; sc-bastia 34; stade-rennais 34; toulouse-fc 34
- 2000-01: as-saint-etienne 34; fc-metz 34; stade-rennais 34; toulouse-fc 34
  - a tabela bate se 2001-01-13 fc-metz x stade-rennais (2-2) for 0-2
- 2006-07: fc-nantes 38; toulouse-fc 38
- 2013-14: fc-nantes 38; sc-bastia 38
- 2016-17: olympique-lyonnais 37; sc-bastia 37

## Placares divergentes

- 1945-46 1946-05-26 red-star x as-cannes: 1-1 -> 0-0 (tabela do RSSSF); RSSSF 0-0
- 1946-47 1946-11-03 rc-roubaix x so-montpellier: 2-1 -> 5-2 (outras fontes); RSSSF 5-2
- 1946-47 1946-09-15 rc-roubaix x rc-lens: 5-2 -> 4-1 (outras fontes); RSSSF 4-1
- 1946-47 1946-11-17 rc-roubaix x girondins-de-bordeaux: 4-1 -> 1-0 (outras fontes); RSSSF 1-0
- 1946-47 1947-01-19 rc-strasbourg x fc-rouen: mantido 2-1 (outra fonte troca o mando com a volta); RSSSF 3-1
- 1946-47 1946-12-01 lille-osc x le-havre-ac: 3-0 -> 5-0 (outras fontes); RSSSF 5-0
- 1946-47 1946-10-27 olympique-de-marseille x girondins-de-bordeaux: 0-0 -> 1-3 (outras fontes); RSSSF 1-3
- 1946-47 1946-10-27 so-montpellier x stade-francais: mantido 1-3 (outra fonte troca o mando com a volta); RSSSF 2-6
- 1946-47 1946-03-10 rc-lens x le-havre-ac: 8-0 -> 8-1 (outras fontes); RSSSF 8-1
- 1946-47 1946-08-18 fc-rouen x fc-sete: 6-1 -> 6-0 (outras fontes); RSSSF 6-0
- 1947-48 1948-04-25 stade-francais x racing-club-de-france: mantido 1-5 (outra fonte troca o mando com a volta); RSSSF 1-0
- 1947-48 1947-11-30 racing-club-de-france x stade-francais: mantido 0-1 (outra fonte troca o mando com a volta); RSSSF 5-1
- 1950-51 1951-02-11 lille-osc x toulouse-fc: mantido 1-2 (outra fonte troca o mando com a volta); RSSSF 2-0
- 1950-51 1950-09-24 toulouse-fc x lille-osc: mantido 0-2 (outra fonte troca o mando com a volta); RSSSF 2-1
- 1958-59 1959-05-24 fc-sochaux x stade-rennais: 4-3 -> 2-1 (tabela do RSSSF); RSSSF 2-1
- 1963-64 1964-05-17 toulouse-fc x stade-de-reims: mantido 0-0 (tabela do RSSSF); RSSSF 2-2
- 1968-69 1969-05-21 cs-sedan x sc-bastia: mantido 5-1 (outra fonte troca o mando com a volta); RSSSF 0-0
- 1968-69 1968-11-11 sc-bastia x cs-sedan: mantido 0-0 (outra fonte troca o mando com a volta); RSSSF 1-5
- 1971-72 1971-11-01 ogc-nice x lille-osc: 3-1 -> 3-0 (tabela do RSSSF); RSSSF 3-0
- 1977-78 1977-09-02 girondins-de-bordeaux x ogc-nice: mantido 3-5 (outra fonte troca o mando com a volta); RSSSF 0-1
- 1977-78 1977-09-23 olympique-lyonnais x paris-saint-germain: mantido 2-3 (outra fonte troca o mando com a volta); RSSSF 3-2
- 1977-78 1977-12-14 olympique-lyonnais x valenciennes-fc: mantido 1-2 (outra fonte troca o mando com a volta); RSSSF 0-1
- 1977-78 1978-04-21 olympique-de-marseille x fc-metz: mantido 4-0 (outra fonte troca o mando com a volta); RSSSF 2-0
- 1977-78 1978-04-05 olympique-de-marseille x fc-rouen: mantido 4-1 (outra fonte troca o mando com a volta); RSSSF 2-0
- 1977-78 1977-11-19 fc-metz x olympique-de-marseille: mantido 0-2 (outra fonte troca o mando com a volta); RSSSF 0-4
- 1977-78 1978-01-15 ogc-nice x girondins-de-bordeaux: mantido 1-0 (outra fonte troca o mando com a volta); RSSSF 5-3
- 1977-78 1978-02-12 paris-saint-germain x olympique-lyonnais: mantido 2-3 (outra fonte troca o mando com a volta); RSSSF 3-2
- 1977-78 1977-09-17 paris-saint-germain x fc-metz: mantido 2-0 (tabela do RSSSF); RSSSF 3-0
- 1977-78 1977-10-14 paris-saint-germain x troyes-af: mantido 8-2 (tabela do RSSSF); RSSSF 7-2
- 1977-78 1977-12-13 fc-rouen x olympique-de-marseille: mantido 0-2 (outra fonte troca o mando com a volta); RSSSF 1-4
- 1977-78 1977-09-02 fc-sochaux x fc-metz: mantido 4-0 (tabela do RSSSF); RSSSF 3-0
- 1977-78 1977-09-17 fc-sochaux x troyes-af: mantido 5-2 (tabela do RSSSF); RSSSF 6-2
- 1977-78 1978-04-05 valenciennes-fc x olympique-lyonnais: mantido 1-0 (outra fonte troca o mando com a volta); RSSSF 2-1
- 1978-79 1979-05-18 stade-laval x paris-saint-germain: mantido 2-3 (outra fonte troca o mando com a volta); RSSSF 2-1
- 1978-79 1978-10-27 olympique-lyonnais x as-monaco: mantido 0-0 (outra fonte troca o mando com a volta); RSSSF 1-0
- 1978-79 1978-10-28 olympique-de-marseille x stade-de-reims: mantido 0-0 (outra fonte troca o mando com a volta); RSSSF 1-0
- 1978-79 1979-05-18 as-monaco x olympique-lyonnais: mantido 0-1 (outra fonte troca o mando com a volta); RSSSF 0-0
- 1978-79 1979-04-20 paris-fc x stade-de-reims: mantido 2-1 (outra fonte troca o mando com a volta); RSSSF 2-0
- 1978-79 1978-10-27 paris-saint-germain x stade-laval: mantido 1-2 (outra fonte troca o mando com a volta); RSSSF 3-2
- 1978-79 1979-05-18 stade-de-reims x olympique-de-marseille: mantido 0-1 (outra fonte troca o mando com a volta); RSSSF 0-0
- 1978-79 1978-10-11 stade-de-reims x paris-fc: mantido 0-2 (outra fonte troca o mando com a volta); RSSSF 1-2
- 1982-83 1982-10-26 as-nancy x fc-sochaux: mantido 1-3 (tabela do RSSSF); RSSSF 1-2
- 1992-93 1993-05-20 valenciennes-fc x olympique-de-marseille: 0-0 -> 0-1 (outras fontes); RSSSF 0-1
- 2016-17 2017-04-16 sc-bastia x olympique-lyonnais: mantido 0-3; openfootball/football.json 0-0
- 2013-14 2013-08-10 fc-nantes x sc-bastia: 0-0 -> 2-0 (outras fontes); football-data.co.uk 2-0
- 2013-14 2013-08-10 fc-nantes x sc-bastia 2-0: correção manual -> 2-0 2013-08-10 (2-0 em campo; vitória dada ao Bastia (Nantes escalou suspenso))
- 2016-17 2017-04-16 sc-bastia x olympique-lyonnais 0-3: removido (interrompido no intervalo (0-0) por invasão; resultado dado no tribunal)

## Datas corrigidas

- 1946-47 rc-roubaix x fc-rouen 1-0: só no RSSSF, sem data; fica de fora
- 1946-47 stade-de-reims x rc-roubaix 1-2: só no RSSSF, sem data; fica de fora
- 1946-47 stade-de-reims x stade-francais 5-1: só no RSSSF, sem data; fica de fora
- 1946-47 stade-de-reims x racing-club-de-france 2-1: só no RSSSF, sem data; fica de fora
- 1946-47 rc-strasbourg x stade-francais 1-2: só no RSSSF, sem data; fica de fora
- 1946-47 rc-strasbourg x olympique-de-marseille 1-0: só no RSSSF, sem data; fica de fora
- 1946-47 rc-strasbourg x as-cannes 2-0: só no RSSSF, sem data; fica de fora
- 1946-47 lille-osc x stade-rennais 2-0: só no RSSSF, sem data; fica de fora
- 1946-47 lille-osc x as-saint-etienne 4-3: só no RSSSF, sem data; fica de fora
- 1946-47 lille-osc x so-montpellier 5-3: só no RSSSF, sem data; fica de fora
- 1946-47 stade-francais x red-star 0-1: só no RSSSF, sem data; fica de fora
- 1946-47 stade-francais x le-havre-ac 4-4: só no RSSSF, sem data; fica de fora
- 1946-47 olympique-de-marseille x stade-de-reims 3-2: só no RSSSF, sem data; fica de fora
- 1946-47 red-star x rc-roubaix 2-0: só no RSSSF, sem data; fica de fora
- 1946-47 red-star x as-nancy 1-2: só no RSSSF, sem data; fica de fora
- 1946-47 as-cannes x red-star 1-0: só no RSSSF, sem data; fica de fora
- 1946-47 stade-rennais x fc-metz 4-6: só no RSSSF, sem data; fica de fora
- 1946-47 fc-metz x rc-roubaix 0-1: só no RSSSF, sem data; fica de fora
- 1946-47 fc-metz x olympique-de-marseille 1-1: só no RSSSF, sem data; fica de fora
- 1946-47 fc-metz x as-cannes 7-1: só no RSSSF, sem data; fica de fora
- 1946-47 as-saint-etienne x fc-sete 1-1: só no RSSSF, sem data; fica de fora
- 1946-47 as-nancy x rc-lens 2-0: só no RSSSF, sem data; fica de fora
- 1946-47 fc-sete x as-cannes 2-1: só no RSSSF, sem data; fica de fora
- 1946-47 fc-sete x stade-rennais 5-0: só no RSSSF, sem data; fica de fora
- 1946-47 fc-sete x girondins-de-bordeaux 6-1: só no RSSSF, sem data; fica de fora
- 1946-47 toulouse-fc x olympique-de-marseille 0-0: só no RSSSF, sem data; fica de fora
- 1946-47 toulouse-fc x stade-rennais 1-0: só no RSSSF, sem data; fica de fora
- 1946-47 toulouse-fc x girondins-de-bordeaux 1-4: só no RSSSF, sem data; fica de fora
- 1946-47 racing-club-de-france x lille-osc 1-0: só no RSSSF, sem data; fica de fora
- 1946-47 so-montpellier x toulouse-fc 3-1: só no RSSSF, sem data; fica de fora
- 1946-47 rc-lens x as-saint-etienne 1-1: só no RSSSF, sem data; fica de fora
- 1946-47 rc-lens x so-montpellier 1-2: só no RSSSF, sem data; fica de fora
- 1946-47 rc-lens x girondins-de-bordeaux 1-0: só no RSSSF, sem data; fica de fora
- 1946-47 girondins-de-bordeaux x rc-strasbourg 2-5: só no RSSSF, sem data; fica de fora
- 1946-47 le-havre-ac x as-saint-etienne 0-0: só no RSSSF, sem data; fica de fora
- 1946-47 le-havre-ac x as-nancy 3-2: só no RSSSF, sem data; fica de fora
- 1946-47 le-havre-ac x racing-club-de-france 0-1: só no RSSSF, sem data; fica de fora
- 1946-47 fc-rouen x as-nancy 0-0: só no RSSSF, sem data; fica de fora
- 1946-47 fc-rouen x racing-club-de-france 0-2: só no RSSSF, sem data; fica de fora
- 1946-47 fc-rouen x so-montpellier 0-2: só no RSSSF, sem data; fica de fora

## Datas suspeitas mantidas

- 1946-47 1946-03-10 fc-sete x fc-metz
- 1946-47 1946-03-10 lille-osc x fc-rouen
- 1946-47 1946-03-10 rc-strasbourg x red-star
- 1946-47 1946-03-10 toulouse-fc x stade-de-reims
- 1946-47 1946-03-10 rc-lens x le-havre-ac
- 1946-47 1946-03-10 stade-francais x racing-club-de-france
- 1946-47 1946-03-10 stade-rennais x so-montpellier
- 1946-47 1946-03-10 as-cannes x as-nancy
- 1946-47 1946-03-10 girondins-de-bordeaux x as-saint-etienne
- 1946-47 1946-03-10 olympique-de-marseille x rc-roubaix
- 1946-47 1947-05-18 girondins-de-bordeaux x fc-metz
- 1946-47 1947-05-18 so-montpellier x fc-sete
- 1946-47 1947-05-18 as-nancy x lille-osc
- 1946-47 1947-05-18 rc-roubaix x le-havre-ac
- 1946-47 1947-05-18 as-cannes x stade-de-reims
- 1946-47 1947-05-18 stade-rennais x rc-strasbourg
- 1946-47 1947-05-18 as-saint-etienne x toulouse-fc
- 1946-47 1947-05-18 racing-club-de-france x rc-lens
- 1946-47 1947-05-18 olympique-de-marseille x red-star
- 1946-47 1947-05-18 fc-rouen x stade-francais
- 1958-59 1958-07-21 nimes-olympique x racing-club-de-france
- 1958-59 1958-07-21 as-monaco x stade-de-reims
- 1958-59 1958-07-21 rc-strasbourg x olympique-ales
- 1958-59 1958-07-21 cs-sedan x ogc-nice
- 1958-59 1958-07-21 stade-rennais x as-saint-etienne
- 1958-59 1958-07-21 limoges-fc x rc-lens
- 1958-59 1958-07-21 valenciennes-fc x olympique-de-marseille
- 1958-59 1958-07-21 toulouse-fc x angers-sco
- 1958-59 1958-07-21 olympique-lyonnais x as-nancy
- 1958-59 1958-07-21 lille-osc x fc-sochaux
- 1962-63 1963-03-30 as-nancy x rc-lens
- 1962-63 1963-03-30 as-nancy x racing-club-de-france
- 1969-70 1970-06-06 angers-sco x as-saint-etienne
- 1969-70 1970-06-06 cs-sedan x as-saint-etienne
- 1970-71 1970-11-18 as-angouleme x stade-rennais
- 1970-71 1970-11-18 ac-ajaccio x valenciennes-fc
- 1970-71 1970-11-18 sc-bastia x olympique-de-marseille
- 1970-71 1970-11-18 red-star x as-saint-etienne
- 1970-71 1970-11-18 stade-rennais x fc-nantes
- 1970-71 1970-11-18 fc-metz x as-angouleme
- 1970-71 1970-11-18 ogc-nice x angers-sco
- 1970-71 1970-11-18 nimes-olympique x cs-sedan
- 1970-71 1970-11-18 stade-de-reims x valenciennes-fc
- 1970-71 1970-11-18 olympique-lyonnais x fc-sochaux
- 1970-71 1970-11-18 rc-strasbourg x ac-ajaccio
- 1970-71 1970-11-18 girondins-de-bordeaux x as-nancy
- 1977-78 1978-01-18 ogc-nice x as-nancy
- 1977-78 1978-01-18 ogc-nice x as-saint-etienne
- 1988-89 1988-12-10 fc-nantes x paris-saint-germain
- 1988-89 1988-12-10 fc-metz x aj-auxerre
- 1988-89 1988-12-10 olympique-de-marseille x toulouse-fc
- 1988-89 1988-12-10 as-monaco x sm-caen
- 1988-89 1988-12-10 stade-laval x fc-sochaux
- 1988-89 1988-12-10 racing-club-de-france x ogc-nice
- 1988-89 1988-12-10 girondins-de-bordeaux x lille-osc
- 1988-89 1988-12-10 rc-strasbourg x montpellier-hsc
- 1988-89 1988-12-10 as-cannes x sporting-toulon-var
- 1988-89 1988-12-10 rc-lens x as-saint-etienne
- 1988-89 1988-12-10 fc-nantes x montpellier-hsc
