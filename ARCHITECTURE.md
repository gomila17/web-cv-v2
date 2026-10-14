# ARCHITECTURE — Fase 2 (decisiones)

Estado: **aprobado por Toni (2026-10-13)**. Basado en `drafts/privado/fase2-propuesta-A.md`, `fase2-propuesta-B.md` y `fase2-critica.md` (no versionados: contienen detalles de la infraestructura).

## Principio rector

Una automatización o herramienta solo entra si ahorra más tiempo del que cuesta mantenerla. Objetivo: **menos de ~1 h por trimestre** de mantenimiento (estimación sin medir). Lo que no cumpla se pospone.

## Decisiones

| # | Tema | Decisión |
|---|---|---|
| 1 | Repo | **Público** en GitHub (el código es parte del portfolio). Nunca contiene datos sensibles. |
| 2 | Privacidad | Guardia en el build con patrones **genéricos** (IPs privadas, formato de teléfono, marcas `[FALTA]`/`[REVISAR]`). Los términos concretos prohibidos viven en un secreto de CI / archivo local no versionado, nunca en el repo. |
| 3 | Generación | Generador **mínimo propio**, sin dependencias de producción. Límite: ~300 líneas. Si lo supera, se cambia a Eleventy (decisión en la primera sesión de implementación, tras una prueba corta). |
| 4 | Contenido | **JSON** (cambio de la fase 4, 2026-10-14): `content/es.json` y `content/en.json`, diccionarios planos clave → texto, más un `content/facts.json` único (fechas, enlaces, email, certificaciones). Antes era Markdown/YAML; se cambia porque JSON se lee sin dependencias (`JSON.parse`, también YAML exigiría un parser), la paridad de claves entre idiomas es trivial de comprobar, y las claves ya existían en la referencia v6 (`data-i18n`), así que los partials las usan tal cual. Textos de `drafts/contenido-final.md`; esquema en `CONTRACTS.md` §2. |
| 5 | Idiomas | `/es/` y `/en/` con slugs traducidos, selector a la página equivalente, hreflang y sitemap. `/` es una **página estática de elección de idioma**, sin redirección por cabecera. Catalán: fuera de la v1, con hueco previsto. |
| 6 | Despliegue | CI construye y publica un **artefacto** en un GitHub Release. Un timer de **usuario sin privilegios** lo descarga, lo extrae a `releases/<versión>` y repunta el enlace `current`. Nginx sirve `current`; no hace falta reiniciar nada. Rollback: repuntar el enlace. |
| 7 | Dónde corre | **LXC dedicada de un solo propósito** (Nginx + timer), como homepanel; no en la VM de Docker. NPM apunta a ella. |
| 8 | Transición | Prueba previa en `next.gomila.dev` (lo cubre el comodín del túnel). Después, cambio del upstream del apex en NPM. La web actual se conserva unas 2 semanas. |
| 9 | Disponibilidad | Se **asume** el riesgo de bloqueos de ISP a Cloudflare en la v1. Se reevalúa un espejo solo si se observa el problema. La web no es la única vía: LinkedIn y GitHub dicen lo mismo. |
| 10 | Analítica y formulario | Ninguna en la v1. |
| 11 | Tarjeta para compartir | Imagen estática. Sin generación dinámica. |
| 12 | PDF del CV | Generado **a mano** al cambiar el contenido, y revisado con la guardia (sin teléfono, sin metadatos). No se automatiza en CI. |
| 13 | Animaciones | Fuera GSAP, AOS y Font Awesome. CSS, `IntersectionObserver` si hace falta, y SVG en línea. Respetar `prefers-reduced-motion`. |
| 14 | Antigüedad | "Más de N años" calculada en el build; sin cron mensual. Se actualiza al desplegar. |

## Comprobaciones

**Automáticas (CI, en cada cambio)**: el build pasa; paridad de claves ES/EN; no hay marcas abiertas; guardia de privacidad sobre `dist/` y sobre el PDF si está en el repo.

**Manuales (antes de cada release importante)**: Lighthouse, accesibilidad (axe), revisión visual en móvil y escritorio, generación y revisión del PDF.

## Puerta de calidad antes de publicar

- No hay marcas abiertas en lo visible. Lo que falte (capturas, diagrama) **se omite**, no se deja un hueco.
- LinkedIn actualizado a Backend en el mismo día del lanzamiento.
- Foto definitiva y PDF sin teléfono.

## SEO (objetivo: que te encuentren por tu nombre)

**Contexto:** hay un actor muy conocido con el mismo nombre, también de Baleares. Competir por "Toni Gomila" a secas es poco realista. La estrategia es **desambiguar**: ser el resultado claro para las búsquedas con un calificador y que, aun sin él, los buscadores te asocien con "desarrollador backend".

**Búsquedas objetivo, por orden de realismo:**
1. "Toni Gomila backend", "Toni Gomila Java", "Toni Gomila developer", "Toni Gomila desarrollador".
2. "Antonio Gomila Java" (tu nombre del CV).
3. "Toni Gomila" a secas: se intenta, sin garantías.

**Medidas:**

| # | Medida | Fase |
|---|---|---|
| 1 | Un desambiguador único y constante en todas partes: "Toni Gomila · Backend Developer". Mismo texto en el título de la web, el perfil de GitHub y el de LinkedIn. | 3 (redacción), 6 (perfiles) |
| 2 | `<title>` y meta descripción de cada página y cada idioma, con el nombre y el rol al principio. | 3, 4 |
| 3 | Datos estructurados `Person` con `jobTitle`, `knowsAbout`, `address` (Barcelona) y `sameAs` (LinkedIn, GitHub). Es la señal más clara para separarte del homónimo. | 4 |
| 4 | URL canónicas, `hreflang`, sitemap y `robots.txt`. | 4 |
| 5 | HTML semántico con un único `h1` (el nombre y el rol) y jerarquía de encabezados correcta. | 3, 4 |
| 6 | Enlaces de ida y vuelta: web ↔ LinkedIn ↔ GitHub (README) ↔ repo de homepanel. Es lo que más ayuda a que los buscadores te vean como una sola entidad. | 6 |
| 7 | Alta en Google Search Console (y Bing Webmaster) y envío del sitemap. Acción tuya, con tu cuenta. | 6 |
| 8 | Transición sin perder lo indexado: `gomila.dev` ya está indexado con la web actual, así que se mantienen las URL o se redirigen. | 6 |
| 9 | Validación: pruebas de datos enriquecidos y de la tarjeta para compartir en LinkedIn. | 5 |

**Lo que NO se hace:** texto oculto, relleno de palabras clave, compra de enlaces ni ninguna práctica que penalice.

**Expectativas honestas:** el posicionamiento tarda semanas o meses, y con un homónimo famoso puede no llegar a la primera página para el nombre solo. El criterio de éxito: que **"Toni Gomila" + backend/Java/developer** te devuelva la web, LinkedIn o GitHub en la primera página a los 2-3 meses. Medir a mano, sin analítica.

## Riesgos aceptados

- Bloqueos LaLiga/ISP (decisión 9).
- Contenido desactualizado: es el riesgo de mantenimiento real. Mitigación: revisar el contenido cuando cambie algo en el trabajo.

## Verificar al implementar (no confirmado por los agentes)

Versiones concretas; comportamiento del enlace simbólico dentro de un bind mount de Docker; si Cloudflare cachea HTML; si existe `www`; permisos de los archivos copiados (el 403 por `chmod 700` ya ocurrió); y si `profile.jpg` es la foto definitiva (parece duplicada con `1697753776473.jpg`).

## Implicación para la fase de implementación

Fijar primero los **contratos** (esquema de contenido y tokens de diseño); después, subagentes en paralelo sobre ficheros disjuntos (plantillas, contenido, páginas de proyecto, SEO, despliegue); integración; y revisores en paralelo.
