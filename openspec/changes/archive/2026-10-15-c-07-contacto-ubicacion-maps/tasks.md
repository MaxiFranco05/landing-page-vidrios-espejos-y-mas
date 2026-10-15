# Tasks

## 1. Componentes NAP + mapa (base sin layout)

- [x] 1.1 Crear `src/components/ContactInfo.astro` (props: direccion, zona, horarios, whatsapp, telefonoVisible; reutiliza `WhatsAppButton` genérico + `buildTelLink`, sin hardcodear valores) y verificar que renderiza NAP idéntico con `npm test` en `tests/contacto-ubicacion.test.mjs` (assert de cadenas canónicas + `tel:+5492625445223`).
- [x] 1.2 Crear `src/components/MapEmbed.astro` (props: embedUrl, mapsUrl, direccion; `iframe` con `title`, `loading="lazy"`, `<address>` en texto + link "Abrir en Google Maps" `target="_blank" rel="noopener"`) y verificar con test de igualdad exacta (`iframe src === maps_embed_url`, link `href === maps_url`) más `rg -n "google\.com/maps|Estrada 912|5492625445223" src/components` sin literales fuera de props/tests.
- [x] 1.3 Verificar progressive enhancement sin JS/red: con el iframe bloqueado (devtools request-blocking o JS deshabilitado) la dirección en texto + "Abrir en Google Maps" + `tel:` siguen visibles y funcionales en el HTML servido.

## 2. Header, footer y secciones home

- [x] 2.1 Extender `src/layouts/BaseLayout.astro` con header (marca + nav + `tel:` + WhatsApp genérico + `ThemeToggle`) y footer (instancia `ContactInfo` + link "Cómo llegar"), pasando `datosContacto` por props (R4), y verificar con `npm run check` limpio y test de que header/footer comparten el mismo NAP (una sola fuente).
- [x] 2.2 Añadir secciones `/#contacto` y `/#ubicacion` en `src/pages/index.astro` (headings en orden lógico, `scroll-margin-top`, `ContactInfo` + `MapEmbed` + botón "Cómo llegar"), reutilizando el sticky CTA de C-04 sin duplicarlo, y verificar que `/\#contacto` y `/\#ubicacion` hacen scroll a la sección con JS deshabilitado.
- [x] 2.3 Verificar NAP + a11y de las secciones: test que afirma dirección/zona/horarios idénticos en header, `/#contacto`, `/#ubicacion` y footer; tabulación muestra foco visible en tel/WhatsApp/Maps y el iframe expone `title` (inspección + `npm test`).

## 3. Menú mobile mínimo (única isla nueva)

- [x] 3.1 Crear `src/components/MobileMenu.astro` con `<details><summary>` nativo (enlaces a `/#contacto`, `/#ubicacion` + secciones existentes) + micro-script (Escape, cierre-al-navegar, `aria-expanded`), visible solo en mobile (`md+` nav horizontal por CSS), y verificar operabilidad total por teclado/tacto con foco visible.
- [x] 3.2 Verificar no-JS del menú: con JS deshabilitado los enlaces a `/#contacto` y `/#ubicacion` permanecen alcanzables (panel `<details>` abre nativo o el header/footer los expone) y el `summary` usa `<button>`-like nativo sin `div`-button.

## 4. Verificación integral del change

- [x] 4.1 Verificación manual del destino (binding): abrir "Cómo llegar" en desktop y mobile y confirmar que Google Maps centra la ficha "Vidrios, espejos y mas, Estrada 912, Gral. Alvear" (no búsqueda genérica ni otra ciudad); registrar evidencia (URL + captura) en el reporte del apply.
- [x] 4.2 Pasar calidad completa: `npm test` verde + `npm run check` sin errores + `npm run build` con `dist/index.html` que contiene `/#contacto`, `/#ubicacion`, `tel:+5492625445223`, `wa.me/5492625445223` y el `pb=` exacto del embed; contraste AA claro/oscuro en contacto/ubicación/footer y sin `tailwind.config.*` ni endpoints nuevos (R1/R3).
