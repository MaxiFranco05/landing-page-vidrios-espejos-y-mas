# Proposal — c-08-seo-deploy-medicion

## Why

El sitio está completo y navegable (C-01…C-07 archivados) pero no es encontrable ni medible: sin SEO local no posiciona "vidriería en Gral. Alvear", sin `netlify.toml` final el deploy carece de headers/HTTPS documentados, y sin medición mínima (SU-02) el dueño no sabe si la landing genera consultas. C-08 es el cierre a producción del camino crítico.

## What Changes

- SEO local en las 7 páginas (home, catálogo, 4 categorías, 404): titles únicos ~50–60 caracteres con keyword al frente ("vidriería en Gral. Alvear"), descriptions únicas ~150–160 caracteres con CTA, canonicals auto-referenciales, Open Graph (title/description/image/locale `es_AR`), `robots.txt` (permite crawl + ref a sitemap) y `sitemap.xml` generado en build solo con URLs canónicas.
- JSON-LD `LocalBusiness` (subtipo más específico aplicable, p. ej. `Store`/`LocalBusiness`) en home con NAP exacto desde `DatosContacto`/env: nombre, dirección "Estrada 912, Gral. Alvear, Mendoza", teléfono, horarios "Lun–Vie 8–19, Sáb 8–13", URL canónica. Solo contenido visible y veraz.
- `netlify.toml` final: build `npm run build` + publish `dist` (sin cambios), headers de caché para assets hasheados (`Cache-Control: public, max-age=31536000, immutable`) y HTML sin caché agresivo, HTTPS forzado, previews por PR; `site:` de `astro.config.mjs` apuntando a la URL canónica. PA-01 (dominio definitivo vs `*.netlify.app`) queda documentado como pendiente del dueño, no bloquea el change.
- Medición mínima con Umami Cloud (PA-07 decidida, sin cookies): script diferido + eventos de clic en CTAs WhatsApp (producto identificado vs. genérico), `tel:` y "cómo llegar", con `website ID` leído de `PUBLIC_UMAMI_WEBSITE_ID` en build — NUNCA hardcodeado (R4 extensivo). Sin backend, sin servidor (R1).
- Verificación: Lighthouse ≥90 en performance/accesibilidad/SEO en mobile sobre build de producción; `astro check` limpio antes de cada build (R1); checklist real-vs-placeholder (PA-06) que bloquea publicar textos/fotos provisorias como definitivas; pasadas anti-slop visual y de copy como gates de aceptación.
- Sin precios ni medidas en ningún contenido nuevo (R2); sin `tailwind.config.ts`, tokens solo en `@theme` (R3); toda imagen nueva con `alt` + lazy fuera del primer viewport (R5); ninguna categoría/producto publicado sin foto (R6, ya cubierto); sin commits/push sin pedido explícito (R7); commits conventional sin co-autoría IA (R8).

## Capabilities

### New Capabilities

- `seo-deploy`: posicionamiento local + deploy final + medición mínima. Cubre metadatos por página/categoría, sitemap/robots/canonicals, JSON-LD LocalBusiness, headers y HTTPS de Netlify, wiring Umami con eventos diferenciados, umbrales Lighthouse y checklist de contenido real vs. placeholder.

### Modified Capabilities

_(ninguna — C-05/C-06/C-07/C-04 exponen el contenido y los CTAs; este change solo los describe/mide sin cambiar sus REQUIREMENTS. Los headers de Netlify y `site:` final se especifican como requirements nuevos de `seo-deploy`, no como edición de `foundation`.)_

## Impact

- Archivos tocados en apply: `src/layouts/BaseLayout.astro` (+ `src/lib/seo.ts` nuevo), `astro.config.mjs` (`site:` final), `netlify.toml` (headers), `public/robots.txt`, sitemap vía integración Astro, `src/lib/analytics.ts` (nuevo, Umami) + wiring en CTAs existentes, `.env.example` (`PUBLIC_UMAMI_WEBSITE_ID`, `PUBLIC_SITE_URL`).
- Dependencias nuevas: `@astrojs/sitemap` (única añadida; Umami es script externo, sin paquete). Pins `tailwindcss 4.1.12` + override `vite 5.4.21` intactos (DD-08).
- Sistemas externos: Netlify CDN (deploy desde `main`, previews por PR), Umami Cloud (cuenta del usuario, ID por env), Google (indexación + Rich Results, sin GMB en v1 por fuera de alcance).
- Riesgos: PA-01 sin resolver → canónicos/sitemap apuntan a URL temporal hasta que el dueño defina dominio (documentado, reversible en un commit); PA-06 → si hay placeholders, se publican marcados "imagen ilustrativa"/texto provisorio o se excluyen del sitemap según checklist.
