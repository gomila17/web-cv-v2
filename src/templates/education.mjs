/**
 * Partial: education
 * Sección 07 Formación (#formacion): títulos (DAW, ASIR) con centro, fechas y nota, e idiomas.
 *
 * Claves de content/<locale>.json: ed.sec, ed.avg, ed.lang (+ las ed.* a las que apunta facts: meta, grade, modules, name, level)
 * Datos de facts.json: facts.education (title, grade, i18n), facts.languages (level, i18n)
 * Dueño: plantillas. Contrato completo: CONTRACTS.md §5.
 *
 * @param {object} ctx  contexto de render (forma en src/templates/README.md)
 * @returns {string} HTML
 */
export default function render(ctx) {
  const { t, esc, facts } = ctx;
  const studies = facts.education.map((e) => {
    const k = e.i18n ?? {};
    // La nota con decimales se escribe en cada idioma (8,92 / 8.92); la entera sale tal cual de facts.
    const grade = k.grade ? `<span>${t(k.grade)}</span>` : `${esc(e.grade.value)}/${esc(e.grade.scale)}`;
    const lines = [`<p>${t(k.meta)}</p>`];
    if (e.grade) lines.push(`<p><b>${t('ed.avg')}</b> ${grade}</p>`);
    if (k.modules) lines.push(`<p>${t(k.modules)}</p>`);
    return `        <article class="card rv rv-settle">
          <h3>${esc(e.title)}</h3>
${lines.map((l) => `          ${l}`).join('\n')}
        </article>`;
  });
  const langs = facts.languages.map((l) => {
    const level = l.i18n.level ? `<span>${t(l.i18n.level)}</span>` : esc(l.level);
    return `          <p><b>${t(l.i18n.name)}</b> ${level}</p>`;
  }).join('\n');
  return `<section class="sec" id="formacion" aria-labelledby="h-edu">
    <div class="wrap">
      <div class="sec-head"><span class="sec-no">07</span><h2 id="h-edu">${t('ed.sec')}</h2></div>
      <div class="edu">
${studies.join('\n')}
        <article class="card rv rv-settle">
          <h3>${t('ed.lang')}</h3>
${langs}
        </article>
      </div>
    </div>
  </section>`;
}
