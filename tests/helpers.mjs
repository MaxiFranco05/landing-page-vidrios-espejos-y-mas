import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const CONTENT_DIR = join(ROOT, 'src', 'content');

/** Lee todos los `.json` de `src/content/<subdir>` ordenados por nombre. */
export function loadJsonEntries(subdir) {
  const dir = join(CONTENT_DIR, subdir);
  return readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .sort()
    .map((file) => ({ file, data: JSON.parse(readFileSync(join(dir, file), 'utf8')) }));
}

/** Lee un JSON suelto del repo (p. ej. `src/content/datos-contacto.json`). */
export function loadJsonFile(...parts) {
  return JSON.parse(readFileSync(join(ROOT, ...parts), 'utf8'));
}

/** Verifica que un `src` tipo `/images/...` exista bajo `public/`. */
export function publicPathExists(src) {
  return existsSync(join(ROOT, 'public', String(src).replace(/^\/+/, '')));
}
