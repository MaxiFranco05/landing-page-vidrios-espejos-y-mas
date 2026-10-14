# design-system Specification

## Purpose

Da al sitio una identidad visual propia y un doble tema claro/oscuro completo, con tokens reutilizables que todos los changes de maquetado consumen y un demo que permite al dueño elegir la paleta final antes de implementarla.

## Requirements

### Requirement: Tokens Tailwind v4 CSS-first con jerarquía brand → semantic → component

El sistema SHALL definir todos los tokens visuales en `src/styles/` vía `@theme`, sin `tailwind.config.ts` (R3), con valores de color preferentemente OKLCH y jerarquía brand → semantic → component.

#### Scenario: Sin config JS y pipeline verde

- **WHEN** se inspeccionan los estilos y se ejecuta el build
- **THEN** no existe `tailwind.config.ts/js`, `global.css` contiene `@import "tailwindcss"` + bloque `@theme` con los tokens, y el build CSS termina sin errores

#### Scenario: Paleta análoga clara gama vidrio/agua

- **WHEN** se leen los tokens `--color-*` del tema claro
- **THEN** pertenecen a una gama análoga clara (celestes, verdes suaves, neutros cálidos, RN-DS-01), sin pares de opuestos estridentes, y la paleta implementada es la ganadora registrada de la decisión 37d

### Requirement: Doble tema claro/oscuro completo en BaseLayout

El sistema SHALL aplicar tema claro y oscuro como dos temas completos (el oscuro diseñado, no inversión automática) en todas las páginas vía `BaseLayout`, usando variante dark por clase.

#### Scenario: Toggle claro/oscuro en mobile y desktop

- **WHEN** un visitante alterna el tema en viewport mobile y en desktop
- **THEN** toda la página (fondo, texto, superficies, bordes, CTAs) cambia al tema correspondiente sin secciones sin tematizar ni flash del tema incorrecto al cargar

#### Scenario: Contraste AA en ambos modos

- **WHEN** se mide el contraste texto/fondo de los pares semánticos en tema claro y oscuro
- **THEN** cumple WCAG 2.2 AA (≥4.5:1 texto normal, ≥3:1 texto grande)

### Requirement: ThemeToggle respeta sistema, persiste y es accesible

El sistema SHALL exponer un `ThemeToggle` visible en el header que por defecto sigue `prefers-color-scheme`, persiste la elección en `localStorage` y funciona como botón nativo accesible por teclado.

#### Scenario: Default sigue al sistema y la elección persiste

- **WHEN** un visitante sin elección guardada abre el sitio con el SO en oscuro (o claro)
- **THEN** el sitio arranca en ese tema; y WHEN elige un tema manualmente y recarga, THEN se mantiene su elección

#### Scenario: Sin flash y operable por teclado

- **WHEN** se carga cualquier página con un tema guardado o preferencia del sistema
- **THEN** no hay flash del tema contrario antes del primer pintado; y WHEN se opera el toggle solo con teclado, THEN el tema cambia y el foco queda visible

### Requirement: Tipografía legible con carácter y wordmark tipográfico

El sistema SHALL usar como máximo 2 familias tipográficas, legibles y con carácter (nada de la sans genérica de plantilla, 39c), y una marca tipográfica simple con el nombre "Vidrios, espejos y mas" (40a+c, decisión 26b).

#### Scenario: Wordmark presente sin logo previo

- **WHEN** se renderiza el header en cualquier página
- **THEN** la marca muestra el nombre del negocio como wordmark tipográfico con los tokens de tipografía/color del sistema, sin imagen de logo externa

#### Scenario: Máximo dos tipografías con fallback del sistema

- **WHEN** se inspeccionan las familias tipográficas cargadas (o sus fallbacks sin red)
- **THEN** hay como máximo 2 familias, el cuerpo sigue legible con la pila del sistema y los titulares mantienen carácter propio

### Requirement: Criterio anti-genérico verificable

El sistema SHALL evitar layouts de plantilla genérica (RN-DS-02): las composiciones del sistema ponen las fotos reales como protagonistas y cumplen los house bans (sin eyebrow sobre cada titular, sin gradientes, sin glass/blur, sin marcadores 01/02/03 en no-secuencias).

#### Scenario: Home y demo sin patrón hero + 3 cards idénticas

- **WHEN** se revisan la home (cuando exista) y el `demo.html` de este change
- **THEN** ninguna sección repite el patrón titular + 3 cards idénticas de plantilla y cada sección visual está anclada en fotos, nombre o zona del negocio

### Requirement: demo.html como instrumento de elección de paleta

El sistema SHALL incluir en la raíz del repo un `demo.html` autocontenido (un solo archivo, sin build: doble clic y se abre) con hero + categorías + galería estilo La Plata + botón WhatsApp de ejemplo + conmutador de paletas 37A/37B/37C + claro/oscuro, que permite al dueño elegir la paleta (37d).

#### Scenario: Demo abre sin build y conmuta paletas y temas

- **WHEN** se abre `demo.html` en el navegador sin servidor ni build
- **THEN** renderiza hero, categorías, galería estilo La Plata y botón WhatsApp de ejemplo; y WHEN se conmutan las paletas A/B/C y claro/oscuro, THEN toda la demo cambia de tokens sin recargar ni errores de consola

#### Scenario: Demo fuera del sitio publicado

- **WHEN** se ejecuta `npm run build` y se inspecciona `dist/`
- **THEN** `demo.html` no aparece en `dist/` ni en ninguna ruta pública, y el deploy de Netlify (publish `dist`) no lo publica

#### Scenario: Paleta ganadora registrada

- **WHEN** el dueño elige paleta tras ver la demo (37d)
- **THEN** la elección queda registrada en el change (o en `08_arquitectura_propuesta.md`) y los tokens finales del sistema usan esa paleta
