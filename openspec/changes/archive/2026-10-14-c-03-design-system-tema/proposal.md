# Proposal — c-03-design-system-tema

## Why

El sitio tiene scaffolding funcional (C-01) y contenido versionado (C-02), pero sin identidad visual: `global.css` solo deja el mecanismo `@theme` vacío y `BaseLayout` no tematiza nada. Sin este change, C-05/C-06/C-07 maquetarían sobre estilos ad-hoc y romperían RN-DS-01/02. Además la paleta final (ternas 37A/37B/37C) está pendiente de decisión del dueño (37d): necesita verla antes de elegir.

## What Changes

- Tokens de diseño en `src/styles/`: paleta análoga clara gama vidrio/agua, tipografía legible con carácter (39c), espaciados y radios; jerarquía brand → semantic → component, valores OKLCH, Tailwind v4 CSS-first (R3).
- `ThemeToggle.astro` (isla JS mínima): respeta `prefers-color-scheme` por defecto, persiste en `localStorage`, sin flash de tema incorrecto (script inline en `<head>`).
- `BaseLayout` aplica tema claro/oscuro completo (no inversión automática), con toggle visible en header y `<html lang="es">` + foco visible + `prefers-reduced-motion` (WCAG 2.2 AA).
- Wordmark tipográfico simple ("Vidrios, espejos y mas", 40a+c): sin logo previo, la marca se crea en este change (decisión 26b).
- Criterio anti-genérico verificable (RN-DS-02): nada de hero + 3 cards de plantilla; fotos reales como protagonistas; house bans (sin eyebrows, sin gradientes, sin glass/blur, máx. 2 tipografías).
- `demo.html` en raíz del repo (extensión de scope aprobada por el usuario): página estática autocontenida, sin build, que se abre en el navegador; incluye hero + categorías + galería estilo La Plata + botón WhatsApp de ejemplo + conmutador de paletas A/B/C + claro/oscuro. El dueño elige paleta DESPUÉS de verla (37d); la ganadora se registra para la implementación real y condiciona los tokens finales.
- `demo.html` NO se publica: fuera de `dist/` y del deploy (publish `dist`), igual que `knowledge-base/`.

## Capabilities

### New Capabilities

- `design-system`: sistema visual propio + doble tema + wordmark + demo de selección de paleta. Cubre tokens, ThemeToggle, BaseLayout tematizado, identidad tipográfica y el instrumento `demo.html` con sus tres paletas conmutables.

### Modified Capabilities

- (vacío — `foundation` no cambia requisitos: el mecanismo `@theme`/Tailwind v4 y la estructura `src/styles` ya existen; este change los puebla sin alterar su contrato. `content-model` no se toca.)

## Impact

- Afecta: `src/styles/global.css` (+ posible `theme.css`), `src/layouts/BaseLayout.astro`, `src/components/ThemeToggle.astro` (nuevo), `src/components/Wordmark.astro` o bloque en header (nuevo), `index.astro` solo si necesita slot de toggle (mínimo).
- Nuevo: `demo.html` (raíz, no publicado, autocontenido: CSS/JS inline, imágenes placeholder vía CSS/SVG — sin dependencias de build ni fotos reales).
- No afecta: collections, schemas, `datos-contacto`, `netlify.toml`, `astro.config.mjs`, pins de dependencias (DD-08 intacto: no se toca `tailwindcss`/`vite`).
- Desbloquea: C-05, C-06, C-07 (todos consumen tokens + BaseLayout tematizado).
- Riesgo: elección de paleta postergada — mitigado porque `demo.html` es la primera task y los tokens finales esperan la decisión 37d.
