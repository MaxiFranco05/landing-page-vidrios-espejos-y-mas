import { z } from 'zod';

/**
 * Contrato del modelo de contenido (C-02) en Zod puro — sin imports de
 * `astro:content` para que `node:test` lo ejecute sin levantar Astro.
 * `src/content.config.ts` compone estos mismos schemas con
 * `defineCollection`, así hay UNA sola fuente de verdad para las reglas.
 *
 * Reglas codificadas: RN-CAT-01/02/04, RN-CN-01/02, RN-WA-03.
 */

// ---------------------------------------------------------------------------
// Constantes canónicas
// ---------------------------------------------------------------------------

/** Slugs de las 4 categorías del catálogo real (RN-CAT-01, DD-09, C-09). */
export const CATEGORIA_SLUGS = [
  'espejos',
  'muebles-de-vidrio',
  'instalaciones-y-aberturas',
  'servicios-y-reparaciones',
] as const;

export const KEBAB_CASE_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * WhatsApp en formato internacional SIN `+` ni espacios (RN-WA-03).
 * 12–15 dígitos: el canónico `5492625445223` tiene 13; un número local
 * sin código de país queda rechazado.
 */
export const WHATSAPP_RE = /^\d{12,15}$/;

/**
 * Fotos del seed viven en `public/images/` (tasks + proposal).
 *
 * NOTA — desvío justificado de D3: el helper Astro `image()` solo valida
 * imágenes importables (relativas al entry y procesadas por Astro); NO
 * acepta rutas servidas desde `public/`. Se usa `string` con formato
 * `/images/...` + tests que exigen el archivo real en `public/`: el gate
 * RN-CAT-04 se mantiene, con errores más claros (mismo criterio que D2).
 */
export const FOTO_SRC_RE = /^\/images\/.+\.(svg|png|jpe?g|webp|avif|gif)$/i;

// ---------------------------------------------------------------------------
// Schemas base
// ---------------------------------------------------------------------------

/** Foto con `alt` descriptivo obligatorio (RN-CN-02) y flag de placeholder (RN-CN-01). */
export const fotoSchema = z
  .object({
    src: z
      .string()
      .min(1)
      .regex(FOTO_SRC_RE, 'src debe ser una ruta /images/... con extensión de imagen'),
    alt: z
      .string()
      .min(10, 'El alt debe ser descriptivo (mínimo 10 caracteres, RN-CN-02)')
      .max(300),
    ilustrativa: z.boolean().default(false),
  })
  .strict();

export const categoriaSchema = z
  .object({
    slug: z.string().regex(KEBAB_CASE_RE, 'slug debe ser kebab-case único'),
    nombre: z.string().min(1),
    descripcion: z.string().min(1),
    imagen_portada: fotoSchema,
    /** Define el orden en home (spec: Orden respected en home). */
    orden: z.number().int().nonnegative(),
  })
  .strict();

export const productoSchema = z
  .object({
    slug: z.string().regex(KEBAB_CASE_RE, 'slug debe ser kebab-case único'),
    nombre: z.string().min(1),
    /** Ref a slug de categoría (string por D2; el gate de existencia vive en tests). */
    categoria: z.string().min(1),
    descripcion_corta: z.string().min(1),
    fotos: z.array(fotoSchema).min(1, 'Todo producto lleva al menos una foto (RN-CAT-04)'),
    destacado: z.boolean(),
    orden: z.number().int().nonnegative(),
  })
  .strict();

export const trabajoSchema = z
  .object({
    titulo: z.string().min(1),
    /** Ref a slug de categoría (string por D2; el gate de existencia vive en tests). */
    categoria: z.string().min(1),
    fotos: z.array(fotoSchema).min(1, 'Todo trabajo lleva al menos una foto (RN-CAT-04)'),
    descripcion: z.string().min(1).optional(),
    fecha: z.coerce.date().optional(),
  })
  .strict();

export const datosContactoSchema = z
  .object({
    whatsapp: z.string().regex(WHATSAPP_RE, 'whatsapp: internacional sin `+` ni espacios (RN-WA-03)'),
    telefono_visible: z.string().min(1),
    direccion: z.string().min(1),
    zona_atencion: z.string().min(1),
    maps_url: z.string().url(),
    maps_embed_url: z.string().url(),
    horarios: z.string().min(1),
  })
  .strict();

export type Foto = z.infer<typeof fotoSchema>;
export type Categoria = z.infer<typeof categoriaSchema>;
export type Producto = z.infer<typeof productoSchema>;
export type Trabajo = z.infer<typeof trabajoSchema>;
export type DatosContacto = z.infer<typeof datosContactoSchema>;

// ---------------------------------------------------------------------------
// Testimonios (C-10, D1/D4)
// ---------------------------------------------------------------------------

/**
 * Opinión real de cliente (fuente: Google Maps). `calificacion` es
 * literal 5 y `fuente` literal "Google Maps": solo se exhiben reseñas
 * 5★ verbatim (honestidad: sin agregados ni promedios).
 *
 * Sin gate de precio/medida sobre `comentario`: son citas verbatim de
 * terceros — RN-CAT-02 rige PRODUCTOS, no citas — y dos mencionan
 * "precio" en prosa ("muy buen precio", "precios súper económicos")
 * sin cifras ni medidas. Rechazarlas o alterarlas rompería el verbatim
 * (spec: Texto alterado rechazado). La intención R2 (sin cifras ni
 * medidas publicadas) la cubre `tests/testimonios.test.mjs`.
 */
export const testimonioSchema = z
  .object({
    nombre: z.string().min(1),
    calificacion: z.literal(5),
    comentario: z.string().min(1),
    fuente: z.literal('Google Maps'),
  })
  .strict();

/** Exactamente las 7 reseñas reales provistas (spec: Siete tarjetas). */
export const testimoniosSchema = z.array(testimonioSchema).length(7);

export type Testimonio = z.infer<typeof testimonioSchema>;

// ---------------------------------------------------------------------------
// Copy deck SEO local (C-08, tasks 1.1/1.2)
// ---------------------------------------------------------------------------

/**
 * Contrato del copy deck (`src/data/seo-copy.json`, consumido vía
 * `src/lib/seo-copy.ts` con el patrón D5 de `datos-contacto.ts`).
 *
 * Vive acá —y no en `seo-copy.ts`— para que `node:test` lo ejecute sin
 * importar el JSON (los loaders con `import` de JSON solo corren en Astro).
 * Longitudes en grafemas (`[...s]`), no en UTF-16.
 */

const LONGITUD = (s: string): number => [...s].length;

const paginaSeoSchema = z
  .object({
    /** Único por página, 50–60 grafemas, keyword local al frente. */
    title: z
      .string()
      .min(1)
      .refine((s) => LONGITUD(s) >= 50 && LONGITUD(s) <= 60, 'title fuera de rango 50–60'),
    /** Única por página, 150–160 grafemas, con CTA. */
    description: z
      .string()
      .min(1)
      .refine((s) => LONGITUD(s) >= 150 && LONGITUD(s) <= 160, 'description fuera de rango 150–160'),
    path: z.string().min(1),
  })
  .strict()
  .superRefine((pagina, ctx) => {
    try {
      assertSinPrecioNiMedida(pagina, 'seo-copy');
    } catch (e) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: (e as Error).message });
    }
    for (const patron of [/placeholder/i, /lorem/i]) {
      if (patron.test(pagina.title) || patron.test(pagina.description)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: `texto provisorio (${patron}) en copy SEO` });
      }
    }
  });

export const seoCopySchema = z
  .object({
    home: paginaSeoSchema,
    catalogo: paginaSeoSchema,
    categorias: z.record(paginaSeoSchema),
    noEncontrada: paginaSeoSchema,
  })
  .strict()
  .superRefine((deck, ctx) => {
    const slugs = Object.keys(deck.categorias).sort();
    const esperados = [...CATEGORIA_SLUGS].sort();
    if (JSON.stringify(slugs) !== JSON.stringify(esperados)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `categorias del deck (${slugs}) != slugs reales (${esperados})`,
      });
    }
  });

export type PaginaSeo = z.infer<typeof paginaSeoSchema>;
export type SeoCopy = z.infer<typeof seoCopySchema>;

// ---------------------------------------------------------------------------
// Prohibición de precio/medida (RN-CAT-02, D4)
// ---------------------------------------------------------------------------

/**
 * La frase "a medida" describe el SERVICIO (corte personalizado), no una
 * dimensión: se exime antes de buscar patrones, porque "Vidrios a medida"
 * es nombre de categoría (RN-CAT-01) y debe pasar el gate.
 */
const FRASE_A_MEDIDA_RE = /a[-\s]medida/gi;

const PATRONES_PRECIO_MEDIDA: RegExp[] = [
  /precio/i,
  /price/i,
  /\$/,
  /\bcuesta[n]?\b/i,
  /\bcotiz/i,
  /dimensi/i,
  /\bmedidas\b/i,
  /medida\s*[:=]/i,
  /medida\s+\d/i,
  /\bcm\b/i,
  /\bmm\b/i,
  /\bmts?\b/i,
  /\bmetros?\b/i,
  /\bpulgadas?\b/i,
  /\d+\s*[x×]\s*\d+/,
  /\b\d+\s*(pesos|usd|ars|d[oó]lares?)\b/i,
];

/** `true` si el texto menciona precio, moneda o dimensiones. */
export function contienePrecioOMedida(texto: string): boolean {
  const limpio = texto.replace(FRASE_A_MEDIDA_RE, '');
  return PATRONES_PRECIO_MEDIDA.some((re) => re.test(limpio));
}

/**
 * Gate D4: falla si la entrada serializada contiene precio/medida en
 * CUALQUIER campo (claves extra las rechaza `.strict()`; esto cubre el
 * texto libre de descripciones, títulos y alts).
 */
export function assertSinPrecioNiMedida(entrada: unknown, etiqueta: string): void {
  const texto = JSON.stringify(entrada);
  const limpio = texto.replace(FRASE_A_MEDIDA_RE, '');
  for (const re of PATRONES_PRECIO_MEDIDA) {
    if (re.test(limpio)) {
      const i = limpio.search(re);
      throw new Error(
        `${etiqueta}: posible precio/medida (${re}) cerca de “…${limpio.slice(Math.max(0, i - 40), i + 40)}…” (RN-CAT-02)`,
      );
    }
  }
}

/**
 * Coherencia RN-CN-01: si el `alt` declara foto ilustrativa, el flag debe
 * estar encendido (los placeholders del seed van con `ilustrativa: true`).
 */
export function validarCoherenciaIlustrativa(
  foto: Pick<Foto, 'alt' | 'ilustrativa'>,
  etiqueta: string,
): void {
  if (/ilustrativ/i.test(foto.alt) && !foto.ilustrativa) {
    throw new Error(`${etiqueta}: el alt indica ilustrativa pero el flag está apagado (RN-CN-01)`);
  }
}
