#!/usr/bin/env node
// Genera los PDF del currículum (src/static/cv/Toni-Gomila-CV-ES.pdf y -EN.pdf) desde dist/<idioma>/cv.html con
// Edge o Chrome en modo sin ventana (sin instalar nada). Es manual, solo cuando cambia el contenido:
//   npm run build && node scripts/make-cv-pdf.mjs
// Después, `npm run build` copia los PDF a dist/cv/. El PDF no lleva autor ni metadatos personales: solo el título de la página.
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const OUT = path.join(ROOT, 'src/static/cv');
const BROWSERS = [
  process.env.CV_BROWSER,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/microsoft-edge',
].filter(Boolean);
const browser = BROWSERS.find((p) => fs.existsSync(p));
if (!browser) { console.error('make-cv-pdf: no encuentro Edge ni Chrome (CV_BROWSER=ruta para indicarlo).'); process.exit(1); }
if (!fs.existsSync(path.join(DIST, 'es/cv.html'))) { console.error('make-cv-pdf: falta dist/ (ejecuta npm run build antes).'); process.exit(1); }

const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript', '.svg': 'image/svg+xml' };
const server = http.createServer((req, res) => {
  const file = path.join(DIST, path.normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)));
  if (!file.startsWith(DIST) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404).end(); return; }
  res.writeHead(200, { 'content-type': TYPES[path.extname(file)] ?? 'application/octet-stream' }).end(fs.readFileSync(file));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const port = server.address().port;
fs.mkdirSync(OUT, { recursive: true });
let failed = false;
for (const l of ['es', 'en']) {
  const out = path.join(OUT, `Toni-Gomila-CV-${l.toUpperCase()}.pdf`);
  fs.rmSync(out, { force: true });
  // Asíncrono a propósito: con spawnSync el servidor de este mismo proceso no podría responder al navegador.
  const status = await new Promise((resolve) => {
    const p = spawn(browser, ['--headless=new', '--disable-gpu', '--no-pdf-header-footer', '--no-first-run',
      `--user-data-dir=${path.join(ROOT, 'dist/.cv-profile')}`, `--print-to-pdf=${out}`, `http://127.0.0.1:${port}/${l}/cv.html`], { stdio: 'ignore' });
    const timer = setTimeout(() => { p.kill(); resolve('tiempo agotado'); }, 60000);
    p.on('exit', (code) => { clearTimeout(timer); resolve(code); });
  });
  const ok = fs.existsSync(out) && fs.statSync(out).size > 1000;
  console.log(`${ok ? 'OK ' : 'FALLO'} ${path.relative(ROOT, out)}${ok ? ` (${Math.round(fs.statSync(out).size / 1024)} KB)` : ` (estado ${status})`}`);
  failed ||= !ok;
}
server.close();
fs.rmSync(path.join(DIST, '.cv-profile'), { recursive: true, force: true });
process.exit(failed ? 1 : 0);
