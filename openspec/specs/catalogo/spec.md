# catalogo Specification

## Purpose

El catálogo navegable del sitio: teaser en home, página de catálogo completo y páginas por categoría que permiten al visitante orientarse y pedir presupuesto por WhatsApp sin ver precios ni medidas.

## Requirements

### Requirement: Teaser Lo que hacemos en home

El sistema SHALL renderizar en `index.astro` una sección "Lo que hacemos" con las 4 categorías reales ordenadas por `orden`, cada una con portada, nombre, descripción y link a su página.

#### Scenario: Cuatro tarjetas en orden del seed

- **WHEN** se renderiza la home
- **THEN** aparecen las 4 tarjetas (`espejos`, `muebles-de-vidrio`, `instalaciones-y-aberturas`, `servicios-y-reparaciones`) en orden ascendente de `orden`

#### Scenario: Cada tarjeta enlaza a su categoría y al catálogo

- **WHEN** se sigue el link principal de una tarjeta
- **THEN** navega a `/categoria/{slug}`; y la sección ofrece además un link a `/catalogo`

#### Scenario: Sin categoría vacía ni slug supuesto

- **WHEN** se lista el teaser
- **THEN** ninguna tarjeta apunta a slugs del seed supuesto ni a categorías sin portada (RN-CAT-01, RN-CAT-04)

### Requirement: Página de catálogo completo agrupado

El sistema SHALL exponer `/catalogo` con el catálogo completo agrupado por categoría, cada grupo con encabezado, productos ordenados y link a la página de la categoría.

#### Scenario: Cuatro grupos con sus productos

- **WHEN** se visita `/catalogo`
- **THEN** hay un grupo por cada slug real con sus productos (6 + 2 + 2 + 3 del seed DD-09) ordenados por `orden`

#### Scenario: Grupo enlaza a su página

- **WHEN** se sigue el encabezado o CTA de un grupo
- **THEN** navega a `/categoria/{slug}` correspondiente

### Requirement: Páginas por categoría prerenderizadas con 404

El sistema SHALL generar estáticamente `/categoria/{slug}` para cada slug real vía `getStaticPaths` y responder 404 para slugs inexistentes, sin servidor en runtime.

#### Scenario: Cuatro rutas generadas

- **WHEN** se ejecuta el build
- **THEN** existen `/categoria/espejos`, `/categoria/muebles-de-vidrio`, `/categoria/instalaciones-y-aberturas` y `/categoria/servicios-y-reparaciones` como HTML estático

#### Scenario: Slug inexistente da 404

- **WHEN** se visita `/categoria/no-existe`
- **THEN** el sitio responde 404 sin exponer contenido de otra categoría

#### Scenario: Productos de la categoría ordenados

- **WHEN** se visita una página de categoría
- **THEN** lista solo los productos cuya ref es ese slug, ordenados por `orden`, con foto, nombre y descripción corta

### Requirement: CTA WhatsApp por producto reutilizado

El sistema SHALL incluir en cada tarjeta de producto el botón de C-04 en variante `product` ("Pedir presupuesto", `aria-label` con el nombre) con link `wa.me` del builder existente y número solo desde `DatosContacto`.

#### Scenario: Link encodeado por producto

- **WHEN** se inspecciona el CTA de un producto
- **THEN** su `href` es `https://wa.me/<whatsapp>?text=<mensaje encodeado>` construido por `buildProductLink`, sin número hardcodeado (RN-WA-01/03, R4)

#### Scenario: Lector identifica el producto

- **WHEN** un lector recorre tarjetas con texto visible idéntico "Pedir presupuesto"
- **THEN** cada `aria-label` nombra su producto (ej. "Pedir presupuesto de Espejo nube por WhatsApp")

### Requirement: Sin precios ni medidas en el catálogo

El sistema SHALL garantizar que ninguna página, tarjeta, mensaje ni `aria-label` del catálogo contenga precio, medida o dimensión (RN-CAT-02, R2).

#### Scenario: HTML sin precio ni medida

- **WHEN** se inspecciona el HTML de home-teaser, `/catalogo` y las 4 páginas de categoría
- **THEN** no hay `$`, `precio`, `cuota`, ni patrones de medida/dimensión visibles o en atributos accesibles

### Requirement: Imágenes accesibles y presentación responsive en ambos temas

El sistema SHALL renderizar cada imagen del catálogo con `alt` descriptivo y lazy-load fuera del primer viewport, con headings lógicos, anchors nativos y layout mobile-first legible en tema claro y oscuro.

#### Scenario: Toda imagen con alt y lazy donde corresponde

- **WHEN** se inspeccionan las imágenes del teaser, catálogo y categorías
- **THEN** cada `<img>` tiene `alt` no vacío del contenido y las portadas bajo el pliegue usan `loading="lazy"` (R5)

#### Scenario: Teclado y headings

- **WHEN** se navega solo con teclado
- **THEN** todos los links/cards son alcanzables con foco visible, cada página tiene un único `h1` y los grupos/productos usan `h2`/`h3` en orden lógico

#### Scenario: Claro y oscuro sin secciones rotas

- **WHEN** se alterna el tema en mobile y desktop
- **THEN** teaser, catálogo y categorías cambian completos al tema correspondiente con contraste AA y sin flash del tema contrario
