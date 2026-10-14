/**
 * Partial: stack
 * Sección 06 Stack y certificaciones (#stack, plano): tres niveles (uso diario, conozco, exploro) y certificaciones con enlace de verificación.
 *
 * Claves de content/<locale>.json: st.sec, st.d, st.k, st.x, st.mini, st.certs, st.verify, a.newtab (+ las st.* a las que apunta facts)
 * Datos de facts.json: facts.stack (daily, known, exploring), facts.certifications (name, verifyUrl, i18n.title/meta)
 * Dueño: plantillas. Contrato completo: CONTRACTS.md §5.
 *
 * @param {object} ctx  contexto de render (forma en src/templates/README.md)
 * @returns {string} HTML
 */
// Niveles en el orden de la v6: [lista de facts.stack, clave del título, nota bajo las etiquetas].
const LEVELS = [['daily', 'st.d'], ['known', 'st.k', 'st.mini'], ['exploring', 'st.x']];

const plain = (html) => html.replace(/<[^>]*>/g, '');

export default function render(ctx) {
  const { t, esc, tr, facts } = ctx;
  const levels = LEVELS.map(([list, title, note]) => `        <article class="level card rv rv-settle">
          <h3>${t(title)}</h3>
          <ul class="tags" aria-label="${esc(plain(t(title)))}">
            ${facts.stack[list].map((x) => `<li>${tr(x)}</li>`).join('')}
          </ul>${note ? `\n          <p class="mini">${t(note)}</p>` : ''}
        </article>`).join('\n');

  // Cada certificación enlaza a su verificación en pestaña nueva; el aria-label dice cuál es y que abre
  // pestaña nueva (a.newtab), porque "Verificar" a secas se repite y no avisa del cambio de contexto.
  const certs = facts.certifications.map((c) => {
    const title = c.i18n?.title ? t(c.i18n.title) : esc(c.name);
    const name = c.i18n?.title ? plain(t(c.i18n.title)) : c.name; // texto sin escapar: esc() va al final
    const label = `${plain(t('st.verify'))}: ${name}, ${plain(t('a.newtab'))}`;
    return `        <li class="card rv rv-settle"><b>${title}</b><span>${t(c.i18n.meta)}</span><a class="cert-verify" href="${esc(c.verifyUrl)}" target="_blank" rel="noopener" aria-label="${esc(label)}">${t('st.verify')}</a></li>`;
  }).join('\n');

  return `<section class="sec plane" id="stack" aria-labelledby="h-stack" style="--wx:100%;--wy:100%">
    <div class="wrap">
      <div class="sec-head"><span class="sec-no">06</span><h2 id="h-stack">${t('st.sec')}</h2></div>
      <div class="levels">
${levels}
      </div>
      <ul class="certs" aria-label="${esc(plain(t('st.certs')))}">
${certs}
      </ul>
    </div>
  </section>`;
}
