# Spec Delta

## Purpose

Da al home un layout acotado y una primera impresión de oficio: contenedor centrado, hero real con CTA a WhatsApp y mapa compacto, más una guarda de regresión que impide repetir la rotura de dev por literales `<tag>` en comentarios del frontmatter.

## ADDED Requirements

### Requirement: Contenedor centrado de ancho máximo en el home

El sistema SHALL acotar el contenido principal del home a un contenedor centrado de ~70rem con padding lateral, en mobile y desktop, usando solo tokens `@theme` existentes.

#### Scenario: Contenido acotado en desktop ancho

- **WHEN** se renderiza el home en un viewport ≥1280px
- **THEN** el bloque principal no supera ~70rem de ancho, queda centrado horizontalmente y conserva padding lateral sin scroll horizontal

#### Scenario: Sin bandas sin tematizar

- **WHEN** se alterna claro/oscuro en mobile y desktop
- **THEN** el contenedor y sus fondos usan superficies del sistema en ambos temas, sin secciones sin tematizar

### Requirement: Hero real con propuesta de valor y CTA a WhatsApp

El sistema SHALL renderizar al inicio del home un hero con h1 único, línea de propuesta de valor en voz de taller, CTA WhatsApp genérico (número desde `datosContacto`, R4) e imagen principal reutilizando una portada real de `public/images/categorias` con `alt` descriptivo y carga eager.

#### Scenario: Hero reemplaza el placeholder C-01

- **WHEN** se lee el HTML del home
- **THEN** existe un hero con un solo h1, un CTA `wa.me` con mensaje genérico encodeado y una imagen de portada existente; el párrafo placeholder del scaffolding C-01 ya no existe

#### Scenario: Copy sin precios, medidas ni afirmaciones inventadas

- **WHEN** se revisa el texto del hero
- **THEN** no contiene precios, medidas, estadísticas ni promesas de envío (R2 / RN-CAT-02 / RN-GL-02) y nombra zona real (Gral. Alvear) sin claims no verificables

#### Scenario: Hero accesible y performante

- **WHEN** se audita el hero con teclado y lector de pantalla
- **THEN** el orden de headings es lógico (h1 del hero antes que los h2), el CTA tiene nombre de destino y la imagen lleva `alt` descriptivo con carga prioritaria

### Requirement: Mapa compacto centrado con contrato intacto

El sistema SHALL presentar `MapEmbed` en `/#ubicacion` como tarjeta compacta centrada de altura acotada, manteniendo embed real + dirección en texto + link "Abrir en Google Maps" siempre en DOM y props/R4 sin cambios.

#### Scenario: Mapa acotado sin perder fallback

- **WHEN** se renderiza `/#ubicacion` en mobile y desktop, con y sin bloqueo del iframe
- **THEN** el mapa ocupa una tarjeta centrada de altura acotada (no domina la vista) y la dirección en texto + el link a Maps siguen visibles y funcionales con el iframe bloqueado

#### Scenario: Sin hardcodeo de contacto o mapas

- **WHEN** se inspeccionan los valores de número, dirección, `maps_url` y `maps_embed_url` del home
- **THEN** todos se resuelven desde `datosContacto`; ningún componente hardcodea esos valores (R4 / RN-WA-03)

### Requirement: Regresión anti-`<tag>` en comentarios del frontmatter

El sistema SHALL incluir un test que falla si cualquier archivo `.astro` contiene un literal de etiqueta HTML dentro de un comentario del bloque frontmatter (`---`), causa raíz de la rotura de dev del 2026-10-15; la única excepción permitida es el propio test.

#### Scenario: Literal `<tag>` en comentario de frontmatter hace fallar el test

- **WHEN** un `.astro` contiene `<` + nombre de etiqueta + `>` dentro de un comentario del frontmatter
- **THEN** el test de regresión falla identificando archivo y línea

#### Scenario: Uso legítimo fuera de comentarios no falla

- **WHEN** los `.astro` solo usan etiquetas en markup real o en comentarios fuera del frontmatter
- **THEN** el test pasa en verde junto al resto de la suite (`node --test tests/*.test.mjs`)
