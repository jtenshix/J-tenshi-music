// scripts/render-catalogo.js
const fs = require("fs");
const path = require("path");

const SRC = path.join(process.cwd(), "data", "catalogo.json");
const OUT = path.join(process.cwd(), "CATALOGO.md");

/** Escapar pipes para tablas */
const esc = (s = "") => String(s).replace(/\|/g, "\\|");

const thumb = (url, size = 90) =>
  url
    ? `<img src="${url}" alt="" width="${size}" height="${size}" style="object-fit:cover;border-radius:8px;" />`
    : "";

const toEmbed = (url = "") =>
  url.replace("watch?v=", "embed/").replace("youtu.be/", "www.youtube.com/embed/");

function render() {
  const raw = fs.readFileSync(SRC, "utf8");
  const data = JSON.parse(raw);

  const {
    banner_principal = "",
    banner_discografia = "",
    banner_videos = "",
    news = {},
    videos = [],
    discografia = { portadas: [] }
  } = data;

  const keys = Object.keys(news).sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)));

  let md = `# Catálogo (vista bonita)\n\n`;
  md += `> Generado automáticamente desde \`data/catalogo.json\`.\n\n`;

  // Banners
  md += `## Banners\n\n`;
  md += `| Tipo | URL | Vista |\n|---|---|---|\n`;
  md += `| Principal | ${esc(banner_principal)} | ${thumb(banner_principal, 120)} |\n`;
  md += `| Discografía | ${esc(banner_discografia)} | ${thumb(banner_discografia, 120)} |\n`;
  md += `| Videos | ${esc(banner_videos)} | ${thumb(banner_videos, 120)} |\n\n`;

  // News
  md += `## News (N1–N5)\n\n`;
  md += `| Clave | Destino | Título | Imagen | Preview |\n|---|---|---|---|---|\n`;
  keys.forEach(k => {
    const n = news[k] || {};
    md += `| ${k.toUpperCase()} | \`${esc(n.destino || "")}\` | ${esc(n.titulo || "")} | ${esc(
      n.imagen || ""
    )} | ${thumb(n.imagen)} |\n`;
  });
  md += `\n`;

  // Videos
  md += `## Videos\n\n`;
  md += `| # | URL | Embed |\n|---|---|---|\n`;
  videos.forEach((v, i) => {
    const emb = toEmbed(v.url || "");
    md += `| ${i + 1} | ${esc(v.url || "")} | [preview](${emb}) |\n`;
  });
  md += `\n`;

  // Discografía
  md += `## Discografía (Portadas)\n\n`;
  if (discografia.portadas?.length) {
    md += `Cantidad: **${discografia.portadas.length}**\n\n`;
    md += discografia.portadas.map(u => thumb(u, 90)).join(" ");
    md += `\n\n| # | URL |\n|---|---|\n`;
    discografia.portadas.forEach((u, i) => {
      md += `| ${i + 1} | ${esc(u)} |\n`;
    });
    md += `\n`;
  } else {
    md += `*(sin portadas)*\n\n`;
  }

  fs.writeFileSync(OUT, md, "utf8");
  console.log("CATALOGO.md generado ✓");
}

render();
