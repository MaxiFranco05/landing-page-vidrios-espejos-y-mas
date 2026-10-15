# Tasks — c-06-galeria-trabajos

## 1. Galería SSR con gates de contenido

- [x] 1.1 Crear `src/components/Gallery.astro`: grupos por categoría con encabezado, figuras con `<img loading="lazy" width/height>` + `alt`, badge "Imagen ilustrativa" cuando `ilustrativa:true`, y `<dialog>` de lightbox con región `aria-live="polite"`; verificar con `npm run check` limpio.
- [x] 1.2 Cablear datos en `src/pages/index.astro`: `getCollection('trabajos')` agrupado por las 4 categorías, filtro `fotos.length>0`, `console.warn` + omisión del grupo vacío (RN-CAT-04), sección `<section id="destacados">` + ancla fantasma `<span id="trabajos">`; verificar con `npm run build` que `dist/index.html` contiene `#destacados` y ningún grupo vacío.
- [x] 1.3 Estilos con tokens `@theme` existentes (sin `tailwind.config.ts`): grilla, badge y controles en ambos temas con contraste ≥4.5:1 y `prefers-reduced-motion` sin animación; verificar manual en claro/oscuro + `dist/` sin CSS nuevo global fuera del componente.

## 2. Isla filtro + lightbox (patrón ThemeToggle)

- [x] 2.1 Filtro por categoría: botones nativos con `aria-pressed`, alternancia `hidden` por `data-categoria`, default "Todos" visible sin JS; verificar por teclado que solo la categoría elegida queda visible y `aria-pressed` acompaña.
- [x] 2.2 Lightbox `<dialog>`: abrir con `showModal()`, Esc/flechas, foco atrapado y devuelto al thumbnail, click en backdrop cierra, fallback a imagen directa sin `showModal`; verificar flujo completo solo con teclado + foco devuelto.
- [x] 2.3 Swipe táctil portado de `demos/demo.html` (umbral 40px, `touch-action: pan-y`, listeners `passive`, caption en `aria-live`); verificar en viewport móvil que el swipe cambia de foto y el scroll vertical sigue intacto.

## 3. Integración, contenido y verificación final

- [x] 3.1 Texto limpio: barrer títulos/descripciones/captions/alts de la sección contra precio/medidas (R2, RN-CAT-02) y confirmar cada `<img>` con `alt` no vacío (R5); verificar con inspección de `dist/index.html` (grep de `$|cm|mm|m²|precio` sin falsos positivos justificados).
- [x] 3.2 Verificación E2E manual: filtro por las 4 categorías, lightbox teclado + swipe, PE sin JS (grilla completa visible), doble tema, Safari iOS; verificar con `npm run check` + `npm run build` verdes y Lighthouse a11y ≥95 (decidir `fetchpriority` de la primera imagen según LCP medido).
- [x] 3.3 Punto de inserción documentado en `index.astro` (`<!-- C-06 -->`) sin tocar bloques de C-05/C-07 y sin commitear/pushear (R7); verificar con `git status` que solo cambian `Gallery.astro` + `index.astro` (+ estilos si aplican).

## Workflow follow-up

- Revisar artefactos y pedir apply explícito (`/opsx:apply c-06-galeria-trabajos`).
- Tras implementar, archivar con `/opsx:archive c-06-galeria-trabajos` y marcar `[x]` C-06 en CHANGES.md.
