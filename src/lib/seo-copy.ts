import raw from '../data/seo-copy.json';
import { seoCopySchema, type SeoCopy } from './content-schemas';

// Copy deck SEO local (C-08, tasks 1.1/1.2) como dato versionado en git.
//
// Patrón D5 (igual que `datos-contacto.ts`): los literales de copy viven
// en `src/data/` (seed excluido de los gates R4 de literales en
// componentes) y las páginas/layouts los consumen por import — NUNCA
// hardcodean titles/descriptions (R4 extensivo al contenido SEO).
// El contrato (rangos, R2, placeholders, slugs) vive en
// `content-schemas.ts::seoCopySchema` para que `node:test` lo ejecute
// sin importar el JSON. Ver tabla en
// `openspec/changes/c-08-seo-deploy-medicion/copy-deck.md`.

/** Deck validado en import (un copy fuera de rango rompe el build, no el SEO). */
export const seoCopy: SeoCopy = seoCopySchema.parse(raw);

export type { SeoCopy };
