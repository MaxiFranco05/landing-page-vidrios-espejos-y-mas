# Proposal

## Why

La visita que quiere llamar o llegar al local hoy no tiene dónde hacerlo: el header solo muestra marca + tema y el home solo tiene un CTA genérico placeholder. C-07 cierra la visita (US-005 resto, US-006, Flujo 2) con contacto y ubicación siempre a mano, antes del cierre SEO de C-08.

## What Changes

- `Header` con `tel:` + WhatsApp visibles (reusando `WhatsAppButton`/`buildTelLink` de C-04, sin reconstruirlos) + `ThemeToggle` existente.
- `Footer` con NAP completo: dirección "Estrada 912, Gral. Alvear, Mendoza", zona "Gral. Alvear y alrededores", horarios "Lun–Vie 8–19, Sáb 8–13, Dom cerrado", `tel:` + WhatsApp genérico.
- Secciones home `/#contacto` (tel + WhatsApp + horarios) y `/#ubicacion` (dirección en texto + `MapEmbed` + botón "Cómo llegar").
- Nuevo `MapEmbed.astro`: `iframe` con la `maps_embed_url` REAL de `src/data/datos-contacto.json` (reusar, no inventar) + enlace "Abrir en Google Maps" a `maps_url` derivada; si el iframe se bloquea (adblock/offline), link + dirección en texto siguen funcionando.
- Botón "Cómo llegar" abre `maps_url` en pestaña nueva; la task de verificación confirma que abre el destino correcto (ficha "Vidrios, espejos y mas, Estrada 912").
- Menú mobile como isla JS mínima (única isla nueva): abre/cierra por botón nativo, enlaza a `/#contacto` y `/#ubicacion`, sin JS el menú son anclas visibles.
- NAP idéntico en header, `/#contacto`, `/#ubicacion` y footer (lente local-business para C-08).

## Capabilities

### New Capabilities

- `contacto-ubicacion`: contacto y ubicación que cierran la visita — header/footer con tel+WhatsApp, secciones `/#contacto` y `/#ubicacion`, embed de Maps con progressive enhancement, botón "Cómo llegar" verificado y menú mobile mínimo.

### Modified Capabilities

- Ninguna. Se reutilizan los patrones de `whatsapp-contact` (botón/tel, fuente única del número) y los tokens/temas de `design-system` sin cambiar sus REQUIREMENTS; `content-model`/`foundation` no cambian (los valores ya existen en `datos-contacto.json`).

## Impact

- Afecta: `src/layouts/BaseLayout.astro` (header/footer), `src/pages/index.astro` (secciones `/#contacto`, `/#ubicacion`), nuevos `src/components/MapEmbed.astro`, `ContactInfo.astro` (o equivalente), `MobileMenu.astro` (isla mínima), `src/lib/datos-contacto.ts` como única fuente (R4).
- Reutiliza sin modificar: `WhatsAppButton.astro`, `src/lib/whatsapp.ts` (`buildGenericLink`, `buildTelLink`), tokens `@theme` y `ThemeToggle` de C-03.
- Sin dependencias nuevas, sin endpoints ni SSR (R1); sin precios ni medidas (R2); tokens solo en `src/styles` (R3); sin hardcodear número/URLs (R4); iframe con `title` + lazy-load y toda imagen con `alt` (R5); sin cambios de contenido versionado.
- Paralelo seguro con C-05/C-06 (GATE 3): tocan secciones distintas del home; colisión solo en `BaseLayout`/`index.astro` — ante conflicto reportar, nunca sobrescribir.
