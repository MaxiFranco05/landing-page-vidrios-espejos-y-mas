# Tasks — c-01-foundation-setup

## 1. Scaffolding Astro + TypeScript

- [x] 1.1 Inicializar `package.json` con `astro@^4`, `typescript@~5`, `@astrojs/check` y scripts `dev/build/preview/check`, y verificar con `npm install` exitoso sin errores
- [x] 1.2 Crear `astro.config.mjs` (SSG estático, `site:` temporal con `TODO(PA-01)`, plugin `@tailwindcss/vite`) + `tsconfig.json` (extends `astro/tsconfigs/strict`), y verificar con `npx astro --version` y lectura de ambos archivos
- [x] 1.3 Crear estructura `src/{content/{categorias,productos,trabajos},components,layouts,pages,styles,lib}` + `public/images/.gitkeep`, y verificar con `Get-ChildItem -Recurse src,public` mostrando todas las carpetas

## 2. Tailwind v4 + Layout base

- [x] 2.1 Instalar `tailwindcss@^4` + `@tailwindcss/vite@^4` y crear `src/styles/global.css` con `@import "tailwindcss"` + bloque `@theme` inicial documentado (sin `tailwind.config.ts`), y verificar con `Test-Path tailwind.config.*` = False y build CSS sin errores
- [x] 2.2 Crear `src/layouts/BaseLayout.astro` (`<html lang="es">`, `<head>` charset/viewport/title, import `global.css`, `<slot />`), y verificar renderizando `index.astro` y comprobando `<head>` + slot en el HTML
- [x] 2.3 Crear `src/pages/index.astro` placeholder (usa `BaseLayout`, heading + párrafo, sin diseño final) y verificar con `npm run dev` sirviendo `/` con status 200

## 3. Config Netlify + entorno + exclusiones

- [x] 3.1 Crear `netlify.toml` (`command = "npm run build"`, `publish = "dist"`) y verificar parseando el TOML y confirmando ambos valores
- [x] 3.2 Crear `.env.example` con las 5 `PUBLIC_*` (whatsapp/phone/address/maps_url/maps_embed_url) con valores de ejemplo y verificar con `Select-String` que las 5 claves existen y ningún `.astro` del scaffolding hardcodea `5492625445223` ni `wa.me`
- [x] 3.3 Verificar exclusión de `knowledge-base/` y `discovery/` tras `npm run build`: comprobar que `dist/knowledge-base` y `dist/discovery` no existen y ninguna ruta las sirve

## 4. Verificación integral del baseline

- [x] 4.1 Ejecutar `npm run check` (`astro check`) y verificar cero errores (R1) — gate obligatorio antes del build
- [x] 4.2 Ejecutar `npm run build` y verificar `dist/index.html` existe, no vacío, sin rutas SSR ni functions propias, listo para preview Netlify
- [x] 4.3 Documentar en el resumen de apply el `site:` temporal pendiente de PA-01 y el estado placeholder de `public/images/` pendiente de PA-02, y verificar que ambos `TODO` están comentados en `astro.config.mjs` y `public/images/.gitkeep`

## Workflow follow-up

- Archivar el change con `/opsx:archive c-01-foundation-setup` una vez que el apply esté verificado (check + build verdes).
- Desbloquea GATE 1 del roadmap: C-02 y C-03 pueden proponerse en paralelo tras el archive.
