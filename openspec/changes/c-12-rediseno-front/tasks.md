# Tasks

## 1. Red de seguridad + reconciliación C-11 (TDD primero)

- [ ] 1.1 Registrar baseline verde: correr `npm run check` (0 errores) y `node --test tests/*.test.mjs` (anotar conteo, esperado ≥97) y `git status --short`; si algo falla, reportar como pre-existente y frenar antes de tocar código — verificado por salida de ambos comandos + conteo anotado.
- [ ] 1.2 Archivar `c-11-pulido-home` con `/opsx:archive` y verificar herencia: `tests/frontmatter.test.mjs`, `.contenedor` en `global.css`, mapa compacto y hero con `espejo-redondo-led.jpg` siguen en el árbol; ningún task C-12 los reimplementa — verificado por `openspec list --json` sin C-11 activo + los 4 archivos presentes en el diff.

## 2. Home rebuild (orden + densidad del contrato)

- [ ] 2.1 Consolidar hero según contrato (h1 único + zona + filete + valor 1 línea + CTA genérico + foto taller eager con `alt`) sobre la base C-11, apilado mobile / asimétrico desktop — verificado por HTML (h1 único, `wa.me` encodeado, sin placeholder) + teclado + 4 combinaciones mobile/desktop × claro/oscuro.
- [ ] 2.2 Rebuild `#hacemos` (4 cards: portada + 1 línea + link "Ver catálogo", sin listados) y verificar grilla asimétrica C-05 intacta dentro del contenedor — verificado por HTML (4 cards, 0 productos) + revisión en 4 combinaciones.
- [ ] 2.3 Extender `.contenedor` a catálogo/categoría, pasar header/footer/404 por el tamiz de densidad (columna ~70rem, aire entre bloques, fondos a sangre) y verificar NAP idéntico header/footer/JSON-LD — verificado por revisión en 4 combinaciones + comparación NAP literal.

## 3. Catálogo + categoría + cards (F2 nace acá)

- [ ] 3.1 RED: crear `tests/rediseno-front.test.mjs` (patrón `node --test` existente) con aserciones que FALLAN hoy: (a) ninguna descripción de contenido contiene "Consultanos por WhatsApp", (b) ningún producto referencia `espejo-panoramico-gancho.jpg`, (c) todo producto resuelve foto real o badge ilustrativo (cero cajas vacías) — verificado por test en rojo con los 3 casos fallando.
- [ ] 3.2 GREEN + TRIANGULATE: rebuild de `catalogo.astro` compacto (h2 + 1 línea + "Ver todo →", sin portadas gigantes) + cards uniformes (imagen 4/3 altura fija + nombre + 1 línea + "Pedir presupuesto", jerarquía en destacada) + regla de no-vacío en `ProductCard` (sin foto real → badge "ilustrativa", nunca caja vacía; warn en build) — verificado por test 3.1 en verde + revisión visual en 4 combinaciones.
- [ ] 3.3 Rebuild `categoria/[slug].astro` (portada 16/9 máx ~22rem + título + 1 línea + misma grilla) + 404 para slug inexistente — verificado por render de las 4 categorías + slug inválido → 404 + revisión en 4 combinaciones.

## 4. Fixes contenido + oscuro + mapa (F1/F3/F4/F5)

- [ ] 4.1 F1: apuntar `espejo-panoramico.json` a foto limpia del dueño o placeholder marcado "ilustrativa", quitar toda referencia a `espejo-panoramico-gancho.jpg` y registrar el pedido de foto al dueño (Q1) — verificado por aserción (b) del test 3.1 en verde + grep sin referencias a la foto vieja.
- [ ] 4.2 F3: pasada no-ai-slop sobre descripciones de categorías/productos (quitar "Consultanos por WhatsApp" de textos, queda solo en botones; voz concreta de taller, sin claims) — verificado por aserción (a) del test 3.1 en verde + lectura de los textos editados.
- [ ] 4.3 F4: densidades del tema oscuro (aire/contraste con tokens existentes, 37B intacta, cero colores nuevos, AA) + F5: consolidar mapa compacto centrado C-11 (contrato intacto, R4) — verificado por revisión en oscuro mobile/desktop (sin secciones sin tematizar, sin flash) + `/#ubicacion` con iframe bloqueado funcional.

## 5. Checkpoint del dueño (GATE: bloquea el grupo 6)

- [ ] 5.1 Capturas Playwright lado a lado vs `demos/demo.html` + `demos/demo-c11.html` en mobile/desktop × claro/oscuro (script reutilizable; si Playwright no corre, capturas manuales equivalentes + nota registrada, nunca silencioso) y presentar al dueño para sign-off Q1 (foto F1) + Q2 (copy) — verificado por set de capturas archivado en el change + sign-off registrado antes de seguir.

## 6. Gates finales de integración

- [ ] 6.1 Correr gates: `npm run check` 0 errores, `node --test tests/*.test.mjs` suite completa en verde (incluye `frontmatter` + `rediseno-front`), `npm run build` verde con `dist/` — verificado por salida de los tres comandos.
- [ ] 6.2 Re-verificación visual completa (home → catálogo → categoría → 404) en 4 combinaciones con checklist C-08/RN-DS-02 (no-template, fotos protagonistas, foco visible, `aria-live` donde aplica) + nota Lighthouse mobile como referencia — verificado por revisión firmada en las 4 combinaciones.

## Workflow follow-up

- Tras sign-off y gates verdes, archivar con `/opsx:archive c-12-rediseno-front`.
- R7: no commitear ni pushear sin pedido explícito del usuario.
