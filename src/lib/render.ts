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
import { href } from "./links";

export interface Ctx {
  clubName: (slug: string, season?: number) => string;
  leagueName: (slug: string) => string;
  /** Liga usada nos links de placar e de time. */
  linkLeague: string;
  today: string;
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

export function fmtDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export const fmtInt = (n: number) => n.toLocaleString("pt-BR");

export function plural(n: number, one: string, many: string): string {
  return `${fmtInt(n)} ${n === 1 ? one : many}`;
}

export const scoreHref = (ctx: Ctx, a: number, b: number) =>
  href(`${ctx.linkLeague}/placar/${Math.max(a, b)}-${Math.min(a, b)}`);
export const clubHref = (ctx: Ctx, slug: string) => href(`${ctx.linkLeague}/time/${slug}`);

/** Jogo em uma linha: "Flamengo 5–0 Vasco". */
export function matchLine(ctx: Ctx, m: Match, links = true): string {
  const name = (slug: string) => {
    const n = esc(ctx.clubName(slug, m.season));
    return links ? `<a href="${clubHref(ctx, slug)}">${n}</a>` : n;
  };
  return `${name(m.home)} <span class="score">${m.hg}–${m.ag}</span> ${name(m.away)}`;
}

/** Faixa de cor (0 = nunca, 1..8 = do mais raro ao mais comum, em escala log). */
export function level(count: number, max: number): number {
  if (!count) return 0;
  if (max <= 1) return 8;
  return 1 + Math.round((Math.log(count) / Math.log(max)) * 7);
}

export interface GridOptions {
  mode: Mode;
  size?: number;
  /** Placares a destacar com um anel (chave "a-b"). */
  ring?: Set<string>;
  /** Mostra o número de jogos dentro das células. */
  numbers?: boolean;
  /** Placares que aconteceram mas devem aparecer apagados (time-lapse). */
  compact?: boolean;
  /** Rótulos dos eixos, quando o grid não é de mandante × visitante. */
  labels?: [string, string];
}

export function gridHtml(ctx: Ctx, matches: Match[], opt: GridOptions): string {
  const { mode } = opt;
  const cells = buildCells(matches, mode);
  const size = opt.size ?? gridSize(matches);
  const max = Math.max(1, ...[...cells.values()].map((c) => c.count));
  const [rowLabel, colLabel] =
    opt.labels ?? (mode === "norm" ? ["Placar do vencedor (ou empate)", "Placar do perdedor"] : ["Gols do mandante", "Gols do visitante"]);
  let html = `<div class="grid-wrap${opt.compact ? " compact" : ""}"><div class="axis-x">${colLabel} →</div><div class="axis-y">${rowLabel} →</div>`;
  html += `<table class="grid" style="--n:${size + 2}"><thead><tr><th></th>`;
  for (let b = 0; b <= size; b++) html += `<th scope="col">${b}</th>`;
  html += `</tr></thead><tbody>`;
  for (let a = 0; a <= size; a++) {
    html += `<tr><th scope="row">${a}</th>`;
    for (let b = 0; b <= size; b++) {
      if (mode === "norm" && b > a) {
        html += `<td class="void"></td>`;
        continue;
      }
      const key = `${a}-${b}`;
      const c = cells.get(key);
      const lv = level(c?.count ?? 0, max);
      const ring = opt.ring?.has(key) ? " ring" : "";
      const label = c
        ? `${a}–${b}: ${plural(c.count, "jogo", "jogos")}. Último: ${fmtDate(c.last.date)}`
        : `${a}–${b}: nunca aconteceu`;
      const text = opt.numbers === false || !c ? "" : c.count > 999 ? `${Math.round(c.count / 100) / 10}k` : String(c.count);
      html += `<td class="l${lv}${ring}" data-key="${key}"><a href="${scoreHref(ctx, a, b)}" title="${esc(label)}" aria-label="${esc(label)}">${text}</a></td>`;
    }
    html += `</tr>`;
  }
  html += `</tbody></table></div>`;
  return html;
}

export function legendHtml(): string {
  let html = `<div class="legend" aria-hidden="true"><span>Nunca</span><i class="l0"></i>`;
  html += `<span>Raro</span>`;
  for (let i = 1; i <= 8; i++) html += `<i class="l${i}"></i>`;
  return html + `<span>Comum</span></div>`;
}

/**
 * Destaques do recorte. `pool` é o conjunto usado para "placares exclusivos"
 * (o recorte sem o filtro de time; senão todo placar seria exclusivo do time).
 */
export function highlightsHtml(ctx: Ctx, matches: Match[], pool: Match[] = matches): string {
  if (!matches.length) return `<p class="muted">Nenhum jogo neste recorte.</p>`;
  const cells = buildCells(matches, "norm");
  const unseen = unseenPlausible(matches, cells).slice(0, 6);
  const common = mostCommon(cells, 1)[0];
  const rout = biggestRouts(matches, 1)[0];
  const drought = longestDroughts(cells, 3);
  const excl = exclusiveScores(pool, pool === matches ? cells : buildCells(pool, "norm"));
  const top = excl[0];
  const pct = ((common.count / matches.length) * 100).toLocaleString("pt-BR", { maximumFractionDigits: 1 });
  const chip = (a: number, b: number) => `<a class="chip" href="${scoreHref(ctx, a, b)}">${a}–${b}</a>`;

  const cards: string[] = [];
  cards.push(`<article class="card">
    <h3>Placares plausíveis que nunca aconteceram</h3>
    <p class="chips">${unseen.map((u) => chip(u.a, u.b)).join(" ")}</p>
    <p class="muted">Ordenados pela chance estimada a partir da média de gols do recorte.</p></article>`);
  cards.push(`<article class="card">
    <h3>Placar mais comum</h3>
    <p class="big">${chip(common.a, common.b)}</p>
    <p>${plural(common.count, "jogo", "jogos")} (${pct}% do total)</p></article>`);
  cards.push(`<article class="card">
    <h3>Maior goleada</h3>
    <p class="big">${matchLine(ctx, rout)}</p>
    <p class="muted">${fmtDate(rout.date)} · ${esc(ctx.leagueName(rout.league))} ${rout.season}</p></article>`);
  cards.push(`<article class="card">
    <h3>Há mais tempo sem acontecer</h3>
    <ul class="plain">${drought
      .map((c) => {
        const y = yearsSince(c.last.date, ctx.today);
        return `<li>${chip(c.a, c.b)} há ${y < 1 ? "menos de 1 ano" : plural(y, "ano", "anos")} <span class="muted">(${fmtDate(c.last.date)})</span></li>`;
      })
      .join("")}</ul></article>`);
  if (top) {
    cards.push(`<article class="card">
      <h3>Mais placares exclusivos</h3>
      <p class="big"><a href="${clubHref(ctx, top.club)}">${esc(ctx.clubName(top.club))}</a></p>
      <p>${plural(top.scores.length, "placar que só ele teve", "placares que só ele teve")}: ${top.scores.map((c) => chip(c.a, c.b)).join(" ")}</p></article>`);
  }
  return `<div class="cards">${cards.join("")}</div>`;
}

export function scorigamiListHtml(ctx: Ctx, list: Match[], numbered = false, mode: Mode = "norm"): string {
  if (!list.length) return `<p class="muted">Nenhuma scorigami.</p>`;
  const tag = numbered ? "ol" : "ul";
  return `<${tag} class="games">${list
    .map(
      (m) =>
        `<li><a class="chip" href="${scoreHref(ctx, m.hg, m.ag)}">${mode === "norm" ? `${hi(m)}–${lo(m)}` : `${m.hg}–${m.ag}`}</a> <span>${matchLine(ctx, m)}</span> <span class="muted">${fmtDate(m.date)}</span></li>`,
    )
    .join("")}</${tag}>`;
}

export function topScoresHtml(ctx: Ctx, cells: Map<string, Cell>, total: number, n = 10): string {
  const top = mostCommon(cells, n);
  const max = top[0]?.count ?? 1;
  return `<ol class="bars">${top
    .map(
      (c) =>
        `<li><a class="chip" href="${scoreHref(ctx, c.a, c.b)}">${c.a}–${c.b}</a><span class="bar"><i style="width:${(c.count / max) * 100}%"></i></span><span class="num">${fmtInt(c.count)}</span><span class="muted pct">${((c.count / total) * 100).toFixed(1).replace(".", ",")}%</span></li>`,
    )
    .join("")}</ol>`;
}

export { scoreKey };
