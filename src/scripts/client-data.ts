// Carrega a base compacta e monta o contexto de renderização no navegador.
import type { Match } from "../lib/core";
import { dataUrl } from "../lib/links";
import type { Ctx } from "../lib/render";

interface Raw {
  leagues: { slug: string; name: string }[];
  clubs: { slug: string; name: string; names?: { name: string; from?: number; to?: number }[] }[];
  matches: [number, number, string, number, number, number, number][];
}

export interface ClientData {
  leagues: Raw["leagues"];
  clubs: Raw["clubs"];
  matches: Match[];
  ctx: (linkLeague: string) => Ctx;
}

export async function loadData(): Promise<ClientData> {
  const raw: Raw = await (await fetch(dataUrl)).json();
  const matches: Match[] = raw.matches.map(([l, season, date, h, a, hg, ag]) => ({
    league: raw.leagues[l].slug,
    season,
    date,
    home: raw.clubs[h].slug,
    away: raw.clubs[a].slug,
    hg,
    ag,
  }));
  const bySlug = new Map(raw.clubs.map((c) => [c.slug, c]));
  const clubName = (slug: string, season?: number) => {
    const c = bySlug.get(slug);
    if (!c) return slug;
    const n = season && c.names?.find((x) => (x.from ?? 0) <= season && season <= (x.to ?? 9999));
    return n ? n.name : c.name;
  };
  const leagueName = (slug: string) => raw.leagues.find((l) => l.slug === slug)?.name ?? slug;
  const today = matches.length ? matches[matches.length - 1].date : "";
  return {
    leagues: raw.leagues,
    clubs: raw.clubs,
    matches,
    ctx: (linkLeague) => ({ clubName, leagueName, linkLeague, today }),
  };
}
