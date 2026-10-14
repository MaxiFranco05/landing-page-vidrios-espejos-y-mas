# Design — c-04-whatsapp-contact-ctas

## Context

C-02 dejó `src/lib/datos-contacto.ts` (re-export tipado de `datos-contacto.json`, única fuente del número) y schemas Zod puros en `src/lib/content-schemas.ts` testeables con `node:test` sin Astro. `src/components/` está vacío; `src/pages/index.astro` es el único punto de montaje del sticky. Ver proposal.md (Why) y `specs/whatsapp-contact/spec.md` (contrato). Restricciones: R1 (estático, `astro check` limpio), R4 (cero hardcodeo del número), R2 (cero precio/medida).

## Goals / Non-Goals

**Goals:**
- Builders puros y testeables sin Astro, reutilizables por C-05/C-07.
- `WhatsAppButton.astro` accesible (a11y skill) con variantes product/generic y CTA sticky mobile.
- `tel:` fallback siempre visible (RN-WA-04).

**Non-Goals:**
- Páginas de catálogo/categoría (C-05), header/footer/maps (C-07), tema claro/oscuro (C-03).
- Analytics de clics (C-08 SU-02: solo se deja `data-` hooks si son gratis, sin implementar medición).
- Cambios a schemas de contenido o al seed (si aparece medida en nombres, se reporta, no se migra acá).

## Decisions

### D1 — Builders puros en `src/lib/whatsapp.ts`, cero imports de `astro:content`

`buildProductLink(numero, nombreProducto)`, `buildGenericLink(numero)`, `buildTelLink(datosContacto)` + validador `assertNumeroWhatsApp()`. Mensajes como constantes exportadas (`MENSAJE_PREFIJO`, `MENSAJE_GENERICO`) para testear el texto exacto.
Rationale: mismo patrón que `content-schemas.ts` (Zod puro + `node:test`); evita levantar Astro en tests y permite reuso directo en C-05.
Alternativa descartada: helper dentro del `.astro` — no testeable y duplicado en cada tarjeta.

### D2 — Un solo `encodeURIComponent` sobre el mensaje completo

El builder compone el mensaje en claro y aplica `encodeURIComponent(mensaje)` una vez; base `https://wa.me/` + número validado `^\d{12,15}$` (reuso de `WHATSAPP_RE`).
Rationale: Flujo 1 exige encodeo de especiales; encodear una vez evita doble-encodeo de `%`. Tests cubren acentos/comillas/emoji.
Alternativa descartada: `URLSearchParams` — encodea `!` y espacios como `+`, WhatsApp lo acepta pero el fixture esperado se vuelve menos legible.

### D3 — El número entra como parámetro, nunca se importa dentro del builder

Firma `buildProductLink(numero: string, ...)`; los componentes resuelven `datosContacto.whatsapp` y lo pasan. El builder valida formato y lanza si es inválido.
Rationale: hace R4 testeable (grep de literales en componentes) y el builder queda agnóstico de la fuente (hoy JSON, mañana env `PUBLIC_WHATSAPP_NUMBER`).
Alternativa descartada: importar `datosContacto` dentro de `whatsapp.ts` — acopla lib a lib y oculta la fuente en tests.

### D4 — `WhatsAppButton.astro` con props `variant | productoNombre | categoria?`, `<a>` nativo

Props: `variant: 'product' | 'generic'`, `numero`, `productoNombre?`, `mostrarTel?: boolean`. Texto visible fijo ("Pedir presupuesto" / "Consultar por otro trabajo"); `aria-label` compone producto cuando el visible es genérico. Clases Tailwind v4 con tokens existentes; `min-h-[48px]` en mobile (web-design-guidelines).
Rationale: `<a href>` preserva semántica, teclado y menú contextual; C-05 reutiliza el componente por producto sin copiar markup.
Alternativa descartada: botón JS con `window.open` — rompe sin JS, peor a11y, innecesario en sitio estático.

### D5 — Sticky mobile como instancia del mismo componente, no uno nuevo

En `index.astro`: `<div class="sticky bottom-... md:hidden">` con `WhatsAppButton variant="generic">` + link `tel:` compacto. Sin isla JS (cero interactividad requerida — static-first, skill astro).
Rationale: un solo componente = un solo lugar donde evoluciona el estilo/copy; el sticky es posicionamiento, no comportamiento.
Alternativa descartada: componente `StickyCTA` separado — duplicaría variantes y tests.

### D6 — Tests `tests/whatsapp.test.mjs` con `node:test`, importando TS vía transpilación ligera o espejo JS

El repo usa `node --test tests/*.test.mjs` sin TS-loader. Opción preferida: `whatsapp.ts` escrito sin sintaxis exclusiva de TS en runtime (tipos borrables) + test que importa el `.ts` vía `node --experimental-strip-types` si el Node del CI lo soporta; fallback: lógica en `.ts` + test que duplica fixtures de URLs esperadas. El apply decide según `node --version`, con gate `npm test` verde.
Rationale: respeta el runner existente de C-02 sin agregar dependencias.
Alternativa descartada: vitest/jest — dependencia nueva para un change BAJO.

## Risks / Trade-offs

- [Riesgo] Node del entorno no soporta `--experimental-strip-types` → test no puede importar `.ts` → Mitigación: D6 con fallback a fixtures; el apply lo verifica primero con `node --version`.
- [Riesgo] Seed con nombres con medidas ("Espejo 40x20") pasa el gate actual (el regex cubre `\d+x\d` en descripciones, pero el nombre viene de datos) → Mitigación: task de auditoría con `contienePrecioOMedida()` sobre nombres; si falla, se reporta para enmendar R2/C-02, no se silencia.
- [Riesgo] Colisión con C-03 (paralelo): ambos tocan `index.astro`/tokens → Mitigación: C-04 solo añade el bloque sticky con clases Tailwind estándar; el rebase visual lo resuelve C-05/C-07.
- [Trade-off] Mensaje por producto cita solo `{nombre}` (decisión de review) y no `{nombre + categoría}` de US-003/RN-WA-01 → se acepta: la review es vinculante; la categoría puede añadirse en C-05 si el copy lo pide, sin romper builders (parámetro opcional previsto).

## Migration Plan

Sin migración: change aditivo, sin rutas ni schemas afectados. Rollback = revert del commit. Verificación: `npm test`, `npm run check`, `npm run build`, más check manual wa.me (desktop Web + mobile app) y grep de `5492625445223` fuera de seed/tests/artifacts.

## Open Questions

- Ninguna que bloquee specs o tasks. Queda para C-05: ¿el mensaje por producto sumará la categoría (`...de {nombre} ({categoria})`)? El builder lo soporta con parámetro opcional sin cambiar este spec.
