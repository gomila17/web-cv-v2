# Notas de diseño v4 (versión consolidada, fin de la fase de diseño)

Entrega: `hibrido-v4.html` (autocontenido; foto por ruta relativa `foto.jpg`) y `v4-contraste.js`. Método: guías de Impeccable leídas como texto (craft-floor, typeset, layout, colorize, polish); no se ejecutó el lanzador ni ninguna herramienta externa.

## 1. Qué se tomó de cada versión

| Versión | Qué entra en v4 |
|---|---|
| `hibrido.html` (base) | Estructura completa, hero de dos columnas con foto circular y anillo concéntrico, tarjetas, pilares con iconos (sin hueco), tono, tema claro (A) y oscuro (B), botones con contraste corregido en oscuro, diagrama del homelab en dos disposiciones, tarjetas problema/decisión/por qué, stack, formación, pie. |
| `hibrido-v2.html` | Nada. Su riel vertical, el serif en titulares y el resto no entran. |
| `hibrido-v3.html` | Solo la **cota de tiempo proporcional** de Experiencia (9, 30 y 9+ meses, con topes y marcas 2022 / 2023 / 2026), reescrita en el lenguaje de la base: mono, nodos redondos como los de la línea de tiempo antigua, puestos en tarjetas. No entra el plano técnico, el cajetín, la tipografía condensada ni la rejilla general. |

Contenido: el de `contenido-final.md` sin cambios (los tres puestos íntegros, con sus fechas, viñetas y tecnologías). Etiquetas de interfaz EN (Problem, Decision, Why, Accepted limit, Lesson, etc.) tomadas del propio contenido; los nombres de sección se han traducido de forma literal ("About me", "What I do", "Featured project", "Education"). No hay `[FALTA]`, ni teléfono, ni IPs, ni nombres de máquinas.

## 2. Fondo: decisiones y justificación

Problema: en la base el fondo era un único papel plano (claro) o un degradado solo en el hero con rejilla (oscuro). Toni lo veía soso, más aún en claro, y descartó la cuadrícula general. Principio: **el fondo es una secuencia de planos con una función cada uno, no una capa de decoración**. Cada recurso sale del universo de la web (nodos, subrayado del logo, el diagrama) y está localizado.

| Recurso | Dónde | Por qué |
|---|---|---|
| **Planos tonales alternos** (`--plane`: papel + 8 % de índigo en claro; `#111827` en oscuro) | Qué hago, Proyecto, Stack | Alternan con el papel liso (Sobre mí, Experiencia, Homelab, Formación) y crean ritmo de lectura sin bordes pesados. Las tarjetas claras destacan más sobre el plano que sobre el papel. Solo tintes de los colores pinneados. |
| **Resplandor localizado en cada plano** (radial en una esquina distinta) | Los tres planos | Cada plano tiene una esquina viva distinta; el ojo no ve la misma "pantalla" repetida. Alfa bajo (13 % / 8 %), calculado en el script. |
| **Atmósfera propia del hero**: degradado vertical frío en claro (degradado violeta-azul de B en oscuro) + dos manchas radiales que derivan lentamente (solo `transform`) | Hero | El primer vistazo es el que decide. Las manchas dan profundidad sin ruido. En claro la mancha violeta es casi imperceptible (violeta solo en detalles). |
| **Rejilla enmascarada** radialmente, solo tras la foto y la red de nodos | Hero | La rejilla pedida "como mucho muy localizada": se desvanece antes de llegar al texto. |
| **Borde inferior en diagonal** del hero (`clip-path`) | Hero → Sobre mí | Rompe la horizontal y marca el paso de "presentación" a "contenido" sin sombra ni línea. |
| **Monograma "tg" fantasma** (solo trazo, con la barra del logo debajo) | Sobre mí, a la derecha | Trazo del logo como forma de fondo. Alfa del trazo calculado: no compromete el texto. |
| **Puntos muy sutiles**, desvanecidos hacia la esquina | Experiencia, junto a la cota | Textura de "papel de medir" justo donde hay una escala, no en toda la sección. |
| **Escenario del diagrama**: rejilla + resplandor que sobresalen del marco | Homelab | La rejilla vive donde tiene sentido (un esquema) y se desvanece hacia los bordes. |
| **Pie oscuro** (marino `#202A42` en claro, `#161b22` en oscuro) con mancha y red de nodos | Contacto | Cierre con campo comprometido: la página termina con la misma firma visual del hero. En claro aporta el contraste de color que le faltaba a la página. |

No hay cuadrícula en el fondo general. Descartado: patrones repetidos en todas las secciones, degradados de página completa y bandas con ondas.

## 3. Experiencia: la cota

- Tres tramos con `flex` proporcional a los meses reales: Intern 9, Java Developer 30, Senior 9+ (oct 2022 → jul 2023 → ene 2026 → hoy). Marcas: años en móvil, mes y año desde 720 px. El tramo Senior termina en un nodo relleno con un pulso violeta suave ("sigue en curso"). Intensidad creciente de la línea (50 %, 78 %, 100 %) como lectura de trayectoria.
- Es decorativa (`aria-hidden`): toda la información está en las tarjetas de debajo, que van de más reciente a más antiguo como en la base.
- Con ratón, pasar sobre un puesto resalta su tramo en la cota.
- Sin desbordes ni solapes de marcas a 360 y 1280 px, en ES y EN.

## 4. Sistema de movimiento

Principios: una curva (exponencial de salida `cubic-bezier(.16,1,.3,1)`; "pop" con ligero rebote solo en piezas pequeñas), tres duraciones (micro .2–.35 s, estado .4–.6 s, entrada .7–1 s), escalonado de 90–120 ms. Cada movimiento tiene un significado; los gestos se repiten **por rol**, no por casualidad.

| Gesto | Se usa en | Por qué |
|---|---|---|
| **Secuencia de entrada** (cabecera, foto que se asienta, eyebrow que entra de lado, titular que sube, subrayado de "sistema completo" que se dibuja, subtítulo, valor, nota de IA, botones en cascada, nodos de la red que aparecen y se conectan) | Hero | Un solo momento orquestado, de ~1,6 s. El subrayado que se dibuja es el eco del subrayado del logo y señala la idea central. Va por CSS: no depende de JS. |
| **Subrayado que se dibuja** (`scaleX`) | Encabezados de sección | Un solo gesto de "apertura" repetido en todas las secciones: marca de sistema. |
| **Asentarse** (sube y escala 0,97 → 1) | Tarjetas: pilares, puestos, proyecto, decisiones, stack, formación | Las tarjetas son objetos; llegan con volumen, no como texto. |
| **Fundido** (sin desplazamiento) | Párrafos y subtítulos | El texto de lectura no se mueve para no distraer. |
| **Entrada lateral** | Bloque "a largo plazo", anécdota, frase final | Los bloques con filete lateral entran desde ese lado. |
| **Pop** (escala con rebote) | Iconos de pilares, números de decisiones, etiquetas del stack (en cascada) | Piezas pequeñas: un toque de vida sin peso. |
| **Cota que se dibuja a velocidad constante** (34 ms por mes) | Experiencia | El tiempo de dibujo de cada tramo es proporcional a su duración real: 9 meses tarda lo que un tercio de 30. Los nodos aparecen cuando la línea los alcanza y las etiquetas los siguen. El movimiento codifica el dato. |
| **Paquetes de flujo** (círculos que viajan por `transform`, retardo en cadena a lo largo de la ruta web) | Diagrama del homelab | Sustituye los puntos de `stroke-dashoffset`. Solo corren cuando el diagrama es visible (se pausan antes y fuera de pantalla). Los bloques del diagrama también entran en cascada. |
| **Microinteracciones** | Botones (relleno que barre desde la izquierda, pulsación 0,98), enlaces (subrayado que crece), nav y marca `tg` (subrayado que se extiende), selector de idioma (la píldora se desliza), tema (el icono gira 180° en cada cambio), pilares (icono gira), tarjetas (borde al acento), foco (el anillo entra desde fuera) | Respuesta inmediata y coherente en todo lo que se puede tocar. |
| **Cambio de tema e idioma** | Toda la página | Fundido con View Transitions; si el navegador no las tiene, transición de colores de 350 ms. |

Rendimiento: las animaciones de entrada y los bucles usan solo `transform` y `opacity`. Excepciones declaradas: (a) el subrayado del titular del hero anima `background-size` una vez (un elemento, 0,9 s), porque el elemento puede partirse en dos líneas; (b) las transiciones de color en botones/enlaces/bordes al pasar el ratón, y el fundido de tema de reserva; todas son de pintura sin layout. Sin librerías. Las manchas del hero son dos elementos con animación lenta infinita, solo `transform`.

Robustez y accesibilidad del movimiento:
- **Sin JS**: la clase `anim` solo la añade un script de cabecera; sin ella todo el contenido es visible y el hero ejecuta su animación de CSS (que termina visible). Los paquetes del diagrama corren sin necesidad de JS.
- **Si el script falla**: una red de seguridad de 3 s quita la clase `anim` y todo queda visible.
- **`prefers-reduced-motion`**: el script de cabecera no activa `anim`, los revelados no existen, `animation` y `transition` quedan anulados, los paquetes del diagrama se ocultan (las flechas estáticas siguen mostrando la dirección) y el scroll es instantáneo.
- Impresión: contenido siempre visible.

## 5. Inglés: cómo funciona

- Selector ES/EN real: dos botones con `aria-pressed` y píldora deslizante. Elección guardada en `localStorage` (`tg-lang`, en try/catch); también se acepta `?lang=en` para enlazar. Si no hay elección, la página abre en español.
- `<html lang>` se actualiza al cambiar, igual que `<title>`, la meta descripción, los `aria-label`, el `alt` de la foto, el título y la descripción del diagrama (ambas disposiciones) y las etiquetas del conmutador de tema (Auto / Light / Dark y su `aria-label`).
- Mecanismo: el español es el HTML por defecto (válido sin JS); cada elemento traducible lleva `data-i18n` y el script guarda su texto español y lo sustituye por el del diccionario EN. Los textos EN salen de los campos EN de `contenido-final.md` (adaptados donde la base resume, p. ej. decisiones de homepanel y pilares). Comprobado con script: las 177 claves del HTML tienen su entrada EN y ninguna entrada sobra.
- Maquetación comprobada con el inglés: sin desborde horizontal a 360 ni a 1280 px; cabecera (selector + tema) en una línea; cota sin solapes (marcas "Oct 2022 / Jul 2023 / Jan 2026"); tabla de decisiones (la etiqueta "Accepted limit" cabe en dos líneas en una columna de 6,4 rem); pilares, botones y tarjetas del stack sin cortes; diagrama con textos traducidos que caben en sus cajas en ambas disposiciones.
- Cambios mínimos de copy de interfaz: la etiqueta "Límite" pasa a "Límite asumido" (como en el contenido) y las notas de grado usan coma o punto decimal según idioma (8,92 / 8.92).

## 6. Contraste (v4-contraste.js)

`node v4-contraste.js`: 0 fallos tras corregir dos casos que el propio script detectó (el filete violeta sobre el pie marino, ahora del color de etiqueta del pie; y el índigo del eyebrow bajo la mancha del hero en claro, con la mancha bajada del 20 % al 12 %). Incluye el peor caso del texto sobre cada mancha, resplandor y monograma fantasma, además de los pares de texto, enlaces, botón primario, pie y no-texto (controles, trazos, diagrama). Resultados principales: texto 12,2 / 16,0; atenuado ≥ 5,3 en claro y ≥ 6,2 en oscuro sobre planos lisos; enlaces ≥ 5,0; botón primario ≥ 6,6.

## 7. Verificación hecha

Una tanda por lotes en el navegador integrado y una comprobación de métricas, con servidor local temporal (parado después, sin `launch.json`):
- 360 px claro ES; 360 px oscuro EN (cambio de idioma y de tema haciendo clic, `localStorage` guardado, `<html lang>`, título y `aria-label` actualizados); 1280 px oscuro ES; 1280 px claro EN. Barrido de scroll completo en cada uno: todos los elementos revelados, `scrollWidth` = ancho útil (sin desborde), sin errores de consola.
- Los paquetes del diagrama se mueven y se pausan fuera de pantalla; el resaltado cota↔puesto funciona; al quitar la clase `anim` todo es visible.

**No verificado**: Safari y Firefox (View Transitions tiene reserva por clase, sin probar); lector de pantalla; `prefers-reduced-motion` y navegación sin JS reales (solo comprobados por lectura del CSS y simulando la caída de la clase `anim`); capturas de escritorio con poca resolución (el panel es pequeño: a 1280 se revisó la composición, no el detalle fino); 320 px, 720/900/1000 px por métricas solamente; aspecto de las animaciones en tiempo real (se midió su estado, no se grabó); impresión.

## 8. Riesgos y decisiones abiertas

- Se mantienen de la base, por decisión de Toni, los números de sección, el eyebrow y los filetes laterales de color (callout "largo plazo", anécdota, decisión 3). Las guías de diseño los desaconsejan; si se quiere pulir, es lo primero que se tocaría.
- La decisión 7 sigue marcada `[REVISAR]` en `contenido-final.md` (se incluye tal cual). Spring Boot y ThePower siguen fuera, y el email visible está pendiente de confirmar.
- Idioma por defecto: español. En el sitio real (`/` de elección de idioma, `ARCHITECTURE.md` decisión 5) cada idioma tendrá su URL; este selector es el prototipo del comportamiento.
- Diagrama: hay dos disposiciones (ancha y vertical) que mantener sincronizadas; `homelab-diagrama.svg` independiente no se ha modificado y conserva la animación antigua.
- Lo que no está en el HTML: PDF del CV y capturas de homepanel siguen ausentes y se omiten, sin huecos.
