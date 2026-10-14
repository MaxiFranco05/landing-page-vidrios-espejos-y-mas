# Design — c-01-foundation-setup

## Context

Repo greenfield: sin `package.json`, sin `src/`, sin config. Verificado en disco (solo `knowledge-base/`, `discovery/`, `openspec/`, `CHANGES.md`, `AGENTS.md`). Constraints: R1 (todo prerender estático, `astro check` limpio), R3 (Tailwind v4 CSS-first, tokens en `src/styles`), R4 (WhatsApp desde env/DatosContacto), R7 (no commitear sin pedido). Stack fijado por DD-01/02/03/08 y `02_descripcion_general.md`. Node 24 + npm 12 disponibles en la máquina. Ver proposal.md (Why) y `specs/foundation/spec.md` (contrato de comportamiento).

## Goals / Non-Goals

**Goals:**

- Baseline Astro 4.x + TS 5.x que pasa `astro check` y `astro build` en checkout limpio.
- Estructura de carpetas final desde el día 1 para que C-02 (collections) y C-03 (tokens/tema) encajen sin mover archivos.
- Pipeline Tailwind v4 funcional pero mínimo (sin diseño final).
- Deploy Netlify declarativo + `.env.example` como single source of truth futura.

**Non-Goals:**

- Diseño visual, paleta final, tipografías, modo oscuro (C-03).
- Schemas Zod de collections y seed real (C-02).
- Lógica WhatsApp/Maps/Galería (C-04/C-06/C-07).
- SEO, sitemap, analytics (C-08). Solo se deja `site:` temporal para no bloquear canonicals futuros.

## Decisions

### D1 — Astro 4.x con output estático por defecto, sin adapter

**Decisión**: `output: 'static'` implícito (default de Astro), sin `@astrojs/netlify` en C-01.
**Rationale**: R1 prohíbe servidor; el sitio es HTML puro + CDN. El adapter de Netlify solo aporta valor con SSR/edge/functions, que v1 no tiene. Publicar `dist/` directo es más simple y portable (DD-02 trade-off: migrable por ser estático).
**Alternativas**: `@astrojs/netlify` static adapter — descartado por dependencia innecesaria; se re-evalúa solo si un change futuro pide SSR (no previsto en v1).
**Skill**: `astro` (static-first, prerenderable, `site:` configurado).

### D2 — Tailwind v4 vía plugin Vite, tokens en `src/styles/global.css`

**Decisión**: `tailwindcss@4` + `@tailwindcss/vite` como plugin en `astro.config.mjs`; `global.css` con `@import "tailwindcss"` y bloque `@theme` inicial (vacío/documentado); ningún `tailwind.config.ts`.
**Rationale**: R3 y DD-08 lo exigen; CSS-first v4 elimina config JS y prepara tokens brand → semantic → component que C-03 llenará.
**Alternativas**: Tailwind v3 + config JS — descartado (contradice R3 y skill `tailwind-design-system`).
**Skill**: `tailwind-design-system` (OKLCH cuando C-03 defina paleta; en C-01 solo se deja el esqueleto `@theme`).

### D3 — `BaseLayout.astro` mínimo + `index.astro` placeholder

**Decisión**: `BaseLayout` con `<html lang="es">`, `<head>` (charset, viewport, title placeholder), import de `../styles/global.css` y `<slot />`. `index.astro` usa el layout con un heading + párrafo placeholder (se reemplaza en C-04..C-07).
**Rationale**: prueba el pipeline layout → página → CSS sin anticipar diseño (evita violar RN-DS-02 trayendo un hero genérico).
**Alternativas**: página vacía o home completo — descartadas (vacía no prueba slot; completa invade C-03/C-05).

### D4 — `netlify.toml` declarativo + `site:` temporal

**Decisión**: `netlify.toml` con `[build] command = "npm run build"`, `publish = "dist"`; `astro.config.mjs` con `site: "https://vidrios-espejos-y-mas.netlify.app"` (placeholder temporal, documentado como pendiente PA-01).
**Rationale**: habilita previews por push desde el primer commit sin bloquearse en el dominio definitivo.
**Alternativas**: esperar a PA-01 — descartado (la KB y CHANGES.md ordenan explícitamente URL temporal).

### D5 — `.env.example` con las 5 variables públicas, sin valores reales

**Decisión**: plantilla con `PUBLIC_WHATSAPP_NUMBER=5492625445223` (formato de ejemplo = mismo formato que el real, marcado como ejemplo), resto con placeholders (`Estrada 912…`, URLs `https://…`). Sin `.env` commiteado.
**Rationale**: R4 + RN-WA-03: desde C-01 queda establecido que el número nunca se hardcodea; C-02/C-04 lo consumirán desde `DatosContacto`/env.
**Alternativas**: poner el número real ya — descartado (mezcla ejemplo con dato operativo; el dato canónico lo fija C-02 en `datos-contacto.json`).

### D6 — Exclusión de KB/discovery por construcción (no por config frágil)

**Decisión**: no hay nada que configurar — Astro solo publica `dist/` (compilado desde `src/pages`) y copia `public/` tal cual; `knowledge-base/` y `discovery/` nunca entran al grafo. Se verifica por inspección de `dist/` (spec scenario), no con reglas de ignore.
**Rationale**: garantía estructural en vez de lista de exclusión que se puede olvidar.

## Risks / Trade-offs

- [Risk] Versión Astro/Tailwind a instalar resuelve a minor con breaking → Mitigación: pinnear `astro@^4`, `tailwindcss@^4` + `@tailwindcss/vite@^4` en `package.json`; verificar `npm run build` en la máquina antes de cerrar el change (tarea de verificación).
- [Risk] `astro check` requiere `typescript` + `@astrojs/check` con versiones compatibles → Mitigación: instalar trío probado (`typescript@~5`, `@astrojs/check` latest 4.x-compat) y script `check: "astro check"`.
- [Risk] `site:` temporal queda hardcodeado y se olvida al resolver PA-01 → Mitigación: comentario `TODO(PA-01)` en `astro.config.mjs` + recordatorio en tasks.md y en C-08 (`netlify.toml` final).
- [Trade-off] Sin adapter Netlify no hay headers/redirects gestionados por plugin — aceptado: C-08 añadirá headers de caché cuando haya assets reales.

## Migration Plan

Greenfield, sin migración ni rollback más allá de borrar archivos generados. Orden de deploy: merge → Netlify auto-build (`npm run build` → `dist`) → preview URL. Rollback: revert del commit (R7: solo cuando el usuario lo pida explícitamente).

## Open Questions

- PA-01 (dominio definitivo): deferrable — no cambia specs, diseño ni tasks de C-01 (el `site:` temporal se sustituye en C-08).
- PA-02 (cobertura de fotos): deferrable — C-01 solo deja `public/images/.gitkeep`; el gate RN-CAT-04 aplica desde C-02.
