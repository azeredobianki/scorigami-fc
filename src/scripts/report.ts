// Envio do formulário "Solicitar ajuste". Na prévia, os pedidos ficam no banco do
// Artifact (só o dono lê). No site publicado, vão para PUBLIC_REPORT_ENDPOINT (um
// serviço de formulários que recebe JSON por POST, como Formspree ou um Worker).
import { PREVIEW } from "../lib/links";

const ENDPOINT = import.meta.env.PUBLIC_REPORT_ENDPOINT as string | undefined;

interface Db {
  collection(path: string): {
    add(data: Record<string, unknown>): Promise<unknown>;
    doc(id: string): { set(data: Record<string, unknown>): Promise<void> };
  };
}
interface User {
  id(): Promise<string>;
}
type ClaudeUse = { use(name: "db"): Promise<Db | null>; use(name: "user"): Promise<User | null> };

async function saveInPreview(report: Record<string, string>): Promise<boolean> {
  const claude = (window as unknown as { claude?: ClaudeUse }).claude;
  if (!claude) return false;
  const [db, user] = await Promise.all([claude.use("db"), claude.use("user")]);
  if (!db || !user) return false;
  const uid = await user.id();
  // Cada visitante escreve só na própria pasta; só o dono do site lê todas.
  const now = new Date().toISOString();
  await db.collection(`ajustes/${uid}/pedidos`).add({ ...report, enviadoEm: now });
  // Documento da pasta do visitante, para que a lista "ajustes" mostre quem enviou.
  await db.collection("ajustes").doc(uid).set({ ultimoEnvio: now });
  return true;
}

export function initReport() {
  const form = document.getElementById("report") as HTMLFormElement;
  const status = document.getElementById("report-status")!;
  const field = (n: string) => form.elements.namedItem(n) as HTMLInputElement;
  const q = new URLSearchParams(location.search);
  field("pagina").value = q.get("pagina") ?? document.referrer;
  if (q.get("liga")) field("liga").value = q.get("liga")!;
  if (q.get("jogo")) field("jogo").value = q.get("jogo")!;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const button = form.querySelector("button")!;
    const report = Object.fromEntries([...new FormData(form).entries()].map(([k, v]) => [k, String(v).trim()]));
    button.disabled = true;
    status.textContent = "Enviando…";
    try {
      let ok = false;
      if (PREVIEW) ok = await saveInPreview(report);
      else if (ENDPOINT) {
        const res = await fetch(ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(report),
        });
        ok = res.ok;
      }
      if (ok) {
        form.reset();
        status.textContent = "Recebido, obrigado. Vamos conferir com as fontes.";
      } else {
        status.textContent = "Não deu para enviar daqui. Mande pelo X: @ScorigamiFC.";
      }
    } catch {
      status.textContent = "Não deu para enviar agora. Tente de novo ou mande pelo X: @ScorigamiFC.";
    } finally {
      button.disabled = false;
    }
  });
}
