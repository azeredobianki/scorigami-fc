// Monta os links internos. No site normal, "/brasileirao/placar/3-2".
// Na prévia (PUBLIC_PREVIEW=1, hospedagem sem URLs bonitas), vira
// "brasileirao/placar/3-2.html", resolvido pela tag <base> de cada página.
const PREVIEW = import.meta.env.PUBLIC_PREVIEW === "1";

export function href(path: string): string {
  if (!PREVIEW) return `/${path}`;
  const i = path.search(/[?#]/);
  const page = i < 0 ? path : path.slice(0, i);
  const suffix = i < 0 ? "" : path.slice(i);
  return `${page || "index"}.html${suffix}`;
}

export const dataUrl = PREVIEW ? "data/matches.json" : "/data/matches.json";

/** Caminho relativo até a raiz, para a tag <base> da prévia. */
export function previewBase(pathname: string): string | undefined {
  if (!PREVIEW) return undefined;
  const depth = pathname.split("/").filter(Boolean).length - 1;
  return depth > 0 ? "../".repeat(depth) : "./";
}
