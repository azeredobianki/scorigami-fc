# Serie A: relatório da carga

Gerado por `scripts/ingest_europe.py`. Não editar à mão: rode o script de novo.

- 29319 jogos de 1929-30 a 2026-27; temporada = ano de início.
- Fonte principal: engsoccerdata até 2024-25; depois openfootball. Conferência jogo a jogo com footballcsv, openfootball e football-data.co.uk onde existem, e tabela final do RSSSF.
- 3 jogos com data suspeita sem outra fonte para corrigir (ver abaixo).

## Jogos por temporada

Colunas das fontes: jogos casados / divergências de data / jogos que só a fonte tinha (acrescentados). RSSSF: times cuja linha (J V E D GP GC) bate com a tabela final.

| Temporada | Jogos | footballcsv | RSSSF (jogos) | ESPN | openfootball | football-data | RSSSF (tabela) |
|---|---|---|---|---|---|---|---|
| 1929-30 | 306 | – | 292 / 43 / 0 | – | – | – | 16/18 |
| 1930-31 | 306 | – | 69 / 8 / 0 | – | – | – | 16/18 |
| 1931-32 | 306 | – | 290 / 1 / 0 | – | – | – | 18/18 |
| 1932-33 | 306 | – | 290 / 0 / 0 | – | – | – | 18/18 |
| 1933-34 | 306 | – | 294 / 70 / 0 | – | – | – | 13/18 |
| 1934-35 | 240 | – | 202 / 38 / 0 | – | – | – | 16/16 |
| 1935-36 | 240 | – | 214 / 0 / 0 | – | – | – | 16/16 |
| 1936-37 | 240 | – | 216 / 0 / 0 | – | – | – | 16/16 |
| 1937-38 | 240 | – | 240 / 0 / 0 | – | – | – | 16/16 |
| 1938-39 | 240 | – | 240 / 0 / 0 | – | – | – | 16/16 |
| 1939-40 | 240 | – | 240 / 8 / 0 | – | – | – | 16/16 |
| 1940-41 | 240 | – | 240 / 0 / 0 | – | – | – | 16/16 |
| 1941-42 | 240 | – | 240 / 0 / 0 | – | – | – | 16/16 |
| 1942-43 | 240 | – | 240 / 9 / 0 | – | – | – | 16/16 |
| 1945-46 | 350 | – | 322 / 16 / 2 | – | – | – | 14/25 |
| 1946-47 | 380 | – | 368 / 3 / 10 | – | – | – | 20/20 |
| 1947-48 | 420 | – | 371 / 166 / 39 | – | – | – | 21/21 |
| 1948-49 | 380 | – | 380 / 30 / 0 | – | – | – | 20/20 |
| 1949-50 | 380 | – | 380 / 21 / 0 | – | – | – | 20/20 |
| 1950-51 | 380 | – | 380 / 16 / 0 | – | – | – | 20/20 |
| 1951-52 | 380 | – | 380 / 42 / 0 | – | – | – | 20/20 |
| 1952-53 | 306 | – | 306 / 2 / 0 | – | – | – | 16/18 |
| 1953-54 | 306 | – | 306 / 3 / 0 | – | – | – | 18/18 |
| 1954-55 | 306 | – | 306 / 7 / 0 | – | – | – | 18/18 |
| 1955-56 | 306 | – | 306 / 41 / 0 | – | – | – | 18/18 |
| 1956-57 | 306 | – | 306 / 2 / 0 | – | – | – | 18/18 |
| 1957-58 | 308 | – | 301 / 20 / 2 | – | – | – | 18/19 |
| 1958-59 | 306 | – | 302 / 5 / 0 | – | – | – | 16/18 |
| 1959-60 | 306 | – | 299 / 4 / 0 | – | – | – | 18/18 |
| 1960-61 | 306 | – | 303 / 9 / 0 | – | – | – | 18/18 |
| 1961-62 | 306 | – | 302 / 24 / 0 | – | – | – | 18/18 |
| 1962-63 | 306 | – | 302 / 14 / 0 | – | – | – | 16/18 |
| 1963-64 | 306 | – | 302 / 14 / 0 | – | – | – | 16/18 |
| 1964-65 | 306 | – | 302 / 5 / 0 | – | – | – | 18/18 |
| 1965-66 | 306 | – | 302 / 14 / 0 | – | – | – | 18/18 |
| 1966-67 | 306 | – | 304 / 9 / 0 | – | – | – | 18/18 |
| 1967-68 | 240 | – | 236 / 10 / 0 | – | – | – | 16/16 |
| 1968-69 | 240 | – | 236 / 0 / 0 | – | – | – | 16/16 |
| 1969-70 | 240 | – | 236 / 14 / 0 | – | – | – | 16/16 |
| 1970-71 | 240 | – | 236 / 2 / 0 | – | – | – | 16/16 |
| 1971-72 | 240 | – | 234 / 4 / 0 | – | – | – | 16/16 |
| 1972-73 | 240 | – | 236 / 12 / 0 | – | – | – | 15/16 |
| 1973-74 | 240 | – | 236 / 13 / 0 | – | – | – | 16/16 |
| 1974-75 | 240 | – | 236 / 119 / 0 | – | – | – | 16/16 |
| 1975-76 | 240 | – | 240 / 17 / 0 | – | – | – | 16/16 |
| 1976-77 | 240 | – | 240 / 3 / 0 | – | – | – | 16/16 |
| 1977-78 | 240 | – | 238 / 3 / 0 | – | – | – | 16/16 |
| 1978-79 | 240 | – | 236 / 1 / 0 | – | – | – | 16/16 |
| 1979-80 | 240 | – | 240 / 10 / 0 | – | – | – | 16/16 |
| 1980-81 | 240 | – | 240 / 3 / 0 | – | – | – | 16/16 |
| 1981-82 | 240 | – | 240 / 9 / 0 | – | – | – | 16/16 |
| 1982-83 | 240 | – | 240 / 0 / 0 | – | – | – | 16/16 |
| 1983-84 | 240 | – | 240 / 16 / 0 | – | – | – | 16/16 |
| 1984-85 | 240 | – | 240 / 1 / 0 | – | – | – | 16/16 |
| 1985-86 | 240 | – | 240 / 1 / 0 | – | – | – | 15/16 |
| 1986-87 | 240 | – | 240 / 2 / 0 | – | – | – | 16/16 |
| 1987-88 | 240 | – | 240 / 0 / 0 | – | – | – | 16/16 |
| 1988-89 | 306 | – | 305 / 9 / 0 | – | – | – | 18/18 |
| 1989-90 | 306 | – | 306 / 0 / 0 | – | – | – | 16/18 |
| 1990-91 | 306 | – | 305 / 0 / 0 | – | – | – | 18/18 |
| 1991-92 | 306 | – | 306 / 3 / 0 | – | – | – | 18/18 |
| 1992-93 | 306 | – | – | – | – | – | 18/18 |
| 1993-94 | 306 | – | 304 / 9 / 0 | – | – | 306 / 0 / 0 | 18/18 |
| 1994-95 | 306 | – | 304 / 24 / 1 | – | – | 306 / 0 / 0 | 18/18 |
| 1995-96 | 306 | – | – | – | – | 306 / 1 / 0 | 18/18 |
| 1996-97 | 306 | – | – | – | – | 306 / 0 / 0 | 18/18 |
| 1997-98 | 306 | – | 305 / 29 / 0 | – | – | 306 / 0 / 0 | 18/18 |
| 1998-99 | 306 | – | – | – | – | 306 / 1 / 0 | 18/18 |
| 1999-00 | 306 | – | – | – | – | 306 / 0 / 0 | 17/18 |
| 2000-01 | 306 | – | – | – | – | 306 / 64 / 0 | 18/18 |
| 2001-02 | 306 | – | – | – | – | 306 / 1 / 0 | 18/18 |
| 2002-03 | 306 | – | – | – | – | 306 / 0 / 0 | 18/18 |
| 2003-04 | 306 | – | – | – | – | 306 / 0 / 0 | 18/18 |
| 2004-05 | 380 | – | – | – | – | 380 / 0 / 0 | 20/20 |
| 2005-06 | 380 | – | – | – | – | 380 / 0 / 0 | 18/20 |
| 2006-07 | 380 | – | – | – | – | 380 / 0 / 0 | 20/20 |
| 2007-08 | 380 | – | – | – | – | 380 / 0 / 0 | 20/20 |
| 2008-09 | 380 | – | – | – | – | 380 / 0 / 0 | 20/20 |
| 2009-10 | 380 | – | – | – | – | 380 / 0 / 0 | 20/20 |
| 2010-11 | 380 | – | – | – | – | 380 / 1 / 0 | 20/20 |
| 2011-12 | 380 | – | – | – | – | 380 / 1 / 0 | 20/20 |
| 2012-13 | 380 | – | – | – | – | 380 / 1 / 0 | 20/20 |
| 2013-14 | 380 | – | – | – | 380 / 0 / 0 | 380 / 0 / 0 | 20/20 |
| 2014-15 | 380 | – | – | – | 380 / 0 / 0 | 380 / 0 / 0 | 20/20 |
| 2015-16 | 380 | – | – | – | 380 / 0 / 0 | 380 / 0 / 0 | 20/20 |
| 2016-17 | 380 | – | – | – | 380 / 0 / 0 | 380 / 0 / 0 | 20/20 |
| 2017-18 | 380 | – | – | – | 380 / 0 / 0 | 380 / 0 / 0 | 20/20 |
| 2018-19 | 380 | – | – | – | 380 / 0 / 0 | 380 / 0 / 0 | 20/20 |
| 2019-20 | 380 | – | – | – | 380 / 0 / 0 | 380 / 0 / 0 | 20/20 |
| 2020-21 | 380 | – | – | – | 380 / 0 / 0 | 380 / 0 / 0 | 18/20 |
| 2021-22 | 380 | – | – | – | 380 / 0 / 0 | 380 / 0 / 0 | 20/20 |
| 2022-23 | 380 | – | – | – | 380 / 0 / 0 | 380 / 0 / 0 | 20/20 |
| 2023-24 | 380 | – | – | – | 380 / 0 / 0 | 380 / 0 / 0 | 20/20 |
| 2024-25 | 380 | – | – | – | 370 / 0 / 0 | 380 / 0 / 0 | 20/20 |
| 2025-26 | 380 | – | – | – | 0 / 0 / 380 | 380 / 0 / 0 | 20/20 |
| 2026-27 | 71 | – | – | – | 0 / 0 / 50 | 50 / 0 / 21 | – |

## Tabela final diferente do RSSSF

Times cuja campanha (J V E D GP GC) não aparece na tabela do RSSSF. Os casos conferidos são resultados do tribunal (a tabela usa o placar do tribunal; aqui vale o de campo), erro de digitação na página do RSSSF ou temporada com mais de uma fase. Onde um placar só faria a tabela bater, ele aparece abaixo, para conferência.

- 1929-30: ac-milan 34; us-cremonese 34
  - a tabela bate se 1929-12-15 ac-milan x us-cremonese (5-2) for 4-2
  - a tabela bate se 1930-05-18 us-cremonese x ac-milan (0-3) for 0-2
- 1930-31: lazio 34; legnano 34
  - a tabela bate se 1930-12-14 legnano x lazio (0-1) for 0-2
  - a tabela bate se 1931-05-31 lazio x legnano (4-0) for 5-0
- 1933-34: as-roma 34; bologna-fc 34; juventus-fc 34; torino-fc 34; unione-triestina 34
  - a tabela bate se 1934-04-29 torino-fc x as-roma (3-1) for 3-6
  - a tabela bate se 1934-05-15 juventus-fc x bologna-fc (4-2) for 4-1
- 1945-46: ac-milan 42; andrea-doria 26; as-bari 34; as-roma 34; brescia-calcio 28; internazionale 40; juventus-fc 40; livorno 34; sampierdarenese 26; ssc-napoli 34; torino-fc 40
  - a tabela bate se 1945-10-21 andrea-doria x sampierdarenese (0-0) for 0-1
- 1952-53: torino-fc 34; us-palermo 34
  - a tabela bate se 1952-11-30 torino-fc x us-palermo (3-0) for 3-1
- 1957-58: hellas-verona 36
- 1958-59: calcio-padova 34; lazio 34
  - a tabela bate se 1959-01-04 calcio-padova x lazio (3-0) for 3-1
- 1962-63: ssc-napoli 34; us-palermo 34
  - a tabela bate se 1962-12-16 ssc-napoli x us-palermo (3-0) for 3-1
- 1963-64: as-bari 34; genoa 34
  - a tabela bate se 1964-05-03 as-bari x genoa (1-2) for 0-2
- 1972-73: torino-fc 30
- 1985-86: atalanta 30
- 1989-90: atalanta 34; ssc-napoli 34
- 1999-00: as-roma 34
- 2005-06: empoli-fc 38; messina 38
  - a tabela bate se 2006-05-07 messina x empoli-fc (1-2) for 0-3
- 2020-21: as-roma 38; hellas-verona 38
  - a tabela bate se 2020-09-19 hellas-verona x as-roma (0-0) for 3-0

## Placares divergentes

- 1933-34 1934-01-07 ac-milan x casale: 6-1 -> 6-2 (tabela do RSSSF); RSSSF 6-2
- 1933-34 1934-01-28 livorno x us-palermo: 3-1 -> 3-2 (tabela do RSSSF); RSSSF 3-2
- 1934-35 1935-01-06 alessandria x as-roma: 1-1 -> 1-6 (tabela do RSSSF); RSSSF 1-6
- 1947-48 1948-06-13 ac-milan x ssc-napoli: 4-2 -> 3-0 (tabela do RSSSF); RSSSF 3-0
- 1970-71 1970-09-27 hellas-verona x internazionale: mantido 1-2 (tabela do RSSSF); RSSSF 2-1
- 2020-21 2020-09-19 hellas-verona x as-roma: 0-0 -> 3-0 (tabela do RSSSF); openfootball/football.json 3-0
- 1989-90 1990-04-08 atalanta x ssc-napoli 0-2: correção manual -> 0-0 1990-04-08 (0-0 em campo; 0-2 para o Napoli no tribunal (Alemão atingido por moeda))
- 2020-21 2020-09-19 hellas-verona x as-roma 3-0: correção manual -> 0-0 2020-09-19 (0-0 em campo; 3-0 para o Verona no tribunal (Roma escalou jogador irregular))

## Datas corrigidas

- 1934-35 brescia-calcio x bologna-fc: data 1935-02-10 -> 1935-01-27 (RSSSF)
- 1934-35 lazio x us-palermo: data 1935-02-10 -> 1935-01-27 (RSSSF)
- 1934-35 ac-milan x as-roma: data 1935-02-10 -> 1935-01-27 (RSSSF)
- 1934-35 ssc-napoli x unione-triestina: data 1935-02-10 -> 1935-01-27 (RSSSF)
- 1934-35 pro-vercelli x juventus-fc: data 1935-02-10 -> 1935-01-27 (RSSSF)
- 1934-35 torino-fc x internazionale: data 1935-02-10 -> 1935-01-27 (RSSSF)
- 1934-35 alessandria x brescia-calcio: data 1935-02-10 -> 1935-02-03 (RSSSF)
- 1934-35 internazionale x lazio: data 1935-02-10 -> 1935-02-03 (RSSSF)
- 1934-35 bologna-fc x ssc-napoli: data 1935-02-10 -> 1935-02-03 (RSSSF)
- 1934-35 juventus-fc x acf-fiorentina: data 1935-02-10 -> 1935-02-03 (RSSSF)
- 1934-35 livorno x torino-fc: data 1935-02-10 -> 1935-02-03 (RSSSF)
- 1934-35 us-palermo x ac-milan: data 1935-02-10 -> 1935-02-03 (RSSSF)
- 1934-35 as-roma x pro-vercelli: data 1935-02-10 -> 1935-02-03 (RSSSF)
- 1945-46 as-roma x us-palermo: data 1945-12-30 -> 1946-01-06 (RSSSF)
- 1945-46 ssc-napoli x ac-siena: data 1945-12-23 -> 1946-01-13 (RSSSF)
- 1945-46 ac-siena x ssc-napoli: data 1946-03-24 -> 1946-03-31 (RSSSF)
- 1947-48 1947-10-26 ssc-napoli x alessandria: mando corrigido (RSSSF)
- 1947-48 ac-milan x ssc-napoli: data 1947-08-06 -> 1948-06-13 (RSSSF)
- 1952-53 1953-05-03 pro-patria x novara-calcio: mando corrigido (RSSSF)
- 1965-66 1965-11-21 juventus-fc x torino-fc: mando corrigido (RSSSF)
- 1965-66 1966-01-23 cagliari-calcio x bologna-fc: mando corrigido (RSSSF)
- 1982-83 ascoli-calcio x ssc-napoli: data 1983-03-20 -> 1983-03-27 (RSSSF)
- 1982-83 us-avellino x sampdoria: data 1983-03-20 -> 1983-03-27 (RSSSF)
- 1982-83 cagliari-calcio x hellas-verona: data 1983-03-20 -> 1983-03-27 (RSSSF)
- 1982-83 us-catanzaro x pisa-sc: data 1983-03-20 -> 1983-03-27 (RSSSF)
- 1982-83 acf-fiorentina x as-roma: data 1983-03-20 -> 1983-03-27 (RSSSF)
- 1982-83 genoa x internazionale: data 1983-03-20 -> 1983-03-27 (RSSSF)
- 1982-83 torino-fc x juventus-fc: data 1983-03-20 -> 1983-03-27 (RSSSF)
- 1982-83 udinese-calcio x ac-cesena: data 1983-03-20 -> 1983-03-27 (RSSSF)
- 1991-92 ascoli-calcio x lazio: data 1991-09-15 -> 1991-09-22 (RSSSF)
- 1991-92 atalanta x juventus-fc: data 1991-09-15 -> 1991-09-22 (RSSSF)
- 1991-92 us-foggia x cagliari-calcio: data 1991-09-15 -> 1991-09-22 (RSSSF)
- 1991-92 ac-milan x acf-fiorentina: data 1991-09-15 -> 1991-09-22 (RSSSF)
- 1991-92 parma x us-cremonese: data 1991-09-15 -> 1991-09-22 (RSSSF)
- 1991-92 as-roma x genoa: data 1991-09-15 -> 1991-09-22 (RSSSF)
- 1991-92 sampdoria x internazionale: data 1991-09-15 -> 1991-09-22 (RSSSF)
- 1991-92 torino-fc x ssc-napoli: data 1991-09-15 -> 1991-09-22 (RSSSF)
- 1991-92 hellas-verona x as-bari: data 1991-09-15 -> 1991-09-22 (RSSSF)
- 2001-02 brescia-calcio x us-lecce: data 2001-09-22 -> 2001-09-16 (football-data.co.uk)
- 1947-48 1947-08-06 unione-triestina x venezia 2-0: removido (data impossível, confronto repetido ou time de outra temporada, não está em outra fonte)
- 1947-48 1947-08-06 sampdoria x internazionale 1-5: removido (data impossível, confronto repetido ou time de outra temporada, não está em outra fonte)
- 1947-48 1947-08-06 vicenza x livorno 5-2: removido (data impossível, confronto repetido ou time de outra temporada, não está em outra fonte)
- 1947-48 1947-08-06 modena-fc x torino-fc 2-4: removido (data impossível, confronto repetido ou time de outra temporada, não está em outra fonte)
- 1947-48 1947-08-06 brescia-calcio x atalanta 4-1: removido (data impossível, confronto repetido ou time de outra temporada, não está em outra fonte)
- 1947-48 1947-08-06 bologna-fc x acf-fiorentina 1-1: removido (data impossível, confronto repetido ou time de outra temporada, não está em outra fonte)
- 1947-48 1947-08-06 as-bari x genoa 2-0: removido (data impossível, confronto repetido ou time de outra temporada, não está em outra fonte)
- 1947-48 1947-08-06 as-roma x alessandria 0-2: removido (data impossível, confronto repetido ou time de outra temporada, não está em outra fonte)
- 1947-48 1947-08-06 juventus-fc x lazio 3-3: removido (data impossível, confronto repetido ou time de outra temporada, não está em outra fonte)
- 1994-95 1995-06-04 calcio-padova x genoa 1-1: removido (jogo de desempate, fora do turno e returno; RSSSF)

## Datas suspeitas mantidas

- 1934-35 1935-02-10 sampierdarenese x livorno
- 1934-35 1935-02-10 acf-fiorentina x alessandria
- 1934-35 1935-02-10 unione-triestina x sampierdarenese
