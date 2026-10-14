# src/styles/

CSS de la web, extraído de la referencia v6. El build concatena los ficheros **en este orden** en un único `styles.css`:

1. `tokens.css`: solo custom properties (claro, oscuro, breakpoint de 720px). **Del integrador.**
2. `base.css`: reset, elementos, foco, enlace de salto, `.wrap`.
3. `layout.css`: secciones, planos, cabeceras de sección, rejillas.
4. `components.css`: cabecera, botones, tarjetas, etiquetas, selector de idioma, tema, volver arriba, bloque de largo plazo.
5. `sections/<sección>.css`: lo propio de cada sección (hero, about, pillars, experience, project, homelab, stack, education, footer).
6. `motion.css`: keyframes, revelados, scroll (`sd-css`/`sd-js`), fundido de tema y `prefers-reduced-motion`.
7. `print.css`: impresión.

Reglas en `CONTRACTS.md` §4: nada de colores literales fuera de `tokens.css`, nombres de clase de la v6, sin `@layer`.
Quién lo toca: subagente de estilos (todo menos `tokens.css`).
