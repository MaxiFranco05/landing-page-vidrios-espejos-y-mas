import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_SITE,
  DEFAULT_OG_IMAGE,
  OG_LOCALE,
  normalizePath,
  absoluteUrl,
  buildSeo,
} from '../src/lib/seo.ts';

const SITE = 'https://vidrios-espejos-y-mas.netlify.app';

describe('seo builder (c-08, D1)', () => {
  test('canonical absoluto auto-referencial desde site + path', () => {
    const tags = buildSeo({ title: 'T', description: 'D', path: '/catalogo', site: SITE });
    assert.equal(tags.canonical, SITE + '/catalogo');
    assert.equal(tags.ogUrl, SITE + '/catalogo');
  });

  test('raíz `/` canonicaliza al site sin barra final (sin duplicado trailing-slash)', () => {
    const sin = buildSeo({ title: 'T', description: 'D', path: '/', site: SITE });
    const con = buildSeo({ title: 'T', description: 'D', path: '/?x=1', site: SITE });
    assert.equal(sin.canonical, SITE);
    assert.equal(con.canonical, SITE);
  });

  test('normaliza mayúsculas, barra final y query/hash', () => {
    assert.equal(normalizePath('/Catalogo/'), '/catalogo');
    assert.equal(normalizePath('/categoria/espejos?utm=x#frag'), '/categoria/espejos');
    const tags = buildSeo({ title: 'T', description: 'D', path: '/Catalogo/?utm=x', site: SITE });
    assert.equal(tags.canonical, SITE + '/catalogo');
  });

  test('OG completo con locale es_AR y Twitter card grande', () => {
    const tags = buildSeo({ title: 'Mi title', description: 'Mi desc', path: '/', site: SITE });
    assert.equal(tags.ogTitle, 'Mi title');
    assert.equal(tags.ogDescription, 'Mi desc');
    assert.equal(tags.ogType, 'website');
    assert.equal(tags.ogLocale, 'es_AR');
    assert.equal(OG_LOCALE, 'es_AR');
    assert.equal(tags.twitterCard, 'summary_large_image');
    assert.equal(tags.twitterTitle, 'Mi title');
    assert.equal(tags.twitterDescription, 'Mi desc');
  });

  test('og:image por defecto absolutiza el asset real de public/', () => {
    const tags = buildSeo({ title: 'T', description: 'D', path: '/', site: SITE });
    assert.equal(tags.ogImage, SITE + DEFAULT_OG_IMAGE);
    assert.equal(tags.twitterImage, SITE + DEFAULT_OG_IMAGE);
  });

  test('og:image absoluta externa pasa intacta; relativa se absolutiza', () => {
    const ext = buildSeo({ title: 'T', description: 'D', path: '/', site: SITE, image: 'https://cdn.example/x.png' });
    assert.equal(ext.ogImage, 'https://cdn.example/x.png');
    const rel = buildSeo({ title: 'T', description: 'D', path: '/', site: SITE, image: '/images/x.svg' });
    assert.equal(rel.ogImage, SITE + '/images/x.svg');
    assert.equal(absoluteUrl(SITE + '/', '/a'), SITE + '/a');
  });

  test('site por defecto es la canónica temporal (PA-01 pendiente)', () => {
    const tags = buildSeo({ title: 'T', description: 'D', path: '/catalogo' });
    assert.equal(tags.canonical, DEFAULT_SITE + '/catalogo');
    assert.equal(DEFAULT_SITE, SITE);
  });

  test('type article se propaga a og:type', () => {
    const tags = buildSeo({ title: 'T', description: 'D', path: '/', site: SITE, type: 'article' });
    assert.equal(tags.ogType, 'article');
  });
});
