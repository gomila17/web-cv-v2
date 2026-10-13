# Plan de diseño v3 (fase 3) — Web CV de Toni Gomila

Método: guías de Impeccable (new-work, mode-persuade, craft-floor, typeset, layout, colorize, polish) leídas como texto. El lanzador de contexto no se ejecutó (regla del encargo); el contexto se leyó directamente de PRODUCT.md, SPEC.md, ARCHITECTURE.md y drafts/contenido-final.md. Es un rediseño por encargo ("replace") con decisiones pinneadas: el brief manda.

## 1. Contexto

- Sujeto: portfolio-CV bilingüe de Toni Gomila, backend Java en Barcelona, con visión de sistemas e IA.
- Audiencia: reclutadores y managers (técnicos y no), otros devs. Llegan con poco tiempo.
- Modo: **Persuade** con lectura profunda de apoyo. Trabajo principal: en 30 s entender quién es, qué aporta y escribirle. Segundo: aguantar la lectura de experiencia, homepanel y homelab.
- Pinneado por Toni (no se discute): claro = dirección A (papel #EDEDED, marino #202A42, índigo #526DE5, subrayado del logo como motivo); oscuro = dirección B (#0d1117, superficies #21262d, bordes #30363d, acento #58a6ff, rejilla sutil y red de nodos, violeta solo en detalles); conmutador Auto/Claro/Oscuro con `data-theme` y localStorage en try/catch; contenido real de contenido-final.md; HTML/CSS estático sin CDN; móvil primero, 16 px de margen, AA, foco visible, enlace de salto, reduced-motion.
- Qué evitar (leído): **v1** (`hibrido.html`): hero en dos columnas con foto circular, tarjetas con sombra, palabra subrayada en el titular, sans única. **v2**: riel vertical índigo con nodos recorriendo toda la página, serif de sistema en titulares, columna única alineada a la izquierda, filas problema/decisión en dl, foto circular con anillo.

## 2. Idea organizadora: la lámina del sistema

La web es **una lámina de plano técnico** (el formato en el que se entiende un sistema completo de un vistazo), no una página con decoración técnica encima:

| Convención de plano | Qué hace en esta web (función real, no adorno) |
|---|---|
| **Cajetín** (cuadro de datos de la lámina) | Fila de datos al pie del hero: quién (foto y nombre), rol, lugar, trayectoria, contacto. Es el resumen de 30 s. Se repite al final como bloque de contacto |
| **Línea de cota** (la línea con topes y cifra) | El subrayado del logo `tg` es ya una cota. Se usa como regla de tiempo de la experiencia: tres tramos proporcionales a los meses reales (9, 30 y 9+) |
| **Rayado de sección** | Cada uno de los tres pilares tiene su trama (diagonal, cuadrícula, puntos): son las capas de un corte del sistema, de la base de datos al despliegue |
| **Cruz de registro** | Marca de 15 px que abre cada sección y esquinas de recorte en la foto |
| **Rejilla de dibujo** | Rejilla sutil en todo el fondo (en oscuro es la rejilla de B; en claro es papel cuadriculado de dibujo) y la red de nodos del hero, trazada en ángulos rectos como un esquema |
| **Triángulo de revisión (delta)** | Marca violeta en el bloque de largo plazo ("lo que viene"), único uso del violeta fuera del diagrama |
| **Lista de materiales (BOM)** | El stack, por nivel, como celdas de tabla; el nivel se lee por texto y por puntos llenos/vacíos |
| **Tabla de revisiones** | Las decisiones d1–d7 del homelab en columnas Problema / Decisión / Por qué |

Por qué sirve a la audiencia: el mensaje de Toni es "entender el sistema entero". Un plano es el género donde alguien lee primero el cajetín (quién/qué/cuándo/contacto) y después baja a los detalles. Quien llega con 30 s tiene lo esencial en la primera pantalla en formato de datos escaneable; quien se queda encuentra un documento técnico serio con un diagrama real (el homelab) en su sitio natural. La metáfora no es un cuadro: todas las piezas anteriores son controles, textos y datos reales.

Diferencia con v1/v2 (otro mundo, no otra capa de pintura): v2 = un hilo vertical único que cose secciones; v3 = una **hoja de datos en retícula** con filas partidas por reglas de tinta, columna de etiqueta a la izquierda y contenido a la derecha, sin hilo continuo. Hero tipográfico a todo el ancho con cajetín (v2: texto + foto circular). Titulares en grotesca condensada de sistema (v2: serif). Foto rectangular con marcas de recorte (v2: círculo con anillo). Experiencia con regla de tiempo proporcional + filas (v2: nodos en riel). Pilares como capas apiladas con rayado (v2: tres columnas con filetes). Decisiones como tabla (v2: dl). Stack como BOM por celdas (v2: pesos tipográficos).

## 3. Tokens

**Color** (roles; cada tema compuesto, no invertido)

| Token | Claro (A) | Oscuro (B) |
|---|---|---|
| `--bg` papel | #EDEDED | #0d1117 |
| `--surface` celdas | #FBFBFA | #21262d |
| `--ink` texto | #202A42 | #e6edf3 |
| `--muted` | #4A5470 | #9aa4b0 |
| `--faint` | #5A6480 | #8b95a1 |
| `--rule` regla principal | #202A42 | #8b949e |
| `--line` filete | #A9AFC2 | #30363d |
| `--accent` trazos | #526DE5 | #58a6ff |
| `--accent-ink` texto/enlaces | #3A51C6 | #58a6ff |
| `--primary` botón | #3A51C6 (texto blanco) | #58a6ff (texto #0d1117) |
| `--violet` detalle | #6639BA | #a78bfa |
| `--band` bloque de contacto | #202A42 | #161b22 |
| `--band-ink / -muted / -accent` | #EDEDED / #C5CBE0 / #A9B8FF | #e6edf3 / #9aa4b0 / #58a6ff |
| rejilla | rgba(32,42,66,.06) | rgba(255,255,255,.045) |

Estrategia de color: restringida en superficie (papel + tinta + un acento), con un **campo comprometido a escala de página**: el bloque de contacto, marino en claro y #161b22 en oscuro. Índigo/azul solo para cotas, trazos, enlaces y acción primaria. Violeta solo en delta, un punto del hero y el flujo VPN del diagrama.

**Tipografía** (solo pilas locales)
- Titulares y cifras: `"Bahnschrift SemiCondensed", "Bahnschrift", "DIN Alternate", "DIN 1451 Std", "Roboto Condensed", "Arial Narrow", system-ui, sans-serif`, peso 700, interlineado 1.02–1.1, tracking -0.01em. Letra de rotulación técnica (DIN), del mismo mundo que el plano. Escala: h1 clamp(2.5rem, 11.5vw, 5.75rem); h2 clamp(1.9rem, 6vw, 2.5rem); h3 1.35rem; entradas de decisión 1.15rem.
- Cuerpo: `system-ui` sans, 1.0625rem móvil / 1.125rem escritorio, interlineado 1.6, medida 64ch máx.
- Mono: solo código/URL/repo y el logotipo `tg`. Las etiquetas del cajetín van en sans pequeña, no en mono tracked.
- Riesgo asumido: la identidad de los titulares depende de Bahnschrift (Windows) o DIN Alternate (Apple); en otros sistemas cae a condensada genérica o a sans. El diseño se prueba también con fallback ancho.

**Espaciado** (base 4): 4, 8, 12, 16, 24, 32, 48, 64, 96. Margen lateral 16 px (24 px ≥720, 32 px ≥1000). Sección: 64 px móvil, 96 px escritorio, siempre más espacio sobre el titular que debajo. Contenedor 76rem. Columna de etiqueta 13rem + hueco 48 px ≥900 px.

## 4. Wireframes

Móvil 360

```
+--------------------------------+
| [tg]  Toni Gomila      ES Auto |
|================================|
| [foto]  Toni Gomila            |
|         Backend Developer      |
|                                |
| Backend Java                   |
| que entiende el                |
| sistema completo               |
| Oracle, Spring, automatización |
| Desarrollo y evoluciono ...    |
| [Ver proyectos]                |
|--------------------------------|
| Trayectoria  Inetum ... +4 años|
|--------------------------------|
| Contacto  Email LinkedIn GitHub|
| (o) Esta web está hecha con IA |
|================================|
| + Sobre mí                     |
| texto ...                      |
| /\ A largo plazo ...           |
|--------------------------------|
| + Qué hago                     |
| //// Backend Java   (lista)    |
| ++++ Sistemas...    (lista)    |
| .... IA y autom...  (lista)    |
| + Experiencia                  |
| |Int|--- Java Developer ---|Sr>|
| Senior ... (fechas, bullets)   |
| ...                            |
```

Escritorio 1280

```
| [tg] Toni Gomila   Sobre mí Qué hago Experiencia ...        ES  Auto |
|=====================================================================|
| Backend Java que entiende el                                         |
| sistema completo                                                     |
|                                                                      |
| Oracle, Spring, automatización     Desarrollo y evoluciono ...       |
| e IA, de la BD al despliegue       [Ver proyectos]                   |
| +-----------------+------------------------+-----------------------+ |
| |[foto] Toni      | Trayectoria            | Contacto              | |
| |Gomila, Backend  | Inetum, Admin. Pública | Email LinkedIn GitHub | |
| |Developer, Bcn   | +4 años, intern→Senior |                       | |
| +-----------------+------------------------+-----------------------+ |
|   (o) Esta web está hecha con agentes de IA                          |
|=====================================================================|
| + Sobre mí      | texto (64ch)                                       |
|                 | /\ A largo plazo me interesa ...                   |
|---------------------------------------------------------------------|
| + Qué hago      | Un mismo hilo en tres frentes...                   |
|                 | //// Backend Java      | item | item  (2 col)      |
|                 | ++++ Sistemas e infra  | item | item               |
|                 | .... IA y automat.     | item | item               |
|---------------------------------------------------------------------|
| + Experiencia   | |Int|------ Java Developer ------|Sr>|  (cota)      |
|                 | ene 2026 – actual.| Senior ... bullets / Tecnologías |
|                 | jul 2023 – ene 26 | Java Developer ...               |
|---------------------------------------------------------------------|
| + Proyecto dest.| homepanel (ficha) Problema / Decisiones / Resultado  |
| + Homelab       | texto, diagrama, tabla de decisiones, anécdota       |
| + Stack y cert. | BOM por nivel, certificaciones                       |
| + Formación     | 3 celdas                                             |
|=====================================================================|
|  CONTACTO (marino): Hablemos / email enorme / enlaces / largo plazo  |
```

## 5. Revisión del plan contra el brief (antes de construir)

Pasada de comprobación y qué cambié:

| Comprobación | Resultado | Cambio |
|---|---|---|
| Paletas pinneadas fieles | Sí: tokens idénticos a A (claro) y B (oscuro); violeta solo detalle | Ninguno |
| ¿Mundo distinto de v1 y v2? | La primera idea incluía una línea vertical de cota recorriendo los pilares: demasiado parecida al riel de v2 | **Eliminada**; los pilares se separan por rayado y bandas, sin línea continua |
| Bans de la skill | La primera idea marcaba zonas A–D en el margen (parecen numeración de sección) y etiquetas mono en mayúsculas en el cajetín (eyebrow y mono como disfraz) | **Quitadas las zonas**; etiquetas del cajetín en sans pequeña, y solo las 4 que dan información (Rol, Lugar, Trayectoria, Contacto) |
| Navegación | Primera idea: franja de enlaces bajo la cabecera en móvil; se comía 64 px de la primera pantalla | Nav en cabecera solo ≥1000 px; en móvil, índice en el pie. El salto rápido móvil lo cubren enlace de salto + CTA |
| Regla de tiempo | Primera idea: tramos como enlaces a cada puesto | Ahora decorativa e `aria-hidden` (sin foco huérfano); la información ya está en las filas |
| Contenido | Todo el de contenido-final.md; `[FALTA]` fuera; sin teléfono, IPs, nombres internos. Etiquetas nuevas mínimas: Rol, Lugar, Trayectoria, Contacto y nombres cortos de tramo (Intern, Java Developer, Senior, ya en los puestos) | Anotado como único copy de interfaz |
| Pilares: orden | Contenido: Backend, Sistemas, IA | Se respeta ese orden |
| Foto | Cuadrada 400x400, rostro arriba | Recorte 4:5 con `object-position:50% 18%`, ruta relativa `foto.jpg` |
| Fallback de fuentes | Titulares dependen de Bahnschrift | Pila con alternativas y prueba con fallback ancho en la tanda de verificación |
| Sticky de la columna de etiqueta | Se rompe con `overflow:hidden` en ancestros | Sin overflow oculto en ancestros; sticky solo ≥900 px |
| Movimiento | Un momento: la red del hero se traza una vez; el flujo del diagrama informa. Reduced-motion lo anula | Sin animaciones de entrada por sección |

## 6. Riesgos

1. Bahnschrift/DIN solo en parte de los sistemas: el carácter de los titulares varía; la estructura aguanta (probado con fallback ancho).
2. Tabla de decisiones en móvil: se apila como bloques con etiquetas; hay que comprobar que no desborda.
3. Rejilla de fondo detrás de texto: alfa muy bajo; no afecta al contraste calculado (no se calcula sobre la rejilla).
4. El diagrama del homelab (reutilizado) lleva colores propios (naranja, verde): contraste de sus textos calculado por script.
5. Metáfora: si se pasa de decorativa, parece disfraz. Control: ninguna pieza existe solo como ornamento; todas codifican algo (rayado = capa, cota = tiempo, cajetín = resumen).

## 7. Resultados de verificación

- Contraste (`v3-contraste.js`, WCAG): 0 fallos en claro y oscuro. Texto: ink 12,2 / 16,0; muted 6,4 / 7,5; faint 5,0 / 6,2; enlaces índigo 5,7 / 7,5; botón primario 6,6 / 7,5; bloque de contacto: texto 12,2 / 14,6, secundario 8,8 / 6,9, acento 7,5 / 6,9. No texto: control 5,0 / 6,2 (mín. 3), regla 12,2 / 4,1+, acento de trazos 3,8 sobre papel (mín. 3). Texto naranja/verde del diagrama sobre superficie 5,3 y 4,9 (claro), 6,0 y 6,0 (oscuro).
- Navegador integrado (una tanda más una ronda corta): 360 px claro y oscuro, 1280 px claro y oscuro (geometría real, capturas escaladas), 720, 900 y 1000 px solo por métricas. Sin desborde horizontal en ninguno (scrollWidth = ancho útil; en 1280 son 1265 por la barra). Prueba con fallback ancho de titulares (Arial): sin desborde a 360. Enlace de salto con foco visible. Conmutador Auto/Claro/Oscuro: cambia data-theme, etiqueta y localStorage.
- Cambios tras la tanda: titular a todo el ancho (en 4 líneas empujaba el cajetín fuera de la primera pantalla), hero más compacto (cajetín visible a 1280x720), título "Homelab" sin sticky (se solapaba con la tabla), triángulo violeta legible sobre el bloque marino, bordes de la lista de materiales con --line, enlace del repo con altura táctil.
- No verificado: Safari/Firefox, lector de pantalla, prefers-reduced-motion (solo lectura de CSS), render real a 1280 sin escala (el panel es pequeño), aspecto con fuentes distintas de Bahnschrift salvo la prueba de Arial, 320 px, impresión. Tras el último micro-ajuste (altura del enlace del repo) no se repitió captura.
