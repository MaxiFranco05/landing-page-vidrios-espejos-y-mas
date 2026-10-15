import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { seoCopySchema } from '../src/lib/content-schemas.ts';
import { DEFAULT_OG_IMAGE } from '../src/lib/seo.ts';
import { loadJsonFile } from './helpers.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const leer = (...parts) => readFileSync(join(ROOT, ...parts), 'utf8');
const len = (s) => [...s].length;

// El deck validado (el loader `seo-copy.ts` hace este mismo parse en Astro).
const seoCopy = seoCopySchema.parse(loadJsonFile('src', 'data', 'seo-copy.json'));

/** Las 7 parejas servidas: home + catálogo + 4 categorías + 404. */
function parejasServidas() {
  return [
    ['home', seoCopy.home],
    ['catalogo', seoCopy.catalogo],
    ...Object.entries(seoCopy.categorias).map(([slug, p]) => [`categoria/${slug}`, p]),
    ['404', seoCopy.noEncontrada],
  ];
}

describe('seo copy deck (c-08, tasks 1.1/2.3)', () => {
  test('el loader valida: 7 titles 50–60 + 7 descriptions 150–160 (si esto parsea, están en rango)', () => {
    const parejas = parejasServidas();
    assert.equal(parejas.length, 7);
    for (const [etiqueta, p] of parejas) {
      assert.ok(len(p.title) >= 50 && len(p.title) <= 60, `${etiqueta}: title ${len(p.title)}`);
      assert.ok(len(p.description) >= 150 && len(p.description) <= 160, `${etiqueta}: description ${len(p.description)}`);
    }
  });

  test('los 7 titles y las 7 descriptions son únicos (sin duplicados entre páginas)', () => {
    const parejas = parejasServidas();
    assert.equal(new Set(parejas.map(([, p]) => p.title)).size, 7, 'titles duplicados');
    assert.equal(new Set(parejas.map(([, p]) => p.description)).size, 7, 'descriptions duplicadas');
  });

  test('home con keyword local al frente; categorías nombran su categoría + localidad', () => {
    assert.ok(seoCopy.home.title.startsWith('Vidriería en Gral. Alvear'), 'keyword al frente en home');
    for (const [slug, p] of Object.entries(seoCopy.categorias)) {
      assert.ok(p.path === `/categoria/${slug}`, `${slug}: path canónico del deck`);
      assert.ok(/Gral\. Alvear/.test(p.title + p.description), `${slug}: nombra la localidad`);
    }
  });

  test('sin placeholders ni texto provisorio de C-01 en ningún copy', () => {
    const todo = JSON.stringify(seoCopy);
    for (const patron of ['Placeholder', 'Lorem', 'C-01', 'XXXX', 'TODO']) {
      assert.ok(!todo.includes(patron), `provisorio en deck: ${patron}`);
    }
  });

  test('las páginas consumen el deck (ningún title/description literal en páginas/layout)', () => {
    for (const archivo of [
      ['src', 'layouts', 'BaseLayout.astro'],
      ['src', 'pages', 'index.astro'],
      ['src', 'pages', 'catalogo.astro'],
      ['src', 'pages', '404.astro'],
      ['src', 'pages', 'categoria', '[slug].astro'],
    ]) {
      assert.ok(leer(...archivo).includes('seoCopy'), `${archivo.join('/')} consume seoCopy`);
    }
    // Ningún literal del deck sobrevive fuera de src/data (R4 extensivo al copy).
    const literales = [seoCopy.home.title, seoCopy.catalogo.description, seoCopy.noEncontrada.title];
    for (const archivo of ['src/layouts/BaseLayout.astro', 'src/pages/index.astro', 'src/pages/404.astro']) {
      const fuente = leer(...archivo.split('/'));
      for (const literal of literales) {
        assert.ok(!fuente.includes(literal), `${archivo}: literal del deck hardcodeado`);
      }
    }
  });

  test('og:image por defecto existe en public/ (scenario OG: archivo real)', () => {
    assert.ok(existsSync(join(ROOT, 'public', DEFAULT_OG_IMAGE)), `falta ${DEFAULT_OG_IMAGE}`);
  });
});
