// Dica que acompanha o mouse sobre as casas do gráfico.
export function initTooltip() {
  const tip = document.createElement("div");
  tip.className = "tip";
  tip.setAttribute("role", "tooltip");
  tip.hidden = true;
  document.body.append(tip);

  const show = (cell: HTMLElement, x: number, y: number) => {
    const key = cell.dataset.k!.replace("-", "–");
    tip.innerHTML = `<b>${key}</b><span>${cell.dataset.tip ?? ""}</span>`;
    tip.hidden = false;
    const r = tip.getBoundingClientRect();
    const left = Math.min(Math.max(8, x - r.width / 2), window.innerWidth - r.width - 8);
    const top = y - r.height - 14 < 8 ? y + 18 : y - r.height - 14;
    tip.style.transform = `translate(${left}px, ${top}px)`;
  };

  document.addEventListener("pointermove", (e) => {
    const cell = (e.target as Element).closest?.<HTMLElement>("[data-tip]");
    if (cell && e.pointerType === "mouse") show(cell, e.clientX, e.clientY);
    else tip.hidden = true;
  });
  document.addEventListener("focusin", (e) => {
    const cell = (e.target as Element).closest?.<HTMLElement>("[data-tip]");
    if (!cell) return;
    const r = cell.getBoundingClientRect();
    show(cell, r.left + r.width / 2, r.top);
  });
  document.addEventListener("focusout", () => (tip.hidden = true));
  document.addEventListener("scroll", () => (tip.hidden = true), { passive: true });
}
