/**
 * Partial: not-found
 * Página 404 de cada idioma (dist/es/404.html, dist/en/404.html). Nginx sirve la del idioma de la ruta
 * pedida (deploy/nginx.conf). Sin canonical ni datos estructurados, y con noindex.
 *
 * Claves de content/<locale>.json: nf.t, nf.p, nf.home, skip
 * Datos de facts.json: facts.person
 * Dueño: integrador. Contrato completo: CONTRACTS.md §5.
 *
 * @param {object} ctx  contexto de render (forma en src/templates/README.md)
 * @returns {string} HTML
 */
import header from './header.mjs';

export default function render(ctx) {
  const { t, esc, facts, locale, paths, headScript } = ctx;
  const script = headScript ? `\n<script>${headScript.replace(/<\//g, '<\/')}</script>` : '';
  return `<!doctype html>
<html lang="${esc(locale)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${t('nf.t')} · ${esc(facts.person.name)}</title>
<meta name="robots" content="noindex">
<meta name="color-scheme" content="light dark">
<link rel="icon" href="${paths.asset('favicon.svg')}" type="image/svg+xml">${script}
<link rel="stylesheet" href="${paths.asset('styles.css')}">
<script src="${paths.asset('main.js')}" defer></script>
</head>
<body>
<a class="skip" href="#main">${t('skip')}</a>
${header(ctx)}
<main id="main" class="nf">
  <div class="wrap">
    <p class="nf-code" aria-hidden="true">404</p>
    <h1>${t('nf.t')}</h1>
    <p>${t('nf.p')}</p>
    <a class="btn primary" href="${esc(paths.home)}">${t('nf.home')}</a>
  </div>
</main>
</body>
</html>
`;
}
