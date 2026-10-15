# Spec Delta — galeria

## Purpose

Exponer los trabajos reales del taller en el home como prueba visual filtrable por categoría, con lightbox accesible y marcas honestas donde falte foto real.

## ADDED Requirements

### Requirement: Sección destacados filtrable y agrupada por categoría

El sistema SHALL renderizar en el home una sección `/#destacados` con los trabajos de las 4 categorías reales, filtrable por categoría y agrupada con encabezado por categoría cuando no hay filtro activo.

#### Scenario: Cuatro categorías presentes

- **WHEN** se renderiza el home con el seed real
- **THEN** la sección muestra trabajos de `espejos`, `muebles-de-vidrio`, `instalaciones-y-aberturas` y `servicios-y-reparaciones`, cada grupo con su nombre de categoría

#### Scenario: Filtro por categoría

- **WHEN** el visitante elige una categoría en el filtro
- **THEN** solo los trabajos de esa categoría quedan visibles y el botón activo expone `aria-pressed="true"`

#### Scenario: Sin secciones vacías en build

- **WHEN** una categoría no tiene trabajos válidos al construir (RN-CAT-04)
- **THEN** su grupo no se renderiza y el build advierte qué categoría quedó sin trabajos

### Requirement: Lightbox operable por teclado y táctil

El sistema SHALL abrir cada foto en un lightbox navegable con teclado (Esc cierra, flechas avanzan/retroceden), foco atrapado y devuelto al disparador, y swipe horizontal táctil con umbral 40px.

#### Scenario: Teclado completo

- **WHEN** el lightbox está abierto y se pulsa Esc, FlechaDerecha o FlechaIzquierda
- **THEN** se cierra, avanza o retrocede respectivamente y el foco vuelve al thumbnail que lo abrió al cerrar

#### Scenario: Swipe táctil

- **WHEN** se desliza horizontalmente ≥40px sobre la imagen del lightbox
- **THEN** avanza (izquierda) o retrocede (derecha) sin romper el scroll vertical (`touch-action: pan-y`)

#### Scenario: Caption anunciada

- **WHEN** cambia la foto del lightbox
- **THEN** su título/`alt` se expone en una región `aria-live="polite"` perceptible por lector de pantalla

### Requirement: Progressive enhancement sin JS

El sistema SHALL servir la grilla completa como HTML estático SSR de modo que sin JS todas las fotos y captions sean visibles y cada thumbnail enlace a la imagen directa.

#### Scenario: Grilla visible sin JS

- **WHEN** se desactiva JavaScript y se carga el home
- **THEN** la sección `/#destacados` muestra todas las fotos con sus captions y sin grupos ocultos por defecto

### Requirement: Fotos ilustrativas marcadas

El sistema SHALL mostrar insignia visible "Imagen ilustrativa" en todo trabajo con `ilustrativa:true` (RN-CN-01, PA-02), con `alt` que lo indica.

#### Scenario: Badge ilustrativo

- **WHEN** un trabajo tiene `ilustrativa:true`
- **THEN** su figura muestra la insignia y su `alt` contiene "ilustrativa/o"

#### Scenario: Foto real sin badge

- **WHEN** un trabajo no es ilustrativo
- **THEN** no muestra insignia y su `alt` describe el trabajo instalado sin mencionar ilustración

### Requirement: Accesibilidad visual y de movimiento

El sistema SHALL cumplir WCAG 2.2 AA en la galería y el lightbox: contraste ≥4.5:1 en texto/badges/controles en ambos temas, focos visibles, y `prefers-reduced-motion` que desactiva animaciones.

#### Scenario: Contraste y foco

- **WHEN** se inspeccionan badges, captions y controles del lightbox en tema claro y oscuro
- **THEN** el contraste es ≥4.5:1 y el foco de teclado es visible en cada control

#### Scenario: Movimiento reducido

- **WHEN** el SO pide `prefers-reduced-motion: reduce`
- **THEN** la galería y el lightbox cambian de foto sin animación ni transición

### Requirement: Rendimiento de imágenes

El sistema SHALL usar `loading="lazy"` y dimensiones explícitas en las fotos de la grilla (R5), reservando carga ansiosa solo a la primera imagen destacada si el diseño la define.

#### Scenario: Lazy en grilla

- **WHEN** se inspecciona el HTML de la grilla más allá de la primera imagen
- **THEN** cada `<img>` lleva `loading="lazy"` y atributos de tamaño que evitan CLS

### Requirement: Sin precio ni medidas en la galería

El sistema SHALL no mostrar precio, medida ni dimensión en títulos, descripciones, captions o alts de la galería (R2, RN-CAT-02).

#### Scenario: Texto limpio

- **WHEN** se revisa todo texto visible y `alt` de la sección
- **THEN** no contiene importes, unidades de medida ni dimensiones
