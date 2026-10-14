# Proposal — c-04-whatsapp-contact-ctas

## Why

La landing no vende ni cotiza en el sitio (RN-GL-01, DD-05): toda conversión comercial ocurre en WhatsApp. Sin CTAs con mensaje predefinido que identifique el producto, el visitante llega al chat con una consulta vacía y el negocio pierde calificación. Este change desbloquea la conversión del camino crítico (C-02 → C-04 → C-05).

## What Changes

- `src/lib/whatsapp.ts`: builders puros `buildProductLink(numero, producto, categoria?)` y `buildGenericLink(numero)` que generan links `https://wa.me/<numero>?text=<encodeURIComponent(mensaje)>`; más helper `buildTelLink()` para el fallback `tel:`.
  - Mensaje por producto (decidido en review, vinculante): `Hola Vidrios, espejos y mas! Quiero presupuesto de {nombre del producto}`. Ejemplo: `Espejo baño apaisado` → `...Quiero presupuesto de Espejo baño apaisado`.
  - Mensaje genérico (decisión 42a): `Hola Vidrios, espejos y mas! Quiero consultar por otro trabajo.`
  - Número destino: únicamente `DatosContacto.whatsapp` (`5492625445223`); NUNCA hardcodeado en componentes (R4 / RN-WA-03).
  - `tel:+5492625445223` (visible `+54 9 2625 44-5223`) siempre como alternativa (RN-WA-04).
- `src/components/WhatsAppButton.astro`: variantes `product` (texto visible "Pedir presupuesto", `aria-label` con nombre del producto) y `generic` ("Consultar por otro trabajo"); renderiza `<a href>` nativo, nunca div-button.
- CTA sticky en mobile en home (misma fuente del número, sin duplicar).
- Tests unitarios `node:test` (`tests/whatsapp.test.mjs`): acentos, comillas, emoji, producto con espacios, número inválido rechazado; verificación de que ningún componente hardcodea el número.
- R2 ENFORCED: sin precios ni medidas en contenido ni maquetado; los NOMBRES de producto también deben evitar medidas (ej. "Espejo 40x20" → "Espejo baño apaisado"). Si el seed contiene nombres con medidas, el apply lo reporta para enmendar R2 en vez de aceptarlo en silencio.

## Capabilities

### New Capabilities

- `whatsapp-contact`: construcción de links wa.me/tel: desde una sola fuente, variantes de botón WhatsApp (producto/genérica), CTA sticky mobile y fallback telefónico siempre visible.

### Modified Capabilities

- Ninguna. `foundation` (build estático, sin endpoints) y `content-model` (DatosContacto como fuente del número) se consumen sin cambiar sus requirements.

## Impact

- Nuevos: `src/lib/whatsapp.ts`, `src/components/WhatsAppButton.astro`, `tests/whatsapp.test.mjs`; CTA sticky integrado en home (`src/pages/index.astro`).
- Consume (sin modificar): `src/lib/datos-contacto.ts` + `src/data/datos-contacto.json` (C-02), Content Collections `productos`/`categorias` (el mensaje cita nombre + categoría).
- Prepara: C-05 (`ProductCard` reutiliza `WhatsAppButton` + builders), C-07 (header/footer reutilizan genérica + `tel:`).
- Sin backend, sin dependencias nuevas, sin cambios de deploy. R1/R4 aplican a todo el change.
