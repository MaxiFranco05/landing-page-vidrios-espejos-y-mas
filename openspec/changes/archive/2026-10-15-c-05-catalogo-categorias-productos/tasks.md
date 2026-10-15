# Tasks — c-05-catalogo-categorias-productos

## 1. Componentes de tarjeta

- [x] 1.1 Crear `src/components/CategoryCard.astro` (anchor nativo a `/categoria/{slug}`, portada + nombre + descripción, `alt` por prop, `loading="lazy"`, área táctil ≥48px) y verificar con test `node:test` que renderiza `href`, `alt` no vacío y lazy.
- [x] 1.2 Crear `src/components/ProductCard.astro` (`<article>` con foto/nombre/descripción + `WhatsAppButton variant="product"` reutilizado, número por props desde `DatosContacto`, sin precio/medida en textos) y verificar con test que el `href` wa.me usa `buildProductLink` y el `aria-label` nombra el producto.
- [x] 1.3 Añadir test de guarda R2/R4 sobre tarjetas (falla si hay `$`/`precio`/patrones de medida o literal `5492625445223` en componentes nuevos) y verificar con `npm test`.

## 2. Páginas: teaser, catálogo y categoría

- [x] 2.1 Añadir sección `id="hacemos"` "Lo que hacemos" en `src/pages/index.astro` (4 `CategoryCard` ordenadas por `orden` + link a `/catalogo`) y verificar que el HTML de `dist/index.html` contiene las 4 tarjetas en orden con links a `/categoria/{slug}`.
- [x] 2.2 Crear `src/pages/catalogo.astro` (grupos por categoría con `id="{slug}"`, productos ordenados con `ProductCard`, encabezado con link "Ver todo →" a `/categoria/{slug}`) y verificar que `dist/catalogo/index.html` lista los 13 productos agrupados (6+2+2+3) sin precio/medida.
- [x] 2.3 Crear `src/pages/categoria/[slug].astro` con `getStaticPaths` desde `categorias` (`prerender = true`), productos filtrados por ref y ordenados, 404 para slug inexistente, y verificar que el build genera los 4 `dist/categoria/*/index.html` y que `/categoria/no-existe` da 404.

## 3. Verificación de integración

- [x] 3.1 Pasar `npm run check` (astro check) limpio y `npm run build` verde, y verificar que `dist/` contiene home + `/catalogo` + 4 rutas de categoría sin endpoints SSR ni `knowledge-base/` publicada.
- [x] 3.2 Verificar a11y y temas: teclado (foco visible en cards/CTAs), un `h1` por página con `h2`/`h3` lógicos, contraste AA y toggle claro/oscuro sin flash ni secciones sin tematizar en mobile y desktop (revisión manual + test de `lang="es"` y `alt` en HTML).
