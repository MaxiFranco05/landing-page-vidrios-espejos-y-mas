# whatsapp-contact Specification

## Purpose

Convierte visitas en conversaciones de WhatsApp calificadas: cada CTA abre wa.me con un mensaje predefinido que identifica el producto, con el teléfono siempre como alternativa.

## Requirements

### Requirement: Link de WhatsApp por producto con mensaje predefinido

El sistema SHALL generar para cada producto un link `https://wa.me/<numero>?text=<mensaje>` donde el mensaje es `Hola Vidrios, espejos y mas! Quiero presupuesto de {nombre}` URL-encodeado.

#### Scenario: Producto típico genera link correcto

- **WHEN** se construye el link para el producto "Espejo baño apaisado" con número `5492625445223`
- **THEN** el resultado es `https://wa.me/5492625445223?text=Hola%20Vidrios%2C%20espejos%20y%20mas!%20Quiero%20presupuesto%20de%20Espejo%20ba%C3%B1o%20apaisado`

#### Scenario: Caracteres especiales sobreviven al encodeo

- **WHEN** el nombre contiene acentos, comillas o emoji (ej. `Mesa "Ratona" Ñandú 🪞`)
- **THEN** el link usa `encodeURIComponent` del mensaje completo y WhatsApp lo decodifica al texto original exacto

#### Scenario: Link abre WhatsApp en ambas plataformas

- **WHEN** un visitante toca el CTA en mobile o desktop
- **THEN** se abre la app de WhatsApp (mobile) o WhatsApp Web con el mensaje precargado (desktop)

### Requirement: Link genérico para consultas fuera de catálogo

El sistema SHALL exponer un link genérico con mensaje `Hola Vidrios, espejos y mas! Quiero consultar por otro trabajo.` URL-encodeado (RN-WA-02).

#### Scenario: Consulta genérica

- **WHEN** se construye el link genérico con número `5492625445223`
- **THEN** el resultado es `https://wa.me/5492625445223?text=Hola%20Vidrios%2C%20espejos%20y%20mas!%20Quiero%20consultar%20por%20otro%20trabajo.`

### Requirement: Número desde una sola fuente de verdad

El sistema SHALL tomar el número destino exclusivamente de `DatosContacto.whatsapp`; ningún componente SHALL hardcodear el número (RN-WA-03 / R4).

#### Scenario: Cambio de número se propaga

- **WHEN** `DatosContacto.whatsapp` cambia a otro valor válido
- **THEN** todos los links wa.me del sitio usan el nuevo número sin editar componentes

#### Scenario: Número hardcodeado es defecto

- **WHEN** se inspecciona el código de cualquier componente o helper de este change
- **THEN** no existe el literal `5492625445223` fuera del seed `datos-contacto.json`, sus tests y los artifacts de planificación

### Requirement: Fallback telefónico siempre visible

El sistema SHALL mostrar junto a cada CTA principal un link `tel:+5492625445223` con texto visible del teléfono, como alternativa cuando WhatsApp no está disponible (RN-WA-04, Flujo 1 error 1).

#### Scenario: Sin WhatsApp instalado

- **WHEN** el visitante no tiene WhatsApp o la sesión desktop falla
- **THEN** el link `tel:` visible le permite llamar al negocio sin buscar el número en otra sección

### Requirement: Botón WhatsApp accesible con dos variantes

El sistema SHALL proveer un botón con variante `product` (texto visible "Pedir presupuesto", `aria-label` que nombra el producto) y variante `generic` (texto "Consultar por otro trabajo"), renderizado como `<a href>` nativo con target ≥48px en mobile.

#### Scenario: Lector de pantalla identifica el producto

- **WHEN** un lector recorre una tarjeta con texto visible genérico "Pedir presupuesto"
- **THEN** el `aria-label` anuncia el producto (ej. "Pedir presupuesto de Espejo baño apaisado por WhatsApp")

#### Scenario: Navegación por teclado

- **WHEN** se tabula hasta el botón
- **THEN** el foco es visible y Enter abre el link wa.me correspondiente

### Requirement: CTA sticky en mobile

El sistema SHALL mostrar un CTA de WhatsApp (variante genérica) fijo y visible en mobile en home, que no oculte contenido ni rompa el layout en desktop.

#### Scenario: Sticky visible al hacer scroll en mobile

- **WHEN** un visitante hace scroll en la home en viewport mobile
- **THEN** el CTA permanece accesible sin tapar el contenido principal ni el footer

### Requirement: Sin precios ni medidas en mensajes ni CTAs

El sistema SHALL garantizar que ningún mensaje predefinido, texto de botón ni `aria-label` contenga precio o medida, y que los nombres de producto citados eviten medidas (R2 / RN-CAT-02).

#### Scenario: Nombre con medida se reporta

- **WHEN** el seed contiene un nombre como "Espejo 40x20"
- **THEN** la validación o la revisión lo marca para renombrar (ej. "Espejo baño apaisado") en vez de generar el link en silencio
