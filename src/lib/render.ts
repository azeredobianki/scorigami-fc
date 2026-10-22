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
import { clubPageHref, scorePageHref } from "./links";

export interface Ctx {
  clubName: (slug: string, season?: number) => string;
  leagueName: (slug: string) => string;
  /** Liga usada nos links de placar e de time. */
  linkLeague: string;
  today: string;
  /** Rótulo da temporada: "2019" no Brasil, "2019/20" nas ligas europeias. */
  season: (league: string, season: number) => string;
}

export const esc = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

const MONTHS = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

/** "05/05/2019" */
export function fmtDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

/** "5 de maio de 2019" */
export function fmtLong(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} de ${MONTHS[m - 1]} de ${y}`;
}

export const fmtInt = (n: number) => n.toLocaleString("pt-BR");

export function plural(n: number, one: string, many: string): string {
  return `${fmtInt(n)} ${n === 1 ? one : many}`;
}

export const times = (n: number) => (n ? plural(n, "vez", "vezes") : "Nunca");

export const scoreHref = (ctx: Ctx, a: number, b: number, league = ctx.linkLeague) =>
  scorePageHref(league, `${Math.max(a, b)}-${Math.min(a, b)}`);
export const clubHref = (ctx: Ctx, slug: string, league = ctx.linkLeague) => clubPageHref(league, slug);

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
  if (m.hg === m.ag) return `${link(m.home)} e ${link(m.away)} empataram`;
  const [w, l] = m.hg > m.ag ? [m.home, m.away] : [m.away, m.home];
  return `${link(w)} venceu ${link(l)}`;
}

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
          ? `Primeira vez: ${fmtDate(c.first.date)}, ${ctx.clubName(c.first.home, c.first.season)} ${c.first.hg}–${c.first.ag} ${ctx.clubName(c.first.away, c.first.season)} · ${times(c.count)}`
          : c
          ? `${times(c.count)} · última: ${fmtDate(c.last.date)}, ${ctx.clubName(c.last.home, c.last.season)} ${c.last.hg}–${c.last.ag} ${ctx.clubName(c.last.away, c.last.season)}`
          : "Nunca aconteceu",
        href: scoreHref(ctx, a, b),
      });
    }
  }
  return { size, cells: out };
}

export function gridHtml(ctx: Ctx, matches: Match[], opt: GridOptions): string {
  const { size, cells } = gridCells(ctx, matches, opt);
  const [rowLabel, colLabel] =
    opt.labels ?? (opt.mode === "norm" ? ["Placar do vencedor", "Placar do perdedor"] : ["Gols do mandante", "Gols do visitante"]);
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
export function legendHtml(years?: [string, string]): string {
  const [from, to] = years ?? ["Raro", "Comum"];
  let html = `<div class="legend" aria-hidden="true"><span class="sw l0"></span><span>Nunca</span><span class="gap"></span>${years ? "<span>Primeira vez:</span>" : ""}<span>${from}</span>`;
  for (let i = 1; i <= 8; i++) html += `<span class="sw l${i}"></span>`;
  return html + `<span>${to}</span></div>`;
}

// --- Listas -----------------------------------------------------------------

/** Lista numerada de scorigamis: "22 de outubro de 2003  7–4  Santos venceu Bahia". */
export function scorigamiListHtml(ctx: Ctx, list: Match[], mode: Mode = "norm"): string {
  if (!list.length) return `<p class="muted">Nenhuma scorigami.</p>`;
  const mixed = new Set(list.map((m) => m.league)).size > 1;
  return `<ol class="list">${list
    .map((m) => {
      const label = mode === "norm" ? `${hi(m)}–${lo(m)}` : `${m.hg}–${m.ag}`;
      const tag = mixed ? ` <span class="muted">· ${esc(ctx.leagueName(m.league))}</span>` : "";
      return `<li><span class="date">${fmtLong(m.date)}</span> <a class="score" href="${scoreHref(ctx, m.hg, m.ag, m.league)}">${label}</a> <span>${resultLine(ctx, m)}${tag}</span></li>`;
    })
    .join("")}</ol>`;
}

/** "1–0: 4.416 vezes" */
export function topScoresHtml(ctx: Ctx, cells: Map<string, Cell>, n = 10): string {
  return `<ol class="list">${mostCommon(cells, n)
    .map((c) => `<li><a class="score" href="${scoreHref(ctx, c.a, c.b)}">${c.a}–${c.b}</a>: ${times(c.count)}</li>`)
    .join("")}</ol>`;
}

// --- Destaques --------------------------------------------------------------

/**
 * Os cinco destaques. `pool` é o conjunto usado para "placares exclusivos"
 * (o recorte sem o filtro de time; senão todo placar seria exclusivo do time).
 */
export function highlightsHtml(ctx: Ctx, matches: Match[], pool: Match[] = matches): string {
  if (!matches.length) return `<p class="muted">Nenhum jogo neste recorte.</p>`;
  const cells = buildCells(matches, "norm");
  // Em ligas com muitos jogos todo placar de até 10 gols já saiu; aí a busca vai além.
  let unseen = unseenPlausible(matches, cells).slice(0, 6);
  for (let t = 12; !unseen.length && t <= 20; t += 2) unseen = unseenPlausible(matches, cells, t).slice(0, 6);
  const common = mostCommon(cells, 1)[0];
  const rout = biggestRouts(matches, 1)[0];
  const drought = longestDroughts(cells, 3);
  const top = exclusiveScores(pool, pool === matches ? cells : buildCells(pool, "norm"))[0];
  const pct = ((common.count / matches.length) * 100).toLocaleString("pt-BR", { maximumFractionDigits: 1 });
  const score = (a: number, b: number) => `<a class="score" href="${scoreHref(ctx, a, b)}">${a}–${b}</a>`;
  const join = (xs: string[]) => (xs.length > 1 ? `${xs.slice(0, -1).join(", ")} e ${xs[xs.length - 1]}` : xs[0] ?? "");

  const items = [
    `<dt>Nunca aconteceram</dt><dd>${join(unseen.map((u) => score(u.a, u.b)))}. São os placares inéditos mais prováveis pela média de gols.</dd>`,
    `<dt>Mais comum</dt><dd>${score(common.a, common.b)}, em ${plural(common.count, "jogo", "jogos")} (${pct}% do total).</dd>`,
    `<dt>Maior goleada</dt><dd>${matchLine(ctx, rout)}, em ${fmtLong(rout.date)}${new Set(matches.map((m) => m.league)).size > 1 ? ` (${esc(ctx.leagueName(rout.league))})` : ""}.</dd>`,
    `<dt>Há mais tempo sem acontecer</dt><dd>${join(
      drought.map((c) => {
        const y = yearsSince(c.last.date, ctx.today);
        return `${score(c.a, c.b)} (${y < 1 ? "menos de 1 ano" : `há ${plural(y, "ano", "anos")}`})`;
      }),
    )}.</dd>`,
  ];
  if (top) {
    items.push(
      `<dt>Mais placares exclusivos</dt><dd>${clubLink(ctx, top.club, undefined, pool.find((m) => m.home === top.club)?.league)}, com ${plural(top.scores.length, "placar que só ele teve", "placares que só ele teve")}: ${join(
        top.scores.map((c) => score(c.a, c.b)),
      )}.</dd>`,
    );
  }
  return `<dl class="facts">${items.join("")}</dl>`;
}

export { scoreKey };
