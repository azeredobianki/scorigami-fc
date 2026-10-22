// Filtros da home: competição, time, era e tipo de gráfico. O estado fica na URL
// (?liga=&time=&era=&mando=1) para que um recorte possa ser compartilhado.
import { buildCells, gridSize, scorigamis, type Match, type Mode } from "../lib/core";
import { eras, type Era } from "../lib/eras";
import { fmtInt, highlightsHtml, scorigamiListHtml, topScoresHtml } from "../lib/render";
import { href } from "../lib/links";
import { loadData } from "./client-data";
import { paintGrid } from "./paint";

export async function initHome() {
  const form = document.getElementById("filters") as HTMLFormElement;
  const buttons = [...form.querySelectorAll<HTMLButtonElement>(".switch button")];
  const $ = (id: string) => document.getElementById(id)!;
  const select = (name: string) => form.elements.namedItem(name) as HTMLSelectElement;

  const params = new URLSearchParams(location.search);
  select("liga").value = params.get("liga") ?? "";
  select("time").value = params.get("time") ?? "";
  let wantedEra = params.get("era");
  let mode: Mode = params.get("mando") ? "mando" : "norm";
  buttons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.mode === mode)));

  const data = await loadData();
  // As eras dependem da liga: cada uma tem as suas fases.
  let eraLiga: string | null = null;
  let eraList: Era[] = [];
  function syncEras(liga: string, pool: Match[]) {
    if (liga === eraLiga) return;
    eraLiga = liga;
    const wanted = wantedEra ?? select("era").value;
    wantedEra = null;
    eraList = eras([...new Set(pool.map((m) => m.season))], liga);
    select("era").innerHTML = eraList.map((e) => `<option value="${e.id}">${e.label}</option>`).join("");
    select("era").value = eraList.some((e) => e.id === wanted) ? wanted : eraList[0].id;
  }

  function update(push: boolean) {
    const liga = select("liga").value;
    // Com uma liga escolhida, o filtro de time mostra só os times dela.
    form.querySelectorAll<HTMLOptGroupElement>("optgroup").forEach((g) => (g.hidden = !!liga && g.dataset.league !== liga));
    const picked = select("time").selectedOptions[0]?.parentElement as HTMLOptGroupElement | null;
    if (liga && picked?.dataset.league && picked.dataset.league !== liga) select("time").value = "";
    const time = select("time").value;
    const timeLeague = (select("time").selectedOptions[0]?.parentElement as HTMLElement | null)?.dataset.league;
    const inLeague = liga ? data.matches.filter((m) => m.league === liga) : data.matches;
    syncEras(liga, inLeague);
    const era = eraList.find((e) => e.id === select("era").value) ?? eraList[0];
    buttons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.mode === mode)));

    const inEra = (m: Match) => m.season >= era.from && m.season <= era.to;
    const keep = (m: Match) => (!time || m.home === time || m.away === time) && inEra(m);
    const shown = inLeague.filter(keep);
    // Scorigami é sempre medida na liga inteira; o recorte só filtra a lista.
    const recent = scorigamis(inLeague, mode).filter(keep).slice(-5).reverse();
    const ctx = data.ctx(liga || timeLeague || data.leagues[0].slug);

    $("counter").innerHTML = `Exibindo <b>${fmtInt(shown.length)}</b> / ${fmtInt(data.matches.length)} jogos`;
    paintGrid($("grid"), ctx, shown, { mode, size: gridSize(inLeague) });
    $("recent").innerHTML = scorigamiListHtml(ctx, recent, mode);
    $("all-scorigamis").setAttribute("href", href(`${ctx.linkLeague}/scorigamis`));
    $("top").innerHTML = topScoresHtml(ctx, buildCells(shown, mode));
    $("highlights").innerHTML = highlightsHtml(ctx, shown, inLeague.filter(inEra));

    if (push) {
      const q = new URLSearchParams();
      if (liga) q.set("liga", liga);
      if (time) q.set("time", time);
      if (era.id !== eraList[0].id) q.set("era", era.id);
      if (mode === "mando") q.set("mando", "1");
      const qs = q.toString();
      history.replaceState(null, "", qs ? `?${qs}` : location.pathname);
    }
  }

  form.addEventListener("change", () => update(true));
  buttons.forEach((b) =>
    b.addEventListener("click", () => {
      mode = b.dataset.mode as Mode;
      update(true);
    }),
  );
  if ([...params.keys()].length) update(false);
}
