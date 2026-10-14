# Flujos Principales — Vidrios, espejos y mas

## Flujo 1: Ver un producto y consultar por WhatsApp
**Disparador**: el visitante entra a una categoría o ve un producto destacado.
**Actor**: Visitante.

**Pasos**:
1. Visitante navega home → sección categorías → elige categoría (o entra directo a `/categoria/{slug}` desde Google).
2. Página de categoría lista productos con fotos (sin precios ni medidas).
3. Visitante toca "Consultar por WhatsApp" en un producto.
4. El sitio abre `wa.me/<numero>?text=<mensaje predefinido con producto + categoría>`.
5. La conversación sigue en WhatsApp (fuera del sitio): medidas, precio, visita, instalación.

**Casos de error**:
- Sin WhatsApp instalado (desktop sin sesión) → el link igual abre WhatsApp Web con el mensaje; además siempre hay alternativa `tel:` visible (RN-WA-04).
- Mensaje con caracteres especiales → el texto va URL-encodeado al generar el link.

## Flujo 2: Ubicar el local y visitarlo
**Disparador**: el visitante quiere ir al local.
**Actor**: Visitante.

**Pasos**:
1. Visitante toca "Cómo llegar" en home o baja al footer.
2. Ve dirección (Estrada 912, Gral. Alvear, Mendoza) + mapa embebido.
3. Toca el mapa o el botón → se abre Google Maps con el destino.
4. Opcional: llama antes con el `tel:` visible.

**Casos de error**:
- Embed de Maps bloqueado (adblock/offline) → el link "Abrir en Google Maps" sigue funcionando; la dirección en texto siempre visible.

## Flujo 3: El dueño actualiza el catálogo (proceso manual v1)
**Disparador**: el dueño quiere agregar, quitar o cambiar un producto/foto.
**Actor**: Dueño (vía desarrollador).

**Pasos**:
1. Dueño envía por WhatsApp al dev: fotos + nombre + descripción + categoría.
2. Dev actualiza la colección correspondiente en `src/content/` y hace push.
3. Netlify reconstruye y publica automáticamente.
4. Dev confirma al dueño con el link actualizado.

**Casos de error**:
- Foto sin calidad suficiente → se pide otra antes de publicar (RN-CAT-04).
- Producto de categoría inexistente → se revisa contra RN-CAT-01 (4 categorías fijas en v1).

> Este flujo se reemplaza en v2 por el admin sin mantenimiento (pregunta abierta PA-04).
