import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { resolveTheme } from '../src/lib/theme.ts';

// resolveTheme(stored, prefersDark): 'claro' | 'oscuro'.
// - stored 'claro'/'oscuro' manda; sin elección o valor inválido sigue al SO.

describe('theme.resolveTheme (C-03, doble tema)', () => {
  test('sin elección guardada sigue al sistema en claro (spec: Default sigue al sistema)', () => {
    assert.equal(resolveTheme(null, false), 'claro');
  });

  test('sin elección guardada sigue al sistema en oscuro (spec: Default sigue al sistema)', () => {
    assert.equal(resolveTheme(null, true), 'oscuro');
  });

  test('elección guardada "oscuro" persiste aunque el sistema esté en claro (spec: la elección persiste)', () => {
    assert.equal(resolveTheme('oscuro', false), 'oscuro');
  });

  test('elección guardada "claro" persiste aunque el sistema esté en oscuro (spec: la elección persiste)', () => {
    assert.equal(resolveTheme('claro', true), 'claro');
  });

  test('valor inválido o "sistema" cae al tema del sistema (borde: localStorage corrupto)', () => {
    assert.equal(resolveTheme('noche', true), 'oscuro');
    assert.equal(resolveTheme('noche', false), 'claro');
    assert.equal(resolveTheme('sistema', true), 'oscuro');
    assert.equal(resolveTheme('sistema', false), 'claro');
    assert.equal(resolveTheme('', false), 'claro');
    assert.equal(resolveTheme(undefined, true), 'oscuro');
  });
});
