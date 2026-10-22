// HTML dos blocos interativos. Usado no build (primeira pintura) e no
// navegador (quando o visitante muda os filtros), para os dois ficarem iguais.
import {
  biggestRouts,
  buildCells,
  exclusiveScores,
  gridSize,
  hi,
  lo,
  longestDroughts,
  mostCommon,
  scoreKey,
  unseenPlausible,
  yearsSince,
  type Cell,
  type Match,
  type Mode,
} from "./core";
import type { Dict, Lang } from "./i18n";
import { clubPageHref, scorePageHref } from "./links";

export interface Ctx {
  clubName: (slug: string, season?: number) => string;
  leagueName: (slug: string) => string;
  /** Liga usada nos links de placar e de time. */
  linkLeague: string;
  today: string;
  /** Rótulo da temporada: "2019" no Brasil, "2019/20" nas ligas europeias. */
  season: (league: string, season: number) => string;
  lang: Lang;
  t: Dict;
}

export const esc = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

/** "05/05/2019" ("05/22/2019" em inglês). */
export const fmtDate = (ctx: Ctx, iso: string) => ctx.t.short(iso);
/** "5 de maio de 2019" */
export const fmtLong = (ctx: Ctx, iso: string) => ctx.t.long(iso);
export const fmtInt = (ctx: Ctx, n: number) => ctx.t.N(n);
export const times = (ctx: Ctx, n: number) => ctx.t.times(n);

export const scoreHref = (ctx: Ctx, a: number, b: number, league = ctx.linkLeague) =>
  scorePageHref(ctx.lang, league, `${Math.max(a, b)}-${Math.min(a, b)}`);
export const clubHref = (ctx: Ctx, slug: string, league = ctx.linkLeague) => clubPageHref(ctx.lang, league, slug);

export function clubLink(ctx: Ctx, slug: string, season?: number, league?: string): string {
  return `<a href="${clubHref(ctx, slug, league)}">${esc(ctx.clubName(slug, season))}</a>`;
}

/** Jogo em uma linha, mandante primeiro: "Grêmio 4–5 Fluminense". */
export function matchLine(ctx: Ctx, m: Match, links = true): string {
  const name = (slug: string) => (links ? clubLink(ctx, slug, m.season, m.league) : esc(ctx.clubName(slug, m.season)));
  return `${name(m.home)} <b class="score">${m.hg}–${m.ag}</b> ${name(m.away)}`;
}

/** Resultado em palavras, vencedor primeiro: "Santos venceu Bahia" ou "Atlético-MG e Botafogo empataram". */
export function resultLine(ctx: Ctx, m: Match): string {
  const link = (slug: string) => clubLink(ctx, slug, m.season, m.league);
  if (m.hg === m.ag) return ctx.t.drew(link(m.home), link(m.away));
  const [w, l] = m.hg > m.ag ? [m.home, m.away] : [m.away, m.home];
  return ctx.t.beat(link(w), link(l));
}

/** "Grêmio 4–5 Fluminense", sem HTML. */
export const plainMatch = (ctx: Ctx, m: Match) =>
  `${ctx.clubName(m.home, m.season)} ${m.hg}–${m.ag} ${ctx.clubName(m.away, m.season)}`;

/** Faixa de cor (0 = nunca, 1..8 = do mais raro ao mais comum, em escala log). */
export function level(count: number, max: number): number {
  if (!count) return 0;
  if (max <= 1) return 8;
  return 1 + Math.round((Math.log(count) / Math.log(max)) * 7);
}

// --- Gráfico ----------------------------------------------------------------

export interface GridOptions {
  mode: Mode;
  size?: number;
  /** Placares a destacar com um anel (chave "a-b"). */
  ring?: Set<string>;
  /** Rótulos dos eixos, quando o grid não é de mandante × visitante. */
  labels?: [string, string];
  /** Cor das casas: quantas vezes o placar aconteceu (padrão) ou quando aconteceu pela primeira vez. */
  color?: "freq" | "first";
}

export interface CellState {
  key: string;
  cls: string;
  count: number;
  tip: string;
  href: string;
}

/** Estado de cada casa do grid, na ordem em que são desenhadas. */
export function gridCells(ctx: Ctx, matches: Match[], opt: GridOptions): { size: number; cells: (CellState | null)[] } {
  const { mode } = opt;
  const cells = buildCells(matches, mode);
  const size = opt.size ?? gridSize(matches);
  const max = [...cells.values()].reduce((x, c) => Math.max(x, c.count), 1);
  // No modo "primeira vez", a cor vai do mais antigo (claro) ao mais recente (escuro).
  const byFirst = opt.color === "first";
  const [y0, y1] = seasonRange(matches);
  const firstLevel = (c: Cell) => 1 + Math.round(((c.first.season - y0) / Math.max(1, y1 - y0)) * 7);
  const out: (CellState | null)[] = [];
  for (let a = size; a >= 0; a--) {
    for (let b = 0; b <= size; b++) {
      if (mode === "norm" && b > a) {
        out.push(null);
        continue;
      }
      const key = `${a}-${b}`;
      const c = cells.get(key);
      const ring = opt.ring?.has(key) ? " ring" : "";
      out.push({
        key,
        cls: `cell l${c ? (byFirst ? firstLevel(c) : level(c.count, max)) : 0}${ring}`,
        count: c?.count ?? 0,
        tip: c && byFirst
          ? ctx.t.tipFirst(fmtDate(ctx, c.first.date), plainMatch(ctx, c.first), times(ctx, c.count))
          : c
          ? ctx.t.tipLast(times(ctx, c.count), fmtDate(ctx, c.last.date), plainMatch(ctx, c.last))
          : ctx.t.tipNever,
        href: scoreHref(ctx, a, b),
      });
    }
  }
  return { size, cells: out };
}

export function gridHtml(ctx: Ctx, matches: Match[], opt: GridOptions): string {
  const { size, cells } = gridCells(ctx, matches, opt);
  const [rowLabel, colLabel] =
    opt.labels ?? (opt.mode === "norm" ? ctx.t.axisNorm : ctx.t.axisMando);
  let html = `<figure class="chart" data-size="${size}" data-mode="${opt.mode}" style="--n:${size + 1}">`;
  html += `<div class="y-label">${rowLabel}</div><div class="y-ticks">`;
  for (let a = size; a >= 0; a--) html += `<span>${a}</span>`;
  html += `</div><div class="cells">`;
  for (const c of cells) {
    html += c
      ? `<a class="${c.cls}" href="${c.href}" data-k="${c.key}" data-tip="${esc(c.tip)}" aria-label="${c.key.replace("-", "–")}: ${esc(c.tip)}"></a>`
      : `<span class="void"></span>`;
  }
  html += `</div><div class="x-ticks">`;
  for (let b = 0; b <= size; b++) html += `<span>${b}</span>`;
  html += `</div><div class="x-label">${colLabel}</div></figure>`;
  return html;
}

/** Primeira e última temporada de uma lista de jogos. */
export function seasonRange(matches: Match[]): [number, number] {
  let a = Infinity, b = -Infinity;
  for (const m of matches) (a = Math.min(a, m.season)), (b = Math.max(b, m.season));
  return [a, b];
}

/** Legenda de cores. Com `years`, a escala é a da primeira vez (do ano mais antigo ao mais recente). */
export function legendHtml(ctx: Ctx, years?: [string, string]): string {
  const [from, to] = years ?? [ctx.t.legendRare, ctx.t.legendCommon];
  let html = `<div class="legend" aria-hidden="true"><span class="sw l0"></span><span>${ctx.t.legendNever}</span><span class="gap"></span>${years ? `<span>${ctx.t.legendFirst}</span>` : ""}<span>${from}</span>`;
  for (let i = 1; i <= 8; i++) html += `<span class="sw l${i}"></span>`;
  return html + `<span>${to}</span></div>`;
}

// --- Listas -----------------------------------------------------------------

/** Lista numerada de scorigamis: "22 de outubro de 2003  7–4  Santos venceu Bahia". */
export function scorigamiListHtml(ctx: Ctx, list: Match[], mode: Mode = "norm"): string {
  if (!list.length) return `<p class="muted">${ctx.t.noScorigami}</p>`;
  const mixed = new Set(list.map((m) => m.league)).size > 1;
  return `<ol class="list">${list
    .map((m) => {
      const label = mode === "norm" ? `${hi(m)}–${lo(m)}` : `${m.hg}–${m.ag}`;
      const tag = mixed ? ` <span class="muted">· ${esc(ctx.leagueName(m.league))}</span>` : "";
      return `<li><span class="date">${fmtLong(ctx, m.date)}</span> <a class="score" href="${scoreHref(ctx, m.hg, m.ag, m.league)}">${label}</a> <span>${resultLine(ctx, m)}${tag}</span></li>`;
    })
    .join("")}</ol>`;
}

/** "1–0: 4.416 vezes" */
export function topScoresHtml(ctx: Ctx, cells: Map<string, Cell>, n = 10): string {
  return `<ol class="list">${mostCommon(cells, n)
    .map((c) => `<li><a class="score" href="${scoreHref(ctx, c.a, c.b)}">${c.a}–${c.b}</a>: ${times(ctx, c.count)}</li>`)
    .join("")}</ol>`;
}

// --- Destaques --------------------------------------------------------------

/**
 * Os cinco destaques. `pool` é o conjunto usado para "placares exclusivos"
 * (o recorte sem o filtro de time; senão todo placar seria exclusivo do time).
 */
export function highlightsHtml(ctx: Ctx, matches: Match[], pool: Match[] = matches): string {
  const T = ctx.t;
  if (!matches.length) return `<p class="muted">${T.noGames}</p>`;
  const cells = buildCells(matches, "norm");
  // Em ligas com muitos jogos todo placar de até 10 gols já saiu; aí a busca vai além.
  let unseen = unseenPlausible(matches, cells).slice(0, 6);
  for (let t = 12; !unseen.length && t <= 20; t += 2) unseen = unseenPlausible(matches, cells, t).slice(0, 6);
  const common = mostCommon(cells, 1)[0];
  const rout = biggestRouts(matches, 1)[0];
  const drought = longestDroughts(cells, 3);
  const top = exclusiveScores(pool, pool === matches ? cells : buildCells(pool, "norm"))[0];
  const pct = T.pct((common.count / matches.length) * 100);
  const score = (a: number, b: number) => `<a class="score" href="${scoreHref(ctx, a, b)}">${a}–${b}</a>`;
  const mixed = new Set(matches.map((m) => m.league)).size > 1;

  const items = [
    `<dt>${T.hlUnseen}</dt><dd>${T.hlUnseenText(T.join(unseen.map((u) => score(u.a, u.b))))}</dd>`,
    `<dt>${T.hlCommon}</dt><dd>${T.hlCommonText(score(common.a, common.b), common.count, pct)}</dd>`,
    `<dt>${T.hlRout}</dt><dd>${T.hlRoutText(matchLine(ctx, rout), fmtLong(ctx, rout.date), mixed ? esc(ctx.leagueName(rout.league)) : "")}</dd>`,
    `<dt>${T.hlDrought}</dt><dd>${T.join(drought.map((c) => `${score(c.a, c.b)} (${T.hlAgo(yearsSince(c.last.date, ctx.today))})`))}.</dd>`,
  ];
  if (top) {
    const club = clubLink(ctx, top.club, undefined, pool.find((m) => m.home === top.club)?.league);
    items.push(`<dt>${T.hlExclusive}</dt><dd>${T.hlExclusiveText(club, top.scores.length, T.join(top.scores.map((c) => score(c.a, c.b))))}</dd>`);
  }
  return `<dl class="facts">${items.join("")}</dl>`;
}

export { scoreKey };
