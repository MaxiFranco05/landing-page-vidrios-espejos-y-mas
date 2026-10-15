# Spec Delta

## Purpose

Contacto y ubicación que cierran la visita: teléfono y WhatsApp siempre a mano, dirección y horarios consistentes, mapa embebido real con fallback y acceso rápido a "Cómo llegar" (US-005 resto, US-006, Flujo 2).

## ADDED Requirements

### Requirement: NAP consistente en todo el sitio

El sistema SHALL mostrar el mismo nombre, dirección "Estrada 912, Gral. Alvear, Mendoza", zona "Gral. Alvear y alrededores" y horarios "Lun–Vie 8–19, Sáb 8–13, Dom cerrado" en header, `/#contacto`, `/#ubicacion` y footer (RN-CN-03, lente local-business para C-08).

#### Scenario: NAP idéntico en las cuatro superficies

- **WHEN** se lee el HTML de header, `/#contacto`, `/#ubicacion` y footer
- **THEN** la dirección, la zona y los horarios son cadenas idénticas en las cuatro, sin variantes ni abreviaturas distintas

#### Scenario: Teléfono con formato llamada consistente

- **WHEN** se inspeccionan los links telefónicos del header, contacto y footer
- **THEN** todos usan `tel:+5492625445223` con el mismo texto visible derivado de `telefono_visible`

### Requirement: Header con teléfono y WhatsApp siempre visibles

El sistema SHALL exponer en el `Header` un link `tel:` y un CTA de WhatsApp (variante genérica de C-04) visibles en mobile y desktop, junto a marca y `ThemeToggle` existentes.

#### Scenario: Contacto a un toque desde cualquier página

- **WHEN** un visitante abre cualquier página en viewport mobile o desktop
- **THEN** el header muestra el teléfono como link `tel:` y el CTA de WhatsApp sin scroll ni menú previo

#### Scenario: Sin duplicar patrones de C-04

- **WHEN** se inspecciona el código del header
- **THEN** el CTA reutiliza `WhatsAppButton` y `buildTelLink`/`buildGenericLink` sin reimplementar mensajes ni encodeo

### Requirement: Secciones anclables contacto y ubicación en home

El sistema SHALL exponer las secciones `/#contacto` (tel + WhatsApp + horarios) y `/#ubicacion` (dirección en texto + mapa + "Cómo llegar") con headings en orden lógico y anclas navegables por teclado.

#### Scenario: Anclas profundas funcionan sin JS

- **WHEN** se visita `/\#contacto` o `/\#ubicacion` con JS deshabilitado
- **THEN** el navegador hace scroll a la sección correspondiente y su heading es el siguiente nivel lógico tras el anterior

#### Scenario: Contacto ofrece llamar o escribir

- **WHEN** un visitante llega a `/#contacto`
- **THEN** ve el link `tel:` visible y el CTA genérico de WhatsApp con el fallback telefónico de C-04 (RN-WA-04)

### Requirement: Mapa embebido real con progressive enhancement

El sistema SHALL renderizar `MapEmbed` con la `maps_embed_url` REAL de `datos-contacto.json` en un `iframe` con `title`, `loading="lazy"` y dirección en texto + link "Abrir en Google Maps" siempre visibles, de modo que el bloqueo del iframe no rompa la ubicación (Flujo 2 error).

#### Scenario: Embed carga la ficha real

- **WHEN** se renderiza `/#ubicacion` con red disponible
- **THEN** el `iframe` usa exactamente la `maps_embed_url` del singleton, con `title` descriptivo y `loading="lazy"`

#### Scenario: Embed bloqueado no rompe la ubicación

- **WHEN** el iframe está bloqueado (adblock/offline/JS deshabilitado)
- **THEN** la dirección en texto y el link "Abrir en Google Maps" siguen visibles y funcionales sin depender del iframe

### Requirement: Botón Cómo llegar abre el destino correcto

El sistema SHALL exponer un botón "Cómo llegar" en `/#ubicacion` (y link equivalente en footer) que abre `maps_url` en pestaña nueva con `rel="noopener"`, apuntando a la ficha "Vidrios, espejos y mas, Estrada 912".

#### Scenario: Link abre Google Maps con el destino correcto

- **WHEN** un visitante activa "Cómo llegar"
- **THEN** se abre `https://www.google.com/maps/search/?api=1&query=Vidrios,+espejos+y+mas+Estrada+912+General+Alvear+Mendoza` (valor de `maps_url`) en pestaña nueva

#### Scenario: Destino verificado en la task de implementación

- **WHEN** se ejecuta la verificación manual de C-07
- **THEN** el mapa abierto centra la ficha del negocio en Estrada 912, Gral. Alvear (no una búsqueda genérica ni otra ciudad)

### Requirement: Fuente única para número, dirección y mapas

El sistema SHALL resolver número, teléfono visible, dirección, zona, horarios, `maps_url` y `maps_embed_url` exclusivamente desde `datosContacto`; ningún componente SHALL hardcodear esos valores (R4 / RN-WA-03).

#### Scenario: Cambio en el singleton se propaga

- **WHEN** `datos-contacto.json` cambia su dirección o sus URLs de Maps
- **THEN** header, contacto, ubicación y footer muestran los nuevos valores sin editar componentes

#### Scenario: Literal hardcodeado es defecto

- **WHEN** se inspecciona el código de este change
- **THEN** no existe el literal `5492625445223`, `Estrada 912` ni `google.com/maps` fuera del seed, sus tests y los artifacts de planificación

### Requirement: Menú mobile mínimo con acceso a contacto y ubicación

El sistema SHALL proveer un menú mobile como única isla JS nueva: botón nativo que abre/cierra, con enlaces a `/#contacto` y `/#ubicacion` (+ catálogo/trabajos existentes); sin JS los enlaces siguen alcanzables como anclas.

#### Scenario: Menú operable por teclado y táctil

- **WHEN** se abre el menú en viewport mobile solo con teclado o tacto
- **THEN** el foco queda visible y gestionado, Escape o el botón lo cierra, y cada enlace navega a su ancla

#### Scenario: Sin JS el contacto sigue alcanzable

- **WHEN** se carga la página con JS deshabilitado
- **THEN** los enlaces a `/#contacto` y `/#ubicacion` permanecen visibles o el header/footer los expone sin depender de la isla

### Requirement: Accesibilidad WCAG 2.2 AA en contacto y ubicación

El sistema SHALL usar anclas `<a href>` nativas para tel/WhatsApp/Maps, foco visible en todos los interactivos, targets táctiles ≥44px e iframe con `title`; los textos de enlace nombran su destino (no "clic aquí").

#### Scenario: Lector de pantalla identifica cada destino

- **WHEN** un lector recorre `/#contacto` y `/#ubicacion`
- **THEN** anuncia "Llamar al …", "Consultar por otro trabajo por WhatsApp" y "Cómo llegar … en Google Maps" como destinos distintos

#### Scenario: Contraste AA en ambos temas

- **WHEN** se mide texto/fondo de contacto, ubicación y footer en tema claro y oscuro
- **THEN** cumple WCAG 2.2 AA (≥4.5:1 texto normal, ≥3:1 texto grande) con los tokens de C-03

### Requirement: Estático, sin precios ni medidas

El sistema SHALL resolver todo en build estático sin endpoints ni SSR (R1) y SHALL excluir precios, medidas y promesas de envío en textos de contacto/ubicación (R2 / RN-CAT-02 / RN-GL-02).

#### Scenario: Sin endpoints de servidor

- **WHEN** se inspecciona `dist/` tras el build
- **THEN** no hay rutas SSR ni endpoints propios; contacto y mapa son HTML + links salientes

#### Scenario: Texto comercial deriva a WhatsApp

- **WHEN** se lee cualquier texto de `/#contacto`, `/#ubicacion` o footer
- **THEN** no contiene precios, medidas ni promesas de envío; la definición comercial queda del lado de WhatsApp
