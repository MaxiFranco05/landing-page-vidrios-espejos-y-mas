# Decisiones y Supuestos — Vidrios, espejos y mas

## Decisiones documentadas

### DD-01 — Generador estático Astro
**Decisión**: construir con Astro (SSG), no con HTML puro ni con framework con backend.
**Contexto**: había que elegir entre estático puro, generador o web app (enfoques A/B/C).
**Alternativas consideradas**: HTML+CSS+JS puro (A); web app con backend (C, descartada).
**Justificación**: inicialización en minutos, componentes reutilizables, islas de JS, contenido en archivos que migra fácil a CMS en v2, performance y SEO gratis.
**Trade-offs aceptados**: requiere Node para el build; curva mínima de Astro frente a HTML puro.

### DD-02 — Hosting en Netlify
**Decisión**: Netlify con deploy desde git (decisión 20a).
**Contexto**: opciones: GH Pages, Vercel, Netlify.
**Alternativas consideradas**: Vercel (igual de válido), GH Pages (sin previews tan cómodos).
**Justificación**: deploys automáticos por push, HTTPS, previews por PR, costo cero para este volumen.
**Trade-offs aceptados**: atado a un proveedor gratuito (migrable: es HTML estático).

### DD-03 — Sin backend ni base de datos en v1
**Decisión**: `needs_infra: false`; todo es estático + links externos.
**Contexto**: integraciones 100% client-side (WhatsApp, Maps).
**Justificación**: no hay estado, usuarios ni transacciones que justifiquen un servidor.
**Trade-offs aceptados**: si en v2 entra admin propio, se agrega backend entonces (hoy se prefiere solución sin mantenimiento).

### DD-04 — Catálogo estático gestionado por el dev (13a)
**Decisión**: productos en archivos del proyecto; cambios vía desarrollador.
**Contexto**: ¿admin en el MVP?
**Justificación**: el catálogo cambia cada tanto, no a diario; un admin duplicaría el MVP.
**Trade-offs aceptados**: el dueño depende del dev para cada cambio (flujo F3).

### DD-05 — Sin precios ni medidas en la página
**Decisión**: la página muestra y deriva; todo lo comercial se cierra en WhatsApp.
**Contexto**: patrón del rubro (ningún competidor publica precios) + evita pedidos incumplibles.
**Justificación**: protege al negocio de compromisos automáticos y mantiene el trato personal.
**Trade-offs aceptados**: visitantes que solo buscan precio se van sin consultar (se acepta: no es el cliente objetivo).

### DD-06 — WhatsApp por producto + modo oscuro
**Decisión**: links `wa.me` dinámicos con mensaje predefinido por producto (RN-WA-01) y doble tema claro/oscuro (22a).
**Justificación**: califica la consulta antes de que llegue; el modo oscuro era pedido explícito del dueño.

### DD-07 — Rumbo v2: admin con Decap CMS (condicionado a seguridad)
**Decisión**: anotar Decap CMS (backend GitHub) como rumbo del admin v2 — respuesta 28a.
**Contexto**: el dueño acepta si no hay riesgo de hackeo que elimine productos.
**Evaluación de seguridad**: el riesgo de "borrado total" es bajo por diseño — cada cambio de Decap es un commit en Git, así que borrar un producto no lo destruye: queda en el historial y se revierte con un revert. No hay base de datos ni servidor que vulnerar; la superficie de ataque es la cuenta de GitHub (y la de Netlify).
**Mitigaciones obligatorias al implementarlo**: 2FA activado en GitHub; colaboradores con el permiso mínimo; workflow editorial (borrador → revisión → publicado) para que nada salga sin visto bueno; protección de la rama principal; previews de Netlify antes de publicar.
**Trade-offs aceptados**: si alguien con acceso borra a propósito, igual queda rastro y se recupera; el riesgo residual es secuestro de cuenta sin 2FA (mitigado arriba).

### DD-08 — Tailwind CSS para los estilos
**Decisión**: usar Tailwind como sistema de estilos con tokens propios (paleta análoga, tipografía).
**Contexto**: el dueño confirmó Tailwind al elegir skills (se sumó `tailwind-design-system`, se descartó `vercel-optimize` por deploy en Netlify).
**Justificación**: acelera el maquetado del doble tema claro/oscuro y los tokens evitan estilos ad-hoc que rompan la identidad.
**Trade-offs aceptados**: dependencia de build (PostCSS/Vite plugin de Tailwind dentro de Astro).

## Supuestos inferidos

### SU-01 — Las fotos parciales alcanzan para arrancar
**Supuesto**: el vendedor provee fotos reales parciales; se lanza con lo que haya y se completa con bocetos IA marcados como ilustrativos.
**Origen**: respuesta 24b del dueño.
**Riesgo si es falso**: categorías con una sola foto o galería desbalanceada → cae la confianza (RN-CAT-04 y RN-CN-01 lo contienen).
**Cómo validar**: revisar cobertura foto-por-categoría antes del sprint de maquetado (PA-02).

### SU-02 — Volumen bajo, público local
**Supuesto**: cientos de visitas/mes desde Alvear y alrededores; tiers gratuitos sobran.
**Origen**: respuesta 15a + negocio barrial.
**Riesgo si es falso**: si una campaña dispara tráfico, igual no hay backend que caiga (solo CDN).
**Cómo validar**: analytics básico desde el día 1.

### SU-03 — El WhatsApp del negocio responde rápido
**Supuesto**: la conversión depende de respuesta ágil en +54 9 2625 44-5223.
**Origen**: modelo del rubro (los 3 competidores venden "respuesta inmediata").
**Riesgo si es falso**: la landing trae visitas que se enfrían.
**Cómo validar**: acordar horario de respuesta y publicarlo (PA-03).
