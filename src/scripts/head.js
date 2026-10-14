/* Inline en <head>, antes de pintar (lo inserta layout.mjs vía ctx.headScript). Porta el script de cabecera de la v6
   sin la parte de idioma: cada idioma es su URL (CONTRACTS.md §4). Todo en try/catch: sin localStorage, sin
   matchMedia o con un error aquí, la página sigue completa y visible (sin clase anim no se oculta nada). */
(function () {
  var d = document.documentElement;
  /* Raíz (/): ir al idioma elegido antes (cookie tg_lang) o al del navegador. Español para es/ca/gl/eu
     y si no hay preferencia; inglés para el resto. Misma regla que Nginx (deploy/nginx.conf), que en
     producción redirige antes de servir nada; esto cubre el servidor de desarrollo y cualquier otro. */
  if (d.hasAttribute('data-lang-redirect')) {
    try {
      var c = /(?:^|;\s*)tg_lang=(es|en)\b/.exec(document.cookie);
      var n = ((navigator.languages && navigator.languages[0]) || navigator.language || '').toLowerCase();
      location.replace('/' + (c ? c[1] : (!n || /^(es|ca|gl|eu)\b/.test(n) ? 'es' : 'en')) + '/');
    } catch (e) {}
    return;
  }
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
