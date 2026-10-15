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

// Aviso visual de "abre en pestaña nueva"; el aria-label del enlace ya lo dice, así que el icono va oculto.
const NEWTAB_ICON = '<svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M9 2h5v5M14 2 7.5 8.5M12 9.5V13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3.5"/></svg>';

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
    return `        <li class="card rv rv-settle"><b>${title}</b><span>${t(c.i18n.meta)}</span><a class="cert-verify" href="${esc(c.verifyUrl)}" target="_blank" rel="noopener" aria-label="${esc(label)}">${t('st.verify')}${NEWTAB_ICON}</a></li>`;
  }).join('\n');

  return `<section class="sec plane" id="stack" aria-labelledby="h-stack" style="--wx:100%;--wy:100%">
    <div class="wrap">
      <div class="sec-head"><span class="sec-no" aria-hidden="true">06</span><h2 id="h-stack">${t('st.sec')}</h2></div>
      <div class="levels">
${levels}
      </div>
      <ul class="certs" aria-label="${esc(plain(t('st.certs')))}">
${certs}
      </ul>
    </div>
  </section>`;
}
