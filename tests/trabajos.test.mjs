import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { loadJsonEntries, publicPathExists } from './helpers.mjs';
import {
  trabajoSchema,
  categoriaSchema,
  assertSinPrecioNiMedida,
  validarCoherenciaIlustrativa,
} from '../src/lib/content-schemas.ts';

describe('trabajos (galería por categoría)', () => {
  const trabajos = loadJsonEntries('trabajos');
  const slugsCategoria = new Set(loadJsonEntries('categorias').map((e) => categoriaSchema.parse(e.data).slug));

  test('cada categoría tiene al menos dos trabajos (spec: Dos trabajos por categoría)', () => {
    const porCategoria = new Map();
    for (const { data } of trabajos) {
      const t = trabajoSchema.parse(data);
      porCategoria.set(t.categoria, (porCategoria.get(t.categoria) ?? 0) + 1);
    }
    for (const slug of slugsCategoria) {
      assert.ok((porCategoria.get(slug) ?? 0) >= 2, `categoría con menos de 2 trabajos: ${slug}`);
    }
  });

  test('toda ref de categoria existe', () => {
    for (const { file, data } of trabajos) {
      const t = trabajoSchema.parse(data);
      assert.ok(slugsCategoria.has(t.categoria), `${file}: categoria inexistente ${t.categoria}`);
    }
  });

  test('trabajo sin fotos rechazado (spec: Trabajo sin fotos rechazado, RN-CAT-04)', () => {
    for (const { file, data } of trabajos) {
      const t = trabajoSchema.parse(data);
      assert.ok(t.fotos.length >= 1, `${file} sin fotos`);
      for (const foto of t.fotos) {
        assert.ok(publicPathExists(foto.src), `${file}: falta archivo ${foto.src}`);
        assert.ok(foto.alt.trim().length >= 10);
      }
    }
    const base = trabajos[0].data;
    assert.throws(() => trabajoSchema.parse({ ...base, fotos: [] }));
  });

  test('placeholder exige ilustrativa + alt que lo indica (spec: Placeholder marcado como ilustrativo)', () => {
    for (const { file, data } of trabajos) {
      const t = trabajoSchema.parse(data);
      for (const foto of t.fotos) {
        validarCoherenciaIlustrativa(foto, `trabajos/${file}`);
      }
    }
    // Caso negativo: alt ilustrativo sin flag → incoherente:
    assert.throws(() =>
      validarCoherenciaIlustrativa(
        { src: '/images/trabajos/x.svg', alt: 'Imagen ilustrativa de un espejo', ilustrativa: false },
        'caso-negativo',
      ),
    );
  });

  test('sin precio ni medidas en ningún trabajo (RN-CAT-02)', () => {
    for (const { file, data } of trabajos) {
      assertSinPrecioNiMedida(data, `trabajos/${file}`);
    }
  });
});
