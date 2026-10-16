# Design

## Context

Ver `proposal.md` (Why). Estado actual observado: `src/pages/index.astro:50-55` renderiza `<main>` sin clase de contenedor (h1 pelado + placeholder C-01); `MapEmbed.astro:70-75` fija `aspect-ratio: 16/10; width: 100%` sin cota (gigante a desktop ancho); `BaseLayout` solo acota el CTA del header (`max-width: 20rem`). Composición objetivo: `demos/demo.html` "Nueva propuesta" (hero asimétrico titular + CTA + foto protagonista, línea de zona, filete de acento). Restricciones: R1 (estático + `astro check` limpio), R2 (sin precios/medidas), R3 (tokens solo `@theme`, paleta 37B intacta), R4 (contacto/mapas solo desde `datosContacto`), R5 (alt + lazy donde aplique; hero eager), R7 (no commitear).

## Goals / Non-Goals

**Goals:** home acotado y centrado; hero real estático que convierta a WhatsApp; mapa compacto sin cambiar su contrato; guarda de regresión del frontmatter; re-verificación claro/oscuro + mobile/desktop.

**Non-Goals:** fotos reales de trabajos (PA-02), copy final con sign-off (PA-06, este change deja draft + checkpoint), dominio (PA-01), cambios en testimonios/galería/catálogo, tokens nuevos o retoque de 37B, nueva instrumentación analítica (los `data-umami-event` existentes se conservan donde apliquen).

## Decisions

- **D1 — Contenedor: clase `.contenedor` en `src/styles/global.css` (~70rem / 1120px, padding lateral, `margin-inline: auto`).** Alternativa: utilidades Tailwind arbitrarias (`max-w-[70rem]`) en cada página — descartada porque el contenedor es comportamiento durable del layout y merece un solo lugar (además el change puede extenderlo a `catalogo`/`categoria/[slug]` sin repetir literales). Solo tokens/espaciado existentes; sin colores nuevos. `index.astro` envuelve su `<main>` (o secciones) con la clase; header/footer a full-width (sus fondos a sangre son intencionales).
- **D2 — Hero estático, cero JS nuevo.** Composición tomada de la "Nueva propuesta" del demo (titular + filete de acento + propuesta de valor + CTA + foto protagonista en grilla asimétrica 2-col en desktop, apilado en mobile). Sin isla: el CTA es el `WhatsAppButton` genérico existente (C-04). La línea de zona ("Vidriería · Gral. Alvear, Mendoza") se conserva como señal local — el demo con esa línea ya tuvo visto bueno del dueño; si en revisión molesta el house-ban de eyebrows, se quita sin tocar specs (es copy, no requisito).
- **D3 — Imagen del hero: `public/images/categorias/espejos.jpg` (default, a confirmar por el dueño en revisión).** Alternativas: `muebles-de-vidrio.jpg` (pesa ~391KB, la más pesada) o `servicios-y-reparaciones.jpg` (~108KB, la más liviana pero menos representativa del frente del negocio). `espejos.jpg` (~185KB) equilibra representatividad (el demo propone un espejo como protagonista) y peso; se sirve con el patrón de imagen existente del proyecto en eager (es LCP del home). Sin assets nuevos, sin `alt` inventado: alt describe lo visible.
- **D4 — Mapa compacto solo con CSS en `MapEmbed.astro` (sin cambio de props ni markup funcional).** Cota de ancho (tarjeta centrada, ~48-56rem) + altura máxima (el 16/10 actual se reemplaza por aspect más apaisado o `max-height` con `object-fit`-equivalente del iframe) à la densidad de la referencia La Plata. Dirección en texto + "Abrir en Google Maps" intactos en DOM; validación `throw` de props vacías intacta. No se toca `contacto-ubicacion` (contrato preservado → sin MODIFIED).
- **D5 — Test `tests/frontmatter.test.mjs` (Node built-in, patrón `node --test` existente).** Escanea `src/**/*.astro`, extrae el frontmatter (entre los primeros `---`), localiza comentarios `//` y `/* */` y falla si contienen un literal `<tag>` (`/<[a-zA-Z][^>]*>/`). El test vive en `.mjs`, así que por construcción nunca se auto-infringe (resuelve la "única excepción" del requisito sin lógica especial). Cubre la causa raíz 2026-10-15 (un `<head>` dentro de un comentario del frontmatter rompió dev).
- **D6 — Copy del hero en voz de taller, draft con reglas no-ai-slop.** Concreto y portable (Estrada→26 de Julio, Gral. Alvear, WhatsApp), sin throat-clearing ni claims inventados; el h1 conserva el nombre del negocio (SEO local C-08 intacto: titles/metas/JSON-LD no se tocan). Draft propuesto en tasks; sign-off del dueño en revisión (checkpoint, ver Riesgos).

## Risks / Trade-offs

- [Copy provisorio sin sign-off] → Mitigación: checkpoint explícito en revisión + demo visual previa al apply; PA-06 sigue dueño del sign-off final.
- [Imagen de hero pesada para LCP] → Mitigación: default `espejos.jpg` (~185KB, no la más pesada); eager + dimensiones; re-verificar Lighthouse mobile en tasks (gate C-08 ≥90 como referencia, sin bloquear por décimas atribuibles a red).
- [Contenedor ~70rem pelea con la grilla asimétrica C-05] → Mitigación: la grilla C-05 vive DENTRO del contenedor; su `first-child` a doble ancho sigue funcionando; verificación visual en ambos breakpoints.
- [Falso positivo del test frontmatter (ej. `<` en comparaciones dentro de comentarios)] → Mitigación: el patrón exige forma de etiqueta (`<letra…>`); un caso documentado en el propio test; si aparece, se refina el patrón, no se silencia el test.
- [Eyebrow/zona vs house-ban] → Mitigación: es copy, no requisito; se decide en revisión con el dueño en 30 segundos.

## Migration Plan

Change puramente estático y aditivo: `astro check` + `node --test` + `astro build` en verde antes de dar por hecho. Rollback = revert del diff (sin migraciones, sin endpoints, sin env nuevas). R7: no commitear ni pushear; los artefactos de planning tampoco tocan código del proyecto.

## Open Questions

- Q1 (check-point de revisión, default `espejos.jpg`): ¿qué portada protagoniza el hero? No cambia specs, approach ni tasks (una sola referencia de imagen).
- Q2 (checkpoint de revisión, draft en tasks): ¿copy definitivo del hero? PA-06 / dueño; el draft cumple R2 y voz de taller desde el día uno.
