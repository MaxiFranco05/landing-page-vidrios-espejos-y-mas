# Proposal — c-01-foundation-setup

## Why

No existe aún ningún proyecto ejecutable en el repo: solo hay knowledge-base, CHANGES.md y openspec. Sin un scaffolding Astro + Tailwind + Netlify que compile en limpio, ningún change posterior (C-02 content-model, C-03 design-system, resto del camino crítico C-01 → C-02 → C-04 → C-05 → C-08) puede implementarse ni verificarse. Las decisiones DD-01 (Astro SSG), DD-02 (Netlify), DD-03 (sin backend) y DD-08 (Tailwind v4 CSS-first) ya están tomadas y solo falta materializarlas en un baseline construible.

## What Changes

- Inicializa proyecto Astro 4.x + TypeScript 5.x con `astro.config.mjs` (SSG, `site:` temporal `*.netlify.app` por PA-01), `tsconfig.json`, `package.json` con scripts `dev/build/preview/check`.
- Crea estructura de carpetas según `08_arquitectura_propuesta.md`: `src/{content/{categorias,productos,trabajos},components,layouts,pages,styles,lib}` + `public/images/` (vacía con `.gitkeep`).
- Integra Tailwind CSS v4 CSS-first (sin `tailwind.config.ts`): `@import "tailwindcss"` en `src/styles/global.css`, tokens iniciales vacíos vía `@theme` (R3), importado desde `BaseLayout`.
- Crea `src/layouts/BaseLayout.astro` mínimo (slot + `<head>` + import de tokens), sin estilos finales (los define C-03).
- Crea `src/pages/index.astro` placeholder mínimo (prueba que el routeo funciona; el home real lo construyen C-04/C-05/C-06/C-07).
- Crea `netlify.toml` (build `npm run build`, publish `dist`) y `.env.example` con `PUBLIC_WHATSAPP_NUMBER`, `PUBLIC_PHONE_DISPLAY`, `PUBLIC_ADDRESS`, `PUBLIC_MAPS_URL`, `PUBLIC_MAPS_EMBED_URL` (valores de ejemplo, sin hardcodear el real en código — R4).
- Garantiza que `knowledge-base/` y `discovery/` quedan fuera del build/publicado (no copiados a `dist/`, no ruteados).
- Verificación: `npm run check` (`astro check`) limpio y `npm run build` genera `dist/` no vacío, desplegable como preview de Netlify.

## Capabilities

### New Capabilities

- `foundation`: scaffolding estático construible y desplegable — estructura Astro, pipeline Tailwind v4 CSS-first, layout base, config Netlify, variables públicas de contacto y garantía SSG sin servidor (R1). Es el contrato base que todos los changes posteriores asumen.

### Modified Capabilities

- Ninguna (repo sin specs previas; `openspec list --specs` vacío).

## Impact

- **Código nuevo**: `astro.config.mjs`, `tsconfig.json`, `package.json`, `netlify.toml`, `.env.example`, `src/layouts/BaseLayout.astro`, `src/pages/index.astro`, `src/styles/global.css`, carpetas `src/content/*`, `src/components`, `src/lib`, `public/images/`.
- **Sistemas afectados**: build local (`astro check`/`build`) y deploy Netlify (preview desde git). Sin backend, sin endpoints, sin cambios en DNS (PA-01 sigue abierta, se usa URL temporal).
- **Breaking**: ninguno (greenfield, sin código previo).
- **Desbloquea**: C-02 (collections + seed) y C-03 (design-system) en paralelo (GATE 1 del roadmap).
- **No incluye**: diseño visual final (C-03), modelo de contenido con schemas Zod (C-02), CTAs WhatsApp (C-04), ni contenido real (PA-02 sigue abierta; este change solo deja carpetas + placeholder estructurado).
