// Time-lapse: o grid acumulado até cada temporada, com play/pausa.
import { gridSize, scorigamis, scoreKey, type Match } from "../lib/core";
import { fmtInt, gridHtml, plural, scorigamiListHtml } from "../lib/render";
import { loadData } from "./client-data";

// Marcos escritos à mão, por liga e temporada.
const MILESTONES: Record<string, Record<number, string>> = {
  brasileirao: {
    1959: "Primeira Taça Brasil, a primeira competição nacional reconhecida pela CBF.",
    1967: "Começa o Robertão (Torneio Roberto Gomes Pedrosa).",
    1971: "Primeiro Campeonato Nacional de Clubes.",
    2003: "Começam os pontos corridos.",
    2006: "A Série A passa a ter 20 clubes.",
    2020: "Temporada da pandemia, terminada em fevereiro de 2021.",
  },
};

export async function initTimelapse() {
  const data = await loadData();
  const form = document.getElementById("tl-filters") as HTMLFormElement;
  const ligaSel = form.elements.namedItem("liga") as HTMLSelectElement;
  const range = document.getElementById("tl-range") as HTMLInputElement;
  const play = document.getElementById("tl-play") as HTMLButtonElement;
  const $ = (id: string) => document.getElementById(id)!;
  ligaSel.value = new URLSearchParams(location.search).get("liga") ?? "";

  let pool: Match[] = [];
  let seasons: number[] = [];
  let firsts: Match[] = [];
  let size = 7;
  let timer: number | undefined;

  function setup() {
    const liga = ligaSel.value;
    pool = liga ? data.matches.filter((m) => m.league === liga) : data.matches;
    seasons = [...new Set(pool.map((m) => m.season))].sort((a, b) => a - b);
    firsts = scorigamis(pool);
    size = gridSize(pool);
    range.max = String(seasons.length - 1);
    range.value = range.max;
    draw();
  }

  function draw() {
    const season = seasons[Number(range.value)];
    const liga = ligaSel.value;
    const ctx = data.ctx(liga || data.leagues[0].slug);
    const upTo = pool.filter((m) => m.season <= season);
    const fresh = firsts.filter((m) => m.season === season);
    const unique = new Set(upTo.map((m) => `${m.league}|${scoreKey(m)}`)).size;
    $("tl-grid").innerHTML = gridHtml(ctx, upTo, { mode: "norm", size, ring: new Set(fresh.map((m) => scoreKey(m))) });
    $("tl-year").textContent = String(season);
    $("tl-counter").innerHTML = `<b>${fmtInt(unique)}</b> placares diferentes em ${plural(upTo.length, "jogo", "jogos")}`;
    const notes = (liga ? [liga] : data.leagues.map((l) => l.slug)).map((l) => MILESTONES[l]?.[season]).filter(Boolean);
    $("tl-milestone").textContent = notes.join(" ");
    $("tl-list").innerHTML = scorigamiListHtml(ctx, fresh, true);
  }

  function stop() {
    clearInterval(timer);
    timer = undefined;
    play.textContent = "▶ Play";
  }

  play.addEventListener("click", () => {
    if (timer) return stop();
    if (range.value === range.max) range.value = "0";
    play.textContent = "❚❚ Pausar";
    draw();
    timer = window.setInterval(() => {
      if (range.value === range.max) return stop();
      range.value = String(Number(range.value) + 1);
      draw();
    }, 900);
  });
  range.addEventListener("input", () => {
    stop();
    draw();
  });
  ligaSel.addEventListener("change", () => {
    stop();
    setup();
  });
  setup();
}
