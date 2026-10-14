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
  const { esc, facts, paths, headScript } = ctx;
  const { site, person } = facts;
  const abs = (p) => esc(site.url.replace(/\/+$/, '') + p);
  const alternates = site.locales.map((l) => `<link rel="alternate" hreflang="${esc(l.code)}" href="${abs(l.path)}">`).join('\n');
  const choices = site.locales.map((l, i) => `    <li><a class="btn${i === 0 ? ' primary' : ''}" href="${esc(l.path)}" hreflang="${esc(l.code)}" lang="${esc(l.code)}">${esc(l.name)}</a></li>`).join('\n');
  return `<!doctype html>
<html lang="${esc(site.defaultLocale)}" data-lang-redirect>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(person.tagline)}</title>
<meta name="description" content="${esc(person.fullName)} · ${esc(person.role)} · ${esc(person.city)}">
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#EDEDED" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0d1117" media="(prefers-color-scheme: dark)">
<link rel="icon" href="${paths.asset('favicon.svg')}" type="image/svg+xml">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(person.tagline)}">
<meta property="og:url" content="${abs('/')}">
<meta property="og:image" content="${abs('/og.png')}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="627">
<meta name="twitter:card" content="summary_large_image">${headScript ? `\n<script>${headScript.replace(/<\//g, '<\\/')}</script>` : ''}
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
