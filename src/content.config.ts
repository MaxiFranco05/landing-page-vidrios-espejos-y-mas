import { defineCollection } from 'astro:content';
import { categoriaSchema, productoSchema, trabajoSchema } from './lib/content-schemas';

// Astro 4 resuelve `src/content.config.ts` (D1) — NO `src/content/config.ts`
// (convención de Astro 5). Colecciones `type: 'data'` (JSON): el catálogo
// son entidades con campos, no documentos markdown. Los schemas vienen de
// `src/lib/content-schemas.ts` para compartirlos con los tests `node:test`.
// Refs como `string` + validación cruzada en tests (D2); fotos como objeto
// `{ src, alt, ilustrativa }` con `src` en `/images/...` (desvío de D3
// documentado en el módulo de schemas: `image()` no acepta `public/`).

export const collections = {
  categorias: defineCollection({ type: 'data', schema: categoriaSchema }),
  productos: defineCollection({ type: 'data', schema: productoSchema }),
  trabajos: defineCollection({ type: 'data', schema: trabajoSchema }),
};
