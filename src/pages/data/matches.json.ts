// Base compacta para os filtros da home e o time-lapse no navegador.
import { clubs, leagues, matches } from "../../lib/data";

export function GET() {
  const clubIndex = new Map(clubs.map((c, i) => [c.slug, i]));
  const leagueIndex = new Map(leagues.map((l, i) => [l.slug, i]));
  const body = {
    leagues: leagues.map((l) => ({ slug: l.slug, name: l.short, split: !!l.split, fem: !!l.fem })),
    clubs: clubs.map((c) => ({ slug: c.slug, name: c.name, names: c.names })),
    // [liga, temporada, data, mandante, visitante, gols mandante, gols visitante]
    matches: matches.map((m) => [
      leagueIndex.get(m.league),
      m.season,
      m.date,
      clubIndex.get(m.home),
      clubIndex.get(m.away),
      m.hg,
      m.ag,
    ]),
  };
  return new Response(JSON.stringify(body), { headers: { "Content-Type": "application/json" } });
}
