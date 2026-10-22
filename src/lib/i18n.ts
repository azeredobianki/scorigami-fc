// Textos do site em português, inglês e espanhol. Cada idioma é um objeto com
// as mesmas chaves; frases que dependem de números, datas ou da liga são funções.
// Usado no build e no navegador.
export type Lang = "pt" | "en" | "es";
export const LANGS: Lang[] = ["pt", "en", "es"];
export const LANG_LABEL: Record<Lang, string> = { pt: "Português", en: "English", es: "Español" };
export const LANG_SHORT: Record<Lang, string> = { pt: "PT", en: "EN", es: "ES" };
export const HTML_LANG: Record<Lang, string> = { pt: "pt-BR", en: "en", es: "es" };

export const isLang = (x: unknown): x is Lang => LANGS.includes(x as Lang);
/** Idioma da página no navegador, pelo atributo lang do <html>. */
export const pageLang = (): Lang => {
  const l = document.documentElement.lang.slice(0, 2);
  return isLang(l) ? l : "pt";
};

/** Liga como aparece nas frases. `all` marca a pseudo-liga "todas as competições". */
export interface LeagueRef {
  slug: string;
  short: string;
  name: string;
  fem?: boolean;
}
const ALL_SLUG = "todas";

function make(lang: Lang) {
  const locale = HTML_LANG[lang] === "en" ? "en-US" : HTML_LANG[lang] === "es" ? "es-ES" : "pt-BR";
  const N = (n: number) => n.toLocaleString(locale);
  const P = (n: number, one: string, many: string) => `${N(n)} ${n === 1 ? one : many}`;
  const and = { pt: "e", en: "and", es: "y" }[lang];
  const join = (xs: string[]) => (xs.length > 1 ? `${xs.slice(0, -1).join(", ")} ${and} ${xs[xs.length - 1]}` : xs[0] ?? "");
  const months = {
    pt: ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"],
    en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    es: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
  }[lang];
  const long = (iso: string) => {
    const [y, m, d] = iso.split("-").map(Number);
    return lang === "en" ? `${months[m - 1]} ${d}, ${y}` : `${d} de ${months[m - 1]} de ${y}`;
  };
  const short = (iso: string) => {
    const [y, m, d] = iso.split("-");
    return lang === "en" ? `${m}/${d}/${y}` : `${d}/${m}/${y}`;
  };
  const pct = (x: number) => x.toLocaleString(locale, { maximumFractionDigits: 1 });
  return { lang, locale, N, P, join, long, short, pct };
}

// Frases com a liga: "no Brasileirão", "in the Premier League", "en la Serie A".
const isAll = (lg: LeagueRef) => lg.slug === ALL_SLUG;
const art = {
  pt: {
    in: (lg: LeagueRef, n = lg.short) => (isAll(lg) ? "em todas as competições" : `${lg.fem ? "na" : "no"} ${n}`),
    of: (lg: LeagueRef, n = lg.short) => (isAll(lg) ? "de todas as competições" : `${lg.fem ? "da" : "do"} ${n}`),
    the: (lg: LeagueRef, n = lg.short) => (isAll(lg) ? "todas as competições" : `${lg.fem ? "a" : "o"} ${n}`),
  },
  en: {
    in: (lg: LeagueRef, n = lg.short) => (isAll(lg) ? "in all competitions" : `in ${n === "MLS" ? "" : "the "}${n}`),
    of: (lg: LeagueRef, n = lg.short) => (isAll(lg) ? "of all competitions" : `of ${n === "MLS" ? "" : "the "}${n}`),
    the: (lg: LeagueRef, n = lg.short) => (isAll(lg) ? "all competitions" : `${n === "MLS" ? "" : "the "}${n}`),
  },
  es: {
    in: (lg: LeagueRef, n = lg.short) => (isAll(lg) ? "en todas las competiciones" : `en ${lg.fem ? "la" : "el"} ${n}`),
    of: (lg: LeagueRef, n = lg.short) => (isAll(lg) ? "de todas las competiciones" : `${lg.fem ? "de la" : "del"} ${n}`),
    the: (lg: LeagueRef, n = lg.short) => (isAll(lg) ? "todas las competiciones" : `${lg.fem ? "la" : "el"} ${n}`),
  },
};

function pt() {
  const f = make("pt");
  const { N, P, join } = f;
  const L = art.pt;
  return {
    ...f,
    L,
    allShort: "todas as competições",
    times: (n: number) => (n ? P(n, "vez", "vezes") : "Nunca"),
    drew: (a: string, b: string) => `${a} e ${b} empataram`,
    beat: (w: string, l: string) => `${w} venceu ${l}`,
    tipFirst: (date: string, match: string, times: string) => `Primeira vez: ${date}, ${match} · ${times}`,
    tipLast: (times: string, date: string, match: string) => `${times} · última: ${date}, ${match}`,
    tipNever: "Nunca aconteceu",
    axisNorm: ["Placar do vencedor", "Placar do perdedor"] as [string, string],
    axisMando: ["Gols do mandante", "Gols do visitante"] as [string, string],
    legendNever: "Nunca",
    legendRare: "Raro",
    legendCommon: "Comum",
    legendFirst: "Primeira vez:",
    noScorigami: "Nenhuma scorigami.",
    noGames: "Nenhum jogo neste recorte.",
    hlUnseen: "Nunca aconteceram",
    hlUnseenText: (list: string) => `${list}. São os placares inéditos mais prováveis pela média de gols.`,
    hlCommon: "Mais comum",
    hlCommonText: (score: string, n: number, pct: string) => `${score}, em ${P(n, "jogo", "jogos")} (${pct}% do total).`,
    hlRout: "Maior goleada",
    hlRoutText: (match: string, date: string, league: string) => `${match}, em ${date}${league ? ` (${league})` : ""}.`,
    hlDrought: "Há mais tempo sem acontecer",
    hlAgo: (y: number) => (y < 1 ? "menos de 1 ano" : `há ${P(y, "ano", "anos")}`),
    hlExclusive: "Mais placares exclusivos",
    hlExclusiveText: (club: string, n: number, list: string) =>
      `${club}, com ${P(n, "placar que só ele teve", "placares que só ele teve")}: ${list}.`,
    nScorigamis: (n: number) => P(n, "scorigami", "scorigamis"),

    // Página de placar
    scoreTitle: (s: string, lg: LeagueRef) => `Já houve ${s} ${L.in(lg)}?`,
    scoreDescYes: (s: string, n: number, lg: LeagueRef, date: string) => `Sim: o placar ${s} aconteceu ${P(n, "vez", "vezes")} ${L.in(lg, lg.name)}, a última em ${date}.`,
    scoreDescNo: (s: string, lg: LeagueRef) => `Nunca: o placar ${s} ainda não aconteceu ${L.in(lg, lg.name)}.`,
    answerYes: (times: string) => `Sim, ${times}.`,
    answerNo: "Nunca.",
    onlyTime: (g: string) => `A única vez: ${g}.`,
    firstTime: (g: string) => `A primeira vez: ${g}.`,
    lastTime: (g: string, y: number) => `A última vez: ${g}${y >= 1 ? `, há ${P(y, "ano", "anos")}` : ""}.`,
    homeAway: (h: number, a: number) => `Vitórias do mandante: ${N(h)}. Vitórias do visitante: ${N(a)}.`,
    wouldBe: (s: string, lg: LeagueRef, odds: number) =>
      `Seria uma scorigami. Pela média de gols ${L.of(lg)}, a chance de um jogo terminar ${s} é de cerca de 1 em ${N(odds)}.`,
    nearby: "Placares próximos",
    allGames: "Todos os jogos",
    mostRecent: (n: number) => `(os ${n} mais recentes)`,

    // Página de time
    allTeams: "← Todos os times",
    today: "hoje",
    clubIntro: (games: number, lg: LeagueRef, since: string, sc: number) =>
      `${P(games, "partida", "partidas")} ${L.of(lg)} desde ${since} e ${P(sc, "scorigami", "scorigamis")}, placares finais que ${L.the(lg)} nunca tinha visto.`,
    stGames: "Jogos",
    stWins: "Vitórias",
    stDraws: "Empates",
    stLosses: "Derrotas",
    winPct: (pct: string, n: number) => `${pct}% de vitórias · ${P(n, "placar final diferente", "placares finais diferentes")}`,
    namesOverTime: "Nomes ao longo do tempo",
    nGames: (n: number) => P(n, "jogo", "jogos"),
    ringedClub: "Contornadas em vermelho: scorigamis em jogos deste clube.",
    rarest: "Finais mais raros",
    rarestText: (lg: LeagueRef, only: number) =>
      `Placares deste clube que ${L.the(lg)} menos viu. ${only > 0 ? `${P(only, "deles só aconteceu", "deles só aconteceram")} em jogos deste clube.` : ""}`,
    rarestCaption: "Jogo mais recente do clube com cada placar",
    thScore: "Placar",
    thAll: (lg: LeagueRef) => `${lg.fem ? "Toda a" : "Todo o"} ${lg.short}`,
    commonest: "Finais mais comuns",
    commonestText: "Placares que este clube mais repetiu.",
    clubScorigamisText: (lg: LeagueRef) => `Jogos deste clube que terminaram com um placar inédito ${L.in(lg)}, do mais recente ao mais antigo.`,
    showAll: (n: number) => `Mostrar todas as ${n}`,
    noScorigamiYet: "Nenhuma scorigami ainda.",
    // V/E/D e "sobre/com/para": 3–1 sobre o Santos, 1–1 com o Santos, 1–3 para o Santos.
    res: { w: "V", d: "E", l: "D" },
    vs: { w: "sobre", d: "com", l: "para" },
    clubTitle: (club: string) => `Scorigamis do ${club}`,
    clubDesc: (club: string, lg: LeagueRef, games: number, sc: number) =>
      `${club} ${L.in(lg, lg.name)}: ${P(games, "jogo", "jogos")} e ${P(sc, "scorigami", "scorigamis")}.`,
    teamNotFound: "Time não encontrado.",
    teamWord: "Time",

    // Página de temporada
    allSeasons: "← Todas as temporadas",
    noneScorigami: "Nenhuma scorigami",
    seasonRank: (rank: number, total: number, games: number) => `${rank}ª de ${total} temporadas em placares novos · ${N(games)} jogos`,
    seasonGridNote: (s: string) => `O gráfico mostra todos os jogos até o fim de ${s}. Contornadas: as scorigamis da temporada.`,
    seasonTitle: (lg: LeagueRef, s: string) => `Scorigamis ${L.of(lg)} ${s}`,
    seasonDesc: (n: number, lg: LeagueRef, s: string) =>
      `${P(n, "scorigami", "scorigamis")} ${L.in(lg, lg.name)} ${s}: os placares que aconteceram pela primeira vez.`,

    // Layout
    nav: { grafico: "Gráfico", scorigamis: "Scorigamis", times: "Times", timelapse: "Time-lapse", sobre: "Sobre" },
    themeLabel: "Alternar modo escuro",
    themeTitle: "Modo escuro",
    langLabel: "Idioma",
    competition: "Competição",
    general: "Geral",
    footerX: "Novas scorigamis no X:",
    footerAbout: "Sobre, regras e fontes dos dados",
    footerReport: "Solicitar ajuste",
    loading: "Carregando",

    // Home
    homeDesc: "Todos os placares finais da história do Brasileirão, das principais ligas europeias e de outras ligas das Américas em um gráfico: quais já aconteceram, quantas vezes e quais nunca aconteceram.",
    filtersLabel: "Filtros do gráfico",
    fCompetitions: "Competições",
    fTeams: "Times",
    fEras: "Eras",
    fChart: "Gráfico",
    fChartLabel: "Tipo de gráfico",
    fColor: "Cor das casas",
    allGeneral: "Geral: todas",
    allTeamsSum: "Todos",
    allErasSum: "Todas",
    nSelected: (n: number) => `${n} selecionados`,
    clear: "Limpar",
    searchTeam: "Buscar time",
    modeNorm: "Maior × menor",
    modeMando: "Mandante × visitante",
    colorFreq: "Frequência",
    colorFirst: "Primeira vez",
    showing: (n: number, total: number) => `Exibindo <b>${N(n)}</b> / ${N(total)} jogos`,
    lastGame: (d: string) => `Último jogo: ${d}`,
    whatIs: "O que é Scorigami?",
    howToRead: "Como ler este gráfico?",
    recentTitle: (lg: LeagueRef | null, many: string[]) =>
      `Últimas scorigamis ${lg ? L.in(lg) : many.length ? `em ${join(many)}` : "em todas as competições"}`,
    allScorigamisLink: "Todas as scorigamis, recentes e por temporada →",
    highlights: "Destaques",
    topScores: "Placares mais frequentes",

    // Eras
    allEras: "Todas as eras",
    decade: (d: number) => `Anos ${d}`,
    phases: {
      "pontos-corridos": "Pontos corridos (2003–)",
      "1971-2002": "Mata-mata nacional (1971–2002)",
      "1959-1970": "Taça Brasil e Robertão (1959–1970)",
      profissional: "Profissionalismo (1931–)",
      amador: "Amadorismo (1891–1930)",
      "torneios-curtos": "Torneios curtos (1996/97–)",
      "temporadas-longas": "Temporadas longas (1943/44–1995/96)",
    } as Record<string, string>,

    // Scorigamis
    scorigamisAllTitle: "Scorigamis em todas as competições",
    scorigamisAllDesc: (n: number, leagues: number) => `Os ${n} placares que nunca tinham acontecido em nenhuma das ${leagues} ligas do Scorigami FC.`,
    scorigamisAllIntro: (leagues: number, n: number, year: number) =>
      `Aqui as ${leagues} ligas contam como uma só: cada placar aparece uma vez, no primeiro jogo em que aconteceu em qualquer uma delas. São ${n} ao todo. A mais recente foi em ${year}.`,
    perYear: "Por ano",
    perYearLabel: "Scorigamis por ano",
    allFromRecent: "Todas, da mais recente à primeira",
    leagueScorigamisTitle: (lg: LeagueRef) => `Scorigamis ${L.of(lg)}`,
    leagueScorigamisDesc: (n: number, lg: LeagueRef) => `Os ${n} placares inéditos da história ${L.of(lg, lg.name)}, do mais recente ao primeiro, temporada por temporada.`,
    mostRecentH: "Mais recentes",
    perSeason: "Por temporada",
    perSeasonLabel: "Scorigamis por temporada",
    perSeasonText: (top: string, topN: number, cur: string, curN: number, lg: LeagueRef, last: string) =>
      `Placares novos a cada temporada. As primeiras edições preencheram o gráfico depressa; ${top} teve mais, com ${topN}. A temporada atual, ${cur}, tem ${curN}. A última scorigami ${L.of(lg)} foi em ${last}.`,

    // Times
    teamsTitle: (lg: LeagueRef) => `Times ${L.of(lg)}`,
    teamsDesc: (n: number, lg: LeagueRef) => `Os ${n} clubes que já disputaram ${L.the(lg, lg.name)}, com as scorigamis de cada um.`,
    teamsLede: (n: number, lg: LeagueRef) => `As scorigamis de cada um dos ${n} clubes que já jogaram ${L.the(lg)}, com os anos da primeira e da última participação.`,
    teamsNow: (lg: LeagueRef, s: string) => `${lg.fem ? "Na" : "No"} ${lg.short} ${s}`,
    teamsBefore: "Já disputaram",
    nSeasons: (n: number) => `${n} ${n === 1 ? "temporada" : "temporadas"}`,
    formerly: "Antes:",

    // Time-lapse
    tlDesc: "Veja o gráfico de placares do Brasileirão, das principais ligas europeias e de outras ligas das Américas se preencher temporada a temporada.",
    tlH1: "Todos os placares, temporada a temporada",
    tlIntro: "Cada casa acende na primeira vez que aquele placar final acontece.",
    tlIntroLink: "Veja quantas vezes cada placar aconteceu.",
    tlAll: "Todas as competições",
    tlUnique: "placares únicos",
    tlPlay: "Reproduzir",
    tlPause: "Pausar",
    tlSeason: "Temporada",
    tlFirst: "Primeira vez",
    tlNew: "Novo na temporada",
    tlMilestones: "Marcos",
    tlTipFirst: (s: string, match: string) => `Primeira vez em ${s}: ${match}`,
    tlTipNot: "Ainda não tinha acontecido",
    msFirstGame: "O primeiro jogo",
    msFirstGameText: (match: string, date: string) => `${match} em ${date}.`,
    msRoutText: (lg: LeagueRef, date: string) => `A maior goleada da história ${L.of(lg)}, em ${date}.`,
    msLast: (s: string) => `A última scorigami: ${s}`,
    msLastText: (match: string, date: string) => `${match} em ${date}. Nenhum placar inédito desde então.`,

    // Sobre e ajuste
    aboutTitle: "Sobre",
    aboutDesc: "O que é scorigami, o que conta como placar final e de onde vêm os dados do Scorigami FC.",
    reportTitle: "Solicitar ajuste",
    reportDesc: "Achou um placar errado, um jogo faltando ou um nome trocado? Conte pra gente.",
    reportIntro: "Achou um placar errado, um jogo faltando, uma data trocada ou o nome de um time diferente? Conte o que viu. Cada pedido é conferido com as fontes antes de mudar qualquer coisa no site.",
    rWhat: "O que está errado",
    rTypes: {
      placar: "Placar errado",
      faltando: "Jogo faltando",
      sobrando: "Jogo que não deveria estar",
      data: "Data errada",
      time: "Nome ou dados de um time",
      site: "Problema no site",
      outro: "Outro",
    } as Record<string, string>,
    rLeague: "Competição",
    rLeagueAny: "Não sei / várias",
    rGame: "Jogo ou página",
    rOptional: "(opcional)",
    rGamePh: "Ex.: Santos 7–4 Bahia, 22/10/2003",
    rDesc: "Descrição",
    rDescPh: "O que aparece no site e o que deveria aparecer. Se tiver uma fonte, cole o link.",
    rContact: "Contato",
    rContactNote: "(opcional, se quiser resposta)",
    rContactPh: "E-mail ou @ no X",
    rSend: "Enviar",
    rSending: "Enviando…",
    rOk: "Recebido, obrigado. Vamos conferir com as fontes.",
    rNoWay: "Não deu para enviar daqui. Mande pelo X: @ScorigamiFC.",
    rFail: "Não deu para enviar agora. Tente de novo ou mande pelo X: @ScorigamiFC.",

    /** Observações dos jogos vêm em português nos dados. */
    note: (s: string) => s,
  };
}

export type Dict = ReturnType<typeof pt>;

function en(): Dict {
  const f = make("en");
  const { N, P, join } = f;
  const L = art.en;
  return {
    ...f,
    L,
    allShort: "all competitions",
    times: (n: number) => (n ? P(n, "time", "times") : "Never"),
    drew: (a, b) => `${a} and ${b} drew`,
    beat: (w, l) => `${w} beat ${l}`,
    tipFirst: (date, match, times) => `First time: ${date}, ${match} · ${times}`,
    tipLast: (times, date, match) => `${times} · last: ${date}, ${match}`,
    tipNever: "Never happened",
    axisNorm: ["Winner's score", "Loser's score"],
    axisMando: ["Home goals", "Away goals"],
    legendNever: "Never",
    legendRare: "Rare",
    legendCommon: "Common",
    legendFirst: "First time:",
    noScorigami: "No scorigami.",
    noGames: "No games in this selection.",
    hlUnseen: "Never happened",
    hlUnseenText: (list) => `${list}. These are the most likely unseen scores, based on the average number of goals.`,
    hlCommon: "Most common",
    hlCommonText: (score, n, pct) => `${score}, in ${P(n, "game", "games")} (${pct}% of all).`,
    hlRout: "Biggest win",
    hlRoutText: (match, date, league) => `${match}, on ${date}${league ? ` (${league})` : ""}.`,
    hlDrought: "Longest since it last happened",
    hlAgo: (y) => (y < 1 ? "less than a year" : `${P(y, "year", "years")} ago`),
    hlExclusive: "Most exclusive scores",
    hlExclusiveText: (club, n, list) => `${club}, with ${P(n, "score no other club has had", "scores no other club has had")}: ${list}.`,
    nScorigamis: (n) => P(n, "scorigami", "scorigamis"),

    scoreTitle: (s, lg) => `Has there ever been a ${s} ${L.in(lg)}?`,
    scoreDescYes: (s, n, lg, date) => `Yes: ${s} has happened ${P(n, "time", "times")} ${L.in(lg, lg.name)}, most recently on ${date}.`,
    scoreDescNo: (s, lg) => `Never: ${s} has not happened ${L.in(lg, lg.name)} yet.`,
    answerYes: (times) => `Yes, ${times}.`,
    answerNo: "Never.",
    onlyTime: (g) => `The only time: ${g}.`,
    firstTime: (g) => `The first time: ${g}.`,
    lastTime: (g, y) => `The last time: ${g}${y >= 1 ? `, ${P(y, "year", "years")} ago` : ""}.`,
    homeAway: (h, a) => `Home wins: ${N(h)}. Away wins: ${N(a)}.`,
    wouldBe: (s, lg, odds) =>
      `It would be a scorigami. Based on the average number of goals ${L.in(lg)}, the chance of a game ending ${s} is about 1 in ${N(odds)}.`,
    nearby: "Nearby scores",
    allGames: "All games",
    mostRecent: (n) => `(the ${n} most recent)`,

    allTeams: "← All teams",
    today: "today",
    clubIntro: (games, lg, since, sc) =>
      `${P(games, "game", "games")} ${L.in(lg)} since ${since} and ${P(sc, "scorigami", "scorigamis")}, final scores ${L.the(lg)} had never seen before.`,
    stGames: "Games",
    stWins: "Wins",
    stDraws: "Draws",
    stLosses: "Losses",
    winPct: (pct, n) => `${pct}% wins · ${P(n, "different final score", "different final scores")}`,
    namesOverTime: "Names over time",
    nGames: (n) => P(n, "game", "games"),
    ringedClub: "Circled in red: scorigamis in this club's games.",
    rarest: "Rarest finals",
    rarestText: (lg, only) =>
      `This club's scores that ${L.the(lg)} has seen least. ${only > 0 ? `${P(only, "of them has only happened", "of them have only happened")} in this club's games.` : ""}`,
    rarestCaption: "The club's most recent game with each score",
    thScore: "Score",
    thAll: (lg) => `All of ${L.the(lg)}`,
    commonest: "Most common finals",
    commonestText: "The scores this club has repeated most.",
    clubScorigamisText: (lg) => `This club's games that ended with a score never seen before ${L.in(lg)}, newest first.`,
    showAll: (n) => `Show all ${n}`,
    noScorigamiYet: "No scorigami yet.",
    res: { w: "W", d: "D", l: "L" },
    vs: { w: "vs", d: "vs", l: "vs" },
    clubTitle: (club) => `${club} scorigamis`,
    clubDesc: (club, lg, games, sc) => `${club} ${L.in(lg, lg.name)}: ${P(games, "game", "games")} and ${P(sc, "scorigami", "scorigamis")}.`,
    teamNotFound: "Team not found.",
    teamWord: "Team",

    allSeasons: "← All seasons",
    noneScorigami: "No scorigami",
    seasonRank: (rank, total, games) => `#${rank} of ${total} seasons for new scores · ${N(games)} games`,
    seasonGridNote: (s) => `The chart shows every game up to the end of ${s}. Circled: the season's scorigamis.`,
    seasonTitle: (lg, s) => `${lg.short} ${s} scorigamis`,
    seasonDesc: (n, lg, s) => `${P(n, "scorigami", "scorigamis")} ${L.in(lg, lg.name)} ${s}: the scores that happened for the first time.`,

    nav: { grafico: "Chart", scorigamis: "Scorigamis", times: "Teams", timelapse: "Time-lapse", sobre: "About" },
    themeLabel: "Toggle dark mode",
    themeTitle: "Dark mode",
    langLabel: "Language",
    competition: "Competition",
    general: "All",
    footerX: "New scorigamis on X:",
    footerAbout: "About, rules and data sources",
    footerReport: "Report an error",
    loading: "Loading",

    homeDesc: "Every final score in the history of the Brasileirão, the top European leagues and other leagues in the Americas in one chart: which have happened, how often, and which never have.",
    filtersLabel: "Chart filters",
    fCompetitions: "Competitions",
    fTeams: "Teams",
    fEras: "Eras",
    fChart: "Chart",
    fChartLabel: "Chart type",
    fColor: "Square color",
    allGeneral: "All competitions",
    allTeamsSum: "All",
    allErasSum: "All",
    nSelected: (n) => `${n} selected`,
    clear: "Clear",
    searchTeam: "Search team",
    modeNorm: "Winner × loser",
    modeMando: "Home × away",
    colorFreq: "Frequency",
    colorFirst: "First time",
    showing: (n, total) => `Showing <b>${N(n)}</b> / ${N(total)} games`,
    lastGame: (d) => `Last game: ${d}`,
    whatIs: "What is Scorigami?",
    howToRead: "How to read this chart",
    recentTitle: (lg, many) => `Latest scorigamis ${lg ? L.in(lg) : many.length ? `in ${join(many)}` : "in all competitions"}`,
    allScorigamisLink: "All scorigamis, recent and by season →",
    highlights: "Highlights",
    topScores: "Most frequent scores",

    allEras: "All eras",
    decade: (d) => `${d}s`,
    phases: {
      "pontos-corridos": "League format (2003–)",
      "1971-2002": "National knockout era (1971–2002)",
      "1959-1970": "Taça Brasil and Robertão (1959–1970)",
      profissional: "Professional era (1931–)",
      amador: "Amateur era (1891–1930)",
      "torneios-curtos": "Short tournaments (1996/97–)",
      "temporadas-longas": "Full seasons (1943/44–1995/96)",
    },

    scorigamisAllTitle: "Scorigamis across all competitions",
    scorigamisAllDesc: (n, leagues) => `The ${n} scores that had never happened in any of the ${leagues} leagues on Scorigami FC.`,
    scorigamisAllIntro: (leagues, n, year) =>
      `Here the ${leagues} leagues count as one: each score appears once, in the first game where it happened in any of them. There are ${n} in all. The most recent was in ${year}.`,
    perYear: "By year",
    perYearLabel: "Scorigamis by year",
    allFromRecent: "All of them, newest first",
    leagueScorigamisTitle: (lg) => `${lg.short} scorigamis`,
    leagueScorigamisDesc: (n, lg) => `The ${n} never-before-seen scores in the history ${L.of(lg, lg.name)}, newest first, season by season.`,
    mostRecentH: "Most recent",
    perSeason: "By season",
    perSeasonLabel: "Scorigamis by season",
    perSeasonText: (top, topN, cur, curN, lg, last) =>
      `New scores each season. The early seasons filled the chart quickly; ${top} had the most, with ${topN}. The current season, ${cur}, has ${curN}. The last ${lg.short} scorigami was in ${last}.`,

    teamsTitle: (lg) => `${lg.short} teams`,
    teamsDesc: (n, lg) => `The ${n} clubs that have played ${L.in(lg, lg.name)}, with each one's scorigamis.`,
    teamsLede: (n, lg) => `The scorigamis of each of the ${n} clubs that have played ${L.in(lg)}, with their first and last seasons.`,
    teamsNow: (lg, s) => `${lg.short} ${s}`,
    teamsBefore: "Former teams",
    nSeasons: (n) => `${n} ${n === 1 ? "season" : "seasons"}`,
    formerly: "Formerly:",

    tlDesc: "Watch the score chart of the Brasileirão, the top European leagues and other leagues in the Americas fill up season by season.",
    tlH1: "Every score, season by season",
    tlIntro: "Each square lights up the first time that final score happens.",
    tlIntroLink: "See how many times each score has happened.",
    tlAll: "All competitions",
    tlUnique: "unique scores",
    tlPlay: "Play",
    tlPause: "Pause",
    tlSeason: "Season",
    tlFirst: "First time",
    tlNew: "New this season",
    tlMilestones: "Milestones",
    tlTipFirst: (s, match) => `First time in ${s}: ${match}`,
    tlTipNot: "Hadn't happened yet",
    msFirstGame: "The first game",
    msFirstGameText: (match, date) => `${match} on ${date}.`,
    msRoutText: (lg, date) => `The biggest win in the history ${L.of(lg)}, on ${date}.`,
    msLast: (s) => `The last scorigami: ${s}`,
    msLastText: (match, date) => `${match} on ${date}. No new score since.`,

    aboutTitle: "About",
    aboutDesc: "What a scorigami is, what counts as a final score, and where Scorigami FC's data comes from.",
    reportTitle: "Report an error",
    reportDesc: "Found a wrong score, a missing game or a wrong name? Let us know.",
    reportIntro: "Found a wrong score, a missing game, a wrong date or a team with the wrong name? Tell us what you saw. Every report is checked against the sources before anything on the site changes.",
    rWhat: "What's wrong",
    rTypes: {
      placar: "Wrong score",
      faltando: "Missing game",
      sobrando: "Game that shouldn't be here",
      data: "Wrong date",
      time: "Team name or details",
      site: "Problem with the site",
      outro: "Other",
    },
    rLeague: "Competition",
    rLeagueAny: "Not sure / several",
    rGame: "Game or page",
    rOptional: "(optional)",
    rGamePh: "E.g. Santos 7–4 Bahia, 10/22/2003",
    rDesc: "Description",
    rDescPh: "What the site shows and what it should show. If you have a source, paste the link.",
    rContact: "Contact",
    rContactNote: "(optional, if you'd like a reply)",
    rContactPh: "Email or @ on X",
    rSend: "Send",
    rSending: "Sending…",
    rOk: "Received, thank you. We'll check it against the sources.",
    rNoWay: "Couldn't send from here. Reach us on X: @ScorigamiFC.",
    rFail: "Couldn't send right now. Try again or reach us on X: @ScorigamiFC.",
    note: (s) =>
      s
        .replace(/^pênaltis /, "penalties ")
        .replace(/; pênaltis /, "; penalties ")
        .replace("data aproximada (rodada em mais de um dia)", "approximate date (matchday spread over several days)")
        .replace("data incerta (engsoccerdata, sem outra fonte)", "uncertain date (engsoccerdata, no other source)")
        .replace(/^data suspeita.*/, "doubtful date"),
  };
}

function es(): Dict {
  const f = make("es");
  const { N, P, join } = f;
  const L = art.es;
  return {
    ...f,
    L,
    allShort: "todas las competiciones",
    times: (n: number) => (n ? P(n, "vez", "veces") : "Nunca"),
    drew: (a, b) => `${a} y ${b} empataron`,
    beat: (w, l) => `${w} venció a ${l}`,
    tipFirst: (date, match, times) => `Primera vez: ${date}, ${match} · ${times}`,
    tipLast: (times, date, match) => `${times} · última: ${date}, ${match}`,
    tipNever: "Nunca ocurrió",
    axisNorm: ["Goles del ganador", "Goles del perdedor"],
    axisMando: ["Goles del local", "Goles del visitante"],
    legendNever: "Nunca",
    legendRare: "Raro",
    legendCommon: "Común",
    legendFirst: "Primera vez:",
    noScorigami: "Ninguna scorigami.",
    noGames: "Ningún partido en esta selección.",
    hlUnseen: "Nunca ocurrieron",
    hlUnseenText: (list) => `${list}. Son los marcadores inéditos más probables según el promedio de goles.`,
    hlCommon: "Más común",
    hlCommonText: (score, n, pct) => `${score}, en ${P(n, "partido", "partidos")} (${pct}% del total).`,
    hlRout: "Mayor goleada",
    hlRoutText: (match, date, league) => `${match}, el ${date}${league ? ` (${league})` : ""}.`,
    hlDrought: "Más tiempo sin repetirse",
    hlAgo: (y) => (y < 1 ? "menos de 1 año" : `hace ${P(y, "año", "años")}`),
    hlExclusive: "Más marcadores exclusivos",
    hlExclusiveText: (club, n, list) => `${club}, con ${P(n, "marcador que solo tuvo él", "marcadores que solo tuvo él")}: ${list}.`,
    nScorigamis: (n) => P(n, "scorigami", "scorigamis"),

    scoreTitle: (s, lg) => `¿Hubo alguna vez un ${s} ${L.in(lg)}?`,
    scoreDescYes: (s, n, lg, date) => `Sí: el ${s} ocurrió ${P(n, "vez", "veces")} ${L.in(lg, lg.name)}, la última el ${date}.`,
    scoreDescNo: (s, lg) => `Nunca: el ${s} todavía no ocurrió ${L.in(lg, lg.name)}.`,
    answerYes: (times) => `Sí, ${times}.`,
    answerNo: "Nunca.",
    onlyTime: (g) => `La única vez: ${g}.`,
    firstTime: (g) => `La primera vez: ${g}.`,
    lastTime: (g, y) => `La última vez: ${g}${y >= 1 ? `, hace ${P(y, "año", "años")}` : ""}.`,
    homeAway: (h, a) => `Victorias del local: ${N(h)}. Victorias del visitante: ${N(a)}.`,
    wouldBe: (s, lg, odds) =>
      `Sería una scorigami. Según el promedio de goles ${L.of(lg)}, la probabilidad de que un partido termine ${s} es de alrededor de 1 en ${N(odds)}.`,
    nearby: "Marcadores cercanos",
    allGames: "Todos los partidos",
    mostRecent: (n) => `(los ${n} más recientes)`,

    allTeams: "← Todos los equipos",
    today: "hoy",
    clubIntro: (games, lg, since, sc) =>
      `${P(games, "partido", "partidos")} ${L.in(lg)} desde ${since} y ${P(sc, "scorigami", "scorigamis")}, marcadores finales que ${L.the(lg)} nunca había visto.`,
    stGames: "Partidos",
    stWins: "Victorias",
    stDraws: "Empates",
    stLosses: "Derrotas",
    winPct: (pct, n) => `${pct}% de victorias · ${P(n, "marcador final distinto", "marcadores finales distintos")}`,
    namesOverTime: "Nombres a lo largo del tiempo",
    nGames: (n) => P(n, "partido", "partidos"),
    ringedClub: "Marcadas en rojo: scorigamis en partidos de este club.",
    rarest: "Resultados más raros",
    rarestText: (lg, only) =>
      `Marcadores de este club que ${L.the(lg)} menos vio. ${only > 0 ? `${P(only, "de ellos solo ocurrió", "de ellos solo ocurrieron")} en partidos de este club.` : ""}`,
    rarestCaption: "Partido más reciente del club con cada marcador",
    thScore: "Marcador",
    thAll: (lg) => `${lg.fem ? "Toda la" : "Todo el"} ${lg.short}`,
    commonest: "Resultados más comunes",
    commonestText: "Los marcadores que este club más repitió.",
    clubScorigamisText: (lg) => `Partidos de este club que terminaron con un marcador inédito ${L.in(lg)}, del más reciente al más antiguo.`,
    showAll: (n) => `Mostrar las ${n}`,
    noScorigamiYet: "Todavía ninguna scorigami.",
    res: { w: "G", d: "E", l: "P" },
    vs: { w: "ante", d: "con", l: "ante" },
    clubTitle: (club) => `Scorigamis del ${club}`,
    clubDesc: (club, lg, games, sc) => `${club} ${L.in(lg, lg.name)}: ${P(games, "partido", "partidos")} y ${P(sc, "scorigami", "scorigamis")}.`,
    teamNotFound: "Equipo no encontrado.",
    teamWord: "Equipo",

    allSeasons: "← Todas las temporadas",
    noneScorigami: "Ninguna scorigami",
    seasonRank: (rank, total, games) => `${rank}.ª de ${total} temporadas en marcadores nuevos · ${N(games)} partidos`,
    seasonGridNote: (s) => `El gráfico muestra todos los partidos hasta el final de ${s}. Marcadas: las scorigamis de la temporada.`,
    seasonTitle: (lg, s) => `Scorigamis ${L.of(lg)} ${s}`,
    seasonDesc: (n, lg, s) => `${P(n, "scorigami", "scorigamis")} ${L.in(lg, lg.name)} ${s}: los marcadores que ocurrieron por primera vez.`,

    nav: { grafico: "Gráfico", scorigamis: "Scorigamis", times: "Equipos", timelapse: "Time-lapse", sobre: "Acerca de" },
    themeLabel: "Cambiar modo oscuro",
    themeTitle: "Modo oscuro",
    langLabel: "Idioma",
    competition: "Competición",
    general: "General",
    footerX: "Nuevas scorigamis en X:",
    footerAbout: "Acerca de, reglas y fuentes de datos",
    footerReport: "Reportar un error",
    loading: "Cargando",

    homeDesc: "Todos los marcadores finales de la historia del Brasileirão, de las principales ligas europeas y de otras ligas de América en un gráfico: cuáles ya ocurrieron, cuántas veces y cuáles nunca.",
    filtersLabel: "Filtros del gráfico",
    fCompetitions: "Competiciones",
    fTeams: "Equipos",
    fEras: "Épocas",
    fChart: "Gráfico",
    fChartLabel: "Tipo de gráfico",
    fColor: "Color de las casillas",
    allGeneral: "General: todas",
    allTeamsSum: "Todos",
    allErasSum: "Todas",
    nSelected: (n) => `${n} seleccionados`,
    clear: "Limpiar",
    searchTeam: "Buscar equipo",
    modeNorm: "Ganador × perdedor",
    modeMando: "Local × visitante",
    colorFreq: "Frecuencia",
    colorFirst: "Primera vez",
    showing: (n, total) => `Mostrando <b>${N(n)}</b> / ${N(total)} partidos`,
    lastGame: (d) => `Último partido: ${d}`,
    whatIs: "¿Qué es Scorigami?",
    howToRead: "¿Cómo leer este gráfico?",
    recentTitle: (lg, many) => `Últimas scorigamis ${lg ? L.in(lg) : many.length ? `en ${join(many)}` : "en todas las competiciones"}`,
    allScorigamisLink: "Todas las scorigamis, recientes y por temporada →",
    highlights: "Destacados",
    topScores: "Marcadores más frecuentes",

    allEras: "Todas las épocas",
    decade: (d) => `Años ${d}`,
    phases: {
      "pontos-corridos": "Liga regular (2003–)",
      "1971-2002": "Eliminatorias nacionales (1971–2002)",
      "1959-1970": "Taça Brasil y Robertão (1959–1970)",
      profissional: "Profesionalismo (1931–)",
      amador: "Amateurismo (1891–1930)",
      "torneios-curtos": "Torneos cortos (1996/97–)",
      "temporadas-longas": "Temporadas largas (1943/44–1995/96)",
    },

    scorigamisAllTitle: "Scorigamis en todas las competiciones",
    scorigamisAllDesc: (n, leagues) => `Los ${n} marcadores que nunca habían ocurrido en ninguna de las ${leagues} ligas de Scorigami FC.`,
    scorigamisAllIntro: (leagues, n, year) =>
      `Aquí las ${leagues} ligas cuentan como una sola: cada marcador aparece una vez, en el primer partido en que ocurrió en cualquiera de ellas. Son ${n} en total. La más reciente fue en ${year}.`,
    perYear: "Por año",
    perYearLabel: "Scorigamis por año",
    allFromRecent: "Todas, de la más reciente a la primera",
    leagueScorigamisTitle: (lg) => `Scorigamis ${L.of(lg)}`,
    leagueScorigamisDesc: (n, lg) => `Los ${n} marcadores inéditos de la historia ${L.of(lg, lg.name)}, del más reciente al primero, temporada por temporada.`,
    mostRecentH: "Más recientes",
    perSeason: "Por temporada",
    perSeasonLabel: "Scorigamis por temporada",
    perSeasonText: (top, topN, cur, curN, lg, last) =>
      `Marcadores nuevos en cada temporada. Las primeras ediciones llenaron el gráfico rápido; ${top} tuvo más, con ${topN}. La temporada actual, ${cur}, tiene ${curN}. La última scorigami ${L.of(lg)} fue en ${last}.`,

    teamsTitle: (lg) => `Equipos ${L.of(lg)}`,
    teamsDesc: (n, lg) => `Los ${n} clubes que ya jugaron ${L.the(lg, lg.name)}, con las scorigamis de cada uno.`,
    teamsLede: (n, lg) => `Las scorigamis de cada uno de los ${n} clubes que ya jugaron ${L.the(lg)}, con los años de la primera y la última participación.`,
    teamsNow: (lg, s) => `${lg.fem ? "En la" : "En el"} ${lg.short} ${s}`,
    teamsBefore: "Ya jugaron",
    nSeasons: (n) => `${n} ${n === 1 ? "temporada" : "temporadas"}`,
    formerly: "Antes:",

    tlDesc: "Mira cómo el gráfico de marcadores del Brasileirão, de las principales ligas europeas y de otras ligas de América se llena temporada a temporada.",
    tlH1: "Todos los marcadores, temporada a temporada",
    tlIntro: "Cada casilla se enciende la primera vez que ocurre ese marcador final.",
    tlIntroLink: "Mira cuántas veces ocurrió cada marcador.",
    tlAll: "Todas las competiciones",
    tlUnique: "marcadores únicos",
    tlPlay: "Reproducir",
    tlPause: "Pausar",
    tlSeason: "Temporada",
    tlFirst: "Primera vez",
    tlNew: "Nuevo en la temporada",
    tlMilestones: "Hitos",
    tlTipFirst: (s, match) => `Primera vez en ${s}: ${match}`,
    tlTipNot: "Todavía no había ocurrido",
    msFirstGame: "El primer partido",
    msFirstGameText: (match, date) => `${match} el ${date}.`,
    msRoutText: (lg, date) => `La mayor goleada de la historia ${L.of(lg)}, el ${date}.`,
    msLast: (s) => `La última scorigami: ${s}`,
    msLastText: (match, date) => `${match} el ${date}. Ningún marcador inédito desde entonces.`,

    aboutTitle: "Acerca de",
    aboutDesc: "Qué es una scorigami, qué cuenta como marcador final y de dónde vienen los datos de Scorigami FC.",
    reportTitle: "Reportar un error",
    reportDesc: "¿Encontraste un marcador equivocado, un partido que falta o un nombre cambiado? Cuéntanos.",
    reportIntro: "¿Encontraste un marcador equivocado, un partido que falta, una fecha cambiada o un equipo con otro nombre? Cuéntanos lo que viste. Cada reporte se revisa con las fuentes antes de cambiar algo en el sitio.",
    rWhat: "Qué está mal",
    rTypes: {
      placar: "Marcador equivocado",
      faltando: "Falta un partido",
      sobrando: "Partido que no debería estar",
      data: "Fecha equivocada",
      time: "Nombre o datos de un equipo",
      site: "Problema en el sitio",
      outro: "Otro",
    },
    rLeague: "Competición",
    rLeagueAny: "No sé / varias",
    rGame: "Partido o página",
    rOptional: "(opcional)",
    rGamePh: "Ej.: Santos 7–4 Bahia, 22/10/2003",
    rDesc: "Descripción",
    rDescPh: "Lo que aparece en el sitio y lo que debería aparecer. Si tienes una fuente, pega el enlace.",
    rContact: "Contacto",
    rContactNote: "(opcional, si quieres respuesta)",
    rContactPh: "Correo o @ en X",
    rSend: "Enviar",
    rSending: "Enviando…",
    rOk: "Recibido, gracias. Lo revisaremos con las fuentes.",
    rNoWay: "No se pudo enviar desde aquí. Escríbenos en X: @ScorigamiFC.",
    rFail: "No se pudo enviar ahora. Inténtalo de nuevo o escríbenos en X: @ScorigamiFC.",
    note: (s) =>
      s
        .replace(/^pênaltis /, "penales ")
        .replace(/; pênaltis /, "; penales ")
        .replace("data aproximada (rodada em mais de um dia)", "fecha aproximada (jornada en más de un día)")
        .replace("data incerta (engsoccerdata, sem outra fonte)", "fecha incierta (engsoccerdata, sin otra fuente)")
        .replace(/^data suspeita.*/, "fecha dudosa"),
  };
}

const DICTS: Record<Lang, Dict> = { pt: pt(), en: en(), es: es() };
export const t = (lang: Lang): Dict => DICTS[lang];
