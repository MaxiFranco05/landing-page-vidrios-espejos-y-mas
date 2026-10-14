# CHANGES — Secuencia de Implementación

> Índice canónico de todos los changes del proyecto **Vidrios, espejos y mas** (landing para vidriería en Gral. Alvear, Mendoza — Astro + Netlify, sitio 100% estático).
> Cada change es atómico: un agente puede implementarlo en una sesión (~4-6 horas).
> **Leer este archivo antes de ejecutar cualquier `/opsx:propose`.**

---

## Cómo usar este documento

1. Identificar el change a implementar (verificar que sus dependencias están en `openspec/changes/archive/`).
2. Leer los docs de la knowledge-base indicados en "Leer antes".
3. Ejecutar `/opsx:propose <nombre-del-change>`.
4. Al terminar el change, archivarlo con `/opsx:archive <nombre-del-change>`.
5. Marcar el checkbox `[x]` en este archivo.

---

## Árbol de dependencias

```
C-01 foundation-setup
  ├── C-02 content-model-seed
  │     └── C-04 whatsapp-contact-ctas       ← desbloquea conversión
  │           ├── C-05 catalogo-categorias-productos
  │           │     └── C-08 seo-deploy-medicion   ← cierre a producción
  │           └── C-07 contacto-ubicacion-maps
  │                 └── C-08 seo-deploy-medicion
  └── C-03 design-system-tema
        ├── C-05 catalogo-categorias-productos   ← + C-02 + C-04
        ├── C-06 galeria-trabajos                ← + C-02
        └── C-07 contacto-ubicacion-maps         ← + C-02 + C-04
```

### Paralelismo por fase

> Cada "gate" es un punto de sincronización. Los changes dentro de un grupo pueden ejecutarse en paralelo.

```
GATE 0: ninguna
  → C-01 foundation-setup (solo)

GATE 1: C-01 ✓                          ← PRIMER FORK (2 paralelos)
  → C-02 content-model-seed             [Agente A]
  → C-03 design-system-tema             [Agente C]

GATE 2: C-02 ✓
  → C-04 whatsapp-contact-ctas          [Agente B]

GATE 3: C-02 + C-03 + C-04 ✓            ← FORK (3 paralelos)
  → C-05 catalogo-categorias-productos  [Agente A]
  → C-06 galeria-trabajos               [Agente B]
  → C-07 contacto-ubicacion-maps        [Agente C]

GATE 4: C-05 + C-06 + C-07 ✓
  → C-08 seo-deploy-medicion            [Agente A]
```

### Camino crítico (5 changes — mínimo irreducible)

```
C-01 → C-02 → C-04 → C-05 → C-08
```

### Plan óptimo con 3 agentes

```
Paso │ Agente A (Contenido + Catálogo)   │ Agente B (Interacción + Galería)      │ Agente C (Tema + Contacto)
─────┼───────────────────────────────────┼───────────────────────────────────────┼────────────────────────────
  1  │ C-01 foundation-setup             │ —                                     │ —
  2  │ C-02 content-model-seed           │ —                                     │ C-03 design-system-tema
  3  │ —                                 │ C-04 whatsapp-contact-ctas            │ —
  4  │ C-05 catalogo-categorias-productos│ C-06 galeria-trabajos                 │ C-07 contacto-ubicacion-maps
  5  │ C-08 seo-deploy-medicion          │ —                                     │ —
```

---

## FASE 0 — Cimientos

### [C-01] `foundation-setup`
- **Estado**: `[x]` archivado (2026-10-14)
- **Scope**: Scaffolding Astro + Netlify listo para construir
  - Proyecto Astro 4.x + TypeScript 5.x, `astro.config.mjs`, `tsconfig`, estructura `src/{content,components,layouts,pages,styles,lib}` + `public/images` según `08_arquitectura_propuesta.md`
  - `netlify.toml` (build `astro build`, publish `dist`, URL temporal `*.netlify.app` por PA-01), `.env.example` con `PUBLIC_WHATSAPP_NUMBER`, `PUBLIC_PHONE_DISPLAY`, `PUBLIC_ADDRESS`, `PUBLIC_MAPS_URL`, `PUBLIC_MAPS_EMBED_URL`
  - `BaseLayout.astro` mínimo (slot + `<head>` + import de tokens) sin estilos finales
  - Excluir `knowledge-base/` y `discovery/` del build/publicado
  - Verificación: `npm run build` genera `dist/` y el deploy preview de Netlify publica
- **Dependencias**: ninguna
- **Governance**: BAJO
- **Leer antes**:
  - `knowledge-base/01_vision_y_objetivos.md` (alcance v1.0 y fuera de alcance)
  - `knowledge-base/02_descripcion_general.md` §Stack tecnológico
  - `knowledge-base/08_arquitectura_propuesta.md` §Estructura de directorios
  - `knowledge-base/09_decisiones_y_supuestos.md` §DD-01, §DD-02, §DD-03

### [C-02] `content-model-seed`
- **Estado**: `[x]` archivado (2026-10-14)
- **Scope**: Modelo de contenido + seed inicial versionado en git
  - Schemas Zod de Content Collections: `categorias` (`slug` kebab-case único, `nombre`, `descripcion`, `imagen_portada`, `orden`), `productos` (`slug`, `nombre`, `categoria` ref, `descripcion_corta`, `fotos[]` con `alt`, `destacado`, `orden`), `trabajos` (`titulo`, `categoria` ref, `fotos[]`, `descripcion?`, `fecha?`), `datos-contacto.json` (whatsapp `5492625445223`, teléfono visible, dirección, zona, maps_url, maps_embed_url, horarios)
  - Seed: 4 categorías (`vidrios-a-medida-dvh`, `espejos`, `estantes-comerciales`, `mesas-ratoneras`), DatosContacto con valores del seed, ≥1 producto y ≥2 trabajos por categoría (placeholder marcado si aplica PA-02)
  - Validación en build: sin precio ni medidas en productos, toda foto con `alt`, slugs únicos
  - Tests: validación de schemas (slug duplicado, foto sin `alt`, ref a categoría inexistente)
- **Dependencias**: C-01
- **Governance**: BAJO
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md` §Entidades
  - `knowledge-base/05_reglas_de_negocio.md` §RN-CAT-01, §RN-CAT-02, §RN-CAT-04, §RN-CN-02
  - `knowledge-base/10_preguntas_abiertas.md` §PA-02
  - `knowledge-base/08_arquitectura_propuesta.md` §Content Collections

---

## FASE 1 — Identidad y conversión

> C-03 puede avanzar en paralelo con C-02 (ambos solo necesitan C-01). C-04 arranca cuando C-02 está archivado.

### [C-03] `design-system-tema`
- **Estado**: `[x]` archivado (2026-10-14)
- **Scope**: Sistema visual propio + modo oscuro completo (US-007)
  - Tokens en `src/styles/`: paleta análoga clara gama vidrio/agua (celestes, verdes suaves, neutros cálidos), tipografía legible con carácter (no sans genérica), espaciados y radios
  - `ThemeToggle.astro` (isla JS): respeta `prefers-color-scheme` por defecto, persiste en `localStorage`, sin flash de tema incorrecto
  - `BaseLayout` aplica tema claro/oscuro completo (no inversión automática), toggle visible en header
  - Criterio anti-genérico: home sin hero + 3 cards de plantilla; fotos reales como protagonistas
  - Verificación: toggle claro/oscuro en mobile y desktop, contraste AA en ambos modos
- **Dependencias**: C-01
- **Governance**: BAJO
- **Leer antes**:
  - `knowledge-base/06_funcionalidades.md` §US-007
  - `knowledge-base/05_reglas_de_negocio.md` §RN-DS-01, §RN-DS-02
  - `knowledge-base/08_arquitectura_propuesta.md` §Identidad visual
  - `knowledge-base/01_vision_y_objetivos.md` §Alcance v1.0

### [C-04] `whatsapp-contact-ctas`
- **Estado**: `[x]` archivado (2026-10-14)
- **Scope**: Conversión a WhatsApp/llamada como single source of truth (US-003, US-005)
  - `src/lib/whatsapp.ts`: `buildProductLink(numero, producto, categoria)` + `buildGenericLink(numero)` con `encodeURIComponent`, tests unitarios (acentos, comillas, emojis)
  - `WhatsAppButton.astro`: variantes por producto / genérica ("Consultar por otro trabajo") + `tel:+5492625445223` siempre visible como alternativa
  - CTA sticky en mobile en home, mismo número desde `DatosContacto` en todos los links (una sola fuente de verdad)
  - Verificación manual: abre WhatsApp Web en desktop y app en mobile con mensaje que identifica producto + categoría
- **Dependencias**: C-02
- **Governance**: BAJO
- **Leer antes**:
  - `knowledge-base/06_funcionalidades.md` §US-003, §US-005
  - `knowledge-base/05_reglas_de_negocio.md` §RN-WA-01, §RN-WA-02, §RN-WA-03, §RN-WA-04
  - `knowledge-base/07_flujos_principales.md` §Flujo 1
  - `knowledge-base/04_modelo_de_datos.md` §DatosContacto

---

## FASE 2 — Contenido visible

> C-05, C-06 y C-07 pueden proponerse en paralelo una vez archivados C-02, C-03 y C-04.

### [C-05] `catalogo-categorias-productos`
- **Estado**: `[ ]` pendiente
- **Scope**: Catálogo navegable home + páginas por categoría (US-001, US-002)
  - `CategoryCard.astro` + `ProductCard.astro` (foto, nombre, descripción corta, botón WhatsApp por producto; sin precios ni medidas)
  - `index.astro` §categorías: las 4 categorías con portada y descripción, cada una enlaza a `/categoria/{slug}`
  - `categoria/[slug].astro` con `getStaticPaths` desde la colección, 404 para slug inexistente
  - Responsive mobile-first en tema claro y oscuro, `alt` descriptivo en cada imagen
  - Tests: slugs generan las 4 rutas, producto sin precio/medida en HTML, links `wa.me` con mensaje encodeado
- **Dependencias**: C-02, C-03, C-04
- **Governance**: BAJO
- **Leer antes**:
  - `knowledge-base/06_funcionalidades.md` §US-001, §US-002
  - `knowledge-base/04_modelo_de_datos.md` §Categoria, §Producto
  - `knowledge-base/05_reglas_de_negocio.md` §RN-CAT-01, §RN-CAT-02, §RN-CAT-03
  - `knowledge-base/03_actores_y_roles.md` §Rutas públicas

### [C-06] `galeria-trabajos`
- **Estado**: `[ ]` pendiente
- **Scope**: Galería de trabajos reales por categoría (US-004)
  - `Gallery.astro` (isla JS: filtro por categoría + lightbox con teclado y foco accesible), sección `/#trabajos` en home
  - Bocetos IA solo como último recurso y marcados "imagen ilustrativa"; fotos reales con prioridad
  - Progressive enhancement: grilla visible sin JS, lightbox solo mejora
  - Verificación: galería filtrable/agrupada por categoría, cada foto con `alt`, sin secciones vacías en build
- **Dependencias**: C-02, C-03
- **Governance**: BAJO
- **Leer antes**:
  - `knowledge-base/06_funcionalidades.md` §US-004
  - `knowledge-base/04_modelo_de_datos.md` §Trabajo
  - `knowledge-base/05_reglas_de_negocio.md` §RN-CN-01, §RN-CN-02, §RN-CAT-04
  - `knowledge-base/08_arquitectura_propuesta.md` §Islas de interactividad

### [C-07] `contacto-ubicacion-maps`
- **Estado**: `[ ]` pendiente
- **Scope**: Contacto y ubicación que cierran la visita (US-005 resto, US-006)
  - `Header` (tel + WhatsApp) + `Footer` + secciones `/#contacto`, `/#ubicacion`: dirección "Estrada 912, Gral. Alvear, Mendoza", zona "Gral. Alvear y alrededores", horarios "Lun–Vie 8–19, Sáb 8–13, Dom cerrado"
  - `MapEmbed.astro`: iframe de Maps en footer + botón "Cómo llegar" en home que abre Google Maps con el destino correcto
  - Progressive enhancement: si el embed se bloquea (adblock/offline), el link y la dirección en texto siguen funcionando
  - Menú mobile (isla JS mínima) con acceso a contacto/ubicación
- **Dependencias**: C-02, C-03, C-04
- **Governance**: BAJO
- **Leer antes**:
  - `knowledge-base/06_funcionalidades.md` §US-005, §US-006
  - `knowledge-base/05_reglas_de_negocio.md` §RN-CN-03, §RN-WA-04
  - `knowledge-base/07_flujos_principales.md` §Flujo 2
  - `knowledge-base/03_actores_y_roles.md` §Rutas públicas

---

## FASE 3 — Producción

### [C-08] `seo-deploy-medicion`
- **Estado**: `[ ]` pendiente
- **Scope**: Puesta en producción medible y posicionable
  - SEO local: titles/metas por página y categoría ("vidriería en Gral. Alvear"), Open Graph, `sitemap.xml`, `robots.txt`, JSON-LD `LocalBusiness` con dirección, teléfono y horarios
  - `netlify.toml` final: headers de caché para assets, HTTPS, previews por PR; documentar pendiente PA-01 (dominio definitivo vs `*.netlify.app`)
  - Medición mínima (SU-02): eventos de clic en CTAs WhatsApp/teléfono/cómo-llegar diferenciando producto identificado vs. genérico
  - Verificación: Lighthouse ≥90 en performance/accesibilidad/SEO en mobile, build verde desde `main`, checklist de contenido real vs. placeholder (PA-06)
- **Dependencias**: C-05, C-06, C-07
- **Governance**: BAJO
- **Leer antes**:
  - `knowledge-base/01_vision_y_objetivos.md` §Métricas de éxito
  - `knowledge-base/02_descripcion_general.md` §Hosting + CDN
  - `knowledge-base/09_decisiones_y_supuestos.md` §DD-02, §SU-02
  - `knowledge-base/10_preguntas_abiertas.md` §PA-01, §PA-06
