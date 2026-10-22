// Leitura dos dados no build. Só roda no Node.
import fs from "node:fs";
import path from "node:path";
import { byDate, seasonLabel, type Match } from "./core";

const DATA = path.resolve(process.cwd(), "data");

export interface League {
  slug: string;
  name: string;
  short: string;
  country: string;
  flag: string;
  since: number;
  /** Temporada que vira o ano, mostrada como "2019/20". */
  split?: boolean;
  /** Nome feminino ("da Premier League"). */
  fem?: boolean;
}

/** Escolhe a forma masculina ou feminina conforme a liga: g(lg, "do", "da"). */
export const g = (lg: { fem?: boolean }, masc: string, fem: string) => (lg.fem ? fem : masc);

export interface Club {
  slug: string;
  name: string;
  state: string;
  aliases: string[];
  names?: { name: string; from?: number; to?: number }[];
}

/** CSV no formato do módulo csv do Python (aspas duplas, "" para aspas literais). */
export function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') (field += '"'), i++;
      else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") row.push(field), (field = "");
    else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(field), rows.push(row), (row = []), (field = "");
    } else field += ch;
  }
  if (field || row.length) row.push(field), rows.push(row);
  const [cols, ...body] = rows;
  return body.filter((r) => r.length > 1).map((r) => Object.fromEntries(cols.map((c, i) => [c, r[i] ?? ""])));
}

export const leagues: League[] = JSON.parse(fs.readFileSync(path.join(DATA, "leagues.json"), "utf-8"));
export const clubs: Club[] = JSON.parse(fs.readFileSync(path.join(DATA, "clubs.json"), "utf-8"));
const clubBySlug = new Map(clubs.map((c) => [c.slug, c]));

export function club(slug: string): Club {
  const c = clubBySlug.get(slug);
  if (!c) throw new Error(`Clube desconhecido: ${slug}`);
  return c;
}

/** Nome do clube na época do jogo (ex.: Atlético-PR até 2018). */
export function clubName(slug: string, season?: number): string {
  const c = club(slug);
  if (season && c.names) {
    const n = c.names.find((x) => (x.from ?? 0) <= season && season <= (x.to ?? 9999));
    if (n) return n.name;
  }
  return c.name;
}

export function league(slug: string): League {
  const l = leagues.find((x) => x.slug === slug);
  if (!l) throw new Error(`Liga desconhecida: ${slug}`);
  return l;
}

export const seasonOf = (liga: string, season: number) => seasonLabel(season, league(liga).split);

/** Jogos de uma liga: data/matches/<liga>.csv mais arquivos extras como <liga>-historico.csv. */
function loadLeague(slug: string): Match[] {
  const dir = path.join(DATA, "matches");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".csv") && (f === `${slug}.csv` || f.startsWith(`${slug}-`)));
  return files.flatMap((f) =>
    parseCsv(fs.readFileSync(path.join(dir, f), "utf-8")).map((r) => {
      const notes = [r.note];
      if (r.pens_home) notes.push(`pênaltis ${r.pens_home}–${r.pens_away}`);
      return {
        league: r.league,
        season: Number(r.season),
        date: r.date,
        home: r.home,
        away: r.away,
        hg: Number(r.home_goals),
        ag: Number(r.away_goals),
        stage: r.stage || undefined,
        note: notes.filter(Boolean).join("; ") || undefined,
      };
    }),
  );
}

/** Todos os jogos de todas as ligas, em ordem de data. */
export const matches: Match[] = leagues.flatMap((l) => loadLeague(l.slug)).sort(byDate);

export function leagueMatches(slug: string): Match[] {
  return matches.filter((m) => m.league === slug);
}

export const lastDate = matches.length ? matches[matches.length - 1].date : "";
