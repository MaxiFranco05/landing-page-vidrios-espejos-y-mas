/**
 * Builder puro de metadatos SEO (C-08, D1): cero imports de
 * `astro:content` y cero `import.meta`, testeable con `node:test`
 * sin levantar Astro (mismo patrón que `lib/whatsapp.ts`).
 *
 * El `site` entra SIEMPRE como parámetro (D3 / R4): `BaseLayout`
 * lo resuelve desde `PUBLIC_SITE_URL` y lo pasa. NUNCA hardcodear
 * el dominio en este módulo ni en sus consumidores — `DEFAULT_SITE`
 * es solo el fallback temporal hasta PA-01 (dominio definitivo).
 */

/** Canónica temporal hasta PA-01 (ver TODO en `astro.config.mjs`). */
export const DEFAULT_SITE = 'https://vidrios-espejos-y-mas.netlify.app';

/** OG por defecto: archivo REAL en `public/` (checklist PA-06: se
 *  sustituye por foto real del negocio cuando PA-06 la entregue). */
export const DEFAULT_OG_IMAGE = '/images/categorias/espejos.svg';

export const OG_LOCALE = 'es_AR';

export interface SeoInput {
  title: string;
  description: string;
  /** Pathname de la página (`/`, `/catalogo`, `/categoria/espejos`). */
  path: string;
  /** Relativa (`/images/...`) o absoluta. Por defecto `DEFAULT_OG_IMAGE`. */
  image?: string;
  /** `website` en páginas; `article` si alguna página lo necesitara. */
  type?: 'website' | 'article';
  /** Resuelto por el llamador desde `PUBLIC_SITE_URL` (R4). */
  site?: string;
}

export interface SeoTags {
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogType: string;
  ogUrl: string;
  ogImage: string;
  ogLocale: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
}

/** Normaliza un pathname a forma canónica: `/`, minúsculas,
 *  sin query/hash, sin barra final duplicada (la raíz canónica
 *  es el `site` sin barra final). */
export function normalizePath(path: string): string {
  const sinQuery = path.split(/[?#]/)[0] ?? '';
  let p = sinQuery.trim().toLowerCase();
  if (p.length === 0 || !p.startsWith('/')) p = '/' + p;
  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
  return p === '/' ? '' : p;
}

/** Absolutiza una imagen (relativa → `site + path`; absoluta intacta). */
export function absoluteUrl(site: string, pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const base = site.endsWith('/') ? site.slice(0, -1) : site;
  return base + normalizePath(pathOrUrl);
}

export function buildSeo(input: SeoInput): SeoTags {
  const site = (input.site ?? DEFAULT_SITE).replace(/\/+$/, '');
  const canonical = site + normalizePath(input.path);
  const ogImage = absoluteUrl(site, input.image ?? DEFAULT_OG_IMAGE);
  const ogType = input.type ?? 'website';
  return {
    canonical,
    ogTitle: input.title,
    ogDescription: input.description,
    ogType,
    ogUrl: canonical,
    ogImage,
    ogLocale: OG_LOCALE,
    twitterCard: 'summary_large_image',
    twitterTitle: input.title,
    twitterDescription: input.description,
    twitterImage: ogImage,
  };
}
