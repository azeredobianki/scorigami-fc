// Conteúdo das páginas de placar, time e temporada. Usado no build e, na
// prévia (que tem limite de arquivos), no navegador.
import {
  buildCells,
  exclusiveScores,
  forClub,
  gridSize,
  hi,
  lo,
  scoreKey,
  scorigamis,
  unseenPlausible,
  yearsSince,
  type Match,
} from "./core";
import { t, type Lang } from "./i18n";
import { href, scorePageHref, seasonHref } from "./links";
import { clubLink, esc, fmtInt, fmtLong, gridHtml, legendHtml, matchLine, resultLine, scorigamiListHtml, times, type Ctx } from "./render";

export interface LeagueInfo {
  slug: string;
  name: string;
  short: string;
  fem?: boolean;
  split?: boolean;
}

/** Pseudo-liga com todas as competições juntas (páginas de placar do filtro Geral). */
export const ALL: LeagueInfo = { slug: "todas", name: "todas as competições", short: "todas as competições" };
export const allLeague = (lang: Lang): LeagueInfo => ({ ...ALL, name: t(lang).allShort, short: t(lang).allShort });
const isAll = (lg: LeagueInfo) => lg.slug === ALL.slug;

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

  const T = ctx.t;
  const sc = `${a}–${b}`;
  const title = T.scoreTitle(sc, lg);
  const description = count ? T.scoreDescYes(sc, count, lg, fmtLong(ctx, last.date)) : T.scoreDescNo(sc, lg);
  const gameLine = (m: Match) =>
    `<a href="${seasonHref(ctx.lang, m.league, m.season)}">${fmtLong(ctx, m.date)}</a>, ${resultLine(ctx, m)} (${matchLine(ctx, m, false)})${
      isAll(lg) ? ` <span class="muted">· ${esc(ctx.leagueName(m.league))}</span>` : ""
    }`;

  let html = `<h1>${esc(title)}</h1><p class="answer">${count ? T.answerYes(times(ctx, count)) : T.answerNo}</p>`;
  if (count === 1) html += `<p>${T.onlyTime(gameLine(first))}</p>`;
  if (count > 1) {
    html += `<p>${T.firstTime(gameLine(first))}</p>`;
    html += `<p>${T.lastTime(gameLine(last), years)}</p>`;
    if (a !== b) html += `<p class="muted">${T.homeAway(homeWins, awayWins)}</p>`;
  }
  if (unseen) html += `<p>${esc(T.wouldBe(sc, lg, Math.round(1 / unseen.probability)))}</p>`;
  html += `<div style="margin-top:1.5rem">${gridHtml(ctx, all, { mode: "norm", ring: new Set([key]) })}${legendHtml(ctx)}</div>`;
  html += `<h2>${T.nearby}</h2><ol class="list">${nearby
    .map((n) =>
      n.a === a && n.b === b
        ? `<li><span class="score">${n.a}–${n.b}</span> ${times(ctx, n.count)}</li>`
        : `<li><a class="score" href="${scorePageHref(ctx.lang, liga, `${n.a}-${n.b}`)}">${n.a}–${n.b}</a> ${times(ctx, n.count)}</li>`,
    )
    .join("")}</ol>`;
  if (count > 1) {
    html += `<h2>${T.allGames}${count > LIMIT ? ` <span class="muted">${T.mostRecent(LIMIT)}</span>` : ""}</h2><ol class="list">${games
      .slice(0, LIMIT)
      .map((m) => {
        const notes = [isAll(lg) ? ctx.leagueName(m.league) : "", m.note ? T.note(m.note) : ""].filter(Boolean).join(" · ");
        return `<li><span class="date">${fmtLong(ctx, m.date)}</span> ${matchLine(ctx, m)}${notes ? `<span class="muted"> · ${esc(notes)}</span>` : ""}</li>`;
      })
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
  const T = ctx.t;
  const span = `${S(seasons[0])}–${seasons[seasons.length - 1] === current ? T.today : S(seasons[seasons.length - 1])}`;

  let w = 0, d = 0, l = 0;
  for (const m of mine) {
    const r = forClub(m, slug);
    if (r.gf > r.ga) w++;
    else if (r.gf === r.ga) d++;
    else l++;
  }
  const pct = T.pct((w / mine.length) * 100);
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
    const k = r.gf > r.ga ? "w" : r.gf < r.ga ? "l" : "d";
    return { res: T.res[k], verb: T.vs[k], r };
  };
  const scorigamiItem = (m: Match) => {
    const { res, verb, r } = outcome(m);
    return `<li><span class="date">${fmtLong(ctx, m.date)}</span> <span class="muted">${res}</span> <a class="score" href="${scorePageHref(ctx.lang, liga, `${hi(m)}-${lo(m)}`)}">${r.gf}–${r.ga}</a> ${verb} ${clubLink(ctx, r.opp, m.season)}</li>`;
  };
  const scoreLink = (key: string, a: number, b: number) => `<a class="score" href="${scorePageHref(ctx.lang, liga, key)}">${a}–${b}</a>`;
  const SHOW = 25;
  const N = (n: number) => fmtInt(ctx, n);

  let html = `<a class="back" href="${href(`${liga}/times`, ctx.lang)}">${T.allTeams}</a><h1>${name}</h1><p class="muted">${span}</p>`;
  html += `<p>${esc(T.clubIntro(mine.length, lg, S(seasons[0]), myScorigamis.length))}</p>`;
  html += `<div class="stats"><div><b>${N(mine.length)}</b><span>${T.stGames}</span></div><div><b>${N(w)}</b><span>${T.stWins}</span></div><div><b>${N(d)}</b><span>${T.stDraws}</span></div><div><b>${N(l)}</b><span>${T.stLosses}</span></div><div><b>${myScorigamis.length}</b><span>Scorigamis</span></div></div>`;
  html += `<p class="muted">${T.winPct(pct, myCells.size)}</p>`;
  if (nameEras.size > 1) {
    html += `<h2>${T.namesOverTime}</h2><ol class="list">${[...nameEras.entries()]
      .map(([n, e]) => `<li>${esc(n)}, ${e.from === e.to ? S(e.from) : `${S(e.from)}–${S(e.to)}`}, ${T.nGames(e.games)}</li>`)
      .join("")}</ol>`;
  }
  html += `<div style="margin-top:1.5rem">${gridHtml(ctx, all, { mode: "norm", size: gridSize(all), ring: new Set(myScorigamis.map((m) => `${hi(m)}-${lo(m)}`)) })}${legendHtml(ctx)}</div>`;
  html += `<p class="muted">${T.ringedClub}</p>`;
  html += `<h2>${T.rarest}</h2><p>${esc(T.rarestText(lg, onlyHere))}</p>`;
  const thAll = esc(T.thAll(lg));
  html += `<div class="table-scroll"><table class="data"><caption>${T.rarestCaption}</caption><thead><tr><th>${T.thScore}</th><th>${name}</th><th class="n">${thAll}</th></tr></thead><tbody>${rarest
    .map((r) => {
      const { verb, r: x } = outcome(r.m);
      return `<tr><td>${scoreLink(r.cell.key, r.cell.a, r.cell.b)}</td><td>${fmtLong(ctx, r.m.date)} <span class="muted">${verb}</span> ${clubLink(ctx, x.opp, r.m.season)}</td><td class="n">${times(ctx, r.league)}</td></tr>`;
    })
    .join("")}</tbody></table></div>`;
  html += `<h2>${T.commonest}</h2><p>${T.commonestText}</p>`;
  html += `<div class="table-scroll"><table class="data"><thead><tr><th>${T.thScore}</th><th class="n">${name}</th><th class="n">${thAll}</th></tr></thead><tbody>${common
    .map((r) => `<tr><td>${scoreLink(r.cell.key, r.cell.a, r.cell.b)}</td><td class="n">${times(ctx, r.cell.count)}</td><td class="n">${times(ctx, r.league)}</td></tr>`)
    .join("")}</tbody></table></div>`;
  html += `<h2>Scorigamis (${myScorigamis.length})</h2>`;
  if (myScorigamis.length) {
    html += `<p>${esc(T.clubScorigamisText(lg))}</p>`;
    html += `<ol class="list">${myScorigamis.slice(0, SHOW).map(scorigamiItem).join("")}</ol>`;
    if (myScorigamis.length > SHOW) {
      html += `<details class="all"><summary>${T.showAll(myScorigamis.length)}</summary><ol class="list" start="${SHOW + 1}">${myScorigamis
        .slice(SHOW)
        .map(scorigamiItem)
        .join("")}</ol></details>`;
    }
  } else html += `<p class="muted">${T.noScorigamiYet}</p>`;

  return {
    title: T.clubTitle(ctx.clubName(slug)),
    description: T.clubDesc(ctx.clubName(slug), lg, mine.length, myScorigamis.length),
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

  const T = ctx.t;
  let html = `<a class="back" href="${href(`${liga}/scorigamis`, ctx.lang)}">${T.allSeasons}</a><h1>${esc(lg.short)} ${S(season)}</h1>`;
  if (stages.length) html += `<p class="muted">${esc(T.join(stages))}</p>`;
  html += `<p class="answer">${mine.length ? T.nScorigamis(mine.length) : T.noneScorigami}</p>`;
  html += `<p class="muted">${T.seasonRank(rank, seasons.length, games)}</p>`;
  if (mine.length) html += scorigamiListHtml(ctx, mine);
  html += `<div style="margin-top:1.5rem">${gridHtml(ctx, all.filter((m) => m.season <= season), { mode: "norm", ring: new Set(mine.map((m) => `${hi(m)}-${lo(m)}`)) })}${legendHtml(ctx)}</div>`;
  html += `<p class="muted">${T.seasonGridNote(S(season))}</p>`;
  html += `<nav class="pager">${prev !== undefined ? `<a href="${seasonHref(ctx.lang, liga, prev)}">← ${S(prev)}</a>` : "<span></span>"}${
    next !== undefined ? `<a href="${seasonHref(ctx.lang, liga, next)}">${S(next)} →</a>` : "<span></span>"
  }</nav>`;
  return {
    title: T.seasonTitle(lg, S(season)),
    description: T.seasonDesc(mine.length, lg, S(season)),
    html,
  };
}
