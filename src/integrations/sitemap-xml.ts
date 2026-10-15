/**
 * Integración local `sitemap-xml` (C-08).
 *
 * Desviación documentada de D2: el change prescribía `@astrojs/sitemap`,
 * pero su v2 (única compatible con Astro 4) rompe `astro build` en este
 * entorno —`sitemap@7` exige `destinationDir` relativo y la integración
 * le pasa el `outDir` absoluto (`destinationDir must be a relative path`)—
 * y además emite `sitemap-index.xml`, no el `sitemap.xml` que el spec
 * (acceptance criteria) exige en `dist/` y en `robots.txt`.
 *
 * Esta integración conserva el ESPÍRITU de D2 (el sitemap deriva en build
 * de las rutas prerenderizadas vía hook `astro:build:done`: imposible que
 * se desincronice de `getStaticPaths`) con el formato exacto del spec:
 * un solo `sitemap.xml`, solo URLs canónicas (mismo contrato que
 * `lib/seo.ts::normalizePath`: raíz sin barra final, resto sin barra
 * final ni query strings), `lastmod` del día de build, 404/500 excluidos.
 */

import type { AstroIntegration } from 'astro';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

export interface SitemapXmlOptions {
  /** Filtro extra sobre URLs absolutas ya canónicas (p. ej. excluir 404). */
  filter?: (url: string) => boolean;
}

/** Misma normalización que `lib/seo.ts::normalizePath` (contrato único). */
function canonicalLoc(site: string, pathname: string): string {
  const base = site.replace(/\/+$/, '');
  let p = (pathname.split(/[?#]/)[0] ?? '').trim().toLowerCase();
  if (p.length > 0 && !p.startsWith('/')) p = '/' + p;
  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
  return p === '' || p === '/' ? base : base + p;
}

/** Páginas de estado (nunca indexables) fuera del sitemap por defecto. */
export function isStatusCodePage(pathname: string): boolean {
  const end = pathname.replace(/\/$/, '').split('/').pop() ?? '';
  return end === '404' || end === '500';
}

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export default function sitemapXml(options: SitemapXmlOptions = {}): AstroIntegration {
  let site: string | undefined;
  return {
    name: 'sitemap-xml-local',
    hooks: {
      'astro:config:done': ({ config }) => {
        site = config.site;
      },
      'astro:build:done': async ({ dir, pages }) => {
        if (!site) return;
        const today = new Date().toISOString().slice(0, 10);
        const urls = pages
          .map((p) => canonicalLoc(site as string, p.pathname))
          .filter((url, i, arr) => arr.indexOf(url) === i)
          .filter((url) => !isStatusCodePage(new URL(url).pathname))
          .filter((url) => (options.filter ? options.filter(url) : true))
          .sort();
        const xml =
          `<?xml version="1.0" encoding="UTF-8"?>\n` +
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
          urls.map((url) => `  <url><loc>${escapeXml(url)}</loc><lastmod>${today}</lastmod></url>`).join('\n') +
          `\n</urlset>\n`;
        await writeFile(join(fileURLToPath(dir), 'sitemap.xml'), xml, 'utf8');
      },
    },
  };
}
