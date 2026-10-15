# Arquitectura Propuesta — Vidrios, espejos y mas

## Patrones aplicados

| Patrón | Dónde se usa | Por qué |
|---|---|---|
| SSG (generación estática) | Todo el sitio (Astro build → HTML) | Contenido estable, SEO local gratis, hosting CDN sin servidor |
| Content Collections | `src/content/categorias|productos|trabajos` + `datos-contacto` | Catálogo estático versionado en git (decisión 13a) |
| Islas de interactividad | Toggle de tema, galería/lightbox, menú mobile | JS solo donde hace falta; resto HTML puro |
| Mobile-first + responsive | Layout y CTAs (WhatsApp sticky en mobile) | La mayoría llega desde el teléfono, como en el rubro |
| Single source of truth | `DatosContacto` centraliza número, dirección, Maps URLs | Un cambio de número no deja links rotos (RN-WA-03) |
| Progressive enhancement | Embed de Maps, lightbox | Si algo externo falla, el texto y los links siguen funcionando |

## Estructura de directorios

```
vidrios-espejos-y-mas/
├── src/
│   ├── content/
│   │   ├── categorias/        # 4 archivos (uno por categoría)
│   │   ├── productos/         # un archivo por producto
│   │   ├── trabajos/          # un archivo por trabajo de galería
│   │   └── datos-contacto.json
│   ├── components/            # Header, Footer, CategoryCard, ProductCard,
│   │                          # WhatsAppButton, Gallery, ThemeToggle, MapEmbed
│   ├── layouts/               # BaseLayout (SEO + tema claro/oscuro)
│   ├── pages/
│   │   ├── index.astro        # home (Hero → Lo que hacemos → destacados → testimonios → contacto)
│   │   ├── catalogo.astro     # catálogo completo por categorías
│   │   └── categoria/[slug].astro
│   ├── styles/                # tokens de diseño (paleta, tipografías)
│   └── lib/
│       └── whatsapp.ts        # constructor de links wa.me + encode
├── public/
│   └── images/                # fotos reales + bocetos IA marcados
├── astro.config.mjs
├── netlify.toml
└── knowledge-base/            # esta KB (no se publica)
```

## Seguridad

- Autenticación: no hay (sitio 100% público).
- Autorización: no aplica.
- Validación de input: no hay formularios propios en v1 (el "input" vive en WhatsApp).
- Secrets management: no hay secrets; solo variables públicas de contacto (ver abajo).

## Variables de entorno

| Variable | Descripción | Ejemplo | Sensible |
|---|---|---|---|
| `PUBLIC_WHATSAPP_NUMBER` | Número destino en formato internacional | `5492625445223` | No |
| `PUBLIC_PHONE_DISPLAY` | Número como lo ve el usuario | `+54 9 2625 44-5223` | No |
| `PUBLIC_ADDRESS` | Dirección del local | `26 de Julio, M5620 Gral. Alvear, Mendoza` | No |
| `PUBLIC_MAPS_URL` | Link "cómo llegar" | `https://maps...` | No |
| `PUBLIC_MAPS_EMBED_URL` | URL del iframe del mapa | `https://maps.../embed` | No |
| `PUBLIC_UMAMI_WEBSITE_ID` | ID del sitio en Umami (cuenta del usuario; NUNCA commitear valores reales, solo la key en `.env.example`) | `xxxxxxxx-xxxx-...` | No |

## Identidad visual (criterio anti-genérico, RN-DS-01/02)

- Paleta análoga y clara (colores vecinos en la rueda, de la gama vidrio/agua: ej. celestes, verdes suaves, neutros cálidos), sin opuestos estridentes ni ruido visual.
- Modo oscuro como tema completo, no invertido automático.
- Tipografía legible con carácter (a definir en implementación; nada de la sans genérica de plantilla).
- Fotos reales del negocio como protagonistas; bocetos IA solo ilustrativos y marcados.
- Sin logo previo: la marca (logo simple + tokens de color/tipografía) se crea dentro del proyecto — decisión 26b.
- Referencia visual (gusto del cliente): galería/trabajos estilo La Plata — lo visual, no la estructura (las páginas por zona NO aplican: un solo local).
- Paleta elegida en demo C-03 (37d): **37B Azul Taller**; tokens en `src/styles/global.css` (`@theme`).
