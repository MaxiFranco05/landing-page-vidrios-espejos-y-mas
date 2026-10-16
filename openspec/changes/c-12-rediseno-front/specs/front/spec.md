# Spec Delta

## Purpose

Define el sistema visual del front: orden, densidad y reglas de presentación del home, catálogo, páginas por categoría, header/footer/404 y los fixes F1–F5, con gates de captura como aceptación.

## ADDED Requirements

### Requirement: Orden y densidad del home

El sistema SHALL renderizar el home en el orden hero → Lo que hacemos (`#hacemos`) → Trabajos destacados (`#destacados` + alias oculto `#trabajos`) → Opiniones (`#opiniones`) → Contacto y ubicación juntos (`#contacto` con `#ubicacion` interna), con contenido acotado a columna ~70rem centrada.

#### Scenario: Orden del home en HTML

- **WHEN** se lee el HTML del home
- **THEN** las secciones aparecen en el orden del contrato y `#trabajos` sigue resolviendo al bloque de destacados

#### Scenario: Columna centrada sin full-width de contenido

- **WHEN** se renderiza el home en viewport ≥1280px
- **THEN** el contenido queda acotado a ~70rem centrado con padding lateral, sin scroll horizontal; solo fondos llegan a sangre

### Requirement: Hero según contrato

El sistema SHALL abrir el home con un hero con h1 único "Vidrios, espejos y mas", línea de zona, filete, propuesta de valor de 1 línea (sin precios/medidas/claims), CTA WhatsApp genérico (número desde `datosContacto`) y foto protagonista con `alt` y carga eager.

#### Scenario: Hero completo y sin placeholder

- **WHEN** se lee el HTML del home
- **THEN** existe un solo h1 con el nombre del negocio, un CTA `wa.me` genérico encodeado y una imagen existente con `alt`; no queda texto placeholder

#### Scenario: Hero accesible

- **WHEN** se audita con teclado y lector
- **THEN** el h1 precede a los h2, el CTA tiene nombre de destino y la imagen lleva `alt` descriptivo

### Requirement: Bloque Lo que hacemos

El sistema SHALL mostrar exactamente las 4 categorías RN-CAT-01 como cards (portada + 1 línea + link "Ver catálogo"), sin listados de productos en el home.

#### Scenario: Cuatro cards sin listados

- **WHEN** se renderiza `#hacemos`
- **THEN** hay 4 cards (una por categoría) con link a su página y ningún producto listado

### Requirement: Destacados y opiniones según contrato

El sistema SHALL mostrar destacados como imagen grande + carousel con nombre (click, flechas, swipe, teclado) solo con trabajos con foto real o ilustrativa marcada, y opiniones con las 7 reseñas verbatim en grilla-en-carousel con puntos.

#### Scenario: Destacados sin trabajos sin foto

- **WHEN** se renderiza `#destacados`
- **THEN** todo item visible tiene foto real o badge "ilustrativa" y el carousel responde a click, flechas, swipe y teclado

#### Scenario: Opiniones verbatim con puntos

- **WHEN** se renderiza `#opiniones`
- **THEN** aparecen las 7 reseñas reales sin agregados y la navegación por puntos funciona con `aria-live`

### Requirement: Contacto y ubicación en una sección

El sistema SHALL presentar `#contacto` como UNA sección con dos bloques inline (datos + horarios + CTAs | mapa compacto + "Cómo llegar"), lado a lado en desktop y apilados en mobile; prohibidas secciones separadas o mapa full-width.

#### Scenario: Una sección con dos bloques

- **WHEN** se lee el HTML del home
- **THEN** `#ubicacion` vive dentro de `#contacto` y ambos anclas resuelven; en desktop los bloques van lado a lado

### Requirement: Catálogo compacto por categoría

El sistema SHALL renderizar `/catalogo` por categoría de forma compacta: h2 + UNA línea de descripción + link "Ver todo →", sin portadas gigantes; cards uniformes (imagen 4/3 altura fija + nombre + UNA línea + botón "Pedir presupuesto").

#### Scenario: Catálogo compacto

- **WHEN** se renderiza `/catalogo`
- **THEN** cada categoría muestra h2, una línea y "Ver todo →", y cada card tiene imagen 4/3, nombre, una línea y botón de presupuesto

#### Scenario: Sin botones idénticos sin jerarquía

- **WHEN** se revisa `/catalogo`
- **THEN** no hay ×13 botones idénticos sin jerarquía; el de la categoría destacada puede diferenciarse

### Requirement: Página por categoría acotada

El sistema SHALL renderizar `/categoria/[slug]` con portada acotada (16/9, altura máxima ~22rem, nunca full-bleed gigante) + título + 1 línea + grilla de productos con las mismas cards, y 404 para slug inexistente.

#### Scenario: Portada acotada y 404

- **WHEN** se visita una categoría válida y una inválida
- **THEN** la válida muestra portada acotada y grilla; la inválida responde 404

### Requirement: Header, footer y 404 con densidad

El sistema SHALL mantener estructura y contenido de header/footer/404 pasando solo el tamiz de densidad La Plata (columna ~70rem, aire entre bloques), con NAP idéntico en header/footer/JSON-LD.

#### Scenario: NAP idéntico

- **WHEN** se comparan header, footer y JSON-LD
- **THEN** la dirección y zona son idénticas (26 de Julio, M5620) en los tres

### Requirement: F1 — foto panorámica reemplazada

El sistema SHALL NO mostrar `espejo-panoramico-gancho.jpg` con precio impreso en ninguna página; en su lugar muestra foto limpia del dueño o placeholder marcado "ilustrativa", con pedido de foto registrado al dueño.

#### Scenario: Sin foto con precio en píxeles

- **WHEN** se inspeccionan las imágenes del sitio y el producto panorámico
- **THEN** ninguna imagen visible contiene precio impreso y el producto resuelve foto limpia o badge ilustrativo

### Requirement: F2 — regla de no-vacío en cajas de imagen

El sistema SHALL garantizar que ninguna caja de imagen del catálogo quede vacía: todo producto resuelve foto real o badge "ilustrativa"; la causa (producto sin foto o SVG roto) queda diagnosticada y registrada.

#### Scenario: Cero cajas vacías

- **WHEN** se renderizan `/catalogo` y cada `/categoria/[slug]`
- **THEN** toda caja de imagen pinta foto o badge ilustrativo; ninguna queda vacía

### Requirement: F3 — copy sin repetición no-ai-slop

El sistema SHALL NO repetir "Consultanos por WhatsApp" (ni equivalente) en descripciones de categorías/productos; el CTA vive solo en botones, en voz concreta de taller y sin claims inventados.

#### Scenario: Descripciones sin CTA repetido

- **WHEN** se leen todas las descripciones del catálogo
- **THEN** ninguna contiene la línea de CTA repetida; los botones sí la llevan

### Requirement: F4 — tema oscuro con densidad

El sistema SHALL aplicar densidades y superficies del tema oscuro con la paleta 37B intacta (solo aire/contraste), sin secciones sin tematizar y con contraste AA.

#### Scenario: Oscuro tematizado y legible

- **WHEN** se alterna claro/oscuro en mobile y desktop
- **THEN** no hay secciones sin tematizar ni flash de tema y el contraste es AA en ambos

### Requirement: F5 — mapa compacto consolidado

El sistema SHALL presentar el mapa como tarjeta compacta centrada (consolida prototipo C-11), con embed real + dirección en texto + "Abrir en Google Maps" siempre en DOM y valores desde `datosContacto` (R4).

#### Scenario: Mapa compacto con fallback

- **WHEN** se renderiza `#ubicacion` con y sin bloqueo del iframe
- **THEN** el mapa es tarjeta compacta y la dirección + links siguen visibles y funcionales

### Requirement: Herencia C-11 preservada

El sistema SHALL conservar los 4 aportes C-11: test `tests/frontmatter.test.mjs` en verde con la suite, clase `.contenedor` aplicada al contenido principal, mapa compacto y hero real con imagen del taller.

#### Scenario: Suite con guarda frontmatter

- **WHEN** se corre `node --test tests/*.test.mjs`
- **THEN** la suite pasa completa incluyendo el test que falla ante `<tag>` en comentarios del frontmatter

### Requirement: Gates de captura lado a lado

El sistema SHALL verificar el rebuild con capturas Playwright lado a lado vs `demos/demo.html` y `demos/demo-c11.html` en mobile/desktop × claro/oscuro como gates de aceptación, con checkpoint del dueño ANTES de los tasks finales.

#### Scenario: Capturas como gate

- **WHEN** se evalúa la aceptación del change
- **THEN** existen capturas comparativas en las 4 combinaciones y el sign-off del dueño registrado antes del build final
