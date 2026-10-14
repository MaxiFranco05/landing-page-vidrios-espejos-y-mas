# Proposal — c-02-content-model-seed

## Why

El scaffolding de C-01 dejó las carpetas `src/content/{categorias,productos,trabajos}` vacías: sin schemas Zod no hay contrato de contenido y sin seed no hay nada que maquetar. C-02 fija ese contrato y provee el seed inicial para desbloquear C-04 (WhatsApp) y el contenido visible (C-05/C-06/C-07).

## What Changes

- Define schemas Zod de Content Collections en `src/content.config.ts` (Astro 4: `defineCollection` + `z` desde `astro:content`):
  - `categorias`: `slug` kebab-case único, `nombre`, `descripcion`, `imagen_portada` (`image()`), `orden`.
  - `productos`: `slug` único, `nombre`, `categoria` (ref a slug de categoría), `descripcion_corta`, `fotos[]` (cada foto con `src` + `alt` descriptivo obligatorio), `destacado`, `orden`.
  - `trabajos`: `titulo`, `categoria` (ref), `fotos[]` con `alt`, `descripcion?`, `fecha?` (coercible a fecha).
  - `datos-contacto.json` validado (whatsapp internacional sin `+`, teléfono visible, dirección, zona, `maps_url`, `maps_embed_url`, horarios).
- Reglas de validación en build (parte del schema, no runtime): sin campos de precio ni medidas en productos (RN-CAT-02), toda foto exige `alt` no vacío (RN-CN-02), slugs únicos y kebab-case, refs de `categoria` deben existir.
- Seed versionado en git: 4 categorías (`vidrios-a-medida-dvh`, `espejos`, `estantes-comerciales`, `mesas-ratoneras` — RN-CAT-01), `datos-contacto.json` con valores canónicos (whatsapp `5492625445223`, "Estrada 912, Gral. Alvear, Mendoza", zona, horarios), ≥1 producto y ≥2 trabajos por categoría (mínimo 4 productos + 8 trabajos).
- Fotos: reales donde haya (PA-02/SU-01 parciales); faltantes como placeholder local en `public/images/` marcado `ilustrativa: true` + `alt` que lo indica (RN-CN-01, RN-CAT-04 como gate).
- Tests de validación de schemas (casos: slug duplicado, foto sin `alt`, ref a categoría inexistente, producto con precio/medida rechazado).

## Capabilities

### New Capabilities

- `content-model`: contrato del modelo de contenido — schemas de colecciones, reglas de validación en build y seed mínimo por categoría. Comportamiento durable del sistema que C-05/C-06/C-07 consumen como fuente de verdad.

### Modified Capabilities

- Ninguna. `foundation` no cambia (la estructura que usa ya la declaró C-01).

## Impact

- Archivos nuevos: `src/content.config.ts`, `src/content/datos-contacto.json`, entradas en `src/content/{categorias,productos,trabajos}/`, imágenes en `public/images/`, tests de schemas.
- Sin cambios en `BaseLayout`, páginas, estilos ni `netlify.toml` (C-01 intacto).
- Sin dependencias nuevas si `astro:content` + `zod` ya vienen con Astro 4 (verificar en design; si falta `zod`, pin coherente con DD-08).
- Desbloquea: C-04 (número desde `DatosContacto`), C-05/C-06/C-07 (leen estas colecciones).
