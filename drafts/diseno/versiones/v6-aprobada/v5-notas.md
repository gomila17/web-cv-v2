# Notas de diseño v5

Entrega: `hibrido-v5.html` (parte de `hibrido-v4.html`, que no se ha tocado) y `v5-contraste.js` (es `v4-contraste.js` ampliado). Solo cambian dos cosas: la **foto** y el **scroll**. Contenido, ES/EN, temas, cota, fondos, diagrama y accesibilidad son los de v4.

## 1. Foto

### 1.1 Principal: recorte con fondo transparente (`foto-recorte.png`)

- La figura se apoya en un **disco de color de marca** (degradado índigo `#6179E8 → #526DE5 → #3A51C6` en claro; marino-índigo `#2A4C8C → #22397A → #2B2066` en oscuro), dentro del anillo de acento de siempre.
- La **cabeza sobresale por arriba** del disco y del anillo (`--pop: .14`, un 14 % del diámetro). Por debajo del ecuador la figura se recorta con la mitad inferior del círculo (`border-radius` elíptico calculado con `--pop`), así que el anillo "abraza" el busto y la cabeza queda por delante.
- Camisa blanca: nunca toca el papel claro, siempre va sobre el disco índigo (contraste ≥ 3,47 en la parte más clara del disco, medido en el script). En oscuro la figura lleva `brightness(.9)` para que la camisa no brille de más sobre el disco oscuro.
- Borde del recorte: una sombra muy ceñida (`drop-shadow(0 2px 3px …)`) asienta la figura y tapa cualquier fleco claro del recorte. Revisado en claro y oscuro con la foto ampliada a 320 px: sin halo.
- Tokens: `--disc`, `--cut-filter` (por tema) y `--pop` (en `.photo--cutout`).

### 1.2 Respaldo: `foto.jpg` (si el PNG no carga)

El `<img>` lleva `onerror`: si `foto-recorte.png` falla, cambia a `foto.jpg` y quita la clase `photo--cutout`. Entonces se aplica el tratamiento provisional solo con CSS:
- **Encuadre más cerrado**: `scale(1.18)` con origen en la cara (50 % 26 %), que deja fuera el viñeteado oscuro de los bordes.
- **Pared neutralizada solo en el borde**: una capa radial en `mix-blend-mode: saturation` (gris) desatura el anillo exterior, donde está la pared cálida, y deja la cara intacta; encima, una capa en `mix-blend-mode: color` con un tinte índigo bajo (`--photo-tint`, 30 % / 26 %) que enfría ese borde hacia los grises de la web. A la imagen entera solo se le aplica `saturate(.9)`.
- Por qué así y no con filtros globales de temperatura: un filtro global también enfría la piel (aspecto de "filtro de Instagram"). Con las capas radiales la corrección solo afecta a la pared.

### 1.3 Cómo cambiar de modo

- **Recorte (por defecto en v5)**: `<div class="photo photo--cutout p-photo"><div class="pic"><img src="foto-recorte.png" …></div></div>`.
- **Foto clásica**: quitar `photo--cutout` y poner `src="foto.jpg"`.
- En el sitio real la ruta será `assets/foto-recorte.png` (desde `drafts/diseno` sería `../../assets/foto-recorte.png`); hay que cambiarla también en el `onerror` si `foto.jpg` se mueve.
- Ajustes: `--pop` (cuánto sobresale la cabeza, 0,10–0,18); `object-position` del img (`50% 100%`: la figura se apoya en la base). Si llega otro recorte con distinto encuadre, se ajusta con esos dos valores.

## 2. Sistema de scroll

Principio: tres momentos fuertes, cada uno con un significado; el resto, sutil. Todo anima solo `transform`/`translate`/`scale`/`opacity` (la opacidad de la cabecera es una transición de clase).

| Momento | Qué pasa | Por qué |
|---|---|---|
| **1. Parallax del hero** (fuerte) | Al salir del hero las capas se separan: mancha grande baja 170 px, mancha pequeña 90 px, red de nodos 56 px (se quedan atrás) y la foto sube 52 px y se reduce al 93 % (se adelanta). Tramo: los primeros 100vh de scroll. | Da profundidad al primer gesto de scroll, justo donde Toni nota que "no pasa nada". |
| **2. Cota con scrub** (fuerte) | La línea de Experiencia se rellena acompasada con el scroll (desde que la cota está al 88 % de la pantalla hasta el 44 %). Cada tramo ocupa un trozo de recorrido proporcional a sus meses (9 / 30 / 9+), los nodos aparecen cuando la línea los alcanza y las etiquetas les siguen. Hacia atrás se "desdibuja". | Sustituye el dibujo de una sola vez de v4. El lector controla el tiempo; el movimiento sigue codificando el dato (más meses = más recorrido). |
| **3. Diagrama que se enciende** (fuerte) | Los bloques del homelab están apagados (12 %) y se encienden en orden según entra el diagrama (izquierda → derecha en escritorio, arriba → abajo en móvil); a la vez, un barrido de luz recorre el marco en el sentido del flujo. Cuando el diagrama está a la vista arrancan los paquetes de flujo. | Cuenta el recorrido del tráfico (Internet → túnel → proxy → stacks) mientras se lee. |
| Barra de lectura | Línea de 2 px (acento → violeta) en el borde inferior de la cabecera. | Orientación en una página larga. |
| Encabezados | El título y su número salen de una máscara (suben desde debajo de su línea base) y el subrayado crece, ligados a la posición. | Mismo gesto de "apertura" de v4, ahora dependiente del scroll. |
| Sección activa | En escritorio (≥ 1000 px) el enlace de la sección en curso queda subrayado y en índigo (`aria-current="location"`). | Ahora la cabecera es fija y tiene sentido. |
| Cabecera fija | Con JS la cabecera es `sticky`; transparente sobre el hero arriba del todo y con fondo (97 % / 96 %) en cuanto se baja. En móvil baja de 76 a 64 px para robar menos pantalla. | Soporte de la barra y de la sección activa. Las anclas compensan su altura (`scroll-margin-top`). |

El resto (tarjetas, párrafos, iconos, etiquetas del stack, pie) mantiene los revelados de v4 por IntersectionObserver.

### 2.1 Compatibilidad

- **Nativo** (`html.sd-css`): si el navegador admite `animation-timeline: view()` y `animation-range` (Chrome/Edge 115+ y Safari 26), todo va con CSS scroll-driven animations (`scroll(root)` y `view-timeline` con nombre en la cota, el diagrama y cada encabezado). Los rangos de la cota se calculan en CSS a partir de los mismos `--c`/`--m` de los tramos.
- **Respaldo JS** (`html.sd-js`, p. ej. Firefox): un único listener de `scroll` pasivo + `requestAnimationFrame`, que lee primero todas las posiciones y luego escribe cinco variables (`--rp`, `--hp`, `--cp`, `--dp`, `--sp`) en sus elementos; el CSS calcula los mismos efectos con `clamp()`. Para probarlo en Chrome: `hibrido-v5.html?sd=js`.
- El mismo listener (en ambos modos) pone la clase `stuck` de la cabecera y calcula la sección activa (sin IntersectionObserver, para que no se retrase).
- **`prefers-reduced-motion`**: no se añade `anim` ni `sd-*`; no hay parallax, scrub, máscaras, barra ni barrido; todo está visible y estático (la cota completa, el diagrama encendido). La cabecera sigue fija, sin transición.
- **Sin JS**: cabecera no fija (como en v4), todo visible; la foto recortada carga igual (el respaldo a `foto.jpg` necesita JS).
- Impresión: se anulan las animaciones, se ocultan barra y barrido y se fuerza todo visible.

## 3. Contraste (`node v5-contraste.js`)

0 fallos. Además de los pares de v4 comprueba: texto, nav activa y barra de lectura sobre la cabecera fija con cada fondo que puede pasar por debajo (papel, plano, tarjeta, pie, hero); camisa blanca frente a las dos puntas del disco; anillo frente al hero; texto bajo el barrido del diagrama. Corregidos en esta ronda gracias al script: la punta clara del disco (de `#7088EC` a `#6179E8`, la camisa pasaba de 2,92 a 3,47) y el barrido en oscuro (velo propio `--sweep` al 12 %, el texto atenuado pasa de 4,46 a 4,92). Los bloques apagados del diagrama (12 %) son un estado de paso mientras entra en pantalla; en reposo y con movimiento reducido el diagrama está siempre al 100 %.

## 4. Verificación

Navegador integrado con servidor local temporal (parado después; `.claude/launch.json` temporal borrado):
- 360 px claro ES, 360 px oscuro EN, 1280 px claro ES/EN y 1280 px oscuro EN; modo nativo y modo respaldo (`?sd=js`). Barrido por toda la página midiendo los valores calculados: barra de lectura 0 → 1, parallax del hero, los tres tramos de la cota llenándose en orden con sus nodos, bloques del diagrama encendiéndose en orden con el barrido, encabezados saliendo de la máscara, sección activa correcta en las siete secciones, cabecera con fondo al bajar.
- Sin desborde horizontal a 360 ni a 1280 px (`scrollWidth` = ancho útil en todo el recorrido). Sin errores de consola de la página (el único 404 del registro fue una prueba deliberada del respaldo de la foto, que cambió bien a `foto.jpg`).
- Foto revisada ampliada en claro y oscuro (recorte) y en claro y oscuro (respaldo jpg).
- Cambio de tema por clic e idioma por `?lang=` funcionan como en v4.

**No verificado**: Firefox y Safari reales (el respaldo se probó forzándolo en Chrome; Safari 26 debería ir por la vía nativa); la fluidez a 60 fps a ojo (el panel del navegador limita los fotogramas y las capturas llegan con retraso, así que se comprobó con valores calculados y no con grabación); `prefers-reduced-motion` y sin JS reales (por lectura del CSS); escritorio en detalle fino (el panel renderiza 1280 px muy reducido); lector de pantalla; impresión.

## 5. Riesgos

- En oscuro, el pelo oscuro de la parte que sobresale queda con poco contraste contra el fondo marino del hero; es intencionado (sin halo claro), pero si se quiere más presencia se puede bajar `--pop` o aclarar el hero tras la foto.
- La cabecera fija ocupa 64 px en móvil; si molesta, se puede ocultar al bajar y mostrar al subir.
- Los rangos (`--S`, `--L` de la cota; `entry …%` del diagrama) están afinados para la maqueta actual; si cambian mucho las alturas de sección, revisarlos.
