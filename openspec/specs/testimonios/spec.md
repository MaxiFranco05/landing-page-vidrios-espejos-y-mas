# testimonios Specification

## Purpose

Exponer en el home las 7 opiniones reales de clientes de Google Maps como prueba social honesta, en una sección `/#opiniones` navegable por puntos, táctil y teclado, sin inventar ni agregar contenido.

## Requirements

### Requirement: Sección opiniones con las 7 reseñas verbatim

El sistema SHALL renderizar en el home una sección `/#opiniones` entre destacados y contacto con exactamente las 7 reseñas reales provistas (nombre + 5★ + comentario verbatim + fuente "Google Maps").

#### Scenario: Siete tarjetas con contenido exacto

- **WHEN** se renderiza el home con la fuente de datos versionada
- **THEN** existen 7 tarjetas con los nombres Noelia Berdus, Irma Torres, Pedro Verdugo, Lorena Berdus, Victor Hugo Franco, Adrián Pavez y Andrea Berdus, cada comentario idéntico al texto provisto y cada tarjeta con fuente "Google Maps"

#### Scenario: Texto alterado o faltante rechazado

- **WHEN** un comentario difiere del verbatim, está vacío o falta una de las 7 entradas
- **THEN** la validación de contenido falla y el build no avanza

#### Scenario: Posición entre destacados y contacto

- **WHEN** se recorre el home en orden de documento
- **THEN** la sección `id="opiniones"` aparece después de `id="destacados"` y antes de `id="contacto"`

### Requirement: Grid-inside-carousel con dots solamente

El sistema SHALL presentar las tarjetas como grilla dentro de carrusel: grilla multicolumna en desktop sin scroll, carrusel de 1 visible con scroll-snap en móvil, con navegación exclusiva por botones dot (sin flechas prev/next).

#### Scenario: Grilla en desktop

- **WHEN** el viewport es ≥720px
- **THEN** las 7 tarjetas se muestran en grilla sin scroll horizontal y los dots siguen operativos

#### Scenario: Carrusel de 1 visible en móvil

- **WHEN** el viewport es <720px
- **THEN** el visor muestra 1 tarjeta con `scroll-snap-type: x mandatory` y desplazarlo actualiza el dot activo y la caption

#### Scenario: Sin flechas de navegación

- **WHEN** se inspecciona la sección
- **THEN** no existen botones anterior/siguiente; los únicos controles son los 7 dots con `aria-pressed` reflejando el activo

### Requirement: Dots, teclado, swipe y caption anunciada

El sistema SHALL sincronizar dots, teclado y swipe táctil sobre el visor, anunciando cada cambio en una caption `aria-live="polite"` ("Mostrando opinión N de 7").

#### Scenario: Dot lleva al testimonio

- **WHEN** se activa el dot N
- **THEN** el visor desplaza la tarjeta N a la vista, el dot expone `aria-pressed="true"` y la caption anuncia "Mostrando opinión N de 7"

#### Scenario: Teclado con flechas

- **WHEN** el foco está en el visor y se pulsa FlechaDerecha o FlechaIzquierda
- **THEN** se avanza o retrocede (con wrap) y la caption se actualiza

#### Scenario: Swipe táctil con umbral 40px

- **WHEN** se desliza horizontalmente ≥40px sobre el visor
- **THEN** avanza (izquierda) o retrocede (derecha) sin romper el scroll vertical (`touch-action: pan-y`)

### Requirement: Progressive enhancement sin JS

El sistema SHALL servir las 7 tarjetas como HTML estático SSR de modo que sin JS todo el contenido sea visible y legible.

#### Scenario: Contenido visible sin JS

- **WHEN** se desactiva JavaScript y se carga el home
- **THEN** la sección `/#opiniones` muestra las 7 tarjetas completas sin tarjetas ocultas por defecto

### Requirement: Honestidad de contenido sin agregados

El sistema SHALL rotular la sección como opiniones de clientes sin afirmar agregados (conteos, promedios, sellos) más allá de lo existente; cada tarjeta muestra su 5★ individual.

#### Scenario: Sin conteos ni promedios

- **WHEN** se revisa todo texto visible de la sección
- **THEN** no contiene frases de agregado ("7 reseñas", "promedio", "X de 5") ni insignias de prueba social; solo el encabezado honesto y las 7 tarjetas con su estrella individual

#### Scenario: Estrella individual por tarjeta

- **WHEN** se inspecciona cada tarjeta
- **THEN** muestra "★★★★★" con `role="img"` y etiqueta "Calificación: 5 de 5 estrellas" (o texto equivalente), sin totales

### Requirement: Accesibilidad visual, movimiento y tema

El sistema SHALL cumplir WCAG 2.2 AA en la sección (contraste ≥4.5:1, focos visibles, dots ≥44px) en ambos temas con los tokens 37B existentes, y desactivar animación/scroll suave con `prefers-reduced-motion`.

#### Scenario: Contraste y foco en ambos temas

- **WHEN** se inspeccionan tarjetas, dots y caption en tema claro y oscuro
- **THEN** el contraste texto/fondo es ≥4.5:1 y cada dot muestra foco visible al navegar por teclado

#### Scenario: Movimiento reducido

- **WHEN** el SO pide `prefers-reduced-motion: reduce`
- **THEN** el cambio de testimonio es instantáneo (scroll `auto`, sin transiciones) y el `scroll-snap` no interfiere
