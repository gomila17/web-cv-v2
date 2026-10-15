/**
 * Partial: homelab-diagram
 * Única fuente del diagrama del homelab (DESIGN.md §10): una sola descripción de nodos y aristas
 * genera las dos disposiciones de la v6 (horizontal .hl-wide ≥ 960px y vertical .hl-tall), cada una
 * con role="img" + title + desc, más la leyenda. Devuelve la <figure id="fig"> completa. Sin IPs ni nombres internos.
 *
 * Claves de content/<locale>.json: g.* (g.t.*: solo disposición vertical; g.w.*: solo horizontal)
 * Datos de facts.json: —
 * Dueño: plantillas. Contrato completo: CONTRACTS.md §5.
 *
 * @param {object} ctx  contexto de render (forma en src/templates/README.md)
 * @returns {string} HTML
 */

/*
 * Cómo se lee la descripción
 * - Cada nodo tiene un tono (s-acc, s-vio, s-mut, s-ok, s-org) y, por disposición (wide / tall):
 *   g   = grupo de encendido (.hl-g con --i; el CSS/JS de la v6 los enciende en ese orden),
 *   box = [x, y, ancho, alto, radio] del rectángulo (sin box: solo textos),
 *   kind = frame | box | chip (clase hl-frame / hl-box / hl-chip), dashed = borde discontinuo,
 *   items = textos y trazos, en orden: [clase, x, y, contenido] (centrado) o ['<clase', …] (alineado
 *   a la izquierda); contenido '@clave' se traduce (también dentro de un texto), el resto es un nombre propio literal;
 *   ['dash', d] es un trazo discontinuo.
 * - Las aristas solo dicen origen, destino, tipo y la línea (eje y coordenada transversal); los extremos
 *   salen de las cajas de los nodos y los paquetes de flujo (.hl-dot) se derivan de cada arista.
 * - Un nodo o un texto que solo existe en una disposición simplemente no aparece en la otra.
 */
const NODES = [
  { id: 'internet', tone: 'mut',
    wide: { g: 1, box: [24, 100, 120, 190, 14], items: [['t', 84, 128, 'Internet'], ['s', 84, 147, '@g.vis'], ['dash', 'M40 190H128'], ['t', 84, 226, '@g.dev'], ['s', 84, 245, '@g.away']] },
    tall: { g: 0, box: [20, 16, 300, 56, 14], items: [['t', 170, 39, 'Internet'], ['s', 170, 58, '@g.t.net'], ['<m', 138, 98, '@g.t.tun'], ['<m', 278, 98, 'VPN']] } },
  { id: 'proxmox', tone: 'org', kind: 'frame',
    wide: { g: 0, box: [200, 24, 676, 470, 16], items: [['<t f-org', 220, 50, 'Proxmox VE'], ['<m', 312, 50, '@g.w.srv']] },
    tall: { g: 1, box: [8, 108, 324, 596, 16], items: [['<t f-org', 24, 132, 'Proxmox VE'], ['<m', 140, 130, '@g.t.one'], ['<m', 140, 147, '@g.t.np']] } },
  { id: 'tunnel', tone: 'acc',
    wide: { g: 2, box: [225, 90, 134, 80, 14], items: [['t', 292, 123, 'Cloudflare Tunnel'], ['s', 292, 142, '@g.lxcout'], ['m', 292, 159, '@g.cgnat']] },
    tall: { g: 1, box: [24, 164, 140, 62, 14], items: [['t', 94, 189, 'Cloudflare Tunnel'], ['s', 94, 208, '@g.lxcout']] } },
  { id: 'tailscale', tone: 'vio',
    wide: { g: 2, box: [225, 215, 134, 80, 14], items: [['t', 292, 248, 'Tailscale'], ['s', 292, 267, 'LXC · subnet router'], ['m', 292, 284, '@g.vpn0']] },
    tall: { g: 1, box: [176, 164, 140, 62, 14], items: [['t', 246, 189, 'Tailscale'], ['s', 246, 208, 'LXC · subnet router'], ['m', 246, 243, '@g.t.lan']] } },
  { id: 'adguard', tone: 'mut',
    wide: { g: 2, box: [225, 312, 134, 52, 12], items: [['t', 292, 334, 'AdGuard Home'], ['s', 292, 352, '@g.dns']] },
    tall: { g: 3, box: [24, 574, 140, 58, 12], items: [['t', 94, 599, 'AdGuard Home'], ['s', 94, 618, '@g.dns']] } },
  { id: 'homepanel', tone: 'mut',
    wide: { g: 2, box: [225, 372, 134, 52, 12], items: [['t', 292, 394, 'homepanel'], ['s', 292, 412, '@g.lan']] },
    tall: { g: 3, box: [176, 574, 140, 58, 12], items: [['t', 246, 599, 'homepanel'], ['s', 246, 618, '@g.lan']] } },
  // La web vive en su propia LXC (ARCHITECTURE.md decisión 7), no dentro de la VM Docker. "Web CV" es un nombre propio.
  { id: 'webcv', tone: 'acc',
    wide: { g: 2, box: [225, 432, 134, 52, 12], items: [['t', 292, 454, 'Web CV'], ['s', 292, 472, 'LXC · @g.web']] },
    tall: { g: 3, box: [24, 644, 292, 44, 12], items: [['t', 170, 663, 'Web CV'], ['s', 170, 679, 'LXC · @g.web']] } },
  { id: 'vm', tone: 'acc', kind: 'frame',
    wide: { g: 3, box: [390, 64, 470, 278, 14], items: [['<t f-acc', 410, 88, '@g.vm'], ['<m', 488, 88, 'Debian + Docker']] },
    tall: { g: 2, box: [20, 256, 300, 302, 14], items: [['<t f-acc', 36, 278, '@g.vm'], ['<m', 146, 278, 'Debian + Docker']] } },
  { id: 'proxy', tone: 'vio',
    wide: { g: 3, box: [410, 100, 130, 60, 12], items: [['t', 475, 125, '@g.rp'], ['s', 475, 144, 'Nginx Proxy Manager']] },
    tall: { g: 2, box: [36, 292, 268, 52, 12], items: [['t', 170, 314, '@g.rp'], ['s', 170, 332, 'Nginx Proxy Manager']] } },
  { id: 'stacks', tone: 'acc',
    wide: { g: 3, box: [570, 100, 272, 130, 12], items: [['<t', 586, 124, 'Stacks'], ['<m', 640, 124, '@g.compose']] },
    tall: { g: 2, box: [36, 370, 268, 110, 12], items: [['<t', 48, 392, 'Stacks'], ['<m', 100, 392, '@g.compose']] } },
  { id: 'n8n', tone: 'acc', kind: 'chip',
    wide: { g: 3, box: [586, 138, 74, 38, 8], items: [['c', 623, 162, 'n8n']] },
    tall: { g: 2, box: [48, 404, 76, 30, 8], items: [['c', 86, 424, 'n8n']] } },
  { id: 'vikunja', tone: 'acc', kind: 'chip',
    wide: { g: 3, box: [669, 138, 74, 38, 8], items: [['c', 706, 162, 'Vikunja']] },
    tall: { g: 2, box: [132, 404, 76, 30, 8], items: [['c', 170, 424, 'Vikunja']] } },
  { id: 'opengym', tone: 'acc', kind: 'chip',
    wide: { g: 3, box: [752, 138, 74, 38, 8], items: [['c', 789, 162, 'openGym']] },
    tall: { g: 2, box: [216, 404, 76, 30, 8], items: [['c', 254, 424, 'openGym']] } },
  { id: 'more', tone: 'mut', kind: 'chip',
    wide: { g: 3, box: [586, 186, 240, 38, 8], dashed: true, items: [['m', 706, 210, '@g.more']] },
    tall: { g: 2, items: [['m', 170, 460, '@g.more']] } },
  { id: 'portainer', tone: 'acc',
    wide: { g: 3, box: [410, 260, 432, 62, 12], items: [['t', 626, 288, 'Portainer'], ['s', 626, 307, '@g.port'], ['dash', 'M706 260V230']] },
    tall: { g: 2, box: [36, 502, 268, 44, 12], items: [['t', 170, 520, 'Portainer'], ['s', 170, 537, '@g.t.port'], ['dash', 'M170 502V480']] } },
  { id: 'single-node',
    wide: { g: 3, items: [['<s', 410, 376, '@g.node1'], ['<s', 410, 394, '@g.node2']] } },
  { id: 'monitor', tone: 'ok',
    wide: { g: 4, box: [24, 345, 120, 110, 14], items: [['t', 84, 376, '@g.phone'], ['s', 84, 396, 'monitor'], ['s', 84, 413, '@g.indep'], ['m', 84, 437, '@g.hw'], ['m', 84, 486, '@g.watch']] },
    tall: { g: 4, box: [40, 746, 260, 46, 14], items: [['t', 170, 765, '@g.phone'], ['s', 170, 782, '@g.t.mon']] } },
];

// Tipos de arista: color del paquete de flujo y entrada de la leyenda.
const KINDS = {
  web: { dot: 'f-acc', color: 'var(--accent)', legend: 'g.l1' },
  vpn: { dot: 'f-vio', color: 'var(--violet)', legend: 'g.l2' },
  mon: { dot: 'f-ok', color: 'var(--ok)', legend: 'g.l3' },
};

// at = coordenada transversal de la línea (y si es horizontal, x si es vertical); dl = retraso del paquete
// (los paquetes salen en el sentido del tráfico); gap = hueco hasta el destino para la punta de flecha.
const EDGES = [
  { kind: 'web', from: 'internet', to: 'tunnel', wide: { at: 130, dl: '0s' }, tall: { at: 130, dl: '0s' } },
  { kind: 'vpn', from: 'internet', to: 'tailscale', wide: { at: 255, dl: '1.1s' }, tall: { at: 270, dl: '.3s' } },
  { kind: 'web', from: 'tunnel', to: 'proxy', wide: { at: 130, dl: '.45s' }, tall: { at: 130, dl: '.7s' } },
  { kind: 'web', from: 'proxy', to: 'stacks', wide: { at: 130, dl: '.8s' }, tall: { at: 170, dl: '1.1s' } },
  { kind: 'mon', from: 'monitor', to: 'proxmox', wide: { at: 400, dl: '1.7s' }, tall: { at: 170, dl: '1.7s', gap: 4 } },
];

// Disposiciones: horizontal (de izquierda a derecha) y vertical (de arriba abajo).
const LAYOUTS = [
  { key: 'wide', cls: 'hl-wide', id: 'hlw', w: 900, h: 520, axis: 'h', desc: 'g.dw' },
  { key: 'tall', cls: 'hl-tall', id: 'hlt', w: 340, h: 806, axis: 'v', desc: 'g.dt' },
];

/** Extremos de una arista a partir de las cajas: sale del borde del origen y llega al del destino menos el hueco. */
function edgeLine(edge, L, byId) {
  const [fx, fy, fw, fh] = byId[edge.from][L.key].box;
  const [tx, ty, tw, th] = byId[edge.to][L.key].box;
  const { at, gap = 2 } = edge[L.key];
  if (L.axis === 'h') {
    const fwd = tx >= fx + fw;
    return { x1: fwd ? fx + fw : fx, y1: at, x2: fwd ? tx - gap : tx + tw + gap, y2: at };
  }
  const fwd = ty >= fy + fh;
  return { x1: at, y1: fwd ? fy + fh : fy, x2: at, y2: fwd ? ty - gap : ty + th + gap };
}

function svg(L, ctx) {
  const { t, esc } = ctx;
  const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));
  // '@clave' se traduce (también dentro de un texto, p. ej. 'LXC · @g.web'); el resto es un nombre propio literal.
  const text = (c) => c.split(/(@[\w.]+)/).map((x) => (x.startsWith('@') ? t(x.slice(1)) : esc(x))).join('');
  const item = ([cls, a, b, c]) => {
    if (cls === 'dash') return `  <path class="hl-dash" d="${a}"/>`;
    const left = cls.startsWith('<');
    return `  <text class="hl-${left ? cls.slice(1) : cls}" x="${a}" y="${b}"${left ? '' : ' text-anchor="middle"'}>${text(c)}</text>`;
  };
  const node = (n) => {
    const v = n[L.key];
    const out = [];
    if (v.box) {
      const [x, y, w, h, r] = v.box;
      out.push(`  <rect class="hl-${n.kind ?? 'box'} s-${n.tone}" x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"${v.dashed ? ' stroke-dasharray="4 4"' : ''}/>`);
    }
    return out.concat(v.items.map(item)).join('\n');
  };
  const nodes = NODES.filter((n) => n[L.key]);
  const groups = [...new Set(nodes.map((n) => n[L.key].g))].sort((a, b) => a - b);
  const body = groups.map((g) => `  <g class="hl-g" style="--i:${g}">
${nodes.filter((n) => n[L.key].g === g).map(node).join('\n')}
  </g>`).join('\n\n');

  // Las líneas se encienden después de los nodos; los paquetes van en el orden en que salen.
  const edges = EDGES.filter((e) => e[L.key]).map((e) => ({ e, ...edgeLine(e, L, byId) }))
    .sort((a, b) => parseFloat(a.e[L.key].dl) - parseFloat(b.e[L.key].dl));
  const lines = edges.map(({ x1, y1, x2, y2 }) => `  <path class="hl-line" d="M${x1} ${y1}${L.axis === 'h' ? `H${x2}` : `V${y2}`}" marker-end="url(#${L.id}-ar)"/>`).join('\n');
  const dots = edges.map(({ e, x1, y1, x2, y2 }) => `    <circle class="hl-dot ${KINDS[e.kind].dot}" r="3.4" cx="${x1}" cy="${y1}" style="--dx:${x2 - x1}px;--dy:${y2 - y1}px;--dl:${e[L.key].dl}"/>`).join('\n');

  return `<svg class="hl-svg ${L.cls}" viewBox="0 0 ${L.w} ${L.h}" role="img" aria-labelledby="${L.id}-t ${L.id}-d" xmlns="http://www.w3.org/2000/svg">
  <title id="${L.id}-t">${t('g.t')}</title>
  <desc id="${L.id}-d">${t(L.desc)}</desc>
  <defs>
    <marker id="${L.id}-ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="hl-arrow" d="M0 0L10 5L0 10z"/></marker>
  </defs>
  <rect class="hl-panel" x="0.5" y="0.5" width="${L.w - 1}" height="${L.h - 1}" rx="14"/>

${body}

  <g class="hl-g" style="--i:${groups.length}">
${lines}
  </g>
  <g aria-hidden="true">
${dots}
  </g>
</svg>`;
}

export default function render(ctx) {
  const { t, esc } = ctx;
  const legend = Object.values(KINDS).map((k) => `            <li><i style="background:${k.color}"></i><span>${t(k.legend)}</span></li>`).join('\n');
  return `<figure class="fig rv-fig" id="fig">
        <div class="stage"><div class="frame"><span class="sweep" aria-hidden="true"></span>
${LAYOUTS.map((L) => svg(L, ctx)).join('\n')}
        </div></div>
        <figcaption>
          <ul class="legend" aria-label="${esc(t('g.leg'))}">
${legend}
          </ul>
        </figcaption>
      </figure>`;
}
