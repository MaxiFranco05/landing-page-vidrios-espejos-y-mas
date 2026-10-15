/**
 * Medición mínima con Umami (C-08, D4 / SU-02): sin cookies, sin backend.
 *
 * `track(name, data)` es no-op si `window.umami` está ausente (sin env,
 * con adblock o en SSR/build): la medición NUNCA rompe la página.
 * Módulo puro (cero imports de Astro), testeable con `node:test`.
 *
 * Los CTAs existentes lo consumen vía listener delegado en
 * `BaseLayout` (atributos `data-umami-event`, hrefs intactos C-04/C-07).
 */

export const ANALYTICS_EVENTS = [
  'whatsapp-product-click',
  'whatsapp-generic-click',
  'tel-click',
  'maps-click',
] as const;

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[number];

export function isAnalyticsEvent(name: string): name is AnalyticsEvent {
  return (ANALYTICS_EVENTS as readonly string[]).includes(name);
}

interface UmamiApi {
  track: (name: string, data?: Record<string, string>) => void;
}

declare global {
  interface Window {
    umami?: UmamiApi;
  }
}

/** Registra un evento; no-op silencioso sin `window.umami`. */
export function track(name: AnalyticsEvent, data?: Record<string, string>): void {
  try {
    if (typeof window === 'undefined') return;
    window.umami?.track(name, data);
  } catch {
    /* Medición direccional: nunca rompe la página ni el render. */
  }
}
