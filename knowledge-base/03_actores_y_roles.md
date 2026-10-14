# Actores y Roles — Vidrios, espejos y mas

## Actores del sistema

| Actor | Descripción | Cómo interactúa |
|---|---|---|
| Visitante | Vecino, comerciante u obrero que llega por Google, Maps o recomendación | Navega, mira galería, sale a WhatsApp/teléfono/Maps |
| Dueño del negocio | Administra el contenido (en v1, a través del desarrollador) | Pide altas/bajas de productos y fotos por WhatsApp al dev |
| Googlebot | Indexa el sitio para búsquedas locales | Lee HTML estático (ideal para SSG) |

En v1 no hay usuarios registrados, ni roles internos, ni panel. El "dueño" es un actor de proceso manual (flujo F3 en `07_flujos_principales.md`).

## RBAC — Matriz de permisos

| Rol | Recurso | Permisos |
|---|---|---|
| Visitante (todos) | Páginas, catálogo, galería, contacto | Lectura |
| Visitante (todos) | Admin / edición de contenido | — (no existe en v1) |

Sin autenticación en v1. Si en v2 entra un admin o CMS externo, esta matriz se revisa.

## Rutas públicas

Todas las rutas son públicas (no hay auth):

- `/` — home (propuesta de valor, categorías, trabajos destacados, contacto, acceso a Maps).
- `/categoria/vidrios-a-medida-dvh`
- `/categoria/espejos`
- `/categoria/estantes-comerciales`
- `/categoria/mesas-ratoneras`
- Secciones por ancla en home: `/#trabajos`, `/#contacto`, `/#ubicacion`.
