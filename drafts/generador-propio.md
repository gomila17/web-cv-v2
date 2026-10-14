# Prueba del generador propio (fase 4, agente A)

Rama `fase4/gen-propio`, 2026-10-14, Node 21.2.0 en Windows 11. Para comparar con la prueba de Eleventy (agente B) con las mismas reglas: `CONTRACTS.md`, los mismos partials y el mismo CSS.

## Métricas

| Qué | Valor |
|---|---|
| Líneas del generador | **167** en total: `scripts/build.mjs` 127 (100 de código, sin líneas en blanco ni comentarios) + `scripts/dev.mjs` 40 (32 de código). Presupuesto: ~300. |
| Dependencias | **0** (ni de producción ni de desarrollo). `node_modules/` no existe: 0 bytes. |
| Build (`node scripts/build.mjs`, 5 ejecuciones) | **214 ms de media** (225, 221, 210, 207, 208), con el arranque de Node y el validador incluidos. La generación sola tarda 40–53 ms; `check-content --scan dist` tarda ~108 ms. `npm run build` tarda ~1,25 s por el arranque de npm en Windows. |
| Salida | `dist/es/index.html`, `dist/en/index.html`, `dist/index.html` (elección de idioma), `dist/styles.css`, `dist/assets/{foto-recorte.png, foto.jpg, logo.svg}`. |
| `{years}` | 4 → "cuatro" / "four" (desde `facts.career.start` = 2022-10). `SOURCE_DATE_EPOCH` fija la fecha si se quiere un build reproducible. |

Partials hechos: `layout`, `head`, `header`, `hero`, `language-picker` y, en la medición, `about`. El resto devuelve `''` y `layout` los salta sin dejar hueco.

## Añadir la sección Sobre mí (medición)

Pasos que siguió un "desarrollador nuevo" leyendo solo `src/templates/README.md`, `src/styles/README.md` y la v6:

1. `src/templates/about.mjs`: copiar el bloque `#sobre-mi` de la v6 y cambiar cada `data-i18n="x"` por `${t('x')}` y el `aria-label` por `${esc(t('a.lt'))}`. **+13 líneas.**
2. `src/styles/sections/about.css` (nuevo): `.ghost` de la v6. **+7 líneas** (2 de reglas).
3. `src/styles/components.css`: `.longterm` (el README de estilos lo pone en componentes). **+5 líneas.**
4. `npm run build`.

**Cambios en el generador: 0.** `layout.mjs` ya importa todos los partials y el build recoge `sections/*.css` solo, ordenado según la página. Total: 25 líneas en 3 ficheros, 1 de ellos nuevo. Tiempo real: lo que cuesta copiar y adaptar el HTML (un humano: 10–15 min; el generador no añade fricción). Lo único que hay que pensar es lo mismo que con cualquier herramienta: qué clave va en cada sitio y si un texto va en un atributo (`esc`) o en el contenido (sin escapar).

## Cómo se depura un error

Se provocaron cuatro fallos en `about.mjs` (luego se deshicieron):

| Fallo | Qué dice el build | Valoración |
|---|---|---|
| Clave inexistente `t('a.p3')` | `build: error Error: al generar dist/es/index.html (es): clave "a.p3" no existe en content/es.json` + traza con `src/templates/about.mjs:19:31`. Sale con código 1. | Bueno: página, idioma, clave, fichero y línea. |
| Dato inexistente (`facts.person.socials.length`) | `TypeError: al generar dist/es/index.html (es): Cannot read properties of undefined (reading 'length')` + `about.mjs:13:62`. | Bueno: es la traza nativa de Node. |
| Error de sintaxis (template literal sin cerrar) | Antes: `SyntaxError: Unexpected end of input` **sin nombre de fichero** (Node 21 no lo pone en la traza de un `import` anidado). Ahora: `SyntaxError: en src/templates/about.mjs: Unexpected end of input`. | Aceptable: dice el fichero, pero no la línea. Con `node --check src/templates/about.mjs` sale la línea. |
| Dato inexistente interpolado (`${facts.person.nickname}`) | Antes: **pasaba en silencio** y publicaba `undefined` en la página. Ahora: `"undefined" en el HTML (¿dato inexistente?): …<span class="sec-no">undefined</span><h2 id="h-sob…`. | Aceptable: muestra el trozo de HTML, no el partial (hay que buscarlo). |

Los dos "antes" se arreglaron en el commit `3253462` (+13 líneas). Con depurador: `node --inspect-brk scripts/build.mjs` funciona tal cual, los partials son módulos normales.

## Qué falta para el resto de secciones

- **Generador: casi nada.** Los partials que faltan (`pillars`, `experience`, `project`, `homelab`, `homelab-diagram`, `stack`, `education`, `footer`, `totop`) son funciones puras; el build no los conoce uno a uno.
- `experience` (cota): calcular meses entre fechas de `facts.career.stages` dentro del partial (es puro: recibe `years`, pero las fechas de fin `null` = "hoy" necesitan la fecha del build). **Para el integrador**: hace falta añadir la fecha del build al `ctx` (p. ej. `ctx.buildDate` en ISO) o pasar los meses ya calculados; el contrato prohíbe que los partials lean la fecha actual.
- `main.js` y `head.js`: copiar `src/scripts/main.js` a `dist/` (2–3 líneas en el build) e insertar `head.js` inline desde `head.mjs`; ahora mismo los partials no pueden leer ficheros (deben ser puros), así que **el build tendría que pasar el contenido de `head.js` en `ctx`** o el partial importarlo como texto (en Node 21 no hay import de texto: habría que añadir `ctx.inline.headJs`, cambio de contrato).
- `sitemap.xml` (decisión 5): ~10 líneas en el build.
- Minificar CSS/HTML: no lo hago; hoy `styles.css` pesa 24 KB (con tokens, hero y about) y con gzip de Nginx no compensa.
- Tests de `dist/` (`tests/`, del integrador): que `/es/` y `/en/` tengan un `h1`, hreflang recíproco y ningún enlace roto interno. ~40 líneas con `node:test`.

Estimación honesta: el generador acabaría en **~200 líneas** con todo lo anterior, lejos del límite de 300.

## Riesgos de mantenimiento a 1 año

- **Bajo en dependencias**: no hay nada que actualizar ni avisos de seguridad de terceros. Riesgo real: cambios de Node (p. ej. `fs.watch` recursivo, o mensajes de error de ESM), que afectarían solo a `dev`.
- **El "framework" es el contrato, no el código**: si alguien añade una página que no sea `/es/`/`/en/` (p. ej. una página de caso de estudio), hay que tocar `main()` (3–5 líneas) y decidir la ruta. Con Eleventy sería crear un fichero.
- **Escape manual**: cada partial decide entre `t()` (sin escapar) y `esc()`. Un olvido de `esc` en un dato de `facts` no lo detecta nada. Mitigación posible: un test que busque `${facts.` sin `esc(` en los partials.
- **Bus factor**: 127 líneas propias que hay que entender; a cambio, se leen en 10 minutos.
- `dev.mjs` borra `dist/` en cada build; si el build falla a medias, el servidor sirve una página incompleta hasta el siguiente guardado.

## Lo incómodo (honesto)

- Los template literals con HTML grande se leen bien, pero **sin resaltado ni autocompletado de HTML** en el editor, y un `}` o una comilla de más da un SyntaxError sin línea útil.
- El selector de idioma de la v6 era de botones con `aria-pressed`; como cada idioma es una URL, pasan a enlaces con `aria-current` y hubo que adaptar el CSS (`.lang a`). No es culpa del generador, pero lo hará igual el agente de Eleventy.
- El conmutador de tema se renderiza con `hidden` porque sin JS no hace nada: `main.js` tendrá que quitarlo. **Para el integrador**: confirmar ese criterio en `CONTRACTS.md` §4.
- `paths.asset(ruta)` lo he definido como "ruta absoluta desde la raíz de `dist/`" (`asset('assets/foto.jpg')` → `/assets/foto.jpg`, `asset('styles.css')` → `/styles.css`). El README de plantillas no lo concreta: **para el integrador**, fijarlo en el contrato. Con rutas absolutas, abrir `dist/es/index.html` con `file://` no carga estilos: hay que usar `npm run dev`.
- `layout.mjs` aún no carga `/main.js` (daría 404 hasta que exista).
- La comprobación de HTML válido fue estructural (etiquetas equilibradas, ids únicos, un `h1`, doctype) con un script desechable; no hay validador W3C sin dependencias.
- No pude abrir la v6 en el navegador integrado para compararla lado a lado (no hay servidor estático para `drafts/` sin dependencias más allá de `dev.mjs`, que solo sirve `dist/`). La comparación se hizo contra el HTML y el CSS de la v6, que se copiaron sin cambios de valores.

## Verificación hecha

- Navegador integrado, `/es/` y `/en/`: hero y Sobre mí en claro y oscuro, a 1280 px y 375 px. Sin desborde horizontal a 375 px (`scrollWidth` = 375). Foto recortada cargada; forzando un error de carga, el respaldo cambia a `foto.jpg` y quita `photo--cutout`.
- `/`: página de elección de idioma con enlaces a `/es/` y `/en/`, canonical y `x-default` a la raíz.
- `head`: `lang`, `title`, `description`, canonical y hreflang `es`/`en`/`x-default` con `https://gomila.dev`.
- `npm run build` termina con `check-content --scan dist` en verde; `npm run check` y `npm test` pasan; el servidor de desarrollo, parado.
