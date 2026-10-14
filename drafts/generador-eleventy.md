# Generador B: Eleventy (prueba de concepto, fase 4)

Fecha: 2026-10-14. Rama `fase4/gen-eleventy`. Comparación con el generador propio (agente A) para cerrar la decisión 3 de `ARCHITECTURE.md`.

## Resumen

Funciona y es poco código propio, pero Eleventy aporta muy poco a esta web: con plantillas JavaScript que llaman a los partials del contrato, Eleventy solo hace tres cosas. Itera los idiomas, escribe los ficheros y sirve con recarga en caliente. Y la recarga no funcionó bien hasta que añadí un apaño que depende de detalles internos de Eleventy. A cambio entran 129 paquetes, 22 MB y 9 avisos de `npm audit` que no se pueden arreglar desde aquí. **Mi valoración: no compensa frente a un generador propio de menos de 300 líneas**, salvo que el agente A necesite bastante más código del que se espera.

## Qué hay

| Fichero | Qué hace | Líneas (total / código*) |
|---|---|---|
| `eleventy.config.mjs` | entrada `src/pages`, salida `dist`, copia `assets/` y `src/static/`, vigila carpetas de fuera, apaño de recarga | 23 / 14 |
| `src/pages/locale.11ty.js` | `/es/` y `/en/` (paginación sobre `facts.site.locales`) → `layout(ctx)` | 13 / 10 |
| `src/pages/index.11ty.js` | `/` → `language-picker(ctx)` | 10 / 7 |
| `src/pages/styles.11ty.js` | `/styles.css`: concatena en el orden de CONTRACTS §4 | 14 / 10 |
| `scripts/ctx.mjs` | construye `ctx` (`t`, `esc`, `tr`, `years`, `paths`); no depende de Eleventy | 39 / 30 |
| `package.json` | `build` y `dev` | 2 |
| **Total de configuración y pegamento** | | **101 / 73** |

\* Código: sin líneas vacías ni comentarios. De esas 73, unas 41 son propias de Eleventy (configuración y páginas). Las 30 de `ctx.mjs` harían falta igual con cualquier generador.

- `npm run build`: borra `dist/`, ejecuta `eleventy` y termina con `node scripts/check-content.mjs --scan dist` (pasa: 11 comprobaciones).
- `npm run dev`: `eleventy --serve` (puerto 8080), con recarga en caliente de partials, CSS y contenido.
- Salida: `dist/index.html`, `dist/es/index.html`, `dist/en/index.html`, `dist/styles.css` y `dist/assets/{foto-recorte.png, foto.jpg, logo.svg}`.
- Partials implementados: `layout`, `head` (title, description, canonical y hreflang es/en/x-default con `facts.site.url`), `header` (sin JS), `hero` (foto recortada con respaldo `onerror` a `/assets/foto.jpg`), `language-picker` y, en la medición, `about`. El resto devuelve `''`.
- `{years}`: se calcula en el build como años completos desde `facts.career.start` (2022-10). Hoy da 4, que se escribe "cuatro" o "four" con `num.words`, y pasa a cifras por encima de diez.
- CSS copiado de la v6 en `base.css`, `layout.css`, `components.css`, `sections/hero.css`, `sections/about.css` y `motion.css`. En `motion.css` solo están los keyframes de la entrada del hero y `prefers-reduced-motion`. No hay JS.

## Métricas

| Métrica | Valor |
|---|---|
| Versión | `@11ty/eleventy` **3.1.6** (exacta), `engines.node >=18`: **compatible con Node 21.2**, no hace falta bajar de versión |
| Paquetes instalados | **129** (130 entradas en el lockfile contando la raíz; 173 líneas en `npm ls --all`), todos desde `registry.npmjs.org` |
| Tamaño de `node_modules` | **22 MB** |
| `npm audit` | **9 vulnerabilidades (4 moderadas, 5 altas)**, todas transitivas: `braces` (DoS por patrones anidados) vía `chokidar` → `@11ty/eleventy-dev-server`, `nunjucks` y Eleventy; `sprintf-js` (DoS) vía `argparse` → `js-yaml` → `gray-matter`. La única "solución" que propone npm es `npm audit fix --force`, que **instala Eleventy 0.6.0**, así que no se puede aplicar. El riesgo real es bajo (herramienta de build local, entradas propias), pero un `npm audit` en CI saldría en rojo. |
| Dependencias que no se usan | `liquidjs`, `nunjucks`, `markdown-it`, `luxon`, `gray-matter`, `posthtml`… vienen con Eleventy aunque aquí solo se usan plantillas `.11ty.js` |
| Tiempo de build (`npm run build`, media de 5) | **1,75 s** (1740–1756 ms). Desglose: arranque de npm unos 0,9 s, proceso `eleventy` **0,59 s** (media de 5; Eleventy dice "0.09–0.12 seconds" de trabajo real), validador 0,11 s, `node` vacío 0,09 s |
| Validez del HTML | Comprobación estructural propia (etiquetas equilibradas, ids únicos, un `h1`, `aria-labelledby` con destino, `alt`, doctype): **OK** en las 3 páginas. Los únicos avisos son las anclas de la navegación a secciones aún vacías (`#que-hago`, `#experiencia`, `#proyectos`, `#homelab`, `#stack`). No había validador W3C sin instalar más paquetes. |

## Verificación en el navegador integrado

Con `eleventy --serve`:
- `/es/` en escritorio (1280 px) y oscuro, `/es/` en escritorio y claro, y `/en/` en móvil (375 px) y claro: el hero coincide con la v6. Están el degradado, la rejilla enmascarada, las manchas, la red de nodos, el titular con subrayado, los botones y la foto recortada sobre el disco, con la cabeza sobresaliendo. En escritorio va en dos columnas y en móvil se apila con la foto arriba. La entrada animada en CSS funciona.
- La sección Sobre mí (`#sobre-mi`) coincide en oscuro (escritorio) y en claro (móvil): el monograma fantasma `tg`, los dos párrafos con "cuatro años" o "four years" y el bloque de largo plazo con filete violeta.
- No hay desborde horizontal: a 375 px, `scrollWidth` es 375. Hay un único `h1`. La foto carga `foto-recorte.png`, así que la clase `photo--cutout` se mantiene.
- `/`: la página de elección muestra el logo, "Toni Gomila · Backend Developer" y los botones Español e English.
- Sin JS, la cabecera no es fija. Es lo mismo que hace la v6 sin JS, así que es lo esperado.

## Medición: añadir la sección "Sobre mí"

Pasos que siguió un "desarrollador nuevo":
1. Leer la cabecera de `src/templates/about.mjs` (claves `n.about, a.p1, a.p2, a.lt, a.ltp`) y copiar el HTML de la v6 (líneas 635-646) cambiando los textos por `t('…')`: **+13 líneas** en `about.mjs`.
2. Copiar el CSS de la v6: `.sec`, `.sec-head` y `.sec-no` a `layout.css` (**15 líneas**, 9 de código). `.ghost` y `.longterm` a `sections/about.css` (**16 líneas**, 5 de código).
3. `npm run build`.

**Cambios en Eleventy: 0.** No hubo que tocar `eleventy.config.mjs` ni `src/pages/`: `layout.mjs` ya importa `about` y `styles.11ty.js` ya incluye `sections/about.css` si existe. Ojo: eso es mérito del contrato (partials puros y orden de CSS fijo), no de Eleventy. Con un generador propio sería igual.

**Lo que sí costó, por culpa de Eleventy:** al editar `about.mjs` con `npm run dev`, Eleventy detectaba el cambio ("File changed") y reconstruía, pero **el HTML seguía siendo el anterior**. Eleventy 3.1 solo invalida la caché de `import` del fichero cambiado (y de sus dependientes directos que conoce), no la de `layout.mjs`, que es quien lo importa. Con `hero.mjs` pasaba lo mismo. Diagnosticarlo obligó a leer `node_modules/@11ty/eleventy/src/Util/EsmResolver.js` y `EleventyWatchTargets.js`. El apaño (8 líneas en la configuración) añade todos los partials a la cola de recarga en `eleventy.beforeWatch`, y **depende de que Eleventy pase esa cola por referencia**, que es un detalle interno. Comprobado: con el apaño, los cambios en `about.mjs` y `hero.mjs` aparecen al instante. Un desarrollador nuevo habría creído que su cambio no funcionaba.

## Cómo se depura un error

- **Clave inexistente** (`t('a.ltpx')` en `about.mjs`): el build falla con este mensaje:
  `Having trouble rendering 11ty.js template ./src/pages/locale.11ty.js (via TemplateContentRenderError)` / `Clave inexistente en content/es.json: "a.ltpx"`. Después viene la traza con `about.mjs?_cache_bust=…:22:12` → `layout.mjs` → `locale.11ty.js` y unas 6 líneas internas de Eleventy. Es claro: el mensaje es el de `ctx.t`, y la traza da fichero y línea.
- **Error de sintaxis** (una `}` que falta en `about.mjs`): `There was a problem importing 'src\pages\locale.11ty.js' via import(esm) (via EleventyImportError)` / `Invalid regular expression: missing /`. **No dice qué fichero ni qué línea**: señala a `locale.11ty.js` y la traza se queda dentro del cargador de módulos de Node. Para encontrarlo hay que importar el partial a mano. `node --input-type=module -e "await import('./src/templates/about.mjs')"` sí da `about.mjs:22` con un cursor en la columna. Es peor que lo que daría un generador propio, que mostraría el error de Node sin envolverlo.
- En `npm run dev`, el error solo sale en la terminal: el navegador se queda con la última versión buena, sin aviso superpuesto. Al corregir el error, el servidor se recupera solo.

## Qué falta para el resto de secciones

- **Plantillas:** rellenar `pillars`, `experience`, `project`, `homelab`, `homelab-diagram`, `stack`, `education`, `footer` y `totop`. No hay que tocar nada de Eleventy, porque `layout.mjs` ya los llama en orden.
- **CSS:** los `sections/*.css` restantes, `print.css` y el resto de `motion.css` (revelados, `sd-css`/`sd-js`, fundido). `styles.11ty.js` ya los recoge.
- **JS:** `src/scripts/head.js` inline en `head.mjs` (lo pide su cabecera) y `main.js`. Haría falta una línea más de copia directa en la configuración (`addPassthroughCopy({'src/scripts/main.js': 'main.js'})`) y el `<script>` en `layout.mjs`. No los he enlazado para no referenciar ficheros que no existen.
- **SEO:** Open Graph, JSON-LD `Person` y `sitemap.xml`. El sitemap sería una página `sitemap.11ty.js` más, de unas 10 líneas.
- **Pruebas de `dist/`** (`tests/README.md`): son independientes del generador.

## Riesgos de mantenimiento a 1 año

- **Versiones mayores:** ya existe `4.0.0-alpha.10` (canary). Eleventy rompe la API entre versiones mayores (de la 2 a la 3 cambiaron la configuración ESM y el paso de datos a las plantillas JS). Con la versión fijada no se rompe solo, pero quedarse en la 3.1.x significa quedarse con los avisos de seguridad sin corregir.
- **El apaño de recarga** depende de un detalle interno (`beforeWatch` recibe la cola por referencia). Puede dejar de funcionar sin error en cualquier versión menor, y lo único que se notaría es que los cambios no aparecen.
- **129 dependencias transitivas** con su ritmo propio de avisos. Con las 9 actuales ya no hay arreglo sin cambiar de versión mayor. Si CI ejecuta `npm audit`, habrá que mantener excepciones a mano. Esto choca con el objetivo de menos de 1 h por trimestre (principio rector).
- **Node:** Eleventy 3 pide Node 18 o superior, así que no hay problema con Node 21. Una versión mayor futura podría pedir Node 22 o superior, y entonces Toni tendría que actualizar Node.
- `npm ci` en CI añade unos 10 s y una descarga de 22 MB en cada ejecución (o hay que configurar caché).

## Lo incómodo, con honestidad

- Eleventy brilla con Markdown, colecciones, layouts encadenados y muchas páginas. Aquí no se usa nada de eso: hay 3 páginas, contenido en JSON y partials en JS puro. Su trabajo real (iterar idiomas, escribir ficheros, copiar assets) son unas 20 líneas de Node con `fs`.
- **El servidor de desarrollo** es lo único que aporta de verdad, y con módulos ESM anidados no funcionaba bien de serie.
- Para generar `styles.css` como "plantilla" hay que leer los ficheros con `fs` dentro de un `11ty.js`: es Node puro disfrazado de plantilla. Se hace así para que el servidor de desarrollo lo recargue.
- Los mensajes de error envuelven los de Node y pierden información en los errores de sintaxis.
- Las carpetas fuera de la entrada (`content/`, `src/templates/`, `src/styles/`) hay que vigilarlas a mano con `addWatchTarget`. Si se olvida una, no avisa: el cambio simplemente no se ve.
- En Windows, al parar el proceso de `npx eleventy --serve` desde fuera, quedó un `node.exe` huérfano escuchando en el puerto (lo maté con `taskkill`). Con Ctrl+C en una terminal normal no debería pasar.
- Se instalan Nunjucks, Liquid y markdown-it que no se usan. Son superficie de ataque y avisos sin beneficio.

## Para el integrador (no lo he tocado)

- **Estructura:** añadí `src/pages/` (páginas 11ty.js) y `scripts/ctx.mjs`. CONTRACTS §1 no los recoge. Si se elige el generador propio, `ctx.mjs` se puede reutilizar tal cual y `src/pages/` sobra.
- **Selector de idioma:** son enlaces dentro de `<div class="lang" role="group">` en lugar de `<button>`, como pide la cabecera de `header.mjs`. Por eso en `components.css` el selector pasa de `.lang button[aria-pressed]` a `.lang a[aria-current]`. No lo puse en un `<nav>` porque las reglas `.top nav a` de la v6 lo afectarían.
- **Nav:** "Homelab" y "Stack" no tienen clave `n.*` y van como literales, igual que en la v6. Habría que decidir si se añaden claves.
- **`/`:** usa `head(ctx)` con el idioma por defecto, así que el `<title>` y la descripción salen en español y el canonical es `https://gomila.dev/`. Si se quiere un título bilingüe, hace falta una clave o un campo en `facts`.
- `onerror` en línea en la foto (es lo que hace la v6): hay que tenerlo en cuenta si se añade una CSP sin `unsafe-inline`.
- Ningún cambio en `content/*.json`, `tokens.css`, el validador ni `CONTRACTS.md`. `npm run check` y `npm test` pasan.
