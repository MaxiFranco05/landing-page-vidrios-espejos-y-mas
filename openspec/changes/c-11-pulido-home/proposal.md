# Proposal

## Why

El home renderiza a ancho completo sin hero: `src/pages/index.astro:51-55` conserva el h1 pelado + párrafo placeholder del scaffolding C-01, el `main` no tiene contenedor de ancho máximo y el mapa (`MapEmbed` 16/10 full-width) domina la vista. La primera impresión no comunica el oficio del taller ni guía a WhatsApp.

## What Changes

- Contenedor centrado de ancho máximo (~70rem) + padding lateral para el contenido principal del home (y reutilizable en el resto de páginas), con tokens existentes, sin colores nuevos.
- Hero real según `demos/demo.html` "Nueva propuesta": titular + propuesta de valor + CTA WhatsApp (variante genérica C-04, número desde `datosContacto`, R4) + imagen principal reutilizando una portada real de `public/images/categorias` (sin assets nuevos). Reemplaza el párrafo placeholder C-01. Copy en voz de taller, sin precios ni medidas (R2), sin afirmaciones inventadas.
- Mapa compacto centrado estilo referencia La Plata: altura acotada, embed real + fallback intactos (dirección en texto + "Abrir en Google Maps" siempre en DOM), R4 intacto.
- Hardening: test de regresión que prohíbe literales `<tag>` dentro de comentarios del frontmatter (`---`) de `.astro` — causa raíz de la rotura de dev del 2026-10-15; única excepción: el propio test.
- Re-verificación visual claro/oscuro + mobile/desktop según gates C-08 (contraste AA, sin flash de tema).
- Galería de trabajos: SIN cambios (los placeholders ilustrativos con badge son PA-02, fuera de este change).

## Capabilities

### New Capabilities

- `pulido-home`: pulido visual del home — contenedor centrado, hero real con CTA WhatsApp e imagen de portada existente, mapa compacto centrado y guarda de regresión anti-`<tag>` en frontmatter. Comportamiento durable del layout del home que puede seguir evolucionando (futuros ajustes de hero/contenedor viven acá).

### Modified Capabilities

- _(ninguna — los specs archivados `design-system`, `contacto-ubicacion`, `whatsapp-contact`, `galeria` no cambian de requisitos: el contenedor/hero son comportamiento nuevo, el mapa mantiene su contrato de props + fallback + R4, y la paleta 37B queda intacta)_

## Impact

- Afecta: `src/pages/index.astro` (hero + contenedor), `src/components/MapEmbed.astro` (presentación compacta, sin cambio de props), `src/layouts/BaseLayout.astro` o `src/styles/global.css` (clase de contenedor, tokens `@theme` existentes), `tests/` (nuevo test de regresión frontmatter).
- No afecta: tokens/paleta 37B, colecciones de contenido, links `wa.me` (mismo builder C-04), SEO/JSON-LD, testimonios, galería.
- Deps: C-03/C-05/C-06/C-07 (archivados). No bloquea nada. Governance BAJO (visual, sin backend/auth) con checkpoints de revisión del dueño: copy del hero + elección de la imagen de portada (estilo MEDIUM en revisión, no en implementación).
- Riesgos: copy provisorio sin sign-off final (PA-06 lo cubre); fotos reales de trabajos siguen pendientes (PA-02).
