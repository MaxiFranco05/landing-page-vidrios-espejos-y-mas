# Tasks — c-04-whatsapp-contact-ctas

## 1. Builders WhatsApp + tests unitarios

- [x] 1.1 Crear `src/lib/whatsapp.ts` (constantes de mensajes, `buildProductLink` / `buildGenericLink` / `buildTelLink` + validación con `WHATSAPP_RE`, número como parámetro) y verificar con `npm run check` limpio para ese módulo
- [x] 1.2 Añadir `tests/whatsapp.test.mjs` (fixture exacto "Espejo baño apaisado", mensaje genérico 42a, acentos/comillas/emoji, número inválido que lanza) y verificar con `npm test` verde
- [x] 1.3 Auditar seed contra R2 (nombres de producto con `contienePrecioOMedida()`, ej. "Espejo 40x20") y verificar: reporte de hallazgos o confirmación de cero casos; si hay casos, NO renombrar en silencio, elevar para enmienda

## 2. Componente WhatsAppButton.astro

- [x] 2.1 Crear `src/components/WhatsAppButton.astro` (variantes `product`/`generic`, `<a href>` nativo, texto "Pedir presupuesto" / "Consultar por otro trabajo", `aria-label` con producto, `min-h-[48px]`, `tel:` opcional) y verificar con `npm run check` limpio
- [x] 2.2 Verificar a11y del botón: foco visible por teclado, `aria-label` nombra el producto con texto visible genérico, sin div-buttons (inspección + `astro check`)

## 3. Integración home + sticky mobile + tel fallback

- [x] 3.1 Integrar CTA genérico + sticky mobile (`md:hidden`, mismo `datosContacto.whatsapp`, `tel:+5492625445223` visible) en `src/pages/index.astro` sin romper el layout y verificar con `npm run build` + inspección responsive mobile/desktop
- [x] 3.2 Verificar R4 por grep: ningún `.astro`/`.ts` (fuera de seed, tests y artifacts) contiene el literal `5492625445223`; todo número llega vía `datosContacto`

## 4. Verificación final

- [x] 4.1 Pasar gates del proyecto y verificar: `npm test` verde, `npm run check` cero errores, `npm run build` genera `dist/` sin endpoints (R1)
- [x] 4.2 Verificación manual de conversión y verificar: links wa.me abren WhatsApp Web (desktop) y app (mobile) con el mensaje exacto producto + genérico, y el `tel:` es visible como alternativa (RN-WA-04)

## Workflow follow-up

- Archivar el change tras revisión (`/opsx:archive c-04-whatsapp-contact-ctas`) y desbloqueo de C-05/C-07.
