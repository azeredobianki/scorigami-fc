# Liga MX: relatório da carga

Gerado por `scripts/ingest_latam.py`. Não editar à mão: rode o script de novo.

- 25398 jogos de 1943-44 a 2026-27: 16743 do RSSSF, 8655 do ESPN.
- Temporada = ano de início (Apertura 2024 e Clausura 2025 = 2024-25). O torneio México 70 fica em 1969-70.
- Fonte principal: RSSSF para os torneios que começam antes de 07/2001; ESPN depois. Conferência jogo a jogo com a outra fonte nos anos em que as duas existem, páginas do RSSSF de 2001-02 em diante, football-data.co.uk (2012 em diante) e openfootball.
- Placar de campo, com prorrogação quando houve. Pênaltis nos jogos da ESPN.
- Fora da carga: 13 jogos abandonados e não completados, 0 sem data, 9 linhas do RSSSF que não são jogo de clube conhecido (notas, artilharia).
- Incluídos: temporada regular, liguilla e repescagem (repechaje, reclasificación, play-in).
- Fora: Copa México, Campeón de Campeones, rebaixamento, pré-Libertadores, torneios de novos valores e divisões de acesso.

## Jogos por temporada

Colunas das fontes: jogos casados / com data diferente (1 a 3 dias) / com placar diferente / jogos que só a outra fonte tem (não acrescentados). RSSSF (tabela): times cuja campanha (J V E D GP GC) bate com a tabela do torneio.

| Temporada | Jogos | Fonte | ESPN | RSSSF | football-data | openfootball | RSSSF (tabela) |
|---|---|---|---|---|---|---|---|
| 1943-44 | 91 | RSSSF | – | – | – | – | 10/10 |
| 1944-45 | 165 | RSSSF | – | – | – | – | 13/13 |
| 1945-46 | 239 | RSSSF | – | – | – | – | 14/16 |
| 1946-47 | 210 | RSSSF | – | – | – | – | 15/15 |
| 1947-48 | 211 | RSSSF | – | – | – | – | 13/15 |
| 1948-49 | 208 | RSSSF | – | – | – | – | 11/15 |
| 1949-50 | 182 | RSSSF | – | – | – | – | 14/14 |
| 1950-51 | 132 | RSSSF | – | – | – | – | 12/12 |
| 1951-52 | 132 | RSSSF | – | – | – | – | 12/12 |
| 1952-53 | 132 | RSSSF | – | – | – | – | 10/12 |
| 1953-54 | 136 | RSSSF | – | – | – | – | 12/12 |
| 1954-55 | 142 | RSSSF | – | – | – | – | 13/15 |
| 1955-56 | 180 | RSSSF | – | – | – | – | 10/14 |
| 1956-57 | 155 | RSSSF | – | – | – | – | 11/13 |
| 1957-58 | 182 | RSSSF | – | – | – | – | 14/14 |
| 1958-59 | 182 | RSSSF | – | – | – | – | 14/14 |
| 1959-60 | 181 | RSSSF | – | – | – | – | 12/14 |
| 1960-61 | 182 | RSSSF | – | – | – | – | 13/14 |
| 1961-62 | 182 | RSSSF | – | – | – | – | 14/14 |
| 1962-63 | 182 | RSSSF | – | – | – | – | 14/14 |
| 1963-64 | 189 | RSSSF | – | – | – | – | 14/17 |
| 1964-65 | 240 | RSSSF | – | – | – | – | 16/16 |
| 1965-66 | 240 | RSSSF | – | – | – | – | 14/16 |
| 1966-67 | 241 | RSSSF | – | – | – | – | 11/16 |
| 1967-68 | 239 | RSSSF | – | – | – | – | 14/16 |
| 1968-69 | 240 | RSSSF | – | – | – | – | 16/16 |
| 1969-70 | 464 | RSSSF | – | – | – | – | 42/48 |
| 1970-71 | 307 | RSSSF | – | – | – | – | 16/18 |
| 1971-72 | 312 | RSSSF | – | – | – | – | 18/18 |
| 1972-73 | 314 | RSSSF | – | – | – | – | 18/18 |
| 1973-74 | 312 | RSSSF | – | – | – | – | 16/18 |
| 1974-75 | 391 | RSSSF | – | – | – | – | 18/20 |
| 1975-76 | 393 | RSSSF | – | – | – | – | 16/20 |
| 1976-77 | 405 | RSSSF | – | – | – | – | 18/20 |
| 1977-78 | 391 | RSSSF | – | – | – | – | 16/20 |
| 1978-79 | 405 | RSSSF | – | – | – | – | 18/20 |
| 1979-80 | 406 | RSSSF | – | – | – | – | 20/20 |
| 1980-81 | 406 | RSSSF | – | – | – | – | 20/20 |
| 1981-82 | 394 | RSSSF | – | – | – | – | 20/20 |
| 1982-83 | 394 | RSSSF | – | – | – | – | 20/20 |
| 1983-84 | 393 | RSSSF | – | – | – | – | 18/20 |
| 1984-85 | 394 | RSSSF | – | – | – | – | 17/21 |
| 1985-86 | 287 | RSSSF | – | – | – | – | 18/20 |
| 1986-87 | 432 | RSSSF | – | – | – | – | 15/21 |
| 1987-88 | 394 | RSSSF | – | – | – | – | 20/20 |
| 1988-89 | 403 | RSSSF | – | – | – | – | 15/20 |
| 1989-90 | 390 | RSSSF | – | – | – | – | 17/20 |
| 1990-91 | 394 | RSSSF | – | – | – | – | 18/20 |
| 1991-92 | 398 | RSSSF | – | – | – | – | 20/20 |
| 1992-93 | 398 | RSSSF | – | – | – | – | 17/20 |
| 1993-94 | 397 | RSSSF | – | – | – | – | 18/21 |
| 1994-95 | 360 | RSSSF | – | – | – | – | 18/20 |
| 1995-96 | 324 | RSSSF | – | – | – | – | 18/18 |
| 1996-97 | 339 | RSSSF | – | – | – | – | 33/36 |
| 1997-98 | 339 | RSSSF | – | – | – | – | 34/36 |
| 1998-99 | 336 | RSSSF | – | – | – | – | 35/36 |
| 1999-00 | 336 | RSSSF | – | – | – | – | 35/36 |
| 2000-01 | 340 | RSSSF | – | – | – | – | 34/36 |
| 2001-02 | 374 | ESPN | – | 370 / 15 / 1 / 4 | – | – | – |
| 2002-03 | 410 | ESPN | – | 403 / 8 / 0 / 7 | – | – | – |
| 2003-04 | 414 | ESPN | – | 406 / 2 / 1 / 8 | – | – | – |
| 2004-05 | 334 | ESPN | – | 296 / 1 / 0 / 3 | – | – | – |
| 2005-06 | 334 | ESPN | – | 295 / 2 / 0 / 4 | – | – | – |
| 2006-07 | 341 | ESPN | – | 331 / 2 / 0 / 10 | – | – | – |
| 2007-08 | 342 | ESPN | – | 337 / 1 / 0 / 5 | – | – | – |
| 2008-09 | 334 | ESPN | – | 292 / 4 / 0 / 4 | – | – | – |
| 2009-10 | 334 | ESPN | – | – | – | – | – |
| 2010-11 | 334 | ESPN | – | – | – | – | – |
| 2011-12 | 334 | ESPN | – | 252 / 0 / 0 / 4 | – | – | – |
| 2012-13 | 334 | ESPN | – | 279 / 0 / 0 / 3 | 299 / 193 / 0 / 1 | – | – |
| 2013-14 | 334 | ESPN | – | 280 / 0 / 0 / 6 | 334 / 210 / 0 / 0 | – | – |
| 2014-15 | 334 | ESPN | – | 280 / 0 / 0 / 6 | 334 / 221 / 0 / 0 | – | – |
| 2015-16 | 334 | ESPN | – | 248 / 0 / 0 / 6 | 334 / 247 / 0 / 0 | – | – |
| 2016-17 | 334 | ESPN | – | 282 / 0 / 0 / 2 | 334 / 255 / 0 / 0 | – | – |
| 2017-18 | 334 | ESPN | – | 252 / 0 / 0 / 2 | 334 / 259 / 0 / 0 | – | – |
| 2018-19 | 334 | ESPN | – | 252 / 1 / 0 / 3 | 334 / 245 / 0 / 0 | – | – |
| 2019-20 | 275 | ESPN | – | 218 / 0 / 0 / 2 | 275 / 207 / 0 / 0 | – | – |
| 2020-21 | 341 | ESPN | – | 241 / 2 / 0 / 5 | 341 / 279 / 0 / 1 | 341 / 0 / 0 / 1 | – |
| 2021-22 | 342 | ESPN | – | 239 / 1 / 0 / 4 | 342 / 272 / 1 / 0 | – | – |
| 2022-23 | 342 | ESPN | – | 241 / 0 / 0 / 5 | 342 / 282 / 0 / 0 | – | – |
| 2023-24 | 340 | ESPN | – | 234 / 1 / 0 / 9 | 340 / 303 / 0 / 0 | – | – |
| 2024-25 | 340 | ESPN | – | 232 / 0 / 0 / 8 | 340 / 307 / 0 / 0 | 340 / 0 / 0 / 0 | – |
| 2025-26 | 337 | ESPN | – | 18 / 2 / 0 / 6 | 336 / 293 / 0 / 0 | – | – |
| 2026-27 | 115 | ESPN | – | – | 110 / 107 / 0 / 0 | – | – |

## Tabela do RSSSF diferente

Times cuja campanha nos jogos carregados não aparece na tabela do torneio. Nos casos conferidos: jogo decidido no tribunal ou por W.O. (conta na tabela e não tem placar), jogo que falta na página, temporadas de 1988-89 e 1989-90 (empate decidido nos pênaltis muda as colunas), grupos que a tabela soma de outro jeito.

- 1999-00 (mex00, Verano 2000): Tigres UANL [17, 5, 7, 5, 25, 22]
- 2000-01 (mex01, Invierno 2000): América [17, 7, 5, 5, 26, 23]
- 2000-01 (mex01, Verano 2001): América [17, 7, 7, 3, 25, 15]
- 1945-46 (mex46, torneio): ADO [29, 14, 4, 11, 49, 51]; San Sebastián [29, 5, 5, 19, 45, 87]
- 1947-48 (mex48, torneio): Guadalajara [27, 9, 7, 11, 53, 66]; San Sebastián [27, 11, 4, 12, 47, 74]
- 1948-49 (mex49, torneio): San Sebastián [27, 10, 8, 9, 46, 51]; Veracruz [27, 7, 9, 11, 49, 57]; León [27, 17, 3, 7, 60, 41]; ADO [27, 10, 7, 10, 54, 52]
- 1952-53 (mex53, torneio): Guadalajara [22, 9, 4, 9, 41, 33]; Puebla [22, 8, 6, 8, 35, 28]
- 1954-55 (mex55, torneio): Marte [26, 3, 8, 15, 26, 61]; Atlante [26, 7, 8, 11, 36, 39]
- 1955-56 (mex56, torneio): Tampico [25, 12, 6, 7, 38, 31]; Atlas [23, 8, 3, 12, 40, 51]; Toluca [25, 10, 9, 6, 48, 31]; Atlante [25, 12, 6, 7, 52, 37]
- 1956-57 (mex57, torneio): Zacatepec [23, 4, 6, 13, 22, 41]; Monterrey [23, 4, 7, 12, 22, 44]
- 1959-60 (mex60, torneio): Atlas [25, 10, 9, 6, 42, 33]; Toluca [25, 12, 6, 7, 47, 33]
- 1960-61 (mex61, torneio): Atlas [26, 11, 7, 8, 39, 31]
- 1963-64 (mex64, torneio): Nacional (Guadalajara) [29, 5, 6, 18, 30, 74]; León [26, 8, 7, 11, 33, 34]; Atlante [26, 7, 8, 11, 31, 38]
- 1965-66 (mex66, torneio): Guadalajara [30, 17, 6, 7, 47, 34]; Necaxa [30, 10, 9, 11, 35, 40]
- 1966-67 (mex67, torneio): Guadalajara [30, 12, 10, 8, 36, 29]; Toluca [31, 18, 7, 6, 49, 24]; Oro [30, 9, 9, 12, 38, 44]; León [31, 14, 6, 11, 43, 39]; Veracruz [30, 7, 11, 12, 46, 55]
- 1967-68 (mex68, torneio): Oro [29, 5, 11, 13, 35, 54]; Toluca [29, 17, 8, 4, 53, 28]
- 1969-70 (mex6970, torneio): América [30, 12, 7, 11, 50, 48]; Cruz Azul [30, 13, 12, 5, 40, 19]; León [30, 10, 10, 10, 43, 43]; Irapuato [30, 7, 8, 15, 26, 36]; Pumas UNAM [30, 9, 11, 10, 42, 43]; Pachuca [30, 11, 7, 12, 41, 50]
- 1970-71 (mex71, torneio): América [33, 16, 10, 7, 54, 33]; Atlante [33, 9, 16, 8, 33, 29]
- 1973-74 (mex74, torneio): Atlante [34, 6, 12, 16, 44, 67]; Atlético Español [34, 14, 13, 7, 66, 47]
- 1974-75 (mex75, torneio): América [37, 16, 13, 8, 64, 43]; Atlético Español [37, 20, 7, 10, 62, 38]
- 1975-76 (mex76, torneio): Monterrey [37, 16, 12, 9, 47, 36]; Laguna [38, 12, 15, 11, 53, 47]; Unión de Curtidores [38, 10, 20, 8, 53, 47]; Veracruz [37, 9, 12, 16, 37, 64]
- 1976-77 (mex77, torneio): Leones Negros UdeG [37, 17, 10, 10, 50, 37]; Unión de Curtidores [37, 11, 10, 16, 47, 54]
- 1977-78 (mex78, torneio): Puebla [37, 9, 8, 20, 34, 52]; Tigres UANL [37, 18, 8, 11, 50, 39]; Cruz Azul [36, 12, 15, 9, 47, 40]; Pumas UNAM [36, 20, 8, 8, 77, 44]
- 1978-79 (mex79, torneio): Tampico [37, 11, 13, 13, 59, 64]; Deportivo Neza [37, 9, 10, 18, 34, 53]
- 1983-84 (mex84, torneio): León [37, 10, 10, 17, 50, 58]; Puebla [37, 12, 10, 15, 52, 56]
- 1984-85 (mex85, torneio): América [37, 17, 12, 8, 53, 38]; Tigres UANL [37, 12, 9, 16, 39, 45]; Oaxtepec [1, 0, 1, 0, 0, 0]; Ángeles de Puebla [37, 12, 10, 15, 54, 61]
- 1985-86 (mex86, TOURNAMENT PRODE 85): Pumas UNAM [7, 2, 1, 4, 9, 14]; Morelia [7, 4, 0, 3, 15, 8]
- 1986-87 (mex87, torneio): América [39, 17, 16, 6, 59, 33]; Tigres UANL [39, 13, 16, 10, 56, 53]; Monterrey [39, 15, 9, 15, 48, 53]; Guadalajara [39, 21, 13, 5, 63, 27]; Deportivo Neza [40, 14, 11, 15, 40, 42]; Pumas UNAM [40, 14, 12, 14, 38, 38]
- 1988-89 (mex89, torneio): Tigres UANL [36, 10, 11, 15, 34, 60]; América [37, 17, 9, 11, 58, 37]; Toluca [37, 11, 10, 16, 58, 65]; Atlético Potosino [37, 5, 10, 22, 31, 66]; Tampico Madero [37, 19, 7, 11, 85, 56]
- 1989-90 (mex90, torneio): Atlante [37, 8, 10, 19, 30, 47]; Pumas UNAM [38, 15, 16, 7, 59, 38]; Veracruz [37, 11, 12, 14, 50, 53]
- 1990-91 (mex91, torneio): Puebla [38, 14, 10, 14, 40, 44]; Morelia [38, 11, 14, 13, 49, 51]
- 1992-93 (mex93, torneio): Veracruz [38, 14, 9, 15, 56, 55]; Leones Negros UdeG [38, 8, 14, 16, 35, 54]; Tecos UAG [38, 15, 16, 7, 42, 32]
- 1993-94 (mex94, torneio): Santos Laguna [37, 15, 13, 9, 56, 56]; Toros Neza [8, 4, 2, 2, 13, 12]; Toros Hidalgo [29, 6, 9, 14, 33, 55]
- 1994-95 (mex95, torneio): Tampico Madero [14, 4, 2, 8, 22, 29]; Querétaro [22, 4, 5, 13, 19, 45]
- 1996-97 (mex97, Invierno 1996): Pachuca [17, 3, 6, 8, 25, 36]
- 1996-97 (mex97, Verano 1997): Toluca [16, 5, 6, 5, 24, 18]; Cruz Azul [16, 6, 4, 6, 18, 22]
- 1997-98 (mex98, Invierno 1997): América [18, 9, 5, 4, 29, 19]; Guadalajara [18, 8, 5, 5, 28, 26]
- 1998-99 (mex99, Verano 1999): Atlas [17, 10, 4, 3, 34, 22]

## Placares divergentes mantidos

Só uma fonte discorda, ou as outras não concordam entre si; fica o da fonte principal.

- 2001-08-19 Pumas UNAM x Atlante: 1-2 (ESPN); RSSSF: 0-2
- 2003-11-22 Tecos UAG x Cruz Azul: 2-5 (ESPN); RSSSF: 1-3
- 2022-03-05 Querétaro x Atlas: 0-1 (ESPN); football-data.co.uk: 0-3

## Jogos que só outra fonte tem (não acrescentados)

- 2001-12-08 Pachuca x Tigres UANL 2-0 (RSSSF)
- 2001-12-08 Tigres UANL x Pachuca 1-1 (RSSSF)
- 2002-05-19 América x Necaxa 0-2 (RSSSF)
- 2002-05-19 Necaxa x América 0-3 (RSSSF)
- 2002-12-15 Toluca x Morelia 4-1 (RSSSF)
- 2003-05-17 Cruz Azul x Guadalajara 4-1 (RSSSF)
- 2003-05-17 Guadalajara x Cruz Azul 4-1 (RSSSF)
- 2003-06-01 Morelia x Veracruz 2-0 (RSSSF)
- 2003-06-01 Monterrey x Tigres UANL 1-2 (RSSSF)
- 2003-06-01 Monterrey x Morelia 3-1 (RSSSF)
- 2003-06-01 Morelia x Monterrey 0-0 (RSSSF)
- 2003-11-22 Toluca x Guadalajara 4-0 (RSSSF)
- 2003-11-22 Cruz Azul x Tecos UAG 1-0 (RSSSF)
- 2003-11-22 Guadalajara x Toluca 4-2 (RSSSF)
- 2003-12-14 Tigres UANL x Pachuca 1-0 (RSSSF)
- 2004-05-15 Cruz Azul x Pachuca 2-1 (RSSSF)
- 2004-05-15 Pachuca x Cruz Azul 0-2 (RSSSF)
- 2004-06-06 Guadalajara x Pumas UNAM 1-1 (RSSSF)
- 2004-06-06 Pumas UNAM x Guadalajara 0-0 (RSSSF)
- 2004-12-05 Monterrey x Pumas UNAM 0-1 (RSSSF)
- 2005-05-22 Tecos UAG x América 1-1 (RSSSF)
- 2005-05-22 América x Tecos UAG 6-3 (RSSSF)
- 2005-12-11 Toluca x Monterrey 3-3 (RSSSF)
- 2005-12-11 Monterrey x Toluca 0-3 (RSSSF)
- 2006-05-11 San Luis x Pachuca 0-0 (RSSSF)
- 2006-05-11 Pachuca x San Luis 1-0 (RSSSF)
- 2006-11-08 Necaxa x Morelia 1-3 (RSSSF)
- 2006-12-03 Guadalajara x Toluca 1-1 (RSSSF)
- 2006-12-03 Toluca x Guadalajara 1-2 (RSSSF)
- 2007-04-29 San Luis x Santos Laguna 0-2 (RSSSF)
- 2007-04-29 Atlas x Morelia 0-0 (RSSSF)
- 2007-05-13 Cruz Azul x Pachuca 1-3 (RSSSF)
- 2007-05-13 América x Guadalajara 1-0 (RSSSF)
- 2007-05-13 Guadalajara x América 0-1 (RSSSF)
- 2007-05-13 América x Pachuca 1-2 (RSSSF)
- 2007-05-13 Pachuca x América 1-1 (RSSSF)
- 2007-08-25 Atlante x Morelia 1-1 (RSSSF)
- 2007-12-02 Pumas UNAM x Atlante 0-0 (RSSSF)
- 2007-12-02 Atlante x Pumas UNAM 2-1 (RSSSF)
- 2008-05-25 Cruz Azul x Santos Laguna 1-2 (RSSSF)
- 2008-05-25 Santos Laguna x Cruz Azul 1-1 (RSSSF)
- 2008-12-07 Cruz Azul x Toluca 0-2 (RSSSF)
- 2008-12-07 Toluca x Cruz Azul 0-2 (RSSSF)
- 2009-05-24 Pumas UNAM x Pachuca 1-0 (RSSSF)
- 2009-05-24 Pachuca x Pumas UNAM 2-2 (RSSSF)
- 2011-08-13 Pumas UNAM x Cruz Azul 1-0 (RSSSF)
- 2011-12-04 Santos Laguna x Tigres UANL 0-1 (RSSSF)
- 2011-12-04 Tigres UANL x Santos Laguna 3-1 (RSSSF)
- 2012-01-22 Cruz Azul x Pumas UNAM 0-0 (RSSSF)
- 2012-10-04 Morelia x Jaguares de Chiapas 1-1 (RSSSF)
- 2012-10-05 Morelia x Jaguares de Chiapas 1-1 (football-data.co.uk)
- 2012-10-13 Pumas UNAM x Cruz Azul 1-2 (RSSSF)
- 2013-03-31 Cruz Azul x Pumas UNAM 1-1 (RSSSF)
- 2013-12-01 Toluca x América 2-1 (RSSSF)
- 2013-12-01 León x Santos Laguna 3-1 (RSSSF)
- 2013-12-01 América x Toluca 2-0 (RSSSF)
- 2013-12-01 Santos Laguna x León 2-2 (RSSSF)
- 2013-12-01 León x América 2-0 (RSSSF)
- 2013-12-01 América x León 1-3 (RSSSF)
- 2014-11-30 Toluca x Tigres UANL 0-0 (RSSSF)
- 2014-11-30 Monterrey x América 0-3 (RSSSF)
- 2014-11-30 Tigres UANL x Toluca 0-0 (RSSSF)
- 2014-11-30 América x Monterrey 0-0 (RSSSF)
- 2014-11-30 Tigres UANL x América 1-0 (RSSSF)
- 2014-11-30 América x Tigres UANL 3-0 (RSSSF)
- 2015-11-29 América x Pumas UNAM 0-3 (RSSSF)
- 2015-11-29 Tigres UANL x Toluca 0-0 (RSSSF)
- 2015-11-29 Pumas UNAM x América 1-3 (RSSSF)
- 2015-11-29 Toluca x Tigres UANL 0-2 (RSSSF)
- 2015-11-29 Tigres UANL x Pumas UNAM 3-0 (RSSSF)
- 2015-11-29 Pumas UNAM x Tigres UANL 4-1 (RSSSF)
- 2016-12-04 América x Tigres UANL 1-1 (RSSSF)
- 2016-12-04 Tigres UANL x América 1-1 (RSSSF)
- 2017-12-03 Tigres UANL x Monterrey 1-1 (RSSSF)
- 2017-12-03 Monterrey x Tigres UANL 1-2 (RSSSF)
- 2018-12-09 América x Cruz Azul 0-0 (RSSSF)
- 2018-12-09 Cruz Azul x América 0-2 (RSSSF)
- 2019-04-02 Cruz Azul x Necaxa 4-0 (RSSSF)
- 2019-12-08 Monterrey x América 2-1 (RSSSF)
- 2019-12-08 América x Monterrey 2-1 (RSSSF)
- 2020-12-06 Pumas UNAM x León 1-1 (RSSSF)
- 2020-12-06 León x Pumas UNAM 2-0 (RSSSF)
- 2021-02-20 Atlas x América 3-0 (openfootball/football.json)
- 2021-02-21 Atlas x América 0-2 (football-data.co.uk)
- 2021-05-23 Santos Laguna x Cruz Azul 0-1 (RSSSF)
- 2021-05-23 Cruz Azul x Santos Laguna 1-1 (RSSSF)
- 2021-05-23 León x Cruz Azul 1-2 (RSSSF)
- 2021-12-05 León x Atlas 3-2 (RSSSF)
- 2021-12-05 Atlas x León 1-0 (RSSSF)
- 2022-05-22 Atlas x Pachuca 2-0 (RSSSF)
- 2022-05-22 Pachuca x Atlas 2-1 (RSSSF)
- 2022-10-23 Toluca x Pachuca 1-5 (RSSSF)
- 2022-10-23 Pachuca x Toluca 3-1 (RSSSF)
- 2023-05-21 Tigres UANL x Guadalajara 0-0 (RSSSF)
- 2023-05-21 Guadalajara x Tigres UANL 2-3 (RSSSF)
- 2023-05-21 Pachuca x Tigres UANL 1-2 (RSSSF)
- 2023-11-12 Atlético de San Luis x León 3-2 (RSSSF)
- 2023-11-12 León x Santos Laguna 3-2 (RSSSF)
- 2023-12-10 Tigres UANL x América 1-1 (RSSSF)
- 2023-12-10 América x Tigres UANL 3-0 (RSSSF)
- 2024-04-28 Pachuca x Pumas UNAM 0-0 (RSSSF)
- 2024-04-28 Necaxa x Querétaro 1-1 (RSSSF)
- 2024-04-28 Pachuca x Necaxa 2-1 (RSSSF)
- 2024-05-19 Cruz Azul x América 1-1 (RSSSF)
- 2024-05-19 América x Cruz Azul 1-0 (RSSSF)
- 2024-11-10 Guadalajara x Atlas 1-2 (RSSSF)
- 2024-12-08 América x Monterrey 2-1 (RSSSF)
- 2024-12-08 Monterrey x América 1-1 (RSSSF)
- 2025-04-20 Monterrey x Pachuca 1-2 (RSSSF)
- 2025-04-20 Monterrey x Pumas UNAM 2-0 (RSSSF)
- 2025-05-18 América x Toluca 0-0 (RSSSF)
- 2025-05-18 Toluca x América 2-0 (RSSSF)
- 2025-05-18 América x Toluca 1-3 (RSSSF)
- 2025-11-30 Toluca x Monterrey 3-2 (RSSSF)
- 2025-11-30 Tigres UANL x Cruz Azul 1-1 (RSSSF)
- 2025-11-30 Tigres UANL x Toluca 1-0 (RSSSF)
- 2025-11-30 Toluca x Tigres UANL 2-1 (RSSSF)
- 2026-05-17 Cruz Azul x Pumas UNAM 0-0 (RSSSF)
- 2026-05-17 Pumas UNAM x Cruz Azul 1-2 (RSSSF)

## Nomes sem clube (linhas ignoradas)

Estadio Azteca América (2), Estadio Azteca Necaxa (1), Antonio Taboada (1), Juan Pablo Rodriguez (1), Victor Ruiz (1), Miguel Angel Zepeda (1), Fabian Estay           (miss) (1), Daniel Osorno (1), Darko Vukic (1), Rafael Marquez (1), Jose S. Cardozo (1), Eduardo Bustos M (1), Salvador Carmona (1), Julio Estrada (1)
