import { test, describe, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { ANALYTICS_EVENTS, isAnalyticsEvent, track } from '../src/lib/analytics.ts';

afterEach(() => {
  // @ts-ignore — limpieza del double de `window` entre tests.
  delete globalThis.window;
});

describe('analytics umami (c-08, D4)', () => {
  test('nombres de evento exactos del spec (producto vs. genérico, tel, maps)', () => {
    assert.deepEqual([...ANALYTICS_EVENTS], [
      'whatsapp-product-click',
      'whatsapp-generic-click',
      'tel-click',
      'maps-click',
    ]);
  });

  test('isAnalyticsEvent valida la allowlist y rechaza otros', () => {
    assert.equal(isAnalyticsEvent('whatsapp-product-click'), true);
    assert.equal(isAnalyticsEvent('tel-click'), true);
    assert.equal(isAnalyticsEvent('click'), false);
    assert.equal(isAnalyticsEvent(''), false);
  });

  test('sin `window` (SSR/build, scenario sin env) es no-op sin lanzar', () => {
    assert.doesNotThrow(() => track('whatsapp-generic-click', { origen: '/' }));
  });

  test('con `window` pero sin `window.umami` (adblock) es no-op sin lanzar', () => {
    // @ts-ignore — double mínimo de window sin umami.
    globalThis.window = {};
    assert.doesNotThrow(() => track('tel-click', { origen: '/catalogo' }));
  });

  test('con `window.umami` registra nombre + payload (clic en producto)', () => {
    const vistos = [];
    // @ts-ignore — double de la API mínima de Umami.
    globalThis.window = { umami: { track: (name, data) => vistos.push([name, data]) } };
    track('whatsapp-product-click', { producto: 'Espejo nube', categoria: 'espejos', origen: '/' });
    assert.deepEqual(vistos, [
      ['whatsapp-product-click', { producto: 'Espejo nube', categoria: 'espejos', origen: '/' }],
    ]);
  });

  test('si `umami.track` lanza, `track` lo absorbe (la página no se rompe)', () => {
    // @ts-ignore — umami roto a propósito.
    globalThis.window = {
      umami: {
        track: () => {
          throw new Error('umami bloqueado');
        },
      },
    };
    assert.doesNotThrow(() => track('maps-click', { origen: '/#ubicacion' }));
  });
});
