# Tasks

## 1. Red de seguridad + guarda frontmatter (TDD primero)

- [x] 1.1 Registrar baseline verde: correr `npm run check` (0 errores) y `node --test tests/*.test.mjs` (96/96) y anotar el resultado en el resumen de apply; si algo falla, reportar como pre-existente y frenar antes de tocar código — verificado por salida de ambos comandos.
- [x] 1.2 RED: crear `tests/frontmatter.test.mjs` (patrón `node --test` existente) que escanea `src/**/*.astro`, extrae el frontmatter y falla si un comentario `//` o `/* */` contiene un literal `<tag>`; incluir aserción negativa con strings inline (p. ej. `// ver <head> para el tema` debe detectarse) y verificar que FALLA antes del GREEN — verificado por test en rojo.
- [x] 1.3 GREEN + TRIANGULATE: implementar el escaneo real, verificar que pasa en verde sobre el árbol actual y que sigue fallando ante un fixture temporal con `<div>` en comentario de frontmatter (fixture borrado tras comprobar); correr la suite completa y verificar 97/97 — verificado por suite verde.

## 2. Contenedor centrado

- [x] 2.1 Agregar clase `.contenedor` en `src/styles/global.css` (`max-width: ~70rem`, `margin-inline: auto`, padding lateral con espaciado existente, solo tokens `@theme`, cero colores nuevos) y aplicarla al `<main>` de `src/pages/index.astro`; verificar en desktop ≥1280px que el contenido queda acotado/centrado sin scroll horizontal y que `astro check` sigue limpio — verificado por inspección visual + check.
- [x] 2.2 Verificar que la grilla asimétrica C-05 (`.hacemos-grilla`, first-child a doble ancho) sigue intacta dentro del contenedor en mobile y desktop, claro y oscuro — verificado por captura/revisión en ambos breakpoints y temas.

## 3. Hero real

- [x] 3.1 Reemplazar el bloque placeholder (`index.astro:51-55`, h1 pelado + párrafo C-01) por el hero según `demos/demo.html` "Nueva propuesta": un solo h1 con el nombre del negocio, línea de zona, filete de acento, propuesta de valor y CTA `WhatsAppButton` genérico existente (número desde `datosContacto`, R4) + imagen `public/images/categorias/espejos.jpg` (default; confirmar con dueño en revisión, ver Q1) con `alt` descriptivo y carga eager; copy draft: "Espejos, muebles de vidrio, aberturas y reparaciones para casas y locales de la zona. Escribinos por WhatsApp y te asesoramos sin compromiso." (sin precios/medidas/claims, R2; sign-off final en revisión, ver Q2) — verificado por HTML: h1 único, link `wa.me` encodeado, imagen existente con alt, placeholder C-01 ausente.
- [x] 3.2 Verificar hero accesible y tematizado: orden de headings (h1 antes que h2), CTA con nombre de destino, foco visible, contraste AA en claro/oscuro, layout apilado en mobile y asimétrico en desktop — verificado por navegación a teclado + revisión en 4 combinaciones (mobile/desktop × claro/oscuro).

## 4. Mapa compacto

- [x] 4.1 Acotar `MapEmbed.astro` solo con CSS (tarjeta centrada ~48-56rem, altura máxima que reemplace el 16/10 full-width unbounded) sin cambiar props, markup funcional, validación de props vacías ni fallback (dirección en texto + "Abrir en Google Maps" siempre en DOM; R4 intacto) — verificado por HTML (mismos hrefs/props) + revisión visual de que el mapa ya no domina la vista.
- [x] 4.2 Verificar `/#ubicacion` con iframe bloqueado (o simulado) en mobile y desktop: dirección + "Cómo llegar" + "Abrir en Google Maps" siguen visibles y funcionales — verificado por prueba con bloqueo.

## 5. Gates finales de integración

- [x] 5.1 Dejar galería/testimonios/catálogo intactos (badges ilustrativos = PA-02, fuera de scope) y correr gates: `npm run check` 0 errores, `node --test tests/*.test.mjs` 97/97, `npm run build` verde con `dist/` generado — verificado por salida de los tres comandos.
- [x] 5.2 Re-verificación visual completa del home (hero → Lo que hacemos → destacados → opiniones → contacto/ubicación) en mobile/desktop × claro/oscuro con checklist C-08 (sin flash de tema, sin secciones sin tematizar, sin `tailwind.config.ts`, paleta 37B intacta) y nota Lighthouse mobile como referencia — verificado por revisión en las 4 combinaciones + reporte de Lighthouse.

## Workflow follow-up

- Construir demo visual del look propuesto para revisión del dueño (copy del hero + elección de imagen, Q1/Q2) ANTES del apply.
- Tras revisión y apply, archivar con `/opsx:archive c-11-pulido-home`.
- R7: no commitear ni pushear sin pedido explícito.
