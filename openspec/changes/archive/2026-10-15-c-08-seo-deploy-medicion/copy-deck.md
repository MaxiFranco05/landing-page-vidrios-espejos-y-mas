# Copy deck — c-08-seo-deploy-medicion (tasks 1.1 + 1.2)

Voz del taller, rioplatense. Longitudes verificadas por ejecución
(`copycheck.mjs`: titles 50–60, descriptions 150–160, conteo por grafemas).

| Página | Title (chars) | Description (chars) |
|--------|---------------|---------------------|
| `/` (home) | Vidriería en Gral. Alvear \| Espejos, vidrios y taller (53) | Vidriería de barrio en Gral. Alvear, Mendoza: espejos, muebles de vidrio, aberturas y reparaciones. Pasá por Estrada 912 o pedí presupuesto por WhatsApp. (153) |
| `/catalogo` | Catálogo de vidriería en Gral. Alvear \| Pedí presupuesto (56) | Todo lo que hace el taller, agrupado por categoría: espejos, muebles de vidrio, aberturas y reparaciones. Elegí un producto y pedí presupuesto por WhatsApp. (156) |
| `/categoria/espejos` | Espejos en Gral. Alvear \| Redondos, nube y con LED (50) | Espejos rectangulares, redondos, nube, con LED y panorámicos, listos para colgar. Escribinos por WhatsApp y te decimos cuál conviene para tu ambiente. (150) |
| `/categoria/muebles-de-vidrio` | Muebles de vidrio en Gral. Alvear \| Mesas y vitrinas (52) | Mesas ratoneras de cristal y vitrinas de vidrio para tu living, quincho o comercio, hechas en nuestro taller de Gral. Alvear. Pedí presupuesto por WhatsApp. (156) |
| `/categoria/instalaciones-y-aberturas` | Aberturas y mamparas en Gral. Alvear \| Con colocación (53) | Aberturas de aluminio y mamparas para baño con colocación incluida en Gral. Alvear y alrededores. Escribinos por WhatsApp y coordinamos la visita al taller. (156) |
| `/categoria/servicios-y-reparaciones` | Reparación de vidrios en Gral. Alvear \| Taller local (52) | Reparamos vidrios de ventanas y espejos de vehículos, y enmarcamos diplomas y recuerdos. Traé tu consulta al taller de Estrada 912 o escribinos por WhatsApp. (157) |
| 404 | Página no encontrada \| Vidriería en Gral. Alvear, Mendoza (57) | Esta página no existe, pero el taller sigue en Estrada 912, Gral. Alvear, Mendoza. Volvé al catálogo completo o escribinos por WhatsApp y te ayudamos. (150) |

Headings visibles (sin cambios — ya nombran el resultado):
home `h1` "Vidrios, espejos y mas" · catálogo `h1` "Catálogo" ·
categoría `h1` = nombre de la categoría · CTAs "Pedir presupuesto"
(producto), "Consultar por otro trabajo" (genérico), "Cómo llegar".

## Checklist anti-slop `no-ai-slop` — firmado 2026-10-15 (task 1.2)

- [x] Sin "descubre / explora / descubre la" en ningún title/description/CTA.
- [x] Sin superlativos vacíos ("mejor", "líder", "premium", "excelente").
- [x] Cada CTA nombra el resultado ("Pedí presupuesto", "Escribinos",
      "Volvé al catálogo", "Pasá por Estrada 912").
- [x] Test de portabilidad: cada texto cita un hecho propio
      (Estrada 912, Gral. Alvear, WhatsApp, las 4 líneas del taller).
- [x] Sin muletillas ("en el mundo actual", "cabe destacar") ni
      contrastes binarios ("no es X, es Y") ni colon-reveals.
- [x] Sin claims inventados (reseñas, stats, precios, medidas,
      "Placeholder/Lorem"): verificado por `grep` en apply.
- [x] Voz activa, rioplatense (pedí, escribinos, pasá, volvé, traé).
