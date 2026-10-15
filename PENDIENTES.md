# Pendientes

Lista viva de lo que queda por hacer o decidir. Fuente: revisión de la fase 5 (informes en `drafts/privado/revision/`, fuera del repo) y acuerdos con Toni. Se actualiza al cerrar cada bloque.

## Fase 5: bloque B (hecho el 2026-10-15)

- [x] Animaciones finitas: manchas del hero un recorrido, pulsos 3 latidos, paquetes del diagrama 3 viajes; se pausan fuera de pantalla.
- [x] Foto en WebP con transparencia: de 159.580 a 14.166 bytes; /es/ sin comprimir de 266 KB a 122 KB.
- [x] `?v=<hash>` en CSS y JS, y caché de 1 año con `immutable` en Nginx.
- [x] El h1 incluye el nombre (sin cambios visuales). Sugerencia abierta: el texto dice "Antonio (Toni) Gomila · Barcelona"; para el SEO del nombre ayudaría "Toni Gomila" seguido literal (p. ej. "Toni Gomila · Backend Developer · Barcelona"). Decisión de Toni.

## Fase 5: menores y limpieza (bloque C, aplazado a petición de Toni: recordárselo)

- [ ] Código muerto: CSS del antiguo respaldo JPG de la foto (`hero.css`, `--photo-tint`), `.s-warn`, `.certs a span`, `facts.stack.trainingOnly`, `links.homepanelRepo` duplicado, `assets/logo.svg` sin enlazar, comentarios que describen el respaldo.
- [ ] Fechas: `years` en hora local y `today` en UTC; unificar. Validar en `check-content` los campos que pueden faltar (nota de formación, `meta` de certificaciones).
- [ ] Accesibilidad leve: números de sección "01…07" leídos en voz alta, encabezados de decisión ("1Sin puertos…"), objetivos táctiles < 44 px (logo, ES/EN, menú, enlace del repo), botón de volver arriba enfocable cuando está oculto, aviso visual de "pestaña nueva" en "Verificar", anécdota como `h4` en vez de `h3`, `scroll-padding-top`, texto del diagrama de ~9,7 px entre 820 y 960 px.
- [ ] Visual: el "404" con contorno doble; el botón de tema nace oculto y el selector ES/EN puede saltar con red lenta; las tarjetas de certificación quedan algo huecas; el anillo de `og.png` difiere del de la web; a 320 px el botón de volver arriba tapa la leyenda del diagrama.
- [ ] Opcional: fundido al cambiar de idioma conservando la sección (`#ancla`).
- [ ] Documentos desactualizados: SPEC (sigue como borrador de fase 0), DESIGN, PRODUCT, CONTRACTS (número de claves, respaldo de la foto, Spring Boot), notas de `drafts/contenido-final.md` con `[REVISAR]` ya resueltos, y el diagrama, que pone la web dentro de la VM Docker en vez de su LXC propia.
- [ ] CI: fijar las acciones a SHA, usar Node 21 como en el contrato (hoy `lts/*`), evitar que relanzar un workflow antiguo haga rollback; la respuesta de `/` sale sin CSP por el `add_header` de su `location`.
- [ ] Tests que faltan: regla de idioma, fechas y salida de `dist/`.

## Decisiones de Toni (resueltas el 2026-10-15)

- [x] **Formación**: era un CFGM de Sistemas Microinformáticos y Redes (SMR), no ASIR. Corregido en la web y en el contenido. **Falta corregirlo también en el CV en PDF.**
- [x] **Diagrama del homelab**: se mantienen los nombres de los servicios. Ya son públicos en el README de GitHub, están detrás de autenticación propia y el diagrama no da direcciones, versiones ni accesos: no añade riesgo. Si en el futuro se expone algo sin autenticación, quitarlo del diagrama.
- [x] **Entrada del hero**: el titular y la propuesta de valor ya no parten de opacidad 0, solo se desplazan, y empiezan antes: el texto principal se ve desde el primer fotograma.

## Contenido y materiales

- [ ] PDF del CV **sin teléfono ni metadatos**, y su botón "Descargar CV". El CV provisional tiene el teléfono y la experiencia que no se publica (ambos fuera) y pone ASIR donde es SMR.
- [ ] Spring Boot: decidir si va en "conozco" o fuera.
- [ ] Capturas de homepanel sin datos sensibles (opcional).

## Fase 6: publicación (pasos de Toni o con su aprobación)

- [ ] Desplegar en la LXC siguiendo `deploy/README.md`; probar en `next.gomila.dev`; cambiar el apex en NPM; redirecciones 301 de la web antigua; conservar la antigua 2 semanas.
- [ ] Secreto `PRIVACY_TERMS` en GitHub con los términos privados (copia de `.privacy-terms`).
- [ ] Google Search Console (y Bing): alta y envío del sitemap.
- [ ] LinkedIn y perfil de GitHub: titular "Toni Gomila · Backend Developer" y enlaces de ida y vuelta con la web.
- [ ] Validar datos estructurados (Rich Results Test) y la tarjeta (LinkedIn Post Inspector).

## Hecho en esta ronda

- Historial público limpio: fuera el primer borrador de contenido (revelaba el tipo de trámite y un servicio expuesto del homelab) y nombres internos; releases antiguas borradas; lista privada local ampliada. Respaldo del historial anterior en un bundle fuera de git.
- 404: los enlaces de la cabecera llevan a la portada del idioma.
- El script inline se escapa una sola vez en el build.
- La guardia de privacidad no imprime lo que encuentra y detecta teléfonos en atributos y enlaces `tel:`.
- El sitemap ya no incluye `/` (redirige).
- Texto "VM Docker" del diagrama con contraste AA.
- El servidor de desarrollo no se cae con rutas con byte nulo.
