import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { loadJsonFile } from './helpers.mjs';
import { datosContactoSchema } from '../src/lib/content-schemas.ts';

const CANONICAL = {
  whatsapp: '5492625445223',
  direccion: 'Estrada 912, Gral. Alvear, Mendoza',
  zona_atencion: 'Gral. Alvear y alrededores',
  horarios: 'Lun–Vie 8–19, Sáb 8–13, Dom cerrado',
};

describe('datos-contacto (singleton, RN-WA-03)', () => {
  test('el JSON valida contra el schema', () => {
    const raw = loadJsonFile('src', 'data', 'datos-contacto.json');
    const parsed = datosContactoSchema.parse(raw);
    assert.equal(parsed.whatsapp, CANONICAL.whatsapp);
  });

  test('valores canónicos del seed (spec: Valores canónicos del seed)', () => {
    const parsed = datosContactoSchema.parse(loadJsonFile('src', 'data', 'datos-contacto.json'));
    assert.equal(parsed.whatsapp, CANONICAL.whatsapp);
    assert.equal(parsed.direccion, CANONICAL.direccion);
    assert.equal(parsed.zona_atencion, CANONICAL.zona_atencion);
    assert.equal(parsed.horarios, CANONICAL.horarios);
    assert.ok(parsed.telefono_visible.length > 0);
    assert.ok(parsed.maps_url.startsWith('https://www.google.com/maps/'));
    assert.ok(parsed.maps_embed_url.startsWith('https://www.google.com/maps/'));
  });

  test('rechaza whatsapp con `+`, espacios o sin código internacional (spec: Formato de whatsapp validado)', () => {
    const base = loadJsonFile('src', 'data', 'datos-contacto.json');
    for (const bad of ['+5492625445223', '549 2625 445223', '2625445223', 'abc', '']) {
      assert.throws(
        () => datosContactoSchema.parse({ ...base, whatsapp: bad }),
        /whatsapp|Invalid|Too small/i,
        `debería rechazar whatsapp=${JSON.stringify(bad)}`,
      );
    }
  });

  test('rechaza claves extra (contrato cerrado, R2/R4)', () => {
    const base = loadJsonFile('src', 'data', 'datos-contacto.json');
    assert.throws(() => datosContactoSchema.parse({ ...base, precio: 100 }));
  });
});
