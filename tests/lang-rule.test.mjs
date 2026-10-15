// Regla de idioma de la raíz (/): idéntica en scripts/dev.mjs, src/scripts/head.js y deploy/nginx.conf.
// 1) las tres reglas contienen la misma alternancia con sus \b y \s (ya hubo un fallo de barras perdidas);
// 2) dev.mjs (arrancado en un puerto libre) devuelve lo esperado.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import net from 'node:net';
import http from 'node:http';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

test('head.js, dev.mjs y nginx.conf usan la misma alternancia de idiomas con sus \\b y \\s', () => {
  const dev = read('scripts/dev.mjs'), head = read('src/scripts/head.js'), nginx = read('deploy/nginx.conf');
  assert.ok(dev.includes('/^\\s*(es|ca|gl|eu)\\b/.test(a)'), 'dev.mjs: /^\\s*(es|ca|gl|eu)\\b/');
  assert.ok(head.includes('/^(es|ca|gl|eu)\\b/.test(n)'), 'head.js: /^(es|ca|gl|eu)\\b/ (navigator.languages no trae espacios)');
  assert.ok(nginx.includes('"~*^\\s*(es|ca|gl|eu)\\b"'), 'nginx.conf: ~*^\\s*(es|ca|gl|eu)\\b');
  const cookie = 'tg_lang=(es|en)\\b';
  assert.ok(dev.includes(cookie) && head.includes(cookie), 'cookie tg_lang=(es|en)\\b en dev.mjs y head.js');
  assert.match(nginx, /map \$cookie_tg_lang \$web_cv_lang_cookie \{\s*es\s+es;\s*en\s+en;\s*default\s+"";/);
  assert.match(nginx, /map \$http_accept_language \$web_cv_lang_browser \{\s*""\s+es;/);
});

let server, port;
const freePort = () => new Promise((res) => { const s = net.createServer().listen(0, '127.0.0.1', () => { const p = s.address().port; s.close(() => res(p)); }); });
const get = (headers) => new Promise((res, rej) => {
  http.get({ host: '127.0.0.1', port, path: '/', headers }, (r) => { r.resume(); res({ status: r.statusCode, location: r.headers.location }); }).on('error', rej);
});

before(async () => {
  port = await freePort();
  server = spawn(process.execPath, [path.join(ROOT, 'scripts/dev.mjs')], { env: { ...process.env, PORT: String(port) }, stdio: ['ignore', 'pipe', 'inherit'] });
  await new Promise((res, rej) => {
    server.on('exit', (c) => rej(new Error(`dev.mjs terminó con ${c}`)));
    server.stdout.on('data', (b) => { if (String(b).includes('dev · http://')) res(); });
  });
});
after(() => { server?.kill(); });

test('dev.mjs: idioma del navegador sin cookie', async () => {
  const cases = [['', 'es'], ['es-ES,es;q=0.9', 'es'], ['ES', 'es'], [' es', 'es'], ['es-419', 'es'], ['ca', 'es'], ['gl', 'es'], ['eu', 'es'],
    ['en-US', 'en'], ['fr', 'en'], ['*', 'en'], ['fr,es;q=0.5', 'en'], ['esperanto', 'en']];
  for (const [al, want] of cases) {
    const r = await get(al === '' ? {} : { 'accept-language': al });
    assert.equal(r.status, 302);
    assert.equal(r.location, `/${want}/`, `Accept-Language ${JSON.stringify(al)}`);
  }
});

test('dev.mjs: la cookie tg_lang manda sobre el navegador y los valores raros se ignoran', async () => {
  const cases = [['tg_lang=es', 'en-US', 'es'], ['tg_lang=en', 'es-ES', 'en'], ['a=1; tg_lang=en', 'es', 'en'], ['tg_lang=fr', 'es', 'es'],
    ['tg_lang=fr', 'en', 'en'], ['tg_lang=', 'es', 'es'], ['tg_lang=english', 'es', 'es'], ['xtg_lang=en', 'es', 'es'], ['tg_lang=ES', 'en', 'en']];
  for (const [cookie, al, want] of cases) {
    const r = await get({ cookie, 'accept-language': al });
    assert.equal(r.location, `/${want}/`, `cookie ${cookie} + ${al}`);
  }
});
