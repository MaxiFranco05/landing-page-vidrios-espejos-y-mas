# Discovery — Vidrios, espejos y mas (landing page)

**Fecha**: 2026-10-13
**Fuentes investigadas**: 3 competidores (ver `discovery/sources/`)

## 1. Problema que resuelve

"Vidrios, espejos y mas" (Gral. Alvear, Mendoza) vende por WhatsApp/llamada y boca en boca, sin presencia web propia más allá de Google Maps. La landing muestra sus productos por categoría y convierte visitas en consultas directas por WhatsApp o llamada, sin intermediarios ni precios publicados.

## 2. Usuarios / roles

- **Hogar / vecino**: consulta espejos (baño, living, placard) y ventanas a medida — lo que más vende hoy.
- **Comercio local**: pide estantes, vidrieras y espejos decorativos.
- **Obra / arquitecto** (aspiracional): el negocio quiere insertarse en este segmento; la landing debe hablarle también (medidas, instalación profesional).

## 3. Casos de uso

1. Como vecino, quiero ver espejos y vidrios por categoría para consultar por WhatsApp sin tener que llamar a ciegas.
2. Como comerciante, quiero ver estantes y trabajos realizados para pedir un presupuesto.
3. Como visitante, quiero ubicar el local (Estrada 912, Gral. Alvear) y contactar en un clic.
4. Como dueño, quiero que cada producto tenga su propio link de WhatsApp con mensaje predefinido para recibir consultas calificadas.

## 4. Competidores / soluciones existentes

| Competidor | Problema que resuelve | Pricing | Diferenciadores |
|---|---|---|---|
| Vidrios y Espejos Hernán (Venado Tuerto) | Instalación y reparación local: DVH, mamparas, espejos, Blindex | No publicado, presupuesto sin cargo | Trayectoria barrial + respuesta inmediata por WhatsApp |
| Vidriería La Plata (Servicios Lourdes) | Atención rápida hogares/comercios, hasta urgencias 24 hs | No publicado, presupuesto orientativo por WhatsApp | 10+ años, garantía escrita, reseñas de Google, landings por barrio (SEO local) |
| Casa Vigo (San Juan, desde 1922) | Soluciones a medida hogar/obra/comercio | No publicado, cotiza con visita | 100+ años de oficio, Instagram como portfolio |

**Notas**: Hernán es el modelo elegido (landing simple: servicios + galería por categoría + contacto + Maps). Patrón común del rubro: nadie publica precios, todo se cotiza por WhatsApp; CTA principal siempre WhatsApp con mensaje pre-llenado.

## 5. Funcionalidades necesarias

- Home con propuesta de valor + CTA directo a WhatsApp/llamada (+54 9 2625 44-5223).
- Catálogo por categorías: vidrios a medida/DVH, espejos, estantes comerciales, mesas ratoneras de vidrio.
- Galería de trabajos por categoría (hay fotos reales + bocetos con IA).
- Links dinámicos de WhatsApp **por producto**, con mensaje predefinido.
- Contacto visible: WhatsApp/llamada + dirección (Estrada 912, Gral. Alvear, Mendoza).
- Google Maps en el footer + acceso rápido en el home.
- Catálogo **estático** en v1 (productos en archivos del proyecto; cambios vía el desarrollador). Decisión 13a.

## 6. Funcionalidades opcionales

- Envíos a alrededores / expansión regional (v2).
- Sistema de administración del catálogo para el dueño en v2, preferiblemente sin costo de mantenimiento (a definir: planilla/CMS externo vs. admin propio).
- Páginas por zona para SEO local (estilo La Plata).
- Reseñas de Google, FAQ, urgencias 24 hs, integración con Instagram.

## 7. Reglas de negocio

- Sin reglas duras por ahora: todo (señas, garantías, traslados) se acuerda por WhatsApp según el pedido.
- La v1 **no** toma medidas ni muestra precios en la página — solo contacto calificado.

## 8. Integraciones

- WhatsApp deep links dinámicos por producto con mensaje predefinido.
- Google Maps (embebido/link en footer + acceso rápido en home).
- Ninguna otra integración en v1 (sin Instagram, sin CMS).

## 9. Restricciones

- Ninguna restricción dura de plazo, presupuesto o stack: se resuelve según el pedido.

## 10. Riesgos

- **Diseño genérico "hecho por IA" que no atraiga clientes** — preocupación principal del dueño; se registra como criterio de calidad del diseño (identidad propia, fotos reales, nada de plantilla obvia).
- **Supuesto sin probar**: que los visitantes prefieran el formulario/WhatsApp web antes que llamar directo — el teléfono visible mitiga.
- **Riesgo**: prometer envíos sin operatoria armada — mitigado dejándolo para v2.
- **Riesgo**: que el admin en v2 agregue costo de mantenimiento — mitigado con la preferencia por solución sin mantenimiento.

## 11. Preguntas abiertas

- Ninguna pendiente para cerrar el Discovery (12a). Queda a definir en v2 el mecanismo del admin del catálogo sin costo de mantenimiento.
