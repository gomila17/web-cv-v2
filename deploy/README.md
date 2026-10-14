# deploy/

Todo lo que hace falta para publicar el artefacto de `dist/` (ARCHITECTURE.md decisiones 6–8):

- Configuración de Nginx que sirve `current/` en la LXC dedicada (cabeceras, caché, 404, redirecciones de las URL antiguas).
- Unidades systemd de usuario sin privilegios (servicio + timer) y el script que descarga el último Release, lo extrae en `releases/<versión>` y repunta `current`; rollback repuntando el enlace.
- Notas de instalación sin datos de la infraestructura: nada de IPs, nombres de máquinas ni subdominios internos (se pasan por variables de entorno o ficheros locales no versionados).

El workflow de CI vive en `.github/workflows/` y también es de este subagente.
Quién lo toca: subagente de despliegue.
