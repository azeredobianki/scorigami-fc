// Conteúdo das páginas de placar, time e temporada. Usado no build e, na
// prévia (que tem limite de arquivos), no navegador.
import {
  buildCells,
  exclusiveScores,
  forClub,
  g,
  gridSize,
  hi,
  lo,
  scoreKey,
  scorigamis,
  unseenPlausible,
  yearsSince,
  type Match,
} from "./core";
import { href, scorePageHref, seasonHref } from "./links";
import { clubLink, esc, fmtInt, fmtLong, gridHtml, legendHtml, matchLine, plural, resultLine, scorigamiListHtml, times, type Ctx } from "./render";

export interface LeagueInfo {
  slug: string;
  name: string;
  short: string;
  fem?: boolean;
  split?: boolean;
}

export interface Page {
  title: string;
  description: string;
  html: string;
}

const seasonsOf = (ms: Match[]) => [...new Set(ms.map((m) => m.season))].sort((a, b) => a - b);

/** Placares com página em cada liga: até o maior placar visto, no mínimo 10. */
export function scoreKeys(all: Match[]): string[] {
  const n = Math.max(gridSize(all), 10);
  const keys: string[] = [];
  for (let a = 0; a <= n; a++) for (let b = 0; b <= a; b++) keys.push(`${a}-${b}`);
  return keys;
}

// --- Placar -------------------------------------------------------------------

export function scorePage(ctx: Ctx, lg: LeagueInfo, all: Match[], key: string): Page {
  const liga = lg.slug;
  const [a, b] = key.split("-").map(Number);
  const cells = buildCells(all, "norm");
  const games = all.filter((m) => scoreKey(m) === key).reverse();
  const count = games.length;
  const first = games[games.length - 1];
  const last = games[0];
  const years = last ? yearsSince(last.date, ctx.today) : 0;
  const homeWins = games.filter((m) => m.hg > m.ag).length;
  const awayWins = games.filter((m) => m.ag > m.hg).length;
  const unseen = count ? undefined : unseenPlausible(all, cells, 40).find((u) => u.a === a && u.b === b);
  const LIMIT = 100;

  // Placares vizinhos: a grade 3×3 em volta, com o próprio placar no meio.
  const nearby: { a: number; b: number; count: number }[] = [];
  for (let da = 1; da >= -1; da--)
    for (let db = -1; db <= 1; db++) {
      const na = a + da;
      const nb = b + db;
      if (na >= 0 && nb >= 0 && nb <= na) nearby.push({ a: na, b: nb, count: cells.get(`${na}-${nb}`)?.count ?? 0 });
    }

  const no = g(lg, "no", "na");
  const title = `Já houve ${a}–${b} ${no} ${lg.short}?`;
  const description = count
    ? `Sim: o placar ${a}–${b} aconteceu ${plural(count, "vez", "vezes")} ${no} ${lg.name}, a última em ${fmtLong(last.date)}.`
    : `Nunca: o placar ${a}–${b} ainda não aconteceu ${no} ${lg.name}.`;
  const gameLine = (m: Match) =>
    `<a href="${seasonHref(liga, m.season)}">${fmtLong(m.date)}</a>, ${resultLine(ctx, m)} (${matchLine(ctx, m, false)})`;

  let html = `<h1>${esc(title)}</h1><p class="answer">${count ? `Sim, ${times(count)}.` : "Nunca."}</p>`;
  if (count === 1) html += `<p>A única vez: ${gameLine(first)}.</p>`;
  if (count > 1) {
    html += `<p>A primeira vez: ${gameLine(first)}.</p>`;
    html += `<p>A última vez: ${gameLine(last)}${years >= 1 ? `, há ${plural(years, "ano", "anos")}` : ""}.</p>`;
    if (a !== b) html += `<p class="muted">Vitórias do mandante: ${fmtInt(homeWins)}. Vitórias do visitante: ${fmtInt(awayWins)}.</p>`;
  }
  if (unseen) {
    html += `<p>Seria uma scorigami. Pela média de gols ${g(lg, "do", "da")} ${esc(lg.short)}, a chance de um jogo terminar ${a}–${b} é de cerca de 1 em ${fmtInt(Math.round(1 / unseen.probability))}.</p>`;
  }
  html += `<div style="margin-top:1.5rem">${gridHtml(ctx, all, { mode: "norm", ring: new Set([key]) })}${legendHtml()}</div>`;
  html += `<h2>Placares próximos</h2><ol class="list">${nearby
    .map((n) =>
      n.a === a && n.b === b
        ? `<li><span class="score">${n.a}–${n.b}</span> ${times(n.count)}</li>`
        : `<li><a class="score" href="${scorePageHref(liga, `${n.a}-${n.b}`)}">${n.a}–${n.b}</a> ${times(n.count)}</li>`,
    )
    .join("")}</ol>`;
  if (count > 1) {
    html += `<h2>Todos os jogos${count > LIMIT ? ` <span class="muted">(os ${LIMIT} mais recentes)</span>` : ""}</h2><ol class="list">${games
      .slice(0, LIMIT)
      .map((m) => `<li><span class="date">${fmtLong(m.date)}</span> ${matchLine(ctx, m)}${m.note ? `<span class="muted"> · ${esc(m.note)}</span>` : ""}</li>`)
      .join("")}</ol>`;
  }
  return { title, description, html };
}

// --- Time ---------------------------------------------------------------------

export function clubPage(ctx: Ctx, lg: LeagueInfo, all: Match[], slug: string): Page {
  const liga = lg.slug;
  const S = (s: number) => ctx.season(liga, s);
  const name = esc(ctx.clubName(slug));
  const mine = all.filter((m) => m.home === slug || m.away === slug);
  const leagueCells = buildCells(all);
  const myCells = buildCells(mine);
  const seasons = seasonsOf(mine);
  const current = all.reduce((x, m) => Math.max(x, m.season), 0);
  const span = `${S(seasons[0])}–${seasons[seasons.length - 1] === current ? "hoje" : S(seasons[seasons.length - 1])}`;

  let w = 0, d = 0, l = 0;
  for (const m of mine) {
    const r = forClub(m, slug);
    if (r.gf > r.ga) w++;
    else if (r.gf === r.ga) d++;
    else l++;
  }
  const pct = ((w / mine.length) * 100).toFixed(1).replace(".", ",");
  const myScorigamis = scorigamis(all).filter((m) => m.home === slug || m.away === slug).reverse();
  const exclusive = new Set((exclusiveScores(all, leagueCells).find((e) => e.club === slug)?.scores ?? []).map((x) => x.key));

  // Nomes usados ao longo do tempo, com anos e jogos.
  const nameEras = new Map<string, { from: number; to: number; games: number }>();
  for (const m of mine) {
    const n = ctx.clubName(slug, m.season);
    const e = nameEras.get(n) ?? { from: m.season, to: m.season, games: 0 };
    e.from = Math.min(e.from, m.season);
    e.to = Math.max(e.to, m.season);
    e.games++;
    nameEras.set(n, e);
  }

  // O jogo mais recente do clube com cada placar.
  const latestBy = new Map<string, Match>();
  for (const m of mine) latestBy.set(`${hi(m)}-${lo(m)}`, m);
  const rows = [...myCells.values()].map((cell) => ({ cell, league: leagueCells.get(cell.key)!.count, m: latestBy.get(cell.key)! }));
  const rarest = [...rows].sort((a, b) => a.league - b.league || b.m.date.localeCompare(a.m.date)).slice(0, 10);
  const common = [...rows].sort((a, b) => b.cell.count - a.cell.count).slice(0, 10);
  const onlyHere = rows.filter((r) => exclusive.has(r.cell.key)).length;

  const outcome = (m: Match) => {
    const r = forClub(m, slug);
    const res = r.gf > r.ga ? "V" : r.gf < r.ga ? "D" : "E";
    const verb = r.gf > r.ga ? "sobre" : r.gf < r.ga ? "para" : "com";
    return { res, verb, r };
  };
  const scorigamiItem = (m: Match) => {
    const { res, verb, r } = outcome(m);
    return `<li><span class="date">${fmtLong(m.date)}</span> <span class="muted">${res}</span> <a class="score" href="${scorePageHref(liga, `${hi(m)}-${lo(m)}`)}">${r.gf}–${r.ga}</a> ${verb} ${clubLink(ctx, r.opp, m.season)}</li>`;
  };
  const scoreLink = (key: string, a: number, b: number) => `<a class="score" href="${scorePageHref(liga, key)}">${a}–${b}</a>`;
  const SHOW = 25;
  const o = g(lg, "o", "a");
  const all_ = g(lg, "Todo o", "Toda a");

  let html = `<a class="back" href="${href(`${liga}/times`)}">← Todos os times</a><h1>${name}</h1><p class="muted">${span}</p>`;
  html += `<p>${plural(mine.length, "partida", "partidas")} ${g(lg, "do", "da")} ${esc(lg.short)} desde ${S(seasons[0])} e ${plural(myScorigamis.length, "scorigami", "scorigamis")}, placares finais que ${o} ${esc(lg.short)} nunca tinha visto.</p>`;
  html += `<div class="stats"><div><b>${fmtInt(mine.length)}</b><span>Jogos</span></div><div><b>${fmtInt(w)}</b><span>Vitórias</span></div><div><b>${fmtInt(d)}</b><span>Empates</span></div><div><b>${fmtInt(l)}</b><span>Derrotas</span></div><div><b>${myScorigamis.length}</b><span>Scorigamis</span></div></div>`;
  html += `<p class="muted">${pct}% de vitórias · ${plural(myCells.size, "placar final diferente", "placares finais diferentes")}</p>`;
  if (nameEras.size > 1) {
    html += `<h2>Nomes ao longo do tempo</h2><ol class="list">${[...nameEras.entries()]
      .map(([n, e]) => `<li>${esc(n)}, ${e.from === e.to ? S(e.from) : `${S(e.from)}–${S(e.to)}`}, ${plural(e.games, "jogo", "jogos")}</li>`)
      .join("")}</ol>`;
  }
  html += `<div style="margin-top:1.5rem">${gridHtml(ctx, all, { mode: "norm", size: gridSize(all), ring: new Set(myScorigamis.map((m) => `${hi(m)}-${lo(m)}`)) })}${legendHtml()}</div>`;
  html += `<p class="muted">Contornadas em vermelho: scorigamis em jogos deste clube.</p>`;
  html += `<h2>Finais mais raros</h2><p>Placares deste clube que ${o} ${esc(lg.short)} menos viu. ${
    onlyHere > 0 ? `${plural(onlyHere, "deles só aconteceu", "deles só aconteceram")} em jogos deste clube.` : ""
  }</p>`;
  html += `<div class="table-scroll"><table class="data"><caption>Jogo mais recente do clube com cada placar</caption><thead><tr><th>Placar</th><th>${name}</th><th class="n">${all_} ${esc(lg.short)}</th></tr></thead><tbody>${rarest
    .map((r) => {
      const { verb, r: x } = outcome(r.m);
      return `<tr><td>${scoreLink(r.cell.key, r.cell.a, r.cell.b)}</td><td>${fmtLong(r.m.date)} <span class="muted">${verb}</span> ${clubLink(ctx, x.opp, r.m.season)}</td><td class="n">${times(r.league)}</td></tr>`;
    })
    .join("")}</tbody></table></div>`;
  html += `<h2>Finais mais comuns</h2><p>Placares que este clube mais repetiu.</p>`;
  html += `<div class="table-scroll"><table class="data"><thead><tr><th>Placar</th><th class="n">${name}</th><th class="n">${all_} ${esc(lg.short)}</th></tr></thead><tbody>${common
    .map((r) => `<tr><td>${scoreLink(r.cell.key, r.cell.a, r.cell.b)}</td><td class="n">${times(r.cell.count)}</td><td class="n">${times(r.league)}</td></tr>`)
    .join("")}</tbody></table></div>`;
  html += `<h2>Scorigamis (${myScorigamis.length})</h2>`;
  if (myScorigamis.length) {
    html += `<p>Jogos deste clube que terminaram com um placar inédito ${g(lg, "no", "na")} ${esc(lg.short)}, do mais recente ao mais antigo.</p>`;
    html += `<ol class="list">${myScorigamis.slice(0, SHOW).map(scorigamiItem).join("")}</ol>`;
    if (myScorigamis.length > SHOW) {
      html += `<details class="all"><summary>Mostrar todas as ${myScorigamis.length}</summary><ol class="list" start="${SHOW + 1}">${myScorigamis
        .slice(SHOW)
        .map(scorigamiItem)
        .join("")}</ol></details>`;
    }
  } else html += `<p class="muted">Nenhuma scorigami ainda.</p>`;

  return {
    title: `Scorigamis do ${ctx.clubName(slug)}`,
    description: `${ctx.clubName(slug)} ${g(lg, "no", "na")} ${lg.name}: ${plural(mine.length, "jogo", "jogos")} e ${plural(myScorigamis.length, "scorigami", "scorigamis")}.`,
    html,
  };
}

// --- Temporada ----------------------------------------------------------------

export function seasonPage(ctx: Ctx, lg: LeagueInfo, all: Match[], season: number, stages: string[] = []): Page {
  const liga = lg.slug;
  const S = (s: number) => ctx.season(liga, s);
  const list = scorigamis(all);
  const seasons = seasonsOf(all);
  const counts = seasons.map((s) => list.filter((m) => m.season === s).length);
  const mine = list.filter((m) => m.season === season);
  const rank = 1 + counts.filter((n) => n > mine.length).length;
  const games = all.filter((m) => m.season === season).length;
  const idx = seasons.indexOf(season);
  const [prev, next] = [seasons[idx - 1], seasons[idx + 1]];

  let html = `<a class="back" href="${href(`${liga}/scorigamis`)}">← Todas as temporadas</a><h1>${esc(lg.short)} ${S(season)}</h1>`;
  if (stages.length) html += `<p class="muted">${esc(stages.join(" e "))}</p>`;
  html += `<p class="answer">${mine.length ? plural(mine.length, "scorigami", "scorigamis") : "Nenhuma scorigami"}</p>`;
  html += `<p class="muted">${rank}ª de ${seasons.length} temporadas em placares novos · ${fmtInt(games)} jogos</p>`;
  if (mine.length) html += scorigamiListHtml(ctx, mine);
  html += `<div style="margin-top:1.5rem">${gridHtml(ctx, all.filter((m) => m.season <= season), { mode: "norm", ring: new Set(mine.map((m) => `${hi(m)}-${lo(m)}`)) })}${legendHtml()}</div>`;
  html += `<p class="muted">O gráfico mostra todos os jogos até o fim de ${S(season)}. Contornadas: as scorigamis da temporada.</p>`;
  html += `<nav class="pager">${prev !== undefined ? `<a href="${seasonHref(liga, prev)}">← ${S(prev)}</a>` : "<span></span>"}${
    next !== undefined ? `<a href="${seasonHref(liga, next)}">${S(next)} →</a>` : "<span></span>"
  }</nav>`;
  return {
    title: `Scorigamis ${g(lg, "do", "da")} ${lg.short} ${S(season)}`,
    description: `${plural(mine.length, "scorigami", "scorigamis")} ${g(lg, "no", "na")} ${lg.name} ${S(season)}: os placares que aconteceram pela primeira vez.`,
    html,
  };
}

