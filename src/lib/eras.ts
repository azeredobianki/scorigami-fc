// Recortes de tempo oferecidos no filtro de era.
export interface Era {
  id: string;
  label: string;
  from: number;
  to: number;
}

export function eras(seasons: number[]): Era[] {
  if (!seasons.length) return [];
  const min = Math.min(...seasons);
  const max = Math.max(...seasons);
  const list: Era[] = [
    { id: "todas", label: "Todas as eras", from: min, to: max },
    { id: "pontos-corridos", label: "Pontos corridos (2003–)", from: 2003, to: max },
    { id: "1971-2002", label: "Mata-mata nacional (1971–2002)", from: 1971, to: 2002 },
    { id: "1959-1970", label: "Taça Brasil e Robertão (1959–1970)", from: 1959, to: 1970 },
  ];
  for (let d = Math.floor(min / 10) * 10; d <= max; d += 10) {
    list.push({ id: `${d}s`, label: `Anos ${String(d).slice(2)} (${d}–${d + 9})`, from: d, to: d + 9 });
  }
  // Só mostra recortes que têm jogos e que não repetem o "todas".
  return list.filter(
    (e, i) => i === 0 || (seasons.some((s) => s >= e.from && s <= e.to) && !(e.from <= min && e.to >= max)),
  );
}
