# PRODUCT — Web CV v2 (Toni Gomila)

Verdades duraderas del producto. No describe el aspecto visual: eso va en el plan de diseño y en `DESIGN.md`.

## Qué es
Sitio personal bilingüe (ES/EN) de Toni Gomila, desarrollador backend Java en Barcelona. Es a la vez CV reforzado para procesos de selección y escaparate para quien llegue desde LinkedIn, GitHub o una búsqueda.

## Audiencia
Mixta: reclutadores y managers técnicos y no técnicos, y otros desarrolladores. Llegan con poco tiempo y deciden en unos 30 segundos si seguir leyendo.

## Propósito y modo de la visita
Persuade, con lectura profunda de apoyo: que alguien entienda quién es Toni, qué aporta y se anime a escribirle. Después, que aguante una lectura detallada (experiencia, proyectos, homelab).

## Posicionamiento
Backend Java sólido como base, con visión de sistemas completa e IA integrada en la forma de trabajar. Un solo hilo: entender el sistema entero.

## Contenido (fuente de verdad)
`drafts/contenido-final.md`: hero, sobre mí (con la proyección a gestión de equipos), tres pilares, experiencia en Inetum, casos de estudio (homepanel y homelab), stack y certificaciones, formación, contacto. Marcas `[FALTA]`/`[REVISAR]` no se publican.

## Voz
Directa, honesta, sin inflar. Nada de clichés de CV. Lo que se explora se etiqueta como tal. La web declara abiertamente que está hecha con agentes de IA.

## Restricciones
- Sin teléfono. Sin nombres de clientes ni de herramientas internas de IA de la empresa. Contexto laboral: solo "Administración Pública". Sin tipo concreto de trámite.
- Sin IPs, nombres de máquinas internas ni subdominios internos del homelab; sin servicios sensibles (gestor de contraseñas, finanzas).
- Contenido veraz: sin cifras inventadas; las de rendimiento, como ejemplos típicos.
- Accesibilidad AA, móvil primero, sin librerías externas ni CDN, sin analítica en la v1.
- Estática, mantenimiento mínimo (ver `ARCHITECTURE.md`).

## Evidencia y activos
- Foto principal del hero: `assets/foto-recorte.webp` (WebP con alfa, generado desde la fuente `assets/foto-recorte.png`). Ya no hay respaldo a `assets/foto.jpg`: ese fichero sigue en `assets/` solo como imagen de la persona en los datos estructurados (JSON-LD de `head.mjs`); la tarjeta para compartir es `og.png`.
- Logo: `assets/logo.svg` (monograma "tg", gris `#EDEDED`, marino `#202A42`, índigo `#526DE5`).
- Diagrama del homelab: única fuente `src/templates/homelab-diagram.mjs` (SVG en línea). El fichero `drafts/diseno/homelab-diagrama.svg` está desactualizado y no se usa.
- Textos y datos publicados: `content/es.json`, `content/en.json` y `content/facts.json`. `drafts/contenido-final.md` es el borrador de origen de la redacción.

## Decisiones de dirección ya tomadas por Toni
- Tema claro basado en la dirección A y tema oscuro basado en la B (le gustó mucho el oscuro de B y no el oscuro de A: demasiado azul-violeta).
- Conmutador manual de tema (Auto/Claro/Oscuro).
- Referencias visuales propias: logo `tg`, web anterior (oscuro azulado), cabecera SVG del README de GitHub, homepanel (casi negro; demasiado agresivo para esta web).
- Una versión ya guardada: `drafts/diseno/versiones/v2-frontend-design/` (riel vertical índigo, serif en titulares).
