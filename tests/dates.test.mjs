// Años completos y tramo en curso: límites de mes, y que no dependan de la zona horaria (todo UTC).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fullYears, monthOf, buildDate } from '../scripts/dates.mjs';

const d = (iso) => new Date(iso);

test('fullYears cuenta años completos y cambia justo el día 1 del mes de aniversario (UTC)', () => {
  assert.equal(fullYears('2022-03', d('2026-02-28T23:59:59Z')), 3);
  assert.equal(fullYears('2022-03', d('2026-03-01T00:00:00Z')), 4);
  assert.equal(fullYears('2022-03', d('2026-03-31T23:59:59Z')), 4);
  assert.equal(fullYears('2022-12', d('2023-11-30T12:00:00Z')), 0);
  assert.equal(fullYears('2022-12', d('2023-12-01T00:00:00Z')), 1);
  assert.equal(fullYears('2022-01', d('2022-01-15T00:00:00Z')), 0);
});

test('monthOf da AAAA-MM en UTC y cambia a medianoche UTC en los límites de mes y de año', () => {
  assert.equal(monthOf(d('2026-10-31T23:59:59Z')), '2026-10');
  assert.equal(monthOf(d('2026-11-01T00:00:00Z')), '2026-11');
  assert.equal(monthOf(d('2026-12-31T23:59:59Z')), '2026-12');
  assert.equal(monthOf(d('2027-01-01T00:00:00Z')), '2027-01');
});

test('buildDate respeta SOURCE_DATE_EPOCH', () => {
  assert.equal(buildDate({ SOURCE_DATE_EPOCH: '1767225600' }).toISOString(), '2026-01-01T00:00:00.000Z');
  assert.ok(Math.abs(buildDate({}) - Date.now()) < 5000);
});

test('el resultado no cambia con la zona horaria de la máquina', () => {
  const code = `import('${new URL('../scripts/dates.mjs', import.meta.url).href}').then(m => {
    const x = new Date('2026-03-01T00:30:00Z'); console.log(m.fullYears('2022-03', x), m.monthOf(x)); })`;
  const out = ['UTC', 'Pacific/Honolulu', 'Pacific/Kiritimati', 'Europe/Madrid'].map((TZ) =>
    spawnSync(process.execPath, ['-e', code], { encoding: 'utf8', env: { ...process.env, TZ } }).stdout.trim());
  assert.deepEqual([...new Set(out)], ['4 2026-03']);
});
