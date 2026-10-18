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
  for (const p of ['index.html', 'es/index.html', 'en/index.html', 'es/404.html', 'en/404.html', 'es/privacidad/index.html', 'en/privacy/index.html']) {
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

test('privacidad y cookies: una página por idioma, noindex, fuera del sitemap, enlazada desde el pie y con selector de idioma cruzado', () => {
  const pages = { es: ['es/privacidad/index.html', '/es/privacidad/', '/en/privacy/'], en: ['en/privacy/index.html', '/en/privacy/', '/es/privacidad/'] };
  for (const [code, [file, self, other]] of Object.entries(pages)) {
    const h = page(file);
    assert.match(h, new RegExp(`<html[^>]*lang="${code}"`));
    assert.match(h, /<meta name="robots" content="noindex, follow">/);
    assert.match(h, new RegExp(`<link rel="canonical" href="https://[^"/]+${self}">`));
    const langs = [...h.match(/<div class="lang"[\s\S]*?<\/div>/)[0].matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
    assert.deepEqual(langs.sort(), [self, other].sort(), `${code}: el selector de idioma lleva a la otra versión`);
    assert.ok(page(`${code}/index.html`).includes(`<a href="${self}">`), `${code}: el pie enlaza a la página de privacidad`);
    assert.ok(!page('sitemap.xml').includes(self), 'no entra en el sitemap');
  }
});

test('la web no carga nada de terceros ni guarda más que tg_lang y tg-theme (si cambia, hace falta aviso de cookies)', () => {
  const src = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
  for (const p of ['es/index.html', 'en/index.html', 'es/privacidad/index.html']) {
    const h = page(p).replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, '');
    const external = [...h.matchAll(/<(?:script|link|img|iframe|source)\b[^>]*\b(?:src|href)="(https?:\/\/[^"]+)"/g)]
      .filter((m) => !/rel="(?:canonical|alternate)"/.test(m[0]));
    assert.deepEqual(external.map((m) => m[1]), [], `${p}: recurso externo cargado`);
  }
  const js = src('src/scripts/main.js') + src('src/scripts/head.js');
  assert.deepEqual([...new Set([...js.matchAll(/(?:setItem|getItem|removeItem)\('([^']+)'/g)].map((m) => m[1]))], ['tg-theme']);
  assert.deepEqual([...new Set([...js.matchAll(/document\.cookie\s*=\s*'([a-z_]+)=/g)].map((m) => m[1]))], ['tg_lang']);
  assert.ok(!/sessionStorage|indexedDB|fetch\(|XMLHttpRequest|sendBeacon/.test(js), 'main.js/head.js: nada de almacenamiento ni red adicionales');
});

test('check-content --scan dist pasa', () => {
  const r = spawnSync(process.execPath, [path.join(ROOT, 'scripts/check-content.mjs'), '--scan', DIST], { encoding: 'utf8', env });
  assert.equal(r.status, 0, r.stdout + r.stderr);
});

test('iconos: svg, png 48, ico en la raíz y apple-touch-icon, enlazados en todas las páginas', () => {
  for (const f of ['favicon.svg', 'favicon-48.png', 'favicon.ico', 'apple-touch-icon.png']) assert.ok(fs.existsSync(path.join(DIST, f)), f);
  for (const p of ['index.html', 'es/index.html', 'en/index.html', 'es/404.html', 'es/privacidad/index.html', 'en/privacy/index.html']) {
    const h = page(p);
    for (const href of ['/favicon.svg', '/favicon-48.png', '/favicon.ico', '/apple-touch-icon.png']) assert.ok(h.includes(`href="${href}`), `${p}: falta ${href}`);
  }
});
