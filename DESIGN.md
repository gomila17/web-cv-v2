# DESIGN — Web CV v2 (Toni Gomila)

Estado: **aprobado por Toni (2026-10-13)**. Cierra la fase 3. Es el contrato visual para la implementación (fase 4).

- **Referencia viva:** `drafts/diseno/versiones/v6-aprobada/hibrido-v6.html` (copia congelada; no se edita). Ante cualquier duda, manda lo que se ve ahí.
- **Detalle y porqués:** `v4-notas.md` (fondo, cota, movimiento, i18n) y `v5-notas.md` (foto, scroll) en la misma carpeta.
- **Contexto:** `PRODUCT.md` (qué y para quién), `ARCHITECTURE.md` (cómo se construye), `drafts/contenido-final.md` (textos).

## 1. Principios

1. **Un hilo: entender el sistema entero.** El fondo, la cota y el diagrama cuentan eso; nada es decoración sin función.
2. **Legibilidad antes que efecto.** Contraste AA calculado, no a ojo. El movimiento nunca oculta contenido.
3. **El movimiento codifica algo** (tiempo, flujo, apertura de sección) y responde al scroll en ambos sentidos.
4. **Claro de la dirección A, oscuro de la dirección B.** Paletas pinneadas por Toni; no se reinterpretan.
5. **Funciona sin JS, sin animaciones y sin la foto recortada.** Las capas de mejora son eso: mejoras.

## 2. Color

Tokens CSS en `:root`; tema por `prefers-color-scheme` y forzable con `html[data-theme="light|dark"]`.

| Token | Claro (A) | Oscuro (B) | Uso |
|---|---|---|---|
| `--bg` | `#EDEDED` | `#0d1117` | Papel / fondo |
| `--plane` | `#E2E5EF` | `#111827` | Planos tonales alternos |
| `--card` | `#FBFBFA` | `#21262d` | Tarjetas, controles |
| `--line` | `#A9AFC2` | `#30363d` | Bordes |
| `--text` | `#202A42` | `#e6edf3` | Texto |
| `--muted` | `#4A5470` | `#9aa4b0` | Texto secundario |
| `--accent` | `#526DE5` | `#58a6ff` | Trazos, nodos, subrayados |
| `--accent-ink` | `#3A51C6` | `#58a6ff` | Enlaces y texto en acento |
| `--primary-bg` | `#3A51C6` | `#58a6ff` | Botón primario |
| `--violet` | `#6639BA` | `#a78bfa` | Solo detalles (bloque de largo plazo, pulso "en curso") |
| `--band-bg` | `#202A42` | `#161b22` | Pie y bandas oscuras |

El resto de tokens (manchas, resplandores, disco de la foto, filtros, cabecera fija) están en la referencia. **Regla:** cualquier color nuevo pasa por el script de contraste (`v5-contraste.js`), que hoy da 0 fallos.

## 3. Tipografía

- **Sans del sistema** para todo el texto (`ui-sans-serif, system-ui, Segoe UI, Roboto…`).
- **Mono del sistema** (`ui-monospace, Cascadia Code, Consolas…`) para el logotipo `tg`, fechas, etiquetas técnicas y la cota.
- Sin fuentes web descargadas en la v1.
- Escala: titular del hero `clamp(2.15rem, 8.5vw, 4rem)` (máx. 16ch); títulos de sección `clamp(1.6rem, 5vw, 2.2rem)`; subtítulo `1.2rem`; cuerpo `1rem`→`1.125rem` en escritorio. Medida de lectura `64ch`.

## 4. Layout

- Contenedor `max-width: 60rem`, margen lateral 16 px en móvil (`--gutter`), móvil primero.
- **Orden de secciones:** Hero → Sobre mí → Qué hago *(plano)* → Experiencia → Proyecto homepanel *(plano)* → Homelab → Stack *(plano)* → Formación → Contacto/pie *(banda oscura)*.
- Las secciones alternan papel y plano tonal; cada plano lleva un resplandor en una esquina distinta.
- Hero de dos columnas en escritorio (texto + foto), apilado en móvil, con borde inferior en diagonal.
- Sin desborde horizontal a 360 y 1280 px (requisito, no deseo).

## 5. Fondo

Sin cuadrícula general y sin fondo monótono. Recursos localizados, cada uno con función (detalle en `v4-notas.md` §2):

| Recurso | Dónde |
|---|---|
| Degradado + dos manchas que derivan; rejilla enmascarada solo tras foto y nodos | Hero |
| Planos tonales alternos con resplandor de esquina | Qué hago, Proyecto, Stack |
| Monograma "tg" fantasma (solo trazo) | Sobre mí |
| Puntos sutiles junto a la escala | Experiencia |
| Rejilla + resplandor detrás del diagrama | Homelab |
| Banda oscura con red de nodos | Pie |

## 6. Componentes

| Componente | Especificación |
|---|---|
| **Cabecera** | Fija con JS: transparente sobre el hero, con fondo al bajar. Logo `tg`, navegación (≥ 1000 px) con sección activa (`aria-current`), selector ES/EN (píldora deslizante), conmutador Auto/Claro/Oscuro. **Barra de progreso de lectura** de 2 px (acento → violeta) en su borde inferior. |
| **Foto** | `foto-recorte.png` sobre disco de marca dentro de un anillo concéntrico; la cabeza sobresale `--pop: .14`. Respaldo automático a `foto.jpg` con encuadre cerrado y pared neutralizada. |
| **Botones** | Primario relleno (`--primary-bg`); secundarios con borde, legibles en oscuro. Altura táctil ≥ 44 px. |
| **Cota de experiencia** | Línea con tramos proporcionales a meses reales (Intern 9, Java Developer 30, Senior 9+), marcas de fecha y nodo final "en curso". Decorativa (`aria-hidden`); los datos están en las tarjetas. Hover en un puesto resalta su tramo. |
| **Tarjetas** | Radio 12 px, borde `--line`, sombra suave en claro y ninguna en oscuro. Puestos, pilares, proyecto, decisiones, stack, formación. |
| **Pilares** | Tres tarjetas con icono SVG, una columna hasta 900 px y tres a partir de ahí. |
| **Homelab** | Diagrama SVG en dos disposiciones (horizontal ≥ 820 px, vertical en móvil), con colores del tema, `role="img"` + `title` + `desc`. Debajo, decisiones d1–d7 (problema → decisión → por qué) y una anécdota. |
| **Bloque de largo plazo** | Separado del texto, con filete violeta. |
| **Volver arriba** | Botón redondo de 52 px abajo a la derecha, aparece pasado el hero, con **anillo de progreso** que replica la barra superior. Lleva el foco al logo. |

## 7. Movimiento

Curva única `cubic-bezier(.16,1,.3,1)`; "pop" con rebote solo en piezas pequeñas. Duraciones: micro .2–.35 s, estado .4–.6 s, entrada .7–1 s. Solo `transform`/`opacity` (excepciones documentadas en `v4-notas.md` §4).

- **Entrada del hero** orquestada (~1,6 s, en CSS): foto, titular, subrayado que se dibuja, botones en cascada, red de nodos.
- **Tres momentos fuertes ligados al scroll:** (1) parallax del hero, (2) la cota se rellena al ritmo del scroll y en proporción a los meses, (3) el diagrama se enciende bloque a bloque en el sentido del tráfico y después arrancan los paquetes de flujo.
- **Sutiles:** barra de lectura, títulos que salen de una máscara, sección activa, revelados por rol (tarjetas que se asientan, texto que aparece, bloques laterales, pop de iconos y etiquetas).
- **Los revelados se repiten:** un elemento se reinicia al salir **del todo** de la pantalla y vuelve a animarse al entrar, en ambos sentidos.
- **Microinteracciones** en botones, enlaces, selectores y tarjetas; fundido al cambiar de tema o idioma.
- **Compatibilidad:** animaciones de scroll nativas en CSS cuando existen; si no, un único listener pasivo con `requestAnimationFrame`.
- **Obligatorio:** `prefers-reduced-motion` desactiva todo y deja la página estática y completa; sin JS todo es visible; red de seguridad de 3 s si el script falla.

## 8. Idiomas

- Español por defecto, inglés completo (177 claves comprobadas, sin desbordes). Cada cambio actualiza `<html lang>`, título, meta, `aria-label`, `alt` y textos del diagrama.
- En el prototipo es un selector en la misma página. **En el sitio real cada idioma tiene su URL** (`/es/`, `/en/`, ver `ARCHITECTURE.md` decisión 5); el selector enlaza a la página equivalente.

## 9. Accesibilidad (mínimos)

AA calculado; foco visible; enlace de salto; objetivos táctiles ≥ 44 px; un solo `h1`; diagrama y foto con texto alternativo; movimiento reducido respetado; contenido completo sin JS.

## 10. Notas para la implementación (fase 4)

- Sacar el CSS y el JS del HTML único a ficheros propios y separar los textos en `content/es` y `content/en` (claves ya existentes en la referencia).
- **Una sola fuente para el diagrama del homelab**: hoy hay dos disposiciones a mano más `homelab-diagrama.svg`, que está desactualizado. Unificarlo.
- Rutas definitivas de la foto: `assets/foto-recorte.png` y `assets/foto.jpg` (cambiarlas también en el respaldo `onerror`).
- Los rangos de animación de la cota y el diagrama están afinados para las alturas actuales: revisarlos si cambian mucho.

## 11. Pendiente y fuera de este documento

- **Por verificar en fase 5:** Firefox y Safari reales, lector de pantalla, movimiento reducido y sin JS reales, escritorio a tamaño real, 320 px, impresión, fluidez a 60 fps.
- **Rasgos que las guías desaconsejan y se mantienen por decisión de Toni:** números de sección, etiqueta sobre los títulos, filetes laterales de color. Candidatos a pulir más adelante.
- **Contenido abierto:** Spring Boot `[REVISAR]`, PDF del CV (sin teléfono) y capturas de homepanel. Resueltos: decisión 7 del homelab (redacción aprobada por Toni, 2026-10-14) y ThePower (programa PowerSkills, con enlace de verificación).
- **SEO de redacción** (títulos y descripciones por idioma, `ARCHITECTURE.md` §SEO): se redacta al inicio de la fase 4.
- En oscuro, el pelo que sobresale del disco tiene poco contraste con el hero: aceptado; se ajusta con `--pop` si molesta.
