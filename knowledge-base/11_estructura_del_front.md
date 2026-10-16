# Estructura del Front — Vidrios, espejos y mas (CONTRATO ÚNICO)

> Fuente de verdad visual. Prevalece sobre specs viejas en lo visual.
> Base: `demos/demo.html` "Nueva propuesta" + decisiones del dueño. Aprobado: pendiente de revisión del dueño antes del apply C-12.

## Orden del home (`/`)

1. **Hero** — h1 "Vidrios, espejos y mas" + línea de zona + filete + propuesta de valor (1 línea, sin precios/medidas/claims) + CTA WhatsApp genérico + foto `espejo-redondo-led.jpg` (eager). Sin texto placeholder.
2. **Lo que hacemos** (`#hacemos`) — 4 cards (Espejos / Muebles de Vidrio / Instalaciones y Aberturas / Servicios y Reparaciones): portada + 1 línea + link "Ver catálogo". Sin listados de productos.
3. **Trabajos destacados** (`#destacados` + alias oculto `#trabajos`) — imagen grande + carousel con nombre (click, flechas, swipe, teclado). Solo trabajos con foto real o ilustrativa marcada.
4. **Opiniones** (`#opiniones`) — 7 reseñas verbatim, grilla-en-carousel con puntos (sin flechas invasivas; demo v3: flechas en extremos + puntos centrados — respetar lo último aprobado).
5. **Contacto y ubicación juntos** (`#contacto` + div interno `#ubicacion`) — UNA sección, dos divs inline (lado a lado desktop, apilados mobile): datos + horarios + CTAs | mapa compacto + "Cómo llegar". Nada de secciones separadas ni mapa full-width.

## Página catálogo (`/catalogo`)

- Por categoría, compacta: h2 + UNA línea de descripción + link "Ver todo →" (sin portadas gigantes).
- Cards uniformes: imagen 4/3 altura fija + nombre + UNA línea (sin repetir "Consultanos por WhatsApp" en cada texto — el botón ya lo dice) + botón "Pedir presupuesto".
- Prohibido: cajas de imagen vacías (todo producto resuelve foto real o badge "ilustrativa"), botones ×13 idénticos sin jerarquía (el de la categoría destacada puede diferenciarse).

## Página por categoría (`/categoria/[slug]`)

- Portada acotada (16/9, altura máxima ~22rem, nunca full-bleed gigante) + título + 1 línea + grilla de productos (mismas cards que catálogo) + 404 para slug inexistente.

## Header / footer / 404

- Se mantienen estructura y contenido; solo pasan el tamiz de densidad (La Plata: columna ~70rem centrada, aire entre bloques, nada full-width salvo fondos).
- NAP idéntico en header/footer/JSON-LD (26 de Julio, M5620).

## Fixes registrados (evidencia: capturas del dueño 2026-10-15/16)

- F1. Foto `espejo-panoramico-gancho.jpg` con precio impreso → REEMPLAZAR urgente (viola R2 en píxeles). Sin foto limpia: placeholder marcado + pedir foto al dueño.
- F2. Cajas vacías en Instalaciones/Servicios del catálogo → diagnosticar (¿producto sin foto? ¿SVG roto?) y resolver con foto, placeholder marcado o regla de no-vacío.
- F3. Repetición de copy ("Consultanos por WhatsApp" ×13) → pasada no-ai-slop: quitar de descripciones, queda solo en botones.
- F4. Tema oscuro pesado → revisar densidades y superficies en oscuro (37B intacta, solo aire/contraste).
- F5. Mapa gigante → tarjeta compacta centrada (ya prototipado en C-11; consolidar).

## Lo que NO cambia

Datos, seed, schemas, tests de contenido, builders (WhatsApp/SEO/analytics), tokens 37B, specs como documentación, anchors existentes (no romper links).
