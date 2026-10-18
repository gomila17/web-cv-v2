/**
 * Partial: hero
 * Hero: h1 único con el nombre (eyebrow: name · role · city, para que "Toni Gomila" salga literal) y el titular en dos spans (SEO: nombre y rol en el h1), subtítulo, valor, nota IA, botones (proyectos, LinkedIn, GitHub, Email), foto recortada (WebP con alfa), capas decorativas aria-hidden.
 *
 * Claves de content/<locale>.json: h.*
 * Datos de facts.json: facts.person, facts.links
 * Dueño: plantillas. Contrato completo: CONTRACTS.md §5.
 *
 * @param {object} ctx  contexto de render (forma en src/templates/README.md)
 * @returns {string} HTML
 */
// Capas decorativas (aria-hidden): manchas, red de nodos y pulso. SVG de la v6 tal cual.
const DECOR = `<div class="par p1" aria-hidden="true"><span class="orb o1"></span></div>
    <div class="par p2" aria-hidden="true"><span class="orb o2"></span></div>
    <div class="par p3" aria-hidden="true">
    <svg class="net" viewBox="0 0 260 220" aria-hidden="true" focusable="false">
      <g class="lines" stroke="var(--accent)" stroke-opacity=".6" stroke-width="1.2" fill="none">
        <path d="M20 30 L100 80 L190 40 L225 130 L110 160 L100 80"/>
        <path d="M190 40 L245 10"/>
        <path d="M110 160 L30 190"/>
      </g>
      <g fill="var(--accent)">
        <circle cx="20" cy="30" r="4" style="--n:0"/><circle cx="100" cy="80" r="6" fill="var(--violet)" style="--n:1"/>
        <circle cx="190" cy="40" r="4" style="--n:2"/><circle cx="225" cy="130" r="5" style="--n:3"/>
        <circle cx="110" cy="160" r="4" style="--n:4"/><circle cx="245" cy="10" r="3" style="--n:5"/><circle cx="30" cy="190" r="3" style="--n:6"/>
      </g>
      <circle class="ping" cx="100" cy="80" r="6"/>
    </svg>
    </div>`;

export default function render(ctx) {
  const { t, esc, facts, paths, locale } = ctx;
  const { person, links } = facts;
  return `<div class="hero-band" id="top">
    ${DECOR}
    <div class="wrap">
      <div class="hero">
        <div>
          <h1><span class="eyebrow">${esc(person.name)} · ${esc(person.role)} · ${esc(person.city)}</span>
            <span class="h-title">${t('h.title')}</span></h1>
          <p class="sub">${t('h.sub')}</p>
          <p class="value">${t('h.value')}</p>
          <p class="ai-note">${t('h.ai')}</p>
          <ul class="links">
            <li><a class="btn primary" href="#proyectos">${t('h.cta')}</a></li>
            <li><a class="btn" href="${paths.asset('cv/Toni-Gomila-CV-' + locale.toUpperCase() + '.pdf')}" download>${t('cv.dl')}</a></li>
            <li><a class="btn" href="${esc(links.linkedin)}" rel="noopener">LinkedIn</a></li>
            <li><a class="btn" href="${esc(links.github)}" rel="noopener">GitHub</a></li>
            <li><a class="btn" href="mailto:${esc(person.email)}">Email</a></li>
          </ul>
        </div>
        <div class="photo photo--cutout p-photo"><div class="pic"><img src="${paths.asset('assets/foto-recorte.webp')}" width="400" height="400" alt="${esc(t('h.alt'))}"></div></div>
      </div>
    </div>
  </div>`;
}
