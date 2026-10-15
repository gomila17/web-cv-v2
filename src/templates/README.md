# src/templates/

Un partial por sección, como módulo ES sin dependencias: `export default function render(ctx) { return '<html…>' }`.
Funciona igual con un generador propio (importa y llama) que con Eleventy (plantillas JavaScript `.11ty.js` que los importan).

## Contexto `ctx` (lo construye el build, igual para todos los partials)

| Campo | Tipo | Qué es |
|---|---|---|
| `locale` | `'es' \| 'en'` | Idioma de la página. |
| `t(key)` | `string → string` | Texto de `content/<locale>.json`, con `{years}` ya sustituido. Puede llevar HTML en línea validado: se inserta **sin escapar**. Clave inexistente = error de build. |
| `facts` | objeto | `content/facts.json` tal cual. |
| `esc(s)` | `string → string` | Escapa HTML. Obligatorio para cualquier valor de `facts` dentro del HTML o de un atributo. |
| `tr(item)` | `string \| {i18n} → string` | Resuelve un elemento de lista de `facts`: un literal se escapa; `{ "i18n": "clave" }` se traduce con `t`. |
| `years` | número | Años completos desde `facts.career.start` hasta la fecha del build. |
| `today` | `'AAAA-MM'` | Mes del build. Solo para cerrar el tramo en curso de la cota de experiencia (la etapa con `end: null`). |
| `headScript` | string | Contenido de `src/scripts/head.js` (vacío si no existe). Ya escapado en el build (`</` pasa a `<\/`): se inserta tal cual en un `<script>` inline antes de pintar. |
| `paths` | objeto | `{ home, alternates: { es, en }, asset(ruta) }`: URLs de la página actual, de sus equivalentes y de los recursos. `asset('assets/foto.jpg')` → `/assets/foto.jpg`; `styles.css` y `main.js` salen con `?v=<hash del contenido>` para la caché larga (absoluta desde la raíz del sitio: hay que verlo con `npm run dev`, no con `file://`). |

Reglas: funciones puras (sin E/S, sin estado global, sin fecha actual: usan `years` y `today`). Un solo `h1` (en `hero`). Ids de sección y clases, los de la v6. Las claves de cada partial están en su cabecera; si necesitas una nueva, sigue `CONTRACTS.md` §2.
Quién lo toca: subagente de plantillas; `head.mjs`, del de SEO; `layout.mjs` y `language-picker.mjs`, del integrador.
