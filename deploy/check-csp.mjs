#!/usr/bin/env node
// Comprueba que la CSP de deploy/nginx.conf autoriza exactamente el JS en línea que genera el build.
//   node deploy/check-csp.mjs [dist]     (CI lo ejecuta después de npm run build)
// La CSP permite el <script> en línea del <head> por su hash sha256 (por qué: deploy/README.md).
// Si head.js cambia, el hash cambia: sin esta comprobación, el tema dejaría de aplicarse en
// producción sin que nada fallara. Falla también si aparece JS que la CSP bloquearía siempre
// (atributos on*="…" o enlaces javascript:). Sin dependencias; Node >= 21.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(process.argv[2] ?? path.join(HERE, '..', 'dist'));
const NGINX = path.join(HERE, 'nginx.conf');

const htmlFiles = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const p = path.join(dir, e.name);
  return e.isDirectory() ? htmlFiles(p) : e.name.endsWith('.html') ? [p] : [];
});

if (!fs.existsSync(DIST)) { console.error(`check-csp: no existe ${DIST} (¿falta npm run build?)`); process.exit(1); }
const csp = fs.readFileSync(NGINX, 'utf8').match(/add_header\s+Content-Security-Policy\s+"([^"]+)"/)?.[1];
if (!csp) { console.error('check-csp: no encuentro la cabecera Content-Security-Policy en deploy/nginx.conf'); process.exit(1); }

const needed = new Map(); // hash → ficheros
const handlers = new Map(); // manejadores en atributos on*: necesitan además 'unsafe-hashes'
const errors = [];
// El navegador calcula el hash del valor del atributo ya decodificado (&#39; → ').
const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };
const decode = (s) => s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) =>
  e[0] === '#' ? String.fromCodePoint(e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : Number(e.slice(1))) : ENT[e.toLowerCase()] ?? m);
for (const file of htmlFiles(DIST)) {
  const html = fs.readFileSync(file, 'utf8');
  const rel = path.relative(DIST, file);
  for (const [, attrs, body] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (/\bsrc\s*=/i.test(attrs)) continue; // externo: lo cubre 'self'
    const type = attrs.match(/\btype\s*=\s*["']?([^"'\s>]+)/i)?.[1]?.toLowerCase();
    if (type && !/^(text|application)\/(java|ecma)script$|^module$/.test(type)) continue; // datos (JSON-LD): no se ejecutan
    const hash = `sha256-${crypto.createHash('sha256').update(body, 'utf8').digest('base64')}`;
    needed.set(hash, [...(needed.get(hash) ?? []), rel]);
  }
  // Manejadores en atributos (onerror="…"): solo pasan con 'unsafe-hashes' + su hash exacto.
  for (const [, name, dq, sq] of html.matchAll(/\s(on[a-z]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi)) {
    const hash = `sha256-${crypto.createHash('sha256').update(decode(dq ?? sq), 'utf8').digest('base64')}`;
    const key = `${hash} (${name})`;
    handlers.set(key, [...(handlers.get(key) ?? []), rel]);
    needed.set(hash, [...(needed.get(hash) ?? []), `${rel} ${name}`]);
  }
  if (/\bhref\s*=\s*["']?\s*javascript:/i.test(html)) errors.push(`${rel}: enlace javascript: (la CSP lo bloquea)`);
}

const allowed = new Set([...csp.matchAll(/'(sha256-[A-Za-z0-9+/=]+)'/g)].map((m) => m[1]));
for (const [hash, files] of needed) {
  if (!allowed.has(hash)) errors.push(`script en línea sin autorizar en la CSP (${files.join(', ')}): añade '${hash}' a script-src en deploy/nginx.conf`);
}
if (handlers.size && !/'unsafe-hashes'/.test(csp)) {
  errors.push(`hay manejadores en atributos (${[...handlers.keys()].join(', ')}): script-src necesita 'unsafe-hashes' además de su hash (o pasarlos a main.js con addEventListener)`);
}
for (const hash of allowed) {
  if (!needed.has(hash)) console.warn(`check-csp: aviso: '${hash}' está en la CSP pero ya no corresponde a ningún script; se puede quitar`);
}

if (errors.length) {
  for (const e of errors) console.error(`  FALLO ${e}`);
  console.error('\ncheck-csp: la CSP de deploy/nginx.conf no cuadra con dist/. Tras corregirla, copiarla también a la LXC (deploy/README.md).');
  process.exit(1);
}
console.log(`check-csp: OK (${needed.size} script(s) en línea autorizados por hash)`);
