# Design

## Context

Ver `proposal.md` (Why) y `specs/contacto-ubicacion/spec.md` (contrato). Estado actual observado: `BaseLayout.astro` solo tiene marca + `ThemeToggle` (sin header de contacto ni footer); `index.astro` es placeholder con un CTA genérico + sticky mobile de C-04; `WhatsAppButton.astro` + `src/lib/whatsapp.ts` (`buildGenericLink`, `buildTelLink`) + `src/lib/datos-contacto.ts` (singleton validado por Zod) ya resuelven número/tel (C-04, R4); `datos-contacto.json` trae los valores REALES (`maps_embed_url` con `pb=…` de la ficha, `maps_url` derivada a verificar). Restricciones: R1 estático sin islas innecesarias, R3 tokens solo `@theme`, R4 fuente única, R5 iframe con `title` + lazy, WCAG 2.2 AA, NAP idéntico (lente SEO local).

## Goals / Non-Goals

**Goals:**

- Cerrar Flujo 2 con header/footer + `/#contacto` + `/#ubicacion` alimentados del singleton, con "Cómo llegar" verificado.
- Progressive enhancement real: sin JS / con iframe bloqueado, dirección + links siguen funcionando.
- Una sola isla JS nueva y mínima (menú mobile); el resto 100% estático.

**Non-Goals:**

- No tocar `whatsapp-contact`, `design-system`, `content-model` ni `foundation` (reuso, sin deltas).
- No JSON-LD `LocalBusiness` ni medición de clics (pertenece a C-08).
- No formulario de contacto ni endpoint propio (R1).

## Decisions

### D1 — Reusar `WhatsAppButton` + `buildTelLink`, no reconstruir

Header, `/#contacto` y footer instancian `WhatsAppButton variant="generic"` con `numero={datosContacto.whatsapp}` y `mostrarTel` + `telefonoVisible` (patrón C-04). Alternativa (componente propio de contacto) descartada: duplicaría mensajes/encodeo y rompería la fuente única. El `tel:` canónico (`tel:+549…`, texto `+54 9 …`) sale de `buildTelLink`.

### D2 — `MapEmbed.astro` presentacional: iframe + fallback siempre en DOM

Props: `embedUrl` + `mapsUrl` + `direccion` (resueltas por el llamador desde `datosContacto`, nunca importadas dentro — mismo patrón D3 de C-04). Renderiza `<address>` con la dirección en texto, `iframe(src=embedUrl, title="Mapa de Vidrios, espejos y mas en Estrada 912…", loading="lazy", referrerpolicy, allowfullscreen)` y link "Abrir en Google Maps" / botón "Cómo llegar" (`target="_blank" rel="noopener"`). El fallback NO es `onerror` del iframe (poco fiable): es contenido siempre visible junto al mapa. Alternativa (lite-facade con click-to-load) descartada: añade JS y retrasa el mapa sin pedirlo el negocio.

### D3 — `ContactInfo.astro` como pieza única del NAP

Un componente presentacional (`direccion`, `zona`, `horarios`, `whatsapp`, `telefonoVisible`) renderiza el bloque NAP; `/#contacto`, `/#ubicacion` y footer lo instancian con las mismas props. Garantiza RN-CN-03 por construcción en vez de por revisión visual. Alternativa (texto repetido a mano en 3 lugares) descartada: deriva en variantes con el tiempo.

### D4 — Menú mobile con `<details>` nativo + micro-script de mejora

El toggle es `<details><summary>` (apertura/cierre gratuitos sin JS, anclas siempre en el DOM) con estilos del sistema; un `<script>` mínimo (~15 líneas) añade solo Escape, cierre-al-navegar y `aria-expanded` sincronizado. Alternativa (isla con estado JS completo) descartada: más JS por el mismo resultado y peor no-JS. En `md+` el menú es nav horizontal (CSS), el `details` solo existe en mobile.

### D5 — Datos resueltos arriba, pasados por props (R4)

`BaseLayout` e `index.astro` importan `datosContacto` una vez y lo pasan como props a Header/Footer/ContactInfo/MapEmbed. Nada importa el JSON directamente salvo `datos-contacto.ts`. Sin nuevas `PUBLIC_*` (las de `.env.example` quedan como override futuro documentado, no se cablean en C-07).

### D6 — Estilos solo con tokens `@theme` + variante dark por clase

Secciones y footer usan superficies/textos semánticos de C-03 (claro/oscuro completos, contraste AA). Sin nueva paleta, sin gradientes/glass (house bans C-03). Anti-genérico: la ubicación se ancora en dirección real + mapa real, no en ilustraciones.

### D7 — Verificación del destino en dos capas

Automatizada: test que afirma `href` de "Cómo llegar" === `datosContacto.maps_url` exacto y que el `iframe src` === `maps_embed_url` exacto (anti-typo del `pb=` largo). Manual (task explícita): abrir el link y confirmar que centra la ficha "Vidrios, espejos y mas, Estrada 912" — queda registrada como evidencia en el apply.

## Risks / Trade-offs

- [Colisión GATE 3] C-05/C-06 tocan `BaseLayout`/`index.astro` en paralelo → Mitigación: editar por bloques (header/footer vs catálogo vs galería), ante conflicto reportar y no sobrescribir; tasks marcan los archivos compartidos.
- [`pb=` largo copiado a mano] un carácter roto apunta a otro lugar → Mitigación: copiar el valor exacto del JSON por prop (nunca reescribirlo) + test de igualdad exacta (D7).
- [Iframe bloqueado por adblock/offline] mapa vacío → Mitigación: fallback siempre visible (D2); aceptado: sin red no hay mapa, pero sí dirección + link.
- [`tel:+549…` vs marcado local] algunos fijos no marcan el `9` → Trade-off aceptado: se reutiliza el canónico de C-04 (`buildTelLink`) para no bifurcar formatos; C-08 podrá revisarlo con datos reales.
- [Anclas + header fijo] la sección puede quedar bajo el header → Mitigación: `scroll-margin-top` con token de espaciado en las secciones ancladas.

## Migration Plan

Sin migración: change aditivo sobre HTML estático. Rollback = revert del commit. Deploy por el pipeline existente (`astro check` limpio → `npm run build` → Netlify). Sin flags ni datos que migrar.
