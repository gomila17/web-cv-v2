/**
 * Partial: pillars
 * Sección 02 Qué hago (#que-hago, plano): lead y tres pilares con icono SVG en línea.
 *
 * Claves de content/<locale>.json: n.what, p.lead, p.b.*, p.s.*, p.i.* (.t y .1…5)
 * Datos de facts.json: —
 * Dueño: plantillas. Contrato completo: CONTRACTS.md §5.
 *
 * @param {object} ctx  contexto de render (forma en src/templates/README.md)
 * @returns {string} HTML
 */
// Iconos de la v6 tal cual (el trazo lo pone el CSS de .ico). Cinco viñetas por pilar, como en la v6.
const PILLARS = [
  ['b', '<path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/>'],
  ['s', '<rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/><path d="M7 7h.01M7 17h.01"/>'],
  ['i', '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>'],
];
const BULLETS = 5;

export default function render(ctx) {
  const { t } = ctx;
  const pillar = ([id, icon]) => {
    const items = Array.from({ length: BULLETS }, (_, n) => `            <li>${t(`p.${id}.${n + 1}`)}</li>`).join('\n');
    return `        <article class="pillar card rv rv-settle">
          <span class="ico" aria-hidden="true"><svg viewBox="0 0 24 24">${icon}</svg></span>
          <h3>${t(`p.${id}.t`)}</h3>
          <ul>
${items}
          </ul>
        </article>`;
  };
  return `<section class="sec plane" id="que-hago" aria-labelledby="h-hago" style="--wx:0%;--wy:0%">
    <div class="wrap">
      <div class="sec-head"><span class="sec-no" aria-hidden="true">02</span><h2 id="h-hago">${t('n.what')}</h2></div>
      <p class="lead rv rv-fade">${t('p.lead')}</p>
      <div class="pillars">
${PILLARS.map(pillar).join('\n')}
      </div>
    </div>
  </section>`;
}
