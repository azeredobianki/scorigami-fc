# Primera División Argentina: relatório da carga

Gerado por `scripts/ingest_latam.py`. Não editar à mão: rode o script de novo.

- 43663 jogos de 1891 a 2026: 33836 do RSSSF, 9827 do ESPN.
- Temporada = ano civil do primeiro jogo do torneio (Apertura 2003 = 2003, Clausura 2004 = 2004; as temporadas longas 1985-86 a 1990-91 ficam no ano de início).
- Fonte principal: RSSSF para os torneios que começam antes de 07/2003; ESPN depois. Conferência jogo a jogo com a outra fonte nos anos em que as duas existem, páginas do RSSSF de 2003-04 a 2011, football-data.co.uk (2012 em diante) e openfootball.
- Placar de campo, com prorrogação quando houve. Pênaltis nos jogos da ESPN e nos empates de 1988-89 (o empate ia para os pênaltis valendo ponto).
- Fora da carga: 222 jogos abandonados e não completados, 24 sem data, 51 linhas do RSSSF que não são jogo de clube conhecido (notas, artilharia).
- Incluídos: campeonatos dissidentes oficiais (FAF 1912-14, AAm 1919-26), os amadores da AAF 1931-34 e a Copa de Honor 1936; fases finais previstas no regulamento (Metropolitano e Nacional, Copa de la Liga, Copa Maradona, Apertura e Clausura de 2025 em diante).
- Fora: desempates, promoção/rebaixamento, Reclasificatorio, Promocional, Petit e Octogonal, Liguilla pré-Libertadores, Copa Argentina, supercopas e Trofeo de Campeones, Copa de la Superliga, a final entre campeões de 2014 e divisões de acesso.

## Jogos por temporada

Colunas das fontes: jogos casados / com data diferente (1 a 3 dias) / com placar diferente / jogos que só a outra fonte tem (não acrescentados). RSSSF (tabela): times cuja campanha (J V E D GP GC) bate com a tabela do torneio.

| Temporada | Jogos | Fonte | ESPN | RSSSF | football-data | openfootball | RSSSF (tabela) |
|---|---|---|---|---|---|---|---|
| 1891 | 21 | RSSSF | – | – | – | – | 5/5 |
| 1892 | 4 | RSSSF | – | – | – | – | 1/4 |
| 1894 | 26 | RSSSF | – | – | – | – | 0/6 |
| 1895 | 19 | RSSSF | – | – | – | – | 0/6 |
| 1896 | 20 | RSSSF | – | – | – | – | 5/5 |
| 1897 | 42 | RSSSF | – | – | – | – | 7/7 |
| 1898 | 36 | RSSSF | – | – | – | – | 1/7 |
| 1899 | 9 | RSSSF | – | – | – | – | 1/4 |
| 1900 | 12 | RSSSF | – | – | – | – | 4/4 |
| 1901 | 12 | RSSSF | – | – | – | – | 4/4 |
| 1902 | 15 | RSSSF | – | – | – | – | 1/5 |
| 1903 | 26 | RSSSF | – | – | – | – | 1/6 |
| 1904 | 27 | RSSSF | – | – | – | – | 2/6 |
| 1905 | 32 | RSSSF | – | – | – | – | 0/7 |
| 1906 | 50 | RSSSF | – | – | – | – | 9/11 |
| 1907 | 86 | RSSSF | – | – | – | – | 0/11 |
| 1908 | 81 | RSSSF | – | – | – | – | 1/10 |
| 1909 | 86 | RSSSF | – | – | – | – | 2/10 |
| 1910 | 74 | RSSSF | – | – | – | – | 4/9 |
| 1911 | 71 | RSSSF | – | – | – | – | 7/9 |
| 1912 | 89 | RSSSF | – | – | – | – | 4/17 |
| 1913 | 212 | RSSSF | – | – | – | – | 11/38 |
| 1914 | 133 | RSSSF | – | – | – | – | 18/22 |
| 1915 | 295 | RSSSF | – | – | – | – | 13/25 |
| 1916 | 229 | RSSSF | – | – | – | – | 19/22 |
| 1917 | 211 | RSSSF | – | – | – | – | 19/21 |
| 1918 | 191 | RSSSF | – | – | – | – | 16/20 |
| 1919 | 138 | RSSSF | – | – | – | – | 5/34 |
| 1920 | 405 | RSSSF | – | – | – | – | 4/32 |
| 1921 | 464 | RSSSF | – | – | – | – | 12/30 |
| 1922 | 546 | RSSSF | – | – | – | – | 18/38 |
| 1923 | 522 | RSSSF | – | – | – | – | 22/44 |
| 1924 | 502 | RSSSF | – | – | – | – | 28/46 |
| 1925 | 518 | RSSSF | – | – | – | – | 18/50 |
| 1926 | 150 | RSSSF | – | – | – | – | 24/48 |
| 1927 | 551 | RSSSF | – | – | – | – | 15/34 |
| 1928 | 633 | RSSSF | – | – | – | – | 21/36 |
| 1929 | 233 | RSSSF | – | – | – | – | 0/35 |
| 1930 | 628 | RSSSF | – | – | – | – | 15/36 |
| 1931 | 416 | RSSSF | – | – | – | – | 18/35 |
| 1932 | 551 | RSSSF | – | – | – | – | 10/35 |
| 1933 | 487 | RSSSF | – | – | – | – | 24/38 |
| 1934 | 515 | RSSSF | – | – | – | – | 20/38 |
| 1935 | 306 | RSSSF | – | – | – | – | 18/18 |
| 1936 | 300 | RSSSF | – | – | – | – | 29/36 |
| 1937 | 306 | RSSSF | – | – | – | – | 18/18 |
| 1938 | 272 | RSSSF | – | – | – | – | 17/17 |
| 1939 | 305 | RSSSF | – | – | – | – | 16/18 |
| 1940 | 294 | RSSSF | – | – | – | – | 6/18 |
| 1941 | 240 | RSSSF | – | – | – | – | 16/16 |
| 1942 | 240 | RSSSF | – | – | – | – | 16/16 |
| 1943 | 240 | RSSSF | – | – | – | – | 16/16 |
| 1944 | 240 | RSSSF | – | – | – | – | 16/16 |
| 1945 | 240 | RSSSF | – | – | – | – | 16/16 |
| 1946 | 237 | RSSSF | – | – | – | – | 10/16 |
| 1947 | 236 | RSSSF | – | – | – | – | 9/16 |
| 1948 | 238 | RSSSF | – | – | – | – | 13/16 |
| 1949 | 308 | RSSSF | – | – | – | – | 13/18 |
| 1950 | 305 | RSSSF | – | – | – | – | 16/18 |
| 1951 | 274 | RSSSF | – | – | – | – | 15/17 |
| 1952 | 240 | RSSSF | – | – | – | – | 16/16 |
| 1953 | 237 | RSSSF | – | – | – | – | 10/16 |
| 1954 | 240 | RSSSF | – | – | – | – | 16/16 |
| 1955 | 240 | RSSSF | – | – | – | – | 16/16 |
| 1956 | 240 | RSSSF | – | – | – | – | 16/16 |
| 1957 | 240 | RSSSF | – | – | – | – | 16/16 |
| 1958 | 241 | RSSSF | – | – | – | – | 14/16 |
| 1959 | 237 | RSSSF | – | – | – | – | 11/16 |
| 1960 | 240 | RSSSF | – | – | – | – | 16/16 |
| 1961 | 239 | RSSSF | – | – | – | – | 14/16 |
| 1962 | 210 | RSSSF | – | – | – | – | 15/15 |
| 1963 | 182 | RSSSF | – | – | – | – | 14/14 |
| 1964 | 239 | RSSSF | – | – | – | – | 14/16 |
| 1965 | 306 | RSSSF | – | – | – | – | 18/18 |
| 1966 | 378 | RSSSF | – | – | – | – | 16/20 |
| 1967 | 365 | RSSSF | – | – | – | – | 38/38 |
| 1968 | 364 | RSSSF | – | – | – | – | 36/38 |
| 1969 | 397 | RSSSF | – | – | – | – | 38/40 |
| 1970 | 414 | RSSSF | – | – | – | – | 12/27 |
| 1971 | 539 | RSSSF | – | – | – | – | 43/47 |
| 1972 | 476 | RSSSF | – | – | – | – | 42/44 |
| 1973 | 502 | RSSSF | – | – | – | – | 17/77 |
| 1974 | 522 | RSSSF | – | – | – | – | 17/36 |
| 1975 | 664 | RSSSF | – | – | – | – | 52/52 |
| 1976 | 495 | RSSSF | – | – | – | – | 43/56 |
| 1977 | 736 | RSSSF | – | – | – | – | 51/55 |
| 1978 | 660 | RSSSF | – | – | – | – | 44/53 |
| 1979 | 408 | RSSSF | – | – | – | – | 48/48 |
| 1980 | 509 | RSSSF | – | – | – | – | 10/30 |
| 1981 | 515 | RSSSF | – | – | – | – | 12/29 |
| 1982 | 614 | RSSSF | – | – | – | – | 47/51 |
| 1983 | 537 | RSSSF | – | – | – | – | 27/51 |
| 1984 | 470 | RSSSF | – | – | – | – | 49/51 |
| 1985 | 501 | RSSSF | – | – | – | – | 49/51 |
| 1986 | 388 | RSSSF | – | – | – | – | 15/20 |
| 1987 | 402 | RSSSF | – | – | – | – | 16/20 |
| 1988 | 378 | RSSSF | – | – | – | – | 16/20 |
| 1989 | 382 | RSSSF | – | – | – | – | 15/20 |
| 1990 | 190 | RSSSF | – | – | – | – | 17/20 |
| 1991 | 379 | RSSSF | – | – | – | – | 36/40 |
| 1992 | 383 | RSSSF | – | – | – | – | 34/40 |
| 1993 | 386 | RSSSF | – | – | – | – | 32/40 |
| 1994 | 380 | RSSSF | – | – | – | – | 40/40 |
| 1995 | 380 | RSSSF | – | – | – | – | 40/40 |
| 1996 | 382 | RSSSF | – | – | – | – | 36/40 |
| 1997 | 376 | RSSSF | – | – | – | – | 32/40 |
| 1998 | 380 | RSSSF | – | – | – | – | 38/40 |
| 1999 | 378 | RSSSF | – | – | – | – | 36/40 |
| 2000 | 379 | RSSSF | – | – | – | – | 38/40 |
| 2001 | 379 | RSSSF | 255 / 0 / 4 / 4 | – | – | – | 38/40 |
| 2002 | 379 | RSSSF | – | – | – | – | 38/40 |
| 2003 | 379 | ESPN+RSSSF | 186 / 36 / 1 / 2 | 189 / 2 / 2 / 0 | – | – | 18/20 |
| 2004 | 380 | ESPN | – | 368 / 6 / 1 / 13 | – | – | – |
| 2005 | 379 | ESPN | – | 378 / 0 / 0 / 1 | – | – | – |
| 2006 | 380 | ESPN | – | 375 / 0 / 0 / 1 | – | – | – |
| 2007 | 380 | ESPN | – | 379 / 0 / 0 / 2 | – | – | – |
| 2008 | 380 | ESPN | – | 379 / 0 / 0 / 0 | – | – | – |
| 2009 | 380 | ESPN | – | 380 / 0 / 0 / 0 | – | – | – |
| 2010 | 380 | ESPN | – | 379 / 0 / 0 / 2 | – | – | – |
| 2011 | 380 | ESPN | – | 379 / 2 / 0 / 1 | – | – | – |
| 2012 | 380 | ESPN | – | 190 / 0 / 0 / 1 | 190 / 37 / 0 / 0 | – | – |
| 2013 | 379 | ESPN | – | – | 379 / 102 / 0 / 2 | – | – |
| 2014 | 380 | ESPN | – | – | 380 / 99 / 0 / 2 | – | – |
| 2015 | 450 | ESPN | – | – | 450 / 149 / 0 / 13 | – | – |
| 2016 | 692 | ESPN | – | – | 692 / 194 / 0 / 0 | – | – |
| 2017 | 378 | ESPN | – | – | 378 / 105 / 0 / 0 | – | – |
| 2018 | 325 | ESPN | – | – | 324 / 99 / 0 / 0 | – | – |
| 2019 | 276 | ESPN | – | – | 276 / 91 / 0 / 0 | – | – |
| 2020 | 134 | ESPN | – | – | 133 / 49 / 0 / 1 | – | – |
| 2021 | 501 | ESPN | – | – | 501 / 139 / 0 / 0 | – | – |
| 2022 | 581 | ESPN | – | – | 581 / 192 / 0 / 0 | – | – |
| 2023 | 581 | ESPN | – | – | 581 / 218 / 0 / 1 | – | – |
| 2024 | 581 | ESPN | – | – | 581 / 205 / 0 / 0 | – | – |
| 2025 | 510 | ESPN | – | – | 510 / 166 / 0 / 0 | 240 / 0 / 0 / 0 | – |
| 2026 | 450 | ESPN | – | – | 448 / 151 / 0 / 0 | – | – |

## Tabela do RSSSF diferente

Times cuja campanha nos jogos carregados não aparece na tabela do torneio. Nos casos conferidos: jogo decidido no tribunal ou por W.O. (conta na tabela e não tem placar), jogo que falta na página, temporadas de 1988-89 e 1989-90 (empate decidido nos pênaltis muda as colunas), grupos que a tabela soma de outro jeito.

- 1936 (arg-hon36, torneio): Atlanta [16, 7, 3, 6, 34, 38]; Platense [16, 5, 4, 7, 23, 26]; Racing Club [16, 8, 2, 6, 36, 26]; Independiente [15, 7, 4, 4, 34, 24]; San Lorenzo [16, 11, 4, 1, 43, 20]; Talleres (Remedios de Escalada) [12, 6, 0, 6, 26, 28]; Quilmes [16, 6, 4, 6, 27, 26]
- 1999 (arg00, Apertura): Independiente [18, 5, 7, 6, 16, 19]; Belgrano [18, 5, 5, 8, 23, 34]
- 2000 (arg01, Torneo Apertura): Racing Club [18, 1, 8, 9, 12, 28]; Independiente [18, 5, 5, 8, 22, 23]
- 2001 (arg01, Torneo Clausura): Huracán [18, 7, 4, 7, 26, 28]; Los Andes [18, 5, 6, 7, 24, 30]
- 2002 (arg02, Torneo Clausura): Racing Club [18, 7, 5, 6, 17, 17]; Boca Juniors [18, 10, 5, 3, 25, 15]
- 2003 (arg03, Torneo Clausura): Newell's Old Boys [18, 5, 6, 7, 19, 24]; River Plate [18, 13, 3, 2, 41, 16]
- 1910 (arg10, Championship Cup 1910): River Plate [17, 4, 4, 9, 27, 39]; Argentino de Quilmes [17, 3, 3, 11, 23, 49]; Quilmes [17, 2, 5, 10, 23, 51]; Estudiantes de Buenos Aires [16, 8, 3, 5, 32, 28]; Porteño [17, 8, 6, 3, 33, 25]
- 1911 (arg11, Championship Cup): Porteño [15, 9, 3, 3, 26, 12]; Belgrano Athletic [15, 4, 5, 6, 23, 28]
- 1912 (arg12, Asociación Argentina de Football - Copa Campeonato 1912): Racing Club [12, 5, 3, 4, 29, 19]; Belgrano Athletic [10, 3, 1, 6, 23, 27]; River Plate [11, 2, 3, 6, 10, 25]; San Isidro [12, 5, 4, 3, 20, 26]; Estudiantes de Buenos Aires [10, 5, 0, 5, 17, 19]; Quilmes [11, 7, 2, 2, 29, 12]
- 1912 (arg12, Federación Argentina de Football): Atlanta [13, 6, 0, 7, 24, 28]; Gimnasia y Esgrima (Buenos Aires) [12, 5, 4, 3, 26, 18]; Argentino de Quilmes [13, 6, 3, 4, 34, 27]; Independiente [13, 8, 2, 3, 33, 12]; Kimberley (Buenos Aires) [13, 1, 2, 10, 17, 48]; Porteño [12, 6, 4, 2, 24, 10]; Sociedad Sportiva Argentina [8, 0, 0, 8, 6, 30]
- 1913 (arg13, Asociación Argentina de Football  Copa Campeonato > Origina): Boca Juniors [13, 7, 2, 4, 29, 16]; Ferro Carril Oeste [13, 1, 4, 8, 14, 28]; Ferrocarril Sud [13, 1, 2, 10, 17, 51]; Comercio [13, 3, 2, 8, 23, 32]; Racing Club [13, 11, 0, 2, 41, 5]; Olivos [13, 1, 2, 10, 10, 49]
- 1913 (arg13, Asociación Argentina de Football  Copa Campeonato): Banfield [3, 0, 1, 2, 1, 5]; Platense [3, 0, 1, 2, 2, 7]; River Plate [3, 2, 1, 0, 6, 2]; Racing Club [3, 2, 1, 0, 6, 1]; Boca Juniors [3, 2, 1, 0, 6, 3]; Estudiantil Porteño [3, 1, 0, 2, 11, 11]; Comercio [3, 0, 1, 2, 4, 8]; Estudiantes de Buenos Aires [3, 0, 2, 1, 6, 9] ...
- 1913 (arg13, Federación Argentina de Football  First Division): Argentino de Quilmes [17, 12, 3, 2, 39, 19]; Kimberley (Buenos Aires) [18, 8, 3, 7, 35, 30]; Independiente [19, 8, 5, 6, 41, 34]; Tigre [19, 6, 3, 10, 23, 39]; Gimnasia y Esgrima (Buenos Aires) [17, 10, 6, 1, 44, 19]; Sociedad Sportiva Argentina [17, 1, 2, 14, 17, 56]; Atlanta [19, 6, 2, 11, 39, 56]; Hispano Argentino [20, 6, 1, 13, 25, 51]
- 1914 (arg14, Primera > División  1914): Kimberley (Buenos Aires) [13, 4, 2, 7, 18, 37]; Floresta [12, 1, 2, 9, 9, 30]; Independiente [14, 7, 5, 2, 30, 13]; Tigre [1, 0, 0, 1, 0, 3]
- 1915 (arg15, Copa Campeonato): San Isidro [24, 21, 3, 0, 73, 13]; Independiente [24, 12, 5, 7, 42, 23]; Banfield [24, 10, 4, 10, 36, 46]; Comercio [21, 1, 3, 17, 20, 73]; Racing Club [24, 21, 2, 1, 96, 7]; Huracán [23, 10, 6, 7, 40, 26]; Quilmes [22, 7, 7, 8, 19, 26]; Estudiantil Porteño [23, 8, 1, 14, 34, 54] ...
- 1916 (arg16, Copa Campeonato): San Lorenzo [20, 8, 5, 7, 16, 25]; Tigre [20, 7, 5, 8, 22, 28]; Quilmes [19, 2, 4, 13, 12, 36]
- 1917 (arg17, Copa Campeonato): Estudiantes de Buenos Aires [21, 7, 3, 11, 26, 31]; Independiente [21, 7, 6, 8, 29, 25]
- 1918 (arg18, Copa Campeonato): Estudiantil Porteño [20, 6, 6, 8, 23, 23]; Sportivo Barracas [21, 11, 3, 7, 24, 21]; Argentino de Quilmes [19, 1, 5, 13, 9, 29]; Defensores de Belgrano [18, 5, 5, 8, 24, 32]
- 1892 (arg1892, Match details): Quilmes [3, 1, 1, 1, 2, 2]; Buenos Aires and Rosario Railway [2, 1, 1, 0, 1, 0]; Lomas Academy [1, 0, 1, 0, 0, 0]
- 1894 (arg1894, Championship): Lobos Athletic [9, 3, 1, 5, 14, 22]; Retiro Athletic [8, 0, 1, 7, 1, 33]; Flores Athletic [9, 5, 0, 4, 27, 21]; Rosario Athletic [8, 5, 2, 1, 21, 8]; Saint Andrew's [9, 3, 0, 6, 11, 24]; Lomas Athletic [9, 7, 2, 0, 38, 4]
- 1895 (arg1895, Championship): Quilmes Rovers [6, 0, 0, 6, 2, 31]; English High School [5, 2, 0, 3, 12, 15]; Retiro Athletic [6, 1, 1, 4, 6, 13]; Lomas Athletic [8, 7, 1, 0, 29, 8]; Flores Athletic [8, 6, 0, 2, 21, 7]; Lomas Academy [5, 2, 0, 3, 15, 11]
- 1898 (arg1898, Championship): Belgrano Athletic [10, 6, 1, 3, 24, 10]; United Banks [11, 3, 2, 6, 16, 20]; Palermo Athletic [11, 1, 0, 10, 10, 47]; Banfield Athletic [6, 0, 0, 6, 3, 24]; Lomas Athletic [11, 7, 4, 0, 20, 4]; Lobos Athletic [11, 8, 2, 1, 21, 6]
- 1899 (arg1899, Championship Cup): Lobos Athletic [4, 2, 1, 1, 4, 2]; Lomas Athletic [4, 0, 1, 3, 2, 8]; Lanús Athletic [4, 0, 1, 3, 1, 5]
- 1919 (arg19, Asociación Argentina de Football - Copa Campeonato 1919): Atlanta [6, 1, 2, 3, 7, 8]; Sportivo Barracas [6, 1, 3, 2, 9, 12]; Estudiantes de Buenos Aires [6, 0, 2, 4, 7, 15]; Defensores de Belgrano [6, 1, 3, 2, 5, 10]; Estudiantil Porteño [5, 2, 0, 3, 5, 10]; Porteño [5, 5, 0, 0, 12, 4]; Eureka [6, 0, 1, 5, 5, 14]; San Lorenzo [6, 2, 1, 3, 9, 12] ...
- 1919 (arg19, Asociación Amateurs de Football): Atlanta [11, 6, 2, 3, 27, 12]; Estudiantes de Buenos Aires [12, 1, 1, 10, 8, 48]; River Plate [12, 5, 4, 3, 16, 11]; Racing Club [12, 12, 0, 0, 38, 10]; Defensores de Belgrano [11, 4, 4, 3, 17, 17]; San Isidro [11, 2, 1, 8, 14, 27]; San Lorenzo [12, 5, 3, 4, 21, 17]; Sportivo Barracas [12, 5, 2, 5, 20, 23] ...
- 1902 (arg1902, Championship Cup): Lomas Athletic [5, 0, 1, 4, 3, 10]; Belgrano Athletic [7, 1, 3, 3, 7, 20]; Quilmes [5, 2, 1, 2, 6, 6]; Alumni [5, 4, 1, 0, 24, 3]
- 1903 (arg1903, Copa Campeonato [Championship Cup]): Quilmes [9, 2, 2, 5, 14, 22]; Flores Athletic [6, 0, 0, 6, 2, 49]; Belgrano Athletic [9, 6, 1, 2, 21, 11]; Lomas Athletic [9, 1, 4, 4, 17, 16]; Barracas Athletic [9, 4, 1, 4, 22, 13]
- 1904 (arg1904, Copa Campeonato [Championship Cup]): Quilmes [8, 1, 0, 7, 8, 19]; Alumni [9, 4, 3, 2, 18, 9]; Barracas Athletic [8, 4, 0, 4, 13, 16]; Lomas Athletic [9, 4, 1, 4, 9, 10]
- 1905 (arg1905, Championship Cup - 1905): Estudiantes de Buenos Aires [11, 7, 1, 3, 36, 18]; Lomas Athletic [11, 2, 1, 8, 12, 41]; Quilmes [8, 4, 0, 4, 32, 15]; Reformer [10, 1, 1, 8, 20, 60]; Belgrano Athletic [10, 8, 0, 2, 31, 12]; Barracas Athletic [5, 1, 0, 4, 8, 28]; Alumni [9, 7, 1, 1, 43, 8]
- 1906 (arg1906, Copa Campeonato - Championship Cup 1906): Argentino de Quilmes [7, 1, 0, 6, 5, 19]; Alumni [7, 6, 0, 1, 28, 6]
- 1907 (arg1907, Championship Cup - 1907): San Martín Athletic [17, 3, 2, 12, 24, 70]; San Isidro [19, 10, 3, 6, 51, 31]; Estudiantes de Buenos Aires [16, 9, 5, 2, 51, 25]; Porteño [18, 6, 6, 6, 42, 41]; Alumni [18, 15, 3, 0, 71, 12]; Argentino de Quilmes [16, 3, 4, 9, 22, 45]; Barracas Athletic [7, 2, 0, 5, 17, 21]; Reformer [17, 6, 1, 10, 36, 53] ...
- 1908 (arg1908, Championship Cup 1908): Estudiantes de Buenos Aires [14, 8, 3, 3, 39, 22]; Reformer [15, 2, 2, 11, 10, 57]; Belgrano Athletic [17, 13, 2, 2, 51, 22]; San Martín Athletic [15, 3, 1, 11, 19, 44]; Porteño [17, 4, 1, 12, 25, 44]; Lomas Athletic [16, 3, 1, 12, 19, 50]; Quilmes [17, 8, 1, 8, 46, 54]; San Isidro [16, 9, 1, 6, 36, 26] ...
- 1909 (arg1909, Championship Cup): River Plate [18, 10, 3, 5, 35, 26]; Argentino de Quilmes [16, 4, 4, 8, 20, 40]; Estudiantes de Buenos Aires [19, 8, 4, 7, 40, 31]; Lomas Athletic [18, 1, 6, 11, 17, 49]; Reformer [15, 2, 6, 7, 21, 42]; Porteño [17, 7, 2, 8, 35, 39]; San Isidro [16, 6, 3, 7, 33, 27]; Alumni [17, 14, 2, 1, 74, 19]
- 1920 (arg20, Asociación Amateur de Football): Atlanta [33, 16, 7, 10, 49, 29]; Tigre [32, 9, 4, 19, 38, 77]; Estudiantil Porteño [33, 9, 12, 12, 38, 42]; Ferro Carril Oeste [33, 11, 6, 16, 34, 61]; Gimnasia y Esgrima La Plata [33, 16, 7, 10, 46, 32]; Quilmes [33, 12, 6, 15, 35, 48]; Defensores de Belgrano [32, 7, 9, 16, 28, 40]; Estudiantes de Buenos Aires [33, 4, 5, 24, 31, 90] ...
- 1920 (arg20, Asociación Argentina de Football): Banfield [18, 9, 5, 4, 35, 21]; Nueva Chicago [18, 5, 3, 10, 17, 36]; Boca Juniors [20, 16, 3, 1, 52, 7]; Porteño [17, 8, 4, 5, 31, 26]; Del Plata [20, 6, 6, 8, 22, 27]; Sportivo Barracas [19, 6, 5, 8, 26, 28]; Huracán [19, 8, 5, 6, 38, 26]; Estudiantes de La Plata [19, 7, 1, 11, 34, 37] ...
- 1921 (arg21, Copa Campeonato): El Porvenir [16, 4, 7, 5, 17, 22]; Porteño [16, 0, 5, 11, 10, 29]; Del Plata [19, 13, 4, 2, 30, 12]; Sportivo del Norte [16, 3, 8, 5, 18, 24]; Estudiantes de La Plata [17, 4, 3, 10, 18, 35]; Nueva Chicago [16, 5, 7, 4, 14, 13]
- 1921 (arg21, Primera División): Independiente [38, 21, 9, 8, 65, 29]; Racing Club [39, 31, 6, 2, 74, 16]; Sportivo Buenos Aires [39, 8, 11, 20, 38, 63]; Atlanta [39, 18, 7, 14, 48, 43]; Tigre [39, 16, 13, 10, 64, 55]; Quilmes [39, 8, 9, 22, 44, 71]; Estudiantil Porteño [37, 9, 6, 22, 38, 58]; Ferro Carril Oeste [35, 2, 7, 26, 21, 92] ...
- 1922 (arg22, Copa Campeonato 1922): Huracán [15, 12, 2, 1, 36, 7]; Sportivo del Norte [15, 5, 3, 7, 13, 19]; Sportivo Barracas [14, 3, 6, 5, 15, 19]; Nueva Chicago [15, 6, 4, 5, 23, 22]; Alvear [15, 7, 3, 5, 29, 16]
- 1922 (arg22, Primera División): Sportivo Buenos Aires [39, 9, 10, 20, 42, 64]; Sportivo Almagro [39, 11, 10, 18, 46, 58]; Barracas Central [39, 9, 11, 19, 35, 53]; River Plate [40, 26, 10, 4, 58, 17]; Defensores de Belgrano [39, 12, 8, 19, 41, 55]; Lanús [39, 9, 8, 22, 47, 69]; Tigre [39, 14, 11, 14, 46, 44]; Quilmes [36, 8, 5, 23, 24, 75] ...
- 1923 (arg23, Asociación Amateur de Football): Atlanta [18, 5, 4, 9, 19, 29]; San Lorenzo [19, 16, 1, 2, 34, 13]; Banfield [19, 4, 6, 9, 14, 24]; Independiente [17, 14, 2, 1, 40, 8]; Ferro Carril Oeste [18, 4, 3, 11, 12, 26]; Gimnasia y Esgrima La Plata [18, 10, 2, 6, 23, 14]; Platense II [16, 5, 5, 6, 20, 25]; Defensores de Belgrano [19, 4, 7, 8, 17, 18] ...
- 1923 (arg23, Asociación Argentina de Football > Copa Campeonato 1923): Boca Alumni [29, 6, 5, 18, 31, 62]; Boca Juniors [34, 26, 4, 4, 92, 21]; Sportivo Dock Sud [27, 12, 11, 4, 35, 21]; Estudiantes de La Plata [21, 14, 4, 3, 44, 18]; Huracán [33, 24, 6, 3, 73, 25]; Urquiza [30, 3, 8, 19, 17, 41]; Palermo [24, 13, 5, 6, 33, 26]
- 1924 (arg24, Copa > Campeonato  1924): El Porvenir [20, 10, 5, 5, 32, 20]; Sportivo Barracas [20, 9, 5, 6, 31, 26]; Argentinos Juniors [20, 8, 2, 10, 21, 24]; Platense II [19, 6, 6, 7, 19, 24]; Huracán [16, 9, 4, 3, 36, 11]; Progresista [20, 3, 6, 11, 21, 35]; Nueva Chicago [20, 7, 7, 6, 27, 26]
- 1924 (arg24, Primera División): Quilmes [27, 3, 8, 16, 22, 45]; Independiente [22, 15, 4, 3, 47, 9]; Barracas Central [24, 6, 7, 11, 21, 30]; Estudiantil Porteño [22, 3, 7, 12, 16, 37]; Platense [24, 14, 9, 1, 30, 6]; Vélez Sarsfield [24, 6, 6, 12, 26, 35]; Atlanta [23, 7, 6, 10, 23, 28]; Banfield [22, 7, 7, 8, 27, 28] ...
- 1925 (arg25, CopaCampeonato  1925): Alvear [19, 1, 1, 17, 8, 41]; Temperley [18, 11, 4, 3, 35, 14]; Argentino de Quilmes [20, 4, 8, 8, 18, 30]; Nueva Chicago [23, 18, 4, 1, 48, 12]; Platense [10, 2, 5, 3, 8, 10]; Chacarita Juniors [22, 13, 4, 5, 44, 18]; Sportivo Dock Sud [20, 3, 10, 7, 14, 24]; Sportivo Barracas [19, 7, 5, 7, 22, 24] ...
- 1925 (arg25, Primera División): Banfield [23, 6, 7, 10, 20, 29]; Lanús [24, 8, 9, 7, 22, 21]; Sportivo Almagro [24, 14, 4, 6, 38, 17]; Barracas Central [22, 4, 6, 12, 22, 36]; Ferro Carril Oeste [25, 7, 5, 13, 27, 38]; Tigre [23, 8, 5, 10, 26, 39]; Sportivo Buenos Aires [22, 11, 5, 6, 39, 30]; Argentino del Sud [23, 7, 6, 10, 20, 25] ...
- 1926 (arg26, Copa Campeonato  1926): Huracán [12, 10, 2, 0, 39, 6]; Del Plata [14, 3, 1, 10, 13, 40]; Boca Alumni [15, 5, 5, 5, 21, 18]; Argentino de Banfield [17, 8, 3, 6, 32, 28]; Porteño [14, 0, 2, 12, 15, 58]; Sportivo Dock Sud [12, 4, 1, 7, 17, 21]; Progresista [7, 2, 0, 5, 12, 18]; Argentino de Quilmes [14, 6, 2, 6, 22, 28] ...
- 1926 (arg26, Primera > División 1926): Estudiantes de Buenos Aires [5, 1, 1, 3, 4, 9]; Ferro Carril Oeste [3, 1, 0, 2, 6, 9]; Sportivo Palermo [3, 3, 0, 0, 11, 3]; Estudiantes de La Plata [3, 2, 0, 1, 7, 6]; Quilmes [4, 2, 0, 2, 7, 4]; Barracas Central [4, 1, 1, 2, 6, 9]; San Lorenzo [3, 3, 0, 0, 6, 1]
- 1927 (arg27, Primera División): Sportivo Barracas [32, 16, 7, 9, 56, 39]; Tigre [32, 8, 3, 21, 35, 76]; Platense [34, 14, 9, 11, 40, 46]; Lanús [30, 19, 6, 5, 52, 25]; Banfield [32, 11, 6, 15, 45, 49]; Talleres (Remedios de Escalada) [31, 9, 9, 13, 32, 38]; Argentinos Juniors [32, 10, 10, 12, 38, 40]; Atlanta [29, 8, 6, 15, 31, 51] ...
- 1928 (arg28, Asociación > Primera División 1928): Racing Club [36, 24, 3, 9, 79, 39]; Excursionistas [36, 11, 10, 15, 35, 47]; Gimnasia y Esgrima La Plata [35, 11, 8, 16, 38, 45]; Estudiantes de Buenos Aires [36, 11, 5, 20, 38, 64]; Argentinos Juniors [36, 14, 10, 12, 46, 40]; Lanús [34, 15, 7, 12, 64, 46]; Porteño [36, 3, 6, 27, 32, 109]; Liberal Argentino [36, 8, 7, 21, 30, 71] ...
- 1929 (arg29, torneio): Almagro [13, 5, 5, 3, 18, 15]; Tigre [14, 4, 4, 6, 26, 22]; Atlanta [13, 3, 3, 7, 10, 24]; Huracán [9, 6, 1, 2, 26, 11]; Banfield [14, 3, 4, 7, 18, 23]; Estudiantes de Buenos Aires [16, 1, 4, 11, 8, 41]; Colegiales [16, 4, 7, 5, 28, 28]; Gimnasia y Esgrima La Plata [15, 12, 0, 3, 32, 11] ...
- 1930 (arg30, Asociación > Primera División 1930): Barracas Central [36, 10, 7, 19, 40, 65]; Almagro [34, 10, 8, 16, 36, 47]; Gimnasia y Esgrima La Plata [34, 19, 4, 11, 72, 42]; Chacarita Juniors [35, 17, 7, 11, 58, 44]; Talleres (Remedios de Escalada) [34, 20, 9, 5, 56, 34]; Argentino del Sud [33, 1, 3, 29, 14, 100]; Estudiantes de Buenos Aires [34, 11, 7, 16, 49, 58]; Sportivo Barracas [34, 12, 9, 13, 54, 49] ...
- 1931 (arg31, Liga Argentina de Football - Primera División): River Plate [33, 19, 6, 8, 63, 39]; Boca Juniors [33, 21, 6, 6, 85, 49]; Estudiantes de La Plata [33, 19, 4, 10, 103, 51]; Lanús [33, 9, 2, 22, 43, 82]; Platense [32, 13, 3, 16, 52, 52]; Tigre [33, 7, 7, 19, 47, 70]; Racing Club [33, 19, 5, 9, 81, 51]
- 1931 (arg31a, Asociación Argentina de Football (Amateurs y Profesionales)-): Argentino de Banfield [8, 1, 2, 5, 8, 16]; Sportivo Barracas [14, 5, 4, 5, 35, 30]; Argentino de Quilmes [14, 7, 2, 5, 24, 24]; San Fernando [14, 1, 0, 13, 13, 48]; Colegiales [14, 3, 5, 6, 20, 26]; Estudiantil Porteño [14, 11, 2, 1, 31, 17]; Sportivo Buenos Aires [13, 9, 0, 4, 26, 16]; Sportivo Palermo [14, 5, 3, 6, 24, 23] ...
- 1932 (arg32, Liga Argentina de Football - 1932): Vélez Sarsfield [33, 14, 7, 12, 47, 52]; Atlanta [33, 6, 5, 22, 31, 80]; Boca Juniors [31, 18, 6, 7, 77, 43]; Gimnasia y Esgrima La Plata [33, 15, 7, 11, 78, 59]; Platense [33, 12, 9, 12, 55, 63]; Huracán [32, 14, 7, 11, 58, 58]; Independiente [33, 21, 6, 6, 69, 40]; Lanús [33, 6, 6, 21, 37, 73] ...
- 1932 (arg32a, Primera División): Barracas Central [30, 15, 6, 9, 43, 34]; Argentino de Temperley [29, 7, 8, 14, 37, 58]; Excursionistas [29, 9, 8, 12, 53, 62]; Colegiales [32, 17, 8, 7, 57, 44]; Estudiantes de Buenos Aires [31, 9, 12, 10, 53, 54]; Sportivo Buenos Aires [27, 4, 9, 14, 41, 61]; All Boys [31, 16, 5, 10, 70, 55]; Liberal Argentino [29, 7, 8, 14, 34, 41] ...
- 1933 (arg33a, Primera División): Barracas Central [17, 8, 3, 6, 30, 27]; All Boys [18, 8, 5, 5, 29, 25]; Defensores de Belgrano [18, 11, 4, 3, 33, 12]; Argentino de Temperley [18, 6, 6, 6, 25, 26]; Nueva Chicago [18, 11, 4, 3, 46, 21]; Sportivo Dock Sud [18, 12, 3, 3, 40, 15]; El Porvenir [18, 5, 3, 10, 31, 35]; Estudiantil Porteño [16, 6, 2, 8, 21, 30] ...
- 1934 (arg34, Liga Argentina de Football): Gimnasia y Esgrima La Plata [37, 12, 10, 15, 79, 83]; Platense [38, 16, 11, 11, 68, 71]; Atlanta-Argentinos Juniors [25, 2, 3, 20, 24, 69]; Estudiantes de La Plata [38, 17, 10, 11, 69, 56]; Argentinos Juniors [14, 0, 2, 12, 14, 44]
- 1934 (arg34a, Primera División): Estudiantes de Buenos Aires [21, 10, 4, 7, 36, 23]; Barracas Central [21, 7, 3, 11, 35, 43]; Banfield [21, 14, 5, 2, 50, 19]; Ramsar [22, 4, 6, 12, 22, 49]; Excursionistas [21, 9, 3, 9, 40, 35]; Gutenberg [19, 5, 3, 11, 29, 44]; Sportivo Dock Sud [21, 12, 4, 5, 35, 22]; All Boys [21, 6, 6, 9, 36, 41] ...
- 1939 (arg39, Championship Cup - Campeonato de Primera División): Boca Juniors [33, 16, 6, 11, 63, 40]; Ferro Carril Oeste [33, 4, 7, 22, 52, 111]
- 1940 (arg40, Argentina - First Division 1940): Independiente [33, 19, 7, 7, 89, 49]; Atlanta [33, 10, 4, 19, 57, 87]; Gimnasia y Esgrima La Plata [33, 16, 4, 13, 76, 86]; Lanús [32, 10, 3, 19, 73, 97]; Rosario Central [33, 10, 5, 18, 59, 75]; Boca Juniors [32, 22, 7, 3, 85, 36]; Chacarita Juniors [28, 8, 6, 14, 38, 60]; Huracán [33, 18, 4, 11, 79, 62] ...
- 1946 (arg46, torneio): Boca Juniors [29, 18, 4, 7, 66, 37]; Chacarita Juniors [29, 11, 2, 16, 51, 60]; Independiente [29, 12, 8, 9, 52, 51]; Newell's Old Boys [29, 10, 7, 12, 49, 41]; Tigre [29, 8, 5, 16, 53, 77]; San Lorenzo [29, 19, 6, 4, 87, 35]
- 1947 (arg47, Argentina - First Division 1947): Atlanta [29, 4, 10, 15, 31, 73]; Boca Juniors [29, 16, 8, 5, 68, 42]; Estudiantes de La Plata [29, 15, 7, 7, 63, 33]; River Plate [28, 20, 4, 4, 87, 36]; Platense [29, 8, 8, 13, 35, 52]; Newell's Old Boys [29, 7, 10, 12, 44, 61]; Independiente [29, 17, 7, 5, 64, 39]
- 1948 (arg48, torneio): Banfield [29, 8, 6, 15, 53, 67]; Racing Club [28, 15, 6, 7, 68, 43]; San Lorenzo [29, 11, 8, 10, 54, 54]
- 1949 (arg49, torneio): Racing Club [33, 20, 7, 6, 85, 46]; Boca Juniors [32, 9, 7, 16, 48, 54]; Independiente [33, 12, 9, 12, 63, 69]; Estudiantes de La Plata [33, 13, 12, 8, 52, 51]; Lanús [33, 8, 8, 17, 56, 83]
- 1950 (arg50, torneio): Vélez Sarsfield [33, 13, 5, 15, 44, 57]; Huracán [33, 12, 5, 16, 53, 62]
- 1951 (arg51, torneio): Banfield [34, 17, 11, 6, 63, 34]; Racing Club [34, 17, 13, 4, 61, 37]
- 1953 (arg53, Campeonato de Primera División 1953): Estudiantes de La Plata [29, 8, 4, 17, 33, 56]; Banfield [29, 8, 8, 13, 39, 47]; Rosario Central [29, 10, 7, 12, 42, 50]; Boca Juniors [29, 10, 6, 13, 40, 37]; Ferro Carril Oeste [29, 9, 7, 13, 40, 55]; Huracán [29, 9, 8, 12, 43, 50]
- 1958 (arg58, torneio): Huracán [29, 11, 3, 15, 46, 51]; River Plate [29, 14, 9, 6, 62, 45]
- 1959 (arg59, torneio): Gimnasia y Esgrima La Plata [29, 9, 7, 13, 48, 60]; Huracán [29, 8, 12, 9, 45, 56]; Estudiantes de La Plata [28, 8, 8, 12, 48, 61]; River Plate [29, 14, 4, 11, 49, 43]; Newell's Old Boys [29, 12, 8, 9, 34, 35]
- 1961 (arg61, torneio): Atlanta [29, 12, 11, 6, 47, 33]; Gimnasia y Esgrima La Plata [29, 12, 4, 13, 55, 51]
- 1964 (arg64, torneio): Estudiantes de La Plata [29, 6, 11, 12, 35, 46]; Independiente [29, 15, 7, 7, 43, 25]
- 1966 (arg66, torneio): Chacarita Juniors [37, 4, 13, 20, 32, 64]; Ferro Carril Oeste [37, 9, 9, 19, 37, 58]; Quilmes [37, 8, 10, 19, 37, 55]; Racing Club [37, 23, 13, 1, 64, 24]
- 1968 (arg68, Metropolitano Championship): Newell's Old Boys [21, 6, 8, 7, 24, 22]; Lanús [21, 8, 6, 7, 20, 21]
- 1969 (arg69, Metropolitano Championship): Colón [21, 4, 6, 11, 22, 43]; Unión [21, 6, 5, 10, 22, 26]
- 1970 (arg70, Campeonato Metropolitano [Metropolitan Championship]): Vélez Sarsfield [40, 17, 12, 11, 66, 50]; Racing Club [40, 10, 18, 12, 61, 52]; Banfield [40, 12, 16, 12, 46, 43]; Gimnasia y Esgrima La Plata [40, 20, 8, 12, 74, 57]; Boca Juniors [40, 23, 8, 9, 66, 39]; Chacarita Juniors [39, 20, 7, 12, 46, 42]; River Plate [40, 21, 11, 8, 72, 44]; Estudiantes de La Plata [40, 11, 15, 14, 53, 48] ...
- 1971 (arg71, Campeonato Metropolitano 1971 (Metropolitano Championship)): Gimnasia y Esgrima La Plata [35, 9, 14, 12, 49, 61]; Banfield [35, 6, 17, 12, 35, 52]
- 1971 (arg71, torneio): Boca Juniors [13, 7, 4, 2, 33, 17]; Huracán (Bahía Blanca) [13, 2, 4, 7, 7, 24]
- 1972 (arg72, [National Championship "Tourist Year in the Americs"]): Huracán [12, 5, 4, 3, 24, 19]; Newell's Old Boys [12, 2, 1, 9, 17, 26]
- 1973 (arg73, Nacional Championship): San Lorenzo [6, 1, 5, 0, 8, 7]; Vélez Sarsfield [6, 3, 3, 0, 12, 6]; San Martín (Tucumán) [7, 1, 1, 5, 8, 19]; San Lorenzo (Mar del Plata) [6, 2, 2, 2, 7, 5]; Estudiantes de La Plata [6, 2, 3, 1, 9, 4]; Juventud Antoniana [6, 0, 1, 5, 2, 14]; Cipolletti [6, 2, 1, 3, 13, 13]; San Martín (Mendoza) [6, 2, 1, 3, 5, 11] ...
- 1973 (arg73, torneio): Colón [9, 4, 1, 4, 15, 15]; Racing Club [9, 1, 2, 6, 13, 22]; Instituto [9, 5, 0, 4, 15, 9]; Chacarita Juniors [9, 4, 3, 2, 17, 12]; San Martín (Mendoza) [9, 3, 2, 4, 14, 17]; Juventud Antoniana [9, 2, 2, 5, 11, 21]; San Lorenzo (Mar del Plata) [9, 4, 2, 3, 13, 15]; River Plate [9, 4, 2, 3, 14, 12] ...
- 1974 (arg74, Campeonato Metropolitano [Metropolitan Championship]): All Boys [36, 8, 11, 17, 42, 60]; Racing Club [36, 18, 6, 12, 63, 53]; Banfield [36, 12, 9, 15, 64, 56]; Gimnasia y Esgrima La Plata [36, 15, 8, 13, 59, 51]; Huracán [36, 17, 10, 9, 70, 53]; Atlanta [36, 8, 10, 18, 41, 74]; Vélez Sarsfield [36, 15, 8, 13, 54, 44]; Rosario Central [38, 27, 6, 5, 78, 31] ...
- 1976 (arg76, Campeonato Metropolitano 1976 (Metropolitan Championship)): Newell's Old Boys [33, 12, 12, 9, 43, 40]; River Plate [33, 15, 10, 8, 56, 37]; San Lorenzo [33, 11, 9, 13, 38, 46]; Gimnasia y Esgrima La Plata [33, 10, 12, 11, 49, 50]; Quilmes [33, 12, 12, 9, 54, 54]; Unión [33, 15, 7, 11, 50, 36]; Boca Juniors [13, 8, 4, 1, 18, 9]; San Telmo [2, 0, 0, 2, 3, 7] ...
- 1977 (arg77, Campeonato Metropolitano 1977 (Metropolitano Championship)): Estudiantes de La Plata [45, 13, 17, 15, 60, 61]; All Boys [43, 11, 16, 16, 49, 66]; Boca Juniors [45, 22, 10, 13, 67, 45]; Independiente [43, 23, 14, 6, 81, 46]
- 1978 (arg78, Campeonato Metropolitano 1978 (Metropolitano Championship)): Chacarita Juniors [41, 11, 10, 20, 39, 69]; Platense [41, 8, 15, 18, 41, 63]
- 1978 (arg78, torneio): Newell's Old Boys [15, 7, 4, 4, 27, 20]; Atlético Ledesma [15, 6, 5, 4, 25, 22]; Platense [14, 0, 3, 11, 9, 29]; Huracán [14, 7, 5, 2, 31, 18]; San Martín (Mendoza) [14, 6, 3, 5, 21, 22]; San Martín (Tucumán) [14, 4, 6, 4, 24, 20]; Quilmes [14, 3, 4, 7, 15, 27]
- 1980 (arg80, torneio): Platense [50, 19, 20, 11, 61, 44]; Huracán [50, 17, 17, 16, 84, 75]; Talleres [50, 18, 21, 11, 82, 55]; Independiente [50, 19, 16, 15, 71, 60]; Argentinos Juniors [50, 22, 18, 10, 92, 69]; Newell's Old Boys [50, 20, 18, 12, 75, 47]; Estudiantes de La Plata [38, 11, 16, 11, 36, 45]; Quilmes [50, 11, 19, 20, 52, 61] ...
- 1981 (arg81, torneio): Boca Juniors [48, 28, 13, 7, 88, 39]; Talleres [48, 12, 15, 21, 45, 61]; Huracán [48, 17, 13, 18, 61, 70]; Racing Club [48, 14, 20, 14, 58, 52]; Independiente [48, 23, 12, 13, 72, 45]; Vélez Sarsfield [48, 16, 16, 16, 65, 62]; Instituto [48, 19, 10, 19, 74, 68]; River Plate [48, 21, 16, 11, 88, 62] ...
- 1982 (arg82, Campeonato Metropolitano 1982 (Metropolitano Championship)): Argentinos Juniors [37, 7, 15, 15, 49, 58]; Nueva Chicago [37, 8, 13, 16, 33, 50]; Vélez Sarsfield [37, 16, 11, 10, 45, 37]; Estudiantes de La Plata [37, 21, 13, 3, 50, 18]
- 1983 (arg83, torneio): Altos Hornos Zapla [12, 2, 4, 6, 8, 16]; Vélez Sarsfield [12, 8, 2, 2, 17, 9]; Newell's Old Boys [12, 6, 4, 2, 26, 16]; Independiente [12, 6, 5, 1, 23, 9]; San Martín (Tucumán) [12, 2, 2, 8, 11, 22]; Argentinos Juniors [12, 5, 6, 1, 22, 15]; Rosario Central [12, 7, 2, 3, 24, 9]; San Lorenzo [12, 5, 7, 0, 16, 8] ...
- 1984 (arg84, Campeonato Metropolitano 1984 (Metropolitano Championship)): Chacarita Juniors [37, 11, 13, 13, 30, 37]; Boca Juniors [37, 10, 11, 16, 34, 49]
- 1985 (arg85, torneio): Guaraní Antonio Franco [6, 2, 2, 2, 6, 10]; Talleres [6, 3, 2, 1, 8, 6]
- 1986 (arg87, torneio): Platense [39, 7, 15, 17, 42, 63]; River Plate [38, 14, 13, 11, 57, 49]; Temperley [39, 6, 13, 20, 28, 53]; Unión [39, 6, 20, 13, 31, 39]; Talleres [39, 11, 17, 11, 55, 62]
- 1987 (arg88, torneio): Instituto [37, 10, 15, 12, 43, 52]; Newell's Old Boys [39, 21, 14, 4, 68, 22]; Unión [39, 8, 13, 18, 39, 52]; San Lorenzo [37, 15, 17, 5, 48, 28]
- 1988 (arg89, torneio): Newell's Old Boys [37, 11, 13, 13, 42, 43]; Racing Club [37, 13, 16, 8, 47, 40]; Boca Juniors [37, 19, 9, 9, 55, 38]; Rosario Central [37, 10, 16, 11, 49, 54]
- 1989 (arg90, torneio): Instituto [39, 9, 10, 20, 32, 56]; Deportivo Mandiyú [39, 11, 14, 14, 40, 41]; Argentinos Juniors [39, 13, 13, 13, 42, 40]; Rosario Central [38, 17, 13, 8, 46, 35]; Boca Juniors [39, 11, 22, 6, 49, 36]
- 1990 (arg91, Torneo Apertura 1990): San Lorenzo [19, 4, 11, 4, 15, 17]; Boca Juniors [18, 6, 7, 5, 18, 15]; Vélez Sarsfield [20, 8, 9, 3, 27, 18]
- 1991 (arg91, Torneo Clausura 1991): Platense [19, 4, 10, 5, 10, 16]; Lanús [19, 5, 9, 5, 15, 15]
- 1991 (arg92, Apertura 1991): River Plate [18, 13, 3, 2, 32, 11]; Racing Club [18, 4, 10, 4, 14, 13]
- 1992 (arg92, Clausura 1992): Ferro Carril Oeste [20, 5, 9, 6, 13, 14]; Quilmes [20, 4, 4, 12, 14, 32]
- 1992 (arg93, Apertura 1992): Lanús [20, 8, 4, 8, 23, 24]; River Plate [20, 11, 5, 4, 29, 13]; Newell's Old Boys [20, 4, 4, 12, 14, 32]; Argentinos Juniors [20, 3, 8, 9, 17, 26]
- 1993 (arg93, Clausura 1993): Vélez Sarsfield [21, 11, 8, 2, 25, 8]; Boca Juniors [21, 6, 10, 5, 24, 20]; Newell's Old Boys [21, 5, 7, 9, 14, 20]; Talleres [22, 4, 7, 11, 15, 31]; Gimnasia y Esgrima La Plata [21, 6, 9, 6, 15, 16]; River Plate [18, 9, 3, 6, 31, 21]
- 1993 (arg94, Apertura 1993): Huracán [20, 5, 8, 7, 22, 24]; Belgrano [20, 5, 8, 7, 19, 30]
- 1996 (arg96, CLAUSURA TOURNAMENT): Gimnasia y Esgrima La Plata [20, 12, 3, 5, 44, 22]; Racing Club [20, 9, 5, 6, 27, 25]
- 1996 (arg97, Torneo Apertura 1996): Huracán Corrientes [20, 4, 8, 8, 32, 41]; River Plate [20, 15, 2, 3, 53, 23]
- 1997 (arg97, Torneo Apertura 1996 > Torneo Clausura 1997): Independiente [18, 9, 4, 5, 32, 21]; Lanús [18, 5, 6, 7, 19, 20]; Vélez Sarsfield [18, 9, 5, 4, 24, 15]; Colón [18, 9, 8, 1, 36, 22]
- 1997 (arg98, Apertura): Huracán [18, 3, 3, 12, 20, 32]; San Lorenzo [18, 9, 5, 4, 42, 32]; Rosario Central [18, 9, 5, 4, 32, 19]; River Plate [18, 14, 3, 1, 42, 14]
- 1998 (arg99, Apertura): Newell's Old Boys [19, 6, 7, 6, 21, 21]; Boca Juniors [19, 13, 6, 0, 45, 17]
- 1999 (arg99, Clausura): Unión [18, 8, 4, 6, 29, 27]; Colón [18, 6, 8, 4, 28, 21]

## Placares divergentes mantidos

Só uma fonte discorda, ou as outras não concordam entre si; fica o da fonte principal.

- 2001-03-17 Estudiantes de La Plata x Rosario Central: 3-0 (RSSSF); ESPN: 0-0
- 2001-04-01 Vélez Sarsfield x San Lorenzo: 0-2 (RSSSF); ESPN: 2-0
- 2001-10-19 Argentinos Juniors x Vélez Sarsfield: 0-2 (RSSSF); ESPN: 0-1
- 2001-11-18 Talleres x Newell's Old Boys: 1-2 (RSSSF); ESPN: 0-1
- 2003-06-21 Huracán x Lanús: 1-3 (RSSSF); ESPN: 3-1
- 2003-10-12 Rosario Central x Estudiantes de La Plata: 1-0 (ESPN); RSSSF: 2-0
- 2003-10-19 Arsenal de Sarandí x Olimpo: 1-0 (ESPN); RSSSF: 2-0
- 2004-02-15 Estudiantes de La Plata x Independiente: 1-2 (ESPN); RSSSF: 1-4

## Jogos que só outra fonte tem (não acrescentados)

- 2001-03-04 Huracán x Los Andes 2-1 (ESPN)
- 2001-05-11 Almagro x Boca Juniors 0-0 (ESPN)
- 2001-05-13 Almagro x Argentinos Juniors 0-0 (ESPN)
- 2001-08-25 Colón x Nueva Chicago 1-0 (ESPN)
- 2003-02-16 Newell's Old Boys x River Plate 2-2 (ESPN)
- 2003-03-09 Racing Club x Independiente 1-1 (ESPN)
- 2004-02-12 San Lorenzo x Racing Club 0-4 (RSSSF)
- 2004-02-12 Colón x Lanús 3-2 (RSSSF)
- 2004-02-12 Arsenal de Sarandí x Atlético de Rafaela 3-2 (RSSSF)
- 2004-02-12 River Plate x Estudiantes de La Plata 3-0 (RSSSF)
- 2004-02-12 Olimpo x Talleres 1-4 (RSSSF)
- 2004-02-12 Rosario Central x Boca Juniors 1-2 (RSSSF)
- 2004-02-12 Newell's Old Boys x River Plate 2-3 (RSSSF)
- 2004-02-12 Chacarita Juniors x Rosario Central 1-1 (RSSSF)
- 2004-02-12 Estudiantes de La Plata x Quilmes 1-0 (RSSSF)
- 2004-02-12 Nueva Chicago x Arsenal de Sarandí 2-1 (RSSSF)
- 2004-02-12 Boca Juniors x Vélez Sarsfield 3-3 (RSSSF)
- 2004-02-12 Talleres x Colón 4-0 (RSSSF)
- 2004-02-24 Estudiantes de La Plata x Atlético de Rafaela 0-0 (RSSSF)
- 2005-09-25 Newell's Old Boys x Estudiantes de La Plata 3-2 (RSSSF)
- 2006-05-14 Belgrano x Olimpo 2-1 (RSSSF)
- 2007-06-20 Huracán x Godoy Cruz 2-0 (RSSSF)
- 2007-06-21 Tigre x Nueva Chicago 1-0 (RSSSF)
- 2010-05-16 All Boys x Rosario Central 1-1 (RSSSF)
- 2010-05-16 Rosario Central x All Boys 0-3 (RSSSF)
- 2011-02-06 Independiente x Tigre 0-1 (RSSSF)
- 2012-02-04 Estudiantes de La Plata x Banfield 2-1 (RSSSF)
- 2013-06-29 Vélez Sarsfield x Newell's Old Boys 1-0 (football-data.co.uk)
- 2013-11-18 Colón x Atlético de Rafaela 0-1 (football-data.co.uk)
- 2014-05-24 Colón x Atlético de Rafaela 0-1 (football-data.co.uk)
- 2014-05-25 San Lorenzo x River Plate 0-1 (football-data.co.uk)
- 2015-01-29 Boca Juniors x Vélez Sarsfield 1-0 (football-data.co.uk)
- 2015-11-19 Tigre x Colón 1-4 (football-data.co.uk)
- 2015-11-20 Independiente x Belgrano 4-1 (football-data.co.uk)
- 2015-11-20 Gimnasia y Esgrima La Plata x San Martín (San Juan) 5-1 (football-data.co.uk)
- 2015-11-21 Racing Club x Estudiantes de La Plata 2-1 (football-data.co.uk)
- 2015-11-21 Unión x Aldosivi 1-2 (football-data.co.uk)
- 2015-11-23 Quilmes x Olimpo 0-1 (football-data.co.uk)
- 2015-11-24 Lanús x Newell's Old Boys 2-1 (football-data.co.uk)
- 2015-11-25 Banfield x Argentinos Juniors 1-0 (football-data.co.uk)
- 2015-11-28 Colón x Belgrano 0-1 (football-data.co.uk)
- 2015-11-28 Olimpo x Estudiantes de La Plata 0-1 (football-data.co.uk)
- 2015-11-28 Lanús x Gimnasia y Esgrima La Plata 1-0 (football-data.co.uk)
- 2015-11-29 Independiente x Racing Club 0-2 (football-data.co.uk)
- 2021-01-17 Vélez Sarsfield x Rosario Central 3-1 (football-data.co.uk)
- 2023-12-01 Gimnasia y Esgrima La Plata x Colón 1-0 (football-data.co.uk)

## Nomes sem clube (linhas ignoradas)

xxx (4), Later, Talleres (Cba.) lost the points: Talleres (Cba.) (2), Douglas Haig (2), xxx 0-0 (2), Almirante Brown (2), at 81' because of incidents (1), Sportivo BalcarcePalermo (1), PorteñoBoca Juniors (1), Sportivo BalcarceChacarita Juniors (1), UniversalArgentinos Juniors (1), San LorenzoLiberal Argentino (1), IndependienteSan Isidro (1), Sportivo AlmagroRiver Plate (1), Argentino del SudSportivo Buenos Aires (1), PlatenseBoca Juniors (1), Juan Faustino Bescos        83m (1), (pen) (1), Gabriel Oscar Gil           42m (1), (pen), 63m 0-2 (1), in 90m, extra time not played, annulled on Jan 12, San Lorenzo de Almagro, Buenos Aires (1), awd 1-0 (1), on aggregate score (1), PK 6-5 (1), PK 5-3 (1), PK 4-2 (1), Rosario (1), Atl Rafaela (1), xxx 1-2 1-1 1-1 1-1 5-2 0-2 (1), xxx 4-1 2-2 1-3 1-1 2-1 (1), xxx 1-0 2-4 2-1 2-0 (1), xxx 1-0 4-2 0-2 (1), xxx 2-0 0-0 (1), San Martin T        2-3 0-2 1-0 3-0 2-0 (1), xxx 3-0 1-2 2-2 1-0 0-2 3-2 (1), Atl Tucuman         3-2 (1), xxx 1-3 2-2 1-2 4-4 5-3 (1), xxx 2-2 1-0 3-1 1-1 (1), xxx 2-0 1-0 3-0 (1), xxx 3-1 3-2 (1), xxx 2-2 (1), San Martin SJ       3-2 2-0 3-1 0-0 1-2 1-0 (1), xxx 1-0 3-1 4-2 1-2 0-0 1-1 (1), xxx 3-0 2-2 2-1 2-1 1-1 (1), Douglas Haig        2-3 2-0 (1), xxx 2-2 1-0 1-1 1-2 (1), xxx 2-0 2-3 1-1 (1), xxx 3-1 1-1 (1), San Martin          3-1 4-1 3-2 0-1 0-0 5-1 (1), xxx 3-1 0-1 2-4 2-1 1-1 1-1 (1), xxx 3-1 3-1 2-0 1-0 0-0 (1), Defensa y Justicia  4-1 3-0 (1), xxx 1-1 3-4 2-1 0-1 (1), Dep Italiano        1-1 3-2 0-3 (1), xxx 3-1 2-3 2-7 (1), Dep Moron           4-1 2-2 1-0 1-0 (1), xxx 4-0 0-0 (1), xxx 1-0 (1), San Miguel          0-1 4-2 2-0 1-0 2-4 2-1 (1)
