/**
 * Partial: about
 * Sección 01 Sobre mí (#sobre-mi): dos párrafos y bloque de largo plazo; monograma fantasma.
 *
 * Claves de content/<locale>.json: n.about, a.p1, a.p2, a.lt, a.ltp
 * Datos de facts.json: —
 * Dueño: plantillas. Contrato completo: CONTRACTS.md §5.
 *
 * @param {object} ctx  contexto de render (forma en src/templates/README.md)
 * @returns {string} HTML
 */
export default function render(ctx) {
  const { t, esc } = ctx;
  return `<section class="sec" id="sobre-mi" aria-labelledby="h-sobre">
    <span class="ghost" aria-hidden="true">tg</span>
    <div class="wrap">
      <div class="sec-head"><span class="sec-no">01</span><h2 id="h-sobre">${t('n.about')}</h2></div>
      <p class="rv rv-fade">${t('a.p1')}</p>
      <p class="rv rv-fade">${t('a.p2')}</p>
      <aside class="longterm rv rv-left" aria-label="${esc(t('a.lt'))}">
        <span class="mono">${t('a.lt')}</span>
        <p>${t('a.ltp')}</p>
      </aside>
    </div>
  </section>`;
}
