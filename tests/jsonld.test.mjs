import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { STORE_NAME, buildStoreJsonLd } from '../src/lib/jsonld.ts';

const DIR = join(dirname(fileURLToPath(import.meta.url)), '..');
// NAP canónico: el seed versionado en git (única fuente, R4).
const NAP = JSON.parse(readFileSync(join(DIR, 'src', 'data', 'datos-contacto.json'), 'utf8'));
const SITE = 'https://vidrios-espejos-y-mas.netlify.app';

describe('jsonld Store (c-08, D3)', () => {
  test('bloque válido: Store con NAP exacto igual al visible', () => {
    const json = buildStoreJsonLd(
      { direccion: NAP.direccion, whatsapp: NAP.whatsapp, horarios: NAP.horarios },
      SITE,
    );
    assert.equal(json['@context'], 'https://schema.org');
    assert.equal(json['@type'], 'Store');
    assert.equal(json.name, STORE_NAME);
    assert.equal(json.address, NAP.direccion);
    assert.equal(json.telephone, '+' + NAP.whatsapp);
    assert.equal(json.openingHours, NAP.horarios);
    assert.equal(json.url, SITE);
    // Roundtrip: el bloque que se inyecta en la home parsea como JSON.
    assert.deepEqual(JSON.parse(JSON.stringify(json)), json);
  });

  test('solo contenido veraz: sin reseñas/precios/coordenadas/fotos inventadas', () => {
    const json = buildStoreJsonLd(
      { direccion: NAP.direccion, whatsapp: NAP.whatsapp, horarios: NAP.horarios },
      SITE,
    );
    for (const prohibido of [
      'aggregateRating',
      'review',
      'priceRange',
      'price',
      'geo',
      'latitude',
      'longitude',
      'image',
      'photo',
    ]) {
      assert.ok(!(prohibido in json), `campo inventado presente: ${prohibido}`);
    }
  });

  test('R4: el teléfono deriva del singleton, nunca literal en el módulo', () => {
    const src = readFileSync(join(DIR, 'src', 'lib', 'jsonld.ts'), 'utf8');
    assert.ok(!src.includes(NAP.whatsapp), 'número hardcodeado en jsonld.ts');
    assert.ok(!src.includes(NAP.telefono_visible), 'visible hardcodeado en jsonld.ts');
  });

  test('NAP vacío lanza (no se emite JSON-LD a medias)', () => {
    assert.throws(() => buildStoreJsonLd({ direccion: '', whatsapp: '1', horarios: 'h' }, SITE));
    assert.throws(() => buildStoreJsonLd({ direccion: 'd', whatsapp: '', horarios: 'h' }, SITE));
    assert.throws(() => buildStoreJsonLd({ direccion: 'd', whatsapp: '1', horarios: '' }, SITE));
  });
});
