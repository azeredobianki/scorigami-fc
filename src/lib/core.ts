// Cálculos de scorigami. Funções puras, usadas no build (páginas estáticas)
// e no navegador (filtros da home e time-lapse).

export interface Match {
  league: string;
  season: number;
  date: string; // AAAA-MM-DD
  home: string; // slug do clube
  away: string;
  hg: number;
  ag: number;
  stage?: string;
  note?: string;
}

export type Mode = "norm" | "mando";

export interface Cell {
  key: string;
  a: number; // linha: maior placar (norm) ou gols do mandante (mando)
  b: number; // coluna: menor placar (norm) ou gols do visitante (mando)
  count: number;
  first: Match;
  last: Match;
}

export const hi = (m: Match) => Math.max(m.hg, m.ag);
export const lo = (m: Match) => Math.min(m.hg, m.ag);

export function scoreKey(m: Match, mode: Mode = "norm"): string {
  return mode === "norm" ? `${hi(m)}-${lo(m)}` : `${m.hg}-${m.ag}`;
}

export function byDate(a: Match, b: Match): number {
  return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
}

/** Contagem por placar, com primeira e última ocorrência. Espera jogos em ordem de data. */
export function buildCells(matches: Match[], mode: Mode = "norm"): Map<string, Cell> {
  const cells = new Map<string, Cell>();
  for (const m of matches) {
    const key = scoreKey(m, mode);
    const c = cells.get(key);
    if (c) {
      c.count++;
      c.last = m;
    } else {
      const [a, b] = key.split("-").map(Number);
      cells.set(key, { key, a, b, count: 1, first: m, last: m });
    }
  }
  return cells;
}

/**
 * Jogos que foram scorigami: a primeira vez que o placar aconteceu na liga.
 * O conjunto de referência é sempre a liga inteira, para que um filtro por
 * time ou por era não "invente" scorigamis.
 */
export function scorigamis(matches: Match[], mode: Mode = "norm"): Match[] {
  const seen = new Set<string>();
  const out: Match[] = [];
  for (const m of matches) {
    const k = `${m.league}|${scoreKey(m, mode)}`;
    if (!seen.has(k)) {
      seen.add(k);
      out.push(m);
    }
  }
  return out;
}

/** Maior placar a mostrar no grid: pelo menos 7 e sempre cobre o maior placar visto. */
export function gridSize(matches: Match[]): number {
  let max = 7;
  for (const m of matches) max = Math.max(max, m.hg, m.ag);
  return max;
}

// --- Destaques -------------------------------------------------------------

function poisson(k: number, lambda: number): number {
  let p = Math.exp(-lambda);
  for (let i = 1; i <= k; i++) p *= lambda / i;
  return p;
}

export interface Unseen {
  a: number;
  b: number;
  probability: number; // chance estimada por jogo
}

/**
 * Placares plausíveis que nunca aconteceram, do mais provável para o menos.
 * A chance vem de um modelo de Poisson com a média de gols de mandantes e
 * visitantes do próprio recorte.
 */
export function unseenPlausible(matches: Match[], cells: Map<string, Cell>, maxTotal = 10): Unseen[] {
  if (!matches.length) return [];
  const lh = matches.reduce((s, m) => s + m.hg, 0) / matches.length;
  const la = matches.reduce((s, m) => s + m.ag, 0) / matches.length;
  const out: Unseen[] = [];
  for (let a = 0; a <= maxTotal; a++) {
    for (let b = 0; b <= a && a + b <= maxTotal; b++) {
      if (cells.has(`${a}-${b}`)) continue;
      let p = poisson(a, lh) * poisson(b, la);
      if (a !== b) p += poisson(b, lh) * poisson(a, la);
      out.push({ a, b, probability: p });
    }
  }
  return out.sort((x, y) => y.probability - x.probability);
}

export function mostCommon(cells: Map<string, Cell>, n = 10): Cell[] {
  return [...cells.values()].sort((x, y) => y.count - x.count || x.a + x.b - (y.a + y.b)).slice(0, n);
}

/** Maiores goleadas: maior diferença, desempate pelo total de gols e depois pela data mais antiga. */
export function biggestRouts(matches: Match[], n = 5): Match[] {
  return [...matches]
    .sort((x, y) => {
      const d = hi(y) - lo(y) - (hi(x) - lo(x));
      if (d) return d;
      const t = y.hg + y.ag - (x.hg + x.ag);
      return t || byDate(x, y);
    })
    .slice(0, n);
}

/** Placares há mais tempo sem acontecer (pela data da última ocorrência). */
export function longestDroughts(cells: Map<string, Cell>, n = 5): Cell[] {
  return [...cells.values()].sort((x, y) => (x.last.date < y.last.date ? -1 : x.last.date > y.last.date ? 1 : 0)).slice(0, n);
}

export interface Exclusive {
  club: string;
  scores: Cell[];
}

/** Placares em que todas as ocorrências envolvem o mesmo clube. */
export function exclusiveScores(matches: Match[], cells: Map<string, Cell>, mode: Mode = "norm"): Exclusive[] {
  const owners = new Map<string, Set<string> | null>();
  for (const m of matches) {
    const k = scoreKey(m, mode);
    const prev = owners.get(k);
    if (prev === null) continue;
    const both = new Set([m.home, m.away]);
    if (prev === undefined) owners.set(k, both);
    else {
      const common = new Set([...prev].filter((c) => both.has(c)));
      owners.set(k, common.size ? common : null);
    }
  }
  const byClub = new Map<string, Cell[]>();
  for (const [k, set] of owners) {
    if (!set) continue;
    for (const club of set) {
      const list = byClub.get(club) ?? [];
      list.push(cells.get(k)!);
      byClub.set(club, list);
    }
  }
  return [...byClub.entries()]
    .map(([club, scores]) => ({ club, scores: scores.sort((x, y) => y.a + y.b - (x.a + x.b)) }))
    .sort((x, y) => y.scores.length - x.scores.length);
}

export function yearsSince(date: string, today: string): number {
  const [y1, m1, d1] = date.split("-").map(Number);
  const [y2, m2, d2] = today.split("-").map(Number);
  let years = y2 - y1;
  if (m2 < m1 || (m2 === m1 && d2 < d1)) years--;
  return years;
}

/** Resultado do ponto de vista de um clube: placar dele primeiro. */
export function forClub(m: Match, club: string): { gf: number; ga: number; opp: string; home: boolean } {
  const home = m.home === club;
  return home ? { gf: m.hg, ga: m.ag, opp: m.away, home } : { gf: m.ag, ga: m.hg, opp: m.home, home };
}

/** "2019" para temporadas de um ano só; "2019/20" para as que viram o ano (ligas europeias). */
export function seasonLabel(season: number, split?: boolean): string {
  return split ? `${season}/${String(season + 1).slice(2)}` : String(season);
}
