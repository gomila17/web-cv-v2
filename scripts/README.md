# scripts/

Herramientas de Node (≥ 21, solo módulos nativos; nada de APIs de Node 22) que corren en local y en CI. No se publican.

- `check-content.mjs`: guardia de contenido y privacidad (`npm run check`). Paridad de claves, valores vacíos, marcas `[FALTA]`/`[REVISAR]`, HTML en línea y huecos, IPs privadas, teléfonos, términos privados locales (`.privacy-terms` o `PRIVACY_TERMS`, nunca en el repo) y campos obligatorios de `facts.json`. Con `--scan dist` revisa también la salida del build.
- Previsto: el build (`build.mjs` si es generador propio, o la configuración de Eleventy en la raíz), que termina llamando a `check-content.mjs --scan dist`.

Quién lo toca: el integrador (el build y el validador forman parte del contrato).
