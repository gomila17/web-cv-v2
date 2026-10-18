# deploy/

Cómo se publica la web (ARCHITECTURE.md decisiones 6–9). Quién lo toca: subagente de despliegue.

```
push a main ─► CI (.github/workflows/ci.yml): npm test · npm run build (+ guardia) · check-csp
            └► GitHub Release <AAAAMMDD-HHMMSS-sha>: web-cv-<sha>.tar.gz + .sha256
LXC dedicada ─► web-cv-update.timer (cada 5 min, usuario sin privilegios)
            └► web-cv-update.sh: ¿hay release nuevo? → descarga → sha256 → releases/<tag>/ → current
Nginx ─► sirve /srv/web-cv/current (enlace). Desplegar o volver atrás = repuntar el enlace.
```

| Fichero | Qué es |
|---|---|
| `web-cv-update.sh` | Instala el último release. Idempotente; `DRY_RUN=1` y `LOCAL_TARBALL=` para probar sin tocar nada o sin red. |
| `web-cv-update.service` / `.timer` | Unidad oneshot como usuario `webcv`, encerrada por systemd; timer cada 5 min. |
| `nginx.conf` | Sitio de ejemplo: charset, 404 propia, caché por tipo, gzip y cabeceras de seguridad (CSP incluida). |
| `check-csp.mjs` | CI: comprueba que la CSP de `nginx.conf` autoriza exactamente el JS en línea de `dist/`. |

Nada de este directorio contiene datos reales de la infraestructura. Los valores que dependen de la red de casa son **marcadores** y se rellenan solo en la LXC (o en notas privadas, nunca en el repo):

| Marcador | Qué es |
|---|---|
| `<IP_LXC>` | IP fija de la LXC de la web en la LAN |
| `<IP_NPM>` | IP de Nginx Proxy Manager (para `set_real_ip_from`) |
| `<OWNER>/<REPO>` | repositorio público de GitHub; va en `/etc/web-cv-update.env` |
| `<UPSTREAM_ACTUAL>` | destino actual del apex en NPM (la web vieja); apuntarlo en notas privadas antes del cambio |

Valores por defecto propuestos (genéricos): usuario `webcv`, raíz `/srv/web-cv`, script en `/usr/local/bin/web-cv-update.sh`. Si se cambian, cambiarlos a la vez en `web-cv-update.service` y `nginx.conf`.

## Decisiones de seguridad

- **Usuario sin privilegios.** homepanel necesita root para `systemctl restart`; aquí no hay nada que reiniciar, así que el actualizador corre como `webcv`, que solo es dueño de `/srv/web-cv`. El script lo instala root en `/usr/local/bin` (755): `webcv` no puede modificar el código que ejecuta.
- **systemd lo encierra**: `NoNewPrivileges`, `ProtectSystem=strict` con `ReadWritePaths` solo a `/srv/web-cv`, `ProtectHome`, `PrivateTmp`, `PrivateDevices`, sin capacidades, solo sockets IPv4/IPv6/Unix y filtro de llamadas `@system-service`. Comprobar con `systemd-analyze security web-cv-update.service`.
- **El tarball es de la red y no se confía en él**: solo HTTPS (también en redirecciones), sha256 obligatorio (y contrastado con el `digest` que publica la API si existe), y se rechazan rutas absolutas, `..`, enlaces y ficheros especiales, y versiones que no sean un nombre de carpeta. Se extrae sin conservar dueño ni permisos y se fuerza 755/644.
- **Sin token ni puertos de entrada**: la LXC solo hace peticiones salientes a la API pública (12/h, por debajo del límite anónimo de 60/h por IP).
- **CI con permisos mínimos**: el token no puede nada por defecto; `contents: read` para construir y `contents: write` solo en el job que publica el release, que no ejecuta código del repo.

### CSP: hash y no nonce

La CSP solo permite recursos propios (`default-src 'none'` y se abre lo justo). El único JS en línea es `head.js` (fija el tema antes de pintar para que no parpadee). Dos formas de autorizarlo:

- **Nonce**: un valor aleatorio distinto en cada respuesta, en la cabecera y en el `<script nonce>`. En un sitio estático no hay quien lo genere: haría falta que Nginx reescribiera cada HTML (`sub_filter` con `$request_id`), lo que acopla Nginx al HTML, rompe el ETag y la caché de Cloudflare. Y un nonce fijo escrito en el build no protege nada (cualquiera lo lee).
- **Hash** (elegido): el sha256 del contenido exacto del script, fijo en la cabecera. Coste cero en cada petición y compatible con cualquier caché. Contrapartida: si `head.js` cambia, el hash cambia y el script dejaría de ejecutarse **sin error visible** (solo un aviso en la consola). Por eso CI ejecuta `check-csp.mjs`, que calcula los hashes sobre `dist/` y falla si `nginx.conf` no los tiene. Tras cambiarlo hay que copiar `nginx.conf` a la LXC y recargar Nginx (paso 4). Las cabeceras de seguridad están dos veces en `nginx.conf` (en `server` y en `location = /`, porque el `add_header` de un `location` descarta las heredadas y la redirección de `/` salía sin CSP); `check-csp` falla si las copias de la CSP difieren, así que al cambiarlas hay que cambiar las dos. La instalación no cambia: sigue siendo un solo fichero.

Además: `style-src-attr 'unsafe-inline'` por los `style="--n:…"` del diagrama (variables CSS, no ejecutan nada; un navegador sin soporte de `style-src-attr` solo pierde el escalonado de la animación). Los datos estructurados JSON-LD no se ejecutan y la CSP no les afecta. HSTS va en el borde (NPM o Cloudflare), donde está el HTTPS.

## Pendiente para el integrador

1. **404 propia**: hecha. El build genera `es/404.html` y `en/404.html`, y `nginx.conf` sirve la del idioma de la ruta.
2. **`head.js`**: su hash ya está en `nginx.conf`. Si cambia el script, CI falla en `check-csp` a propósito e imprime el hash nuevo para sustituirlo.
3. **Sin manejadores en atributos**: la foto del hero ya no lleva `onerror` (se quitó el respaldo a `foto.jpg`), así que la CSP no necesita `'unsafe-hashes'`. `check-csp` avisa si vuelve a aparecer alguno.
4. **Caché**: el build enlaza `styles.css` y `main.js` con `?v=<hash del contenido>`, así que se cachean 1 año con `immutable`; el HTML sigue con `no-cache` y trae la URL nueva en cuanto cambian.

## Fase 6: puesta en marcha (paso a paso, con Toni aprobando cada paso)

Requisito previo: el repo es público, `main` tiene el workflow y existe al menos un Release con `web-cv-<sha>.tar.gz` y su `.sha256` (pestaña Releases de GitHub). Opcional: secreto `PRIVACY_TERMS` en Settings → Secrets → Actions.

### 1. LXC dedicada (Proxmox)

- Plantilla Debian (12 o 13) mínima, **sin privilegios**, un solo propósito (decisión 7). 1 vCPU, 256–512 MB de RAM y 2–4 GB de disco sobran.
- IP fija en la LAN: `<IP_LXC>`. Snapshot de Proxmox antes de empezar.

### 2. Sistema, usuario y carpetas (como root dentro de la LXC)

```bash
apt update && apt install -y nginx curl jq ca-certificates
useradd --system --home-dir /srv/web-cv --no-create-home --shell /usr/sbin/nologin webcv
install -d -o webcv -g webcv -m 755 /srv/web-cv
```

`/srv/web-cv` es 755 para que Nginx (`www-data`) pueda atravesarla; dentro, el script deja carpetas 755 y ficheros 644 (el 403 por `chmod 700` ya pasó una vez).

### 3. Script y timer

Copiar los ficheros de `deploy/` de un commit concreto de `main` (con `git clone` en otra máquina o descargando los ficheros "raw" del repo) y, como root:

```bash
install -o root -g root -m 755 web-cv-update.sh /usr/local/bin/web-cv-update.sh
install -o root -g root -m 644 web-cv-update.service web-cv-update.timer /etc/systemd/system/
printf 'GITHUB_REPO=%s\n' '<OWNER>/<REPO>' > /etc/web-cv-update.env   # KEEP=3 opcional
chmod 644 /etc/web-cv-update.env
systemctl daemon-reload

# Primero en simulación: consulta, descarga y verifica, pero no instala nada.
runuser -u webcv -- env WEB_ROOT=/srv/web-cv GITHUB_REPO='<OWNER>/<REPO>' DRY_RUN=1 /usr/local/bin/web-cv-update.sh

# Una ejecución real, y después el timer.
systemctl start web-cv-update.service
journalctl -u web-cv-update -n 20 --no-pager      # "current -> releases/<tag>"
ls -l /srv/web-cv                                  # current -> releases/<tag>
systemctl enable --now web-cv-update.timer
systemctl list-timers web-cv-update.timer
systemd-analyze security web-cv-update.service     # nivel de exposición esperado: bajo
```

El script y las unidades **no se actualizan solos** (a propósito: el timer solo cambia contenido, nunca el código que corre en la LXC). Si cambian en el repo, repetir este paso.

### 4. Nginx

```bash
install -o root -g root -m 644 nginx.conf /etc/nginx/sites-available/web-cv
# El hash de head.js de nginx.conf ya es el bueno si CI pasa en ese commit
# y, opcionalmente, set_real_ip_from <IP_NPM>.
ln -s /etc/nginx/sites-available/web-cv /etc/nginx/sites-enabled/web-cv
rm /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

curl -sI http://127.0.0.1/es/ | grep -iE 'HTTP/|content-type|cache-control|content-security|x-content'
curl -sI http://127.0.0.1/es | grep -i location        # relativa: "Location: /es/"
curl -sI -H 'Accept-Encoding: gzip' http://127.0.0.1/styles.css | grep -i content-encoding
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1/no-existe   # 404
```

### 5. Prueba en `next.gomila.dev`

El comodín del túnel ya lleva cualquier subdominio a NPM (decisión 8), así que solo hace falta un Proxy Host nuevo en NPM:

- Dominio `next.gomila.dev` → `http://<IP_LXC>:80`, con el mismo certificado/SSL que el resto.
- En "Advanced" de ese host: `add_header X-Robots-Tag "noindex" always;`, para que la prueba no se indexe (el `canonical` ya apunta a `gomila.dev`).

Comprobar desde fuera de casa (datos móviles):

- `/`, `/es/`, `/en/`, el selector de idioma, el tema claro/oscuro y una URL inexistente (404).
- Consola del navegador **sin avisos de CSP** (si aparece uno, el hash no cuadra: paso 4).
- Cabeceras con `curl -sI https://next.gomila.dev/es/` (HSTS lo pone el borde).
- **Lo que Cloudflare mete en el HTML** (la web vieja ya lo sufre: ofusca el correo). Ver el código fuente de `/es/` y buscar `cdn-cgi`, `beacon` y `rocket`. Si aparecen: en Cloudflare, para `gomila.dev`, desactivar **Email Address Obfuscation** (Scrape Shield; si no, el correo del pie y de la página de privacidad se ve como "[email protected]" hasta que carga su script), **Rocket Loader**, **Auto Minify** y **Web Analytics** (su baliza la bloquea la CSP y contradice "sin analítica de terceros" de la página de privacidad). Comprobar también que el HTML no se cachea en el borde (`cf-cache-status` debe ser `DYNAMIC` o `BYPASS` en `/es/`; con `HIT`, un despliegue no se vería al momento).
- La página de privacidad: `/es/privacidad/` y `/en/privacy/` (200, con `/es/privacidad` redirigiendo a la barra final) y el enlace del pie.
- Un despliegue de verdad: un cambio pequeño en `main` debe verse en menos de ~10 min (CI + timer) sin tocar la LXC; `journalctl -u web-cv-update -f` lo muestra.
- Las comprobaciones manuales de ARCHITECTURE.md (Lighthouse, axe, móvil y escritorio).

### 6. Cambio del apex en NPM

1. Antes: apuntar en notas privadas el destino actual del Proxy Host `gomila.dev` (`<UPSTREAM_ACTUAL>`): es el rollback.
2. Redirecciones 301 de la web vieja: **no hacen falta** (comprobado el 2026-10-18). La vieja es una sola página (`/`, con anclas `#sobre-mi`, `#experiencia`… que no llegan al servidor) y sus recursos (`/css`, `/js`, `/libs`, `/assets/profile.jpg`) no se indexan; no tiene sitemap. Lo único que cuenta es `/`, que ya redirige (302) a `/es/` o `/en/`. Si Search Console, una vez dado de alta, lista otras URL, añadir un `location = … { return 301 /es/; }` en `nginx.conf` (hay un ejemplo comentado).
3. En NPM, editar `gomila.dev` y cambiar el destino a `http://<IP_LXC>:80`, sin tocar SSL.
4. Si Cloudflare cachea HTML, purgar la caché. Comprobar `https://gomila.dev/` como en el paso 5.
5. Después, quitar el host `next.gomila.dev` de NPM (o dejarlo con `noindex`).

### 7. Rollback

- **A una versión anterior de la web** (segundos, sin root):
  ```bash
  ls /srv/web-cv/releases                        # las 3 últimas
  runuser -u webcv -- sh -c 'cd /srv/web-cv && ln -sfn releases/<VERSION> .current.tmp && mv -T .current.tmp current && touch PIN'
  ```
  `PIN` impide que el timer vuelva a instalar la última en 5 min. Cuando haya un release corregido: `rm /srv/web-cv/PIN`. Para una versión que ya no está en disco, quedan 10 en GitHub Releases: `LOCAL_TARBALL=` con el fichero descargado.
- **Del cambio entero**: en NPM, devolver `gomila.dev` a `<UPSTREAM_ACTUAL>`. Por eso la web vieja sigue viva.

### 8. La web actual

Se conserva **intacta y funcionando unas 2 semanas** tras el cambio del apex (decisión 8), sin borrar nada, como rollback inmediato. Pasado ese plazo y sin incidencias: copia de seguridad (snapshot o archivo de sus ficheros), pararla, quitar lo que solo existía para ella y apuntar en notas privadas dónde queda la copia.

### Mantenimiento

- Logs: `journalctl -u web-cv-update` (cada ciclo, una línea "al día: <tag>") y `/var/log/nginx/web-cv.*.log`.
- Retención de logs: la página de privacidad promete 30 días como máximo. Comprobar que `/etc/logrotate.d/nginx` rota `/var/log/nginx/*.log` con `rotate` ≤ 30 diarios (Debian trae 14) y que NPM/Cloudflare no guardan más tiempo sin que se diga en esa página.
- Estado: `systemctl list-timers web-cv-update.timer` y `readlink /srv/web-cv/current`.
- Un release que falla la verificación no se instala: la web sigue en la versión anterior y el error queda en el journal.
