# tests/

Pruebas automáticas con `node:test` (sin dependencias). `npm test`.

- `check-content.test.mjs`: copia `content/` a una carpeta temporal, la rompe a propósito (clave que falta, valor vacío, marca, IP privada, teléfono, término privado, campo obligatorio, referencia i18n, HTML o hueco distinto) y comprueba que el validador falla. Limpia lo que crea.
- Previsto: pruebas de humo sobre `dist/` (un `h1` por página, `lang` correcto, hreflang recíprocos, sin enlaces internos rotos).

Quién lo toca: quien cambie lo que se prueba; las pruebas de `dist/`, el integrador.
