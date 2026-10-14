# Design — c-09-catalogo-real-seed

## Context

See proposal.md (Why). Estado actual: C-02 archivado con 4 categorías supuestas y `CATEGORIA_SLUGS` viejo en `src/lib/content-schemas.ts`; `src/content/{categorias,productos,trabajos}/` con slugs viejos; 8 trabajos y 4 productos del seed; tests `node:test` (34/34) atados a los slugs viejos; `public/images/` con SVGs placeholder por categoría. Restricciones: R2 (sin medidas/precios en nombres ni textos), R4 (número único desde DatosContacto — no se toca), R6 (foto obligatoria por entrada), R1 (estático, `astro check` limpio). Stack pineado (Astro 4.16.19, tailwindcss 4.1.12, vite 5.4.21) — no tocar.

## Goals / Non-Goals

**Goals:**
- Reemplazar el 100% del seed supuesto por el catálogo real con refs íntegras.
- Mantener verdes schemas Zod + tests `node:test` + `astro check` + build con `dist/` no vacío.
- Dejar el terreno listo para C-05/C-06/C-07 (slugs estables).

**Non-Goals:**
- Maquetado de home/catálogo/galería (C-05/C-06/C-07).
- Fotos reales del cliente ni textos comerciales finales (PA-02/PA-06 siguen abiertas; placeholders marcados).
- Cambios en DatosContacto, WhatsApp links, tema o deploy.

## Decisions

- **D1 — Reescritura de archivos, no migración con alias.** Borrar los JSON de categorías/productos/trabajos con slugs viejos y crear los nuevos (`espejos`, `muebles-de-vidrio`, `instalaciones-y-aberturas`, `servicios-y-reparaciones`). Alternativa (mantener redirects/alias de slugs) descartada: es contenido estático sin URLs externas indexadas todavía (PA-01 pendiente) y los alias romperían RN-CAT-01 ("exactamente 4").
- **D2 — `espejos` se conserva, el resto se crea.** El slug `espejos` ya existe y coincide con el real: se reescribe su contenido (nombre "Espejos", orden nuevo) y se reutiliza su portada si existe. Los otros 3 slugs viejos se eliminan con sus archivos.
- **D3 — Productos: 13 archivos nuevos con slugs derivados del nombre.** p. ej. `espejo-rectangular`, `espejo-nube`, `mesa-ratonera-de-cristal`, `aberturas-de-aluminio`, `reparacion-de-vidrios-de-ventanas`. Nombres de producto EXACTOS del catálogo del cliente, sin agregar dimensiones (R2: "Espejo redondo grande" lleva "grande" porque es parte del nombre dado, no una medida).
- **D4 — Trabajos: remapeo temático + placeholders.** Los 8 existentes se reasignan al slug real más cercano (espejos→`espejos`, mesas→`muebles-de-vidrio`, ventanas/DVH→`instalaciones-y-aberturas`, vitrinas/estantes→`muebles-de-vidrio` o servicios según foto); donde una categoría quede con <2, se agregan placeholders con `ilustrativa: true` y `alt` con "ilustrativa". Ningún trabajo conserva slug viejo.
- **D5 — Schemas: solo cambia `CATEGORIA_SLUGS`.** Los shapes Zod no cambian (ya codifican RN-CAT-02/04, RN-CN-01/02); se actualiza la constante y su comentario. Los gates de ref rota y precio/medida en tests siguen vigentes sin cambios de lógica.
- **D6 — Tests: actualizar expectativas, no relajar gates.** `categorias.test.mjs` (slugs exactos + orden), `productos.test.mjs` (conteo por categoría 6/2/2/3), `trabajos.test.mjs` (≥2 por slug nuevo). Los casos negativos (kebab-case, strict, precio/medida, ilustrativa) se mantienen.

## Risks / Trade-offs

- [Riesgo] Nombres de producto del cliente podrían esconder medidas ("panorámico", "grande") → Mitigación: gate `assertSinPrecioNiMedida` corre sobre el seed nuevo; "grande/panorámico" no matchean patrones (son calificativos, no dimensiones) y R2 los admite como parte del nombre dado.
- [Riesgo] Faltan fotos reales para 13 productos + portadas (PA-02) → Mitigación: reutilizar SVGs existentes renombrados o duplicados como placeholder con `ilustrativa: true`; el build y R6 quedan verdes y las fotos reales entran después sin cambiar slugs.
- [Riesgo] C-05/C-06/C-07 en curso podrían referenciar slugs viejos → Mitigación: este change va ANTES (bloquea a los tres); verificar con `grep` que ningún `.astro`/test referencie slugs viejos salvo los archivos a reemplazar.
- [Trade-off] Borrar historial del seed supuesto pierde trazabilidad en archivos → aceptado: el change archivado y este delta documentan el reemplazo (DD-09).

## Migration Plan

1. Crear categorías/productos/trabajos nuevos + assets; borrar archivos con slugs viejos.
2. Actualizar `CATEGORIA_SLUGS` + tests; correr `npm test` (34+ tests), `astro check`, `astro build` (verificar `dist/` no vacío).
3. Rollback: `git checkout` de `src/content/`, `src/lib/`, `tests/`, `public/images/` (R7: sin commit/push — todo queda en working tree hasta pedido explícito).

## Open Questions

- Ninguna que bloquee: PA-02 (cobertura real de fotos) y PA-06 (textos finales) se resuelven con contenido posterior sin cambiar slugs ni este plan.
