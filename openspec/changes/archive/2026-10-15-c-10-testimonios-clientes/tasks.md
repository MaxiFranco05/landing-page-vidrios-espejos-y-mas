# Tasks — c-10-testimonios-clientes

## 1. Datos versionados + validación

- [x] 1.1 Agregar `testimonioSchema` (+ array de 7 exactos) a `src/lib/content-schemas.ts` y verificar con `npm test` que el schema acepta el seed válido y rechaza comentario vacío, `calificacion != 5` y `fuente` distinta de "Google Maps"
- [x] 1.2 Crear `src/data/testimonios.json` con las 7 reseñas verbatim (copiar textos del change context sin reescribir: tildes, comillas y `!!!` intactos) y verificar que el JSON parsea y tiene 7 entradas
- [x] 1.3 Crear `src/lib/testimonios.ts` (loader D5 que parsea el JSON con Zod, patrón `datos-contacto.ts`) y verificar importándolo desde un test `node:test`
- [x] 1.4 Agregar `tests/testimonios.test.mjs` con gate verbatim byte-a-byte de los 7 comentarios + gate `assertSinPrecioNiMedida` sobre cada entrada, y verificar que `npm test` pasa y que alterar un carácter del JSON rompe el test

## 2. Componente Testimonios + isla

- [x] 2.1 Crear `src/components/Testimonios.astro` con SSR de las 7 tarjetas (`section#opiniones`, `figure > .testi-estrellas[role=img]` + `blockquote` + `figcaption > strong + span fuente`, caption `aria-live="polite"`, 7 dots con `aria-pressed`/`aria-label`) usando solo tokens `@theme` existentes, y verificar visualmente en `npm run dev` en claro y oscuro
- [x] 2.2 Agregar el `<script>` co-ubicado (dots + flechas de teclado con wrap + swipe ≥40px con `touch-action: pan-y` en CSS + caption "Mostrando opinión N de 7", adaptado de `demos/demo.html` sin flechas) y verificar navegando solo con teclado y con swipe emulado en mobile que dots y caption se sincronizan
- [x] 2.3 Agregar estilos responsive (grilla multicolumna ≥720px sin scroll, carrusel 1-visible con `scroll-snap` en móvil, dots 44px con `flex-wrap`, foco visible, `@media prefers-reduced-motion` sin animación ni snap) y verificar en viewports 360px y 1280px que no hay desborde horizontal

## 3. Integración en home + verificación final

- [x] 3.1 Insertar `<Testimonios/>` en `src/pages/index.astro` entre el bloque C-06 y `#contacto` (con marcadores `<!-- C-10 -->`), y verificar en el HTML emitido que el orden es `#destacados` → `#opiniones` → `#contacto` y que sin JS las 7 tarjetas son visibles
- [x] 3.2 Verificar reglas duras en el HTML final: sin precio/medida (R2), sin número de WhatsApp hardcodeado (R4), sin `tailwind.config` ni colores nuevos (R3), sin agregados ("7 reseñas"/promedios/sellos) y cada tarjeta con su 5★ individual, y contraste AA de tarjetas/dots/caption en ambos temas
- [x] 3.3 Correr `npm run check` limpio + `npm run build` verde + `npm test` verde, y verificar que `dist/` no incluye `demos/` y la sección responde en el preview
