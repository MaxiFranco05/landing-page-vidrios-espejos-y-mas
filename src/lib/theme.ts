// Utilidad pura del doble tema (C-03, D4).
// `resolveTheme` decide el tema efectivo sin tocar el DOM para poder
// testearla con `node --test`. El cableado DOM (leer `localStorage`,
// `matchMedia`, poner/quitar `.dark`) vive en el script anti-flash de
// `BaseLayout` y en `ThemeToggle.astro`, que delegan en esta función.

export type Theme = 'claro' | 'oscuro';

/**
 * Resuelve el tema efectivo.
 *
 * @param stored Valor guardado en `localStorage('tema')`: 'claro' |
 *   'oscuro' | 'sistema' | null (sin elección) | cualquier otro valor
 *   (corrupto o de versiones viejas).
 * @param prefersDark `matchMedia('(prefers-color-scheme: dark)').matches`.
 * @returns 'claro' u 'oscuro'. La elección guardada manda; sin ella o con
 *   valor inválido se sigue al sistema operativo.
 */
export function resolveTheme(
  stored: string | null | undefined,
  prefersDark: boolean,
): Theme {
  if (stored === 'claro' || stored === 'oscuro') return stored;
  return prefersDark ? 'oscuro' : 'claro';
}
