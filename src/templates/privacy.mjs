/**
 * Partial: privacy
 * Página "Privacidad y cookies" de cada idioma (dist/es/privacidad/, dist/en/privacy/): qué guarda la web en el
 * navegador, qué registra el servidor, derechos RGPD. Con noindex, canonical y hreflang; fuera del sitemap.
 * Sin aviso de cookies a propósito (solo hay cookies de personalización pedidas por el visitante): si alguna vez
 * se añade analítica o contenido de terceros, esta página y ese criterio hay que revisarlos (CONTRACTS.md §8).
 *
 * Claves de content/<locale>.json: pv.*, skip
 * Datos de facts.json: facts.person, facts.site
 * Dueño: integrador. Contrato completo: CONTRACTS.md §5 y §8.
 *
 * @param {object} ctx  contexto de render; paths.home es la portada del idioma y paths.alternates las dos versiones de esta página
 * @returns {string} HTML
 */
import header from './header.mjs';

const CLOUDFLARE_PRIVACY = 'https://www.cloudflare.com/privacypolicy/';
const AEPD = 'https://www.aepd.es';

export default function render(ctx) {
  const { t, esc, facts, locale, paths, headScript } = ctx;
  const siteUrl = facts.site.url.replace(/\/+$/, '');
  const script = headScript ? `\n<script>${headScript}</script>` : '';
  const mail = `<a href="mailto:${esc(facts.person.email)}">${esc(facts.person.email)}</a>`;
  const ext = (href, label) => `<a href="${esc(href)}" rel="noopener">${label}</a>`;
  const alternates = facts.site.locales
    .map((l) => `<link rel="alternate" hreflang="${esc(l.code)}" href="${esc(siteUrl + paths.alternates[l.code])}">`).join('\n');
  const stored = ['i1', 'i2'].map((id, n) => `      <li class="pv-item">
        <h3><code>${n === 0 ? 'tg_lang' : 'tg-theme'}</code></h3>
        <dl>
          <dt>${t('pv.dl.kind')}</dt><dd>${t(`pv.${id}.kind`)}</dd>
          <dt>${t('pv.dl.what')}</dt><dd>${t(`pv.${id}.what`)}</dd>
          <dt>${t('pv.dl.when')}</dt><dd>${t(`pv.${id}.when`)}</dd>
          <dt>${t('pv.dl.dur')}</dt><dd>${t(`pv.${id}.dur`)}</dd>
        </dl>
      </li>`).join('\n');
  return `<!doctype html>
<html lang="${esc(locale)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${t('pv.t')} · ${esc(facts.person.name)}</title>
<meta name="robots" content="noindex, follow">
<meta name="color-scheme" content="light dark">
<link rel="icon" href="${paths.asset('favicon.svg')}" type="image/svg+xml">
<link rel="icon" href="${paths.asset('favicon-48.png')}" type="image/png" sizes="48x48">
<link rel="icon" href="/favicon.ico" sizes="32x32 48x48">
<link rel="apple-touch-icon" href="${paths.asset('apple-touch-icon.png')}">
<link rel="canonical" href="${esc(siteUrl + paths.alternates[locale])}">
${alternates}${script}
<link rel="stylesheet" href="${paths.asset('styles.css')}">
<script src="${paths.asset('main.js')}" defer></script>
</head>
<body>
<a class="skip" href="#main">${t('skip')}</a>
${header({ ...ctx, linkBase: paths.home })}
<main id="main" class="pv">
  <div class="wrap">
    <h1>${t('pv.t')}</h1>
    <p class="pv-lead">${t('pv.lead')}</p>
    <p class="pv-upd">${t('pv.upd')}</p>

    <section aria-labelledby="pv-s1">
      <h2 id="pv-s1">${t('pv.s1.t')}</h2>
      <p>${t('pv.s1.p')} ${mail}.</p>
    </section>

    <section aria-labelledby="pv-s2">
      <h2 id="pv-s2">${t('pv.s2.t')}</h2>
      <p>${t('pv.s2.p1')}</p>
      <ul class="pv-items">
${stored}
      </ul>
      <p>${t('pv.s2.p2')}</p>
    </section>

    <section aria-labelledby="pv-s3">
      <h2 id="pv-s3">${t('pv.s3.t')}</h2>
      <p>${t('pv.s3.p1')}</p>
      <p>${t('pv.s3.p2')}</p>
      <p>${t('pv.s3.p3')} ${ext(CLOUDFLARE_PRIVACY, t('pv.cf'))}.</p>
    </section>

    <section aria-labelledby="pv-s4">
      <h2 id="pv-s4">${t('pv.s4.t')}</h2>
      <p>${t('pv.s4.p')}</p>
    </section>

    <section aria-labelledby="pv-s5">
      <h2 id="pv-s5">${t('pv.s5.t')}</h2>
      <p>${t('pv.s5.p')}</p>
    </section>

    <section aria-labelledby="pv-s6">
      <h2 id="pv-s6">${t('pv.s6.t')}</h2>
      <p>${t('pv.s6.p1')} ${mail}.</p>
      <p>${t('pv.s6.p2')} ${ext(AEPD, 'www.aepd.es')}.</p>
    </section>

    <section aria-labelledby="pv-s7">
      <h2 id="pv-s7">${t('pv.s7.t')}</h2>
      <p>${t('pv.s7.p')}</p>
    </section>

    <p><a class="btn primary" href="${esc(paths.home)}">${t('pv.back')}</a></p>
  </div>
</main>
</body>
</html>
`;
}
