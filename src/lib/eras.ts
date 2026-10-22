// Recortes de tempo oferecidos no filtro de era.
export interface Era {
  id: string;
  label: string;
  from: number;
  to: number;
}

import { t, type Lang } from "./i18n";

// Fases de cada liga; sem liga escolhida, só as décadas.
const PHASES: Record<string, { id: string; label: string; from: number; to?: number }[]> = {
  brasileirao: [
    { id: "pontos-corridos", label: "Pontos corridos (2003–)", from: 2003 },
    { id: "1971-2002", label: "Mata-mata nacional (1971–2002)", from: 1971, to: 2002 },
    { id: "1959-1970", label: "Taça Brasil e Robertão (1959–1970)", from: 1959, to: 1970 },
  ],
  "premier-league": [
    { id: "premier-league", label: "Premier League (1992/93–)", from: 1992 },
    { id: "first-division", label: "First Division (1888/89–1991/92)", from: 1888, to: 1991 },
  ],
  "ligue-1": [
    { id: "ligue-1", label: "Ligue 1 (2002/03–)", from: 2002 },
    { id: "division-1", label: "Division 1 (1938/39–2001/02)", from: 1938, to: 2001 },
  ],
  "primera-argentina": [
    { id: "profissional", label: "Profissionalismo (1931–)", from: 1931 },
    { id: "amador", label: "Amadorismo (1891–1930)", from: 1891, to: 1930 },
  ],
  "liga-mx": [
    { id: "torneios-curtos", label: "Torneios curtos (1996/97–)", from: 1996 },
    { id: "temporadas-longas", label: "Temporadas longas (1943/44–1995/96)", from: 1943, to: 1995 },
  ],
};

export function eras(seasons: number[], liga = "", lang: Lang = "pt"): Era[] {
  const T = t(lang);
  if (!seasons.length) return [];
  const min = Math.min(...seasons);
  const max = Math.max(...seasons);
  const list: Era[] = [
    { id: "todas", label: T.allEras, from: min, to: max },
    ...(PHASES[liga] ?? []).map((p) => ({ id: p.id, label: T.phases[p.id] ?? p.label, from: p.from, to: p.to ?? max })),
  ];
  for (let d = Math.floor(min / 10) * 10; d <= max; d += 10) {
    list.push({ id: `${d}s`, label: T.decade(d), from: d, to: d + 9 });
  }
  // Só mostra recortes que têm jogos e que não repetem o "todas".
  return list.filter(
    (e, i) => i === 0 || (seasons.some((s) => s >= e.from && s <= e.to) && !(e.from <= min && e.to >= max)),
  );
}
