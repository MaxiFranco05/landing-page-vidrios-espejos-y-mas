# Design — c-05-catalogo-categorias-productos

## Context

Ver proposal.md (Why) y specs/catalogo/spec.md (contrato). Estado actual: `index.astro` es un placeholder con CTA genérica; existen `BaseLayout` (temas + `lang="es"`), `WhatsAppButton` (variantes product/generic, R4), `buildProductLink`/`buildGenericLink` testeados, colecciones `categorias` (4 reales DD-09) + `productos` (13) + `datos-contacto`, tokens 37B en `global.css` (`@theme`, Tailwind v4 CSS-first). Restricciones: R1 (todo prerender, `astro check` limpio), R2 (sin precio/medida), R3 (sin `tailwind.config.ts`), R4 (número solo desde `DatosContacto`), R5 (alt + lazy), R7 (no commitear). Pins intactos: tailwindcss 4.1.12 + vite 5.4.21.

## Goals / Non-Goals

**Goals:**
- Catálogo navegable estático: teaser en home → `/catalogo` → `/categoria/[slug]`, todo prerenderizado y testeable con `node:test` + inspección de `dist/`.
- Reutilizar C-04 sin reconstruir: mismo builder y botón para los 13 CTAs por producto.
- A11y WCAG 2.2 AA desde el primer commit: anchors nativos, foco visible, headings, alts.

**Non-Goals:**
- Galería de trabajos (C-06), contacto/Maps (C-07), SEO/meta por página (C-08) — solo dejar ganchos (`title`/`description` por props en `BaseLayout`).
- Filtros client-side, búsqueda, paginación, carruseles JS: el catálogo es HTML estático sin islas.
- Cambios de contenido/seed: los 4 slugs y 13 productos se consumen tal cual.

## Decisions

### D1 — `getStaticPaths` desde `getCollection("categorias")`, cero JS cliente

`categoria/[slug].astro` exporta `getStaticPaths` mapeando cada entrada a `{ params: { slug }, props: { categoria } }` y resuelve productos con `getCollection("productos", p => p.data.categoria === slug)` ordenados por `orden`. Productos y categorías se leen en frontmatter (build-time), sin fetch en runtime ni islas. Alternativa descartada: SSR/`output: "server"` — violaría R1 y el deploy Netlify estático. Prerender explícito (`export const prerender = true`) como en el resto del sitio.

### D2 — Reusar `buildProductLink` + `WhatsAppButton variant="product"`, no reconstruir

`ProductCard` recibe `numero`/`telefonoVisible` ya resueltos del llamador (página) desde `datosContacto` y los pasa al botón; el mensaje cita solo el nombre (decisión vinculante de C-04). Alternativa descartada: nuevo helper con categoría en el mensaje — cambiaría el contrato `whatsapp-contact` y rompería sus tests; la categoría ya está visible en la página que contiene el CTA.

### D3 — `CategoryCard` y `ProductCard` como `.astro` puros con `<a>` nativo

Toda la tarjeta de categoría es un anchor (portada + nombre + descripción) para área táctil ≥48px sin JS; `ProductCard` es `<article>` con imagen + textos + `WhatsAppButton`. Sin lightbox ni hover-only: la info esencial visible sin interacción. Alternativa descartada: cards `<div>` con handler click — pierde semántica, teclado y menú contextual.

### D4 — Imágenes: `alt` del seed + `loading="lazy"` + `decoding="async"`, sin optimizador

Se usa `src`/`alt` del contenido tal cual (el seed ya trae alts descriptivos + flag `ilustrativa`); lazy en todo lo bajo el pliegue, eager solo en la primera portada del teaser. Sin `@astrojs/image` ni remote: los SVG/placeholders viven en `public/images`. Si una foto falta, el build falla por schema (RN-CAT-04 ya cubierto en content-model).

### D5 — Orden y anclas: `orden` numérico + `id="{slug}"` en `/catalogo`

`catalogo.astro` ordena categorías y productos por `orden` ascendente y marca cada grupo con `id` igual al slug, de modo que el teaser puede enlazar a `/catalogo#espejos` (deep-link) además de a `/categoria/{slug}`. Encabezados `h2` por grupo con link "Ver todo →" a la página dedicada.

### D6 — Anti-genérico dentro del sistema 37B

Teaser: grilla asimétrica anclada en fotos reales (portadas a distinto alto, sin "hero + 3 cards idénticas"); tipografía Fraunces + tokens existentes, sin nuevos colores ni gradientes/glass (house bans de design-system). Tema oscuro heredado de `BaseLayout` sin estilos ad-hoc.

## Risks / Trade-offs

- [Colisión con C-06/C-07 en `index.astro`] → Mitigación: este change solo añade la sección `id="hacemos"` con marcadores de comentario `<!-- C-05:Lo-que-hacemos -->`; C-06 (`#trabajos`) y C-07 (`#contacto`/`#ubicacion`) tocan secciones distintas; el orden de secciones se coordina en apply (teaser tras hero).
- [Nombres de producto futuros con medidas romperían R2 en silencio] → Mitigación: test de guarda que falla si el HTML del catálogo matchea patrones de medida/precio; documentado como deuda para un lint de contenido en C-08.
- [`ilustrativa: true` en portadas puede confundir como "foto real"] → Mitigación: `alt` ya lo indica ("Imagen ilustrativa de…") y C-06 define el badge visual; aquí no se inventa otro.
- [13 CTAs `target="_blank"` sin `rel`] → Mitigación: se hereda `rel="noopener"` del botón C-04; verificado por test de HTML.

## Migration Plan

Sin migración: páginas y componentes nuevos + una sección añadida a `index.astro`. Rollback = revert de esos archivos. Deploy: `npm run check` → `npm run build` → verificar `dist/catalogo/index.html` + 4 `dist/categoria/*/index.html` → preview Netlify. Sin cambios de env ni de `netlify.toml`.

## Open Questions

Ninguna que cambie specs o diseño: la única incógnita (fotos reales vs. placeholders PA-02) la resuelve C-06/C-08 con el checklist de contenido; este change funciona con ambos.
