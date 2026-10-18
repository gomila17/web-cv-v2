/**
 * Partial: footer
 * Pie/contacto (banda oscura): red de nodos decorativa, título, texto, botones (email, LinkedIn, GitHub), bloque abierto a liderazgo y línea final.
 *
 * Claves de content/<locale>.json: f.t, f.p, f.lt, f.fine
 * Datos de facts.json: facts.person.email, facts.links
 * Dueño: plantillas. Contrato completo: CONTRACTS.md §5.
 *
 * @param {object} ctx  contexto de render (forma en src/templates/README.md)
 * @returns {string} HTML
 */
// La v6 pintaba la red con <use href="#net-sym"> y definía el <symbol> al principio del <body> (layout,
// que no es de este partial). Va en línea: el mismo dibujo, sin depender de un id definido en otro fichero.
const NET = '<g stroke="var(--accent)" stroke-opacity=".6" stroke-width="1.2" fill="none"><path d="M20 30 L100 80 L190 40 L225 130 L110 160 L100 80"/><path d="M190 40 L245 10"/><path d="M110 160 L30 190"/></g><g fill="var(--accent)"><circle cx="20" cy="30" r="4"/><circle cx="100" cy="80" r="6" fill="var(--violet)"/><circle cx="190" cy="40" r="4"/><circle cx="225" cy="130" r="5"/><circle cx="110" cy="160" r="4"/><circle cx="245" cy="10" r="3"/><circle cx="30" cy="190" r="3"/></g>';

export default function render(ctx) {
  const { t, esc, facts, paths, locale } = ctx;
  const { person, links } = facts;
  return `<footer>
  <svg class="net2" viewBox="0 0 260 220" aria-hidden="true" focusable="false">${NET}</svg>
  <div class="wrap">
    <h2 class="rv">${t('f.t')}</h2>
    <p class="rv rv-fade">${t('f.p')}</p>
    <ul class="links rv rv-fade">
      <li><a class="btn primary" href="mailto:${esc(person.email)}">${esc(person.email)}</a></li>
      <li><a class="btn" href="${esc(links.linkedin)}" rel="noopener">LinkedIn</a></li>
      <li><a class="btn" href="${esc(links.github)}" rel="noopener">GitHub</a></li>
      <li><a class="btn" href="${paths.asset('cv/Toni-Gomila-CV-' + locale.toUpperCase() + '.pdf')}" download>${t('cv.dl')}</a></li>
    </ul>
    <p class="open rv rv-left">${t('f.lt')}</p>
    <p class="fine">${t('f.fine')} · <a href="${esc(paths.privacy)}">${t('pv.link')}</a></p>
  </div>
</footer>`;
}
