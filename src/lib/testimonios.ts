import raw from '../data/testimonios.json' with { type: 'json' };
import { testimoniosSchema, type Testimonio } from './content-schemas.ts';

// Testimonios reales (C-10, D1/D5): las 7 reseñas verbatim de Google Maps
// como dato versionado en git.
//
// Patrón D5 (igual que `datos-contacto.ts`): el JSON es la ÚNICA fuente y
// el contrato vive en `content-schemas.ts` para que `node:test` lo ejecute
// sin Astro. Desvío mínimo documentado: el import lleva
// `with { type: 'json' }` para que el MISMO módulo cargue bajo `node:test`
// (sin el atributo, Node lanza ERR_IMPORT_ATTRIBUTE_MISSING y la task 1.3
// no podría importar el loader; Vite/Astro lo aceptan igual).
// NUNCA editar los textos: el gate verbatim de `tests/testimonios.test.mjs`
// rompe el build ante cualquier alteración (spec: Texto alterado rechazado).

/** Array validado en import (un texto alterado o faltante rompe el build). */
export const testimonios: Testimonio[] = testimoniosSchema.parse(raw);

export type { Testimonio };
