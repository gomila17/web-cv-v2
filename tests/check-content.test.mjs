// Pruebas del validador: copia content/ a una carpeta temporal, la rompe a propósito
// y comprueba que scripts/check-content.mjs falla (exit 1). Sin dependencias: node:test.
// Uso: npm test

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SCRIPT = path.join(ROOT, 'scripts', 'check-content.mjs');

// Ejecuta el validador sobre una copia de content/ modificada por `mutate(dir)`.
function runOnCopy(mutate, env = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'tg-content-'));
  try {
    for (const f of ['es.json', 'en.json', 'facts.json']) fs.copyFileSync(path.join(ROOT, 'content', f), path.join(dir, f));
    if (mutate) mutate(dir);
    const r = spawnSync(process.execPath, [SCRIPT, '--content', dir], { encoding: 'utf8', env: { ...process.env, PRIVACY_TERMS: '', ...env } });
    return { code: r.status, out: r.stdout + r.stderr };
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}
const edit = (dir, file, fn) => {
  const p = path.join(dir, file);
  const data = JSON.parse(fs.readFileSync(p, 'utf8'));
  fn(data);
  fs.writeFileSync(p, JSON.stringify(data, null, 2));
};

test('el contenido del repo pasa', () => {
  const r = runOnCopy();
  assert.equal(r.code, 0, r.out);
});

test('falla si falta una clave en un idioma', () => {
  const r = runOnCopy((d) => edit(d, 'en.json', (j) => { delete j['h.sub']; }));
  assert.equal(r.code, 1);
  assert.match(r.out, /falta en en\.json: h\.sub/);
});

test('falla con un valor vacío', () => {
  const r = runOnCopy((d) => edit(d, 'es.json', (j) => { j['h.ai'] = '  '; }));
  assert.equal(r.code, 1);
  assert.match(r.out, /es\.json › h\.ai/);
});

test('falla con una marca [FALTA] o [REVISAR]', () => {
  assert.equal(runOnCopy((d) => edit(d, 'es.json', (j) => { j['h.ai'] += ' [FALTA: algo]'; })).code, 1);
  assert.equal(runOnCopy((d) => edit(d, 'facts.json', (j) => { j.person.city = '[REVISAR] Barcelona'; })).code, 1);
});

test('falla con una IP privada', () => {
  for (const ip of ['10.0.0.5', '172.20.1.1', '192.168.1.10']) {
    const r = runOnCopy((d) => edit(d, 'en.json', (j) => { j['hm.ctx'] += ` Host ${ip}.`; }));
    assert.equal(r.code, 1, ip);
    assert.match(r.out, /IP privada/);
  }
});

test('no confunde IPs públicas ni versiones con IPs privadas', () => {
  const r = runOnCopy((d) => edit(d, 'en.json', (j) => { j['hm.ctx'] += ' 8.8.8.8 and v1.10.0.5'; }));
  assert.equal(r.code, 0, r.out);
});

test('falla con algo con forma de teléfono', () => {
  for (const tel of ['+34 600 123 456', '600123456', '600-12-34-56']) {
    const r = runOnCopy((d) => edit(d, 'es.json', (j) => { j['f.p'] += ` Llámame al ${tel}.`; }));
    assert.equal(r.code, 1, tel);
    assert.match(r.out, /posible teléfono/);
  }
});

test('falla con un campo de teléfono en facts', () => {
  const r = runOnCopy((d) => edit(d, 'facts.json', (j) => { j.person.phone = 'x'; }));
  assert.equal(r.code, 1);
});

test('falla con un término privado de PRIVACY_TERMS sin imprimirlo', () => {
  const r = runOnCopy(null, { PRIVACY_TERMS: 'termino-de-prueba,Vikunja' });
  assert.equal(r.code, 1);
  assert.match(r.out, /término privado n\.º 2/);
  assert.doesNotMatch(r.out.split('\n').filter((l) => l.includes('término privado')).join('\n'), /Vikunja/);
});

test('falla si facts.json pierde un campo obligatorio', () => {
  const r = runOnCopy((d) => edit(d, 'facts.json', (j) => { delete j.certifications[0].verifyUrl; }));
  assert.equal(r.code, 1);
  assert.match(r.out, /verifyUrl/);
});

test('falla si una referencia i18n de facts no existe', () => {
  const r = runOnCopy((d) => edit(d, 'facts.json', (j) => { j.stack.exploring.push({ i18n: 'st.nope' }); }));
  assert.equal(r.code, 1);
  assert.match(r.out, /st\.nope/);
});

test('falla si el HTML en línea o los huecos difieren entre idiomas', () => {
  assert.equal(runOnCopy((d) => edit(d, 'en.json', (j) => { j['h.title'] = j['h.title'].replace(/<\/?em>/g, ''); })).code, 1);
  assert.equal(runOnCopy((d) => edit(d, 'en.json', (j) => { j['a.p1'] = j['a.p1'].replace('{years}', 'four'); })).code, 1);
  assert.equal(runOnCopy((d) => edit(d, 'es.json', (j) => { j['h.ai'] += ' <script>x</script>'; })).code, 1);
});
