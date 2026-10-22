// Contexto de renderização do build.
import { clubName, lastDate, league, leagues, seasonOf } from "./data";
import { t, type Lang } from "./i18n";
import type { Ctx } from "./render";

export function serverCtx(linkLeague = leagues[0].slug, lang: Lang = "pt"): Ctx {
  return {
    clubName,
    leagueName: (slug) => league(slug).short,
    linkLeague,
    today: lastDate,
    season: seasonOf,
    lang,
    t: t(lang),
  };
}
