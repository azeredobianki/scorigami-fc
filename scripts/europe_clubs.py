"""Cadastro dos clubes das ligas europeias: grafias do engsoccerdata -> clube.

MERGE junta nomes do engsoccerdata que são o mesmo clube (troca de nome ou
refundação reconhecida). O valor é (nome canônico no engsoccerdata, nome da
época para mostrar ou None). DISPLAY troca o nome canônico pelo nome com
acentos/forma usual. ALIASES liga grafias das outras fontes que a votação por
placar não resolve (clube recém-promovido, por exemplo).
"""

COUNTRY = {
    "premier-league": ("Inglaterra", "eng"),
    "la-liga": ("Espanha", "esp"),
    "serie-a": ("Itália", "ita"),
    "bundesliga": ("Alemanha", "ger"),
    "ligue-1": ("França", "fra"),
}

MERGE = {
    "premier-league": {},
    "la-liga": {},
    "serie-a": {
        "Genova 1893 Circolo del Calcio": ("Genoa CFC", "Genova 1893"),
        "Parma AC": ("Parma FC", None),
        "Lanerossi Vicenza": ("Vicenza Calcio", "Lanerossi Vicenza"),
        "Salernitana Sport": ("Salernitana Calcio 1919", None),
        "A.C.R. Messina": ("FC Messina", None),
        "AC Liguria": ("Sampierdarenese", "Liguria"),
        "AS Livorno": ("US Livorno", None),
    },
    "bundesliga": {
        "Frankfurter SG Eintracht": ("Eintracht Frankfurt", None),
        "Meidericher SV": ("MSV Duisburg", "Meidericher SV"),
        "SV Bayer 04 Leverkusen": ("Bayer Leverkusen", None),
    },
    "ligue-1": {
        "Brest Armorique FC": ("Stade Brest", "Brest Armorique"),
        "Matra Racing": ("Racing Club de France", "Matra Racing"),
        "AS Cannes-Grasse": ("AS Cannes", "AS Cannes-Grasse"),
        "Red Star Olympique": ("Red Star FC", "Red Star Olympique"),
        "Red Star Olympique Audonien": ("Red Star FC", "Red Star Olympique Audonien"),
        "Stade Red Star": ("Red Star FC", "Stade Red Star"),
        "Stade Francais": ("Stade Francais FC", None),
        "Montpellier La Paillade SC": ("Montpellier HSC", "Montpellier La Paillade"),
        "ATAC Troyes": ("ESTAC Troyes", None),
        "US Valenciennes-Anzin": ("Valenciennes FC", "US Valenciennes-Anzin"),
        "UA Sedan-Torcy": ("CS Sedan", "UA Sedan-Torcy"),
    },
}

DISPLAY = {
    "premier-league": {"Accrington F.C.": "Accrington"},
    "la-liga": {
        "AD Almeria": "AD Almería", "UD Almeria": "UD Almería", "Athletic Bilbao": "Athletic Bilbao",
        "Atletico Madrid": "Atlético de Madrid", "Atletico Tetuan": "Atlético Tetuán",
        "CD Castellon": "CD Castellón", "CD Leganes": "CD Leganés", "CD Logrones": "CD Logroñés",
        "CD Malaga": "CD Málaga", "Malaga CF": "Málaga CF", "CP Merida": "CP Mérida",
        "Cadiz CF": "Cádiz CF", "Celta Vigo": "Celta de Vigo", "Cordoba CF": "Córdoba CF",
        "Deportivo La Coruna": "Deportivo La Coruña", "Espanyol Barcelona": "Espanyol",
        "Gimnastic": "Gimnàstic de Tarragona", "Hercules CF": "Hércules CF", "Real Jaen": "Real Jaén",
        "Recreativo Huelva": "Recreativo de Huelva", "Sporting Gijon": "Sporting de Gijón",
        "CD Alaves": "Deportivo Alavés", "Girona": "Girona FC",
    },
    "serie-a": {
        "Genoa CFC": "Genoa", "Lazio Roma": "Lazio", "AC Venezia": "Venezia", "Parma FC": "Parma",
        "Vicenza Calcio": "Vicenza", "Salernitana Calcio 1919": "Salernitana", "FC Messina": "Messina",
        "Sampierdarenese": "Sampierdarenese", "US Livorno": "Livorno", "US Alessandria 1912": "Alessandria",
        "Inter": "Internazionale", "Juventus": "Juventus FC", "AS Varese 1910": "Varese", "Calcio Lecco 1912": "Lecco",
        "SPAL 1907 Ferrara": "SPAL", "Genova 1893 Circolo del Calcio": "Genova 1893",
    },
    "bundesliga": {
        "1. FC Koln": "1. FC Köln", "1. FC Nurnberg": "1. FC Nürnberg", "1. FC Saarbrucken": "1. FC Saarbrücken",
        "Bayern Munchen": "Bayern München", "Bor. Monchengladbach": "Borussia Mönchengladbach",
        "Fortuna Dusseldorf": "Fortuna Düsseldorf", "Fortuna Koln": "Fortuna Köln",
        "Preussen Munster": "Preußen Münster", "RasenBallsport Leipzig": "RB Leipzig",
        "SpVgg Greuther Furth": "SpVgg Greuther Fürth", "TSV 1860 Munchen": "TSV 1860 München",
        "Rot-Weiss Essen": "Rot-Weiss Essen", "TeBe Berlin": "Tennis Borussia Berlin",
        "1899 Hoffenheim": "TSG Hoffenheim", "Bayer 05 Uerdingen": "Bayer 05 Uerdingen",
    },
    "ligue-1": {
        "AS Saint-Etienne": "AS Saint-Étienne", "AS Beziers": "AS Béziers", "Girondins Bordeaux": "Girondins de Bordeaux",
        "LB Chateauroux": "LB Châteauroux", "Evian Thonon Gaillard": "Évian Thonon Gaillard",
        "Nimes Olympique": "Nîmes Olympique", "SC Nimes": "SC Nîmes", "FC Sete": "FC Sète",
        "Olympique Ales": "Olympique Alès", "Olympique Lyon": "Olympique Lyonnais",
        "Olympique Marseille": "Olympique de Marseille", "Stade Reims": "Stade de Reims",
        "Stade Rennes": "Stade Rennais", "Stade Brest": "Stade Brestois", "Stade Francais FC": "Stade Français",
        "Le Mans UC 72": "Le Mans", "ESTAC Troyes": "ESTAC Troyes", "Red Star FC": "Red Star",
        "Stade Olympique Montpellierain": "SO Montpellier", "Association Sportive Avignonaise": "AS Avignon",
        "CA Paris (alt)": "CA Paris", "Olympique Lillois Lille": "Olympique Lillois",
        "Sporting Toulon Var": "Sporting Toulon Var", "US Boulogne": "US Boulogne",
    },
}

# grafia em outra fonte -> nome canônico no engsoccerdata (ou NEW:<nome> para clube novo)
ALIASES = {
    "premier-league": {},
    "la-liga": {},
    "serie-a": {},
    "bundesliga": {"SV 07 Elversberg": "NEW:SV Elversberg"},
    "ligue-1": {"Le Mans FC": "Le Mans UC 72", "ES Troyes AC": "ESTAC Troyes", "Paris FC": "Paris FC"},
}

# Correções manuais, por (temporada, mandante, visitante), com a fonte na nota.
# score: placar de campo; drop: tira o jogo; status/note vão para o CSV.
FIXES = {
    "ligue-1": {
        (2013, "fc-nantes", "sc-bastia"): dict(
            score=(2, 0), status="resultado alterado", note="2-0 em campo; vitória dada ao Bastia (Nantes escalou suspenso)"),
        (2016, "sc-bastia", "olympique-lyonnais"): dict(
            drop=True, note="interrompido no intervalo (0-0) por invasão; resultado dado no tribunal"),
    },
    "serie-a": {
        (1989, "atalanta", "ssc-napoli"): dict(
            score=(0, 0), status="resultado alterado", note="0-0 em campo; 0-2 para o Napoli no tribunal (Alemão atingido por moeda)"),
        (2020, "hellas-verona", "as-roma"): dict(
            score=(0, 0), status="resultado alterado", note="0-0 em campo; 3-0 para o Verona no tribunal (Roma escalou jogador irregular)"),
    },
}
