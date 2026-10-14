# Reglas de Negocio — Vidrios, espejos y mas

Cada regla tiene un código único `RN-{DOMINIO}-{NN}` para trazabilidad.

## Dominio: Catálogo (RN-CAT)

- **RN-CAT-01**: El catálogo v1 tiene exactamente 4 categorías: Vidrios a medida y DVH, Espejos, Estantes comerciales, Mesas ratoneras de vidrio — decisión 21a.
- **RN-CAT-02**: Ningún producto muestra precio ni medidas en la página. Toda definición comercial se cierra por WhatsApp.
- **RN-CAT-03**: El catálogo es estático en v1: los cambios los aplica el desarrollador sobre los archivos de contenido (decisión 13a).
- **RN-CAT-04**: No se publica una categoría o producto sin al menos una foto (real o, en última instancia, boceto IA marcado como ilustrativo).

## Dominio: Contacto por WhatsApp (RN-WA)

- **RN-WA-01**: Cada producto tiene su propio link `wa.me` con mensaje predefinido que identifica el producto (nombre + categoría).
- **RN-WA-02**: Existe además un link genérico ("Consultar por otro trabajo") para lo que no está catalogado.
- **RN-WA-03**: El número de destino es único y sale de `DatosContacto.whatsapp` (una sola fuente de verdad).
- **RN-WA-04**: En mobile el CTA principal abre WhatsApp; en desktop debe funcionar igual (WhatsApp Web) — verificar ambos.

## Dominio: Contenido (RN-CN)

- **RN-CN-01**: Las fotos reales tienen prioridad; los bocetos con IA son último recurso y se marcan como imagen ilustrativa.
- **RN-CN-02**: Toda imagen lleva texto alternativo descriptivo (accesibilidad + SEO).
- **RN-CN-03**: La dirección publicada es siempre "Estrada 912, Gral. Alvear, Mendoza" y la zona "Gral. Alvear y alrededores" — mismo texto en home, contacto y footer.

## Dominio: Diseño (RN-DS)

- **RN-DS-01**: Paleta de colores análogos y claros, sin contrastes opuestos ni ruido visual; tema claro + modo oscuro (decisión 22a).
- **RN-DS-02**: Criterio anti-genérico: nada de hero con titular + 3 cards idénticas de plantilla; la identidad (fotos reales, nombre, zona) manda sobre el layout.

## Dominio: Excepciones globales

- **RN-GL-01**: Todo lo que implique transacción, medida o precio redirige a WhatsApp: la página nunca promete lo que no puede cumplir (ver riesgo de pedidos incumplibles).
- **RN-GL-02**: Los "envíos a alrededores" no se prometen en v1 en ninguna sección (quedan para v2 con operatoria definida).
