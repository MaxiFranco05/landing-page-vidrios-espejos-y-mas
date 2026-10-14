import { WHATSAPP_RE } from './content-schemas.ts';

/**
 * Builders puros de links de contacto (C-04, D1): cero imports de
 * `astro:content`, testeables con `node:test` sin levantar Astro.
 *
 * El número entra SIEMPRE como parámetro (D3 / R4): los componentes
 * resuelven `datosContacto.whatsapp` y lo pasan. NUNCA hardcodear el
 * número en este módulo ni en sus consumidores.
 */

const WA_BASE = 'https://wa.me/';

/** Prefijo del mensaje por producto (decidido en review, vinculante). */
export const MENSAJE_PREFIJO = 'Hola Vidrios, espejos y mas! Quiero presupuesto de ';

/** Mensaje genérico para consultas fuera de catálogo (decisión 42a, RN-WA-02). */
export const MENSAJE_GENERICO = 'Hola Vidrios, espejos y mas! Quiero consultar por otro trabajo.';

/** Lanza si el número no es internacional sin `+` ni espacios (RN-WA-03). */
export function assertNumeroWhatsApp(numero: string): void {
  if (!WHATSAPP_RE.test(numero)) {
    throw new Error(`whatsapp inválido: ${JSON.stringify(numero)} (RN-WA-03: internacional sin \`+\` ni espacios)`);
  }
}

function waLink(numero: string, mensaje: string): string {
  assertNumeroWhatsApp(numero);
  return `${WA_BASE}${numero}?text=${encodeURIComponent(mensaje)}`;
}

/**
 * Link por producto: el mensaje cita SOLO el nombre (decisión de review).
 * `categoria` es opcional y reservado para reuso en C-05 (D1/trade-off).
 */
export function buildProductLink(numero: string, nombreProducto: string, _categoria?: string): string {
  if (nombreProducto.trim().length === 0) {
    throw new Error('nombre de producto vacío: sin nombre no hay consulta calificada');
  }
  return waLink(numero, `${MENSAJE_PREFIJO}${nombreProducto}`);
}

/** Link genérico para consultas fuera de catálogo (RN-WA-02). */
export function buildGenericLink(numero: string): string {
  return waLink(numero, MENSAJE_GENERICO);
}

/** Display canónico del teléfono visible (RN-WA-04). */
export function formatoTelefonoVisible(telefonoVisible: string): string {
  return `+54 9 ${telefonoVisible}`;
}

/**
 * Fallback telefónico siempre visible (RN-WA-04): `href` para `tel:` y
 * texto con el formato canónico `+54 9 2625 44-5223`.
 */
export function buildTelLink(contacto: { whatsapp: string; telefono_visible: string }): {
  href: string;
  textoVisible: string;
} {
  assertNumeroWhatsApp(contacto.whatsapp);
  return {
    href: `tel:+${contacto.whatsapp}`,
    textoVisible: formatoTelefonoVisible(contacto.telefono_visible),
  };
}
