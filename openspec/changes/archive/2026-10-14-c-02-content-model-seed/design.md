# Design — c-02-content-model-seed

## Context

C-01 dejó `src/content/{categorias,productos,trabajos}/` vacías (solo `.gitkeep` en `public/images`), sin `src/content.config.ts`, y `.env.example` con valores de ejemplo no operativos. Astro es 4.16.19 (`astro:content`, `defineCollection`, `z` re-exportado). La KB autoritativa: `04_modelo_de_datos.md` (entidades), `05_reglas_de_negocio.md` (RN-CAT-01/02/04, RN-CN-01/02), `08_arquitectura_propuesta.md` (Content Collections), `10_preguntas_abiertas.md` (PA-02 fotos parciales). Ver specs en `specs/content-model/spec.md`.

## Goals / Non-Goals

**Goals:**

- Contrato Zod compilable por `astro check` + `astro build` que rechace en build: precio/medida, foto sin `alt`, slug duplicado/no-kebab, ref rota.
- Seed mínimo versionado (4 categorías + datos-contacto + 4 productos + 8 trabajos) con placeholders marcados donde aplique PA-02.
- Tests de validación de schemas ejecutables sin depender del build completo.

**Non-Goals:**

- Maquetado de catálogo/galería (C-05/C-06), links WhatsApp (C-04), tema visual (C-03), SEO (C-08).
- Migración de fotos reales definitivas (PA-02 sigue abierta; el seed usa lo disponible + placeholder).
- Admin v2 / Decap (PA-04, fuera de v1 por DD-04).

## Decisions

### D1. `src/content.config.ts` (raíz de `src/`, convención Astro 4) con `defineCollection`

Por qué: Astro 4.16 resuelve `src/content.config.ts` (no `src/content/config.ts`); `astro check` valida tipos generados. Alternativa descartada: `src/content/config.ts` (convención Astro 5, no aplica y rompería la resolución en Astro 4).

### D2. Refs como `z.string()` + validación cruzada en tests, no `reference()`

Por qué: `reference()` de Astro exige formato de colección y complica el seed mínimo; un `slug` string + test "toda ref existe" da el mismo gate de build con mensajes de error más claros para el dev que edita archivos (flujo F3, RN-CAT-03). Alternativa descartada: `reference()` nativo (acopla el seed al loader interno y oscurece el error de ref rota).

### D3. Fotos como objeto `{ src: image(), alt: string.min(1), ilustrativa: boolean.default(false) }`

Por qué: `image()` de Astro optimiza y exige archivo real (gate RN-CAT-04: sin archivo no hay build), `alt` obligatorio codifica RN-CN-02, `ilustrativa` codifica RN-CN-01/PA-02 de forma consultable por C-06. Alternativa descartada: `string` de ruta (pierde optimización y permite fotos inexistentes).

### D4. Prohibición de precio/medida por ausencia de campo + test de rechazo

Por qué: Zod `strict()`/`strip` no puede prohibir lo que no modela si el frontmatter trae claves extra silenciosas; el gate real es un test que falla si cualquier producto contiene claves o patrones de precio/medida (`precio`, `price`, `$`, `medida`, `cm`, `mm`, `mts`, dimensiones tipo `AxB`). Alternativa descartada: solo `.strict()` (rechaza claves extra pero con error genérico y sin cubrir el valor dentro de descripciones).

### D5. `datos-contacto.json` + re-export tipado, env como override futuro

Por qué: el dato canónico vive en git (DD-04, RN-WA-03); `.env.example` ya declara las vars para C-04/C-07. El schema valida formato en build. Alternativa descartada: solo env vars (no versionado, rompe previews reproducibles).

### D6. Tests con el runner más liviano disponible (node:test o vitest si ya existe)

Por qué: evita añadir dependencias pesadas a un sitio estático; los tests importan los schemas Zod directamente sin levantar Astro. Decisión final del runner en la primera task de apply (inspeccionar `package.json`; si no hay runner, `node:test` nativo). Pin DD-08 intacto: no tocar `tailwindcss`/`vite`.

## Risks / Trade-offs

- [Riesgo] `zod` no está en `package.json` (Astro lo re-exporta pero el import directo puede faltar) → Mitigación: primera task verifica; si falta, `npm i -E zod@<compatible con Astro 4>` sin tocar el pin de vite/tailwind.
- [Riesgo] PA-02 sin respuesta: placeholders IA desbalancean categorías → Mitigación: `ilustrativa: true` + checklist en tasks para reemplazo 1:1 cuando lleguen fotos reales; C-06 filtra por ese flag.
- [Riesgo] Slug kebab-case roto a mano por el dev → Mitigación: regex en schema + test de duplicados; mensaje de error con el slug infractor.
- [Trade-off] Refs como string (no `reference()`) permiten typo hasta que corre el test → se acepta porque `astro check` + tests corren en cada build/CI futuro.

## Migration Plan

Sin migración: change aditivo sobre carpetas vacías. Rollback = revert del commit. Orden de apply: config → datos-contacto → categorías → productos → trabajos → imágenes → tests → `astro check` + `build`.

## Open Questions

- Ninguna que cambie specs o tasks. PA-02 (cobertura real de fotos) y el runner de tests se resuelven durante el apply sin alterar el contrato.
