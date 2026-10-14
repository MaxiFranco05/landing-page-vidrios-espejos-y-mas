# Design — c-03-design-system-tema

## Context

Ver `proposal.md` (Why). Estado actual: `src/styles/global.css` solo declara `@import "tailwindcss"` + `@theme` vacío (mecanismo probado en C-01); `BaseLayout.astro` es un shell sin tematizar (`src/layouts/BaseLayout.astro:15-26`). Content seed ya existe (C-02: 4 categorías, productos, trabajos, `datos-contacto`), así que la demo puede usar copy real del negocio. Restricciones: Tailwind v4 CSS-first (R3), pins `tailwindcss 4.1.12` + `vite 5.4.21` intactos (DD-08), R1 (estático), R7 (no commit/push), WCAG 2.2 AA, máx. 2 tipografías, house bans anti-genéricos.

## Goals / Non-Goals

**Goals:**

- Tokens finales listos para que C-05/C-06/C-07 maqueteen sin estilos ad-hoc.
- Doble tema completo con toggle accesible y sin flash.
- `demo.html` que el dueño abre con doble clic y donde elige paleta (37d).
- Tipografía (39c) y wordmark (40a+c) definidos con criterio, no genéricos.

**Non-Goals:**

- Maquetar home/catálogo/galería reales (C-05/C-06/C-07).
- CTA WhatsApp real del sitio (C-04); la demo lleva solo un botón de ejemplo visual.
- SEO/metadatos finales (C-08). Elegir fotos reales finales (PA-02 sigue abierto; la demo usa bloques CSS/SVG, no fotos).

## Decisions

### D1 — Tres paletas candidatas 37A/37B/37C (la ganadora se registra en 37d)

Grounded en vidriería (vidrio, agua, taller, costa). Cada terna: 6 hex con nombre, análoga y clara. Se implementan las 3 conmutables en la demo; los tokens finales usan solo la ganadora.

> **37d — ganadora: 37B Azul Taller** (elegida por el dueño tras ver `demo.html`). Los tokens finales (`src/styles/global.css`) usan solo esta terna.

- **37A Vidrio Agua** (recomendada por defecto): Niebla `#EDF3F0` (fondo) · Vidrio `#D8E9E3` (superficie) · Agua `#A9CFC7` (bordes/detalles) · Profundo `#14676F` (acento, apto texto sobre claro) · Tinta `#123A3F` (texto) · Arena `#F6F1E4` (neutro cálido). Oscuro: fondo `#0E2429`, superficie `#17363D`, acento `#82CCC6`, texto `#EAF4F0`.
- **37B Azul Taller**: Humo `#EDF1F6` · Acero `#CDDBE8` · Hielo `#D9E8F5` · Azul Taller `#1E5AA8` (acento) · Tinta `#152A42` · Arena `#F4EFE3`. Oscuro: fondo `#0F1E30`, superficie `#1A2F47`, acento `#8FB8E8`, texto `#E9F1F8`.
- **37C Costa**: Cal `#FBF7EC` (fondo) · Arena `#F3EAD5` · Espuma `#D9E6D9` · Mar `#B7D4C6` · Verde Costa `#2E7D64` (acento) · Tinta `#1F352C`. Oscuro: fondo `#122419`, superficie `#1D352A`, acento `#8FD0B4`, texto `#EDF5EE`.
- Alternativa descartada: paleta complementaria (naranja/azul de alto contraste) → viola RN-DS-01 (ruido, opuestos estridentes).
- Contraste: pares texto/fondo (Tinta sobre fondo, acento sobre fondo/superficie) verificados ≥4.5:1 en ambos modos con DevTools antes de cerrar.

### D2 — Tipografía (39c): Fraunces + pila del sistema

- Display: **Fraunces** (serif óptica con carácter artesanal; nada que ver con la sans de plantilla) para titulares y wordmark. Body/UI: pila del sistema (`system-ui, -apple-system, "Segoe UI", …`) — legible, cero costo de red, funciona offline.
- Carga: Google Fonts `<link>` con `display=swap` + fallbacks (`Georgia, serif` / `system-ui`); sin red el sitio sigue correcto. Máx. 2 familias (house rule).
- Alternativa descartada: dos webfonts (display + text) → más peso y más puntos de fallo por poco ganho; la pila del sistema es la decisión legible.
- La demo usa el mismo `<link>` (con fallback); "autocontenida" = un solo archivo sin build ni dependencias locales, no offline-total.

### D3 — Tokens: `@theme` brand → semantic → component, OKLCH, dark por clase

- `src/styles/global.css`: `@import "tailwindcss"` + `@custom-variant dark (&:where(.dark, .dark *));` + `@theme` con brand (`--color-vidrio-*`, `--color-tinta-*`, `--color-arena-*`, `--font-display-*`, radios/espaciados) y semánticos que resuelven a vars CSS (`--surface-bg`, `--surface-text`, …) con override bajo `.dark`.
- Solo la paleta ganadora llega a `@theme`; las 3 ternas viven como mapas de vars en la demo.
- Alternativa descartada: `darkMode: 'class'` en config JS → no existe en v4 CSS-first (R3); la custom-variant es el mecanismo canónico.
- Sin `tailwind.config.ts` (R3); sin tocar versiones (DD-08).

### D4 — Sin flash + toggle persistente, JS mínimo sin framework

- Script inline en `<head>` de `BaseLayout` (antes del CSS): lee `localStorage('tema')` → si no hay, `matchMedia('(prefers-color-scheme: dark)')` → pone/quita `.dark` en `<html>`. Puro, ~10 líneas, cero dependencias.
- `ThemeToggle.astro`: `<button type="button" aria-pressed>` ≥24×24px con sol/luna SVG + `<script>` del componente que alterna clase, persiste y actualiza `aria-pressed`. Escucha cambios del SO solo si el usuario nunca eligió manualmente.
- Lógica pura `resolveTheme(stored, prefersDark)` en `src/lib/theme.ts` para poder testearla con `node --test` (sigue el patrón de `src/lib/*.ts` + `tests/*.test.mjs` de C-02).
- Alternativa descartada: isla React/Preact → sobredimensión para un toggle; Astro `<script>` basta (patrón islas: JS solo donde hace falta).

### D5 — Wordmark tipográfico (40a+c)

- Sin imagen de logo (decisión 26b): marca = texto "Vidrios, espejos y mas" en Fraunces 600, con "y mas" en color acento o itálica de Fraunces; bloque reutilizable (`Wordmark.astro` o fragmento en header) que C-07 reutiliza en header/footer.
- Detalle anti-genérico: filete fino color Agua/Acero/Mar bajo la marca (según paleta) + microcopy de zona "Gral. Alvear · Mendoza" — identidad local, no plantilla.

### D6 — `demo.html`: un archivo, secciones fijas, conmutadores

- Ubicación: raíz del repo (`demo.html`), excluida del build/deploy (publish `dist`; verificar ausencia en `dist/`).
- Secciones: hero con titular de oficio (ej. "Vidrios a medida, espejos y mas — Gral. Alvear") + CTA ejemplo; tira de 4 categorías (nombres reales del seed); galería estilo La Plata (lo visual: fotos grandes protagonistas con epígrafe de categoría, tira horizontal con scroll-snap + grilla; bloques de color/SVG con `alt` descriptivo como placeholder de foto, cumpliendo R5 en espíritu); botón WhatsApp de ejemplo (visual, link `#`, el real es C-04); footer con dirección real.
- Controles: conmutador A/B/C + claro/oscuro (arriba, sticky), implementado con `data-paleta`/`data-tema` en `<html>` y mapas de vars CSS; todo inline (CSS/JS en el mismo archivo).
- Copy deck real (nombres de categorías, dirección, rubro) pero sin inventar prueba social (sin reseñas ni estadísticas — house rule).
- Alternativa descartada: demo como ruta Astro (`/demo`) → entraría en `dist/` y se publicaría; la raíz la mantiene fuera del sitio.

## Risks / Trade-offs

- [Elección de paleta postergada] → Mitigación: la demo es la task 1; los tokens finales esperan 37d; el resto (toggle, layout, wordmark, tipografía) avanza en paralelo porque es agnóstico a la paleta.
- [Fraunces vía Google Fonts con red bloqueada] → Mitigación: fallbacks `Georgia, serif` definidos; el diseño debe verse correcto sin la webfont.
- [`prefers-reduced-motion` y scroll-snap de la demo] → Mitigación: media query que desactiva scroll suave/animaciones; toggle y tema cambian sin transición si el usuario la desactiva.
- [Demo diverge del sitio real] → Mitigación: la demo es instrumento descartable de decisión, no maqueta base; C-05+ parten de los tokens, no del HTML de la demo. Se documenta así en el archivo.

## Migration Plan

Sin migración: change aditivo. Rollback = revert del commit (R7: el usuario commitea). Orden de apply: demo primero (desbloquea 37d), luego tokens + BaseLayout + toggle + wordmark con la paleta ganadora.

## Open Questions

Ninguna que bloquee: las decisiones materiales (39c, 40a+c, 41a, paletas diferidas a demo) ya están tomadas y registradas arriba. La única pendiente es 37d (elección del dueño), que por diseño ocurre fuera de este change tras ver la demo.
