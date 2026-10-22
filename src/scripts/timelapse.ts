// Time-lapse: o gráfico acende temporada a temporada. Cada casa ganha a cor do
// ano em que o placar apareceu pela primeira vez; as novas da temporada piscam.
import { gridSize, scoreKey, scorigamis, type Match, type Mode } from "../lib/core";
import { gridHtml } from "../lib/render";
import { loadData } from "./client-data";

interface Milestone {
  league: string;
  season: number;
  title: string;
  text: string;
}

const LIGHT = [74, 24]; // luminosidade: mais clara = mais antiga, mais escura = mais recente

export async function initTimelapse() {
  const data = await loadData();
  const T = data.ctx("").t;
  const milestones: Milestone[] = JSON.parse(document.getElementById("tl-milestones")!.textContent ?? "[]");
  const range = document.getElementById("tl-range") as HTMLInputElement;
  const play = document.getElementById("tl-play") as HTMLButtonElement;
  const ligaSel = document.querySelector<HTMLSelectElement>("#tl-filters select");
  const modeButtons = [...document.querySelectorAll<HTMLButtonElement>("#tl-filters button[data-mode]")];
  // Maior × menor (padrão) ou mandante × visitante, como no gráfico da home.
  let mode: Mode = "norm";
  const $ = (id: string) => document.getElementById(id)!;
  const nodes = new Map<string, HTMLElement>();
  // Redesenha o grid no tamanho da competição escolhida.
  function buildGrid(pool: Match[]) {
    const size = gridSize(pool);
    const holder = $("tl-grid");
    holder.innerHTML = gridHtml(data.ctx(ligaSel?.value || "todas"), [], { mode, size });
    holder.querySelector("figure.chart")!.classList.add("by-year");
    nodes.clear();
    holder.querySelectorAll<HTMLElement>(".cell").forEach((el) => nodes.set(el.dataset.k!, el));
  }

  let firsts: Match[] = [];
  let seasons: number[] = [];
  let shown = -1;
  let timer: number | undefined;
  const lum = (s: number) => {
    const t = seasons.length > 1 ? (s - seasons[0]) / (seasons[seasons.length - 1] - seasons[0]) : 1;
    return LIGHT[0] + t * (LIGHT[1] - LIGHT[0]);
  };

  const label = (s: number) => (ligaSel?.value ? data.ctx(ligaSel.value).season(ligaSel.value, s) : String(s));

  function setup() {
    const liga = ligaSel?.value ?? "";
    const pool = liga ? data.matches.filter((m) => m.league === liga) : data.matches;
    seasons = [...new Set(pool.map((m) => m.season))].sort((a, b) => a - b);
    firsts = scorigamis(pool, mode);
    modeButtons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.mode === mode)));
    buildGrid(pool);
    document.querySelectorAll<HTMLElement>(".milestones li").forEach((li) => (li.hidden = !!liga && li.dataset.league !== liga));
    document.querySelectorAll(".tl-first").forEach((el) => (el.textContent = label(seasons[0])));
    document.querySelectorAll(".tl-last").forEach((el) => (el.textContent = label(seasons[seasons.length - 1])));
    $("tl-ramp").style.background = `linear-gradient(90deg, hsl(150 55% ${LIGHT[0]}%), hsl(150 55% ${LIGHT[1]}%))`;
    range.max = String(seasons.length - 1);
    range.value = range.max;
    shown = -1;
    draw();
  }

  function draw() {
    const i = Number(range.value);
    const season = seasons[i];
    const liga = ligaSel?.value ?? "";
    const ctx = data.ctx(liga || "todas");
    const firstOf = new Map<string, Match>();
    for (const m of firsts) if (m.season <= season && !firstOf.has(scoreKey(m, mode))) firstOf.set(scoreKey(m, mode), m);
    const forward = i === shown + 1;
    for (const [key, el] of nodes) {
      const m = firstOf.get(key);
      const isNew = !!m && m.season === season;
      el.classList.toggle("seen", !!m);
      el.classList.toggle("ring", isNew);
      if (isNew && forward) {
        el.classList.remove("new");
        void el.offsetWidth; // reinicia a animação
        el.classList.add("new");
      }
      el.style.setProperty("--lum", m ? `${lum(m.season)}%` : "");
      el.dataset.tip = m
        ? ctx.t.tlTipFirst(ctx.season(m.league, m.season), `${ctx.clubName(m.home, m.season)} ${m.hg}–${m.ag} ${ctx.clubName(m.away, m.season)}`)
        : ctx.t.tlTipNot;
    }
    shown = i;
    $("tl-year").textContent = label(season);
    $("tl-count").textContent = ctx.t.N(firstOf.size);
    const notes = milestones.filter((x) => x.season === season && (!liga || x.league === liga));
    $("tl-note").innerHTML = notes.map((n) => `<b>${n.title}</b>${n.text}`).join("<br>");
  }

  function stop() {
    clearInterval(timer);
    timer = undefined;
    play.textContent = "▶";
    play.setAttribute("aria-label", T.tlPlay);
  }

  function start() {
    if (range.value === range.max) {
      range.value = "0";
      shown = -1;
      draw();
    }
    play.textContent = "❚❚";
    play.setAttribute("aria-label", T.tlPause);
    timer = window.setInterval(() => {
      if (range.value === range.max) return stop();
      range.value = String(Number(range.value) + 1);
      draw();
    }, 450);
  }

  play.addEventListener("click", () => (timer ? stop() : start()));
  range.addEventListener("input", () => {
    stop();
    draw();
  });
  modeButtons.forEach((b) =>
    b.addEventListener("click", () => {
      if (b.dataset.mode === mode) return;
      mode = b.dataset.mode as Mode;
      stop();
      setup();
    }),
  );
  ligaSel?.addEventListener("change", () => {
    stop();
    setup();
  });
  document.querySelectorAll<HTMLButtonElement>(".milestones button").forEach((b) =>
    b.addEventListener("click", () => {
      stop();
      if (ligaSel && ligaSel.value && ligaSel.value !== b.dataset.league) {
        ligaSel.value = b.dataset.league!;
        setup();
      }
      const i = seasons.indexOf(Number(b.dataset.season));
      if (i < 0) return;
      range.value = String(i);
      shown = i - 1;
      draw();
      document.getElementById("tl-year")!.scrollIntoView({ behavior: "smooth", block: "start" });
    }),
  );
  setup();
}
