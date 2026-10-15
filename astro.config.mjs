// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemapXml from './src/integrations/sitemap-xml.ts';

// https://astro.build/config
export default defineConfig({
  // Output estático por defecto (SSG puro, R1: sin servidor en runtime).
  // Sin adapter en C-01 por decisión D1: publicar `dist/` directo en Netlify.
  // TODO(PA-01): `site` temporal — sustituir por el dominio definitivo cuando
  // se resuelva PA-01 (C-08 deja el valor final + sitemap/canonicals).
  // Migración PA-01 (1 commit): cambiar `site`, rebuild, re-verificar
  // canonicals + `sitemap.xml` + `robots.txt` (ver(Migration Plan, design C-08).
  site: 'https://vidriosespejosymas.netlify.app',
  // C-08: `sitemap.xml` generado en build desde `site:` + rutas
  // prerenderizadas (integración local: ver `src/integrations/sitemap-xml.ts`
  // para la desviación documentada de D2). El 404 nunca es indexable:
  // lo excluyen la integración (status-code) + este filtro explícito.
  integrations: [
    sitemapXml({
      filter: (page) => !/\/404\/?$/.test(new URL(page).pathname),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
