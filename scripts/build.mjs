#!/usr/bin/env node
// Build de la web con un generador propio (ARCHITECTURE.md decisión 3): Node >= 21, solo módulos nativos.
//   node scripts/build.mjs        → dist/ (es/, en/, index.html de elección de idioma, styles.css, assets/)
// Contrato: CONTRACTS.md. Los partials (src/templates/*.mjs) reciben ctx; aquí solo se construye ctx,
// se escriben las páginas, se concatena el CSS, se copian los ficheros y se pasa el validador.
// Fecha del build: hoy, o SOURCE_DATE_EPOCH (segundos) para builds reproducibles. Solo afecta a {years}.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const fromRoot = (...p) => path.join(ROOT, ...p);
const readJSON = (p) => JSON.parse(fs.readFileSync(fromRoot(p), 'utf8'));

// Orden de capas de CONTRACTS.md §4; las secciones, en el orden de la página (DESIGN.md §4).
const CSS_LAYERS = ['tokens', 'base', 'layout', 'components', 'sections/*', 'motion', 'print'];
const SECTION_ORDER = ['hero', 'about', 'pillars', 'experience', 'project', 'homelab', 'stack', 'education', 'footer'];

const started = performance.now();
const now = process.env.SOURCE_DATE_EPOCH ? new Date(Number(process.env.SOURCE_DATE_EPOCH) * 1000) : new Date();
const facts = readJSON('content/facts.json');
const site = facts.site;

/** Años completos desde 'AAAA-MM' hasta `date` (decisión 14: se recalcula en cada build, sin cron). */
function fullYears(start, date) {
  const [y, m] = start.split('-').map(Number);
  return date.getFullYear() - y - (date.getMonth() + 1 < m ? 1 : 0);
}
const years = fullYears(facts.career.start, now);
const today = now.toISOString().slice(0, 7); // 'AAAA-MM': fin del tramo en curso de la cota
const headJs = fromRoot('src/scripts/head.js');
const headScript = fs.existsSync(headJs) ? fs.readFileSync(headJs, 'utf8').trim() : '';

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

/** Contexto de render (forma en src/templates/README.md). Igual para todos los partials de una página. */
function makeCtx(locale, home) {
  const dict = readJSON(`content/${locale}.json`);
  const words = (dict['num.words'] ?? '').split(',');
  const yearsText = years >= 1 && years <= words.length ? words[years - 1] : String(years);
  const t = (key) => {
    if (!Object.hasOwn(dict, key)) throw new Error(`clave "${key}" no existe en content/${locale}.json`);
    return dict[key].replaceAll('{years}', yearsText);
  };
  const tr = (item) => (typeof item === 'string' ? esc(item) : t(item.i18n));
  const alternates = Object.fromEntries(site.locales.map((l) => [l.code, l.path]));
  const asset = (p) => '/' + String(p).replace(/^\/+/, ''); // ruta absoluta desde la raíz de dist/
  return { locale, t, facts, esc, tr, years, today, headScript, paths: { home, alternates, asset } };
}

/** Importa cada partial por separado (layout al final). Un error de sintaxis en un partial que importa
 *  layout llegaría sin nombre de fichero (Node 21 no lo pone en err.stack); así se sabe cuál es. */
async function loadPartials() {
  const dir = fromRoot('src/templates');
  const names = fs.readdirSync(dir).filter((f) => f.endsWith('.mjs')).map((f) => f.slice(0, -4))
    .sort((a, b) => (a === 'layout') - (b === 'layout') || a.localeCompare(b));
  const partials = {};
  for (const name of names) {
    try { partials[name] = (await import(pathToFileURL(path.join(dir, `${name}.mjs`)).href)).default; }
    catch (err) { err.message = `en src/templates/${name}.mjs: ${err.message}`; throw err; }
  }
  return partials;
}

function write(rel, content) {
  const file = path.join(DIST, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

/** Copia un directorio (sin README.md, que documenta la carpeta y no se publica). */
function copyDir(from, to) {
  if (!fs.existsSync(from)) return 0;
  let n = 0;
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    if (entry.name === 'README.md') continue;
    const src = path.join(from, entry.name), dst = path.join(to, entry.name);
    if (entry.isDirectory()) n += copyDir(src, dst);
    else { fs.mkdirSync(to, { recursive: true }); fs.copyFileSync(src, dst); n++; }
  }
  return n;
}

function concatCss() {
  const dir = fromRoot('src/styles');
  const rank = (f) => { const i = SECTION_ORDER.indexOf(path.basename(f, '.css')); return i < 0 ? SECTION_ORDER.length : i; };
  const files = CSS_LAYERS.flatMap((layer) => {
    if (!layer.endsWith('/*')) return [`${layer}.css`];
    const sub = layer.slice(0, -2);
    if (!fs.existsSync(path.join(dir, sub))) return [];
    return fs.readdirSync(path.join(dir, sub)).filter((f) => f.endsWith('.css'))
      .sort((a, b) => rank(a) - rank(b) || a.localeCompare(b)).map((f) => `${sub}/${f}`);
  }).filter((f) => fs.existsSync(path.join(dir, f)));
  return files.map((f) => `/* ---- ${f} ---- */\n${fs.readFileSync(path.join(dir, f), 'utf8').trim()}\n`).join('\n');
}

/** Renderiza una página; si un partial falla, dice qué página era y deja la traza (fichero:línea del partial). */
function render(out, fn, ctx) {
  try {
    const html = fn(ctx);
    if (typeof html !== 'string' || !html.trim()) throw new Error('el partial no devolvió HTML');
    // Un dato que no existe en facts se cuela como texto en un template literal: mejor fallar.
    const bad = html.match(/.{0,60}(\bundefined\b|\bNaN\b|\[object Object\]).{0,20}/);
    if (bad) throw new Error(`"${bad[1]}" en el HTML (¿dato inexistente?): …${bad[0].trim()}…`);
    write(out, html);
  } catch (err) {
    err.message = `al generar dist/${out} (${ctx.locale}): ${err.message}`;
    throw err;
  }
}

async function main() {
  fs.rmSync(DIST, { recursive: true, force: true });
  const partials = await loadPartials();
  for (const l of site.locales) render(`${l.path.replace(/^\/+/, '')}index.html`, partials.layout, makeCtx(l.code, l.path));
  render('index.html', partials['language-picker'], makeCtx(site.defaultLocale, '/'));
  write('styles.css', concatCss());
  fs.copyFileSync(fromRoot('src/scripts/main.js'), path.join(DIST, 'main.js'));
  const copied = copyDir(fromRoot('assets'), path.join(DIST, 'assets')) + copyDir(fromRoot('src/static'), DIST);
  console.log(`build · ${site.locales.length + 1} páginas, ${copied} ficheros copiados, {years}=${years} · ${Math.round(performance.now() - started)} ms`);
  // El build no termina hasta que la guardia de contenido y privacidad pasa sobre la salida (CONTRACTS.md §7).
  execFileSync(process.execPath, [fromRoot('scripts/check-content.mjs'), '--scan', DIST], { stdio: 'inherit' });
}

main().catch((err) => {
  if (typeof err.status === 'number') console.error('\nbuild: la comprobación de contenido ha fallado (salida arriba).');
  else console.error(`\nbuild: error ${err.stack ?? err}`);
  process.exit(1);
});
