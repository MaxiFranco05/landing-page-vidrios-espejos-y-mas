# Spec Delta — content-model

## Purpose

Contrato del modelo de contenido del sitio: define los schemas de las Content Collections, las reglas de validación que el build exige y el seed mínimo que garantiza que ninguna sección nazca vacía.

## ADDED Requirements

### Requirement: Colección categorias con slugs únicos y orden

El sistema SHALL exponer una colección `categorias` con `slug` kebab-case único, `nombre`, `descripcion`, `imagen_portada` y `orden` numérico que define el orden en home.

#### Scenario: Cuatro categorías del seed

- **WHEN** se listan las entradas de `categorias`
- **THEN** existen exactamente `vidrios-a-medida-dvh`, `espejos`, `estantes-comerciales` y `mesas-ratoneras` (RN-CAT-01)

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
- **THEN** cada categoría tiene al menos un producto válido (seed mínimo)

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
- **THEN** cada categoría tiene al menos dos trabajos válidos (seed mínimo)

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
- **THEN** `whatsapp` es `5492625445223`, la dirección es "Estrada 912, Gral. Alvear, Mendoza" y los horarios son "Lun–Vie 8–19, Sáb 8–13, Dom cerrado"

#### Scenario: Formato de whatsapp validado

- **WHEN** `whatsapp` incluye `+`, espacios o no es numérico internacional
- **THEN** la validación de contenido falla y el build no avanza
