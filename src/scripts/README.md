# src/scripts/

JavaScript del navegador, sin librerías ni módulos de terceros.

- `head.js`: se incrusta en `<head>` antes de pintar. Aplica el tema guardado (`localStorage` `tg-theme`), añade las clases `js`, `anim`, `sd-css`/`sd-js` y la red de seguridad de 3 s. Todo en `try/catch`.
- `main.js`: conmutador de tema, revelados con `IntersectionObserver` (se repiten), sección activa (`aria-current`), barra y anillo de progreso, respaldo JS de las animaciones de scroll (cota y diagrama) y volver arriba.

Reglas (`CONTRACTS.md` §4): ningún texto visible escrito en el JS; los lee del DOM (`data-*` que pone la plantilla). No hay diccionario de idiomas en el cliente: cada idioma es su propia URL. Sin JS la página está completa.
Quién lo toca: subagente de interacción.
