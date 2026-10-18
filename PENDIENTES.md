# Pendientes

Lista viva de lo que queda por hacer o decidir. Fuente: revisión de la fase 5 (informes en `drafts/privado/revision/`, fuera del repo) y acuerdos con Toni. Se actualiza al cerrar cada bloque.

## Fase 5: bloque B (hecho el 2026-10-15)

- [x] Animaciones finitas: manchas del hero un recorrido, pulsos 3 latidos, paquetes del diagrama 3 viajes; se pausan fuera de pantalla.
- [x] Foto en WebP con transparencia: de 159.580 a 14.166 bytes; /es/ sin comprimir de 266 KB a 122 KB.
- [x] `?v=<hash>` en CSS y JS, y caché de 1 año con `immutable` en Nginx.
- [x] El h1 incluye el nombre (sin cambios visuales). **Resuelto el 2026-10-18**: el h1 empieza por "Toni Gomila · Backend Developer · Barcelona" (el nombre completo sigue en el JSON-LD y en el CV).

## Fase 5: bloque C (hecho el 2026-10-15, con agentes Sonnet y Haiku)

- [x] Código muerto fuera (respaldo JPG de la foto, `.s-warn`, `trainingOnly`, `--photo-tint`…).
- [x] Fechas en UTC (`scripts/dates.mjs`) y validación de los campos que daban por supuestos los partials.
- [x] Accesibilidad leve: números de sección y de decisión ocultos al lector de pantalla, áreas de toque de 44 px, volver arriba sin foco cuando está oculto, icono de "pestaña nueva", anécdota como h3, `scroll-padding-top`.
- [x] Visual: "404" sin contorno doble, el tema reserva su hueco (sin salto del selector de idioma), tarjetas de certificación sin hueco, leyenda libre a 320 px.
- [x] Diagrama con la web en su propia LXC, también en la descripción accesible.
- [x] CI: Node 21, acciones fijadas a SHA (verificados), relanzar un workflow antiguo ya no hace rollback; `/` con cabeceras de seguridad.
- [x] Tests: de 12 a 27 (regla de idioma en los tres sitios, fechas, salida de `dist/`).
- [x] Documentos al día (SPEC, PRODUCT, DESIGN, CONTRACTS, notas del contenido, READMEs).

### Queda abierto (menor)

- [ ] Texto del diagrama: entre 960 y ~1100 px queda en ~11,3 px (objetivo 12); subirlo desborda una caja en inglés.
- [ ] Diagrama: no hay flecha del proxy a "Web CV" (la descripción accesible sí dice que llega por el túnel).
- [ ] Cookie `tg_lang` con valores raros (`en-US`): Nginx la ignora y el navegador/dev no. No ocurre en la práctica (`main.js` solo escribe `es` o `en`).
- [ ] `drafts/diseno/homelab-diagrama.svg` está desactualizado (no se usa): borrarlo o regenerarlo si se quiere para el README de GitHub.
- [ ] Opcional: fundido al cambiar de idioma conservando la sección.
- [ ] Sin verificar de verdad: `nginx -t`, Firefox/Safari, lector de pantalla, red lenta, el workflow nuevo en GitHub.

## Decisiones de Toni (resueltas el 2026-10-15)

- [x] **Formación**: era un CFGM de Sistemas Microinformáticos y Redes (SMR), no ASIR. Corregido en la web y en el contenido. **Falta corregirlo también en el CV en PDF.**
- [x] **Diagrama del homelab**: se mantienen los nombres de los servicios. Ya son públicos en el README de GitHub, están detrás de autenticación propia y el diagrama no da direcciones, versiones ni accesos: no añade riesgo. Si en el futuro se expone algo sin autenticación, quitarlo del diagrama.
- [x] **Entrada del hero**: el titular y la propuesta de valor ya no parten de opacidad 0, solo se desplazan, y empiezan antes: el texto principal se ve desde el primer fotograma.

## Privacidad y cookies (2026-10-18)

- [x] Decisión: **no hace falta banner de cookies** (sin analítica ni terceros; solo `tg_lang` y `tg-theme`, de personalización y pedidas por el visitante). Detalle y condición para revisarlo en `CONTRACTS.md` §8; un test falla si cambia.
- [x] Página "Privacidad y cookies" en `/es/privacidad/` y `/en/privacy/` (noindex, fuera del sitemap), enlazada desde el pie.
- [x] Texto revisado por Toni (2026-10-18): Cloudflare delante, correo en Gmail y titular sin dirección postal, correctos.
- [x] Logs: Nginx, NPM y Cloudflare con la configuración por defecto (Nginx en Debian rota a 14 días, dentro de los 30 prometidos). Confirmarlo de nuevo con `/etc/logrotate.d/nginx` al desplegar.

## Contenido y materiales

- [x] PDF del CV (2026-10-16): generado desde la propia web (`src/templates/cv.mjs` → `scripts/make-cv-pdf.mjs`, Edge sin ventana), ES y EN, 2 páginas, sin teléfono, sin metadatos personales (solo título; creador "Mozilla", productor "Skia"). Botón "Descargar CV" en el hero y en el pie. **Se regenera a mano cuando cambie el contenido**: `npm run build && node scripts/make-cv-pdf.mjs && npm run build`. El CV de Word/PDF provisional de Toni (en `drafts/privado/cv/`) ya no hace falta para la web; si lo sigue usando para enviarlo, corregirlo (SMR, sin Spring Boot, sin la experiencia que no se publica).
- [x] Spring Boot: fuera (decisión de Toni, 2026-10-16). No está en la web; falta quitarlo también del CV en PDF.
- [ ] Capturas de homepanel sin datos sensibles (opcional).

## Fase 6: publicación (pasos de Toni o con su aprobación)

Preparada el 2026-10-18: CI verde, release `latest` publicada, guía en `deploy/README.md` y encargo para el agente del homelab actualizado (`drafts/privado/`, fuera de git). No se pudo probar `nginx -t` aquí (sin Nginx, Docker ni distribución de WSL): se hace en la LXC (paso 4) o en cualquier Linux con Nginx.

- [ ] Pasar el encargo al agente del homelab y aprobar cada paso: LXC, script y timer, Nginx, prueba en `next.gomila.dev`, cambio del apex en NPM, web vieja viva 2 semanas.
- [x] 301 de la web vieja: no hacen falta (una sola página, sin sitemap; `/` ya redirige).
- [ ] **Cloudflare**: desactivar Email Address Obfuscation, Rocket Loader, Auto Minify y Web Analytics para `gomila.dev` y comprobar que el HTML no se cachea (`deploy/README.md`, paso 5). La web vieja tiene la ofuscación del correo activa hoy.
- [ ] Secreto `PRIVACY_TERMS` en GitHub con los términos privados (copia de `.privacy-terms`). Sin él, CI solo usa los patrones genéricos.
- [ ] Google Search Console (y Bing): alta y envío del sitemap (solo con la web ya en `gomila.dev`). Si lista URL viejas indexadas, añadir 301.
- [ ] LinkedIn y perfil de GitHub: titular "Toni Gomila · Backend Developer" y enlaces de ida y vuelta con la web.
- [ ] Validar datos estructurados (Rich Results Test) y la tarjeta (LinkedIn Post Inspector).
- [ ] Tras el despliegue: confirmar rotación de logs (`/etc/logrotate.d/nginx`) y que `readlink /srv/web-cv/current` coincide con el release más reciente.

## Hecho en esta ronda

- Historial público limpio: fuera el primer borrador de contenido (revelaba el tipo de trámite y un servicio expuesto del homelab) y nombres internos; releases antiguas borradas; lista privada local ampliada. Respaldo del historial anterior en un bundle fuera de git.
- 404: los enlaces de la cabecera llevan a la portada del idioma.
- El script inline se escapa una sola vez en el build.
- La guardia de privacidad no imprime lo que encuentra y detecta teléfonos en atributos y enlaces `tel:`.
- El sitemap ya no incluye `/` (redirige).
- Texto "VM Docker" del diagrama con contraste AA.
- El servidor de desarrollo no se cae con rutas con byte nulo.

## Decisiones menores (resueltas el 2026-10-18)

- [x] **Licencia**: MIT para el código (`LICENSE`); textos, datos, foto, logo, tarjeta y CV con todos los derechos reservados (`LICENSE-CONTENT.md`).
- [x] **Frase final del perfil** ("Esta web está hecha así"): fuera del PDF, se queda en la web (`cv.mjs` la quita y falla si el texto cambia de forma que ya no se pueda).
- [x] **CV con teléfono**: no. La versión pública basta; si una empresa lo pide, se lo das tú.
- [ ] **Despliegue**: el encargo para el agente del homelab está en `drafts/privado/despliegue-para-agente-homelab.md` (fuera de git). Cuando termine, Toni da de alta Search Console y se actualizan LinkedIn y el perfil de GitHub.
