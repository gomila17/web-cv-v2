#!/usr/bin/env node
// Servidor local de desarrollo: build, sirve dist/ en http://127.0.0.1:8080 (PORT para cambiarlo)
// y reconstruye al cambiar content/, src/ o assets/. Solo módulos nativos; no se usa en producción (Nginx).
// El build corre en un proceso hijo: así cada build importa los partials de nuevo (sin caché de módulos).
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const PORT = Number(process.env.PORT) || 8080;
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.json': 'application/json', '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml', '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json' };

const build = () => spawnSync(process.execPath, [path.join(ROOT, 'scripts/build.mjs')], { stdio: 'inherit' }).status === 0;
build();

http.createServer((req, res) => {
  let url;
  try { url = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); } catch { url = '/'; }
  if (url === '/') { // como Nginx: cookie tg_lang o idioma del navegador (ver deploy/nginx.conf)
    const c = /(?:^|;\s*)tg_lang=(es|en)\b/.exec(req.headers.cookie ?? '');
    const a = (req.headers['accept-language'] ?? '').toLowerCase();
    const l = c ? c[1] : (!a || /^\s*(es|ca|gl|eu)\b/.test(a) ? 'es' : 'en');
    res.writeHead(302, { location: `/${l}/`, vary: 'Accept-Language, Cookie', 'cache-control': 'no-store' }).end(); return;
  }
  if (url.includes('\0')) { res.writeHead(400).end(); return; }
  const file = path.join(DIST, path.normalize(url.endsWith('/') ? url + 'index.html' : url));
  if (!file.startsWith(DIST + path.sep)) { res.writeHead(403).end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) { res.writeHead(301, { location: url + '/' }).end(); return; }
  fs.readFile(file, (err, body) => {
    if (err) { // 404 propia del idioma de la ruta, como Nginx
      const nf = path.join(DIST, url.startsWith('/en/') ? 'en' : 'es', '404.html');
      res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' }).end(fs.existsSync(nf) ? fs.readFileSync(nf) : `404: ${url}`); return;
    }
    res.writeHead(200, { 'content-type': TYPES[path.extname(file)] ?? 'application/octet-stream', 'cache-control': 'no-store' }).end(body);
  });
}).listen(PORT, '127.0.0.1', () => console.log(`dev · http://127.0.0.1:${PORT}/  (Ctrl+C para parar)`));

// Reconstruir al guardar (con una pausa corta: los editores escriben varias veces seguidas).
let timer;
for (const dir of ['content', 'src', 'assets']) {
  fs.watch(path.join(ROOT, dir), { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(() => console.log(build() ? 'dev · reconstruido' : 'dev · el build ha fallado; dist/ puede estar incompleto'), 150);
  });
}
