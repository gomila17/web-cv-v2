/**
 * Partial: homelab
 * Sección 05 Homelab (#homelab): lead, contexto, figura (homelab-diagram), decisiones d1–d7 (problema → decisión → por qué [→ límite]) y anécdota.
 *
 * Claves de content/<locale>.json: n.hm, hm.*, dt.*, dN.t/.p/.d/.w[/.l], s.k, s.t, s.p (+ las g.* del diagrama)
 * Datos de facts.json: —
 * Dueño: plantillas. Contrato completo: CONTRACTS.md §5.
 *
 * @param {object} ctx  contexto de render (forma en src/templates/README.md)
 * @returns {string} HTML
 */
import diagram from './homelab-diagram.mjs';

// Decisión destacada (.feature en la v6): "Vigilar al vigilante". Es una elección de diseño, no un dato.
const FEATURE = 3;
// Partes de cada decisión, en orden; la última es opcional (solo si existe la clave).
const PARTS = ['p', 'd', 'w', 'l'];

export default function render(ctx) {
  const { t } = ctx;
  const has = (key) => { try { t(key); return true; } catch { return false; } };
  const decisions = [];
  for (let i = 1; has(`d${i}.t`); i++) {
    const rows = PARTS.filter((p) => has(`d${i}.${p}`))
      .map((p) => `            <dt>${t(`dt.${p}`)}</dt><dd>${t(`d${i}.${p}`)}</dd>`).join('\n');
    decisions.push(`        <li class="dec card${i === FEATURE ? ' feature' : ''} rv rv-settle">
          <h4><span class="num">${i}</span><span>${t(`d${i}.t`)}</span></h4>
          <dl>
${rows}
          </dl>
        </li>`);
  }
  return `<section class="sec" id="homelab" aria-labelledby="h-home">
    <div class="wrap">
      <div class="sec-head"><span class="sec-no">05</span><h2 id="h-home">${t('n.hm')}</h2></div>
      <p class="lead rv rv-fade">${t('hm.lead')}</p>
      <p class="rv rv-fade">${t('hm.ctx')}</p>

      ${diagram(ctx)}

      <h3 class="sub-h rv rv-fade">${t('hm.dec')}</h3>
      <p class="rv rv-fade">${t('hm.decp')}</p>
      <ol class="decisions">
${decisions.join('\n')}
      </ol>

      <aside class="story card rv rv-left" aria-labelledby="h-story">
        <span class="mono">${t('s.k')}</span>
        <h4 id="h-story">${t('s.t')}</h4>
        <p>${t('s.p')}</p>
      </aside>
    </div>
  </section>`;
}
