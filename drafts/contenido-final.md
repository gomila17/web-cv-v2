# Contenido final — Web CV v2 (Toni Gomila)

Fase 1, versión del redactor con correcciones del revisor aplicadas (2026-10-12). Decisiones de Toni: Tailscale ya desplegado; router propio del homelab sí existe (d7); SSH con clave no se menciona; Copilot una línea; frase de gestión incluida. Pendiente de validación final de Toni.

Convenciones para quien lo use:
- Cada sección tiene claves (`hero.title`, `about.p1`...) con su texto en ES y EN. Las claves se pueden mapear 1:1 a un fichero i18n.
- `[FALTA: ...]` = dato que no está en las fuentes. No publicar con una marca abierta.
- `[REVISAR: ...]` = decisión de contenido que Toni debe confirmar.
- Las fechas de antigüedad se calculan desde fechas de inicio (ver `meta.dates`), no se escriben a mano.

---

## 0. Metadatos y fechas

| Clave | Valor |
|---|---|
| `meta.name` | Antonio (Toni) Gomila |
| `meta.role` | Backend Developer |
| `meta.location` | Barcelona |
| `meta.dates.inetum_start` | 2022-10 (prácticas) |
| `meta.dates.java_developer_start` | 2023-07 |
| `meta.dates.senior_start` | 2026-01 |
| Fórmula de antigüedad | años completos desde `inetum_start` hasta hoy (a 2026-10: "más de 4 años"). Calcular al construir la web. |

---

## 1. Presentación (`hero`)

**`hero.title`**
- ES: Backend Java que entiende el sistema completo
- EN: Java backend developer who sees the whole system

**`hero.subtitle`**
- ES: Oracle, Spring, automatización e IA, de la base de datos al despliegue.
- EN: Oracle, Spring, automation and AI, from the database to deployment.

**`hero.value`** (propuesta de valor, 2 líneas)
- ES: Desarrollo y evoluciono aplicaciones Java para la Administración Pública, y decido cómo se construyen de principio a fin. Fuera del trabajo opero mi propio homelab, así que conozco también lo que hay debajo del código.
- EN: I build and evolve Java applications for the public sector, and I make the design calls from start to finish. Outside work I run my own homelab, so I also know what sits underneath the code.

**`hero.ai_note`** (línea pequeña, visible)
- ES: Esta web está hecha con agentes de IA.
- EN: This site was built with AI agents.

**`hero.links`**
- LinkedIn: https://www.linkedin.com/in/toni-gomila/
- GitHub: https://github.com/gomila17
- Email: toni.gomila7@gmail.com `[REVISAR: email visible, decisión pendiente de SPEC]`
- CV en PDF (sin teléfono): `[FALTA: PDF final sin teléfono]`

**`hero.cta`**
- ES: Ver proyectos / Descargar CV
- EN: See projects / Download CV

---

## 2. Sobre mí (`about`)

**`about.p1`**
- ES: Soy desarrollador backend Java en Barcelona. Llevo más de cuatro años en Inetum, desde las prácticas hasta Senior Software Developer, evolucionando aplicaciones de la Administración Pública con Java, Spring y Oracle. En el día a día tomo la mayoría de decisiones de arquitectura de los evolutivos que trabajo.
- EN: I'm a Java backend developer based in Barcelona. I've spent over four years at Inetum, from intern to Senior Software Developer, evolving public-sector applications with Java, Spring and Oracle. Day to day I make most of the architecture decisions on the features I own.

**`about.p2`**
- ES: Me centro en que los sistemas hagan solos lo que antes se hacía a mano: optimizar consultas pesadas, migrar lógica compleja de PL/SQL a Java y automatizar procesos. Creo que un backend no se entiende aislado, así que fuera del trabajo opero mi homelab, automatizo con n8n y desarrollo con agentes de IA. Esta web está hecha así.
- EN: My focus is getting systems to do on their own what used to be done by hand: tuning heavy queries, migrating complex PL/SQL logic to Java, and automating processes. I don't think a backend makes sense in isolation, so outside work I run a homelab, automate with n8n and build with AI agents. This site was made that way.

**`about.longterm`** (bloque visualmente separado, última frase de la sección)
- ES: A largo plazo me interesa evolucionar hacia la gestión de equipos: me gusta trabajar con personas y ayudar a que otros crezcan.
- EN: In the long run I'd like to move toward managing teams: I like working with people and helping others grow.

---

## 3. Qué hago (`pillars`)

Hilo común (`pillars.intro`):
- ES: Un mismo hilo en tres frentes: entender el sistema entero, no solo mi capa.
- EN: One thread across three areas: understanding the whole system, not just my layer.

### 3.1 Backend Java (`pillars.backend`)

**`pillars.backend.title`**: ES Backend Java · EN Java backend

**`pillars.backend.items`**
1. ES: Consultas Oracle pesadas optimizadas. Ejemplos típicos: de ~30 s a ~5 s, o de ~1 min a ~10 s; las pequeñas, de ~10 s a ≤1 s.
   EN: Heavy Oracle queries tuned. Typical examples: ~30 s down to ~5 s, or ~1 min down to ~10 s; smaller ones from ~10 s to ≤1 s.
2. ES: Migración de lógica compleja de PL/SQL a Java para que sea más fácil de mantener.
   EN: Complex PL/SQL logic migrated to Java so it's easier to maintain.
3. ES: Integración de datos de otras administraciones públicas con las aplicaciones propias.
   EN: Data from other public bodies integrated into our own applications.
4. ES: Integraciones REST y SOAP; trabajo con sistemas legacy.
   EN: REST and SOAP integrations; hands-on work with legacy systems.
5. ES: Certificado Oracle Certified Associate, Java SE 8 Programmer (mar 2026).
   EN: Oracle Certified Associate, Java SE 8 Programmer (Mar 2026).

*Nota de diseño*: las cifras llevan "típicos/ejemplos", nunca como medida exacta.

### 3.2 Sistemas e infraestructura (`pillars.systems`)

**`pillars.systems.title`**: ES Sistemas e infraestructura · EN Systems and infrastructure

**`pillars.systems.items`**
1. ES: Homelab sobre Proxmox: una VM con Docker, LXC para red y servicios, Nginx Proxy Manager y AdGuard Home.
   EN: A Proxmox homelab: one VM for Docker, LXCs for networking and services, Nginx Proxy Manager and AdGuard Home.
2. ES: Servicios publicados con Cloudflare Tunnel desde detrás de CG-NAT, sin abrir puertos.
   EN: Services published through Cloudflare Tunnel from behind CG-NAT, with no open ports.
3. ES: Medidas de seguridad: Cloudflare Access con 2FA delante de lo expuesto, fail2ban, firewall de Proxmox solo para la red local y servicios sensibles únicamente en red local.
   EN: Security measures: Cloudflare Access with 2FA in front of what's exposed, fail2ban, a LAN-only Proxmox firewall, and sensitive services kept on the local network.
4. ES: Backups nativos de Proxmox con política definida (diario, retención de 3).
   EN: Native Proxmox backups with a defined policy (daily, keep last 3).
5. ES: Hospedo servicios de terceros, como openGym, un rastreador de gimnasio con passkeys.
   EN: I host third-party services, such as openGym, a gym tracker with passkey login.

### 3.3 IA y automatización (`pillars.ai`)

**`pillars.ai.title`**: ES IA y automatización · EN AI and automation

**`pillars.ai.items`**
1. ES: Procesos automáticos en el trabajo: extracciones periódicas (semanales o mensuales) que ahora genera un job y avisa al usuario por Excel o email; revisiones semanales de cambios hechos a mano; procesos que antes exigían una acción manual y ya no.
   EN: Automated processes at work: periodic extracts (weekly or monthly) now produced by a job and sent to the user by Excel or email; weekly checks on manual changes; processes that used to need a manual step and no longer do.
2. ES: n8n propio, con un resumen diario por Telegram (tiempo, noticias, tareas, mercados y novedades de mis apps).
   EN: My own n8n instance, with a daily Telegram digest (weather, news, tasks, markets and updates from my apps).
3. ES: Gestión de tareas del homelab con Claude Code y un MCP de Vikunja.
   EN: Homelab task management through Claude Code and a Vikunja MCP.
4. ES: Desarrollo con agentes de IA. Curso Claude Code 101 completado (Anthropic, abr 2026).
   EN: Development with AI agents. Claude Code 101 course completed (Anthropic, Apr 2026).
5. ES: En el trabajo, primeros pasos con IA: prompts de sistema para agentes, incluido un agente de incidencias con Copilot.
   EN: At work, early steps with AI: system prompts for agents, including an incident-handling agent built with Copilot.

---

## 4. Experiencia (`experience`)

**`experience.company`**: Inetum (proyectos de Administración Pública)

**`experience.intro`**
- ES: Proyectos de Administración Pública. De prácticas a Senior, con más de cuatro años de trayectoria (calculado desde oct 2022).
- EN: Public-sector projects. From intern to Senior, over four years on the job (computed from Oct 2022).

### 4.1 Senior Software Developer (`experience.senior`)
- Fechas: ene 2026 – actualidad · Jan 2026 – present
- Modalidad: híbrido · hybrid

ES:
- Gestiono evolutivos de principio a fin, casi en solitario, y decido la arquitectura: si algo es un job, un servicio manual u otra solución.
- Integro datos de otras administraciones con las aplicaciones propias.
- Automatizo procesos para que no requieran acción del usuario.
- Resuelvo incidencias complejas en producción y ayudo a compañeros, incluida la incorporación de gente nueva al proyecto.

EN:
- I run feature work end to end, mostly on my own, and decide the architecture: whether something should be a job, a manual service, or something else.
- I integrate data from other public bodies into our applications.
- I automate processes so users no longer have to act manually.
- I resolve complex production incidents and help teammates, including onboarding new people to the project.

Tecnologías · Technologies: Java, Spring Framework, Oracle, SQL, PL/SQL, REST, SOAP, ExtJS.

### 4.2 Java Developer (`experience.dev`)
- Fechas: jul 2023 – ene 2026 · Jul 2023 – Jan 2026
- Ubicación: Barcelona, híbrido · Barcelona, hybrid

ES:
- Consultas Oracle de alto coste reducidas a la mitad o menos de su tiempo, y a menudo a una cuarta parte.
- Jobs que sustituyen tareas manuales recurrentes: extracciones, informes y verificaciones.
- Migración de lógica de PL/SQL a Java.
- Sistema de notificación automática de errores por email.
- Integración con servicios REST y SOAP.

EN:
- High-cost Oracle queries cut to half their time or less, often to a quarter.
- Jobs replacing recurring manual tasks: extracts, reports and checks.
- Logic migrated from PL/SQL to Java.
- Automatic email notification of errors.
- Integration with REST and SOAP services.

Tecnologías · Technologies: Java 8, Spring Framework, Oracle, SQL, PL/SQL, REST, SOAP, ExtJS, JPA, SoapUI.

### 4.3 Software Developer Intern (`experience.intern`)
- Fechas: oct 2022 – jul 2023 · Oct 2022 – Jul 2023
- Ubicación: Barcelona

ES:
- Soporte en mejoras y corrección de incidencias en aplicaciones web internas.
- Primer contacto con el stack Java, Spring, ExtJS y Oracle, y con Scrum.
- Formación en Angular, Ionic y NestJS (formación, no es mi stack de trabajo).

EN:
- Support on enhancements and bug fixes in internal web applications.
- First contact with the Java, Spring, ExtJS and Oracle stack, and with Scrum.
- Training in Angular, Ionic and NestJS (training only, not my working stack).

Tecnologías · Technologies: Java, Spring Framework, Oracle, ExtJS, Scrum.

---

## 5. Proyectos (`projects`)

### 5.1 homepanel (`projects.homepanel`)

**`.title`**: homepanel
**`.tagline`**
- ES: Panel propio para el homelab, hecho a medida.
- EN: A custom dashboard for my homelab.

**`.stack`**: Python, FastAPI, Jinja2, htmx · integraciones con n8n, Proxmox, Vikunja, AdGuard, Nginx Proxy Manager y Cloudflare.
**`.links`**: https://github.com/gomila17/homepanel
**`.media`**: `[FALTA: capturas de pantalla sin datos sensibles]`

**Problema (`.problem`)**
- ES: Usaba Homepage, pero no cruza datos entre apps (por ejemplo, una línea de tiempo única con caídas, fallos de ejecución de n8n y eventos de Proxmox) ni se integra con n8n. Además quería una página de inicio con enlaces y buscador.
- EN: I was using Homepage, but it can't combine data across apps (for example, a single timeline of outages, n8n run failures and Proxmox events) and doesn't integrate with n8n. I also wanted a start page with links and search.

**Decisiones (`.decisions`)**
1. ES: FastAPI con páginas renderizadas en servidor y htmx. Sin SPA ni build de JS, para tener pocas dependencias y código legible.
   EN: FastAPI with server-rendered pages and htmx. No SPA, no JS build step: few dependencies and readable code.
2. ES: Desplegarlo en una LXC propia, no como stack Docker. Un panel que agrega el estado de la infraestructura no puede caer junto con lo que vigila.
   EN: Deploy it in its own LXC, not as a Docker stack. A dashboard that reports on the infrastructure shouldn't go down with the thing it watches.
3. ES: Actualización automática: un timer de systemd comprueba `main` cada 5 minutos y, si hay cambios, actualiza y reinicia. Solo hace peticiones salientes: sin puertos de entrada ni runner.
   EN: Auto-update: a systemd timer checks `main` every 5 minutes and, if there are changes, pulls and restarts. Outbound requests only: no inbound ports, no runner.
4. ES: Accesible solo desde la red local, porque reúne mucha información sensible de la infraestructura.
   EN: Reachable from the local network only, since it gathers a lot of sensitive infrastructure information.
5. ES: El servicio de actualización corre como root porque necesita reiniciar el servicio; lo acepté y lo documenté, en una LXC de un solo propósito, en vez de complicarlo con reglas de sudoers.
   EN: The update service runs as root because it has to restart the app. I accepted it and documented it, on a single-purpose LXC, rather than add sudoers rules.

**Resultado (`.result`)**
- ES: En producción en mi red, con tests que corren sin servicios externos (cada integración cae a "sin configurar") y CI en cada PR. Reemplazó a Homepage. Hoy muestra el estado de cada integración en una sola pantalla; cruzar datos entre ellas (la línea de tiempo única) sigue siendo un objetivo pendiente. Vuelta atrás sencilla: `git` + `systemd`, más una snapshot de Proxmox antes de cambios grandes.
- EN: Running in production on my network, with tests that run without external services (each integration falls back to "not configured") and CI on every PR. It replaced Homepage. Today it shows the state of each integration on one screen; combining data across them (the single timeline) is still a pending goal. Rollback is simple: `git` plus `systemd`, and a Proxmox snapshot before big changes.

**Lección (`.lesson`)**
- ES: Empecé sin un diseño detallado y fui descubriendo necesidades por el camino, así que algunas cosas quedaron peor de lo que quería. Hoy planificaría antes. Esta web empieza justo con esa lección.
- EN: I started without a detailed design and discovered requirements along the way, so some parts came out worse than I wanted. I'd plan up front today. This site starts from exactly that lesson.

### 5.2 Homelab (`projects.homelab`)

**`.title`**: Homelab
**`.tagline`**
- ES: Un servidor casero sobre Proxmox, detrás de CG-NAT, y las decisiones que hay detrás.
- EN: A home server on Proxmox, behind CG-NAT, and the decisions behind it.

**`.context`**
- ES: Un solo servidor físico (sin RAID ni redundancia de hardware). Proxmox VE como hipervisor por las VM, LXC, snapshots y backups nativos, y para poder experimentar sin romper la base. Una VM Debian con Docker para las aplicaciones; LXC para el túnel, el DNS y otros servicios de red.
- EN: A single physical server (no RAID, no hardware redundancy). Proxmox VE as hypervisor for VMs, LXC, snapshots and native backups, and room to experiment without breaking the base. A Debian VM running Docker for applications; LXCs for the tunnel, DNS and other network services.

**`.diagram`**: `[FALTA: diagrama del homelab sin IPs ni nombres internos]`

Decisiones, cada una en formato problema → decisión → por qué (`.decisions`):

**1. Sin puertos entrantes (`.d1`)**
- ES: *Problema*: estoy detrás de CG-NAT, no puedo abrir puertos. *Decisión*: Cloudflare Tunnel desde una LXC dedicada. *Por qué*: la conexión es solo saliente y no hace falta IP pública.
- EN: *Problem*: I'm behind CG-NAT and can't open ports. *Decision*: Cloudflare Tunnel from a dedicated LXC. *Why*: the connection is outbound only, so no public IP is needed.

**2. VPN con CG-NAT (`.d2`)**
- ES: *Problema*: acceder a casa desde fuera. *Decisión*: Tailscale, con un subnet router en una LXC. *Por qué*: WireGuard necesita un puerto entrante, y Cloudflare WARP caería con los bloqueos de LaLiga a rangos de Cloudflare. *Límite asumido*: si el servidor cae, la VPN cae con él.
- EN: *Problem*: reaching home from outside. *Decision*: Tailscale, with a subnet router in an LXC. *Why*: WireGuard needs an inbound port, and Cloudflare WARP would fail during LaLiga's blocks on Cloudflare ranges. *Accepted limit*: if the server goes down, the VPN goes with it.

**3. Vigilar al vigilante (`.d3`)**
- ES: *Problema*: un monitor que vive en el servidor no avisa de que el servidor se ha apagado. *Decisión*: usar un móvil Android reutilizado como nodo de monitorización independiente (en marcha). *Por qué*: tiene que vivir en hardware distinto; es el mismo razonamiento que la LXC aparte de homepanel.
- EN: *Problem*: a monitor running on the server can't tell you the server is down. *Decision*: use a repurposed Android phone as an independent monitoring node (work in progress). *Why*: it has to live on separate hardware; same reasoning as homepanel's dedicated LXC.

**4. Docker en VM, no en LXC (`.d4`)**
- ES: *Problema*: dónde correr Docker. *Decisión*: en una VM. *Por qué*: evitar Docker anidado en contenedores sin privilegios, según mi nivel de entonces (cómodo con Linux, aprendiendo Docker y redes).
- EN: *Problem*: where to run Docker. *Decision*: in a VM. *Why*: to avoid nested Docker inside unprivileged containers, given my experience at the time (comfortable with Linux, still learning Docker and networking).

**5. Servidor de correo descartado (`.d5`)**
- ES: *Problema*: quería correo propio. *Decisión*: no montarlo. *Por qué*: con CG-NAT no puedo recibir correo ni enviarlo con buena reputación desde una IP residencial. Solo sería viable con un VPS como relay.
- EN: *Problem*: I wanted my own mail server. *Decision*: not to build one. *Why*: behind CG-NAT I can't receive mail, and a residential IP has no sending reputation. A VPS relay would be the only viable route.

**6. Backups sencillos (`.d6`)**
- ES: *Problema*: proteger VMs y LXC. *Decisión*: backups nativos de Proxmox, sin Proxmox Backup Server. *Por qué*: con un solo nodo sería excesivo. Política: diario, retención de 3.
- EN: *Problem*: protecting VMs and LXCs. *Decision*: native Proxmox backups, no Proxmox Backup Server. *Why*: it would be overkill for a single node. Policy: daily, keep last 3.

**7. Red propia para el homelab (`.d7`)**
- ES: *Problema*: el homelab y mis equipos convivían con la red del proveedor, con un arranque caótico. *Decisión*: un router propio para el homelab y mis equipos, separado del router del operador. *Por qué*: controlo yo la red con la que trabajo, y queda aparte del wifi de casa. `[REVISAR: Toni, ¿te sirve esta redacción?]`
- EN: *Problem*: the homelab and my machines shared the ISP's network, and the start was chaotic. *Decision*: my own router for the homelab and my machines, separate from the ISP router. *Why*: I control the network I work on, and it's kept apart from the home Wi-Fi.

**Anécdotas de depuración (`.stories`)**

**Cortes intermitentes (`.s1`)**
- ES: Algunos días el acceso a mis servicios se cortaba sin error, solo con timeout. Resultó ser un bloqueo de los ISP a rangos de Cloudflare durante partidos de fútbol, que afecta de rebote a todo lo que está detrás de Cloudflare. No hay arreglo posible desde mi lado: la lección fue comprobar el calendario antes de depurar la red.
- EN: Some days access to my services timed out without any error. It turned out to be ISP blocks on Cloudflare IP ranges during football matches, which hit everything behind Cloudflare. There's no fix on my side; the lesson was to check the match calendar before debugging the network.

**Contenedor en crash-loop (`.s2`)**
- ES: Un servicio daba 502 sin motivo aparente. El contenedor no llegaba a abrir el puerto: corría como usuario sin privilegios y el volumen con nombre se había creado como root, así que no podía escribir. Lo arreglé con un contenedor de un solo uso que ajusta los permisos antes de arrancar el servicio.
- EN: A service returned 502 for no obvious reason. The container never opened its port: it ran as a non-root user and the named volume had been created as root, so it couldn't write. I fixed it with a one-shot container that sets permissions before the real service starts.

**Hospedo (`.hosting`)**
- ES: También hospedo openGym, un rastreador de gimnasio de terceros: un servicio que alojo, no un proyecto mío.
- EN: I also host openGym, a third-party gym tracker: a service I run, not a project of mine.

### 5.3 Esta web (`projects.web`)

**`.title`**
- ES: Esta web, hecha con agentes
- EN: This site, built with agents

**`.status`**
- ES: Se escribirá al terminar: cómo organicé el trabajo con subagentes y qué funcionó.
- EN: To be written when it's done: how I organized the work with subagents and what worked.

`[FALTA: caso de estudio completo, a redactar al cierre de la fase 6]`

---

## 6. Stack y certificaciones (`stack`)

### 6.1 Por nivel (`stack.levels`)

**Uso diario (`stack.daily`)** · **Daily use**
- Java 8, Spring Framework, JPA
- Oracle Database, SQL, PL/SQL (y optimización de consultas · and query tuning)
- REST, SOAP, SoapUI
- ExtJS
- Maven, Git, IntelliJ IDEA
- Scrum

**Conozco (`stack.known`)** · **I know**
- Spring Boot `[REVISAR: aparece en habilidades del CV, pero los puestos hablan de Spring Framework/Java 8]`
- Docker, Portainer
- Proxmox, Debian, Linux
- Cloudflare Tunnel, Nginx Proxy Manager, AdGuard Home, Tailscale
- n8n
- Python, FastAPI, htmx (homepanel)
- Claude Code, desarrollo con agentes · Claude Code, agent-based development
- Solo formación (no es dominio) · Training only (not working knowledge): Angular, Ionic, NestJS

**Exploro (`stack.exploring`)** · **I'm exploring**
- ES: Modelos de IA ligeros en local; más servicios self-hosted; un servidor multimedia.
- EN: Lightweight AI models running locally; more self-hosted services; a media server.
- ES: Orquestación de subagentes de IA (con esta propia web).
- EN: AI subagent orchestration (through this very site).

### 6.2 Certificaciones (`stack.certs`)

| Certificación · Certification | Emisor · Issuer | Fecha · Date |
|---|---|---|
| Oracle Certified Associate, Java SE 8 Programmer | Oracle | mar 2026 · Mar 2026 |
| Claude Code 101 (curso completado · course completed) | Anthropic | abr 2026 · Apr 2026 |
| ThePower Business School | ThePower | nov 2023 · Nov 2023 |

`[FALTA: tema o nombre del programa de ThePower Business School; sin él la línea no dice nada. Si no aporta, omitir.]`

---

## 7. Formación (`education`)

**CFGS Desarrollo de Aplicaciones Web (DAW)** (`education.daw`)
- Institut Joan d'Àustria, Barcelona · sept 2021 – jun 2023 · Sep 2021 – Jun 2023
- Nota media · Average grade: 8,92/10
- ES: Módulos destacados: Java, JavaScript, Angular, bases de datos relacionales, despliegue web.
- EN: Key modules: Java, JavaScript, Angular, relational databases, web deployment.

**CFGM Administración de Sistemas Informáticos en Red (ASIR)** (`education.asir`)
- IES Biel Martí, Menorca · sept 2019 – dic 2020 · Sep 2019 – Dec 2020
- Nota media · Average grade: 7/10

**Idiomas · Languages** (`education.languages`)
- Catalán · Catalan: nativo · native
- Castellano · Spanish: nativo · native
- Inglés · English: C1

---

## 8. Contacto (`contact`)

**`contact.title`**
- ES: Hablemos
- EN: Get in touch

**`contact.text`**
- ES: Si tienes una oferta, una duda sobre alguno de mis proyectos o simplemente quieres comentar algo de backend o infraestructura, escríbeme.
- EN: If you have an opportunity, a question about one of my projects, or just want to talk backend or infrastructure, write to me.

**`contact.links`**
- Email: toni.gomila7@gmail.com `[REVISAR: email visible]`
- LinkedIn: https://www.linkedin.com/in/toni-gomila/
- GitHub: https://github.com/gomila17
- CV (PDF): `[FALTA: PDF final sin teléfono]`

**`contact.longterm`** (bloque visualmente separado)
- ES: Abierto a conversar sobre roles técnicos con vocación de liderazgo.
- EN: Open to talking about technical roles with a leadership path.

`[FALTA: decidir si hay formulario de contacto o solo enlaces; SPEC lo deja como idea n8n opcional.]`

---

## Notas del redactor

**Dudas**
1. Spring Boot: colocado en "conozco". El CV lo lista en habilidades pero los tres puestos dicen Spring Framework (y Java 8 en el de Java Developer). Toni debe decidir si se queda, pasa a "uso diario" o se quita.
2. Red aislada con segundo router: está en el primer borrador marcada [confirmar] y no aparece en la documentación del homelab (el contexto solo describe un router como gateway). La he omitido del texto final. Si Toni lo confirma, se puede añadir como decisión 7 del homelab o a la línea de seguridad.
3. SSH solo con usuario y contraseña (pendiente, según el contexto del homelab). Honestidad vs. exposición de seguridad: lo dejo como [REVISAR] para que Toni decida si se publica.
4. Cifras de consultas: puestas como ejemplos típicos, tal como pidió Toni. El texto de Java Developer ("la mitad o menos, a menudo una cuarta parte") es el de el primer borrador; coincide con los ejemplos (6x, 6x, 10x+), pero conviene que Toni lo confirme.
5. "33 commits" de el primer borrador: omitido, porque el número cambia y no se puede verificar desde las fuentes; añadir si Toni quiere un dato más.
6. Copilot: una sola mención, dentro de IA y automatización (punto 5), sin protagonismo. La fuente solo dice "agente de incidencias con Copilot, hace un año"; no he puesto la fecha para no inventar su vigencia.

**Supuestos**
- "Administración Pública" como único contexto. El texto usa "automatizar procesos", sin tipo de trámite. Se evitó concretar el tipo de trámite.
- "Más de cuatro años" se calcula desde oct 2022 (a 2026-10-12 ya son cuatro años). Actualizar o calcular en build.
- openGym se describe solo como servicio de terceros que alojo. No se da su URL.
- El rol declarado es "Backend Developer" (decisión de SPEC), no "Full-Stack".
- Para el móvil de monitorización: solo "móvil Android reutilizado". No se nombran herramientas, nombres de máquinas, IPs ni subdominios; sí se nombran productos genéricos (Proxmox, Cloudflare, Tailscale...), que ya son públicos en el README de GitHub.
- La anécdota de LaLiga se cuenta como "bloqueos de ISP a rangos de Cloudflare durante partidos"; se nombra LaLiga solo en la decisión de la VPN, por ser el dato técnico. Toni puede preferir omitir el nombre.
- La nota sobre Angular, Ionic y NestJS aparece como "solo formación" en dos sitios (prácticas y stack), para que no se lea como dominio.
- "Exploro": he puesto lo que las fuentes marcan como próximos pasos (modelos de IA ligeros en local, servidor multimedia, más self-hosted) y la orquestación de subagentes (SPEC la declara como aprendizaje).
- ThePower no lleva enlace ni descripción porque no hay fuente.

**Datos que faltan**
- PDF del CV final sin teléfono.
- Foto (SPEC dice que sí; no hay archivo).
- Capturas de homepanel sin datos sensibles y diagrama del homelab sin IPs ni nombres internos.
- Tema del programa ThePower Business School.
- Confirmar si el email se publica visible y si habrá formulario.
- Caso de estudio de "esta web" (al terminar el proyecto).
- Catalán: opcional, fase posterior; no traducido.
- Versión actual de LinkedIn: SPEC indica que se actualizará al terminar el proyecto (hoy dice Full-Stack).

**Comprobaciones de privacidad hechas**: sin teléfono; sin nombres de clientes ni herramientas internas de IA de la empresa; sin IPs, subdominios internos ni identificadores (ni siquiera nombres de máquinas ni el UID de admin del contexto); sin tipo concreto de trámite.
