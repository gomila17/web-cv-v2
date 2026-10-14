# src/

Fuentes de la web. El build las convierte en `dist/` (no versionado).

- `templates/`: partials HTML, uno por sección (subagente de plantillas; `head.mjs` es de SEO).
- `styles/`: CSS por capas, empezando por `tokens.css` (subagente de estilos; los tokens, del integrador).
- `scripts/`: JS de interacción del navegador (subagente de interacción).
- `static/`: ficheros que se copian tal cual a la raíz de `dist/` (robots.txt, favicon, tarjeta para compartir).

Las imágenes de contenido siguen en `/assets` (raíz del repo). Contrato: `CONTRACTS.md`.
