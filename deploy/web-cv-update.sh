#!/usr/bin/env bash
# web-cv-update.sh: instala el último GitHub Release de la web (ARCHITECTURE.md decisión 6).
#
# Lo lanza web-cv-update.timer cada 5 min como un usuario SIN privilegios. Solo escribe dentro de
# WEB_ROOT y solo hace peticiones salientes a GitHub (API pública, sin token). Nginx sirve
# WEB_ROOT/current, que es un enlace simbólico; cambiar de versión es repuntarlo, sin reiniciar nada.
#
#   WEB_ROOT/
#     releases/<tag>/   una carpeta por versión (dirs 755, ficheros 644)
#     current -> releases/<tag>    enlace relativo, se cambia de forma atómica (ln -s a temporal + mv -T)
#     PIN               si existe, no se actualiza (rollback manual; ver deploy/README.md)
#     .tmp/             descargas en curso (mismo sistema de ficheros que releases/)
#
# Idempotente: si la última versión ya es la instalada, no hace nada y sale con 0.
#
# Configuración (variables de entorno; en producción, EnvironmentFile de web-cv-update.service):
#   GITHUB_REPO    <OWNER>/<REPO> del repositorio público (obligatoria salvo con LOCAL_TARBALL)
#   WEB_ROOT       raíz de la web (por defecto /srv/web-cv)
#   KEEP           releases que se conservan en disco (por defecto 3; la actual nunca se borra)
#   DRY_RUN=1      descarga y verifica, pero no instala, no repunta y no borra nada
#   LOCAL_TARBALL  ruta a un web-cv-<sha>.tar.gz local (con su .sha256 al lado): pruebas sin red
#   LOCAL_TAG      versión con la que se instala LOCAL_TARBALL (por defecto, el nombre del fichero)
#
# Dependencias: bash, coreutils, tar, gzip, curl, jq (solo en modo API) y flock (util-linux, opcional).
set -euo pipefail
umask 022

WEB_ROOT="${WEB_ROOT:-/srv/web-cv}"
KEEP="${KEEP:-3}"
DRY_RUN="${DRY_RUN:-0}"
GITHUB_API="${GITHUB_API:-https://api.github.com}"
GITHUB_REPO="${GITHUB_REPO:-}"
LOCAL_TARBALL="${LOCAL_TARBALL:-}"
LOCAL_TAG="${LOCAL_TAG:-}"

# Una versión es un nombre de carpeta: nada de '/', '..' ni espacios (viene de la red).
TAG_RE='^[A-Za-z0-9][A-Za-z0-9._-]{0,99}$'
ASSET_RE='^web-cv-[A-Za-z0-9._-]+\.tar\.gz$'

log()  { printf '%s web-cv-update: %s\n' "$(date -Iseconds)" "$*"; }
fail() { printf '%s web-cv-update: ERROR: %s\n' "$(date -Iseconds)" "$*" >&2; exit 1; }

[[ "$KEEP" =~ ^[1-9][0-9]*$ ]] || fail "KEEP debe ser un entero >= 1 (vale '$KEEP')"
[[ "$WEB_ROOT" == /* ]] || fail "WEB_ROOT debe ser una ruta absoluta (vale '$WEB_ROOT')"
[[ -d "$WEB_ROOT" && -w "$WEB_ROOT" ]] || fail "WEB_ROOT '$WEB_ROOT' no existe o no se puede escribir"

RELEASES="$WEB_ROOT/releases"
CURRENT="$WEB_ROOT/current"
mkdir -p "$RELEASES" "$WEB_ROOT/.tmp"

# Un solo proceso a la vez (el timer no se solapa consigo mismo, pero una ejecución a mano sí podría).
if command -v flock >/dev/null 2>&1; then
  exec 9>"$WEB_ROOT/.update.lock"
  flock -n 9 || { log "otra actualización en curso; salgo sin hacer nada"; exit 0; }
fi

WORK="$(mktemp -d "$WEB_ROOT/.tmp/run.XXXXXX")"
cleanup() { rm -rf -- "$WORK"; }
trap cleanup EXIT

installed_version() {
  if [[ -L "$CURRENT" ]]; then basename -- "$(readlink -- "$CURRENT")"; fi
}

http_get() { # http_get <url> <destino> [opciones de curl]: solo HTTPS (también en redirecciones)
  local url="$1" out="$2"
  shift 2
  curl --proto '=https' --proto-redir '=https' --tlsv1.2 --fail --silent --show-error --location \
       --retry 3 --retry-delay 5 --connect-timeout 15 --max-time 300 \
       -H 'User-Agent: web-cv-update' "$@" --output "$out" --url "$url"
}

# --- 1. ¿Qué versión hay publicada? -------------------------------------------------------------
if [[ -n "$LOCAL_TARBALL" ]]; then
  [[ -f "$LOCAL_TARBALL" && -f "$LOCAL_TARBALL.sha256" ]] || fail "falta $LOCAL_TARBALL o su .sha256"
  ASSET="$(basename -- "$LOCAL_TARBALL")"
  TAG="${LOCAL_TAG:-${ASSET%.tar.gz}}"
  cp -- "$LOCAL_TARBALL" "$WORK/$ASSET"
  cp -- "$LOCAL_TARBALL.sha256" "$WORK/$ASSET.sha256"
  API_DIGEST=""
  log "modo local: $ASSET como versión $TAG"
else
  [[ "$GITHUB_REPO" =~ ^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$ ]] || fail "GITHUB_REPO debe ser <OWNER>/<REPO> (vale '$GITHUB_REPO')"
  command -v jq >/dev/null 2>&1 || fail "falta jq (apt install jq)"
  http_get "$GITHUB_API/repos/$GITHUB_REPO/releases/latest" "$WORK/latest.json" \
    -H 'Accept: application/vnd.github+json' -H 'X-GitHub-Api-Version: 2022-11-28' \
    || fail "no se pudo consultar el último release de $GITHUB_REPO"
  TAG="$(jq -r '.tag_name // empty' "$WORK/latest.json")"
  ASSET="$(jq -r '[.assets[] | select(.name | test("^web-cv-.*\\.tar\\.gz$"))][0].name // empty' "$WORK/latest.json")"
fi

[[ "$TAG" =~ $TAG_RE ]] || fail "versión no válida: '$TAG'"
[[ "$ASSET" =~ $ASSET_RE ]] || fail "el release $TAG no tiene un web-cv-*.tar.gz válido ('$ASSET')"

INSTALLED="$(installed_version)"
if [[ "$INSTALLED" == "$TAG" && -f "$RELEASES/$TAG/index.html" ]]; then
  log "al día: $TAG"
  exit 0
fi
if [[ -e "$WEB_ROOT/PIN" ]]; then
  log "hay versión nueva ($TAG) pero $WEB_ROOT/PIN existe: se mantiene ${INSTALLED:-<ninguna>}"
  exit 0
fi
log "instalada: ${INSTALLED:-<ninguna>} · publicada: $TAG"

# --- 2. Descargar y verificar ------------------------------------------------------------------
if [[ -z "$LOCAL_TARBALL" ]]; then
  url_of() { jq -r --arg n "$1" '.assets[] | select(.name == $n) | .browser_download_url' "$WORK/latest.json"; }
  TAR_URL="$(url_of "$ASSET")"
  SUM_URL="$(url_of "$ASSET.sha256")"
  [[ "$TAR_URL" == https://* && "$SUM_URL" == https://* ]] || fail "el release $TAG no tiene $ASSET y $ASSET.sha256"
  # GitHub publica también el sha256 de cada asset en la API ("digest"); si está, se contrasta.
  API_DIGEST="$(jq -r --arg n "$ASSET" '.assets[] | select(.name == $n) | .digest // empty' "$WORK/latest.json")"
  log "descargando $ASSET"
  http_get "$TAR_URL" "$WORK/$ASSET" || fail "descarga fallida: $ASSET"
  http_get "$SUM_URL" "$WORK/$ASSET.sha256" || fail "descarga fallida: $ASSET.sha256"
fi

EXPECTED="$(awk 'NR==1 {print tolower($1)}' "$WORK/$ASSET.sha256")"
[[ "$EXPECTED" =~ ^[0-9a-f]{64}$ ]] || fail "$ASSET.sha256 no contiene un sha256 válido"
ACTUAL="$(sha256sum -- "$WORK/$ASSET" | awk '{print $1}')"
[[ "$ACTUAL" == "$EXPECTED" ]] || fail "sha256 no coincide para $ASSET (esperado $EXPECTED, obtenido $ACTUAL)"
if [[ -n "$API_DIGEST" && "$API_DIGEST" != "sha256:$ACTUAL" ]]; then
  fail "el sha256 no coincide con el digest que publica la API ($API_DIGEST)"
fi
log "sha256 verificado: $ACTUAL"

# El tarball viene de la red: nada de rutas absolutas, '..', enlaces ni ficheros especiales.
tar -tzf "$WORK/$ASSET" > "$WORK/list.txt" || fail "$ASSET no es un tar.gz válido"
if grep -Eq '(^/|(^|/)\.\.(/|$))' "$WORK/list.txt"; then fail "$ASSET contiene rutas absolutas o '..'"; fi
tar -tvzf "$WORK/$ASSET" > "$WORK/list-v.txt"
if cut -c1 "$WORK/list-v.txt" | grep -qv '^[-d]$'; then fail "$ASSET contiene enlaces o ficheros especiales"; fi
grep -Eq '^(\./)?index\.html$' "$WORK/list.txt" || fail "$ASSET no tiene index.html en la raíz"

if [[ "$DRY_RUN" == "1" ]]; then
  log "DRY_RUN: se instalaría $TAG en $RELEASES/$TAG y se repuntaría current; no se toca nada"
  exit 0
fi

# --- 3. Extraer a releases/<tag> ---------------------------------------------------------------
if [[ -f "$RELEASES/$TAG/index.html" ]]; then
  log "releases/$TAG ya existe (instalada antes); solo se repunta current"
else
  STAGE="$WORK/extract"
  mkdir -p "$STAGE"
  tar -xzf "$WORK/$ASSET" -C "$STAGE" --no-same-owner --no-same-permissions
  # Permisos explícitos: Nginx (otro usuario) tiene que poder leer (el 403 por chmod 700 ya pasó).
  find "$STAGE" -type d -exec chmod 755 {} +
  find "$STAGE" -type f -exec chmod 644 {} +
  chmod 755 "$STAGE"
  rm -rf -- "${RELEASES:?}/$TAG"   # restos de un intento anterior sin index.html
  mv -T -- "$STAGE" "$RELEASES/$TAG"
  log "extraída en releases/$TAG"
fi

# --- 4. Repuntar current (atómico) -------------------------------------------------------------
# mv -T sobre un enlace es rename(2): Nginx ve la versión vieja o la nueva, nunca un hueco.
ln -sfn -- "releases/$TAG" "$WEB_ROOT/.current.tmp"
mv -T -- "$WEB_ROOT/.current.tmp" "$CURRENT"
log "current -> releases/$TAG (antes: ${INSTALLED:-<ninguna>})"

# --- 5. Conservar las últimas KEEP releases -----------------------------------------------------
# Los tags empiezan por fecha y hora (AAAAMMDD-HHMMSS-sha), así que el orden alfabético es el cronológico.
ACTIVE="$(installed_version)"
mapfile -t ALL < <(find "$RELEASES" -mindepth 1 -maxdepth 1 -type d -printf '%f\n' | sort -r)
kept=0
for rel in "${ALL[@]}"; do
  if [[ "$rel" == "$ACTIVE" ]]; then continue; fi
  if (( kept < KEEP - 1 )) && [[ "$rel" =~ $TAG_RE ]]; then kept=$((kept + 1)); continue; fi
  rm -rf -- "${RELEASES:?}/$rel"
  log "borrada releases/$rel"
done
log "hecho: $TAG instalada"
