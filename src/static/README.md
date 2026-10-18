# src/static/

Ficheros que el build copia **tal cual** a la raíz de `dist/`: `robots.txt`, favicon (derivado de `assets/logo.svg`), imagen estática de la tarjeta para compartir (ARCHITECTURE.md decisión 11).
El `sitemap.xml` no va aquí: lo genera el build a partir de las páginas y los idiomas.

Quién lo toca: subagente de SEO.

Iconos: `favicon.svg` es la fuente; `favicon-48.png`, `favicon.ico` (32 y 48 px) y `apple-touch-icon.png` (180 px) se generaron a partir de él (Edge sin ventana) para Google y iOS. Si cambia el SVG, regenerarlos.
