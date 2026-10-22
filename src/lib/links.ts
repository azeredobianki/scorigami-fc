// Monta os links internos. No site normal, "/brasileirao/placar/3-2" (em inglês,
// "/en/brasileirao/placar/3-2"). Na prévia (PUBLIC_PREVIEW=1, hospedagem sem URLs
// bonitas), vira "brasileirao/placar/3-2.html", resolvido pela tag <base> de cada página.
import type { Lang } from "./i18n";

export const PREVIEW = import.meta.env.PUBLIC_PREVIEW === "1";

/** Caminho sem idioma ("sobre") para o idioma pedido. O português fica na raiz. */
export function href(path: string, lang: Lang = "pt"): string {
  const full = lang === "pt" ? path : path ? `${lang}/${path}` : lang;
  if (!PREVIEW) return `/${full}`;
  const i = full.search(/[?#]/);
  const page = i < 0 ? full : full.slice(0, i);
  const suffix = i < 0 ? "" : full.slice(i);
  // A home em inglês sai como "en.html" (e não "en/index.html").
  return `${page || "index"}.html${suffix}`;
}

export const dataUrl = PREVIEW ? "data/matches.json" : "/data/matches.json";

/** Caminho relativo até a raiz, para a tag <base> da prévia. */
export function previewBase(pathname: string): string | undefined {
  if (!PREVIEW) return undefined;
  const depth = pathname.split("/").filter(Boolean).length - 1;
  return depth > 0 ? "../".repeat(depth) : "./";
}

// Páginas de temporada, placar e time. A prévia tem limite de arquivos, então
// lá cada tipo é uma página só, desenhada no navegador a partir da query.
export const seasonHref = (lang: Lang, liga: string, season: number) =>
  href(PREVIEW ? `temporada?liga=${liga}&ano=${season}` : `${liga}/scorigamis/${season}`, lang);
export const scorePageHref = (lang: Lang, liga: string, key: string) =>
  href(PREVIEW ? `placar?liga=${liga}&p=${key}` : `${liga}/placar/${key}`, lang);
export const clubPageHref = (lang: Lang, liga: string, slug: string) =>
  href(PREVIEW ? `time?liga=${liga}&t=${slug}` : `${liga}/time/${slug}`, lang);
