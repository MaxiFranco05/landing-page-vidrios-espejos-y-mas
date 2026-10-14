# Tasks — c-02-content-model-seed

## 1. Config base de colecciones

- [x] 1.1 Verificar runner de tests y presencia de `zod` (inspeccionar `package.json`; si falta `zod`, instalar pin compatible con Astro 4 sin tocar el pin `tailwindcss 4.1.12` / `vite 5.4.21` de DD-08) y verificar con `npm ls zod vite`
- [x] 1.2 Crear `src/content.config.ts` con `defineCollection` para `categorias`, `productos`, `trabajos` según D1–D4 y verificar con `npm run check` verde

## 2. DatosContacto singleton

- [x] 2.1 Crear `src/content/datos-contacto.json` con valores canónicos (whatsapp `5492625445223`, dirección, zona, horarios, maps_url, maps_embed_url) y su schema de validación, y verificar con `npm run check` que el JSON valida
- [x] 2.2 Añadir tests de DatosContacto (valores canónicos + rechazo de formato con `+`/espacios) y verificar que el runner los pasa

## 3. Seed de categorías

- [x] 3.1 Crear los 4 archivos de `src/content/categorias/` (slugs RN-CAT-01, descripción, portada en `public/images/`, `orden`) y verificar con `npm run check` que resuelven
- [x] 3.2 Añadir tests de categorías (4 slugs exactos, kebab-case, unicidad, orden) y verificar que el runner los pasa

## 4. Seed de productos

- [x] 4.1 Crear ≥1 producto por categoría en `src/content/productos/` (slug único, ref válida, `descripcion_corta`, foto con `alt`, `destacado`, `orden`; sin precio ni medidas) y verificar con `npm run check` verde
- [x] 4.2 Añadir tests de productos (ref a categoría inexistente rechazada, foto sin `alt` rechazada, precio/medida rechazados por clave o patrón, slug duplicado rechazado) y verificar que el runner los pasa

## 5. Seed de trabajos

- [x] 5.1 Crear ≥2 trabajos por categoría en `src/content/trabajos/` (título, ref válida, fotos con `alt`, `ilustrativa: true` donde aplique PA-02) y verificar con `npm run check` verde
- [x] 5.2 Añadir tests de trabajos (mínimo 2 por categoría, trabajo sin fotos rechazado, placeholder exige `ilustrativa` + `alt` que lo indica) y verificar que el runner los pasa

## 6. Verificación integral

- [x] 6.1 Ejecutar suite completa de tests + `npm run check` y verificar cero fallos antes del build
- [x] 6.2 Ejecutar `npm run build` y verificar que `dist/` se genera con el contenido del seed y sin exponer `knowledge-base/`/`discovery/`

## Workflow follow-up

- Archivar el change con `/opsx:archive c-02-content-model-seed` tras revisión.
- Marcar `[x]` la entrada [C-02] en CHANGES.md al archivar.
