/* Inline en <head>, antes de pintar (lo inserta layout.mjs vía ctx.headScript). Porta el script de cabecera de la v6
   sin la parte de idioma: cada idioma es su URL (CONTRACTS.md §4). Todo en try/catch: sin localStorage, sin
   matchMedia o con un error aquí, la página sigue completa y visible (sin clase anim no se oculta nada). */
(function () {
  var d = document.documentElement;
  try { var t = localStorage.getItem('tg-theme'); if (t === 'light' || t === 'dark') d.setAttribute('data-theme', t); } catch (e) {}
  try {
    d.classList.add('js');
    var calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (calm || !('IntersectionObserver' in window)) return;
    d.classList.add('anim');
    /* Animaciones ligadas al scroll: nativas en CSS si existen (sd-css); si no, respaldo de main.js (sd-js). */
    var sda = !!(window.CSS && CSS.supports && CSS.supports('animation-timeline: view()') && CSS.supports('animation-range: 0px 100px'));
    if (/[?&]sd=js\b/.test(location.search)) sda = false; /* ?sd=js fuerza el respaldo para probarlo */
    d.classList.add(sda ? 'sd-css' : 'sd-js');
    /* Red de seguridad: si main.js no llega a arrancar los revelados en 3 s, se muestra todo. */
    setTimeout(function () { if (!window.__tgRv) d.classList.remove('anim', 'sd-css', 'sd-js'); }, 3000);
  } catch (e) {}
})();
