# gomila.dev · web CV de Toni Gomila

Web personal bilingüe (español e inglés) de **Toni Gomila**, desarrollador backend Java en Barcelona: CV, proyectos y la historia de su homelab. Estática, sin dependencias en producción y construida con **subagentes de IA** orquestados por una sesión de Claude Code.

> English: bilingual (ES/EN) static personal site for Toni Gomila, a Java backend developer in Barcelona. Zero runtime dependencies, built with AI subagents. Docs are in Spanish.

**Web:** https://gomila.dev · **LinkedIn:** [toni-gomila](https://www.linkedin.com/in/toni-gomila/) · **Proyecto relacionado:** [homepanel](https://github.com/gomila17/homepanel)

## Qué tiene de particular

- **Cero dependencias**: el generador es un script de Node (`scripts/build.mjs`, ~150 líneas, solo módulos nativos). Se eligió frente a Eleventy tras construir la misma prueba con los dos en paralelo (informes en `drafts/generador-*.md`).
- **Contenido como datos**: todos los textos en `content/es.json` y `content/en.json` (mismas claves, comprobado en cada build) y los datos únicos en `content/facts.json`. Las plantillas son funciones puras `render(ctx) → HTML`.
- **Cada idioma es su URL** (`/es/`, `/en/`); `/` redirige al idioma recordado o al del navegador.
- **Calidad vigilada por tests y por el build**: paridad ES/EN, marcas sin resolver, guardia de privacidad sobre la salida (IPs, teléfonos, términos locales), CSP comprobada contra el HTML generado, accesibilidad y movimiento reducido.
- **Despliegue sin root y sin puertos de entrada**: el CI publica una release y un timer de systemd sin privilegios la instala en una LXC dedicada ([`deploy/`](deploy/README.md)).
- **Hecha con agentes**: el diseño, el código y las revisiones se repartieron entre subagentes con encargos acotados; la integración y el control de calidad los hizo la sesión principal. El proceso está documentado en los ficheros de la raíz.

## Empezar

Requiere **Node ≥ 21** (sin `npm install`: no hay dependencias).

```bash
npm run dev       # build + servidor local en http://127.0.0.1:8080 con recarga al guardar
npm run build     # genera dist/ y pasa la guardia de contenido y privacidad sobre la salida
npm test          # 27 pruebas con node:test (idioma, fechas, salida de dist/, validador)
npm run check     # solo la validación de contenido
```

El currículum en PDF se genera desde la propia web (Edge o Chrome sin ventana, sin instalar nada) y solo cuando cambia el contenido:

```bash
npm run build && node scripts/make-cv-pdf.mjs && npm run build
```

### Lista privada de términos

La guardia de privacidad lee, opcionalmente, términos que **nunca deben aparecer** de un fichero local `.privacy-terms` (uno por línea, ignorado por git) o de la variable `PRIVACY_TERMS` (en CI, un secreto). La lista concreta no vive en el repo. Sin ella, la guardia usa solo patrones genéricos (IPs privadas, teléfonos).

## Estructura

```
content/         es.json, en.json y facts.json: todos los textos y datos
src/templates/   un partial por sección (HTML en funciones puras)
src/styles/      tokens.css y las capas CSS; las secciones en sections/
src/scripts/     head.js (inline, tema antes de pintar) y main.js (defer)
src/static/      se copia tal cual a dist/ (robots.txt, favicon, og.png, PDF del CV)
scripts/         build, servidor de desarrollo, validador de contenido y generador del PDF
tests/           node:test, sin dependencias
deploy/          release, timer de systemd, Nginx y guía de puesta en marcha
assets/          foto y logo
drafts/          borradores y prototipos de diseño que dieron lugar a la web
```

## Documentación del proyecto

| Documento | Para qué sirve |
|---|---|
| [`PRODUCT.md`](PRODUCT.md) | Qué es la web, para quién, voz y restricciones |
| [`SPEC.md`](SPEC.md) | Objetivo, posicionamiento y plan por fases |
| [`ARCHITECTURE.md`](ARCHITECTURE.md) | Decisiones técnicas (generador, idiomas, despliegue, SEO) y su porqué |
| [`DESIGN.md`](DESIGN.md) | Sistema visual: color, tipografía, componentes y movimiento |
| [`CONTRACTS.md`](CONTRACTS.md) | Reglas para los agentes: estructura, esquema del contenido, quién toca qué |
| [`deploy/README.md`](deploy/README.md) | Cómo se publica y cómo se vuelve atrás |
| [`PENDIENTES.md`](PENDIENTES.md) | Lo que queda por hacer o decidir |

## Estado

Fases 0–5 cerradas (especificación, contenido, arquitectura, diseño, implementación y revisión de calidad); la fase 6 es la publicación en `gomila.dev`. Detalle en [`PENDIENTES.md`](PENDIENTES.md).

## Licencia y uso

El **código** (generador, plantillas, estilos, scripts, tests y despliegue) es MIT: [`LICENSE`](LICENSE). El **contenido personal** (textos, datos, foto, logo, tarjeta y CV en PDF) es de Toni Gomila con todos los derechos reservados: [`LICENSE-CONTENT.md`](LICENSE-CONTENT.md). Si algo te resulta útil como referencia, abre un issue y lo hablamos.
