# CONTRACTS: fase 4 (implementación)

Lo que varios subagentes comparten y nadie cambia por su cuenta. Vale tanto para un generador propio (≤ 300 líneas) como para Eleventy (`ARCHITECTURE.md` decisión 3).
Referencia visual: `drafts/diseno/versiones/v6-aprobada/hibrido-v6.html` (`DESIGN.md`).

## 1. Estructura

```
content/        es.json, en.json, facts.json: todo el texto y los datos
src/templates/  un partial .mjs por sección (render(ctx) → HTML)
src/styles/     tokens.css + capas CSS (orden en §4)
src/scripts/    head.js (inline) y main.js
src/static/     copiado tal cual a la raíz de dist/ (robots.txt, favicon, tarjeta)
assets/         foto y logo (se mantiene: PRODUCT y DESIGN ya fijan esas rutas)
scripts/        herramientas de Node: validador y build
tests/          node:test, sin dependencias
deploy/         Nginx, timer de usuario y script de releases (+ .github/workflows/)
dist/           salida del build (ignorada)
```

Por qué así: una carpeta por tipo de trabajo, así cada subagente edita ficheros disjuntos (§6). Contenido fuera del código para que la paridad y la privacidad se comprueben sin build. Cada carpeta tiene un README con qué va ahí y quién la toca.

## 2. Contenido

**`es.json` / `en.json`**: objeto plano `{ "clave": "texto" }`, mismas claves en el mismo orden. 191 claves: las 180 de la v6, sin renombrar, más 11 nuevas (`th.*`, `a.newtab`, `num.words`, `st.c3t`, `st.c3`, `st.verify`).
- HTML en línea permitido: `em`, `strong`, `b`, `code`, `br`, y las mismas etiquetas en los dos idiomas. Se inserta sin escapar.
- Hueco permitido: `{years}` (años completos desde `facts.career.start`; el build lo sustituye por la palabra de `num.words`, o por cifras si pasa de diez).
- `t.title` y `t.desc` son el `<title>` y la meta descripción de cada idioma.

**Claves**: `prefijo.elemento[.sub]`, minúsculas y dígitos (`^[a-z][a-z0-9]*(\.[a-z0-9]+)*$`). Prefijos (heredados de la v6):

| Prefijo | Sección / uso | Prefijo | Sección / uso |
|---|---|---|---|
| `skip`, `a.home/nav/lang/tech/totop/newtab` | accesibilidad y UI común | `pr.*` | proyecto homepanel |
| `th.*` | conmutador de tema | `hm.*`, `dt.*`, `d1.*`–`d7.*`, `s.*` | homelab: texto, etiquetas de decisión, decisiones (`.t .p .d .w .l`), anécdota |
| `n.*` | navegación y títulos de sección | `g.*` | diagrama (`g.t.*`: disposición vertical) |
| `h.*` | hero | `st.*` | stack y certificaciones |
| `a.p1`, `a.p2`, `a.lt`, `a.ltp` | sobre mí (colisión de prefijo heredada) | `ed.*` | formación e idiomas |
| `p.b.*`, `p.s.*`, `p.i.*`, `p.lead` | pilares | `f.*` | pie / contacto |
| `e.*`, `k.*` | experiencia (`e.s/d/i` puesto, `.w` fechas, `.1…` viñetas) y fechas de la cota | `t.*`, `num.*` | título/descripción; utilidades |

**`facts.json`**: lo único y no traducible. Campos que el validador exige:
`person{name, fullName, role, city, email}` · `site{url, defaultLocale, locales[{code,label,name,path}]}` · `links{linkedin, github, homepanelRepo}` · `career{start: AAAA-MM, stages[{id, title, short, start, end|null, tech[]}]}` · `certifications[{id, name, issuer, date: AAAA-MM-DD, verifyUrl}]` · `stack{daily[], known[], exploring[]}` (+ `trainingOnly[]`) · `languages[{code, level}]`. También `projects.homepanel` y `education[]`.
Un elemento de lista es un literal (`"Java 8"`) o una referencia `{ "i18n": "st.tune" }`; los objetos con `"i18n": {…}` apuntan a claves de los diccionarios, y deben existir.

**¿facts o es/en?** Si cambia con el idioma → es/en. Nombres propios, URLs, fechas ISO, tecnologías y notas → facts. Las fechas *mostradas* ("mar 2026") son texto de cada idioma y deben coincidir con las ISO de facts (lo vigila la revisión).

**Añadir una clave**: usa un prefijo de la tabla, añádela en **todos** los idiomas en la misma posición, con texto de `drafts/contenido-final.md` (no se inventa), y pasa `npm run check`. Renombrar o borrar claves: solo el integrador.

**Fuera del contenido a propósito**: lo que la v6 aprobada no muestra (anécdota del crash-loop, `.hosting`, caso de estudio de esta web) y lo que está abierto (`[FALTA]` PDF del CV y su botón "Descargar CV", Spring Boot `[REVISAR]`). Nunca: teléfono, IPs, nombres internos.

## 3. Tokens (`src/styles/tokens.css`)

- Colores, foto, fondos, sombra y curvas: **valores exactos de la v6**. Claro por defecto en `:root`; oscuro en `@media (prefers-color-scheme:dark){:root:not([data-theme="light"])}` y en `:root[data-theme="dark"]` (bloque duplicado a propósito: si cambias uno, cambia el otro).
- Grupos: superficies (`--bg --bg-2 --plane --card --card-2 --line --rule --edge`), texto y acento (`--text --muted --accent --accent-ink --wash --on-accent --primary-bg --violet --focus`), estados (`--ok --warn --orange`), fondos (`--grid --dot --ghost --hero-bg --orb-1 --orb-2 --plane-wash --net-op --sweep`), banda (`--band-*`), foto (`--disc --cut-filter --photo-tint`), `--head-bg`, `--shadow`.
- Independientes del tema: `--sans --mono`, `--fs-body --lh-body --fs-hero --fs-h2 --fs-sub`, `--wrap --gutter --measure --hh` (≥ 720px: `--gutter:32px --hh:76px --fs-body:1.125rem`), radios `--r-xs/sm/btn/aside/card/fig/pill`, movimiento `--ease --pop --dur-fast/micro/fade/state/slow/enter`.
- Reglas: fuera de `tokens.css` no hay colores literales; se usa `var(--…)`. Un valor que no tenga token se queda literal y se copia de la v6. Token nuevo o cambiado → integrador + script de contraste (`v5-contraste.js`, hoy 0 fallos).
- Ojo: en la v6, `--pop` es la curva con rebote, pero `.photo--cutout` lo redefine localmente como número (`.14`, cuánto sobresale la cabeza). En el CSS nuevo, esa variable local se llama `--head-pop`.

## 4. CSS y JS

- **Orden** (concatenado en un `styles.css`, sin `@layer`, porque la v6 depende del orden y de `!important` en movimiento reducido): `tokens` → `base` → `layout` → `components` → `sections/<sección>` → `motion` → `print`.
- **Clases**: las de la v6, sin renombrar (`.sec`, `.plane`, `.card`, `.rv rv-fade/rv-settle/rv-left`, `.photo--cutout`…). Las nuevas, en kebab-case y con el nombre de la sección si son específicas. Estados del documento en `<html>`: `js`, `anim`, `sd-css`/`sd-js`, `tt`, `data-theme`.
- **Ids de sección** (anclas y JS): `top`, `main`, `sobre-mi`, `que-hago`, `experiencia`, `proyectos`, `homelab`, `stack`, `formacion`, `cota`, `fig`, `totop`.
- **Móvil primero**; breakpoints de la v6: 720, 820, 900, 1000px.
- **JS**: sin textos fijos (los lee de `data-*` que pone la plantilla); sin diccionario de idiomas (cada idioma es su URL); `localStorage` solo `tg-theme`, con `try/catch`. Sin JS, sin animaciones o sin la foto recortada, la página está completa.

## 5. Partials (`src/templates/*.mjs`)

Un partial por sección: `export default function render(ctx) → string`, función pura. `ctx = { locale, t(key), facts, esc(s), tr(item), years, paths }` (detalle en `src/templates/README.md`). `t()` devuelve HTML de confianza; cualquier valor de `facts` pasa por `esc()`. Cada cabecera de partial lista sus claves y datos.
Partials: `layout`, `head`, `header`, `hero`, `about`, `pillars`, `experience`, `project`, `homelab`, `homelab-diagram` (única fuente del diagrama), `stack`, `education`, `footer`, `totop`, `language-picker` (página `/`).

## 6. Quién toca qué

| Subagente | Ficheros |
|---|---|
| Plantillas | `src/templates/*` salvo `head`, `layout`, `language-picker` |
| Estilos | `src/styles/*` salvo `tokens.css` |
| Interacción | `src/scripts/*` |
| SEO | `src/templates/head.mjs`, `src/static/*`, `t.title`/`t.desc` (propuesta al integrador) |
| Despliegue | `deploy/*`, `.github/workflows/*` |
| Integrador | `CONTRACTS.md`, `tokens.css`, `content/*` (estructura y claves), `facts.json`, `layout.mjs`, `language-picker.mjs`, build, `scripts/check-content.mjs`, `package.json`, `tests/` de `dist/` |

**Sin pasar por el integrador no se cambia**: nombres o borrado de claves, esquema de `facts.json`, forma de `ctx`, tokens, orden de ficheros CSS, ids de sección y clases de la v6, el validador, y `package.json` (sigue sin dependencias de producción; Node ≥ 21 sin APIs de Node 22).

## 7. Comprobaciones

`npm run check` (contenido) y `npm test` (prueba que el validador falla cuando debe). El build terminará con `node scripts/check-content.mjs --scan dist`. Los términos privados concretos van en `.privacy-terms` (local, ignorado) o en el secreto de CI `PRIVACY_TERMS`; el validador nunca los imprime.
