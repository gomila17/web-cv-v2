# assets/

Imágenes de contenido que se publican en `dist/assets/`: `foto-recorte.webp` (foto principal sobre el disco; WebP con alfa y calidad 0,85, unos 14 KB, generado desde `foto-recorte.png`, que se queda como fuente: cárgala en un canvas del navegador y exporta con `toDataURL('image/webp', 0.85)`), `foto.jpg` (ya no es respaldo: el hero no lo usa; `head.mjs` lo referencia como imagen de metadatos, `og:image`) y `logo.svg` (monograma `tg`).
Se mantiene en la raíz porque `PRODUCT.md` y `DESIGN.md` ya fijan estas rutas. El diagrama del homelab no va aquí: su única fuente es `src/templates/homelab-diagram.mjs` (SVG en línea).

Quién lo toca: el integrador (cambiar la foto o el logo es decisión de Toni).
