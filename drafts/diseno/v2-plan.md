# Plan de diseño v2 (fase 3) — Web CV de Toni Gomila

Sujeto: portfolio-CV bilingüe de un backend Java con visión de sistemas e IA. Audiencia: reclutadores, managers técnicos y no técnicos, otros devs. Trabajo principal: en 30 s entender quién es y qué aporta, y animarse a escribir. Segundo: aguantar una lectura profunda.

Dado por el brief (no se discute): claro = dirección A (papel, tinta marino, índigo, subrayado del logo); oscuro = dirección B (#0d1117, superficies #21262d, bordes #30363d, acento #58a6ff, rejilla y red de nodos, violeta solo en detalles). Conmutador Auto/Claro/Oscuro.

## 1. Plan inicial (v0)

**Color (tokens, cada tema)**
| Token | Claro | Oscuro |
|---|---|---|
| fondo | #EDEDED | #0d1117 |
| superficie | #FBFBFA | #21262d |
| tinta | #202A42 | #e6edf3 |
| acento | #526DE5 (trazos) / #3A51C6 (texto) | #58a6ff |
| borde | #A9AFC2 | #30363d |
| detalle | violeta #6639BA | violeta #a78bfa |

**Tipografía**: pila del sistema sans para todo, mono para etiquetas pequeñas, titulares en sans pesado.

**Layout (v0)**: hero de dos columnas (texto + foto), etiqueta en mayúsculas sobre cada título, secciones numeradas 01–07, tarjetas con borde y sombra para pilares, decisiones y formación, etiquetas (chips) para tecnologías.

```
+------------------------------+
| tg            ES  Auto       |
| ETIQUETA · Barcelona         |
| Backend Java que entiende el |
| ~sistema completo~     (foto)|
| [Ver proyectos][LinkedIn]... |
+------------------------------+
| 01  SOBRE MÍ                 |
| [card][card][card]           |
```

## 2. Revisión contra el brief: qué era genérico y qué cambié

Pasé el plan v0 por la pregunta "¿esto saldría igual para cualquier portfolio de dev?". Sí, casi todo. Cambios:

| Había en v0 (genérico) | Por qué es un tell | Cambio |
|---|---|---|
| Etiqueta MAYÚSCULAS en mono sobre cada título | Chrome de plantilla, repite lo que dice el título | Eliminadas. Los h2 van solos. Las etiquetas Problema/Decisión/Por qué pasan a negrita en frase normal, porque sí estructuran el contenido |
| Numeración 01–07 en secciones | Las secciones no son una secuencia | Eliminada. En su lugar, nodos sobre un riel (ver punto 3) |
| "Eyebrow" del hero con puntos medios | Cadena A · B · C | El nombre pasa a ser la primera línea del h1 (dato útil y SEO), sin puntos medios; ubicación en texto normal |
| Una palabra del titular subrayada | Tell clásico | Titular entero en una sola voz tipográfica, sin resaltar nada |
| Tarjetas idénticas con la misma sombra | Kit SaaS | Pilares: columnas abiertas separadas por filetes. Decisiones: filas de tabla (título a la izquierda, texto a la derecha). Superficie con fondo solo donde hay una razón: bloque de largo plazo, panel de homepanel, decisión 3, anécdota y certificaciones. Sin sombras en ningún tema |
| Chips de tecnologías en todas partes | Decoración | Texto corrido separado por comas. En "Stack", el nivel se codifica con peso tipográfico (uso diario grande, conozco normal, exploro atenuado) |
| Mono en todas las etiquetas | Chrome de plantilla | Mono solo para lo que es código o URL (`main`, `git`, repo) y para el logotipo "tg" (viene del logo) |
| Numeración 1–7 en decisiones del homelab | No son secuencia | Sin números; cada decisión se identifica por su título |
| Pilares con iconos en círculo | Relleno | Quitados |
| Dos tipografías sans parecidas / una sola pila gris | Sin personalidad | Titulares en serif de sistema (Charter/Sitka/Cambria/Georgia), cuerpo en sans de sistema. Dos familias claramente distintas, solo locales |
| Subrayado grueso bajo cada h2 y h3 | Repetido hasta el vacío | Solo existe un subrayado índigo: el del logo, girado 90 grados, que es el riel |
| Botones secundarios casi invisibles en oscuro | Contraste | Contorno y texto con la tinta (#e6edf3) y borde de 1,5 px; verificado por script |

## 3. La única cosa memorable: el riel

El subrayado índigo del logo (la línea bajo "tg") se gira 90 grados y se convierte en un **riel vertical que recorre toda la página**, del hero al contacto. Es el hilo del mensaje ("entender el sistema entero, de la base de datos al despliegue"): una sola línea atraviesa todas las capas. Cada sección cuelga de un nodo del riel; los puestos de la experiencia son nodos en el mismo riel (la línea de tiempo no es un componente aparte, es el riel, así que el alineado es correcto por construcción). Al hacer scroll, el nodo de la sección visible se rellena (en oscuro, con halo: eco de la red de nodos de B). En móvil el riel vive en el margen de 16 px, sin quitar ancho al texto.

Todo lo demás es deliberadamente quieto: sin sombras, sin degradados decorativos, un único movimiento de carga (la red del hero se dibuja una vez en oscuro) y el flujo del diagrama del homelab, que sí informa.

## 4. Plan final

**Color**: ver tabla del punto 1; añado `--ctl` (borde de controles), `--faint` para texto atenuado de nivel "exploro", y ajusto cada par tras el script de contraste (`contraste.js`, resultados al final).

**Tipografía**
- Titulares (h1, h2, h3 de contenido grande): serif de sistema `Charter, "Bitstream Charter", "Sitka Text", Cambria, Georgia, serif`, peso 700, interlineado 1.1, tracking -0.01em. Escala: h1 clamp(2.3rem, 8.5vw, 4.25rem); h2 clamp(1.8rem, 5.5vw, 2.6rem); h3 1.3rem.
- Cuerpo: sans de sistema, 1.0625rem móvil / 1.125rem escritorio, interlineado 1.65, medida 64ch.
- Mono: solo código, URL y el logotipo.

**Layout**: alineado a la izquierda siempre (texto largo, no centrado ni justificado). Contenedor 62rem, margen lateral 16 px (32 px desde 720 px; 56 px de sangría izquierda desde 720 px para alojar el riel).

```
móvil 360                       escritorio 1280
|r| (foto 120, anillo)          |   tg   Sobre mí Experiencia ...  ES Auto |
|r| Toni Gomila                 |   o  Toni Gomila              (foto 260) |
|r| Backend Java que entiende   |   |  Backend Java que entiende el        |
|r| el sistema completo         |   |  sistema completo                    |
|r| subtítulo, valor, IA        |   |  subtítulo / valor / IA / botones    |
|r| [Ver proyectos]             |   o  Sobre mí                            |
|r| [Email][LinkedIn][GitHub]   |   |  texto                               |
|o| Sobre mí                    |   |  [bloque largo plazo]                |
|r| ...                         |   o  Qué hago                            |
|r|                             |   |  col 1 | col 2 | col 3 (filetes)     |
                                |   o  Experiencia                         |
                                |   o---- Senior ...                       |
                                |   o---- Java Developer ...               |
```
(r = riel de 2 px, o = nodo)

**Secciones**: Hero (nombre+titular+valor+IA+enlaces, foto con anillo concéntrico, red de nodos en oscuro). Sobre mí (dos párrafos + bloque de largo plazo en superficie, tipografía serif). Qué hago (3 columnas abiertas). Experiencia (riel con nodos por puesto, tecnologías en texto). Proyecto homepanel (un panel con tres columnas y banda de lección). Homelab (texto, diagrama SVG, decisiones en filas, anécdota). Stack (niveles por peso tipográfico) y certificaciones (lista de filas). Formación (3 bloques con filetes). Contacto (titular grande, correo como enlace grande, botones, nota de liderazgo).

**Principios**
1. Una idea audaz (el riel), todo lo demás en silencio.
2. La estructura visual significa algo: nodos = secciones y puestos; peso tipográfico = nivel de dominio; filas = problema/decisión/por qué.
3. Contraste AA real en ambos temas, probado por script.
4. Sin CDN, sin librerías, sin fuentes remotas.
5. El movimiento responde al usuario (nodo activo) o informa (flujo del diagrama); respeta prefers-reduced-motion.

## 5. Decisiones de contenido
Se conserva todo el contenido real de hibrido.html. Se omiten [FALTA] (PDF, capturas, ThePower, caso de estudio "esta web"), teléfono, IPs y nombres internos. Se eliminan duplicados de etiqueta ("A largo plazo" encima de "A largo plazo me interesa..."). No se añade copy nuevo salvo la etiqueta de acción de accesibilidad del conmutador y del enlace de salto, ya presentes en v1.

## 6. Resultados de verificación
(Se rellenan al final del documento tras el script de contraste y las pruebas en navegador.)

### Resultados
- Contraste (script `v2-contraste.js`, WCAG): todos los pares de texto del tema claro y oscuro >= 5,0:1 (texto normal exige 4,5); bordes de control >= 5,0 (claro) y 6,1 (oscuro) frente a 3 requerido; riel 3,8 (claro) y 7,5 (oscuro). Se subió `--faint` y `--ctl` hasta pasar. El único fallo del script (índigo sobre la banda marino, 2,16) es un par que no se usa: en la banda se usa `--band-label` (7,5).
- Navegador integrado, claro y oscuro: 360 px (sin desborde: scrollWidth 360), 1000 px; 1280 px solo por geometría (sin desborde, scrollWidth 1265 = ancho menos barra). Anillo de la foto concéntrico (desfase 0,0). Eje del riel y centro de los puntos de la línea de tiempo coinciden (8 px en móvil, 20 px en escritorio).
- Cambio tras la primera captura: sangría izquierda móvil de 22 px (el punto tocaba el texto con 16 px) y punto de 12 px en móvil. El margen derecho sigue en 16 px.
- No verificado: Safari/Firefox, lector de pantalla, foco visible solo comprobado por CSS (no por captura), render real a 1280 px (el panel solo mide 491 px y escala la captura), `prefers-reduced-motion` solo por lectura de CSS. Las pilas serif/sans dependen de las fuentes instaladas en cada sistema.
