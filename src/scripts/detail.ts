// Páginas de temporada, placar e time desenhadas no navegador. Só a prévia usa
// (lá há limite de arquivos); o site normal gera uma página para cada uma.
import { ALL, clubPage, scorePage, seasonPage, type Page } from "../lib/pages";
import { loadData } from "./client-data";

export async function initDetail(kind: "temporada" | "placar" | "time") {
  const q = new URLSearchParams(location.search);
  const data = await loadData();
  const lg = data.leagues.find((l) => l.slug === q.get("liga")) ?? data.leagues[0];
  const ctx = data.ctx(lg.slug);
  const all = data.matches.filter((m) => m.league === lg.slug);
  let page: Page;
  if (kind === "temporada") {
    const seasons = [...new Set(all.map((m) => m.season))];
    const ano = Number(q.get("ano"));
    page = seasonPage(ctx, lg, all, seasons.includes(ano) ? ano : Math.max(...seasons));
  } else if (kind === "placar") {
    const p = q.get("p") ?? "";
    const key = /^\d+-\d+$/.test(p) ? p : "1-0";
    // "todas": o placar no filtro Geral, com jogos de todas as competições.
    page = q.get("liga") === ALL.slug ? scorePage(data.ctx(ALL.slug), ALL, data.matches, key) : scorePage(ctx, lg, all, key);
  } else {
    const t = q.get("t") ?? "";
    const plays = all.some((m) => m.home === t || m.away === t);
    page = plays ? clubPage(ctx, lg, all, t) : { title: "Time", description: "", html: `<p class="muted">Time não encontrado.</p>` };
  }
  document.title = `${page.title} | Scorigami FC`;
  document.getElementById("detail")!.innerHTML = page.html;
}
