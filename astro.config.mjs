// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Output estático por defecto (SSG puro, R1: sin servidor en runtime).
  // Sin adapter en C-01 por decisión D1: publicar `dist/` directo en Netlify.
  // TODO(PA-01): `site` temporal — sustituir por el dominio definitivo cuando
  // se resuelva PA-01 (C-08 deja el valor final + sitemap/canonicals).
  site: 'https://vidrios-espejos-y-mas.netlify.app',
  vite: {
    plugins: [tailwindcss()],
  },
});
