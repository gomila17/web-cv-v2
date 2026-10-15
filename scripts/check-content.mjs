#!/usr/bin/env node
// check-content.mjs — guardia de contenido y privacidad (ARCHITECTURE.md, decisión 2).
// Sin dependencias: solo módulos nativos de Node >= 21.
//
// Uso:
//   node scripts/check-content.mjs                  comprueba content/
//   node scripts/check-content.mjs --content <dir>  comprueba otra carpeta de contenido
//   node scripts/check-content.mjs --scan <ruta>    además, guardia de privacidad sobre
//                                                   ficheros de texto (p. ej. dist/); repetible
//
// Términos privados concretos (opcional, nunca en el repo): fichero `.privacy-terms` en la
// raíz (uno por línea, # comenta) o variable PRIVACY_TERMS (separados por coma o salto de línea).
// Sale con código 1 si alguna comprobación falla.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// ---------- argumentos ----------
const args = process.argv.slice(2);
let contentDir = path.join(ROOT, 'content');
const scanPaths = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--content') contentDir = path.resolve(args[++i] ?? '');
  else if (args[i] === '--scan') scanPaths.push(path.resolve(args[++i] ?? ''));
  else { console.error(`Argumento desconocido: ${args[i]}`); process.exit(2); }
}

// ---------- registro de resultados ----------
const checks = [];
function check(name) {
  const c = { name, errors: [], note: '' };
  checks.push(c);
  return c;
}

// ---------- utilidades ----------
const KEY_RE = /^[a-z][a-z0-9]*(\.[a-z0-9]+)*$/;
const ALLOWED_TAGS = new Set(['em', 'strong', 'b', 'code', 'br']);
const ALLOWED_PLACEHOLDERS = new Set(['years']);
const MARKER_RE = /\[\s*(FALTA|REVISAR)\b/i;
const PRIVATE_IP_RE = /(?<![\d.])(?:10\.\d{1,3}|172\.(?:1[6-9]|2\d|3[01])|192\.168)\.\d{1,3}\.\d{1,3}(?![\d])/;
// 9 o más dígitos con separadores simples opcionales (espacio, punto, guion), con o sin prefijo +NN.
const PHONE_RE = /(?<![\w.\/-])(?:\+\d{1,3}[ .-]?)?\(?\d\)?(?:[ .-]?\(?\d\)?){8,}(?![\w])/;
const URL_RE = /\b(?:https?:\/\/|mailto:)[^\s"'<>)]+/g;
const YM_RE = /^\d{4}-(0[1-9]|1[0-2])$/;
const YMD_RE = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HTTPS_RE = /^https:\/\/[^\s]+$/;
const fold = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

function readJson(file, c) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch (e) { c.errors.push(`${path.basename(file)}: ${e.code === 'ENOENT' ? 'no existe' : e.message}`); return null; }
}

// Recorre todos los strings de un valor JSON con su ruta legible.
function* strings(value, where) {
  if (typeof value === 'string') yield [where, value];
  else if (Array.isArray(value)) for (let i = 0; i < value.length; i++) yield* strings(value[i], `${where}[${i}]`);
  else if (value && typeof value === 'object') for (const [k, v] of Object.entries(value)) yield* strings(v, `${where} › ${k}`);
}

function loadPrivacyTerms() {
  const terms = [];
  // PRIVACY_TERMS_FILE cambia la ruta (los tests la apuntan a un fichero inexistente para no mezclar la lista local).
  const file = process.env.PRIVACY_TERMS_FILE || path.join(ROOT, '.privacy-terms');
  if (fs.existsSync(file)) {
    for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
      const t = line.trim();
      if (t && !t.startsWith('#')) terms.push(t);
    }
  }
  if (process.env.PRIVACY_TERMS) terms.push(...process.env.PRIVACY_TERMS.split(/[,\n]/).map((t) => t.trim()).filter(Boolean));
  return terms.map(fold);
}

// Devuelve los problemas de privacidad de un texto. Nunca repite el término privado encontrado.
function privacyIssues(text, terms) {
  const issues = [];
  const plain = text.replace(URL_RE, ' ');
  const ip = text.match(PRIVATE_IP_RE);
  if (ip) issues.push(`IP privada (carácter ${ip.index})`);
  const phone = plain.match(PHONE_RE);
  if (phone) issues.push(`posible teléfono (carácter ${phone.index})`);
  const folded = fold(text);
  terms.forEach((t, i) => { if (folded.includes(t)) issues.push(`término privado n.º ${i + 1} de la lista local`); });
  return issues;
}

const tagsOf = (s) => [...s.matchAll(/<\/?([a-zA-Z][\w-]*)[^>]*>/g)].map((m) => m[0].startsWith('</') ? `/${m[1].toLowerCase()}` : m[1].toLowerCase());
const placeholdersOf = (s) => [...s.matchAll(/\{([a-zA-Z_][\w]*)\}/g)].map((m) => m[1]);
const sameMultiset = (a, b) => a.length === b.length && [...a].sort().join('|') === [...b].sort().join('|');

// ---------- 1. ficheros ----------
const cFiles = check('ficheros JSON legibles');
const facts = readJson(path.join(contentDir, 'facts.json'), cFiles);
const locales = (facts?.site?.locales ?? [{ code: 'es' }, { code: 'en' }]).map((l) => l.code);
const defaultLocale = facts?.site?.defaultLocale ?? 'es';
const dicts = {};
for (const code of locales) {
  const d = readJson(path.join(contentDir, `${code}.json`), cFiles);
  if (d === null) continue;
  if (typeof d !== 'object' || Array.isArray(d)) { cFiles.errors.push(`${code}.json: debe ser un objeto plano clave→texto`); continue; }
  dicts[code] = d;
}

// ---------- 2. diccionarios: forma, paridad, vacíos, HTML y huecos ----------
const cShape = check('claves con formato válido y valores de texto');
const cParity = check(`paridad de claves entre idiomas (${locales.join('/')})`);
const cEmpty = check('ningún valor vacío');
const cHtml = check('HTML en línea permitido y equivalente entre idiomas');
const cPh = check('huecos {…} conocidos y equivalentes entre idiomas');
const base = dicts[defaultLocale];
for (const [code, d] of Object.entries(dicts)) {
  for (const [k, v] of Object.entries(d)) {
    if (!KEY_RE.test(k)) cShape.errors.push(`${code}.json › "${k}": formato de clave no válido`);
    if (typeof v !== 'string') { cShape.errors.push(`${code}.json › ${k}: el valor no es texto`); continue; }
    if (v.trim() === '') cEmpty.errors.push(`${code}.json › ${k}`);
    for (const t of tagsOf(v)) if (!ALLOWED_TAGS.has(t.replace('/', ''))) cHtml.errors.push(`${code}.json › ${k}: etiqueta <${t}> no permitida`);
    for (const p of placeholdersOf(v)) if (!ALLOWED_PLACEHOLDERS.has(p)) cPh.errors.push(`${code}.json › ${k}: hueco {${p}} desconocido`);
  }
  if (base && code !== defaultLocale) {
    for (const k of Object.keys(base)) if (!(k in d)) cParity.errors.push(`falta en ${code}.json: ${k}`);
    for (const k of Object.keys(d)) if (!(k in base)) cParity.errors.push(`falta en ${defaultLocale}.json: ${k}`);
    for (const k of Object.keys(base)) {
      if (typeof base[k] !== 'string' || typeof d[k] !== 'string') continue;
      if (!sameMultiset(tagsOf(base[k]), tagsOf(d[k]))) cHtml.errors.push(`${k}: etiquetas distintas en ${defaultLocale} y ${code}`);
      if (!sameMultiset(placeholdersOf(base[k]), placeholdersOf(d[k]))) cPh.errors.push(`${k}: huecos distintos en ${defaultLocale} y ${code}`);
    }
  }
}
if (base) cParity.note = `${Object.keys(base).length} claves`;

// ---------- 3. marcas abiertas y privacidad (diccionarios + facts) ----------
const cMarks = check('sin marcas [FALTA] / [REVISAR]');
const cPriv = check('guardia de privacidad (IPs privadas, teléfonos, términos locales)');
const terms = loadPrivacyTerms();
cPriv.note = terms.length ? `${terms.length} términos locales` : 'sin lista local: solo patrones genéricos';
const sources = Object.entries(dicts).map(([code, d]) => [`${code}.json`, d]);
if (facts) sources.push(['facts.json', facts]);
for (const [file, data] of sources) {
  for (const [where, s] of strings(data, file)) {
    if (MARKER_RE.test(s)) cMarks.errors.push(where);
    for (const issue of privacyIssues(s, terms)) cPriv.errors.push(`${where}: ${issue}`);
  }
}

// ---------- 4. facts.json: campos obligatorios y referencias ----------
const cFacts = check('facts.json: campos obligatorios');
if (facts) {
  const e = cFacts.errors;
  const need = (cond, msg) => { if (!cond) e.push(msg); };
  const p = facts.person ?? {};
  for (const f of ['name', 'fullName', 'role', 'city']) need(typeof p[f] === 'string' && p[f].trim(), `person.${f}`);
  need(EMAIL_RE.test(p.email ?? ''), 'person.email (formato de email)');
  need(HTTPS_RE.test(facts.site?.url ?? ''), 'site.url (https://…)');
  need(locales.includes(defaultLocale), 'site.defaultLocale (debe estar en site.locales)');
  need(locales.includes('es') && locales.includes('en'), 'site.locales (al menos es y en)');
  for (const f of ['linkedin', 'github', 'homepanelRepo']) need(HTTPS_RE.test(facts.links?.[f] ?? ''), `links.${f} (https://…)`);
  need(YM_RE.test(facts.career?.start ?? ''), 'career.start (AAAA-MM)');
  const stages = facts.career?.stages;
  need(Array.isArray(stages) && stages.length > 0, 'career.stages (lista no vacía)');
  (stages ?? []).forEach((s, i) => {
    need(s.id && s.title, `career.stages[${i}].id/title`);
    need(YM_RE.test(s.start ?? ''), `career.stages[${i}].start (AAAA-MM)`);
    need(s.end === null || YM_RE.test(s.end ?? ''), `career.stages[${i}].end (AAAA-MM o null)`);
  });
  const certs = facts.certifications;
  need(Array.isArray(certs) && certs.length > 0, 'certifications (lista no vacía)');
  (certs ?? []).forEach((c, i) => {
    need(c.id && c.name && c.issuer, `certifications[${i}].id/name/issuer`);
    need(YMD_RE.test(c.date ?? ''), `certifications[${i}].date (AAAA-MM-DD)`);
    need(HTTPS_RE.test(c.verifyUrl ?? ''), `certifications[${i}].verifyUrl (https://…)`);
  });
  // Lo que education.mjs, stack.mjs y la lista de idiomas dan por supuesto.
  need(Array.isArray(facts.education) && facts.education.length > 0, 'education (lista no vacía)');
  (facts.education ?? []).forEach((x, i) => {
    need(x.title && x.school, `education[${i}].title/school`);
    need(x.i18n?.meta, `education[${i}].i18n.meta (centro y fechas: la plantilla lo pinta siempre)`);
    if (x.grade !== undefined) need(x.grade?.value !== undefined && x.grade?.scale !== undefined, `education[${i}].grade.value/scale (la nota se pinta con ellos si no hay i18n.grade)`);
  });
  (certs ?? []).forEach((c, i) => need(c.i18n?.meta, `certifications[${i}].i18n.meta (texto bajo el título)`));
  (facts.languages ?? []).forEach((l, i) => need(l.i18n?.name, `languages[${i}].i18n.name`));
  for (const f of ['daily', 'known', 'exploring']) need(Array.isArray(facts.stack?.[f]) && facts.stack[f].length > 0, `stack.${f} (lista no vacía)`);
  need(Array.isArray(facts.languages) && facts.languages.length > 0 && facts.languages.every((l) => l.code && l.level), 'languages (code y level)');
  // Nada de teléfono: ni siquiera un campo con ese nombre.
  if (/"(phone|telephone|tel|telefono|mobile|movil)"\s*:/i.test(JSON.stringify(facts))) e.push('facts.json no puede tener un campo de teléfono');
}

const cRefs = check('facts.json: referencias i18n existentes');
if (facts && base) {
  const refs = [];
  (function walk(v, where) {
    if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${where}[${i}]`));
    else if (v && typeof v === 'object') {
      for (const [k, x] of Object.entries(v)) {
        if (k === 'i18n') for (const [w, key] of strings(x, `${where} › i18n`)) refs.push([w, key]);
        else walk(x, `${where} › ${k}`);
      }
    }
  })(facts, 'facts.json');
  for (const [where, key] of refs) for (const [code, d] of Object.entries(dicts)) if (!(key in d)) cRefs.errors.push(`${where}: "${key}" no existe en ${code}.json`);
  cRefs.note = `${refs.length} referencias`;
}

// ---------- 5. guardia de privacidad sobre ficheros generados (opcional) ----------
if (scanPaths.length) {
  const cScan = check(`guardia de privacidad y marcas sobre ${scanPaths.map((p) => path.relative(ROOT, p) || '.').join(', ')}`);
  const TEXT_EXT = new Set(['.html', '.htm', '.xml', '.txt', '.json', '.js', '.mjs', '.css', '.svg', '.webmanifest', '.md']);
  let n = 0;
  const visit = (p) => {
    if (!fs.existsSync(p)) { cScan.errors.push(`${p}: no existe`); return; }
    if (fs.statSync(p).isDirectory()) { for (const f of fs.readdirSync(p)) visit(path.join(p, f)); return; }
    if (!TEXT_EXT.has(path.extname(p).toLowerCase())) return;
    n++;
    // Se quitan estilos y etiquetas para no confundir coordenadas SVG o CSS con teléfonos.
    const raw = fs.readFileSync(p, 'utf8');
    const text = raw.replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]*>/g, ' ');
    const rel = path.relative(ROOT, p);
    if (MARKER_RE.test(raw)) cScan.errors.push(`${rel}: marca [FALTA]/[REVISAR]`);
    if (/href\s*=\s*["']?\s*tel:/i.test(raw)) cScan.errors.push(`${rel}: enlace tel:`);
    // Valores de atributos que no son geometría ni estilo (d, points, viewBox, transform, style… tienen números largos).
    for (const m of raw.matchAll(/\s([a-zA-Z:-]+)\s*=\s*"([^"]*)"/g)) {
      if (/^(d|points|viewbox|transform|style|x\d?|y\d?|cx|cy|r|width|height|offset|stroke-dasharray|integrity|content-security-policy)$/i.test(m[1])) continue;
      if (PHONE_RE.test(m[2].replace(URL_RE, ' '))) { cScan.errors.push(`${rel}: posible teléfono en el atributo ${m[1]}`); break; }
    }
    for (const issue of new Set([...privacyIssues(text, terms), ...privacyIssues(raw, terms).filter((i) => !i.startsWith('posible teléfono'))])) cScan.errors.push(`${rel}: ${issue}`);
  };
  scanPaths.forEach(visit);
  cScan.note = `${n} ficheros`;
}

// ---------- resumen ----------
console.log(`check-content · ${path.relative(ROOT, contentDir) || '.'}`);
let failed = 0;
for (const c of checks) {
  const ok = c.errors.length === 0;
  if (!ok) failed++;
  console.log(`  ${ok ? 'OK   ' : 'FALLO'} ${c.name}${c.note ? ` (${c.note})` : ''}`);
  for (const err of c.errors.slice(0, 20)) console.log(`        - ${err}`);
  if (c.errors.length > 20) console.log(`        … y ${c.errors.length - 20} más`);
}
console.log(failed ? `\n${failed} comprobación(es) con fallos.` : `\nTodo correcto: ${checks.length} comprobaciones.`);
process.exit(failed ? 1 : 0);
