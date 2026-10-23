// Filtros da home: competições, times e eras (cada um com várias escolhas),
// tipo de gráfico e cor. O estado fica na URL (?liga=a,b&time=x&era=y&mando=1&cor=first)
// para que um recorte possa ser compartilhado.
import { buildCells, gridSize, scorigamis, type Match, type Mode } from "../lib/core";
import { eras, type Era } from "../lib/eras";
import { esc, highlightsHtml, legendHtml, scorigamiListHtml, seasonRange, topScoresHtml } from "../lib/render";
import { pageLang, t } from "../lib/i18n";
import { href } from "../lib/links";
import { loadData } from "./client-data";
import { paintGrid } from "./paint";

type Color = "first" | "freq";

export async function initHome() {
  const lang = pageLang();
  const T = t(lang);
  const form = document.getElementById("filters") as HTMLFormElement;
  const buttons = [...form.querySelectorAll<HTMLButtonElement>(".switch button[data-mode]")];
  const colorButtons = [...form.querySelectorAll<HTMLButtonElement>(".switch button[data-color]")];
  const $ = (id: string) => document.getElementById(id)!;
  const boxes = (name: string) => [...form.querySelectorAll<HTMLInputElement>(`input[type=checkbox][name="${name}"]`)];
  const checked = (name: string) => boxes(name).filter((b) => b.checked && !b.closest("[hidden]")).map((b) => b.value);
  const menu = (name: string) => form.querySelector<HTMLDetailsElement>(`details[data-name="${name}"]`)!;

  const params = new URLSearchParams(location.search);
  const fromUrl = (k: string) => new Set((params.get(k) ?? "").split(",").filter(Boolean));
  const wanted = { liga: fromUrl("liga"), time: fromUrl("time") };
  let wantedEras: Set<string> | null = fromUrl("era");
  boxes("liga").forEach((b) => (b.checked = wanted.liga.has(b.value)));
  boxes("time").forEach((b) => (b.checked = wanted.time.has(b.value)));
  let mode: Mode = params.get("mando") ? "mando" : "norm";
  let color: Color = params.get("cor") === "first" ? "first" : "freq";

  // Menus: fecham ao clicar fora, um de cada vez; busca de times; botão Limpar.
  const menus = [...form.querySelectorAll<HTMLDetailsElement>("details.multi")];
  menus.forEach((d) =>
    d.addEventListener("toggle", () => {
      if (d.open) menus.forEach((o) => o !== d && (o.open = false));
    }),
  );
  document.addEventListener("click", (e) => {
    if (!(e.target as Element).closest("details.multi")) menus.forEach((d) => (d.open = false));
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") menus.forEach((d) => (d.open = false));
  });
  const find = form.querySelector<HTMLInputElement>("input.find")!;
  find.addEventListener("input", () => {
    const q = find.value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
    menu("time")
      .querySelectorAll<HTMLLabelElement>("label")
      .forEach((l) => (l.style.display = l.textContent!.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().includes(q) ? "" : "none"));
    // Esconde o nome da liga quando nenhum time dela bate com a busca.
    menu("time")
      .querySelectorAll<HTMLFieldSetElement>("fieldset")
      .forEach((f) => (f.style.display = [...f.querySelectorAll<HTMLLabelElement>("label")].some((l) => l.style.display !== "none") ? "" : "none"));
  });
  form.querySelectorAll<HTMLButtonElement>("button.clear").forEach((b) =>
    b.addEventListener("click", () => {
      b.closest("details")!.querySelectorAll<HTMLInputElement>("input[type=checkbox]").forEach((x) => (x.checked = false));
      update(true);
    }),
  );

  const data = await loadData();
  const full = gridSize(data.matches);
  const leagueOf = new Map(data.leagues.map((l) => [l.slug, l]));
  const clubLeague = new Map<string, string>();
  for (const m of data.matches) clubLeague.set(m.home, m.league);

  // As eras dependem das ligas: com uma só, entram as fases dela; com várias, só as décadas.
  let eraKey: string | null = null;
  let eraList: Era[] = [];
  function syncEras(ligas: string[], pool: Match[]) {
    const key = ligas.join(",");
    if (key === eraKey) return;
    eraKey = key;
    const keep = wantedEras ?? new Set(checked("era"));
    wantedEras = null;
    eraList = eras([...new Set(pool.map((m) => m.season))], ligas.length === 1 ? ligas[0] : "", lang).slice(1);
    $("era-menu").innerHTML =
      eraList
        .map((e) => `<label><input type="checkbox" name="era" value="${e.id}"${keep.has(e.id) ? " checked" : ""} /> ${esc(e.label)}</label>`)
        .join("") + `<button type="button" class="clear">${T.clear}</button>`;
    $("era-menu")
      .querySelector("button.clear")!
      .addEventListener("click", () => {
        boxes("era").forEach((x) => (x.checked = false));
        update(true);
      });
  }

  function summary(name: string, labels: string[], all: string) {
    const el = menu(name).querySelector(".sum")!;
    el.textContent = !labels.length ? all : labels.length <= 2 ? labels.join(", ") : T.nSelected(labels.length);
  }

  function update(push: boolean) {
    const ligas = checked("liga");
    const ligaSet = new Set(ligas);
    // Com ligas escolhidas, o filtro de times mostra só os times delas.
    menu("time")
      .querySelectorAll<HTMLFieldSetElement>("fieldset")
      .forEach((f) => (f.hidden = !!ligas.length && !ligaSet.has(f.dataset.league!)));
    const times = new Set(checked("time"));
    const inLeague = ligas.length ? data.matches.filter((m) => ligaSet.has(m.league)) : data.matches;
    syncEras(ligas, inLeague);
    const picked = eraList.filter((e) => checked("era").includes(e.id));

    buttons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.mode === mode)));
    colorButtons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.color === color)));
    summary("liga", ligas.map((s) => leagueOf.get(s)!.short), T.allGeneral);
    summary("time", [...times].map((s) => data.ctx("todas").clubName(s)), T.allTeamsSum);
    summary("era", picked.map((e) => e.label.replace(/ \(.*\)$/, "")), T.allErasSum);

    const inEra = (m: Match) => !picked.length || picked.some((e) => m.season >= e.from && m.season <= e.to);
    const keep = (m: Match) => (!times.size || times.has(m.home) || times.has(m.away)) && inEra(m);
    const shown = inLeague.filter(keep);
    // Com uma liga, scorigami é inédito naquela liga; com várias (ou Geral), inédito em todas as escolhidas juntas.
    const one = ligas.length === 1 ? ligas[0] : "";
    const recent = scorigamis(inLeague, mode, !one).filter(keep).slice(-5).reverse();
    const timeLeagues = new Set([...times].map((t) => clubLeague.get(t)));
    const ctx = data.ctx(one || (timeLeagues.size === 1 && !ligas.length ? [...timeLeagues][0]! : "todas"));

    $("counter").innerHTML = T.showing(shown.length, data.matches.length);
    // O grid encolhe com o filtro: vai até uma linha acima do maior número de gols do recorte.
    paintGrid($("grid"), ctx, shown, { mode, size: gridSize(shown), full, color });
    const [y0, y1] = seasonRange(shown);
    const yl = (s: number) => (one ? ctx.season(one, s) : String(s));
    $("legend").innerHTML = shown.length ? legendHtml(ctx, color === "first" ? [yl(y0), yl(y1)] : undefined) : "";
    const lg = leagueOf.get(one);
    $("recent-title").textContent = T.recentTitle(lg ?? null, ligas.map((s) => leagueOf.get(s)!.short));
    $("recent").innerHTML = scorigamiListHtml(ctx, recent, mode);
    $("all-scorigamis").setAttribute("href", href(one ? `${one}/scorigamis` : "scorigamis", lang));
    $("top").innerHTML = topScoresHtml(ctx, buildCells(shown, mode));
    $("highlights").innerHTML = highlightsHtml(ctx, shown, inLeague.filter(inEra));

    if (push) {
      const q = new URLSearchParams();
      if (ligas.length) q.set("liga", ligas.join(","));
      if (times.size) q.set("time", [...times].join(","));
      if (picked.length) q.set("era", picked.map((e) => e.id).join(","));
      if (mode === "mando") q.set("mando", "1");
      if (color === "first") q.set("cor", "first");
      const qs = q.toString();
      history.replaceState(null, "", qs ? `${location.pathname}?${qs.replace(/%2C/g, ",")}` : location.pathname);
    }
  }

  form.addEventListener("change", (e) => {
    if ((e.target as Element).matches("input.find")) return;
    update(true);
  });
  buttons.forEach((b) =>
    b.addEventListener("click", () => {
      mode = b.dataset.mode as Mode;
      update(true);
    }),
  );
  colorButtons.forEach((b) =>
    b.addEventListener("click", () => {
      color = b.dataset.color as Color;
      update(true);
    }),
  );
  if ([...params.keys()].length) update(false);
}
