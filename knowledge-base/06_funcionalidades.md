# Funcionalidades — Vidrios, espejos y mas

Organizadas por **épica** y luego por **historia de usuario** (formato US-NNN).

## Épica 1: Catálogo por categorías

### US-001 — Ver categorías del catálogo
**Como** visitante
**Quiero** ver las 4 categorías con foto y descripción
**Para** orientarme rápido hacia lo que busco

**Criterios de aceptación**:
- [ ] Se ven las 4 categorías de RN-CAT-01 con portada y descripción
- [ ] Cada categoría enlaza a su página (`/categoria/{slug}`)
- [ ] Funciona en mobile y en desktop, en tema claro y oscuro

### US-002 — Ver productos de una categoría
**Como** visitante
**Quiero** ver los productos de una categoría con fotos
**Para** elegir qué consultar

**Criterios de aceptación**:
- [ ] Lista productos con foto, nombre y descripción corta
- [ ] Sin precios ni medidas visibles (RN-CAT-02)
- [ ] Cada producto tiene su botón de WhatsApp con mensaje predefinido (RN-WA-01)

**Reglas relacionadas**: RN-CAT-01, RN-CAT-02, RN-WA-01

### US-003 — Consultar por WhatsApp con mensaje predefinido
**Como** visitante
**Quiero** que al tocar "Consultar" se abra WhatsApp con un mensaje que identifique el producto
**Para** no tener que explicar desde cero qué me interesa

**Criterios de aceptación**:
- [ ] El mensaje incluye nombre del producto y categoría
- [ ] El número destino es el de `DatosContacto` (RN-WA-03)
- [ ] Existe link genérico para consultas fuera de catálogo (RN-WA-02)

**Reglas relacionadas**: RN-WA-01, RN-WA-02, RN-WA-03, RN-WA-04

## Épica 2: Galería de trabajos

### US-004 — Ver trabajos realizados por categoría
**Como** visitante
**Quiero** ver fotos de trabajos reales por categoría
**Para** confiar en la calidad antes de consultar

**Criterios de aceptación**:
- [ ] Galería filtrable o agrupada por categoría
- [ ] Fotos reales; bocetos IA marcados como ilustrativos (RN-CN-01)
- [ ] Cada foto tiene `alt` descriptivo (RN-CN-02)

**Reglas relacionadas**: RN-CN-01, RN-CN-02, RN-CAT-04

## Épica 3: Contacto y ubicación

### US-005 — Contactar por WhatsApp o llamada
**Como** visitante
**Quiero** un botón de WhatsApp y el teléfono siempre a mano
**Para** consultar sin fricción

**Criterios de aceptación**:
- [ ] CTA de WhatsApp visible en home (sticky en mobile)
- [ ] Número de teléfono en formato llamada (`tel:`)

### US-006 — Ubicar el local
**Como** visitante
**Quiero** ver la dirección y el mapa, y un acceso rápido a "cómo llegar"
**Para** visitar el local

**Criterios de aceptación**:
- [ ] Dirección "Estrada 912, Gral. Alvear, Mendoza" + zona de atención (RN-CN-03)
- [ ] Maps embebido en footer + botón "cómo llegar" en home
- [ ] El link abre Google Maps con el destino correcto
- [ ] Horarios publicados: Lun–Vie 8–19, Sáb 8–13, Dom cerrado

## Épica 4: Identidad y tema

### US-007 — Cambiar entre tema claro y oscuro
**Como** visitante
**Quiero** alternar modo claro/oscuro (respetando mi preferencia del sistema por defecto)
**Para** leer cómodo en cualquier condición

**Criterios de aceptación**:
- [ ] Toggle visible; por defecto sigue `prefers-color-scheme`
- [ ] La paleta en ambos modos es análoga y clara, sin ruido visual (RN-DS-01)
- [ ] El diseño no parece plantilla genérica (RN-DS-02)

**Reglas relacionadas**: RN-DS-01, RN-DS-02
