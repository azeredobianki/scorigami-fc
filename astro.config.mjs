import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://scorigamifc.com",
  trailingSlash: "ignore",
  // A prévia (PUBLIC_PREVIEW=1) gera arquivos .html soltos, sem URLs bonitas.
  // Na prévia, "_" no início de pastas é reservado pela hospedagem, então os assets vão para "assets/".
  build:
    process.env.PUBLIC_PREVIEW === "1" ? { format: "file", assets: "assets" } : { format: "directory" },
});
