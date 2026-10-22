// Atualiza o gráfico sem recriar as casas, para que as cores mudem com transição.
import type { Match } from "../lib/core";
import { gridCells, gridHtml, type Ctx, type GridOptions } from "../lib/render";

export function paintGrid(host: HTMLElement, ctx: Ctx, matches: Match[], opt: GridOptions) {
  const chart = host.querySelector<HTMLElement>("figure.chart");
  const size = opt.size;
  if (!chart || chart.dataset.mode !== opt.mode || (size !== undefined && Number(chart.dataset.size) !== size) || opt.labels) {
    host.innerHTML = gridHtml(ctx, matches, opt);
    return;
  }
  const { cells } = gridCells(ctx, matches, { ...opt, size: Number(chart.dataset.size) });
  const nodes = chart.querySelector(".cells")!.children;
  cells.forEach((c, i) => {
    const el = nodes[i] as HTMLAnchorElement;
    if (!c || !el.dataset.k) return;
    el.className = c.cls;
    el.dataset.tip = c.tip;
    el.setAttribute("href", c.href);
    el.setAttribute("aria-label", `${c.key.replace("-", "–")}: ${c.tip}`);
  });
}
