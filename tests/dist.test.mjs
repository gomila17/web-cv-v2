// Salida de dist/ tras el build: un h1 por página, hreflang/canonical, sitemap, 404 con prefijo de idioma y guardia.
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const page = (p) => fs.readFileSync(path.join(DIST, p), 'utf8');
const env = { ...process.env, PRIVACY_TERMS: '', PRIVACY_TERMS_FILE: path.join(ROOT, 'no-existe') };

before(() => {
  // El build ya ejecuta la guardia sobre dist/; si falla, falla todo este fichero.
  const r = spawnSync(process.execPath, [path.join(ROOT, 'scripts/build.mjs')], { encoding: 'utf8', env });
  assert.equal(r.status, 0, r.stdout + r.stderr);
});

test('cada página tiene exactamente un h1', () => {
  for (const p of ['index.html', 'es/index.html', 'en/index.html', 'es/404.html', 'en/404.html']) {
    assert.equal((page(p).match(/<h1[\s>]/g) ?? []).length, 1, p);
  }
});

test('las páginas indexables traen canonical y hreflang es, en y x-default', () => {
  for (const [p, canon] of [['es/index.html', '/es/'], ['en/index.html', '/en/'], ['index.html', '/']]) {
    const h = page(p);
    assert.match(h, new RegExp(`<link rel="canonical" href="https://[^"/]+${canon}">`), p);
    for (const code of ['es', 'en', 'x-default']) assert.match(h, new RegExp(`<link rel="alternate" hreflang="${code}" href="https://[^"]+">`), `${p} ${code}`);
  }
  assert.match(page('es/404.html'), /<meta name="robots" content="noindex">/);
});

test('sitemap.xml lista es y en, con alternativas, y no incluye la raíz "/"', () => {
  const x = page('sitemap.xml');
  const locs = [...x.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  assert.deepEqual(locs, ['/es/', '/en/']);
  assert.match(x, /hreflang="x-default"/);
});

test('las 404 existen en es y en, en su idioma y con los enlaces de la cabecera con prefijo', () => {
  for (const code of ['es', 'en']) {
    const h = page(`${code}/404.html`);
    assert.match(h, new RegExp(`<html[^>]*lang="${code}"`));
    const nav = h.match(/<header[\s\S]*?<\/header>/)[0];
    const links = [...nav.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)].map((m) => m[1]).filter((u) => !u.startsWith('#'));
    for (const u of links) assert.match(u, /^\/(es|en)\//, `${code}: enlace sin prefijo de idioma: ${u}`);
    assert.ok(links.filter((u) => u.startsWith(`/${code}/#`)).length >= 6, 'secciones con el prefijo de su idioma');
  }
});

test('check-content --scan dist pasa', () => {
  const r = spawnSync(process.execPath, [path.join(ROOT, 'scripts/check-content.mjs'), '--scan', DIST], { encoding: 'utf8', env });
  assert.equal(r.status, 0, r.stdout + r.stderr);
});
