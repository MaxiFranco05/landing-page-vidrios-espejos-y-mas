/**
 * JSON-LD `Store` para la home (C-08, D3): puro y testeable con
 * `node:test`, sin imports de Astro ni de `astro:content`.
 *
 * NAP EXACTO (scenario spec): `address`, `telephone` y `openingHours`
 * usan los strings visibles de `DatosContacto` tal cual los pintan
 * el header/footer — sin reformateos, sin campos inventados
 * (nada de reseñas, precios, coordenadas ni fotos).
 *
 * El número entra por parámetro desde el singleton (R4): este
 * módulo NUNCA hardcodea el número.
 */

export const STORE_NAME = 'Vidrios, espejos y mas';

export interface NapInput {
  /** `datosContacto.direccion` (visible en header/footer). */
  direccion: string;
  /** `datosContacto.whatsapp` (dígitos internacionales, sin `+`). */
  whatsapp: string;
  /** `datosContacto.horarios` (visible en header/footer). */
  horarios: string;
}

export function buildStoreJsonLd(nap: NapInput, site: string): Record<string, unknown> {
  if (nap.direccion.trim().length === 0) throw new Error('jsonld: direccion vacía');
  if (nap.whatsapp.trim().length === 0) throw new Error('jsonld: whatsapp vacío');
  if (nap.horarios.trim().length === 0) throw new Error('jsonld: horarios vacíos');
  return {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: STORE_NAME,
    address: nap.direccion,
    telephone: `+${nap.whatsapp}`,
    openingHours: nap.horarios,
    url: site.replace(/\/+$/, ''),
  };
}
