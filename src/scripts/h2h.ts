// Confronto direto: placares entre dois times. Em "qualquer mando", cada jogo é
// virado para o lado do time 1 (Inter 3–1 Grêmio vale o mesmo em casa ou fora);
// em "mandante × visitante", só entram os jogos com o time 1 em casa.
import { buildCells, mostCommon, type Match } from "../lib/core";
import { esc, fmtLong, gridHtml, legendHtml, matchLine } from "../lib/render";
import { loadData } from "./client-data";

export async function initH2H() {
  const form = document.getElementById("h2h") as HTMLFormElement;
  const selA = form.elements.namedItem("a") as HTMLSelectElement;
  const selB = form.elements.namedItem("b") as HTMLSelectElement;
  const modeButtons = [...form.querySelectorAll<HTMLButtonElement>("button[data-mode]")];
  const $ = (id: string) => document.getElementById(id)!;

  const q = new URLSearchParams(location.search);
  const has = (sel: HTMLSelectElement, v: string | null) => !!v && [...sel.options].some((o) => o.value === v);
  if (has(selA, q.get("a"))) selA.value = q.get("a")!;
  if (has(selB, q.get("b"))) selB.value = q.get("b")!;
  let home = q.get("mando") === "1";

  const data = await loadData();
  const T = data.ctx("todas").t;

  function update(push: boolean) {
    const a = selA.value;
    const b = selB.value;
    modeButtons.forEach((x) => x.setAttribute("aria-pressed", String((x.dataset.mode === "home") === home)));
    const pair = data.matches.filter((m) => (m.home === a && m.away === b) || (m.home === b && m.away === a));
    const games = home ? pair.filter((m) => m.home === a) : pair;
    // Liga dos links: a do maior número de jogos entre os dois.
    const count = new Map<string, number>();
    for (const m of games) count.set(m.league, (count.get(m.league) ?? 0) + 1);
    const league = [...count.entries()].sort((x, y) => y[1] - x[1])[0]?.[0] ?? "todas";
    const ctx = data.ctx(count.size > 1 ? "todas" : league);
    const nameA = ctx.clubName(a);
    const nameB = ctx.clubName(b);
    $("h2h-home").textContent = T.h2hHome(nameA);

    if (push) {
      const u = new URLSearchParams({ a, b });
      if (home) u.set("mando", "1");
      history.replaceState(null, "", `${location.pathname}?${u}`);
    }

    if (!games.length || a === b) {
      $("h2h-summary").innerHTML = `<p class="muted">${esc(home && pair.length ? T.h2hNoHome(nameA, nameB) : T.h2hNoGames(nameA, nameB))}</p>`;
      for (const id of ["h2h-grid", "h2h-legend", "h2h-facts", "h2h-games"]) $(id).innerHTML = "";
      $("h2h-games-title").hidden = true;
      return;
    }
    $("h2h-games-title").hidden = false;

    // Cada jogo do ponto de vista do time 1: mandante = time 1.
    const view: Match[] = games.map((m) => (m.home === a ? m : { ...m, home: a, away: b, hg: m.ag, ag: m.hg }));
    let wa = 0, d = 0, wb = 0, ga = 0, gb = 0;
    for (const m of view) {
      ga += m.hg;
      gb += m.ag;
      if (m.hg > m.ag) wa++;
      else if (m.hg < m.ag) wb++;
      else d++;
    }
    const cells = buildCells(view, "mando");
    $("h2h-summary").innerHTML =
      `<p class="answer">${esc(T.h2hSummary(view.length, nameA, wa, d, nameB, wb))}</p>` +
      `<p class="muted">${esc(T.h2hGoals(nameA, ga, nameB, gb))} ${esc(T.h2hScores(cells.size))}</p>`;
    $("h2h-grid").innerHTML = gridHtml(ctx, view, { mode: "mando", labels: T.h2hAxis(nameA, nameB) });
    $("h2h-legend").innerHTML = legendHtml(ctx);

    // Destaques: placar mais comum e a maior vitória de cada lado.
    const real = (v: Match) => games[view.indexOf(v)];
    const biggest = (won: (m: Match) => number) =>
      view.filter((m) => won(m) > 0).sort((x, y) => won(y) - won(x) || y.hg + y.ag - (x.hg + x.ag))[0];
    const top = mostCommon(cells, 1)[0];
    const bigA = biggest((m) => m.hg - m.ag);
    const bigB = biggest((m) => m.ag - m.hg);
    const fact = (title: string, m: Match | undefined) =>
      m ? `<dt>${esc(title)}</dt><dd>${matchLine(ctx, real(m))}, ${fmtLong(ctx, m.date)}.</dd>` : "";
    $("h2h-facts").innerHTML = `<dl class="facts"><dt>${T.h2hCommon}</dt><dd><b class="score">${top.a}–${top.b}</b>, ${T.times(top.count)}.</dd>${fact(
      T.h2hBiggest(nameA),
      bigA,
    )}${fact(T.h2hBiggest(nameB), bigB)}</dl>`;

    const mixed = count.size > 1;
    $("h2h-games").innerHTML = `<ol class="list">${[...games]
      .reverse()
      .map((m) => {
        const notes = [mixed ? ctx.leagueName(m.league) : "", m.note ? T.note(m.note) : ""].filter(Boolean).join(" · ");
        return `<li><span class="date">${fmtLong(ctx, m.date)}</span> ${matchLine(ctx, m)}${notes ? `<span class="muted"> · ${esc(notes)}</span>` : ""}</li>`;
      })
      .join("")}</ol>`;
  }

  form.addEventListener("change", () => update(true));
  document.getElementById("h2h-swap")!.addEventListener("click", () => {
    [selA.value, selB.value] = [selB.value, selA.value];
    update(true);
  });
  modeButtons.forEach((x) =>
    x.addEventListener("click", () => {
      home = x.dataset.mode === "home";
      update(true);
    }),
  );
  update(false);
}
