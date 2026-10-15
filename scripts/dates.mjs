// Fechas del build, siempre en UTC: el resultado no depende de la zona horaria de la máquina
// y es coherente con SOURCE_DATE_EPOCH (que es un instante UTC).

/** Años completos desde 'AAAA-MM' hasta `date` (decisión 14: se recalcula en cada build, sin cron). */
export function fullYears(start, date) {
  const [y, m] = start.split('-').map(Number);
  return date.getUTCFullYear() - y - (date.getUTCMonth() + 1 < m ? 1 : 0);
}

/** 'AAAA-MM' (UTC) de `date`: fin del tramo en curso de la cota. */
export const monthOf = (date) => date.toISOString().slice(0, 7);

/** Fecha del build: SOURCE_DATE_EPOCH (segundos) si existe; si no, ahora. */
export const buildDate = (env = process.env) => (env.SOURCE_DATE_EPOCH ? new Date(Number(env.SOURCE_DATE_EPOCH) * 1000) : new Date());
