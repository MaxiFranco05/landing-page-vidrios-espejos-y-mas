import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { loadJsonFile } from './helpers.mjs';
import {
  assertSinPrecioNiMedida,
  testimonioSchema,
  testimoniosSchema,
} from '../src/lib/content-schemas.ts';
import { testimonios } from '../src/lib/testimonios.ts';

/**
 * Gate verbatim byte-a-byte (C-10, D4): los 7 comentarios EXACTOS del
 * change context. Copiar sin reescribir: tildes, comillas y `!!!`
 * intactos. Cualquier edición del JSON o de estas constantes rompe.
 */
const ESPERADOS = [
  {
    nombre: 'Noelia Berdus',
    comentario:
      'Estos espejos superaron mis expectativas. Reflejan la luz de una manera hermosa y le dan un toque especial a cualquier espacio.',
  },
  {
    nombre: 'Irma Torres',
    comentario:
      'Hermosos espejos me compré uno quedó precioso. Gracias por la atención y un muy buen precio.',
  },
  {
    nombre: 'Pedro Verdugo',
    comentario: 'Muy buen trabajo lo recomiendo yo les coloque a mi Trafic.',
  },
  {
    nombre: 'Lorena Berdus',
    comentario:
      'Muy bellos espejos. Hay que llamar o enviar un mensaje para coordinar una visita.',
  },
  {
    nombre: 'Victor Hugo Franco',
    comentario: 'Excelente atención y precios súper económicos.',
  },
  {
    nombre: 'Adrián Pavez',
    comentario: 'Muy buenos diseños y atención!!!',
  },
  {
    nombre: 'Andrea Berdus',
    comentario: 'Hermosos diseños y atención!',
  },
];

/**
 * Intención R2 (sin CIFRAS ni medidas publicadas): el gate literal
 * `assertSinPrecioNiMedida` matchea la prosa de cliente ("muy buen
 * precio"), así que NO aplica al comentario verbatim (desvío documentado
 * en `content-schemas.ts::testimonioSchema`). Esto cubre lo que R2
 * realmente prohíbe publicar: importes, monedas y dimensiones.
 */
const CIFRAS_O_MEDIDAS_RE =
  /[$€£]|\b\d+\s*(pesos|usd|u\$s|ars|d[oó]lares?)\b|\b\d+\s*(cm|mm|mts?|metros?|pulgadas?)\b|\b\d+\s*[x×]\s*\d+/i;

describe('testimonios (C-10, 7 reseñas verbatim)', () => {
  test('el JSON parsea, tiene 7 entradas y valida contra el schema', () => {
    const raw = loadJsonFile('src', 'data', 'testimonios.json');
    assert.equal(raw.length, 7);
    const parsed = testimoniosSchema.parse(raw);
    assert.equal(parsed.length, 7);
    for (const t of parsed) {
      assert.equal(t.calificacion, 5);
      assert.equal(t.fuente, 'Google Maps');
    }
  });

  test('el loader D5 expone las 7 entradas (task 1.3: import bajo node:test)', () => {
    assert.equal(testimonios.length, 7);
    assert.deepEqual(
      testimonios.map((t) => t.nombre),
      ESPERADOS.map((e) => e.nombre),
    );
  });

  test('gate verbatim: nombre + comentario idénticos byte a byte (spec: Siete tarjetas)', () => {
    const raw = loadJsonFile('src', 'data', 'testimonios.json');
    assert.equal(raw.length, ESPERADOS.length);
    raw.forEach((t, i) => {
      assert.equal(t.nombre, ESPERADOS[i].nombre, `nombre[${i}] alterado`);
      assert.equal(t.comentario, ESPERADOS[i].comentario, `comentario[${i}] alterado`);
    });
  });

  test('gate verbatim negativo: alterar un carácter rompe la comparación', () => {
    const raw = loadJsonFile('src', 'data', 'testimonios.json');
    const mutado = raw.map((t) => ({ ...t }));
    mutado[5] = { ...mutado[5], comentario: mutado[5].comentario.replace('!!!', '!!') };
    assert.notEqual(mutado[5].comentario, ESPERADOS[5].comentario);
    assert.throws(() => {
      mutado.forEach((t, i) => assert.equal(t.comentario, ESPERADOS[i].comentario));
    }, /alterado|Expected values to be strictly equal/i);
  });

  test('schema rechaza comentario vacío, calificacion != 5 y fuente distinta (task 1.1)', () => {
    const base = loadJsonFile('src', 'data', 'testimonios.json')[0];
    assert.throws(() => testimonioSchema.parse({ ...base, comentario: '' }));
    assert.throws(() => testimonioSchema.parse({ ...base, calificacion: 4 }));
    assert.throws(() => testimonioSchema.parse({ ...base, fuente: 'Facebook' }));
    assert.throws(() => testimonioSchema.parse({ ...base, precio: 100 }));
  });

  test('schema rechaza array con 6 u 8 entradas (spec: Texto faltante rechazado)', () => {
    const raw = loadJsonFile('src', 'data', 'testimonios.json');
    assert.throws(() => testimoniosSchema.parse(raw.slice(0, 6)));
    assert.throws(() => testimoniosSchema.parse([...raw, raw[0]]));
  });

  test('R2: ningún comentario publica cifras ni medidas (desvío documentado del gate literal)', () => {
    const raw = loadJsonFile('src', 'data', 'testimonios.json');
    for (const t of raw) {
      assert.ok(
        !CIFRAS_O_MEDIDAS_RE.test(t.comentario),
        `cifra/medida publicada en: ${t.nombre}`,
      );
    }
    // Evidencia del desvío: el gate literal SÍ matchea prosa de cliente
    // ("muy buen precio" — cita, no precio publicado), por eso no aplica.
    assert.throws(
      () => raw.forEach((t, i) => assertSinPrecioNiMedida(t, `testimonio[${i}]`)),
      /precio/i,
    );
  });
});
