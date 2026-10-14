/**
 * Partial: project
 * Sección 04 Proyecto destacado (#proyectos, plano): homepanel con problema, decisiones, resultado y lección.
 *
 * Claves de content/<locale>.json: pr.sec, pr.tag, pr.h1…h3, pr.p, pr.d1…, pr.r1…, pr.l, pr.lt, a.tech
 * Datos de facts.json: facts.projects.homepanel (name, repo, tech)
 * Dueño: plantillas. Contrato completo: CONTRACTS.md §5.
 *
 * @param {object} ctx  contexto de render (forma en src/templates/README.md)
 * @returns {string} HTML
 */
export default function render(ctx) {
  const { t, esc, facts } = ctx;
  const p = facts.projects.homepanel;
  // Listas numeradas por clave (pr.d1, pr.d2…; pr.r1, pr.r2…): tantas como existan en el contenido.
  const has = (key) => { try { t(key); return true; } catch { return false; } };
  const list = (prefix) => { const out = []; for (let i = 1; has(`${prefix}${i}`); i++) out.push(t(`${prefix}${i}`)); return out; };
  const tags = p.tech.map((x) => `<li>${esc(x)}</li>`).join('');
  const repoText = p.repo.replace(/^https?:\/\//, '').replace(/\/$/, '');
  return `<section class="sec plane" id="proyectos" aria-labelledby="h-proy" style="--wx:0%;--wy:100%">
    <div class="wrap">
      <div class="sec-head"><span class="sec-no">04</span><h2 id="h-proy">${t('pr.sec')}</h2></div>
      <article class="project card rv rv-settle">
        <header>
          <h3>${esc(p.name)}</h3>
          <p>${t('pr.tag')}</p>
          <ul class="tags" aria-label="${esc(t('a.tech'))}">${tags}</ul>
          <a class="repo" href="${esc(p.repo)}" rel="noopener">${esc(repoText)}</a>
        </header>
        <div class="pgrid">
          <div class="pcol">
            <h4>${t('pr.h1')}</h4>
            <p>${t('pr.p')}</p>
          </div>
          <div class="pcol">
            <h4>${t('pr.h2')}</h4>
            <ol>
${list('pr.d').map((d) => `              <li>${d}</li>`).join('\n')}
            </ol>
          </div>
          <div class="pcol">
            <h4>${t('pr.h3')}</h4>
${list('pr.r').map((r) => `            <p>${r}</p>`).join('\n')}
          </div>
        </div>
        <p class="lesson"><strong>${t('pr.l')}</strong><span>${t('pr.lt')}</span></p>
      </article>
    </div>
  </section>`;
}
