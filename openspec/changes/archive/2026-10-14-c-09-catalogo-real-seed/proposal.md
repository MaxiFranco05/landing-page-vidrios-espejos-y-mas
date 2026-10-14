# Proposal — c-09-catalogo-real-seed

## Why

El seed archivado de C-02 usa 4 categorías SUPUESTAS (`vidrios-a-medida-dvh`, `espejos`, `estantes-comerciales`, `mesas-ratoneras`); el cliente entregó su catálogo real (DD-09, binding). Sin este re-seed, C-05/C-06/C-07 maquetarían sobre categorías que ya no existen.

## What Changes

- **REEMPLAZA** las 4 categorías del seed por las 4 reales: `espejos`, `muebles-de-vidrio`, `instalaciones-y-aberturas`, `servicios-y-reparaciones` (**BREAKING** para contenido: slugs viejos eliminados salvo `espejos`).
- **REEMPLAZA** los productos del seed por los 13 reales (6 + 2 + 2 + 3), con nombres sin medidas ni precios (R2).
- **REMAPEA** los 8 trabajos existentes a las categorías nuevas (mínimo 2 por categoría; placeholders con `ilustrativa: true` donde falte cobertura real — PA-02).
- **ELIMINA** entradas de productos/trabajos que referencien slugs viejos (`vidrios-a-medida-dvh`, `estantes-comerciales`, `mesas-ratoneras`).
- **ACTUALIZA** `CATEGORIA_SLUGS` en `src/lib/content-schemas.ts` y los tests `node:test` a los nuevos slugs/nombres.
- DatosContacto SIN CAMBIOS (singleton canónico vigente).

## Capabilities

### New Capabilities

(none — no new system behavior; replacement of seed content within existing model.)

### Modified Capabilities

- `content-model`: slugs de categorías, entradas de productos/trabajos y mínimos del seed cambian (reemplazo del seed supuesto por el catálogo real).

## Impact

- Afecta: `src/content/categorias/*`, `src/content/productos/*`, `src/content/trabajos/*`, `src/lib/content-schemas.ts` (`CATEGORIA_SLUGS`), `tests/categorias.test.mjs`, `tests/productos.test.mjs`, `tests/trabajos.test.mjs`, assets en `public/images/` (portadas/fotos nuevas o reutilizadas).
- No afecta: `foundation`, `design-system`, `whatsapp-contact` specs; `src/data/datos-contacto.json`; stack (Astro 4.16.19 + Tailwind v4 pineado — no tocar); Netlify.
- Dependencias: requiere C-02 archivado como base. Bloquea C-05/C-06/C-07 (consumen las categorías nuevas).
