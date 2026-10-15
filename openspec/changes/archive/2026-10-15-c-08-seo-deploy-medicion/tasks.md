# Tasks — c-08-seo-deploy-medicion

## 1. Copy deck local + pasada anti-slop de copy

- [x] 1.1 Redactar la tabla de copy (7 titles 50–60 chars keyword-front + 7 descriptions 150–160 con CTA + headings/CTA visibles) desde la voz del taller y verificar que ningún texto contiene precios, medidas, "Placeholder/Lorem" ni superlativos vacíos
- [x] 1.2 Pasar revisión anti-slop a todo el copy (reglas `no-ai-slop` inyectadas en el brief: sin "descubre/explora", sin superlativos vacíos, CTA nombra el resultado, voz del taller) y verificar con checklist firmado en el change que cada title/description/CTA fue revisado

## 2. SEO on-page en BaseLayout

- [x] 2.1 Crear `src/lib/seo.ts` (`buildSeo({title, description, path, image?, type?})` → canonical absoluto, OG con `og:locale=es_AR`, Twitter card) con tests `tests/seo.test.mjs` y verificar con `npm test` en verde
- [x] 2.2 Cablear `BaseLayout.astro` (canonical + OG + Twitter desde `buildSeo`, manteniendo anti-flash y `display=swap`) y verificar que el `<head>` de home renderiza todos los tags con URLs absolutas
- [x] 2.3 Aplicar titles/descriptions finales de la tabla 1.1 a home, catálogo, las 4 categorías y 404 y verificar que los 7 `title`/`description` son únicos y están en rango de longitud
- [x] 2.4 Añadir `public/robots.txt` (permite `/`, `Sitemap:` absoluto) e integrar `@astrojs/sitemap` (solo URLs canónicas, excluye 404) y verificar en `dist/` que `sitemap.xml` lista home+catálogo+4 categorías y `robots.txt` referencia al sitemap

## 3. JSON-LD LocalBusiness

- [x] 3.1 Renderizar bloque JSON-LD `Store` en home desde `DatosContacto`/env (nombre, dirección, teléfono, horarios, URL) con test de NAP visible == estructurado y verificar que el JSON parsea y ningún campo es inventado (sin reseñas/precios/coordenadas)
- [x] 3.2 (validación de schema offline en verde; Rich Results Test live pendiente de URL pública → ver 8.2) Validar el bloque con Rich Results Test / validación de schema y verificar cero errores de elegibilidad por sintaxis

## 4. Deploy Netlify final + env

- [x] 4.1 Extender `netlify.toml` (assets `/_astro/*` → `immutable` 1 año; HTML → revalidación ligera; redirect HTTP→HTTPS; documentar previews por PR y TODO PA-01) y verificar con `curl -I` post-deploy los `Cache-Control` diferenciados
- [x] 4.2 Fijar `site:` canónico en `astro.config.mjs` (temporal hasta PA-01, con comentario de migración en 1 commit) + añadir `PUBLIC_UMAMI_WEBSITE_ID` y `PUBLIC_SITE_URL` a `.env.example` sin valores reales y verificar que `astro check` sigue limpio y ningún ID real queda en código

## 5. Medición Umami

- [x] 5.1 Crear `src/lib/analytics.ts` (`track(name, data)` no-op sin `window.umami`; nombres: `whatsapp-product-click`, `whatsapp-generic-click`, `tel-click`, `maps-click`) con tests `tests/analytics.test.mjs` y verificar con `npm test` en verde
- [x] 5.2 Inyectar script Umami `defer` solo cuando `PUBLIC_UMAMI_WEBSITE_ID` está definido (ID nunca literal, R4) y verificar que sin env la página renderiza sin script ni errores de consola
- [x] 5.3 Atribuir eventos en CTAs existentes (producto con `producto`+`categoria`, genérico/header, `tel:`, "Cómo llegar") sin cambiar ningún `href` de C-04/C-07 y verificar con clics simulados que cada evento lleva su payload y origen de página

## 6. Performance + Lighthouse

- [x] 6.1 Diferir Maps embed (`loading="lazy"`, facade con link "Cómo llegar" como contenido principal), preload de hero/fuente crítica y chequeo de purga Tailwind y verificar que el LCP mobile <2.5s y CLS <0.1 en build local
- [ ] 6.2 Correr Lighthouse mobile sobre build de producción y verificar ≥90 en performance, accesibilidad y SEO; registrar desvíos como issues del change si no se alcanza

## 7. Gates visual, a11y y contenido

- [x] 7.1 Pasar revisión anti-slop visual (reglas `impeccable` inyectadas en el brief: modo Persuade, identidad 37B preservada, pasadas acotadas + compact rules `design-taste-frontend`/`frontend-design` — fotos protagonistas, sin hero+3-cards, sin estilos de plantilla) en home/catálogo/1 categoría en claro/oscuro y mobile/desktop y verificar cero FAILs del checklist con top-3 fixes aplicados
- [x] 7.2 (Lighthouse a11y live pendiente de CLI/URL → residual en gates.md) Pasar finish de accesibilidad WCAG 2.2 AA (foco visible con teclado, contraste AA ambos temas, `aria-labels` de CTAs intactos) y verificar Lighthouse a11y ≥90 y recorrido de teclado completo
- [x] 7.3 Ejecutar checklist PA-06 real-vs-placeholder por categoría/producto/trabajo (REAL o PLACEHOLDER marcado "imagen ilustrativa"; OG usa foto real) y verificar que ningún placeholder figura como definitivo ni entra al sitemap como contenido final

## 8. Verificación final pre-producción

- [x] 8.1 Correr `npm run check` limpio + `npm run build` + `npm test` en verde y verificar `dist/` con `sitemap.xml`, `robots.txt`, canonicals/OG/JSON-LD presentes y cero IDs hardcodeados (`grep` por dígitos del número/IDs)
- [ ] 8.2 Verificar post-deploy (Netlify desde `main`): build verde, HTTPS forzado, headers de caché, Rich Results sin errores, eventos Umami llegando al dashboard y Lighthouse mobile ≥90 registrado como evidencia de cierre

## Workflow follow-up

- Archivar el change con `/opsx:archive c-08-seo-deploy-medicion` una vez revisados los artefactos y la evidencia de 8.2.
- Al resolverse PA-01: change mínimo de dominio (actualizar `site:`, rebuild, re-verificar canonicals/sitemap) — estimado <1h.
- Nota: `impeccable` y `no-ai-slop` ya instaladas globalmente (verificadas por el orquestador); sus reglas se inyectan en el brief del apply.
