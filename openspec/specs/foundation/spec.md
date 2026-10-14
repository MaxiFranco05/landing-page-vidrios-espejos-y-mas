# foundation Specification

## Purpose

Garantiza que el sitio exista como proyecto Astro estático construible y desplegable en Netlify, con estructura, estilos base y configuración que todos los changes posteriores asumen.

## Requirements

### Requirement: Build estático reproducible

El sistema SHALL generar el sitio completo como HTML/CSS/JS estático mediante `npm run build`, sin requerir servidor en runtime.

#### Scenario: Build genera dist con home

- **WHEN** un desarrollador ejecuta `npm run build` en un checkout limpio con dependencias instaladas
- **THEN** el comando termina con éxito y `dist/index.html` existe con contenido no vacío

#### Scenario: Sin endpoints de servidor

- **WHEN** se inspecciona la salida de `dist/` y la configuración de Astro
- **THEN** no hay funciones serverless propias, rutas SSR ni endpoints API del proyecto (R1)

### Requirement: Typecheck limpio antes de build

El sistema SHALL pasar `npm run check` (`astro check`) sin errores antes de considerar válido un build.

#### Scenario: Check verde en baseline

- **WHEN** un desarrollador ejecuta `npm run check` sobre el scaffolding inicial
- **THEN** el comando termina con cero errores y cero warnings bloqueantes

### Requirement: Estructura de proyecto según arquitectura

El sistema SHALL exponer la estructura `src/{content,components,layouts,pages,styles,lib}` y `public/images/` definida en `08_arquitectura_propuesta.md`.

#### Scenario: Rutas y carpetas presentes

- **WHEN** se lista el checkout tras el scaffolding
- **THEN** existen `src/pages/index.astro`, `src/layouts/BaseLayout.astro`, `src/styles/global.css` y las carpetas `src/content/{categorias,productos,trabajos}`, `src/components`, `src/lib`, `public/images/`

#### Scenario: Layout base aplica shell común

- **WHEN** se renderiza cualquier página que usa `BaseLayout`
- **THEN** el HTML incluye un `<head>` común, importa los tokens globales y renderiza el contenido del slot

### Requirement: Estilos Tailwind v4 CSS-first

El sistema SHALL proveer Tailwind CSS v4 sin `tailwind.config.ts`, con tokens vía `@theme` en `src/styles` (R3).

#### Scenario: Tokens cargan sin config JS

- **WHEN** se inspeccionan los archivos de estilos y el build
- **THEN** no existe `tailwind.config.ts/js`, `global.css` contiene `@import "tailwindcss"` y el build CSS termina sin errores

### Requirement: Deploy en Netlify desde git

El sistema SHALL ser desplegable en Netlify con build `npm run build` y publish `dist`, usando URL temporal `*.netlify.app` hasta resolver PA-01.

#### Scenario: Config de deploy declarada

- **WHEN** se lee `netlify.toml` en la raíz
- **THEN** declara build command `npm run build`, publish directory `dist` y variable de sitio temporal documentada

### Requirement: Variables públicas de contacto centralizadas

El sistema SHALL declarar las variables públicas de contacto en `.env.example` como única fuente de verdad futura (R4).

#### Scenario: Env example completo

- **WHEN** se lee `.env.example`
- **THEN** contiene `PUBLIC_WHATSAPP_NUMBER`, `PUBLIC_PHONE_DISPLAY`, `PUBLIC_ADDRESS`, `PUBLIC_MAPS_URL`, `PUBLIC_MAPS_EMBED_URL` con valores de ejemplo y ningún número real hardcodeado en componentes del scaffolding

### Requirement: Contenido interno excluido del sitio

El sistema SHALL excluir `knowledge-base/` y `discovery/` del output publicado y del routeo.

#### Scenario: KB fuera de dist

- **WHEN** se ejecuta `npm run build` y se inspecciona `dist/`
- **THEN** no existe `dist/knowledge-base/` ni `dist/discovery/`, y ninguna ruta pública sirve esos archivos
