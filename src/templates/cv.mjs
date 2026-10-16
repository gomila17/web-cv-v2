/**
 * Partial: cv
 * Versión imprimible del currículum (dist/es/cv.html y dist/en/cv.html). Sirve de fuente para el PDF descargable
 * (scripts/make-cv-pdf.mjs): mismo contenido que la web, en una o dos páginas A4, sin teléfono y sin nada interactivo.
 * Tema claro forzado y noindex: no es una página para buscadores.
 *
 * Claves de content/<locale>.json: a.p1, a.p2, e.*, ed.*, st.d, st.k, st.c*, n.exp, cv.profile, cv.skills
 * Datos de facts.json: person, links, career, education, certifications, stack, languages
 * Dueño: integrador. Contrato completo: CONTRACTS.md §5.
 *
 * @param {object} ctx  contexto de render (forma en src/templates/README.md)
 * @returns {string} HTML
 */
const plain = (html) => html.replace(/<[^>]*>/g, '');
const bare = (url) => url.replace(/^https?:\/\//, '').replace(/\/+$/, '');
const PREFIX = { intern: 'i', dev: 'd', senior: 's' };

export default function render(ctx) {
  const { t, esc, tr, facts, locale, paths } = ctx;
  const { person, links, site } = facts;
  const has = (key) => { try { t(key); return true; } catch { return false; } };

  const jobs = [...facts.career.stages].reverse().map((s) => {
    const p = PREFIX[s.id];
    const bullets = [];
    for (let i = 1; has(`e.${p}.${i}`); i++) bullets.push(`        <li>${t(`e.${p}.${i}`)}</li>`);
    return `    <article class="cv-job">
      <h3>${esc(s.title)} <span>· Inetum</span></h3>
      <p class="cv-when">${t(`e.${p}.w`)}</p>
      <ul>
${bullets.join('\n')}
      </ul>
      <p class="cv-tech">${s.tech.map(esc).join(' · ')}</p>
    </article>`;
  }).join('\n');

  const studies = facts.education.map((e) => {
    const k = e.i18n ?? {};
    const grade = e.grade ? ` · ${plain(t('ed.avg'))} ${k.grade ? plain(t(k.grade)) : `${esc(e.grade.value)}/${esc(e.grade.scale)}`}` : '';
    return `    <p><b>${esc(e.title)}</b><br>${plain(t(k.meta))}${grade}</p>`;
  }).join('\n');

  const certs = facts.certifications.map((c) => {
    const title = c.i18n?.title ? plain(t(c.i18n.title)) : esc(c.name);
    return `    <p><b>${title}</b><br>${plain(t(c.i18n.meta))}</p>`;
  }).join('\n');

  const skills = [['daily', 'st.d'], ['known', 'st.k']]
    .map(([list, title]) => `    <p><b>${plain(t(title))}:</b> ${facts.stack[list].map((x) => plain(tr(x))).join(', ')}</p>`).join('\n');
  const langs = facts.languages.map((l) => `${plain(t(l.i18n.name))} ${l.i18n.level ? plain(t(l.i18n.level)) : esc(l.level)}`).join(' · ');

  return `<!doctype html>
<html lang="${esc(locale)}" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(person.fullName)} · CV</title>
<meta name="robots" content="noindex">
<link rel="stylesheet" href="${paths.asset('styles.css')}">
</head>
<body class="cv-page">
<main class="cv">
  <header>
    <h1>${esc(person.fullName)}</h1>
    <p class="cv-role">${esc(person.role)} · ${esc(person.city)}</p>
    <p class="cv-contact"><a href="mailto:${esc(person.email)}">${esc(person.email)}</a> · <a href="${esc(links.linkedin)}">${esc(bare(links.linkedin))}</a> · <a href="${esc(links.github)}">${esc(bare(links.github))}</a> · <a href="${esc(site.url)}">${esc(bare(site.url))}</a></p>
  </header>
  <section>
    <h2>${t('cv.profile')}</h2>
    <p>${t('a.p1')}</p>
    <p>${t('a.p2')}</p>
  </section>
  <section>
    <h2>${t('n.exp')}</h2>
${jobs}
  </section>
  <section>
    <h2>${t('ed.sec')}</h2>
${studies}
  </section>
  <section>
    <h2>${t('st.certs')}</h2>
${certs}
  </section>
  <section>
    <h2>${t('cv.skills')}</h2>
${skills}
  </section>
  <section>
    <h2>${t('ed.lang')}</h2>
    <p>${langs}</p>
  </section>
</main>
</body>
</html>
`;
}
