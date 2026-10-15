# Proposal — c-06-galeria-trabajos

## Why

Los visitantes necesitan ver fotos de trabajos reales por categoría antes de consultar por WhatsApp (US-004); sin prueba visual, la confianza y la conversión caen. C-02/C-09 ya proveen el seed real (10 trabajos, ≥2 por categoría) y C-03 el sistema visual — es el momento de exponer la galería en el home.

## What Changes

- Nueva sección home `/#destacados`: galería filtrable Y agrupada por las 4 categorías reales (`espejos`, `muebles-de-vidrio`, `instalaciones-y-aberturas`, `servicios-y-reparaciones`).
- Nuevo componente `Gallery.astro` + isla JS mínima: filtro por categoría (botones nativos `aria-pressed`) y lightbox con teclado (Esc/arrows, foco atrapado/devuelto) y swipe táctil (mecánica probada en `demos/demo.html` §§destacados — referencia, no copia ciega).
- Progressive enhancement: grilla SSR visible sin JS; el filtro/lightbox solo mejoran.
- Seed real primero; entradas con `ilustrativa:true` muestran insignia visible "Imagen ilustrativa" (RN-CN-01, PA-02).
- Gate de build: ninguna categoría de la galería se renderiza vacía (RN-CAT-04); toda foto con `alt` descriptivo + `loading="lazy"` salvo la destacada (RN-CN-02, R5).
- Sin precios ni medidas en ningún texto de la galería (R2); sin lógica de servidor (R1).

## Capabilities

### New Capabilities

- `galeria`: galería de trabajos por categoría en home con filtro, lightbox accesible, badges ilustrativos y gates de contenido en build.

### Modified Capabilities

- (ninguna — `content-model` ya cubre el seed de `trabajos`; `design-system` y `foundation` se consumen sin cambiar requisitos.)

## Impact

- Afecta: `src/components/Gallery*.astro` (nuevo), `src/pages/index.astro` (nueva sección), estilos vía tokens `@theme` existentes (sin `tailwind.config.ts`).
- No afecta: `src/content/trabajos/*` (seed intacto), `DatosContacto`/WhatsApp (C-04), mapas/contacto (C-07), SEO/deploy (C-08).
- Paralelismo: sin colisión con C-05 (`catalogo*`, `/categoria/*`) ni C-07 (`Header/Footer/MapEmbed`); único archivo compartido es `index.astro` por secciones distintas — coordinar orden de inserción en apply.
- Nota de alcance: `CHANGES.md [C-06]` nombra la sección `/#trabajos`; este change estandariza en `/#destacados` según mockup demo v3 aprobado (binding del task). El diseño contempla alias/compatibilidad si C-07/C-08 enlazan al ancla antiguo.
