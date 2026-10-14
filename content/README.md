# content/

Todo el texto y los datos de la web, como JSON plano (se lee con `JSON.parse`, sin dependencias).

| Fichero | Qué contiene |
|---|---|
| `es.json`, `en.json` | Diccionarios planos clave → texto, con **exactamente** las mismas claves. HTML en línea solo `em`, `strong`, `b`, `code`, `br`. Hueco permitido: `{years}`. |
| `facts.json` | Datos únicos y no traducibles: persona, enlaces, fechas de inicio, certificaciones (fecha exacta y URL de verificación), stack, formación, idiomas. Remite a claves con `"i18n"`. |

Reglas: esquema y convención de claves en `CONTRACTS.md` §2. Toda edición pasa `npm run check`. Nada de teléfono, IPs, nombres internos ni marcas `[FALTA]`/`[REVISAR]`. Fuente de los textos: `drafts/contenido-final.md`.

Quién lo toca: el integrador o un subagente de contenido. Las plantillas solo leen.
