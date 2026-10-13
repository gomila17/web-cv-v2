// Contraste WCAG 2.x de los pares de color principales de hibrido-v5.html
// (los de v4 + cabecera fija, barra de lectura, disco de la foto y barrido del diagrama).
// Uso: node v5-contraste.js   (sale con codigo 1 si hay algun fallo)
const h = x => { x = x.replace('#', ''); return [0, 2, 4].map(i => parseInt(x.substr(i, 2), 16)); };
const lin = v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); };
const L = c => { const [r, g, b] = h(c).map(lin); return .2126 * r + .7152 * g + .0722 * b; };
const cr = (a, b) => { const x = L(a), y = L(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
const hex = a => '#' + a.map(v => Math.round(v).toString(16).padStart(2, '0')).join('');
// color rgba(r,g,b,alpha) sobre un fondo opaco
const over = (rgb, alpha, base) => { const b = h(base); return hex(rgb.map((v, i) => v * alpha + b[i] * (1 - alpha))); };

const T = {
  claro: {
    bg: '#EDEDED', plane: '#E2E5EF', surface: '#FBFBFA', ink: '#202A42', muted: '#4A5470', accentInk: '#3A51C6',
    onPrimary: '#FFFFFF', primary: '#3A51C6', violet: '#6639BA', ok: '#1A7F37', orange: '#B3470A',
    ctl: '#5A6480', line: '#A9AFC2', accent: '#526DE5',
    band: '#202A42', bandInk: '#EDEDED', bandMuted: '#C5CBE0', bandLabel: '#A9B8FF', bandPrimary: '#A9B8FF', bandOnPrimary: '#202A42',
    heroTop: '#E1E5F3', heroMid: '#E8E9EF', orb1: [[82, 109, 229], .12], orb2: [[102, 57, 186], .09],
    planeWash: [[82, 109, 229], .13], ghost: [[82, 109, 229], .22],
    headBg: [[237, 237, 237], .97], sweep: [[82, 109, 229], .12], discTop: '#6179E8', discBot: '#3A51C6'
  },
  oscuro: {
    bg: '#0d1117', plane: '#111827', surface: '#21262d', ink: '#e6edf3', muted: '#9aa4b0', accentInk: '#58a6ff',
    onPrimary: '#0d1117', primary: '#58a6ff', violet: '#a78bfa', ok: '#3fb950', orange: '#f0883e',
    ctl: '#8b949e', line: '#30363d', accent: '#58a6ff',
    band: '#161b22', bandInk: '#e6edf3', bandMuted: '#9aa4b0', bandLabel: '#58a6ff', bandPrimary: '#58a6ff', bandOnPrimary: '#0d1117',
    heroTop: '#0d1117', heroMid: '#141a35', heroEnd: '#221640', orb1: [[88, 166, 255], .17], orb2: [[139, 108, 240], .22],
    planeWash: [[88, 166, 255], .08], ghost: [[88, 166, 255], .2],
    headBg: [[13, 17, 23], .96], sweep: [[88, 166, 255], .12], discTop: '#2A4C8C', discBot: '#2B2066'
  }
};
let bad = 0;
const rows = [];
const chk = (theme, name, fg, bg, min) => {
  const r = cr(fg, bg), ok = r >= min; if (!ok) bad++;
  rows.push(`${ok ? 'ok  ' : 'FAIL'} [${theme}] ${name}  ${fg} sobre ${bg}  ${r.toFixed(2)} (min ${min})`);
};
for (const k in T) {
  const t = T[k];
  // texto sobre superficies lisas
  for (const [bgName, bg] of [['papel', t.bg], ['plano', t.plane], ['tarjeta', t.surface]]) {
    chk(k, `texto principal / ${bgName}`, t.ink, bg, 4.5);
    chk(k, `texto atenuado / ${bgName}`, t.muted, bg, 4.5);
    chk(k, `enlace e indigo de texto / ${bgName}`, t.accentInk, bg, 4.5);
  }
  chk(k, 'violeta (etiquetas pequenas) / tarjeta', t.violet, t.surface, 4.5);
  chk(k, 'violeta (etiquetas pequenas) / papel', t.violet, t.bg, 4.5);
  chk(k, 'boton primario', t.onPrimary, t.primary, 4.5);
  // pie y bloque de leccion
  chk(k, 'pie: texto', t.bandInk, t.band, 4.5);
  chk(k, 'pie: texto secundario', t.bandMuted, t.band, 4.5);
  chk(k, 'pie: etiqueta/acento', t.bandLabel, t.band, 4.5);
  chk(k, 'pie: boton primario', t.bandOnPrimary, t.bandPrimary, 4.5);
  chk(k, 'pie: filete (no texto)', t.bandLabel, t.band, 3);
  // no texto
  chk(k, 'control (borde de boton/selector) / papel', t.ctl, t.bg, 3);
  chk(k, 'acento de trazos (cota, nodos) / papel', t.accent, t.bg, 3);
  chk(k, 'acento de trazos / plano', t.accent, t.plane, 3);
  chk(k, 'violeta (nodo, pulso) / papel', t.violet, t.bg, 3);
  chk(k, 'verde diagrama / tarjeta', t.ok, t.surface, 3);
  chk(k, 'naranja diagrama (texto) / tarjeta', t.orange, t.surface, 4.5);
  // atmosfera: peor caso = texto atenuado sobre el punto de maxima intensidad de cada mancha
  const baseHero = k === 'claro' ? t.heroTop : t.heroMid;
  const o1 = over(...t.orb1.slice(0, 1), t.orb1[1], baseHero);
  const o2 = over(t.orb2[0], t.orb2[1], baseHero);
  chk(k, 'hero: atenuado / mancha 1 (max.)', t.muted, o1, 4.5);
  chk(k, 'hero: principal / mancha 1 (max.)', t.ink, o1, 4.5);
  chk(k, 'hero: atenuado / mancha 2 (max.)', t.muted, o2, 4.5);
  chk(k, 'hero: indigo texto (eyebrow) / mancha 1 (max.)', t.accentInk, o1, 4.5);
  if (t.heroEnd) {
    chk(k, 'hero: atenuado / fin del degradado', t.muted, t.heroEnd, 4.5);
    chk(k, 'hero: atenuado / fin del degradado + mancha 2', t.muted, over(t.orb2[0], t.orb2[1], t.heroEnd), 4.5);
    chk(k, 'hero: indigo texto / fin del degradado + mancha 2', t.accentInk, over(t.orb2[0], t.orb2[1], t.heroEnd), 4.5);
  }
  const pw = over(t.planeWash[0], t.planeWash[1], t.plane);
  chk(k, 'plano con resplandor: atenuado', t.muted, pw, 4.5);
  chk(k, 'plano con resplandor: indigo texto', t.accentInk, pw, 4.5);
  const gh = over(t.ghost[0], t.ghost[1], t.bg);
  chk(k, 'monograma fantasma: atenuado sobre su trazo', t.muted, gh, 4.5);
  chk(k, 'monograma fantasma: principal sobre su trazo', t.ink, gh, 4.5);
  // v5: cabecera fija (fondo semitransparente) sobre cada fondo que puede pasar por debajo
  for (const [n, under] of [['papel', t.bg], ['plano', t.plane], ['tarjeta', t.surface], ['pie', t.band], ['hero', t.heroMid]]) {
    const hb = over(t.headBg[0], t.headBg[1], under);
    chk(k, `cabecera fija sobre ${n}: texto`, t.ink, hb, 4.5);
    chk(k, `cabecera fija sobre ${n}: nav activa (indigo)`, t.accentInk, hb, 4.5);
    chk(k, `cabecera fija sobre ${n}: barra de lectura (no texto)`, t.accent, hb, 3);
    chk(k, `cabecera fija sobre ${n}: barra de lectura, extremo violeta`, t.violet, hb, 3);
  }
  // v5: foto recortada (no texto): la camisa blanca debe separarse del disco
  chk(k, 'camisa blanca (~#F2F2F2) / disco, parte clara', '#F2F2F2', t.discTop, 3);
  chk(k, 'camisa blanca (~#F2F2F2) / disco, parte oscura', '#F2F2F2', t.discBot, 3);
  chk(k, 'anillo de la foto / fondo hero', t.accent, t.heroTop, 3);
  // v5: barrido del diagrama (velo transitorio --sweep sobre la tarjeta del diagrama)
  const sw = over(t.sweep[0], t.sweep[1], t.surface);
  chk(k, 'barrido del diagrama: atenuado', t.muted, sw, 4.5);
  chk(k, 'barrido del diagrama: principal', t.ink, sw, 4.5);
}
console.log(rows.join('\n'));
console.log('\nfallos: ' + bad);
process.exit(bad ? 1 : 0);
