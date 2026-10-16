import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

/**
 * Detecta literales `<tag>` dentro de comentarios del frontmatter.
 *
 * Causa raíz (2026-10-15): un `<head>` dentro de un comentario del
 * frontmatter rompió `astro dev`. El patrón exige forma de etiqueta
 * (`<` + letra + … + `>`, D5) para no flaggear comparaciones como
 * `a < b` en comentarios.
 *
 * Nota (falso positivo documentado, D5-riesgo): un genérico TS en un
 * comentario (p. ej. `// usa Array<string>`) TIENE forma de etiqueta y
 * será señalado — en ese caso se refina el patrón, no se silencia el test.
 *
 * @param {string} frontmatter texto entre los primeros `---`
 * @returns {string[]} hallazgos (`<tag> en comentario … (línea N)`); vacío si limpio
 */
export function etiquetasEnComentariosFrontmatter(frontmatter) {
  const hallazgos = [];
  // Strings primero (tienen prioridad en la alternancia): un `//` dentro
  // de `'https://…'` NO es un comentario. `(?<!:)` cubre URLs sin comillas.
  const TOKEN = /('(?:[^'\\\r\n]|\\.)*'|"(?:[^"\\\r\n]|\\.)*"|`(?:[^`\\]|\\.)*`)|\/\*[\s\S]*?\*\/|(?<!:)\/\/[^\r\n]*/g;
  const TAG = /<[a-zA-Z][^<>]*>/g;
  let m;
  while ((m = TOKEN.exec(frontmatter)) !== null) {
    const token = m[0];
    if (!token.startsWith('//') && !token.startsWith('/*')) continue; // string: ignorar
    const base = frontmatter.slice(0, m.index);
    const lineaBase = base.split('\n').length; // línea 1-indexed donde empieza el comentario
    let t;
    while ((t = TAG.exec(token)) !== null) {
      const linea = lineaBase + token.slice(0, t.index).split('\n').length - 1;
      const clase = token.startsWith('//') ? '//' : '/* */';
      hallazgos.push(`${t[0]} en comentario ${clase} (línea ${linea})`);
    }
  }
  return hallazgos;
}

/** Extrae el frontmatter (entre los primeros `---`) o '' si no hay. */
export function extraerFrontmatter(src) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(src);
  return m ? m[1] : '';
}

describe('frontmatter anti-<tag> en comentarios (C-11, causa raíz 2026-10-15)', () => {
  test('un `// ver <head> para el tema` en frontmatter debe detectarse', () => {
    const hallazgos = etiquetasEnComentariosFrontmatter('// ver <head> para el tema');
    assert.ok(hallazgos.length > 0, 'el detector debe señalar el literal <head> en comentario //');
    assert.ok(
      hallazgos.some((h) => h.includes('head')),
      'el hallazgo debe identificar la etiqueta (head)',
    );
  });

  test('TRIANGULATE: bloque /* */ con <div> se detecta; comparación `a < b` no', () => {
    const bloque = etiquetasEnComentariosFrontmatter('/* revisar el layout\n   con <div> envolvente */');
    assert.ok(bloque.length > 0, 'el detector debe señalar <div> en comentario de bloque');
    assert.ok(bloque.some((h) => h.includes('div')), 'el hallazgo debe identificar la etiqueta (div)');
    assert.deepEqual(
      etiquetasEnComentariosFrontmatter('// si a < b, ordenar antes'),
      [],
      'una comparación sin forma de etiqueta no debe fallar',
    );
    assert.deepEqual(
      etiquetasEnComentariosFrontmatter("const titulo = 'Ficha <head>'; // comentario limpio"),
      [],
      'un <tag> en string de código (no en comentario) no debe fallar',
    );
  });

  test('ningún .astro bajo src/ tiene literales <tag> en comentarios del frontmatter', () => {
    const archivos = [];
    const caminar = (dir) => {
      for (const e of readdirSync(dir)) {
        const p = join(dir, e);
        if (statSync(p).isDirectory()) caminar(p);
        else if (p.endsWith('.astro')) archivos.push(p);
      }
    };
    caminar(join(ROOT, 'src'));
    assert.ok(archivos.length > 0, 'debe haber .astro bajo src/');
    const violaciones = [];
    for (const archivo of archivos) {
      const front = extraerFrontmatter(readFileSync(archivo, 'utf8'));
      for (const h of etiquetasEnComentariosFrontmatter(front)) violaciones.push(`${archivo}: ${h}`);
    }
    assert.deepEqual(violaciones, [], `literales <tag> en comentarios del frontmatter:\n${violaciones.join('\n')}`);
  });
});
