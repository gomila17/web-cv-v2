/* main.js (defer, sin dependencias). Porta el script final de la v6 (drafts/diseno/versiones/v6-aprobada) con
   los cambios del contrato (CONTRACTS.md §4): sin diccionario ni cambio de idioma en el cliente (cada idioma es
   su URL y el selector son enlaces), ningún texto escrito aquí (se leen de data-* del marcado) y sin suponer que
   existe ninguna sección: cada parte comprueba sus elementos y, si falla, no arrastra a las demás. */
(function () {
  'use strict';
  const root = document.documentElement;
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));
  const id = (s) => document.getElementById(s);
  const calm = () => !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  const clamp = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

  /* Cada parte aislada: un error se informa en consola (asíncrono) pero no detiene las siguientes. */
  function run(fn) { try { fn(); } catch (e) { setTimeout(() => { throw e; }); } }

  /* Tema Auto → Claro → Oscuro. head.js ya aplicó el guardado antes de pintar; aquí solo el botón.
     Textos: data-auto/light/dark (etiqueta) y data-pre/sys/post (aria-label) que pone header.mjs. */
  function theme() {
    const btn = id('theme');
    if (!btn) return;
    const label = id('theme-label');
    const txt = (k) => btn.getAttribute('data-' + k) || '';
    const order = ['auto', 'light', 'dark'];
    let cur = 'auto', rot = 0;
    try { const s = localStorage.getItem('tg-theme'); if (s === 'light' || s === 'dark') cur = s; } catch (e) {}
    function paint() {
      if (cur === 'auto') root.removeAttribute('data-theme'); else root.setAttribute('data-theme', cur);
      if (label) label.textContent = txt(cur);
      btn.setAttribute('aria-label', txt('pre') + txt(cur).toLowerCase() + (cur === 'auto' ? txt('sys') : '') + txt('post'));
    }
    /* Fundido: View Transitions si existen; si no, transición de colores con html.tt (420 ms > los .35 s del CSS). */
    function smooth(fn) {
      if (calm()) return fn();
      if (document.startViewTransition) return document.startViewTransition(fn);
      root.classList.add('tt'); fn(); setTimeout(() => root.classList.remove('tt'), 420);
    }
    btn.addEventListener('click', () => {
      cur = order[(order.indexOf(cur) + 1) % order.length];
      rot += 180; btn.style.setProperty('--rot', rot + 'deg');
      smooth(paint);
      try { if (cur === 'auto') localStorage.removeItem('tg-theme'); else localStorage.setItem('tg-theme', cur); } catch (e) {}
    });
    paint();
    btn.hidden = false;
  }

  /* Revelados que se repiten: entran con io (margen inferior, escalonando el lote con --i) y se reinician con
     ioOut solo cuando el elemento ha salido del todo del viewport, así nunca desaparece a la vista. */
  function reveal() {
    $$('.level .tags').forEach((ul) => Array.from(ul.children).forEach((li, i) => li.style.setProperty('--k', i)));
    const targets = $$('.rv,.sec-head');
    if (!('IntersectionObserver' in window)) { targets.forEach((t) => t.classList.add('in')); window.__tgRv = true; return; }
    const io = new IntersectionObserver((entries) => {
      let n = 0;
      entries.forEach((e) => {
        if (!e.isIntersecting || e.target.classList.contains('in')) return;
        e.target.style.setProperty('--i', n++);
        e.target.classList.add('in');
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
    const ioOut = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (!e.isIntersecting) e.target.classList.remove('in'); });
    }, { threshold: 0 });
    targets.forEach((t) => { io.observe(t); ioOut.observe(t); });
    window.__tgRv = true; /* head.js: la red de seguridad de 3 s ya no quita las animaciones */
  }

  /* Un único listener de scroll pasivo + requestAnimationFrame: cabecera stuck, sección activa, volver arriba
     y, con html.sd-js, el respaldo de las animaciones ligadas al scroll (--rp --hp --cp --dp --sp). */
  function scroll() {
    const bar = $('.topbar'), hero = id('top'), prog = $('.prog'), cota = id('cota'), fig = id('fig'), toTop = id('totop');
    const fb = root.classList.contains('sd-js');
    const links = {};
    $$('.top nav a[href^="#"]').forEach((a) => { links[a.getAttribute('href').slice(1)] = a; });
    const secs = $$('main section[id]');
    let cur = null, ticking = false;

    function activeNav(vh) {
      const mid = vh * 0.45;
      let a = null;
      for (const s of secs) { const r = s.getBoundingClientRect(); if (r.top <= mid && r.bottom > mid) { a = links[s.id] || null; break; } }
      if (a === cur) return;
      if (cur) cur.removeAttribute('aria-current');
      if (a) a.setAttribute('aria-current', 'location');
      cur = a;
    }

    if (toTop) {
      toTop.hidden = false;
      toTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: calm() ? 'auto' : 'smooth' });
        const home = $('.top .mark');
        if (home) home.focus({ preventScroll: true });
      });
    }

    function frame() {
      ticking = false;
      const y = window.pageYOffset, vh = window.innerHeight, max = root.scrollHeight - vh;
      activeNav(vh);
      if (bar) bar.classList.toggle('stuck', y > 10);
      /* Volver arriba: aparece pasado el hero; su anillo (--tp) muestra el progreso de lectura. */
      if (toTop) { toTop.classList.toggle('show', y > vh * 0.8); toTop.style.setProperty('--tp', max > 0 ? clamp(y / max) : 0); }
      if (!fb || !root.classList.contains('sd-js')) return;
      /* Primero todas las lecturas, luego todas las escrituras (sin layout forzado). */
      const rc = cota && cota.getBoundingClientRect(), rf = fig && fig.getBoundingClientRect();
      if (prog) prog.style.setProperty('--rp', max > 0 ? clamp(y / max) : 0);
      if (hero) hero.style.setProperty('--hp', clamp(y / vh));
      if (rc) cota.style.setProperty('--cp', clamp(((vh - rc.top) / (vh + rc.height) - 0.12) / 0.44));
      if (rf) {
        fig.style.setProperty('--dp', clamp((vh - rf.top) / Math.min(rf.height || 1, vh)));
        fig.style.setProperty('--sp', clamp(((vh - rf.top) / (vh + rf.height) - 0.1) / 0.45));
      }
    }
    const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
    window.addEventListener('scroll', req, { passive: true });
    window.addEventListener('resize', req, { passive: true });
    frame();
  }

  /* Diagrama: con la mitad a la vista se enciende ('lit') y arrancan los paquetes de flujo. */
  function lit() {
    const fig = id('fig');
    if (!fig) return;
    if (!('IntersectionObserver' in window)) { fig.classList.add('lit'); return; }
    new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting && e.intersectionRatio >= 0.5) fig.classList.add('lit'); }),
      { threshold: [0.5, 0.6] }).observe(fig);
  }

  /* Cota ↔ puestos: al pasar el puntero por un puesto se resalta su tramo. Como en la v6, el tramo
     #cota .seg[data-job=i] corresponde al puesto i-ésimo (.job), salvo que el .job lleve su propio data-job. */
  function jobs() {
    const segs = $$('#cota .seg[data-job]');
    if (!segs.length) return;
    $$('.job').forEach((j, i) => {
      const k = j.hasAttribute('data-job') ? j.getAttribute('data-job') : String(i);
      const seg = segs.find((s) => s.getAttribute('data-job') === k);
      if (!seg) return;
      j.addEventListener('pointerenter', () => seg.classList.add('hl'));
      j.addEventListener('pointerleave', () => seg.classList.remove('hl'));
    });
  }

  /* Idioma: elegir ES/EN en la cabecera lo recuerda (cookie tg_lang, 1 año) para que la raíz (/) lleve
     a ese idioma la próxima vez en lugar de al del navegador. Cookie y no localStorage: la lee Nginx. */
  function lang() {
    $$('.lang a[hreflang]').forEach((a) => a.addEventListener('click', () => {
      const l = a.getAttribute('hreflang');
      if (l === 'es' || l === 'en') document.cookie = 'tg_lang=' + l + '; path=/; max-age=31536000; SameSite=Lax';
    }));
  }

  [theme, lang, reveal, scroll, lit, jobs].forEach(run);
})();
