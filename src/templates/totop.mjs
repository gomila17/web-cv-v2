/**
 * Partial: totop
 * Botón volver arriba con anillo de progreso; sale con `hidden` (sin JS no haría nada). main.js lo muestra, actualiza --tp y lleva el foco al logo.
 *
 * Claves de content/<locale>.json: a.totop
 * Datos de facts.json: —
 * Dueño: plantillas. Contrato completo: CONTRACTS.md §5.
 *
 * @param {object} ctx  contexto de render (forma en src/templates/README.md)
 * @returns {string} HTML
 */
export default function render(ctx) {
  const { t, esc } = ctx;
  return `<button class="totop" id="totop" type="button" hidden aria-label="${esc(t('a.totop'))}">
  <svg viewBox="0 0 52 52" aria-hidden="true"><circle class="ring" cx="26" cy="26" r="25"/></svg>
  <svg class="arrow" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 15V5M5 10l5-5 5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
</button>`;
}
