# Proposal — c-10-testimonios-clientes

## Why

La landing ya muestra qué hace el taller (catálogo, trabajos, contacto) pero no **quién lo respalda**: US-008 (Épica 5) pide ver opiniones reales de clientes antes de consultar. El dueño proveyó 7 reseñas reales de Google Maps (PA-08 resuelta: contenido verbatim disponible, prohibido inventar o alterar textos). Sin esta sección, el home salta de destacados a contacto sin prueba social. La variante visual ya fue elegida por el usuario tras la demo (grid-inside-carousel, solo dots).

## What Changes

- Nueva sección home `/#opiniones` entre destacados (`/#destacados`) y contacto (`/#contacto`), con los 7 testimonios reales verbatim (nombre + 5★ + comentario + fuente "Google Maps").
- Variante **grid-inside-carousel con dots solamente** (sin flechas prev/next): en desktop grilla visible, en móvil carrusel de 1 visible con swipe; dots + teclado (flechas sobre el visor) + caption `aria-live`; `prefers-reduced-motion` respetado; dark mode completo con tokens 37B existentes.
- Mecánica adaptada de `demos/demo.html` (scroll-snap, umbral táctil 40px, `touch-action: pan-y`) — referencia, no copia ciega: sin flechas, con 7 items reales, sin badges "ejemplo".
- Datos: nueva fuente versionada en git (colección `testimonios` **o** archivo de datos tipado — decisión en design, patrón D5 estilo datos-contacto). Ratings: se muestra cada 5★ individual; **sin agregados inventados** (sin conteos "7 reseñas", sin promedios).
- Sin JS: las 7 tarjetas se ven como HTML estático (progressive enhancement, mismo contrato que galería).

## Capabilities

### New Capabilities

- `testimonios`: sección `/#opiniones` con prueba social real — datos versionados (7 reseñas verbatim), layout grid-inside-carousel con dots, navegación táctil/teclado, caption anunciada, honestidad de contenido (sin agregados), theming claro/oscuro y movimiento reducido.

### Modified Capabilities

_(ninguna — la decisión de almacenamiento vive en design; si se elige colección Content Collection se agregará delta `content-model`, si se elige archivo de datos tipado D5 el contrato vive íntegro en `testimonios`)_

## Impact

- `src/pages/index.astro`: inserta `<Testimonios/>` entre `<Gallery/>` y `#contacto` (zona propia, sin tocar bloques C-05/C-06/C-07).
- Nuevo: `src/components/Testimonios.astro` (+ isla `<script>` co-ubicada, patrón Gallery/ThemeToggle, sin `client:*`), fuente de datos (`src/data/testimonios.json` o colección + schema Zod), loader tipado si aplica.
- Reposo: tokens `@theme` existentes (R3 — sin colores nuevos), sin endpoints ni JS global nuevo (R1), sin precios/medidas (R2 — los textos verbatim ya verificados libres de ambos), sin fotos en tarjetas (R5 N/A — no hay imágenes).
- Deps: C-02/C-03/C-09 archivados (colecciones + tokens 37B + seed real). Bloquea: nada.
