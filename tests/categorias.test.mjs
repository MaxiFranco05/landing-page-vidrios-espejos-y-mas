import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { loadJsonEntries, publicPathExists } from './helpers.mjs';
import {
  categoriaSchema,
  CATEGORIA_SLUGS,
  assertSinPrecioNiMedida,
} from '../src/lib/content-schemas.ts';

describe('categorias (RN-CAT-01)', () => {
  const entries = loadJsonEntries('categorias');

  test('existen exactamente las 4 categorías del catálogo real (spec: Cuatro categorías del seed, DD-09)', () => {
    const slugs = entries.map((e) => categoriaSchema.parse(e.data).slug).sort();
    assert.deepEqual(slugs, [...CATEGORIA_SLUGS].sort());
    assert.deepEqual(
      [...CATEGORIA_SLUGS].sort(),
      [
        'espejos',
        'instalaciones-y-aberturas',
        'muebles-de-vidrio',
        'servicios-y-reparaciones',
      ].sort(),
    );
  });

  test('cada archivo valida y su nombre coincide con el slug', () => {
    for (const { file, data } of entries) {
      const parsed = categoriaSchema.parse(data);
      assert.equal(file, `${parsed.slug}.json`);
    }
  });

  test('slugs kebab-case y únicos (spec: Slug duplicado o no kebab-case rechazado)', () => {
    const slugs = entries.map((e) => e.data.slug);
    assert.equal(new Set(slugs).size, slugs.length);
    for (const slug of slugs) {
      assert.match(slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    }
    // Casos de rechazo del schema:
    const base = entries[0].data;
    assert.throws(() => categoriaSchema.parse({ ...base, slug: 'Espejos Nuevos' }));
    assert.throws(() => categoriaSchema.parse({ ...base, slug: 'espejos_nuevos' }));
  });

  test('orden respetado en home (spec: Orden respected en home)', () => {
    const parsed = entries.map((e) => categoriaSchema.parse(e.data));
    const porOrden = [...parsed].sort((a, b) => a.orden - b.orden).map((c) => c.slug);
    assert.deepEqual(porOrden, [...CATEGORIA_SLUGS]);
  });

  test('portada existe en public/, tiene alt y marca ilustrativa coherente (RN-CAT-04, RN-CN-01/02)', () => {
    for (const { data } of entries) {
      const { imagen_portada } = categoriaSchema.parse(data);
      assert.ok(publicPathExists(imagen_portada.src), `falta archivo: ${imagen_portada.src}`);
      assert.ok(imagen_portada.alt.trim().length >= 10);
      if (imagen_portada.ilustrativa) {
        assert.match(imagen_portada.alt, /ilustrativ/i);
      }
    }
  });

  test('sin precio ni medidas en ninguna categoría (RN-CAT-02)', () => {
    for (const { file, data } of entries) {
      assertSinPrecioNiMedida(data, `categorias/${file}`);
    }
  });
});
