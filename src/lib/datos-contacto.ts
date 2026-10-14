import raw from '../data/datos-contacto.json';
import { datosContactoSchema, type DatosContacto } from './content-schemas';

// Re-export tipado del singleton (D5): el JSON versionado en git es la
// ÚNICA fuente del número (R4 / RN-WA-03). NUNCA hardcodear el número en
// componentes: importar `datosContacto` desde este módulo. Las vars
// `PUBLIC_*` de `.env` quedan como override futuro para C-04/C-07.

export const datosContacto: DatosContacto = datosContactoSchema.parse(raw);

export type { DatosContacto };
