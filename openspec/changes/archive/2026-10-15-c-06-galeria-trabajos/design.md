# Design — c-06-galeria-trabajos

## Context

Ver `proposal.md` (Why) y `specs/galeria/spec.md` (contrato). Estado actual: `src/pages/index.astro` es placeholder C-01 con solo bloque WhatsApp; el seed real existe (`src/content/trabajos/*.json`, 10 trabajos con `titulo/categoria/fotos[alt+ilustrativa]/descripcion?/fecha?`, ≥2 por categoría); `ThemeToggle.astro` fija el patrón de isla (botón nativo + `<script>` inline + `prefers-reduced-motion`); `demos/demo.html` §§destacados prueba miniaturas→imagen grande con teclado (flechas mueven foco+imagen) y swipe ≥40px con `touch-action: pan-y` — referencia de mecánica, no de markup final (la demo no tiene filtro ni lightbox modal). Restricciones: R1 (prerender total, `astro check` limpio), R3 (tokens `@theme`, sin config JS), R5/R6/R2, y paralelismo con C-05/C-07 (solo `index.astro` compartido, por secciones distintas).

## Goals / Non-Goals

**Goals:**

- Grilla SSR `/#destacados` filtrable/agrupada por las 4 categorías reales con gates RN-CAT-04 en build.
- Isla JS mínima y autocontenida (filtro + lightbox) siguiendo el patrón ThemeToggle; resto HTML puro.
- Lightbox accesible (Esc/flechas, foco atrapado/devuelto, `aria-live`) + swipe táctil portado de la demo.
- Badges "Imagen ilustrativa", `alt` + lazy, doble tema con tokens existentes.

**Non-Goals:**

- No rutas `/trabajos/*` ni paginación; no cambia el seed ni los schemas (C-02/C-09 intactos).
- No CTA WhatsApp por trabajo (eso es C-04/C-05); no SEO/JSON-LD (C-08); no mapas/contacto (C-07).
- No `tailwind.config.ts`, no dependencias nuevas, no CSS global nuevo fuera de tokens/componente.

## Decisions

### D1. `Gallery.astro` SSR + `<script>` de isla co-ubicado (patrón ThemeToggle)

Qué: un componente `src/components/Gallery.astro` recibe `trabajosPorCategoria` ya agrupados desde `index.astro` (`getCollection('trabajos')` + orden por categoría); renderiza filtro (4 botones + "Todos", nativos con `aria-pressed`), grupos con encabezado, figuras con `<img loading="lazy">` + badge condicional; un `<script>` al pie del componente conecta filtro y lightbox. Sin framework cliente, sin `client:*` más que el script inline.

Por qué sobre alternativas: `client:load` de framework añade runtime para ~60 líneas de DOM; el script co-ubicado es el patrón ya aceptado (ThemeToggle) y mantiene R1/prerender. Alternativa descartada: componente React/Svelte — sobredimensionado y rompe convención del repo.

### D2. Filtro por ocultado con `hidden` + realce SSR por defecto

Qué: sin JS todos los grupos visibles (PE); con JS el filtro alterna `hidden` por `data-categoria` y mueve `aria-pressed`. El estado "Todos" es el default SSR. Sin query-string: el filtro es efímero de sesión.

Alternativa descartada: rutas `/destacados?cat=` o secciones separadas — añade navegación/estado URL que US-004 no pide y complica el gate "sin secciones vacías".

### D3. Lightbox como `<dialog>` nativo con foco gestionado

Qué: un único `<dialog>` al final de la sección; abrir = poblar imagen/caption + `showModal()` + foco al botón cerrar; cerrar = `close()` + devolver foco al thumbnail. Flechas dentro del diálogo; `aria-live="polite"` en caption. Backdrop click cierra. Swipe portado de la demo (umbral 40px, `touch-action: pan-y`, listeners `passive`).

Por qué sobre custom `div role=dialog`: `<dialog>` da modal, Esc y backdrop gratis con menos código y mejor AT-soporte; el foco atrapado se implementa con guardas mínimas (la demo no tenía modal — aquí sí, por eso no se copia ciega).

### D4. Gate RN-CAT-04 en `index.astro`, no en el componente

Qué: el `getCollection` filtra trabajos con `fotos.length>0`; si una categoría queda en cero, su grupo no se emite y se `console.warn` en build con el slug. El componente asume grupos no vacíos.

Por qué: el gate es decisión de contenido/build (testeable en `astro build`), no de presentación.

### D5. Ancla `id="destacados"` + alias `id="trabajos"` oculto

Qué: la sección lleva `id="destacados"` (binding del mockup) y un ancla fantasma `<span id="trabajos">` para no romper enlaces que C-07/C-08 escriban contra el nombre de `CHANGES.md`. Costo: 1 línea; evita colisión entre changes paralelos.

### D6. Estilos con tokens `@theme` existentes + CSS de componente

Qué: grilla `repeat(auto-fill,minmax(240px,1fr))`, scroll-snap solo en lightbox móvil si hace falta; badge y controles con variables semánticas (`--surface-*`) para doble tema; `prefers-reduced-motion` desactiva transiciones. Sin nuevos tokens salvo que falte uno (entonces se añade a `global.css`, nunca config JS).

## Risks / Trade-offs

- [Colisión en `index.astro` con C-05/C-07] → Mitigación: esta change solo añade `<Gallery>` + import en una zona marcada `<!-- C-06 -->`; documentar punto de inserción en tasks; el merge es por secciones disjuntas.
- [Fotos SVG placeholder pesadas / CLS] → Mitigación: `width/height` explícitos + lazy; la featured del lightbox se precarga solo al abrir.
- [`<dialog>` en navegadores viejos] → Mitigación: PE — sin `showModal` el fallback abre la imagen directa (`<a href>` envolvente del thumbnail); test manual en Safari iOS.
- [Contraste del badge en tema claro] → Mitigación: badge con fondo semántico oscuro+texto claro verificado ≥4.5:1 en ambos temas (checklist en tasks).
- [Swipe vs scroll vertical] → Mitigación: mecánica exacta de la demo (`pan-y`, umbral 40px, solo eje X).

## Migration Plan

Sin migración: change aditivo. Rollback = revertir inserción en `index.astro` + borrar `Gallery.astro`. Verificación: `npm run check` limpio → `npm run build` → home con `/#destacados`, filtro, lightbox teclado/táctil, Lighthouse a11y ≥95. R7: no commitear/pushear.

## Open Questions

- Ninguna que cambie specs o tasks. Detalle diferible a apply: ¿la primera foto de "Todos" merece `fetchpriority="high"` como LCP? Decidir en apply midiendo Lighthouse (web-perf) — default: no, todo lazy.
