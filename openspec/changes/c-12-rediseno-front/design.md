# Design

## Context

Ver `proposal.md` (Why) y `specs/front/spec.md` (contrato). Estado actual: C-11 aplicado en el árbol sin archivar (`.contenedor` en `global.css:83`, hero con `espejo-redondo-led.jpg` en `index.astro:54-82`, mapa compacto CSS-only, `tests/frontmatter.test.mjs`); catálogo (`catalogo.astro`, `[slug].astro`, `ProductCard`) y resto de componentes con maquetado pre-rebuild; contrato KB-11 + demos como referencia. Restricciones: R1 (estático + `astro check` limpio), R2 (sin precios/medidas, incluye F1 en píxeles), R3 (Tailwind v4 CSS-first, tokens solo `@theme`, 37B intacta, pins Astro 4.16.19 / tailwind 4.1.12 + vite 5.4.21), R4 (contacto/mapas solo desde `datosContacto`), R5 (alt + lazy salvo hero eager), R7 (no commit/push).

## Goals / Non-Goals

**Goals:** rebuild visual coherente sobre C-11 (no parches); F1–F5 cerrados con evidencia; densidades La Plata adaptadas a 37B con fotos protagonistas; gates de captura como aceptación; checkpoint del dueño antes del build final.

**Non-Goals:** nuevo modelo de datos, nuevos tokens/paleta, nuevas rutas, backend, recolección PA-01/PA-02 (placeholders marcados quedan), copy final con sign-off más allá del checkpoint (PA-06 sigue dueño del cierre).

## Decisions

- **D1 — Archivar C-11 primero, C-12 construye encima.** Alternativa: absorber su scope en C-12 — descartada porque C-11 está 11/11 aplicado y su archive es el registro canónico; absorberlo duplicaría tasks y borraría trazabilidad. Los 4 aportes C-11 se verifican en el árbol antes de tocar nada (task 1) y ningún task C-12 los reimplementa.
- **D2 — Nueva capacidad `front` (no editar los 9 specs).** Alternativa: MODIFIED sobre `catalogo`, `galeria`, `contacto-ubicacion`, `design-system` — descartada porque esos specs archivados describen comportamiento vigente que el contrato KB-11 solo afina en layout; el delta `front` declara lo nuevo y anota la supersesión visual, preservando la historia.
- **D3 — Layout: `.contenedor` existente extendido + CSS de layout por página en `global.css` con tokens `@theme`.** Alternativa: utilidades Tailwind arbitrarias por página — descartada (literales repetidos, deriva visual). Header/footer a full-width solo en fondos; contenido siempre en columna ~70rem. Cards con altura fija de imagen (4/3 catálogo, 16/9 portada categoría ~22rem máx) vía CSS, sin tocar props.
- **D4 — F1: swap a foto limpia del dueño; sin ella, placeholder marcado "ilustrativa" + pedido registrado.** Alternativa: retocar la foto con precio (tapar el precio) — descartada (fragilidad R2, mala señal de taller). El producto `espejo-panoramico.json` apunta a la nueva imagen; la vieja se elimina del árbol o queda fuera de referencias.
- **D5 — F2: diagnóstico primero (contenido sin foto vs SVG roto), luego regla de no-vacío en `ProductCard`/grillas.** Todo producto sin foto real resuelve badge "ilustrativa" por defecto; build advierte (warn) pero nunca pinta caja vacía. Alternativa: ocultar productos sin foto — descartada (rompe RN-CAT-04 y el conteo del catálogo).
- **D6 — F3: pasada no-ai-slop sobre descripciones en contenido (no en markup).** Se editan los `.json` de contenido quitando "Consultanos por WhatsApp" de descripciones; los botones conservan el CTA. Voz de taller concreta, sin claims. Alternativa: filtrar por CSS/JS en render — descartada (ensucia markup, rompe tests de contenido).
- **D7 — F4: solo aire/contraste en oscuro, 37B intacta.** Se ajustan densidades, espaciados y superficies del tema oscuro con tokens existentes; cero colores nuevos (R3). Verificación AA en las 4 combinaciones.
- **D8 — Gates Playwright lado a lado (mobile/desktop × claro/oscuro) vs demos, con checkpoint del dueño.** Script de capturas reutilizable (nuevo `tests/` o `scripts/` solo para capturas, fuera del build); si Playwright no está disponible, fallback manual con checklist firmado — registrado, nunca silencioso. El checkpoint (task intermedio) bloquea los tasks finales hasta el sign-off.
- **D9 — Estilo: frontend-design + design-taste-frontend (densidad La Plata adaptada a 37B, fotos protagonistas, no-template) + impeccable Persuade con pasadas acotadas + ui-ux-pro-max para densidad de cards (consultar su search tool si corre; si no, registry rules + nota).** Accesibilidad (foco visible, orden de headings, `aria-live` donde existe) y SEO/NAP intactos se verifican en gates, no como decoración.

## Risks / Trade-offs

- [F1 sin foto limpia del dueño] → Mitigación: placeholder marcado + pedido registrado; no bloquea el rebuild.
- [Playwright no instalable en la máquina] → Mitigación: capturas manuales equivalentes + checklist de 4 combinaciones firmado en el resumen; registrado como desviación.
- [Rebuild rompe tests de contenido existentes] → Mitigación: safety net TDD (baseline `check` + suite antes de tocar código; si algo falla pre-existente, frenar y reportar, no arreglar en silencio).
- [Contenedor ~70rem pelea con grillas C-05/C-06] → Mitigación: grillas viven DENTRO del contenedor; verificación en 4 combinaciones.
- [Copy checkpoint sin respuesta del dueño] → Mitigación: draft no-ai-slop que cumple R2 desde el día uno; el checkpoint espera sign-off pero los tasks visuales no dependen del copy final.

## Migration Plan

Cambio puramente estático: safety net → rebuild por páginas/componentes → F1–F5 → checkpoint con capturas → gates finales (`astro check` 0, suite verde, `astro build` + `dist/`). Rollback = revert del diff (sin migraciones, env ni endpoints). R7: no commitear ni pushear; planning no toca código.

## Open Questions

- Q1 (checkpoint, default: foto limpia del taller a pedir): ¿qué foto reemplaza a `espejo-panoramico-gancho.jpg`? No cambia specs ni tasks (una sola referencia de imagen + registro del pedido).
- Q2 (checkpoint, draft en tasks): ¿sign-off del copy hero/descripciones tras la pasada no-ai-slop? PA-06 / dueño; el draft cumple R2 desde el día uno.
