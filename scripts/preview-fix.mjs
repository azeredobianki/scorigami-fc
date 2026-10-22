// Prévia: troca caminhos absolutos dos assets por relativos à tag <base>.
import fs from "node:fs";
import path from "node:path";

const root = process.argv[2] ?? "dist-preview";
const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));
let n = 0;
for (const file of walk(root).filter((f) => f.endsWith(".html"))) {
  const html = fs.readFileSync(file, "utf-8");
  const fixed = html.replaceAll('="/assets/', '="assets/');
  if (fixed !== html) fs.writeFileSync(file, fixed), n++;
}
console.log(`preview-fix: ${n} páginas ajustadas`);
