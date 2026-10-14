# Vidrios, espejos y mas — Base de Conocimiento

Landing page estática (Astro + Netlify) para la vidriería de Gral. Alvear, Mendoza. Generada con `kb-creator` en modo interactivo, con Discovery previo (`discovery/discovery.md`).

## Índice de Archivos

| Archivo | Contenido |
|---------|-----------|
| [01_vision_y_objetivos.md](01_vision_y_objetivos.md) | Propósito, objetivos por actor, alcance v1.0, fuera de alcance, métricas |
| [02_descripcion_general.md](02_descripcion_general.md) | Stack Astro + Netlify, arquitectura estática, WhatsApp/Maps |
| [03_actores_y_roles.md](03_actores_y_roles.md) | Visitante, dueño, Googlebot; todo público, sin auth |
| [04_modelo_de_datos.md](04_modelo_de_datos.md) | Modelo de contenido: Categoría, Producto, Trabajo, DatosContacto |
| [05_reglas_de_negocio.md](05_reglas_de_negocio.md) | Reglas RN-CAT/WA/CN/DS/GL |
| [06_funcionalidades.md](06_funcionalidades.md) | 4 épicas, US-001 a US-007 con criterios de aceptación |
| [07_flujos_principales.md](07_flujos_principales.md) | Consultar por WhatsApp, ubicar el local, actualizar catálogo (manual v1) |
| [08_arquitectura_propuesta.md](08_arquitectura_propuesta.md) | Patrones, estructura Astro, env vars, identidad visual |
| [09_decisiones_y_supuestos.md](09_decisiones_y_supuestos.md) | DD-01 a DD-06 + supuestos SU-01 a SU-03 |
| [10_preguntas_abiertas.md](10_preguntas_abiertas.md) | PA-01 a PA-06 priorizadas |

## Quick Start para Desarrolladores

1. Entender el dominio → [01](01_vision_y_objetivos.md), [03](03_actores_y_roles.md)
2. Entender los datos → [04](04_modelo_de_datos.md)
3. Entender las reglas → [05](05_reglas_de_negocio.md)
4. Entender la arquitectura → [02](02_descripcion_general.md), [08](08_arquitectura_propuesta.md)
5. Implementar → [07](07_flujos_principales.md), [06](06_funcionalidades.md)
6. Antes de codificar → [10](10_preguntas_abiertas.md)

## Resumen Ejecutivo

Landing estática en Astro (hosting Netlify, costo cero) que muestra el catálogo en 4 categorías y deriva cada consulta a WhatsApp con mensaje predefinido por producto. Sin precios, sin medidas, sin backend en v1; admin y envíos quedan para v2. Criterio de calidad Nº1: diseño propio que no parezca plantilla de IA.
