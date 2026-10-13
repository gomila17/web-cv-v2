# SPEC — Web CV v2 (Toni Gomila)

Estado: **borrador de fase 0 (diseño)**. Sin tecnología ni diseño visual todavía.

## 1. Objetivo

1. Reforzar candidaturas en procesos de selección (algo que se pueda enlazar y que respalde el CV).
2. Servir de escaparate para quien llegue desde LinkedIn u otros sitios y se interese por el perfil.
3. Proyecto de aprendizaje: **desarrollo con agentes** (orquestación de subagentes) y, como extra, **n8n**.

Audiencia: mixta (reclutadores, managers técnicos, otros devs). La web debe entenderse en 30 segundos y aguantar una lectura profunda.

## 2. Posicionamiento

Backend Java como base sólida, con visión de sistemas completa y la IA integrada en la forma de trabajar.

Titular candidato (a pulir): *"Backend Java que entiende el sistema completo: de Oracle al despliegue, con IA en el flujo de trabajo."*

Tres pilares, un solo hilo ("entender el sistema entero"):
- **Backend Java**: Java/Spring, Oracle, SQL/PL/SQL, migración de lógica a Java, APIs REST/SOAP, sistemas legacy.
- **Sistemas e infraestructura**: homelab (Proxmox, Docker, Cloudflare Tunnel, Nginx Proxy Manager, AdGuard), decisiones de despliegue.
- **IA y automatización**: prompts de sistema para agentes, n8n, desarrollo con agentes, certificación Claude Code 101.

Principios de contenido:
- Honestidad: lo que se explora se etiqueta como "exploro", no como dominio.
- Logros en formato problema → acción → resultado (datos a aportar por Toni, pendiente).
- Sin nombres de clientes ni datos internos de Inetum: "Administración Pública".
- Decir abiertamente que la web está hecha con agentes (muestra interés en IA).
- Nota: LinkedIn dice "Full-Stack especializado en backend"; el CV dice "Backend". Unificar rol declarado.

## 3. Estructura de contenido

Una página principal + páginas de detalle para los proyectos.

1. **Presentación**: nombre, titular, propuesta de valor en 2 líneas, enlaces (LinkedIn, GitHub, email, CV PDF).
2. **Qué hago**: los tres pilares con 2–3 pruebas concretas cada uno.
3. **Experiencia**: Inetum, de prácticas (oct 2022) a Senior Software Developer (ene 2026). Logros, no tareas.
4. **Proyectos** (casos de estudio):
   - homepanel (FastAPI + htmx, integraciones n8n/Proxmox/Vikunja, tests, CI, LXC con auto-update).
   - Homelab (arquitectura, CG-NAT + Cloudflare Tunnel, por qué cada decisión).
   - Esta web y cómo se hizo con agentes.
5. **Stack y certificaciones**: por nivel (uso diario / conozco / exploro). Certificaciones: Oracle Java SE 8 (mar 2026), Claude Code 101 (abr 2026), ThePower (nov 2023).
6. **Formación**: CFGS DAW, CFGM ASIR.
7. **Contacto**.

Hueco previsto, no en v1: notas/blog, "ahora estoy aprendiendo".

## 4. Decisiones tomadas

| Tema | Decisión |
|---|---|
| Idiomas | Español + inglés. Catalán como extra opcional (fase posterior). |
| Foto | Sí. |
| Email | Visible (decisión por confirmar al diseñar contacto). |
| Teléfono | **No se publica nunca** (ni en la web ni en el PDF descargable). |
| CV descargable | PDF, sin teléfono. |
| Proyectos estrella | homepanel + homelab (+ esta web). |
| Mención a IA | Explícita. |
| Rol declarado | **Backend Developer** (LinkedIn se actualizará al terminar el proyecto). |
| Plan | 7 fases aprobadas tal cual. |
| Alojamiento | Homelab propio, gomila.dev; diseño de despliegue libre (se decide en fase 2). |
| openGym | Proyecto de terceros alojado por Toni: mencionar solo como "servicio que alojo", no como propio. |

## 5. Pendientes de contenido

- Logros medibles de Inetum (tiempos de consultas, procesos automatizados, problema del sistema de notificaciones...). Se tratarán en una sesión aparte.
- Fechas/duración: fijar la fórmula (calcular desde fechas, no escribir "3+ años" a mano).
- Texto final del titular y del "sobre mí" (español e inglés).
- Material de los casos de estudio (capturas de homepanel sin datos sensibles, diagrama del homelab).
- Confirmar qué se puede decir de la Administración Pública.

## 6. Plan por fases

| Fase | Resultado | Rol de agentes |
|---|---|---|
| 0. Diseño de contenido (esta) | SPEC.md aprobado | Agente de investigación (fuentes), agente redactor de borradores |
| 1. Contenido final ES/EN | Textos y logros validados por Toni | Redactor + revisor de tono/veracidad |
| 2. Arquitectura y tecnología | Decisiones técnicas razonadas | Agente de planificación |
| 3. Diseño visual | Dirección visual aprobada | Agente de diseño |
| 4. Implementación | Web funcionando en local | Subagentes en paralelo (estructura, estilos, i18n, contenido) |
| 5. Calidad | Accesibilidad, rendimiento, SEO, revisión | Subagentes revisores (code-review, a11y, contenido) |
| 6. Publicación | En producción (gomila.dev u otro) | Agente de despliegue |

Cada fase termina con un entregable revisado por Toni antes de pasar a la siguiente.

### Aprendizaje de agentes
- Orquestación de subagentes: lanzar en paralelo agentes con encargos acotados y un agente integrador.
- Uso de `CLAUDE.md`, skills propias y revisión automática como parte del proyecto.
- Documentar el proceso (alimenta el caso de estudio "cómo se hizo esta web").

### Extra n8n (opcional)
Ideas a valorar en una fase posterior: actualización automática de datos (repos de GitHub), flujo del formulario de contacto, aviso de nuevas visitas o despliegues. Solo si aportan; no bloquea la v1.

## 7. Fuera de alcance de la v1
Blog, comentarios, panel de administración, analítica invasiva, catalán completo (se decide después).
