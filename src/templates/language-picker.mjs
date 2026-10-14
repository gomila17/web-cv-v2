/**
 * Partial: language-picker
 * Página raíz "/" (ARCHITECTURE.md decisión 5): elección estática de idioma, sin redirección por cabecera. Bilingüe por naturaleza: usa los nombres de facts.site.locales.
 *
 * Claves de content/<locale>.json: —
 * Datos de facts.json: facts.site
 * Dueño: integrador. Contrato completo: CONTRACTS.md §5.
 *
 * @param {object} ctx  contexto de render (forma en src/templates/README.md)
 * @returns {string} HTML
 */
// No usa t(): la página es de los dos idiomas a la vez, así que cada enlace lleva su lang.
// <html lang> es el idioma por defecto del sitio; canonical y x-default apuntan aquí.
export default function render(ctx) {
  const { esc, facts, paths } = ctx;
  const { site, person } = facts;
  const abs = (p) => esc(site.url.replace(/\/+$/, '') + p);
  const alternates = site.locales.map((l) => `<link rel="alternate" hreflang="${esc(l.code)}" href="${abs(l.path)}">`).join('\n');
  const choices = site.locales.map((l, i) => `    <li><a class="btn${i === 0 ? ' primary' : ''}" href="${esc(l.path)}" hreflang="${esc(l.code)}" lang="${esc(l.code)}">${esc(l.name)}</a></li>`).join('\n');
  return `<!doctype html>
<html lang="${esc(site.defaultLocale)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(person.tagline)}</title>
<meta name="description" content="${esc(person.fullName)} · ${esc(person.role)} · ${esc(person.city)}">
<meta name="color-scheme" content="light dark">
<link rel="icon" href="${paths.asset('assets/logo.svg')}" type="image/svg+xml">
<link rel="canonical" href="${abs('/')}">
${alternates}
<link rel="alternate" hreflang="x-default" href="${abs('/')}">
<link rel="stylesheet" href="${paths.asset('styles.css')}">
</head>
<body>
<main class="picker">
  <span class="mark" aria-hidden="true">tg</span>
  <h1>${esc(person.name)}</h1>
  <p>${esc(person.role)} · ${esc(person.city)}</p>
  <ul class="links">
${choices}
  </ul>
</main>
</body>
</html>
`;
}
