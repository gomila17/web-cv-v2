/**
 * Partial: experience
 * Sección 03 Experiencia (#experiencia): empresa, cota (aria-hidden; tramos proporcionales a meses calculados de facts.career.stages) y tarjetas de puesto con etiquetas de tecnología.
 *
 * Claves de content/<locale>.json: n.exp, e.co, e.<p>.w y e.<p>.1… (p = s, d, i), k.0…, a.tech
 * Datos de facts.json: facts.career (company, stages[id, title, short, start, end, tech])
 * Dueño: plantillas. Contrato completo: CONTRACTS.md §5.
 *
 * @param {object} ctx  contexto de render (forma en src/templates/README.md)
 * @returns {string} HTML
 */
// Prefijo de clave de cada etapa (heredado de la v6: e.s = Senior, e.d = Developer, e.i = Intern).
const KEY = { senior: 's', dev: 'd', intern: 'i' };
// Opacidad del tramo, del más reciente al más antiguo (valores de la v6; no son fechas).
const OPACITY = ['1', '.78', '.5'];

/** Meses entre dos 'AAAA-MM'. */
function months(from, to) {
  const [fy, fm] = from.split('-').map(Number);
  const [ty, tm] = to.split('-').map(Number);
  return (ty - fy) * 12 + (tm - fm);
}
const pct = (n) => `${+n.toFixed(2)}%`;

export default function render(ctx) {
  const { t, esc, facts, today } = ctx;
  const { company, stages: raw } = facts.career;
  const stages = [...raw].sort((a, b) => a.start.localeCompare(b.start)); // la cota va de la más antigua a la actual
  const n = stages.length;
  // Viñetas: tantas como claves e.<p>.1, e.<p>.2… existan (el contenido manda, no el partial).
  const has = (key) => { try { t(key); return true; } catch { return false; } };
  const bullets = (p) => { const out = []; for (let i = 1; has(`e.${p}.${i}`); i++) out.push(t(`e.${p}.${i}`)); return out; };

  // Cota: cada tramo mide sus meses reales; el tramo en curso (end: null) termina en el mes del build.
  let acc = 0;
  const segs = stages.map((s, i) => {
    const m = months(s.start, s.end ?? today);
    const seg = { s, i, m, c: acc, job: n - 1 - i, o: OPACITY[n - 1 - i] ?? OPACITY[OPACITY.length - 1] };
    acc += m;
    return seg;
  });
  const total = acc;
  const segHtml = segs.map(({ s, m, c, job, o }) => {
    const nodes = `<i class="bar"></i><i class="nd"></i>${s.end == null ? '<i class="nd end now"></i>' : ''}`;
    return `        <div class="seg" data-job="${job}" style="--m:${m};--c:${c};--o:${o}"><span class="lbl">${esc(s.short)}</span><div class="track">${nodes}</div></div>`;
  }).join('\n');
  // Marcas: una por inicio de etapa, en su posición proporcional (left y --at calculados, no fijos en el CSS).
  const ticks = segs.map(({ s, i, c }) => {
    const style = i === 0 ? '' : ` style="left:${pct((c / total) * 100)};--at:${c}"`;
    return `        <span class="tk t${i}"${style}><span class="d">${t(`k.${i}`)}</span><span class="y">${esc(s.start.slice(0, 4))}</span></span>`;
  }).join('\n');

  const tech = esc(t('a.tech'));
  const jobs = [...stages].reverse().map((s) => {
    const p = KEY[s.id];
    if (!p) throw new Error(`etapa "${s.id}" sin prefijo de clave en experience.mjs`);
    const items = bullets(p).map((b) => `            <li>${b}</li>`).join('\n');
    const tags = s.tech.map((x) => `<li>${esc(x)}</li>`).join('');
    return `        <li class="job card rv rv-settle">
          <div class="job-h">
            <h3>${esc(s.title)}</h3>
            <span class="when">${t(`e.${p}.w`)}</span>
          </div>
          <ul class="bul">
${items}
          </ul>
          <ul class="tags" aria-label="${tech}">${tags}</ul>
        </li>`;
  }).join('\n');

  return `<section class="sec" id="experiencia" aria-labelledby="h-exp">
    <span class="dots" aria-hidden="true"></span>
    <div class="wrap">
      <div class="sec-head"><span class="sec-no" aria-hidden="true">03</span><h2 id="h-exp">${t('n.exp')}</h2></div>
      <p class="company rv rv-fade"><strong>${esc(company)}</strong> · <span>${t('e.co')}</span></p>

      <div class="cota rv-cota" id="cota" aria-hidden="true" style="--total:${total}">
${segHtml}
${ticks}
      </div>

      <ol class="jobs">
${jobs}
      </ol>
    </div>
  </section>`;
}
