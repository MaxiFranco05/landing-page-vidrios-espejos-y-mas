# Tasks — c-03-design-system-tema

## 1. Demo de paletas (desbloquea la decisión 37d)

- [x] 1.1 Crear `demo.html` en la raíz (un solo archivo, CSS/JS inline, sin build) con hero + 4 categorías (nombres reales del seed) + galería estilo La Plata + botón WhatsApp de ejemplo + footer con dirección real, y verificar que abre con doble clic sin servidor ni errores de consola
- [x] 1.2 Implementar conmutador de paletas 37A/37B/37C + claro/oscuro (sticky, `data-paleta`/`data-tema` + mapas de vars con los hex de D1) y verificar que cada combinación re-tematiza toda la demo sin recargar
- [x] 1.3 Verificar accesibilidad base de la demo (`lang="es"`, foco visible, `prefers-reduced-motion` sin animaciones, placeholders con `alt` descriptivo) y que `npm run build` no incluye `demo.html` en `dist/`
- [x] 1.4 Presentar la demo al dueño y registrar la paleta ganadora (37d) en `design.md` (D1) antes de implementar los tokens finales — ganadora: 37B Azul Taller (tokens en `src/styles/global.css`)

## 2. Tokens del sistema (con la paleta ganadora de 37d)

- [x] 2.1 Poblar `@theme` en `src/styles/global.css` con la jerarquía brand → semantic → component de la paleta ganadora (valores OKLCH, `@custom-variant dark`, vars semánticas con override `.dark`; sin `tailwind.config.ts`, sin tocar versiones DD-08) y verificar que `npm run build` compila el CSS sin errores
- [x] 2.2 Añadir tipografía Fraunces (`display=swap` + fallbacks `Georgia, serif`) y pila del sistema para cuerpo, exponerlas como tokens `--font-display/--font-sans`, y verificar render con y sin red (fallback correcto)

> Nota: si 37d aún no está decidida al implementar, usar 37A Vidrio Agua por defecto; el cambio a la ganadora es un solo mapa de vars (D1).

## 3. Doble tema en BaseLayout + ThemeToggle + wordmark

- [x] 3.1 Implementar `src/lib/theme.ts` (`resolveTheme(stored, prefersDark)`) con tests `node --test` (default-sistema claro/oscuro, preferencia guardada, valor inválido) y verificar `npm test` en verde
- [x] 3.2 Añadir script anti-flash en `<head>` de `BaseLayout` + aplicación completa del tema (fondo, texto, superficies, bordes) en claro/oscuro, y verificar que no hay flash con tema guardado ni secciones sin tematizar en mobile y desktop
- [x] 3.3 Crear `ThemeToggle.astro` (botón nativo ≥24×24px, `aria-pressed`, iconos sol/luna SVG, persiste en `localStorage`, sigue al SO si no hay elección) visible en el header, y verificar operación con mouse + solo-teclado y persistencia tras recarga
- [x] 3.4 Crear wordmark tipográfico ("Vidrios, espejos y mas" en Fraunces 600 + filete de acento + microcopy "Gral. Alvear · Mendoza") reutilizable para header/footer, y verificar que renderiza sin imagen externa en ambos temas

## 4. Verificación integral y cierre

- [x] 4.1 Medir contraste AA (≥4.5:1 normal, ≥3:1 grande) de los pares semánticos en ambos temas con DevTools y corregir tokens hasta cumplir
- [x] 4.2 Pasar criterio anti-genérico RN-DS-02 sobre demo + layout (sin hero + 3 cards idénticas, sin eyebrows/gradientes/glass-blur, fotos/protagonismo real) con revisión visual en mobile y desktop
- [x] 4.3 Ejecutar `npm run check` (cero errores) + `npm run build` (excluye `demo.html`, `knowledge-base/`, `discovery/`) y dejar `npm test` en verde

## Workflow follow-up

- Archivar el change con `/opsx:archive c-03-design-system-tema` una vez revisados los artefactos y la demo.
- Marcar `[x]` C-03 en `CHANGES.md` tras el archive.
- C-05, C-06 y C-07 pueden proponerse en cuanto C-03 esté archivado (más C-02/C-04 según el árbol).
