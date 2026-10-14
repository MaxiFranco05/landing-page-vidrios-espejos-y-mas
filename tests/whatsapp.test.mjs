import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  MENSAJE_PREFIJO,
  MENSAJE_GENERICO,
  buildProductLink,
  buildGenericLink,
  buildTelLink,
  assertNumeroWhatsApp,
} from '../src/lib/whatsapp.ts';

const NUMERO = '5492625445223';

describe('whatsapp builders (c-04, RN-WA-01/02/03)', () => {
  test('fixture exacto: "Espejo baño apaisado" genera el link canónico (spec)', () => {
    assert.equal(
      buildProductLink(NUMERO, 'Espejo baño apaisado'),
      'https://wa.me/5492625445223?text=Hola%20Vidrios%2C%20espejos%20y%20mas!%20Quiero%20presupuesto%20de%20Espejo%20ba%C3%B1o%20apaisado',
    );
  });

  test('link genérico usa el mensaje 42a exacto (spec)', () => {
    assert.equal(
      buildGenericLink(NUMERO),
      'https://wa.me/5492625445223?text=Hola%20Vidrios%2C%20espejos%20y%20mas!%20Quiero%20consultar%20por%20otro%20trabajo.',
    );
  });

  test('constantes de mensaje con el texto exacto decidido en review', () => {
    assert.equal(MENSAJE_PREFIJO, 'Hola Vidrios, espejos y mas! Quiero presupuesto de ');
    assert.equal(MENSAJE_GENERICO, 'Hola Vidrios, espejos y mas! Quiero consultar por otro trabajo.');
  });

  test('acentos/comillas/emoji sobreviven al encodeo (roundtrip exacto)', () => {
    const nombre = 'Mesa "Ratona" Ñandú 🪞';
    const link = buildProductLink(NUMERO, nombre);
    const decodificado = new URL(link).searchParams.get('text');
    assert.equal(decodificado, `${MENSAJE_PREFIJO}${nombre}`);
    // Un solo encodeURIComponent sobre el mensaje completo (D2): sin doble-encodeo.
    assert.ok(!link.includes('%25'), 'el link no debe contener %25 (doble-encodeo)');
  });

  test('nombre con dígitos tipo medida se encodea tal cual (el gate R2 vive en la auditoría, no en el builder)', () => {
    const link = buildProductLink(NUMERO, 'Espejo 40x20');
    assert.equal(new URL(link).searchParams.get('text'), `${MENSAJE_PREFIJO}Espejo 40x20`);
  });

  test('número inválido lanza en los tres builders + validador', () => {
    for (const bad of ['+5492625445223', '549 2625 445223', '2625445223', 'abc', '']) {
      assert.throws(() => buildProductLink(bad, 'Espejo baño apaisado'), /whatsapp/i);
      assert.throws(() => buildGenericLink(bad), /whatsapp/i);
      assert.throws(
        () => buildTelLink({ whatsapp: bad, telefono_visible: '2625 44-5223' }),
        /whatsapp/i,
      );
      assert.throws(() => assertNumeroWhatsApp(bad), /whatsapp/i);
    }
  });

  test('nombre vacío lanza (sin mensaje no hay consulta calificada)', () => {
    assert.throws(() => buildProductLink(NUMERO, ''), /nombre/i);
    assert.throws(() => buildProductLink(NUMERO, '   '), /nombre/i);
  });

  test('buildTelLink deriva tel:+<whatsapp> y visible "+54 9 <telefono_visible>" (RN-WA-04)', () => {
    assert.deepEqual(buildTelLink({ whatsapp: NUMERO, telefono_visible: '2625 44-5223' }), {
      href: 'tel:+5492625445223',
      textoVisible: '+54 9 2625 44-5223',
    });
  });

  test('R4: ningún .astro/.ts bajo src/ (fuera del seed src/data) hardcodea el número', () => {
    const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
    const SRC = join(ROOT, 'src');
    const LITERAL = '5492625445223';
    // Un literal en un comentario documenta, no hardcodea (R4 apunta al
    // número funcional): se ignoran comentarios HTML, de bloque y de línea.
    // El lookbehind `(?<!:)` protege los `://` de las URLs en strings.
    const sinComentarios = (texto) =>
      texto
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/(?<!:)\/\/.*$/gm, '');
    const hallazgos = [];
    const caminar = (dir) => {
      for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);
        if (statSync(full).isDirectory()) {
          if (full === join(SRC, 'data')) continue; // seed: única fuente permitida
          caminar(full);
        } else if (/\.astro$|\.ts$/.test(entry)) {
          if (sinComentarios(readFileSync(full, 'utf8')).includes(LITERAL))
            hallazgos.push(full);
        }
      }
    };
    caminar(SRC);
    assert.deepEqual(hallazgos, [], `R4: literales hardcodeados en ${hallazgos.join(', ')}`);
  });
});
