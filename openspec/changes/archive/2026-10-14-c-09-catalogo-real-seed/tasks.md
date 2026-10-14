# Tasks — c-09-catalogo-real-seed

## 1. Categorías reales

- [x] 1.1 Reescribir `src/content/categorias/espejos.json` (nombre "Espejos", orden nuevo) y crear `muebles-de-vidrio.json`, `instalaciones-y-aberturas.json`, `servicios-y-reparaciones.json` con portada en `/images/...`, `alt` ≥10 caracteres y `orden`; verificar con `npx tsx` o parse Zod que los 4 archivos validan contra `categoriaSchema`.
- [x] 1.2 Borrar `vidrios-a-medida-dvh.json`, `estantes-comerciales.json`, `mesas-ratoneras.json` y verificar con `grep -r "vidrios-a-medida-dvh\|estantes-comerciales\|mesas-ratoneras" src tests` que no quedan refs salvo tests a actualizar en §4.
- [x] 1.3 Proveer portadas para las 3 categorías nuevas (reutilizar/renombrar SVGs existentes o crear placeholders con `ilustrativa: true`) y verificar que cada `src` existe en `public/` y los `alt` ilustrativos contienen "ilustrativa".

## 2. Productos del catálogo real (13)

- [x] 2.1 Crear los 6 productos de `espejos` (slugs `espejo-rectangular`, `espejo-nube`, `espejo-redondo`, `espejo-redondo-grande`, `espejo-con-led`, `espejo-panoramico`) con nombres exactos del cliente, `descripcion_corta`, ≥1 foto con `alt`, `destacado` y `orden`; verificar que cada archivo valida contra `productoSchema` y `assertSinPrecioNiMedida` pasa.
- [x] 2.2 Crear los 2 productos de `muebles-de-vidrio` (`mesa-ratonera-de-cristal`, `vitrina-de-vidrio`) y los 2 de `instalaciones-y-aberturas` (`aberturas-de-aluminio`, `mampara-para-bano`) con el mismo contrato; verificar schema + gate R2 por archivo.
- [x] 2.3 Crear los 3 productos de `servicios-y-reparaciones` (`reparacion-de-vidrios-de-ventanas`, `reparacion-de-espejos-de-vehiculos`, `enmarcacion-de-logros-y-recuerdos`); borrar los 4 JSON viejos (`dvh-aberturas`, `espejo-bano`, `estante-vitrina`, `mesa-ratonera-clasica`); verificar que `productos/*.json` son exactamente 13 y todo `categoria` apunta a un slug real.

## 3. Trabajos remapeados (≥2 por categoría)

- [x] 3.1 Reasignar los 8 trabajos existentes al slug real más cercano (editar `categoria`, `titulo`/`descripcion`/`alt` si nombran categorías viejas) y verificar que ninguna ref apunta a slugs supuestos.
- [x] 3.2 Agregar trabajos placeholder con `ilustrativa: true` hasta llegar a ≥2 por cada una de las 4 categorías reales; verificar conteo por categoría y coherencia `ilustrativa`/`alt` con `validarCoherenciaIlustrativa`.

## 4. Schemas y tests

- [x] 4.1 Actualizar `CATEGORIA_SLUGS` en `src/lib/content-schemas.ts` a los 4 slugs reales (+ comentario RN-CAT-01/DD-09) y verificar que ningún otro shape del schema cambió.
- [x] 4.2 Actualizar `tests/categorias.test.mjs`, `tests/productos.test.mjs` (conteo 6/2/2/3) y `tests/trabajos.test.mjs` (slugs nuevos) manteniendo los casos negativos; verificar con `npm test` que el suite completo pasa (34+ tests en verde).
- [x] 4.3 Verificación integral: correr `npm run check` (`astro check` limpio) y `npm run build` (`dist/` no vacío); verificar `git status` muestra solo `src/content/`, `src/lib/`, `tests/`, `public/images/` y el change (R7: NO commitear ni pushear).

## Workflow follow-up

- Revisar artefactos y luego correr `/opsx:apply c-09-catalogo-real-seed` para implementar.
- Tras aplicar, archivar con `/opsx:archive c-09-catalogo-real-seed` (sincroniza `content-model`).
