import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { loadJsonEntries, publicPathExists } from './helpers.mjs';
import {
  productoSchema,
  categoriaSchema,
  contienePrecioOMedida,
  assertSinPrecioNiMedida,
} from '../src/lib/content-schemas.ts';

describe('productos (sin precio ni medidas, RN-CAT-02)', () => {
  const productos = loadJsonEntries('productos');
  const slugsCategoria = new Set(loadJsonEntries('categorias').map((e) => categoriaSchema.parse(e.data).slug));

  test('cada categoría tiene su conteo del catálogo real 6/2/2/3 (spec: Producto válido por categoría, DD-09)', () => {
    const porCategoria = new Map();
    const nombres = new Map();
    for (const { data } of productos) {
      const p = productoSchema.parse(data);
      porCategoria.set(p.categoria, (porCategoria.get(p.categoria) ?? 0) + 1);
      if (!nombres.has(p.categoria)) nombres.set(p.categoria, []);
      nombres.get(p.categoria).push(p.nombre);
    }
    assert.equal(productos.length, 13);
    const esperado = {
      espejos: [
        'Espejo rectangular',
        'Espejo nube',
        'Espejo redondo',
        'Espejo redondo grande',
        'Espejo con LED',
        'Espejo panorámico',
      ],
      'muebles-de-vidrio': ['Mesa ratonera de cristal', 'Vitrina de vidrio'],
      'instalaciones-y-aberturas': ['Aberturas de aluminio', 'Mampara para baño'],
      'servicios-y-reparaciones': [
        'Reparación de vidrios de ventanas',
        'Reparación de espejos de vehículos',
        'Enmarcación de logros y recuerdos',
      ],
    };
    for (const [slug, lista] of Object.entries(esperado)) {
      assert.equal(porCategoria.get(slug) ?? 0, lista.length, `conteo distinto en: ${slug}`);
      assert.deepEqual([...(nombres.get(slug) ?? [])].sort(), [...lista].sort());
    }
  });

  test('slugs únicos y archivo === slug (spec: unicidad)', () => {
    const slugs = productos.map(({ data }) => productoSchema.parse(data).slug);
    assert.equal(new Set(slugs).size, slugs.length);
    for (const { file, data } of productos) {
      assert.equal(file, `${productoSchema.parse(data).slug}.json`);
    }
  });

  test('toda ref de categoria existe (spec: Ref a categoría inexistente rechazada)', () => {
    for (const { file, data } of productos) {
      const p = productoSchema.parse(data);
      assert.ok(slugsCategoria.has(p.categoria), `${file}: categoria inexistente ${p.categoria}`);
    }
    const base = productos[0].data;
    // D2: `categoria` es string a nivel schema (parsea igual); el gate de
    // ref rota es SEMÁNTICO — este test: la ref debe estar en el set real.
    const rota = { ...productoSchema.parse(base), categoria: 'categoria-que-no-existe' };
    assert.ok(productoSchema.parse(rota).categoria === 'categoria-que-no-existe');
    assert.ok(!slugsCategoria.has(rota.categoria), 'el gate debe marcar la ref rota');
  });

  test('toda foto existe en public/ y tiene alt no vacío (spec: Foto sin alt rechazada)', () => {
    for (const { file, data } of productos) {
      const p = productoSchema.parse(data);
      assert.ok(p.fotos.length >= 1, `${file} sin fotos`);
      for (const foto of p.fotos) {
        assert.ok(publicPathExists(foto.src), `${file}: falta archivo ${foto.src}`);
        assert.ok(foto.alt.trim().length >= 10);
      }
    }
    const base = productos[0].data;
    assert.throws(() =>
      productoSchema.parse({ ...base, fotos: [{ src: '/images/x.svg', alt: '' }] }),
    );
    assert.throws(() => productoSchema.parse({ ...base, fotos: [] }));
  });

  test('precio o medida rechazados por clave o patrón (spec: Precio o medida rechazados)', () => {
    const base = productos[0].data;
    // Clave extra (schema .strict()):
    assert.throws(() => productoSchema.parse({ ...base, precio: 15000 }));
    assert.throws(() => productoSchema.parse({ ...base, medidas: '120x80' }));
    // Patrones en texto libre (D4: el test es el gate real):
    for (const texto of ['$ 15.000', 'precio a convenir', '120 x 80 cm', '2 mts de alto', 'vale 5000 pesos']) {
      assert.ok(contienePrecioOMedida(texto), `debería detectar: ${texto}`);
    }
    // La frase legítima "a medida" (servicio, sin dimensiones) NO es medida:
    assert.ok(!contienePrecioOMedida('Corte a medida con colocación incluida'));
    // Ningún producto del seed contiene precio/medida:
    for (const { file, data } of productos) {
      assertSinPrecioNiMedida(data, `productos/${file}`);
    }
  });
});
