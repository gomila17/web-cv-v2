/**
 * Partial: layout
 * Esqueleto de página: <html lang>, head(ctx), enlace de salto, header, <main id="main"> con las secciones en el orden de DESIGN.md §4, footer y botón volver arriba. Carga /styles.css y /main.js.
 *
 * Claves de content/<locale>.json: skip
 * Datos de facts.json: facts.site
 * Dueño: integrador. Contrato completo: CONTRACTS.md §5.
 *
 * @param {object} ctx  contexto de render (forma en src/templates/README.md)
 * @returns {string} HTML
 */
import head from './head.mjs';
import header from './header.mjs';
import hero from './hero.mjs';
import about from './about.mjs';
import pillars from './pillars.mjs';
import experience from './experience.mjs';
import project from './project.mjs';
import homelab from './homelab.mjs';
import stack from './stack.mjs';
import education from './education.mjs';
import footer from './footer.mjs';
import totop from './totop.mjs';

// Orden de DESIGN.md §4. Un partial que devuelve '' (aún sin hacer) no deja hueco.
const SECTIONS = [hero, about, pillars, experience, project, homelab, stack, education];
const join = (parts) => parts.filter(Boolean).join('\n');

export default function render(ctx) {
  const { t, locale, paths } = ctx;
  return `<!doctype html>
<html lang="${locale}">
<head>
${head(ctx)}
<link rel="stylesheet" href="${paths.asset('styles.css')}">
<script src="${paths.asset('main.js')}" defer></script>
</head>
<body>
<a class="skip" href="#main">${t('skip')}</a>
${header(ctx)}
<main id="main">
${join(SECTIONS.map((section) => section(ctx)))}
</main>
${join([footer(ctx), totop(ctx)])}
</body>
</html>
`;
}
