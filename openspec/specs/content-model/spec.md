# content-model Specification

## Purpose

Contrato del modelo de contenido del sitio: define los schemas de las Content Collections, las reglas de validación que el build exige y el seed mínimo que garantiza que ninguna sección nazca vacía.

## Requirements

### Requirement: Colección categorias con slugs únicos y orden

El sistema SHALL exponer una colección `categorias` con `slug` kebab-case único, `nombre`, `descripcion`, `imagen_portada` y `orden` numérico que define el orden en home.

#### Scenario: Cuatro categorías del seed

- **WHEN** se listan las entradas de `categorias`
- **THEN** existen exactamente `espejos`, `muebles-de-vidrio`, `instalaciones-y-aberturas` y `servicios-y-reparaciones` (RN-CAT-01, catálogo real DD-09)

#### Scenario: Slug duplicado o no kebab-case rechazado

- **WHEN** dos categorías comparten `slug` o un `slug` no es kebab-case
- **THEN** la validación de contenido falla y el build no avanza

#### Scenario: Orden respected en home

- **WHEN** un consumidor lista categorías ordenadas por `orden`
- **THEN** el orden resultante coincide con el campo `orden` de cada entrada

### Requirement: Colección productos sin precio ni medidas

El sistema SHALL exponer una colección `productos` con `slug` único, `nombre`, `categoria` (ref a slug existente), `descripcion_corta`, `fotos[]` con `alt`, `destacado` y `orden`, sin ningún campo de precio o medida.

#### Scenario: Producto válido por categoría

- **WHEN** se lista `productos` por cada slug de categoría
- **THEN** `espejos` tiene 6 productos ("Espejo rectangular", "Espejo nube", "Espejo redondo", "Espejo redondo grande", "Espejo con LED", "Espejo panorámico"), `muebles-de-vidrio` tiene 2 ("Mesa ratonera de cristal", "Vitrina de vidrio"), `instalaciones-y-aberturas` tiene 2 ("Aberturas de aluminio", "Mampara para baño") y `servicios-y-reparaciones` tiene 3 ("Reparación de vidrios de ventanas", "Reparación de espejos de vehículos", "Enmarcación de logros y recuerdos"), todos con nombres sin precio ni medidas (RN-CAT-02)

#### Scenario: Ref a categoría inexistente rechazada

- **WHEN** un producto declara `categoria` con un slug que no existe en `categorias`
- **THEN** la validación de contenido falla y el build no avanza

#### Scenario: Precio o medida rechazados

- **WHEN** un producto incluye precio, medida o dimensión en cualquier campo (RN-CAT-02)
- **THEN** la validación de contenido falla y el build no avanza

### Requirement: Colección trabajos de galería por categoría

El sistema SHALL exponer una colección `trabajos` con `titulo`, `categoria` (ref existente), `fotos[]` con `alt`, `descripcion` opcional y `fecha` opcional.

#### Scenario: Dos trabajos por categoría

- **WHEN** se listan los `trabajos` por cada slug de categoría
- **THEN** cada una de las 4 categorías reales tiene al menos dos trabajos válidos remapeados a su slug (seed mínimo; placeholders con `ilustrativa: true` donde falte foto real, RN-CN-01, PA-02)

#### Scenario: Trabajo sin fotos rechazado

- **WHEN** un trabajo declara `fotos` vacío (RN-CAT-04)
- **THEN** la validación de contenido falla y el build no avanza

### Requirement: Toda foto lleva alt descriptivo

El sistema SHALL exigir que cada foto de `categorias`, `productos` y `trabajos` incluya un `alt` descriptivo no vacío (RN-CN-02).

#### Scenario: Foto sin alt rechazada

- **WHEN** cualquier foto omite `alt` o lo deja vacío
- **THEN** la validación de contenido falla y el build no avanza

#### Scenario: Placeholder marcado como ilustrativo

- **WHEN** una foto es un boceto IA por falta de foto real (RN-CN-01, PA-02)
- **THEN** la entrada la marca como ilustrativa y su `alt` lo indica

### Requirement: DatosContacto singleton como fuente de verdad

El sistema SHALL exponer un singleton `datos-contacto` con `whatsapp` en formato internacional sin `+`, `telefono_visible`, `direccion`, `zona_atencion`, `maps_url`, `maps_embed_url` y `horarios`, usado como única fuente del número (RN-WA-03).

#### Scenario: Valores canónicos del seed

- **WHEN** se lee `datos-contacto`
- **THEN** `whatsapp` es `5492625445223`, la dirección es "26 de Julio, M5620 Gral. Alvear, Mendoza" y los horarios son "Lun–Vie 8–19, Sáb 8–13, Dom cerrado"

#### Scenario: Formato de whatsapp validado

- **WHEN** `whatsapp` incluye `+`, espacios o no es numérico internacional
- **THEN** la validación de contenido falla y el build no avanza

### Requirement: Reemplazo total del seed supuesto por el catálogo real

El sistema SHALL no conservar ninguna entrada de `categorias`, `productos` o `trabajos` que referencie los slugs supuestos archivados (`vidrios-a-medida-dvh`, `estantes-comerciales`, `mesas-ratoneras`); toda ref de producto o trabajo apunta a uno de los 4 slugs reales.

#### Scenario: Sin restos del seed supuesto

- **WHEN** se listan todas las entradas de `categorias`, `productos` y `trabajos`
- **THEN** ningún `slug` ni ninguna ref `categoria` es `vidrios-a-medida-dvh`, `estantes-comerciales` ni `mesas-ratoneras`

#### Scenario: Ref rota al seed viejo rechazada

- **WHEN** un producto o trabajo declara `categoria` con un slug del seed supuesto
- **THEN** la validación de contenido falla y el build no avanza
