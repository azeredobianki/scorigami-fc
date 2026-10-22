// Parâmetros das páginas dinâmicas. Cada idioma tem as mesmas páginas: o
// português na raiz e o inglês e o espanhol em /en/ e /es/ (ver src/pages).
import { leagueMatches, leagues, matches } from "./data";
import { PREVIEW } from "./links";
import { ALL, scoreKeys } from "./pages";

const perLeague = () => leagues.map((l) => ({ params: { liga: l.slug } }));

export const paths = {
  leagueScorigamis: perLeague,
  teams: perLeague,
  season: () =>
    PREVIEW
      ? []
      : leagues.flatMap((l) => [...new Set(leagueMatches(l.slug).map((m) => m.season))].map((s) => ({ params: { liga: l.slug, ano: String(s) } }))),
  // Uma página por placar em cada liga, mais "todas" (o filtro Geral da home).
  score: () =>
    PREVIEW
      ? []
      : [
          ...leagues.flatMap((l) => scoreKeys(leagueMatches(l.slug)).map((placar) => ({ params: { liga: l.slug, placar } }))),
          ...scoreKeys(matches).map((placar) => ({ params: { liga: ALL.slug, placar } })),
        ],
  club: () =>
    PREVIEW
      ? []
      : leagues.flatMap((l) =>
          [...new Set(leagueMatches(l.slug).flatMap((m) => [m.home, m.away]))].map((slug) => ({ params: { liga: l.slug, slug } })),
        ),
  // Na prévia, temporada, placar e time são uma página só de cada tipo, desenhada no navegador.
  detail: () => (PREVIEW ? ["temporada", "placar", "time"].map((detail) => ({ params: { detail } })) : []),
};
