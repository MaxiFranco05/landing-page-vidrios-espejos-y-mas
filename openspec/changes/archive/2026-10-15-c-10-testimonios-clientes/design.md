# Design — c-10-testimonios-clientes

## Context

Ver `proposal.md` (Why / What Changes). Estado actual: `src/pages/index.astro` compone Hero → `#hacemos` → `<Gallery/>` (`#destacados` + alias `#trabajos`) → `#contacto`/`#ubicacion`; no existe sección de opiniones. Patrones vigentes a reutilizar: isla con `<script>` co-ubicado sin `client:*` (Gallery, ThemeToggle), datos tipados D5 (`src/data/*.json` + schema Zod en `src/lib/content-schemas.ts` + loader `src/lib/*.ts`, cf. datos-contacto/seo-copy), tokens `@theme` 37B (R3), mecánica táctil probada en `demos/demo.html` (umbral 40px, `pan-y`, dots + `aria-live`, `prefers-reduced-motion`). Textos verbatim con tildes y signos `!!!` — el JSON debe preservarlos tal cual (UTF-8, sin reescritura).

## Goals / Non-Goals

**Goals:** sección `/#opiniones` con las 7 reseñas verbatim; variante elegida (dots-only, sin flechas); isla accesible reutilizando mecánica de la demo; datos versionados con gate de build; theming claro/oscuro con tokens existentes.

**Non-Goals:** traer reseñas vía API de Google (fuente estática versionada); agregados/conteos/promedios; avatares o fotos en tarjetas; flechas prev/next; tocar bloques C-05/C-06/C-07 o el `demo.html`; cambios en specs existentes (el contrato vive íntegro en la capacidad nueva `testimonios`).

## Decisions

**D1 — Datos: archivo tipado D5, no colección.** `src/data/testimonios.json` (array de 7 objetos `{nombre, calificacion: 5, comentario, fuente: "Google Maps"}`) + `testimonioSchema` en `src/lib/content-schemas.ts` + loader `src/lib/testimonios.ts` que parsea con Zod (mismo patrón que `datos-contacto.ts`/`seo-copy.ts`, ejecutable en `node:test` sin Astro). Alternativa descartada: colección `testimonios` — sobredimensionada (sin imágenes ni refs; ningún gate RN-CAT/RN-CN aplica) y obligaría a un delta `content-model` innecesario.

**D2 — Componente `Testimonios.astro` con isla co-ubicada.** SSR renderiza las 7 tarjetas (`figure > blockquote + figcaption`, estrella con `role="img"`); el `<script>` final del archivo implementa dots + teclado + swipe, patrón Gallery (~economía de ~60 líneas al no haber flechas ni lightbox). Sin `client:*`, sin framework cliente, sin JS global (R1).

**D3 — Mecánica adaptada de la demo, sin flechas.** Visor `<ol class="testi-visor" tabindex="0">` con `grid-auto-flow: column / 100%` + `scroll-snap-type: x mandatory` en móvil y grilla de 3 columnas en ≥720px (breakpoint de la demo); 7 dots (`aria-pressed`, `aria-label "Mostrar opinión N de X"`, 44px mín.); caption `<p aria-live="polite">` con "Mostrando opinión N de 7"; teclado FlechaDer/Izq con wrap; swipe con umbral 40px y `touch-action: pan-y`; `matchMedia('(prefers-reduced-motion: reduce)')` → scroll `auto` + CSS que anula transiciones y `scroll-snap`. La demo queda como referencia: no se copia el bloque de flechas ni los badges "ejemplo".

**D4 — Gate verbatim en tests, no solo en schema.** El schema valida forma (7 entradas, `calificacion` 5, comentario no vacío, fuente exacta); un test `node:test` fija los 7 strings verbatim byte a byte (PA-08: cualquier edición del texto rompe el build). El gate de "sin precio/medida" se reutiliza (`assertSinPrecioNiMedida`) aunque los textos ya se verificaron limpios.

**D5 — Inserción quirúrgica en `index.astro`.** `<Testimonios testimonios={testimonios} />` entre el bloque C-06 y la sección `#contacto`, con comentarios de zona `<!-- C-10 ... -->` como los de C-05/C-06. Sin props de número/WhatsApp (esta sección no convierte, solo respalda).

**D6 — Estilos solo con tokens existentes.** Tarjetas y dots usan las vars de superficie ya empleadas por Gallery (`--surface-bg/text/borde/acento`, `--radius-*`); estrella en color acento; alternancia sutil par/impar como la demo solo si no introduce tokens nuevos. Encabezado propuesto: "Lo que dicen los clientes" (mismo que la demo evaluada; honestidad: subtítulo que indique fuente Google Maps sin afirmar totales).

## Risks / Trade-offs

- [Caracteres verbatim] Tildes, comillas y `!!!` pueden corromperse al editar → Mitigación: JSON UTF-8 + test byte-a-byte; no reescribir textos a mano, copiar del change context.
- [7 dots en móvil estrecho] La fila de dots puede desbordar → Mitigación: `flex-wrap: wrap` + 44px táctil (ya probado en demo con 3; wrap lo escala).
- [`scrollIntoView` + snap] En algunos navegadores el scroll suave compite con el snap → Mitigación: `block: nearest, inline: start` como en la demo; con `reduced-motion`, `behavior: auto`.
- [Grilla desktop con 7 items] 3+3+1 deja una tarjeta sola en la última fila → Mitigación: aceptado (grilla fluida, sin placeholders ni reordenamientos); la demo ya establece el lenguaje visual.
- [Sin fotos] Tarjetas solo-texto con menos peso visual que la galería → Mitigación: tarjetas con fondo de superficie + estrella acento; no inventar avatares (honestidad primero).

## Migration Plan

Sin migración: change aditivo. Rollback = revertir el commit del apply (la sección es un bloque independiente en `index.astro`). Orden de apply: datos+schema+loader+tests → componente → inserción en home → `astro check` + build + Lighthouse manual.
