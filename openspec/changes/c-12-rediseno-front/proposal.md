# Proposal

## Why

El front actual es una suma de pulidos incrementales (C-03…C-11) sin una rebuild visual coherente: el home, el catálogo y las páginas por categoría no siguen el contrato visual aprobado (`knowledge-base/11_estructura_del_front.md`), persisten los 5 fixes con evidencia del dueño (F1 foto con precio impreso que viola R2 en píxeles, F2 cajas vacías, F3 copy repetido ×13, F4 oscuro pesado, F5 mapa gigante) y no existe un gate visual que impida regresiones. C-12 hace el rebuild completo del front sobre una sola fuente de verdad antes de seguir sumando parches.

## What Changes

- Rebuild visual FULL del front (markup de páginas + componentes + CSS de layout) según el contrato KB-11: orden del home (hero → Lo que hacemos → destacados → opiniones → contacto+ubicación juntos), catálogo compacto por categoría, página por categoría con portada acotada, header/footer/404 con tamiz de densidad (columna ~70rem centrada, nada full-width salvo fondos).
- Reutilización total sin cambios: datos/seed, schemas Zod, builders (`whatsapp.ts`, SEO/analytics), tests de contenido, tokens 37B, pins (Astro 4.16.19, Tailwind v4 CSS-first). Solo cambia lo visual.
- Fixes F1–F5 del contrato: F1 swap de `espejo-panoramico-gancho.jpg` (foto limpia del dueño o placeholder marcado "ilustrativa" + pedido registrado al dueño); F2 diagnóstico + regla de no-vacío (toda caja de imagen resuelve foto real o badge ilustrativo, nunca vacía); F3 pasada no-ai-slop (quitar "Consultanos por WhatsApp" de descripciones, queda solo en botones); F4 densidades del tema oscuro (37B intacta, solo aire/contraste); F5 mapa compacto centrado (consolida prototipo C-11).
- Resolución C-11 (aplicado 11/11, NO archivado, NO commiteado, trabajo en el árbol): archivar `c-11-pulido-home` PRIMERO (sus 4 aportes — `tests/frontmatter.test.mjs`, `.contenedor`, mapa compacto, hero Q1 con `espejo-redondo-led.jpg` — quedan en el árbol y son base de C-12); C-12 construye encima y NUNCA duplica ni pierde esos 4 aportes. Si el archive de C-11 revela fallos en sus gates, se corrigen dentro de C-12 y se registra.
- Gate visual obligatorio: capturas Playwright lado a lado vs `demos/demo.html` "Nueva propuesta" + `demos/demo-c11.html` en mobile/desktop × claro/oscuro como gates de aceptación, NO opcionales. Checkpoint de revisión del dueño con capturas ANTES de los tasks finales de build (governance MEDIUM).
- Placeholders siguen marcados (PA-02): lo ilustrativo lleva badge; PA-01/PA-02 (recolección de contenido real) quedan fuera.

## Capabilities

### New Capabilities

- `front`: sistema visual del front — orden y densidad del home, catálogo compacto, página por categoría acotada, header/footer/404 con tamiz de densidad, fixes F1–F5, regla de no-vacío y gates de captura Playwright. Comportamiento durable que absorbe y supera `pulido-home` (C-11): futuros ajustes visuales viven acá.

### Modified Capabilities

- _(ninguna — los 9 specs existentes quedan intactos; donde el contrato KB-11 afina reglas de layout de specs archivados, el delta `front` lo declara y anota la supersesión sin editar los specs archivados)_

## Impact

- Afecta (solo visual): `src/pages/index.astro`, `src/pages/catalogo.astro`, `src/pages/categoria/[slug].astro`, `src/pages/404.astro`, componentes de presentación (`CategoryCard`, `ProductCard`, `Gallery`, `Testimonios`, `MapEmbed`, `ContactInfo`, header/footer/menu/toggle/CTA), `src/styles/global.css` (layout y densidades, tokens `@theme` existentes, cero colores nuevos), contenido descriptivo (descripciones sin CTA repetido, F1 swap), `tests/` (nuevos gates visuales/contenido, suite existente intacta).
- No afecta: modelo de datos, seed, schemas, builders, tokens 37B, pins, rutas, SEO/JSON-LD/NAP, analytics, backend (no hay, R1).
- Deps: C-03/C-05/C-06/C-07/C-10 (archivados) + C-11 (aplicado, a archivar primero). Riesgos: F1 sin foto limpia del dueño → placeholder marcado + pedido registrado (no bloquea); Playwright sin instalar en CI local → capturas manuales equivalentes con checklist firmado (fallback registrado, no silencioso).
- R7: no commitear ni pushear sin pedido explícito. R1: todo prerender estático, `astro check` limpio antes de cada build. R2/R4/R5 validados por tests.
