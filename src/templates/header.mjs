/**
 * Partial: header
 * Cabecera fija: logo tg (#top), nav con anclas de sección, selector de idioma (enlaces a la página equivalente, no botones) y conmutador de tema. Los textos del tema van en data-* para main.js.
 *
 * Claves de content/<locale>.json: a.home, a.nav, a.lang, n.*, th.*
 * Datos de facts.json: facts.site.locales
 * Dueño: plantillas. Contrato completo: CONTRACTS.md §5.
 *
 * @param {object} ctx  contexto de render (forma en src/templates/README.md)
 * @returns {string} HTML
 */
// Sin interacción todavía: el conmutador de tema sale con `hidden` (sin JS no haría nada) y
// lleva sus textos en data-* para que main.js lo active. El selector de idioma son enlaces.
const THEME_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9"/><path d="M12 3v18"/><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor"/></svg>';

export default function render(ctx) {
  const { t, esc, facts, locale, paths } = ctx;
  const attr = (key) => esc(t(key));
  // Fuera de la portada (404) las anclas necesitan la ruta de la portada del idioma.
  const base = ctx.linkBase ? esc(ctx.linkBase) : '';
  const nav = [['sobre-mi', t('n.about')], ['que-hago', t('n.what')], ['experiencia', t('n.exp')],
    ['proyectos', t('n.proj')], ['homelab', t('n.hm')], ['stack', t('n.stack')]]
    .map(([id, label]) => `      <a href="${base}#${id}">${label}</a>`).join('\n');
  const langs = facts.site.locales.map((l) => `        <a href="${esc(paths.alternates[l.code])}" hreflang="${esc(l.code)}" lang="${esc(l.code)}" aria-label="${esc(l.name)}"${l.code === locale ? ' aria-current="true"' : ''}>${esc(l.label)}</a>`).join('\n');
  const themeData = ['auto', 'light', 'dark', 'pre', 'sys', 'post'].map((k) => ` data-${k}="${attr(`th.${k}`)}"`).join('');
  return `<header class="topbar">
  <div class="wrap top">
    <a class="mark" href="${base}#top" aria-label="${attr('a.home')}">tg</a>
    <nav aria-label="${attr('a.nav')}">
${nav}
    </nav>
    <div class="tools">
      <div class="lang" data-cur="${esc(locale)}" role="group" aria-label="${attr('a.lang')}">
${langs}
      </div>
      <button class="theme" id="theme" type="button" hidden aria-label="${attr('th.pre')}${attr('th.auto')}${attr('th.sys')}${attr('th.post')}"${themeData}>
        ${THEME_ICON}
        <span id="theme-label">${t('th.auto')}</span>
      </button>
    </div>
  </div>
  <span class="prog" aria-hidden="true"></span>
</header>`;
}
