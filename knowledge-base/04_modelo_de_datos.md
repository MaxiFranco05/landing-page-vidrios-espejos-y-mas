# Modelo de Datos — Vidrios, espejos y mas

El sistema no tiene base de datos: el "modelo" es el **modelo de contenido** (Content Collections de Astro en archivos). Estas entidades definen el shape de cada colección.

## Dominios

- **Catálogo**: categorías y productos que se muestran.
- **Portfolio**: trabajos realizados con fotos.
- **Contacto**: datos del negocio y mensajes predefinidos de WhatsApp.

## ERD (contenido)

```
Categoria 1───* Producto
   │              │
   │              │ (mensaje predefinido por producto)
   │              ▼
   │         MensajeWhatsApp (derivado, no es colección)
   │
   └────* Trabajo (galería por categoría)

DatosContacto (singleton: teléfono, WhatsApp, dirección, horarios, Maps URL)
```

## Entidades

### Categoria
- Atributos: `slug` (string, único), `nombre` (string), `descripcion` (string), `imagen_portada` (imagen), `orden` (number).
- Relaciones: tiene muchos Productos (1—*), tiene muchos Trabajos (1—*).
- Constraints: `slug` kebab-case, único; `orden` define el orden en home.
- Seed inicial: `vidrios-a-medida-dvh`, `espejos`, `estantes-comerciales`, `mesas-ratoneras`.

### Producto
- Atributos: `slug` (string, único), `nombre` (string), `categoria` (ref → Categoria), `descripcion_corta` (string), `fotos[]` (imágenes), `destacado` (boolean), `orden` (number).
- Relaciones: pertenece a una Categoria (*—1); genera un MensajeWhatsApp derivado.
- Constraints: **sin precio, sin medidas** (RN-CAT-02); toda foto necesita `alt` descriptivo (RN-CN-02).

### Trabajo (galería)
- Atributos: `titulo` (string), `categoria` (ref → Categoria), `fotos[]` (imágenes), `descripcion` (string, opcional), `fecha` (date, opcional).
- Relaciones: pertenece a una Categoria (*—1).
- Constraints: solo fotos reales o bocetos IA marcados como ilustrativos (RN-CN-01).

### DatosContacto (singleton)
- Atributos: `whatsapp` (string, formato internacional sin `+`), `telefono_visible` (string), `direccion` (string), `zona_atencion` (string), `maps_url` (url), `maps_embed_url` (url), `horarios` (string).
- Seed inicial: whatsapp `5492625445223`, dirección "Estrada 912, Gral. Alvear, Mendoza", zona "Gral. Alvear y alrededores", horarios "Lun–Vie 8–19, Sáb 8–13, Dom cerrado" (respuesta 25a), maps_embed_url real de la ficha (respuesta 36a), maps_url derivada `https://www.google.com/maps/search/?api=1&query=Vidrios,+espejos+y+mas+Estrada+912+General+Alvear+Mendoza` (a verificar en C-07).

## Seed data inicial

- 4 categorías (slugs arriba) con descripción y portada.
- DatosContacto con los valores del seed.
- Al menos 1 producto y 2 trabajos por categoría para no lanzar secciones vacías (ver pregunta PA-02).
