# Brasileirão 1959–2002: relatório da carga

Gerado por `scripts/ingest_rsssf.py` a partir das páginas do RSSSF Brasil (`data/raw/rsssf/`). Não editar à mão: rode o script de novo.

- 12366 jogos de 1959 a 2002; 44 jogos excluídos.
- 371 jogos com data aproximada (a página dá a rodada em mais de um dia e o jogo não traz o dia; vai o primeiro).
- 8 jogos com status (resultado alterado no tribunal ou jogo interrompido com placar mantido): vale o placar de campo.

## Escopo

- 1959–1968: Taça Brasil. 1967–1970: Robertão (em 1967 e 1968 os dois torneios estão na mesma temporada; o `stage` começa com o nome do torneio).
- 1971–2002: Campeonato Brasileiro, todas as fases da disputa principal.
- 1986: fica de fora o Torneio Paralelo (Grupos E–H), classificado pelo RSSSF como segundo nível.
- 1987: Módulo Verde (Copa União), Módulo Amarelo e a decisão Sport x Guarani; ficam de fora os Módulos Azul e Branco.
- 1999: fica de fora a seletiva para a Libertadores disputada depois do campeonato.
- 2000 (Copa João Havelange): Módulo Azul e a fase final; ficam de fora os grupos dos Módulos Amarelo, Verde e Branco.

## Jogos por temporada

Conferência com o dataset [rodrigoazs/football-matches-dataset](https://github.com/rodrigoazs/football-matches-dataset) (`data/raw/crosscheck-rodrigoazs/`, só tem 1971–2002), comparando data e placar. As diferenças foram conferidas na página do RSSSF: são datas que o outro dataset erra (ano não lido em "[Jan 24/87]", 2º jogo de ida e volta, ano bissexto), prorrogação somada aqui, os módulos de 1986/1987/2000 que ele inclui e os jogos excluídos abaixo. Para 1959–1970 não há segunda fonte acessível: o Robertão bate com o regulamento (todos contra todos + quadrangular) e na Taça Brasil todo confronto tem 2 ou 3 jogos.

| Temporada | Jogos no CSV | rodrigoazs | Só no CSV | Só em rodrigoazs | Excluídos |
|---|---|---|---|---|---|
| 1959 | 36 | – | – | – | 0 |
| 1960 | 37 | – | – | – | 0 |
| 1961 | 38 | – | – | – | 0 |
| 1962 | 39 | – | – | – | 0 |
| 1963 | 43 | – | – | – | 2 |
| 1964 | 49 | – | – | – | 0 |
| 1965 | 48 | – | – | – | 0 |
| 1966 | 47 | – | – | – | 0 |
| 1967 | 178 | – | – | – | 0 |
| 1968 | 195 | – | – | – | 2 |
| 1969 | 141 | – | – | – | 1 |
| 1970 | 142 | – | – | – | 0 |
| 1971 | 229 | 229 | 0 | 0 | 0 |
| 1972 | 352 | 352 | 0 | 0 | 0 |
| 1973 | 656 | 656 | 0 | 0 | 0 |
| 1974 | 447 | 447 | 0 | 0 | 0 |
| 1975 | 430 | 430 | 0 | 0 | 0 |
| 1976 | 410 | 410 | 0 | 0 | 0 |
| 1977 | 484 | 484 | 0 | 0 | 1 |
| 1978 | 792 | 792 | 0 | 0 | 0 |
| 1979 | 580 | 581 | 0 | 1 | 3 |
| 1980 | 307 | 306 | 1 | 0 | 0 |
| 1981 | 306 | 306 | 0 | 0 | 0 |
| 1982 | 291 | 291 | 12 | 12 | 0 |
| 1983 | 322 | 322 | 1 | 1 | 0 |
| 1984 | 310 | 310 | 17 | 17 | 0 |
| 1985 | 517 | 517 | 0 | 0 | 0 |
| 1986 | 538 | 680 | 29 | 171 | 0 |
| 1987 | 235 | 423 | 2 | 190 | 12 |
| 1988 | 290 | 290 | 1 | 1 | 0 |
| 1989 | 193 | 193 | 0 | 0 | 1 |
| 1990 | 204 | 204 | 0 | 0 | 0 |
| 1991 | 195 | 196 | 1 | 2 | 1 |
| 1992 | 216 | 216 | 0 | 0 | 0 |
| 1993 | 254 | 255 | 1 | 2 | 0 |
| 1994 | 310 | 310 | 0 | 0 | 0 |
| 1995 | 282 | 282 | 0 | 0 | 0 |
| 1996 | 271 | 290 | 2 | 21 | 19 |
| 1997 | 351 | 351 | 21 | 21 | 0 |
| 1998 | 297 | 297 | 0 | 0 | 0 |
| 1999 | 249 | 249 | 8 | 8 | 1 |
| 2000 | 330 | 1067 | 29 | 766 | 1 |
| 2001 | 386 | 386 | 1 | 1 | 0 |
| 2002 | 339 | 339 | 4 | 4 | 0 |

## Jogos excluídos

| Temporada | Data | Jogo | Motivo | Página |
|---|---|---|---|---|
| 1963 | ? | Sport x Bahia | sem data | cbr1963.htm |
| 1963 | ? | Bahia x Sport | sem data | cbr1963.htm |
| 1968 | 1968-12-11 | Botafogo x Metropol | sem placar de campo (dns): 1 | cbr1968.htm |
| 1968 | 1969-03-12 | Metropol x Botafogo | sem placar de campo (WO-0): 2 | cbr1968.htm |
| 1969 | 1969-11-12 | GRÊMIO x AMÉRICA | abandonado: finished at 65' due to lack of electricity | rgp1969.htm |
| 1977 | 1977-12-18 | Desportiva x Fluminense-BA | sem placar de campo (abd): influenced by a bribe offered by the Bahia state FA, Fluminense abandoned the match so Desportiva would not snatch Vitória-BA's berth to 3rd phase | br1977.htm |
| 1979 | 1979-11-03 | São Paulo-RS x Operário-PR | sem placar de campo (awd): points awarded to S.Paulo after Operário had only 6 players in the field at 85', originally 0-1 | br1979.htm |
| 1979 | 1979-12-04 | Goiás x Atlético-MG | sem placar de campo (dns): Atlético forfeited the tournament, points awarded to Goiás | br1979.htm |
| 1979 | 1979-12-08 | Atlético-MG x Internacional-RS | sem placar de campo (dns): Atlético forfeited the tournament, points awarded to Internacional | br1979.htm |
| 1987 | ? | Fluminense x Goiás | sem data | br1987.htm |
| 1987 | ? | Internacional x Santos | sem data | br1987.htm |
| 1987 | ? | Cruzeiro x São Paulo | sem data | br1987.htm |
| 1987 | ? | Vasco da Gama x Coritiba | sem data | br1987.htm |
| 1987 | 1987-10-04 | Atlético-PR x América-RJ | sem placar de campo (0-WO): awarded 1-0 | br1987.htm |
| 1987 | 1987-10-06 | Joinville x América-RJ | sem placar de campo (0-WO): awarded 1-0 | br1987.htm |
| 1987 | 1987-10-08 | Guarani x América-RJ | sem placar de campo (0-WO): awarded 1-0 | br1987.htm |
| 1987 | 1987-10-11 | América-RJ x Criciúma | sem placar de campo (WO-0): awarded 0-1 | br1987.htm |
| 1987 | 1987-10-13 | Internacional x América-RJ | sem placar de campo (0-WO): awarded 1-0 | br1987.htm |
| 1987 | 1987-10-15 | América-RJ x Atlético-GO | sem placar de campo (WO-0): awarded 0-1 | br1987.htm |
| 1987 | 1987-10-18 | América-RJ x Rio Branco | sem placar de campo (WO-0): awarded 0-1 | br1987.htm |
| 1987 | 1987-10-20 | América-RJ x Portuguesa | sem placar de campo (WO-0): awarded 0-1 | br1987.htm |
| 1989 | 1989-10-22 | Coritiba x Santos | sem placar de campo (dns): awarded 0-1, Coritiba refused to play the match earlier than the others of the round, as a result the club was eliminated from the tournament | br1989.htm |
| 1991 | 1991-05-01 | Fluminense x Botafogo | sem placar de campo (awd): awarded 1-0, abandoned at 0-0 during halftime due to pitch invasion by Botafogo´s fans | br1991.htm |
| 1996 | ? | Bahia x Palmeiras | sem data | br1996.htm |
| 1996 | ? | Fluminense x Bragantino | sem data | br1996.htm |
| 1996 | ? | Atletico MG x Corinthians | sem data | br1996.htm |
| 1996 | ? | Criciuma x Vitoria | sem data | br1996.htm |
| 1996 | ? | Vasco da Gama x Sport | sem data | br1996.htm |
| 1996 | ? | Palmeiras x Internacional | sem data | br1996.htm |
| 1996 | ? | Juventude x Bahia | sem data | br1996.htm |
| 1996 | ? | Corinthians x Criciuma | sem data | br1996.htm |
| 1996 | ? | Sao Paulo x Portuguesa | sem data | br1996.htm |
| 1996 | ? | Flamengo x Atletico MG | sem data | br1996.htm |
| 1996 | ? | Guarani x Fluminense | sem data | br1996.htm |
| 1996 | ? | Sao Paulo x Goias | sem data | br1996.htm |
| 1996 | ? | Sport x Criciuma | sem data | br1996.htm |
| 1996 | ? | Vasco da Gama x Gremio | sem data | br1996.htm |
| 1996 | ? | Vitoria x Atletico MG | sem data | br1996.htm |
| 1996 | ? | Botafogo x Palmeiras | sem data | br1996.htm |
| 1996 | ? | Portuguesa x Bragantino | sem data | br1996.htm |
| 1996 | ? | Cruzeiro x Juventude | sem data | br1996.htm |
| 1996 | ? | Internacional x Bahia | sem data | br1996.htm |
| 1999 | 1999-08-19 | Vasco da Gama x Paraná | sem placar de campo (abd): abandoned at 1-1 in 90' after third Vasco was sent off and Vasco president Miranda threatened the referee; result apparently stood | br1999.htm |
| 2000 | 2000-12-30 | Vasco da Gama x São Caetano | sem placar de campo (abd):  | br2000.htm |

## Datas suspeitas (mantidas, com nota)

O clube aparece com dois jogos no mesmo dia na página do RSSSF.

| Data | Jogo | Fase | Rodada |
|---|---|---|---|
| 1977-10-30 | dom-bosco 2-2 caxias | 1ª fase - Grupo A |  |
| 1977-10-30 | gremio-maringa 1-0 caxias | 1ª fase - Grupo A |  |
| 1978-06-04 | america-sp 5-0 mixto | 2ª fase - Grupo G |  |
| 1978-06-04 | juventude 1-1 america-sp | 2ª fase - Grupo I |  |
| 1979-11-18 | sao-paulo-rs 1-0 goias | 2ª fase - Grupo K |  |
| 1979-11-18 | goias 2-0 america-mg | 2ª fase - Grupo M |  |
| 1980-05-04 | america-rj 2-2 joinville | 2ª fase - Grupo I | 6 |
| 1980-05-04 | guarani 1-1 santos | 2ª fase - Grupo I | 6 |
| 1980-05-04 | guarani 3-2 america-rj | 2ª fase - Grupo I | 6 |
| 1989-10-04 | coritiba 2-1 sport | 1ª fase - Grupo B | 7 |
| 1989-10-04 | coritiba 1-3 palmeiras | 1ª fase - Grupo B | 8 |
| 1989-10-29 | athletico-pr 3-0 vitoria | 2ª fase - Grupo B | 1 |
| 1989-10-29 | bahia 0-0 vitoria | 2ª fase - Grupo B | 1 |
| 1991-03-23 | bahia 0-0 botafogo | 1ª fase | 5 |
| 1991-03-23 | botafogo 0-3 santos | 1ª fase | 9 |
| 1991-04-06 | atletico-mg 4-1 santos | 1ª fase | 12 |
| 1991-04-06 | portuguesa 1-1 atletico-mg | 1ª fase | 13 |
| 1993-10-09 | corinthians 2-0 internacional | 1ª fase - Grupo A | 4 |
| 1993-10-09 | bragantino 3-3 internacional | 1ª fase - Grupo A | 8 |
| 1994-10-22 | santos 2-0 botafogo | 1ª etapa - Grupo F |  |
| 1994-10-22 | flamengo 2-0 palmeiras | 1ª etapa - Grupo F |  |
| 1994-10-22 | palmeiras 2-0 santos | 1ª etapa - Grupo F |  |
| 1994-10-22 | botafogo 3-2 parana | 1ª etapa - Grupo F |  |
| 1995-11-09 | botafogo 3-0 uniao-sao-joao | 2ª etapa |  |
| 1995-11-09 | flamengo 0-3 santos | 2ª etapa |  |
| 1995-11-09 | uniao-sao-joao 2-2 flamengo | 2ª etapa |  |
| 1996-10-16 | juventude 2-3 criciuma | 1ª fase | 6 |
| 1996-10-16 | criciuma 2-3 portuguesa | 1ª fase | 16 |

## Duplicados descartados

- ('1967-06-08', 'palmeiras', 'gremio')
- ('1968-12-10', 'vasco', 'santos')
- ('1969-12-07', 'palmeiras', 'botafogo')
