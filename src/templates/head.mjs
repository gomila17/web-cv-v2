/**
 * Partial: head
 * <head>: charset, viewport, <title>, meta description, color-scheme, canonical, hreflang (es, en, x-default), Open Graph/tarjeta, JSON-LD Person (name, alternateName, jobTitle, knowsAbout, address Barcelona, sameAs LinkedIn/GitHub) y el script inline src/scripts/head.js.
 *
 * Claves de content/<locale>.json: t.*
 * Datos de facts.json: facts.person, facts.links, facts.site
 * Dueño: SEO. Contrato completo: CONTRACTS.md §5.
 *
 * @param {object} ctx  contexto de render (forma en src/templates/README.md)
 * @returns {string} HTML
 */
// Hecho en la prueba del generador: charset, viewport, title, description, color-scheme, icono,
// canonical y hreflang. Pendiente (SEO): Open Graph/tarjeta, JSON-LD y el script inline head.js.

// t() devuelve HTML de confianza; en <title> y en atributos se quita el marcado y se escapa.
const plain = (ctx, key) => ctx.esc(ctx.t(key).replace(/<[^>]*>/g, ''));

export default function render(ctx) {
  const { esc, facts, paths } = ctx;
  const abs = (p) => esc(facts.site.url.replace(/\/+$/, '') + p);
  const alternates = facts.site.locales
    .map((l) => `<link rel="alternate" hreflang="${esc(l.code)}" href="${abs(l.path)}">`)
    .join('\n');
  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${plain(ctx, 't.title')}</title>
<meta name="description" content="${plain(ctx, 't.desc')}">
<meta name="color-scheme" content="light dark">
<link rel="icon" href="${paths.asset('assets/logo.svg')}" type="image/svg+xml">
<link rel="canonical" href="${abs(paths.home)}">
${alternates}
<link rel="alternate" hreflang="x-default" href="${abs('/')}">`;
}
