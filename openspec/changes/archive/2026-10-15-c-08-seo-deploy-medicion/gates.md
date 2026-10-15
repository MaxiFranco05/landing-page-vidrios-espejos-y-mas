# Gates 7.1 + 7.2 — c-08-seo-deploy-medicion (2026-10-15)

## 7.1 Anti-slop visual `impeccable` (modo Persuade, identidad 37B preservada)

Pasada acotada (bounded): el change no rediseña — verificación de
no-regresión + checklist sobre home / catálogo / 1 categoría.

- [x] Cero cambios en `src/styles/` y tokens (`git diff --name-only`:
      ningún CSS tocado; contraste AA ambos temas = standing de C-03/C-07).
- [x] Sin hero + 3 cards idénticas: teaser home asimétrico (primera
      portada a doble ancho, D6 C-05) intacto; sin bloques nuevos.
- [x] Sin estilos de plantilla añadidos: `git diff` de layouts/components/
      pages no introduce `gradient|glass|blur|bounce` (grep vacío).
- [x] Fotos protagonistas: grilla/galería/portadas intactas; `fetchpriority=high`
      solo en las 2 imágenes sobre el pliegue (LCP); resto `lazy` + R5.
- [x] Tipografías: Fraunces + sistema sin cambios; sin fuentes nuevas.
- [x] Top-3 fixes: sin FAILs — nada que corregir (pasada de preservación).

## 7.2 Finish accesibilidad WCAG 2.2 AA

- [x] Foco visible con teclado: `:focus-visible` global intacto
      (assert en `tests/contacto-ubicacion.test.mjs`) + CTAs con
      `focus-visible:outline` (clases Tailwind intactas en dist).
- [x] Contraste AA ambos temas: cero cambios de color/tokens en el change.
- [x] `aria-labels` de CTAs intactos en dist: "Pedir presupuesto de … por
      WhatsApp", "Consultar por otro trabajo por WhatsApp",
      "Llamar al +54 9 … por teléfono", "Cómo llegar … en Google Maps",
      "Abrir en Google Maps …" (verificado en `dist/index.html`).
- [x] Recorrido de teclado completo: anclas/botones nativos preservados;
      el listener de medición no hace `preventDefault` ni mueve el foco;
      sin `tabindex` añadidos (grep vacío); sin `div-button`.
- [x] Lighthouse a11y ≥90: CLI no disponible localmente → residual
      post-deploy (igual que 6.2; ver reporte de cierre).
