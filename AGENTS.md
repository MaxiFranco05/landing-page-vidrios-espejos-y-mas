# Vidrios, espejos y mas — Instrucciones para Agentes

> Este archivo (y su copia `CLAUDE.md`) es lo PRIMERO que todo agente lee al entrar al repo.
> Generado a partir de `knowledge-base/` y `CHANGES.md`. No editar a mano sin re-sincronizar ambos archivos.

---

## Stack Tecnológico

Detalle completo: [knowledge-base/02_descripcion_general.md](knowledge-base/02_descripcion_general.md)

| Capa | Tecnología | Versión |
|------|------------|---------|
| Generador estático | Astro (SSG, islas, Content Collections) | 4.x |
| Lenguaje | TypeScript / JavaScript + CSS moderno | TS 5.x |
| Estilos | Tailwind CSS (CSS-first v4, tokens en `src/styles`) | 4.x |
| Contenido | Astro Content Collections (archivos + imágenes) | — |
| Hosting + CDN | Netlify (deploy desde git, URL temporal `*.netlify.app`) | — |
| Contacto | WhatsApp deep links (`wa.me`) + `tel:` | — |
| Mapas | Google Maps (embed + link "cómo llegar") | — |
| Control de versiones | Git + GitHub | — |

---

## Base de Conocimiento

La fuente de verdad del dominio vive en `knowledge-base/`. **Leé el archivo relevante ANTES de implementar.**

| Archivo | Cuándo leerlo |
|---------|---------------|
| [01_vision_y_objetivos.md](knowledge-base/01_vision_y_objetivos.md) | Entender propósito y alcance |
| [03_actores_y_roles.md](knowledge-base/03_actores_y_roles.md) | Actores (todo público, sin auth) |
| [04_modelo_de_datos.md](knowledge-base/04_modelo_de_datos.md) | Modelo de contenido: Categoría, Producto, Trabajo, DatosContacto |
| [05_reglas_de_negocio.md](knowledge-base/05_reglas_de_negocio.md) | Reglas codificadas (RN-CAT/WA/CN/DS/GL) |
| [06_funcionalidades.md](knowledge-base/06_funcionalidades.md) | Historias de usuario por épica (US-001 a US-007) |
| [07_flujos_principales.md](knowledge-base/07_flujos_principales.md) | Flujos E2E (consultar, ubicar, actualizar catálogo) |
| [08_arquitectura_propuesta.md](knowledge-base/08_arquitectura_propuesta.md) | Patrones, estructura Astro, env vars, identidad visual |
| [10_preguntas_abiertas.md](knowledge-base/10_preguntas_abiertas.md) | ⚠️ Preguntas abiertas a resolver |

> ⚠️ Resolver las preguntas de prioridad **Alta** de `10_preguntas_abiertas.md` (PA-01 dominio definitivo, PA-02 cobertura de fotos) antes de arrancar el primer change.

---

## Skills Disponibles

Cargá la skill correspondiente al contexto ANTES de escribir código.

| Agente | Rol | Skills que carga |
|--------|-----|------------------|
| **Frontend / Diseño** | Landing, sistema de diseño, identidad, a11y | `frontend-design`, `web-design-guidelines`, `design-taste-frontend`, `tailwind-design-system`, `accessibility` |
| **SEO / Performance** | SEO técnico y local, Core Web Vitals | `seo`, `seo-audit`, `web-perf` |
| **Stack Astro** | Collections, islas, rutas, deploy Netlify | `astro` |
| **Orquestación** | OPSX: explore / propose / apply / archive | CLI `openspec` (ver Flujo de Trabajo) |

> Los compact rules de cada skill los resuelve el orquestador desde `.atl/skill-registry.md` (generado por `skill-registry`; no versionado — no está en el repo). Esta tabla solo mapea skill→rol.

---

## Roadmap de Changes

El plan de implementación completo está en [CHANGES.md](CHANGES.md). Resumen:

- **Total**: 8 changes en 4 fases.
- **Camino crítico** (5): `C-01 → C-02 → C-04 → C-05 → C-08`.
- **Primer change**: `C-01` (foundation-setup).

**Antes de cualquier `/opsx:propose`**: leé [CHANGES.md](CHANGES.md), identificá las dependencias del change y los archivos de "Leer antes".

---

## Reglas Duras

> Reglas globales ya definidas en `~/.claude/CLAUDE.md` (orquestador, governance, TDD, engram): el proyecto las hereda. Acá viven solo las reglas **específicas de este proyecto** + las universales que el global no cubra. Son contrato; romperlas es un defecto.

- **R1.** NUNCA lógica de servidor ni endpoints en v1 → todo prerender estático; `astro check` limpio antes de cada build.
- **R2.** NUNCA precio ni medidas en contenido o maquetado → validar colecciones contra RN-CAT-02.
- **R3.** NUNCA Tailwind con `tailwind.config.ts` ni tokens fuera de `@theme` → CSS-first v4, tokens en `src/styles`.
- **R4.** NUNCA hardcodear el número de WhatsApp → siempre desde `DatosContacto`/env (RN-WA-03).
- **R5.** NUNCA imagen sin `alt` descriptivo ni galería sin lazy-load → perf + a11y.
- **R6.** NUNCA publicar categoría/producto sin foto → RN-CAT-04 como gate de contenido.
- **R7.** NUNCA commitear ni pushear sin pedido explícito del usuario.
- **R8.** Commits en formato conventional (`feat:`, `fix:`, `docs:`…) sin co-autoría de IA.

---

## Flujo de Trabajo

```
1. Leer la KB relevante (knowledge-base/)        → entender el dominio
2. Identificar el change en CHANGES.md           → respetar dependencias
3. /opsx:propose C-NN-nombre                     → proposal + design + specs + tasks
4. Implementar las tasks (cargando skills)       → respetando las reglas duras
5. /opsx:archive C-NN-nombre + marcar [x]        → cerrar el change
```

Aplicar TODAS las reglas duras en cada paso. Ante conflicto entre la KB y este archivo, las reglas duras prevalecen.
