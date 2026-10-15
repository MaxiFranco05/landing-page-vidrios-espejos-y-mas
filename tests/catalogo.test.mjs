import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { contienePrecioOMedida } from '../src/lib/content-schemas.ts';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (rel) => readFileSync(join(ROOT, rel), 'utf8');
const exists = (rel) => existsSync(join(ROOT, rel));

const LITERAL_NUMERO = '5492625445223';
const ORDEN_ESPERADO = [
  'espejos',
  'muebles-de-vidrio',
  'instalaciones-y-aberturas',
  'servicios-y-reparaciones',
];

/**
 * Catálogo navegable (C-05).
 *
 * - Las aserciones sobre `src/` corren siempre (contrato de componentes).
 * - Las aserciones sobre `dist/` se omiten si el build aún no corrió:
 *   `npm run build` y luego `npm test` las ejercita (verificación por
 *   ejecución del HTML real, sin dependencias nuevas).
 */
describe('catalogo C-05: tarjetas (CategoryCard / ProductCard)', () => {
  test('1.1 CategoryCard existe y es un anchor nativo a /categoria/{slug}', () => {
    const src = read('src/components/CategoryCard.astro');
    assert.match(src, /<a[\s>]/, 'la tarjeta debe ser un <a> nativo (D3)');
    assert.match(src, /\/categoria\//, 'el href debe apuntar a /categoria/{slug}');
    assert.match(src, /slug/, 'el slug debe llegar por prop');
  });

  test('1.1 CategoryCard: alt por prop + loading lazy + área táctil ≥48px', () => {
    const src = read('src/components/CategoryCard.astro');
    assert.match(src, /alt=\{/, 'el alt debe venir por prop (R5)');
    assert.match(src, /loading/, 'debe declarar loading (lazy fuera del pliegue, D4)');
    assert.match(src, /lazy/, 'las portadas bajo el pliegue usan loading="lazy" (D4)');
    assert.match(src, /decoding=\{?["']async["']\}?/, 'decoding async para no bloquear el pintado');
    assert.match(
      src,
      /min-h-\[48px\]|min-height:\s*48px|min-height:3rem/,
      'área táctil mínima ≥48px (a11y 2.5.8)',
    );
  });

  test('1.2 ProductCard existe como <article> y REUSA WhatsAppButton variant="product"', () => {
    const src = read('src/components/ProductCard.astro');
    assert.match(src, /<article/, 'la tarjeta de producto es un <article> (D3)');
    assert.match(src, /WhatsAppButton/, 'debe REUSAR el botón de C-04, no reconstruirlo (D2)');
    assert.match(src, /variant="product"/, 'variante product: texto "Pedir presupuesto"');
    assert.match(src, /productoNombre/, 'el nombre del producto se pasa al botón (aria-label)');
    assert.match(src, /numero=\{/, 'el número llega por prop desde DatosContacto (R4)');
  });

  test('1.2 ProductCard: foto + nombre + descripción, sin precio/medida en textos', () => {
    const src = read('src/components/ProductCard.astro');
    assert.match(src, /<img/, 'foto del producto');
    assert.match(src, /alt=\{/, 'alt por prop (R5)');
    assert.match(src, /loading=\{?["']lazy["']\}?|loading="lazy"/, 'lazy-load en fotos (R5)');
    assert.ok(!/precio/i.test(src), 'la palabra "precio" no aparece en la tarjeta (R2)');
  });

  test('1.3 guarda R2/R4: componentes nuevos sin número hardcodeado ni precio/medida', () => {
    for (const rel of ['src/components/CategoryCard.astro', 'src/components/ProductCard.astro']) {
      const src = read(rel);
      assert.ok(!src.includes(LITERAL_NUMERO), `${rel}: número hardcodeado (R4)`);
      // `$` y los patrones R2 se auditan sobre el CONTENIDO: las
      // interpolaciones `${...}` son código (rutas/props), no texto visible.
      // Sin este recorte, `/categoria/${slug}` sería un falso positivo.
      const soloContenido = src.replace(/\$\{[^}]*\}/g, '[interp]');
      assert.ok(!soloContenido.includes('$'), `${rel}: "$" fuera de interpolación (R2)`);
      assert.ok(!contienePrecioOMedida(soloContenido), `${rel}: patrón de precio/medida (R2)`);
    }
  });
});

describe('catalogo C-05: páginas (teaser, /catalogo, /categoria/[slug])', () => {
  test('2.1 index.astro declara la zona C-05 y consume las 4 categorías por `orden`', () => {
    const src = read('src/pages/index.astro');
    assert.match(src, /C-05:Lo-que-hacemos/, 'zona explícita para convivir con C-06/C-07');
    assert.match(src, /id="hacemos"/, 'sección con id="hacemos"');
    assert.match(src, /CategoryCard/, 'el teaser usa CategoryCard');
    assert.match(src, /sort.*orden|orden.*sort/s, 'las tarjetas se ordenan por `orden`');
    assert.match(src, /\/catalogo/, 'la sección enlaza además a /catalogo');
  });

  test('2.2 catalogo.astro agrupa por categoría con id="{slug}" y link "Ver todo"', () => {
    const src = read('src/pages/catalogo.astro');
    assert.match(src, /id=\{/, 'cada grupo lleva id igual al slug (deep-link, D5)');
    assert.match(src, /\/categoria\//, 'cada grupo enlaza a su /categoria/{slug}');
    assert.match(src, /Ver todo/, 'encabezado con link "Ver todo" a la página dedicada');
    assert.match(src, /ProductCard/, 'los productos usan ProductCard');
    assert.match(src, /datosContacto/, 'el número sale de DatosContacto (R4)');
    assert.ok(!src.includes(LITERAL_NUMERO), 'catalogo.astro: sin número hardcodeado (R4)');
  });

  test('2.3 categoria/[slug].astro usa getStaticPaths + prerender y filtra por ref', () => {
    const src = read('src/pages/categoria/[slug].astro');
    assert.match(src, /getStaticPaths/, 'rutas estáticas vía getStaticPaths (D1)');
    assert.match(src, /prerender\s*=\s*true/, 'prerender explícito (R1)');
    assert.match(src, /getCollection\(['"]categorias['"]\)/, 'paths desde la colección categorias');
    assert.match(src, /getCollection\(['"]productos['"]/, 'productos filtrados por ref y ordenados');
    assert.match(src, /404/, 'slug inexistente → 404');
  });
});

describe('catalogo C-05: HTML construido (dist/)', () => {
  const hayDist = exists('dist/index.html');

  test('2.1 dist/index.html: 4 tarjetas en orden con links a /categoria/{slug}', { skip: !hayDist }, () => {
    const html = read('dist/index.html');
    assert.ok(html.includes('id="hacemos"'), 'sección Lo que hacemos presente');
    const posiciones = ORDEN_ESPERADO.map((slug) => {
      const i = html.indexOf(`/categoria/${slug}`);
      assert.ok(i >= 0, `falta link a /categoria/${slug}`);
      return i;
    });
    assert.deepEqual([...posiciones].sort((a, b) => a - b), posiciones, 'tarjetas en orden de `orden`');
    assert.ok(html.includes('/catalogo'), 'link a /catalogo presente');
  });

  test('2.2 dist/catalogo: 13 productos agrupados 6+2+2+3 sin precio/medida', { skip: !exists('dist/catalogo/index.html') }, () => {
    const html = read('dist/catalogo/index.html');
    for (const slug of ORDEN_ESPERADO) {
      assert.ok(html.includes(`id="${slug}"`), `falta grupo con id="${slug}"`);
    }
    const ctas = html.match(/aria-label="Pedir presupuesto de /g) ?? [];
    assert.equal(ctas.length, 13, `13 CTAs por producto, hay ${ctas.length}`);
    const visibles = html.match(/>\s*Pedir presupuesto\s*</g) ?? [];
    assert.equal(visibles.length, 13, `13 textos visibles, hay ${visibles.length}`);
    assert.ok(!contienePrecioOMedida(html), 'HTML del catálogo sin precio/medida (R2)');
    assert.ok(html.includes('https://wa.me/'), 'CTAs con link wa.me del builder (D2)');
    assert.ok(html.includes('rel="noopener"'), 'CTAs heredan rel="noopener" de C-04');
  });

  test('2.3 dist/categoria: las 4 rutas prerenderizadas con sus productos', { skip: !hayDist }, () => {
    const conteos = { espejos: 6, 'muebles-de-vidrio': 2, 'instalaciones-y-aberturas': 2, 'servicios-y-reparaciones': 3 };
    for (const [slug, n] of Object.entries(conteos)) {
      const rel = `dist/categoria/${slug}/index.html`;
      assert.ok(exists(rel), `falta ruta prerenderizada ${rel}`);
      const html = read(rel);
      const ctas = html.match(/aria-label="Pedir presupuesto de /g) ?? [];
      assert.equal(ctas.length, n, `${slug}: ${n} productos, hay ${ctas.length}`);
      assert.ok(html.includes('aria-label="Pedir presupuesto de '), `${slug}: aria-label nombra el producto`);
    }
  });

  test('3.2 a11y en HTML: lang="es", un h1 por página, alts no vacíos, lazy', { skip: !hayDist }, () => {
    // C-06/C-07 escriben sus propias zonas de index.html en paralelo: la
    // auditoría de la home se limita a la zona C-05 (`#hacemos`), que es
    // lo único que este change posee. catalogo/categoría son 100% C-05.
    const hacemos = read('dist/index.html').split('id="hacemos"')[1].split('<!-- /C-05')[0];
    assert.ok(hacemos.includes('/categoria/espejos'), 'zona hacemos presente en dist');
    assert.ok(!/<img[^>]*alt=""/.test(hacemos), 'hacemos: sin alt vacíos');
    assert.ok(!/<img(?![^>]*alt=)[^>]*>/.test(hacemos), 'hacemos: toda img con alt');
    assert.ok(hacemos.includes('loading="lazy"'), 'hacemos: portadas con lazy-load (R5)');
    assert.ok(hacemos.includes('loading="eager"'), 'hacemos: primera portada eager (D4)');

    const paginas = ['dist/index.html', 'dist/catalogo/index.html'];
    for (const slug of ORDEN_ESPERADO) paginas.push(`dist/categoria/${slug}/index.html`);
    for (const rel of paginas) {
      if (!exists(rel)) continue;
      const html = rel === 'dist/index.html' ? hacemos : read(rel);
      const completo = read(rel);
      assert.ok(completo.includes('<html lang="es"'), `${rel}: lang="es"`);
      if (rel !== 'dist/index.html') {
        const h1 = completo.match(/<h1[\s>]/g) ?? [];
        assert.equal(h1.length, 1, `${rel}: un único h1, hay ${h1.length}`);
        assert.ok(!/<img[^>]*alt=""/.test(html), `${rel}: sin alt vacíos`);
        assert.ok(!/<img(?![^>]*alt=)[^>]*>/.test(html), `${rel}: toda img con alt`);
        assert.ok(html.includes('loading="lazy"'), `${rel}: imágenes con lazy-load (R5)`);
      }
    }
    const h1home = (read('dist/index.html').match(/<h1[\s>]/g) ?? []).length;
    assert.equal(h1home, 1, `home: un único h1, hay ${h1home}`);
  });
});
