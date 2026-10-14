# Descripción General — Vidrios, espejos y mas

## Stack tecnológico

| Capa | Tecnologías | Versión mínima |
|---|---|---|
| Generador estático | Astro | 4.x |
| Lenguaje | TypeScript / JavaScript + CSS moderno | TS 5.x |
| Estilos | Tailwind CSS (tokens de diseño en `src/styles`) | 4.x |
| Contenido | Astro Content Collections (archivos Markdown/JSON + imágenes) | — |
| Hosting + CDN | Netlify (deploy desde git, HTTPS, previews; URL temporal `*.netlify.app` hasta definir dominio — decisión 23c) | — |
| Contacto | WhatsApp deep links (`wa.me`) + `tel:` | — |
| Mapas | Google Maps (embed + link "cómo llegar") | — |
| Control de versiones | Git + GitHub | — |

Decisiones DD-01 (Astro) y DD-02 (Netlify) en `09_decisiones_y_supuestos.md`.

## Arquitectura general

Sitio 100% estático generado en build-time, servido por CDN. Sin servidor, sin base de datos, sin autenticación.

```
contenido/ (colecciones: categorias, productos, trabajos)
    │
    ▼
Astro build (SSG) ──► HTML/CSS/JS estático ──► Netlify CDN
                                                  │
                    ┌─────────────────────────────┼─────────────────────────────┐
                    ▼                             ▼                             ▼
              wa.me (WhatsApp)            tel: (llamada)              Google Maps
              (sale del sitio)            (sale del sitio)            (embed + link)
```

**Justificación**: el sistema es lectura + redirección a canales externos. No hay estado, no hay usuarios, no hay transacciones: un backend sería costo sin beneficio (ver DD-03). El contenido en archivos permite el catálogo estático de v1 (decisión 13a) y migrar a CMS/planilla en v2 sin reescribir el frontend.

## Integraciones externas

| Servicio | Propósito | Tipo |
|---|---|---|
| WhatsApp (`wa.me/<numero>?text=<mensaje>`) | Conversión principal; mensaje predefinido por producto | Deep link saliente |
| Telefonía (`tel:+5492625445223`) | Llamada directa en un clic (mobile) | Link saliente |
| Google Maps | Embed en footer + botón "cómo llegar" en home | Embed + link saliente |

## API REST (si aplica)

No aplica en v1: no hay backend ni endpoints propios.
