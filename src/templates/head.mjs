/**
 * Partial: head
 * <head>: charset, viewport, <title>, meta description, color-scheme y theme-color (claro/oscuro), favicon SVG,
 * canonical, hreflang (es, en, x-default → "/"), Open Graph y Twitter card (imagen absoluta /og.png 1200×627),
 * JSON-LD (@graph con Person y WebSite) y el script inline src/scripts/head.js.
 *
 * Claves de content/<locale>.json: t.title, t.desc (y las de facts.stack.daily con {i18n}, para knowsAbout)
 * Datos de facts.json: facts.person, facts.site, facts.links, facts.career, facts.stack, facts.certifications, facts.education
 * Dueño: SEO. Contrato completo: CONTRACTS.md §5.
 *
 * SEO (ARCHITECTURE.md, sección SEO): hay un homónimo famoso, así que todo desambigua con
 * "Toni Gomila · Backend Developer" (facts.person.tagline). El JSON-LD Person es la señal más clara.
 *
 * @param {object} ctx  contexto de render (forma en src/templates/README.md)
 * @returns {string} HTML
 */

// Valores de tokens.css (--bg claro y oscuro). Literales a propósito: theme-color es un atributo del
// navegador, no CSS, y no puede leer var(--bg). Si cambia --bg en tokens.css, cambiar aquí también.
const THEME_LIGHT = '#EDEDED';
const THEME_DARK = '#0d1117';

// Tarjeta para compartir (ARCHITECTURE.md decisión 11: imagen estática en src/static/og.png).
// 1200×627 es la proporción que recomienda LinkedIn; Open Graph y X la aceptan.
const OG_IMAGE = { path: '/og.png', width: 1200, height: 627 };

// og:locale usa el formato idioma_TERRITORIO. Inglés británico porque el CV está escrito así.
const OG_LOCALE = { es: 'es_ES', en: 'en_GB', ca: 'ca_ES' };

// Sin marcado y sin entidades: texto plano para atributos (luego esc()) y para JSON.
const strip = (html) => String(html).replace(/<[^>]*>/g, '')
  .replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
  .replace(/&#39;/g, "'").replace(/&amp;/g, '&');

// JSON dentro de <script type="application/ld+json">: el contenido de <script> no se escapa como HTML,
// así que "</script>" o "<!--" en un dato cerrarían el bloque. Se escapan <, > y & como \u00XX (JSON
// válido, mismo valor), y U+2028/U+2029 por compatibilidad con analizadores de JavaScript antiguos.
const jsonForScript = (value) => JSON.stringify(value, null, 2)
  .replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026')
  .replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');

/** Datos estructurados schema.org: Person + WebSite, enlazados por @id. Todo sale de facts. */
function structuredData(ctx, { siteUrl, pageUrl, title, desc }) {
  const { facts, locale } = ctx;
  const { person, links, career, stack, certifications = [], education = [] } = facts;
  const personId = `${siteUrl}/#person`;
  const text = (item) => (typeof item === 'string' ? item : strip(ctx.t(item.i18n)));
  const unique = (list) => [...new Set(list)];

  const personNode = {
    '@type': 'Person',
    '@id': personId,
    name: person.name,
    alternateName: unique([`${person.givenName} ${person.familyName}`, strip(person.fullName)]),
    givenName: person.givenName,
    familyName: person.familyName,
    jobTitle: person.role,
    description: desc,
    url: pageUrl,
    image: `${siteUrl}/assets/foto.jpg`,
    email: `mailto:${person.email}`,
    address: { '@type': 'PostalAddress', addressLocality: person.city, addressCountry: 'ES' },
    // Stack de uso diario: lo que de verdad le asocia a "backend Java".
    knowsAbout: unique(stack.daily.map(text)),
    sameAs: [links.linkedin, links.github],
    worksFor: { '@type': 'Organization', name: career.company },
    alumniOf: education.map((e) => ({
      '@type': 'EducationalOrganization',
      name: e.school,
      address: { '@type': 'PostalAddress', addressLocality: e.city, addressCountry: 'ES' },
    })),
    hasCredential: certifications.map((c) => ({
      '@type': 'EducationalOccupationalCredential',
      name: c.name,
      credentialCategory: 'certificate',
      dateCreated: c.date,
      url: c.verifyUrl,
      recognizedBy: { '@type': 'Organization', name: c.issuer },
    })),
  };
  const siteNode = {
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    url: `${siteUrl}/`,
    name: person.tagline,
    alternateName: person.name,
    description: desc,
    inLanguage: facts.site.locales.map((l) => l.code),
    author: { '@id': personId },
    publisher: { '@id': personId },
  };
  const pageNode = {
    '@type': 'ProfilePage',
    '@id': `${pageUrl}#page`,
    url: pageUrl,
    name: title,
    inLanguage: locale,
    isPartOf: { '@id': siteNode['@id'] },
    mainEntity: { '@id': personId },
  };
  return { '@context': 'https://schema.org', '@graph': [personNode, siteNode, pageNode] };
}

export default function render(ctx) {
  const { esc, facts, paths, locale, headScript } = ctx;
  const { site, person } = facts;
  const siteUrl = site.url.replace(/\/+$/, '');
  const pageUrl = siteUrl + paths.home;
  const title = strip(ctx.t('t.title'));
  const desc = strip(ctx.t('t.desc'));
  const image = siteUrl + OG_IMAGE.path;
  const imageAlt = `${person.tagline} · ${siteUrl.replace(/^https?:\/\//, '')}`;
  const ogLocale = OG_LOCALE[locale] ?? locale;

  const alternates = site.locales
    .map((l) => `<link rel="alternate" hreflang="${esc(l.code)}" href="${esc(siteUrl + l.path)}">`)
    .join('\n');
  const ogAlternates = site.locales
    .filter((l) => l.code !== locale)
    .map((l) => `<meta property="og:locale:alternate" content="${esc(OG_LOCALE[l.code] ?? l.code)}">`)
    .join('\n');
  // head.js va inline y antes de pintar (fija el tema sin parpadeo). "</" se rompe por si acaso.
  const script = headScript ? `\n<script>${headScript}</script>` : '';

  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="author" content="${esc(person.name)}">
<meta name="robots" content="index, follow">
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="${THEME_LIGHT}" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="${THEME_DARK}" media="(prefers-color-scheme: dark)">
<link rel="icon" href="${paths.asset('favicon.svg')}" type="image/svg+xml">
<link rel="icon" href="${paths.asset('favicon-48.png')}" type="image/png" sizes="48x48">
<link rel="icon" href="/favicon.ico" sizes="32x32 48x48">
<link rel="apple-touch-icon" href="${paths.asset('apple-touch-icon.png')}">
<link rel="canonical" href="${esc(pageUrl)}">
${alternates}
<link rel="alternate" hreflang="x-default" href="${esc(siteUrl + '/')}">
<meta property="og:type" content="profile">
<meta property="og:site_name" content="${esc(person.tagline)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${esc(pageUrl)}">
<meta property="og:locale" content="${esc(ogLocale)}">
${ogAlternates}
<meta property="og:image" content="${esc(image)}">
<meta property="og:image:type" content="image/png">
<meta property="og:image:width" content="${OG_IMAGE.width}">
<meta property="og:image:height" content="${OG_IMAGE.height}">
<meta property="og:image:alt" content="${esc(imageAlt)}">
<meta property="profile:first_name" content="${esc(person.givenName)}">
<meta property="profile:last_name" content="${esc(person.familyName)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${esc(image)}">
<meta name="twitter:image:alt" content="${esc(imageAlt)}">
<script type="application/ld+json">
${jsonForScript(structuredData(ctx, { siteUrl, pageUrl, title, desc }))}
</script>${script}`;
}
