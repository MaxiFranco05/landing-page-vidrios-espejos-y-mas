# Proposal — c-05-catalogo-categorias-productos

## Why

El sitio hoy tiene modelo de contenido real (C-02 + C-09), identidad visual (C-03) y CTAs de WhatsApp (C-04), pero la home sigue siendo un placeholder sin catálogo navegable: el visitante no puede orientarse por categoría ni elegir un producto para consultar (US-001, US-002). Este change cierra esa brecha y desbloquea C-08 (SEO/deploy).

## What Changes

- `CategoryCard.astro`: tarjeta de categoría (portada, nombre, descripción, link a `/categoria/{slug}`), anchor nativo, `alt` descriptivo, lazy-load en portadas fuera del primer viewport.
- `ProductCard.astro`: tarjeta de producto (foto, nombre, descripción corta, `WhatsAppButton` variant `product` reutilizado de C-04 con mensaje por producto); sin precios ni medidas en ningún texto.
- `index.astro` §Lo que hacemos (teaser): grilla con las 4 categorías reales ordenadas por `orden`, cada una enlaza a `/catalogo` (ancla por categoría) y a su `/categoria/{slug}`.
- `catalogo.astro` (NUEVA página): catálogo completo agrupado por las 4 categorías reales, cada grupo con link a `/categoria/{slug}`.
- `categoria/[slug].astro` (NUEVA ruta): `getStaticPaths` desde la colección `categorias` (prerender estático, R1), página por categoría con sus productos ordenados; slug inexistente → 404.
- Todo responsive mobile-first en tema claro y oscuro con tokens `@theme` existentes; sin lógica de servidor ni endpoints (R1); número de WhatsApp solo desde `DatosContacto` (R4).

## Capabilities

### New Capabilities

- `catalogo`: navegación del catálogo — teaser en home, página de catálogo completo, páginas por categoría con `getStaticPaths`, tarjetas de categoría/producto con CTA WhatsApp por producto, garantías R2/R5.

### Modified Capabilities

(none — `content-model` ya expone el seed real DD-09, `design-system` provee tokens/temas sin cambiar requisitos, `whatsapp-contact` provee el builder/botón sin cambiar requisitos; este change solo los consume.)

## Impact

- Archivos nuevos: `src/components/CategoryCard.astro`, `src/components/ProductCard.astro`, `src/pages/catalogo.astro`, `src/pages/categoria/[slug].astro`; sección teaser en `src/pages/index.astro`.
- Reusa sin modificar: `src/lib/whatsapp.ts` (`buildProductLink`), `src/components/WhatsAppButton.astro`, `src/layouts/BaseLayout.astro`, tokens `src/styles/global.css`, colecciones `categorias`/`productos` + `datos-contacto`.
- Sin nuevas dependencias (pins Tailwind 4.1.12 + Vite 5.4.21 intactos); build sigue 100% estático prerenderizado.
- Habilita C-08 (titles/metas por categoría, sitemap con las 4 rutas) y convive en paralelo con C-06/C-07 (distintas páginas/componentes, sin colisión de archivos).
