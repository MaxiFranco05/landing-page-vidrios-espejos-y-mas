import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadJsonFile } from './helpers.mjs';
import { buildGenericLink, buildTelLink } from '../src/lib/whatsapp.ts';
import { contienePrecioOMedida } from '../src/lib/content-schemas.ts';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const leer = (...parts) => readFileSync(join(ROOT, ...parts), 'utf8');

/** Igual que el gate R4 de whatsapp.test.mjs: un literal en comentario documenta, no hardcodea. */
const sinComentarios = (texto) =>
  texto
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(?<!:)\/\/.*$/gm, '');

const LITERALES_PROHIBIDOS = ['5492625445223', '26 de Julio', 'google.com/maps'];

function afirmarSinLiterales(fuente, etiqueta) {
  const limpio = sinComentarios(fuente);
  for (const literal of LITERALES_PROHIBIDOS) {
    assert.ok(
      !limpio.includes(literal),
      `${etiqueta}: literal hardcodeado ${JSON.stringify(literal)} (R4 — debe llegar por props desde datosContacto)`,
    );
  }
}

const CANON = {
  whatsapp: '5492625445223',
  telHref: 'tel:+5492625445223',
  direccion: '26 de Julio, M5620 Gral. Alvear, Mendoza',
  zona: 'Gral. Alvear y alrededores',
  horarios: 'Lun–Vie 8–19, Sáb 8–13, Dom cerrado',
};

describe('contacto-ubicacion (C-07)', () => {
  test('ContactInfo.astro: pieza única del NAP por props, reusa WhatsAppButton (D1/D3)', () => {
    const fuente = leer('src', 'components', 'ContactInfo.astro');
    for (const prop of ['direccion', 'zona', 'horarios', 'whatsapp', 'telefonoVisible']) {
      assert.ok(fuente.includes(prop), `ContactInfo debe declarar la prop ${prop}`);
    }
    assert.ok(fuente.includes('WhatsAppButton'), 'ContactInfo debe reusar WhatsAppButton (D1, sin reconstruir)');
    assert.ok(fuente.includes('variant="generic"'), 'ContactInfo usa la variante genérica de C-04');
    assert.ok(fuente.includes('mostrarTel'), 'ContactInfo expone el fallback tel: (RN-WA-04)');
    assert.ok(/<address[\s>]/.test(fuente), 'ContactInfo envuelve la dirección en <address>');
    afirmarSinLiterales(fuente, 'ContactInfo.astro');
  });

  test('MapEmbed.astro: iframe + fallback siempre en DOM, todo por props (D2)', () => {
    const fuente = leer('src', 'components', 'MapEmbed.astro');
    for (const prop of ['embedUrl', 'mapsUrl', 'direccion']) {
      assert.ok(fuente.includes(prop), `MapEmbed debe declarar la prop ${prop}`);
    }
    assert.ok(/<iframe[\s>]/.test(fuente), 'MapEmbed renderiza un iframe');
    assert.ok(fuente.includes('src={embedUrl}'), 'el iframe usa la prop embedUrl (nunca un literal, D7)');
    assert.ok(fuente.includes('title='), 'el iframe expone title (a11y)');
    assert.ok(fuente.includes('loading="lazy"'), 'el iframe carga diferido (R5)');
    assert.ok(/<address[\s>]/.test(fuente), 'la dirección en texto vive en <address> (fallback sin JS/red)');
    assert.ok(fuente.includes('Abrir en Google Maps'), 'link de fallback "Abrir en Google Maps"');
    assert.ok(fuente.includes('href={mapsUrl}'), 'el link usa la prop mapsUrl (D7)');
    assert.ok(fuente.includes('target="_blank"'), 'el link abre en pestaña nueva');
    assert.ok(fuente.includes('rel="noopener"'), 'el link lleva rel="noopener"');
    afirmarSinLiterales(fuente, 'MapEmbed.astro');
  });

  test('links canónicos derivan del singleton (tel: + wa.me)', () => {
    const datos = loadJsonFile('src', 'data', 'datos-contacto.json');
    const tel = buildTelLink({ whatsapp: datos.whatsapp, telefono_visible: datos.telefono_visible });
    assert.equal(tel.href, CANON.telHref);
    assert.equal(tel.textoVisible, `+54 9 ${datos.telefono_visible}`);
    assert.ok(
      buildGenericLink(datos.whatsapp).startsWith(`https://wa.me/${CANON.whatsapp}?text=`),
      'el CTA genérico apunta a wa.me/<numero> (R4)',
    );
  });

  test('maps por props exactas: BaseLayout/index pasan el singleton, MapEmbed lo vuelca (D5/D7)', () => {
    const layout = leer('src', 'layouts', 'BaseLayout.astro');
    const index = leer('src', 'pages', 'index.astro');
    const mapa = leer('src', 'components', 'MapEmbed.astro');
    assert.ok(
      index.includes('={datosContacto.maps_embed_url}'),
      'index pasa maps_embed_url por prop (copia exacta, sin reescribir el pb=)',
    );
    assert.ok(
      index.includes('datosContacto.maps_url}') || layout.includes('datosContacto.maps_url}'),
      'index o footer pasan maps_url por prop (derivada verificada)',
    );
    assert.ok(mapa.includes('src={embedUrl}'), 'MapEmbed vuelca embedUrl sin transformarla');
    assert.ok(mapa.includes('href={mapsUrl}'), 'MapEmbed vuelca mapsUrl sin transformarla');
    afirmarSinLiterales(layout, 'BaseLayout.astro');
    afirmarSinLiterales(index, 'index.astro');
  });

  test('NAP idéntico cableado en las cuatro superficies (header, contacto, ubicación, footer)', () => {
    const layout = leer('src', 'layouts', 'BaseLayout.astro');
    const index = leer('src', 'pages', 'index.astro');
    const usosLayout = (clave) => (layout.match(new RegExp(`datosContacto\\.${clave}`, 'g')) ?? []).length;
    const usosIndex = (clave) => (index.match(new RegExp(`datosContacto\\.${clave}`, 'g')) ?? []).length;
    for (const clave of ['direccion', 'zona_atencion', 'horarios']) {
      assert.ok(usosLayout(clave) >= 2, `BaseLayout debe cablear ${clave} en header Y footer (hay ${usosLayout(clave)})`);
      assert.ok(usosIndex(clave) >= 2, `index debe cablear ${clave} en contacto Y ubicación (hay ${usosIndex(clave)})`);
    }
    assert.ok(layout.includes('<footer'), 'BaseLayout expone footer con el NAP');
    assert.ok(layout.includes('Cómo llegar'), 'footer (o header) enlaza "Cómo llegar"');
  });

  test('secciones /#contacto y /#ubicacion anclables en zona marcada C-07', () => {
    const index = leer('src', 'pages', 'index.astro');
    assert.ok(index.includes('<!-- C-07'), 'el bloque C-07 va marcado para el paralelo con C-05/C-06');
    assert.ok(index.includes('id="contacto"'), 'existe el ancla /#contacto');
    assert.ok(index.includes('id="ubicacion"'), 'existe el ancla /#ubicacion');
    assert.ok(index.includes('scroll-mt-'), 'las secciones compensan el header fijo (scroll-margin-top, D7-riesgo)');
    assert.ok(index.includes('ContactInfo'), '/#contacto instancia ContactInfo (D3)');
    assert.ok(index.includes('MapEmbed'), '/#ubicacion instancia MapEmbed (D2)');
    assert.ok(/<h2[^>]*>/.test(index), 'headings de sección en orden lógico tras el h1');
  });

  test('a11y: anclas nativas, foco visible, sin div-button', () => {
    const contacto = leer('src', 'components', 'ContactInfo.astro');
    const mapa = leer('src', 'components', 'MapEmbed.astro');
    const menu = leer('src', 'components', 'MobileMenu.astro');
    const global = leer('src', 'styles', 'global.css');
    for (const [nombre, fuente] of [['ContactInfo', contacto], ['MapEmbed', mapa], ['MobileMenu', menu]]) {
      assert.ok(!/role="button"/.test(fuente), `${nombre}: sin div-button (anclas/botones nativos)`);
      assert.ok(!/<div[^>]*on:click/.test(fuente), `${nombre}: sin handlers sobre divs`);
    }
    assert.ok(global.includes(':focus-visible'), 'foco visible global (WCAG 2.2 AA)');
    assert.ok(mapa.includes('aria-label'), 'el link de Maps nombra su destino (no "clic aquí")');
  });

  test('MobileMenu: <details> nativo + micro-script, única isla nueva (D4)', () => {
    const fuente = leer('src', 'components', 'MobileMenu.astro');
    assert.ok(/<details[\s>]/.test(fuente), 'toggle con <details> nativo (gratis sin JS)');
    assert.ok(/<summary[\s>]/.test(fuente), 'botón nativo <summary> (sin div-button)');
    assert.ok(fuente.includes('/#contacto'), 'enlaza a /#contacto');
    assert.ok(fuente.includes('/#ubicacion'), 'enlaza a /#ubicacion');
    assert.ok(fuente.includes('Escape'), 'micro-script: Escape cierra');
    assert.ok(fuente.includes('aria-expanded'), 'micro-script: sincroniza aria-expanded');
    assert.ok(/md:hidden|hidden md:|max-width:\s*47|767px/.test(fuente), 'visible solo en mobile (md+ nav horizontal por CSS)');
    afirmarSinLiterales(fuente, 'MobileMenu.astro');
  });

  test('estático y comercial: sin endpoints/SSR, sin precios ni medidas, sin tailwind.config (R1/R2/R3)', () => {
    assert.ok(!existsSync(join(ROOT, 'tailwind.config.js')), 'R3: sin tailwind.config.js (CSS-first v4)');
    assert.ok(!existsSync(join(ROOT, 'tailwind.config.ts')), 'R3: sin tailwind.config.ts (CSS-first v4)');
    for (const archivo of ['ContactInfo.astro', 'MapEmbed.astro', 'MobileMenu.astro']) {
      const fuente = sinComentarios(leer('src', 'components', archivo));
      assert.ok(!/fetch\s*\(/.test(fuente), `${archivo}: sin fetch (R1 estático)`);
      assert.ok(!/prerender\s*=\s*false/.test(fuente), `${archivo}: sin opt-out de prerender (R1)`);
      assert.ok(
        !contienePrecioOMedida(fuente),
        `${archivo}: sin precios ni medidas en textos (R2 — lo comercial deriva a WhatsApp)`,
      );
    }
  });

  test('dist: NAP + tel + wa.me + embed exacto en el HTML servido (D7)', { skip: !existsSync(join(ROOT, 'dist', 'index.html')) }, () => {
    const html = leer('dist', 'index.html');
    const datos = loadJsonFile('src', 'data', 'datos-contacto.json');
    assert.ok(html.includes('id="contacto"'), 'dist expone /#contacto');
    assert.ok(html.includes('id="ubicacion"'), 'dist expone /#ubicacion');
    assert.ok(html.includes(CANON.telHref), 'dist expone el tel: canónico');
    assert.ok(html.includes(`wa.me/${CANON.whatsapp}`), 'dist expone el wa.me canónico');
    for (const cadena of [CANON.direccion, CANON.zona, CANON.horarios]) {
      const apariciones = html.split(cadena).length - 1;
      assert.ok(apariciones >= 4, `NAP ${JSON.stringify(cadena)} en las 4 superficies (hay ${apariciones})`);
    }
    const srcIframe = html.match(/<iframe[^>]*src="([^"]+)"/)?.[1];
    assert.equal(srcIframe, datos.maps_embed_url, 'iframe src === maps_embed_url EXACTO (D7, anti-typo del pb=)');
    assert.ok(html.includes(datos.maps_url), 'dist expone la maps_url derivada ("Cómo llegar")');
    assert.ok(html.includes('title="Mapa de Vidrios, espejos y mas'), 'el iframe servido expone title');
  });
});
