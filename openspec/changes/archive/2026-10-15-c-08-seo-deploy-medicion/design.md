# Design — c-08-seo-deploy-medicion

## Context

Ver `proposal.md` (Why). Estado actual observado: `BaseLayout.astro` acepta `title`/`description` con defaults provisorios de C-01, emite solo `meta description` (sin canonical/OG/JSON-LD), `lang="es"`, anti-flash de tema como primer script del `<head>`, fuentes Google con `display=swap`. `astro.config.mjs` tiene `site:` temporal con TODO PA-01. `netlify.toml` solo declara build+publish. NAP canónico vive en `src/lib/datos-contacto.ts` (R4). Sin dependencias de analítica en `package.json`. Pins intactos: `tailwindcss` + `@tailwindcss/vite` `4.1.12`, override `vite 5.4.21` (DD-08, no tocar).

## Goals / Non-Goals

**Goals:** SEO local completo sin backend; deploy final documentado reversible a dominio definitivo en un commit; medición SU-02 con Umami sin cookies; Lighthouse ≥90 mobile; checklist PA-06 ejecutable.

**Non-Goals:** dominio definitivo (PA-01, decisión del dueño); textos/fotos finales (PA-06, el change define el gate, no el contenido); Google Business Profile, páginas por barrio, FAQ, reseñas (fuera de alcance v1); migrar a GA4; admin v2 (DD-07).

## Decisions

1. **Centralizar SEO en `src/lib/seo.ts` + props de `BaseLayout`** (alternativa: repetir tags por página). Un builder `buildSeo({title, description, path, image?, type?})` produce canonical/OG/Twitter; cada página pasa sus valores. Por qué: 7 páginas con reglas idénticas; un solo lugar para longitud de titles, locale `es_AR`, fallback de imagen OG.
2. **`@astrojs/sitemap` para `sitemap.xml`** (alternativa: archivo estático a mano). Se integra al build, deriva URLs de `site:` + rutas prerenderizadas, excluye 404 por config. Por qué: imposible que el sitemap se desincronice de `getStaticPaths` al agregar categorías. `robots.txt` sí estático en `public/` (dos líneas, no necesita build).
3. **JSON-LD `Store` (subtipo de `LocalBusiness`) solo en home** (alternativa: en todas las páginas / `HomeAndConstructionBusiness`). Home concentra el NAP; repetirlo en 7 páginas diluye y arriesga inconsistencia. Subtipo `Store` por ser comercio barrial con dirección; si Rich Results pide tipo más específico al validar, se ajusta en apply sin cambiar specs.
4. **Umami con `src/lib/analytics.ts` + `data-umami-event` en CTAs** (alternativa: GA4 / script inline por botón). Módulo con `track(name, data)` no-op si `window.umami` ausente; CTAs existentes añaden atributo de evento sin cambiar su `href` (C-04 intacto). Por qué: PA-07 ya decidió Umami; GA4 queda para otra versión. ID solo vía `PUBLIC_UMAMI_WEBSITE_ID` (R4 extensivo); sin env, sin script, sin errores.
5. **Cache headers por patrón en `netlify.toml`** (alternativa: header único global). `/_astro/*` → `immutable` un año (Vite hashea nombres); `/*.html` + `/` → `no-cache`/`must-revalidate` ligero. Por qué: assets hasheados nunca cambian de nombre; el HTML debe revalidar para que el deploy nuevo se vea al instante. Previews por PR son default de Netlify con deploys desde git; solo se documentan, no se configuran.
6. **`site:` temporal como canónica hasta PA-01** (alternativa: bloquear C-08 hasta el dominio). Los canonicals/sitemap deben ser absolutos hoy; apuntar a `*.netlify.app` es reversible en un commit (`site:` + rebuild). Se documenta el TODO existente, no se inventa dominio.
7. **Copy deck en una tabla del change antes de tocar layouts** (fallback por `no-ai-slop`/`impeccable` no instaladas). Las 7 parejas title/description + CTAs se redactan y revisan en el task de copy; la pasada visual usa los compact rules de `design-taste-frontend`/`frontend-design` (fotos protagonistas, sin hero+3-cards, bans de house style) como checklist manual.

## Risks / Trade-offs

- [URL temporal indexada] Si Google indexa `*.netlify.app` antes del dominio definitivo → mitigación: canonicals consistentes desde el día 1 hacen la migración limpia (301/canonical al dominio nuevo en el change del dominio).
- [Umami bloqueado por adblock] Eventos sub-muestreados → mitigación: es medición direccional (producto vs. genérico), no facturación; se documenta el sesgo.
- [`og:image` sin foto real] Si PA-06 deja categorías con placeholder → mitigación: OG usa imagen real del negocio (fachada/taller) en vez de placeholder; checklist lo exige.
- [Lighthouse perf en mobile con Maps embed] El iframe de Maps pesa → mitigación: embed diferido (`loading="lazy"`) + facade/link "Cómo llegar" como contenido principal; el iframe nunca bloquea LCP.
- [Skills anti-slop] `impeccable`/`no-ai-slop` están instaladas globalmente (verificado), pero el Skill-tool de sub-agentes no las resuelve → el apply inyecta sus reglas directamente en el brief (verificadas por el orquestador); tasks 1.2/7.1 usan esas reglas + compact rules del registry como checklist.

## Migration Plan

1. Merge a `main` → Netlify build + deploy automático (verificación: build verde, `astro check` limpio).
2. Post-deploy: curl a `/sitemap.xml`, `/robots.txt`, headers de un asset `/_astro/*` y de `/`; Rich Results Test sobre la home; Lighthouse mobile.
3. Rollback: revert del commit (todo es estático; sin migraciones de datos).
4. Al resolverse PA-01: change mínimo (actualizar `site:`, rebuild, verificar canonicals/sitemap) — estimado <1h.

## Open Questions

- Ninguna que cambie specs/enfoque/tasks. PA-01 (dominio) y PA-06 (quién escribe textos finales) se responden en apply con el dueño; el diseño ya contempla ambos estados.
