import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, loadJsonEntries } from './helpers.mjs';
import {
  trabajoSchema,
  categoriaSchema,
  assertSinPrecioNiMedida,
  validarCoherenciaIlustrativa,
} from '../src/lib/content-schemas.ts';

// C-06: la galería vive en Gallery.astro + zona marcada en index.astro.
const GALLERY = join(ROOT, 'src', 'components', 'Gallery.astro');
const INDEX = join(ROOT, 'src', 'pages', 'index.astro');
const DIST = join(ROOT, 'dist', 'index.html');

const read = (p) => readFileSync(p, 'utf8');

/** Quita frontmatter, <script> y <style>: queda el markup SSR visible. */
function soloMarkup(src) {
  return src
    .replace(/^---[\s\S]*?---/, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '');
}

describe('galeria C-06 (filtro + lightbox + gates)', () => {
  test('1.1 Gallery.astro expone section/dialog/aria-live SSR', () => {
    assert.ok(existsSync(GALLERY), 'falta src/components/Gallery.astro');
    const src = read(GALLERY);
    assert.ok(src.includes('<section'), 'sin <section> de galería');
    assert.ok(src.includes('id="destacados"'), 'la sección debe ser #destacados (D5)');
    assert.ok(src.includes('<dialog'), 'lightbox debe ser <dialog> nativo (D3)');
    assert.ok(src.includes('aria-live="polite"'), 'caption anunciada (spec: Caption anunciada)');
    assert.ok(src.includes('Imagen ilustrativa'), 'badge RN-CN-01');
  });

  test('2.1 filtro con botones nativos, aria-pressed y grupos data-categoria', () => {
    const src = read(GALLERY);
    assert.ok(src.includes('aria-pressed'), 'botones con aria-pressed (spec: Filtro por categoría)');
    assert.ok(src.includes('data-filtro'), 'botones con data-filtro');
    assert.ok(src.includes('data-categoria'), 'grupos con data-categoria (D2)');
    assert.ok(src.includes('hidden'), 'ocultado con hidden por defecto visible (PE, D2)');
    assert.ok(/data-filtro="todos"/.test(src), 'filtro "Todos" por defecto');
  });

  test('2.2 lightbox: showModal, Esc/flechas, foco, backdrop, fallback', () => {
    const src = read(GALLERY);
    assert.ok(src.includes('showModal'), 'apertura con showModal() (D3)');
    assert.ok(src.includes('ArrowRight') && src.includes('ArrowLeft'), 'flechas navegan');
    assert.ok(src.includes('.focus()'), 'foco gestionado (atrapado/devuelto)');
    assert.ok(src.includes('ev.target') || src.includes('e.target'), 'click en backdrop cierra');
    // PE: el thumbnail es un <a href> a la imagen directa; sin showModal no se intercepta.
    assert.ok(/<a[^>]*href=\{[^}]*src[^}]*\}/.test(src), 'thumbnail envuelto en <a href> (fallback sin JS)');
  });

  test('2.3 swipe portado de la demo (40px, pan-y, passive)', () => {
    const src = read(GALLERY);
    assert.ok(src.includes('touch-action: pan-y') || src.includes('touch-action:pan-y'), 'scroll vertical intacto');
    assert.ok(src.includes('touchstart') && src.includes('touchend'), 'listeners táctiles');
    assert.ok(src.includes('passive'), 'listeners passive');
    assert.ok(src.includes('40'), 'umbral 40px de la demo');
  });

  test('R5 cada <img> de grilla con alt, lazy y tamaño explícito', () => {
    const src = read(GALLERY);
    assert.ok(src.includes('loading="lazy"'), 'lazy en grilla');
    assert.ok(src.includes('width=') && src.includes('height='), 'tamaño explícito anti-CLS');
    assert.ok(src.includes('decoding="async"'), 'decoding async');
    // La imagen del lightbox es dinámica (la puebla JS al abrir): se
    // excluye del gate de grilla y se verifica por separado.
    assert.ok(src.includes('data-galeria-imagen'), 'lightbox con img dinámica');
    const sinDialogo = src.replace(/<dialog[\s\S]*?<\/dialog>/, '');
    for (const m of sinDialogo.matchAll(/<img[^>]*>/g)) {
      assert.ok(!/alt=""/.test(m[0]), `img sin alt: ${m[0]}`);
      assert.ok(/alt=\{[^}]*alt[^}]*\}/.test(m[0]), `img sin alt del seed: ${m[0]}`);
    }
  });

  test('R3 sin tailwind.config.ts; movimiento reducido contemplado', () => {
    assert.ok(!existsSync(join(ROOT, 'tailwind.config.ts')), 'R3: CSS-first, sin config JS');
    assert.ok(!existsSync(join(ROOT, 'tailwind.config.js')), 'R3: CSS-first, sin config JS');
    const src = read(GALLERY);
    assert.ok(src.includes('prefers-reduced-motion'), 'sin animación con movimiento reducido');
    // Solo tokens semánticos existentes, nada hardcodeado fuera de @theme.
    assert.ok(!/tailwind\.config/.test(src), 'el componente no referencia config JS');
  });

  test('1.2 index.astro: zona C-06 con colección, gate RN-CAT-04 y anclas', () => {
    assert.ok(existsSync(INDEX), 'falta src/pages/index.astro');
    const src = read(INDEX);
    assert.ok(src.includes('<!-- C-06'), 'punto de inserción marcado <!-- C-06 -->');
    assert.ok(src.includes("getCollection('trabajos')"), 'lee la colección trabajos');
    assert.ok(src.includes('fotos.length'), 'gate: filtra trabajos con fotos (RN-CAT-04)');
    assert.ok(src.includes('console.warn'), 'gate: build advierte la categoría vacía');
    assert.ok(src.includes('Gallery'), 'renderiza <Gallery>');
    assert.ok(src.includes('id="trabajos"'), 'alias fantasma #trabajos (D5)');
  });

  test('R2 + RN-CN-01/02 el seed apto para galería está limpio', () => {
    const trabajos = loadJsonEntries('trabajos');
    assert.ok(trabajos.length >= 10, 'seed: 10 trabajos');
    for (const { file, data } of trabajos) {
      const t = trabajoSchema.parse(data);
      assert.ok(t.fotos.length >= 1, `${file} sin fotos (RN-CAT-04)`);
      for (const foto of t.fotos) {
        assert.ok(foto.alt.trim().length >= 10, `${file}: alt descriptivo (RN-CN-02)`);
        validarCoherenciaIlustrativa(foto, `trabajos/${file}`);
      }
      assertSinPrecioNiMedida(data, `trabajos/${file}`);
    }
    // Las 4 categorías reales tienen trabajos para la galería.
    const slugs = new Set(loadJsonEntries('categorias').map((e) => categoriaSchema.parse(e.data).slug));
    for (const s of ['espejos', 'muebles-de-vidrio', 'instalaciones-y-aberturas', 'servicios-y-reparaciones']) {
      assert.ok(slugs.has(s), `falta categoría ${s}`);
    }
  });

  test('build: dist/index.html con #destacados y sin grupos vacíos', { skip: !existsSync(DIST) }, () => {
    const html = read(DIST);
    assert.ok(html.includes('id="destacados"'), 'dist contiene #destacados');
    assert.ok(html.includes('id="trabajos"'), 'dist contiene alias #trabajos');
    assert.ok(html.includes('<dialog'), 'dist contiene el lightbox SSR');
    for (const s of ['espejos', 'muebles-de-vidrio', 'instalaciones-y-aberturas', 'servicios-y-reparaciones']) {
      assert.ok(html.includes(`data-categoria="${s}"`), `dist muestra grupo ${s}`);
    }
  });
});
