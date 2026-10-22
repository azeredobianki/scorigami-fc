// Contexto de renderização do build.
import { clubName, lastDate, league, leagues } from "./data";
import type { Ctx } from "./render";

export function serverCtx(linkLeague = leagues[0].slug): Ctx {
  return {
    clubName,
    leagueName: (slug) => league(slug).short,
    linkLeague,
    today: lastDate,
  };
}
