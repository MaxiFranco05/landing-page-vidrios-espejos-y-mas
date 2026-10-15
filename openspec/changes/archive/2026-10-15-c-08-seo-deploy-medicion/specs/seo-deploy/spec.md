# Spec Delta — seo-deploy

## Purpose

Puesta en producción medible y posicionable del sitio: SEO local para "vidriería en Gral. Alvear", deploy final en Netlify y medición mínima de conversión sin backend.

## ADDED Requirements

### Requirement: Títulos y descripciones únicos por página

El sistema SHALL renderizar en cada página un `title` único de 50–60 caracteres con la keyword local al frente y una `meta description` única de 150–160 caracteres con CTA, sin texto placeholder.

#### Scenario: Home con keyword local al frente

- **WHEN** se renderiza `/`
- **THEN** su `title` empieza por la keyword local ("Vidriería en Gral. Alvear…") y su description describe oferta + CTA a WhatsApp

#### Scenario: Cada categoría con title propio

- **WHEN** se renderiza `/categoria/{slug}` para cada uno de los 4 slugs reales
- **THEN** su `title` y `description` nombran la categoría + localidad y difieren de las demás páginas

#### Scenario: Sin placeholders en metadatos

- **WHEN** se inspecciona el HTML de las 7 páginas (home, catálogo, 4 categorías, 404)
- **THEN** ningún `title` ni `description` contiene "Placeholder", "Lorem" ni el texto provisorio de C-01

### Requirement: Canonicals auto-referenciales

El sistema SHALL incluir en cada página un `link rel="canonical"` absoluto y auto-referencial construido desde la URL canónica del sitio.

#### Scenario: Canonical absoluto por página

- **WHEN** se renderiza cualquier página
- **THEN** su canonical es `SITE_URL + pathname` en minúsculas con guiones, sin query strings

#### Scenario: Sin contenido duplicado entre trailing-slash

- **WHEN** se comparan las variantes con y sin `/` final de una misma ruta
- **THEN** ambas declaran el mismo canonical sin barra final duplicada

### Requirement: Open Graph por página

El sistema SHALL renderizar tags Open Graph (`og:title`, `og:description`, `og:type`, `og:url`, `og:image`, `og:locale=es_AR`) y `twitter:card=summary_large_image` en cada página, con imagen absoluta existente.

#### Scenario: Home con OG completo

- **WHEN** se inspecciona el `<head>` de `/`
- **THEN** existen todos los tags OG con URLs absolutas y `og:image` apunta a un archivo real en `public/`

#### Scenario: Categoría con URL OG propia

- **WHEN** se renderiza `/categoria/{slug}`
- **THEN** `og:url` y `og:title` corresponden a esa categoría, no a la home

### Requirement: Sitemap y robots

El sistema SHALL exponer `/sitemap.xml` generado en build con solo URLs canónicas de páginas reales y `/robots.txt` que permite el crawl y referencia al sitemap.

#### Scenario: Sitemap con las 7 páginas reales

- **WHEN** se ejecuta el build y se lee `dist/sitemap.xml`
- **THEN** contiene home, catálogo y las 4 categorías con `lastmod`, sin slugs inexistentes ni URLs con query

#### Scenario: Robots permite y referencia

- **WHEN** se lee `/robots.txt`
- **THEN** no bloquea `/`, contiene `Sitemap: <SITE_URL>/sitemap.xml` y no expone rutas internas

#### Scenario: 404 fuera del sitemap

- **WHEN** se inspecciona el sitemap
- **THEN** la página 404 no figura como URL indexable

### Requirement: JSON-LD LocalBusiness veraz

El sistema SHALL renderizar un bloque JSON-LD `LocalBusiness` (subtipo más específico aplicable) en la home con NAP exacto —nombre, dirección, teléfono, horarios y URL— tomado de `DatosContacto`/env y consistente con el NAP visible.

#### Scenario: NAP estructurado coincide con visible

- **WHEN** se parsea el JSON-LD de `/`
- **THEN** `name`, `address`, `telephone`, `openingHours` y `url` existen y el texto de dirección/teléfono/horarios iguala al del header/footer

#### Scenario: Solo contenido veraz

- **WHEN** se valida el bloque contra el checklist PA-06
- **THEN** no contiene reseñas, precios, coordenadas ni fotos inventadas; todo campo describe contenido visible real

#### Scenario: Teléfono sin hardcodeo

- **WHEN** se inspecciona la fuente del JSON-LD
- **THEN** el número proviene de `DatosContacto`/env, nunca literal en el componente (R4)

### Requirement: Deploy Netlify final con caché y HTTPS

El sistema SHALL declarar en `netlify.toml` build `npm run build` + publish `dist`, `Cache-Control: public, max-age=31536000, immutable` para assets con hash, sin caché agresivo para HTML, HTTPS forzado y previews por PR; `site:` de Astro apunta a la URL canónica y PA-01 queda documentado.

#### Scenario: Headers de caché diferenciados

- **WHEN** se leen los headers de una respuesta de producción
- **THEN** los assets bajo `/_astro/` (con hash) llevan `immutable` de un año y los HTML no llevan `immutable`

#### Scenario: HTTPS y previews

- **WHEN** se revisa la config de deploy
- **THEN** HTTP redirige a HTTPS y cada PR genera deploy preview sin tocar producción

#### Scenario: PA-01 documentado sin bloquear

- **WHEN** el dominio definitivo sigue pendiente
- **THEN** `astro.config.mjs` usa la URL temporal como canónica y un comentario/TODO cita PA-01 con el único cambio requerido (actualizar `site:` + sitemap)

### Requirement: Medición Umami con eventos diferenciados

El sistema SHALL cargar Umami (script diferido, sin cookies) con `website ID` leído de `PUBLIC_UMAMI_WEBSITE_ID` en build —NUNCA hardcodeado— y registrar eventos de clic en CTAs WhatsApp (producto identificado vs. genérico), `tel:` y "cómo llegar".

#### Scenario: Script con ID por env

- **WHEN** se renderiza cualquier página con `PUBLIC_UMAMI_WEBSITE_ID` definido
- **THEN** el `<script defer>` de Umami incluye ese ID y ningún ID literal existe en el código

#### Scenario: Sin ID no rompe la página

- **WHEN** la variable de entorno está ausente (preview local sin analítica)
- **THEN** la página renderiza sin script y sin errores de consola por analítica

#### Scenario: Clic en producto se distingue del genérico

- **WHEN** un visitante hace clic en "Pedir presupuesto" de un producto vs. el CTA genérico del header
- **THEN** se registra `whatsapp-product-click` con `producto`+`categoria` vs. `whatsapp-generic-click`, respectivamente

#### Scenario: Llamada y cómo-llegar medidos

- **WHEN** un visitante toca el link `tel:` o "Cómo llegar"
- **THEN** se registra `tel-click` / `maps-click` con la página de origen

### Requirement: Umbrales Lighthouse y gates de contenido

El sistema SHALL alcanzar Lighthouse ≥90 en performance, accesibilidad y SEO en mobile sobre build de producción y superar el checklist real-vs-placeholder (PA-06) más las pasadas anti-slop visual y de copy antes de publicar.

#### Scenario: Lighthouse verde en mobile

- **WHEN** se audita el build de producción en viewport mobile
- **THEN** performance, accesibilidad y SEO puntúan ≥90 (LCP <2.5s, CLS <0.1, fuentes con `display=swap`, hero con preload, galería con lazy)

#### Scenario: Checklist PA-06 bloquea placeholders silenciosos

- **WHEN** se revisa cada categoría/producto/trabajo antes del deploy
- **THEN** cada item está marcado REAL o PLACEHOLDER; ningún placeholder se publica como definitivo y los ilustrativos llevan "imagen ilustrativa"

#### Scenario: Copy sin patrones de IA

- **WHEN** se revisan titles, descriptions, headings y CTAs visibles
- **THEN** pasaron la revisión anti-slop (sin superlativos vacíos, sin "descubre/explora", voz del taller) preservando la voz del negocio

#### Scenario: Visual sin plantilla genérica

- **WHEN** se revisan home, catálogo y una categoría en claro/oscuro y mobile/desktop
- **THEN** pasaron la revisión anti-slop visual (fotos como protagonistas, sin hero + 3 cards de plantilla) con contraste AA en ambos temas
