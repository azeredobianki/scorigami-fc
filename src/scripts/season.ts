// Página de temporada desenhada no navegador (usada na prévia, que tem limite
// de arquivos). Mostra o mesmo que /<liga>/scorigamis/<ano>.
import { hi, lo, scorigamis } from "../lib/core";
import { href, seasonHref } from "../lib/links";
import { esc, fmtInt, gridHtml, legendHtml, plural, scorigamiListHtml } from "../lib/render";
import { loadData } from "./client-data";

export async function initSeason() {
  const q = new URLSearchParams(location.search);
  const data = await loadData();
  const lg = data.leagues.find((l) => l.slug === q.get("liga")) ?? data.leagues[0];
  const liga = lg.slug;
  const ctx = data.ctx(liga);
  const all = data.matches.filter((m) => m.league === liga);
  const seasons = [...new Set(all.map((m) => m.season))].sort((a, b) => a - b);
  const season = seasons.includes(Number(q.get("ano"))) ? Number(q.get("ano")) : seasons[seasons.length - 1];
  const S = (s: number) => ctx.season(liga, s);
  const list = scorigamis(all);
  const counts = seasons.map((s) => list.filter((m) => m.season === s).length);
  const mine = list.filter((m) => m.season === season);
  const rank = 1 + counts.filter((n) => n > mine.length).length;
  const games = all.filter((m) => m.season === season).length;
  const idx = seasons.indexOf(season);
  const [prev, next] = [seasons[idx - 1], seasons[idx + 1]];

  document.title = `Scorigamis ${lg.fem ? "da" : "do"} ${lg.name} ${S(season)} | Scorigami FC`;
  document.getElementById("season")!.innerHTML = `
    <a class="back" href="${href(`${liga}/scorigamis`)}">← Todas as temporadas</a>
    <h1>${esc(lg.name)} ${S(season)}</h1>
    <p class="answer">${mine.length ? plural(mine.length, "scorigami", "scorigamis") : "Nenhuma scorigami"}</p>
    <p class="muted">${rank}ª de ${seasons.length} temporadas em placares novos · ${fmtInt(games)} jogos</p>
    ${mine.length ? scorigamiListHtml(ctx, mine) : ""}
    <div style="margin-top:1.5rem">
      ${gridHtml(ctx, all.filter((m) => m.season <= season), { mode: "norm", ring: new Set(mine.map((m) => `${hi(m)}-${lo(m)}`)) })}
      ${legendHtml()}
    </div>
    <p class="muted">O gráfico mostra todos os jogos até o fim de ${S(season)}. Contornadas: as scorigamis da temporada.</p>
    <nav class="pager">
      ${prev !== undefined ? `<a href="${seasonHref(liga, prev)}">← ${S(prev)}</a>` : "<span></span>"}
      ${next !== undefined ? `<a href="${seasonHref(liga, next)}">${S(next)} →</a>` : "<span></span>"}
    </nav>`;
}
