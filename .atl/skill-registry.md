# Skill Registry

**Delegator use only.** Any agent that launches sub-agents reads this registry to resolve compact rules, then injects them directly into sub-agent prompts. Sub-agents do NOT read this registry or individual SKILL.md files.

## User Skills

| Trigger | Skill | Path |
|---------|-------|------|
| Building new UI or reshaping existing one; distinctive, intentional visual design | frontend-design | .agents/skills/frontend-design/SKILL.md |
| "review my UI", "check accessibility", "audit design", "review UX", best-practices review | web-design-guidelines | .agents/skills/web-design-guidelines/SKILL.md |
| Build, design, redesign, restyle, polish or review a landing page / marketing site / hero; page looks generic or "AI-made" | design-taste-frontend | .agents/skills/design-taste-frontend/SKILL.md |
| "SEO audit", "technical SEO", "why am I not ranking", traffic dropped, indexing/crawl issues, local SEO | seo-audit | .agents/skills/seo-audit/SKILL.md |
| Loading/interaction performance, Core Web Vitals, Lighthouse performance scores | web-perf | .agents/skills/web-perf/SKILL.md |
| Component libraries, design tokens/theming, standardizing UI patterns, Tailwind v4 | tailwind-design-system | .agents/skills/tailwind-design-system/SKILL.md |
| "improve accessibility", "a11y audit", "WCAG compliance", screen reader / keyboard support | accessibility | .agents/skills/accessibility/SKILL.md |
| "improve SEO", "optimize for search", "fix meta tags", "add structured data", sitemaps | seo | .agents/skills/seo/SKILL.md |
| Work with Astro, .astro files, SSG, islands, content collections, deploying Astro | astro | .agents/skills/astro/SKILL.md |

## Compact Rules

Pre-digested rules per skill. Delegators copy matching blocks into sub-agent prompts as `## Project Standards (auto-resolved)`.

### frontend-design
- Ground every choice in the subject matter (vidriería: vidrio, espejo, luz, taller) — never generic SaaS styling
- Plan first as tokens (4–6 named hex colors, 1–2 typefaces, layout concept with ASCII wireframe), review against brief, then build
- Hero opens with the most characteristic thing of the subject; avoid big-number-with-gradient-accent default unless truly best
- Never: single-accent-word headlines, ALL-CAPS labels, eyebrow label above every heading, numbered 01/02/03 markers on non-sequences, middle-dot meta strings, `→` on links
- One orchestrated motion moment max; motion that answers user action is welcome; always respect prefers-reduced-motion
- One memorable element per page; cut decoration that doesn't serve the brief; responsive + visible keyboard focus floor
- Copy from end-user perspective, active voice, CTA names the outcome ("Consultar por WhatsApp")

### web-design-guidelines
- Always fetch fresh guidelines first via WebFetch: `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md` — never audit from memory
- Check the specified files against ALL fetched rules; if no files given, ask which files/pattern to review
- Output findings in the terse `file:line` format defined by the fetched guidelines

### design-taste-frontend
- Landing/marketing pages only (not dashboards); stack-agnostic, works with Astro + Tailwind
- Run the scripted flow from project root (Node 22+, Chrome/Chromium): `draw.mjs` deals 3 directions → choose the one carrying something only this client has → build from its direction sheet, never blend with default layout
- Inventory 8–12 subject-specific items first (name, address, materials, rituals, printed artefacts); the page idea must pass the competitor test
- Write full copy deck before markup: every headline ≤ 2 lines at all widths (~32 chars safe), one primary action, full section content; never invent proof (reviews, stats, logos)
- House bans (inspector-measured): no eyebrows, no monospace outside code, no index numbers, no hairline rules, no gradients, no resting shadows/glows, no cream+terracotta or violet palettes, no icon-topped card grids, no glass/blur, no accent-word headlines, max 2 typefaces
- Gate: `lint.mjs` + `inspect.mjs` (1440/768/390px) must show zero FAILs; then critique screenshots, fix top 3, max 3 rounds; ≥4 real pictures (own/generated/open-collection with credit), motion layer with signature move + per-section entrances + control feedback
- Report: direction + redraws, idea sentence, scores, image credits, sample content to swap

### seo-audit
- Priority order: crawlability/indexation → technical foundations → on-page → content quality → authority; fastest wins are pages ranking positions 8–20
- Never report "no schema" from web_fetch/curl alone (they strip/inject-miss JS JSON-LD); validate with browser query, Rich Results Test, or Screams Frog render
- Check: robots.txt blocks, sitemap (canonical URLs only), self-referencing canonicals, HTTPS, lowercase hyphenated URLs, one H1, unique 50–60 char titles + 150–160 char descriptions, descriptive filenames/alt/WebP/lazy images
- Local-business lens (this project): NAP consistency, Google Business Profile, location pages, local schema — see references/local-seo.md
- Output: executive summary + per-issue (Issue/Impact/Evidence/Fix/Priority) + prioritized action plan

### web-perf
- Prefer retrieval over memory for thresholds: web.dev/vitals, Chrome DevTools perf docs, Lighthouse scoring docs
- Workflow: performance trace (cold reload) → Core Web Vitals via analyze_insight → network requests → a11y snapshot → codebase analysis
- Good thresholds: LCP < 2.5s, INP < 200ms, CLS < 0.1, TTFB < 800ms, FCP < 1.8s, TBT < 200ms
- Be assertive and specific ("compress hero.png 450KB → WebP"), quantify impact, skip 0ms non-issues; a 200ms-LCP / 0-CLS site is already excellent — say so
- Astro/SSG lens: detect bundler config, preload hero image/fonts, lazy-load gallery, check Tailwind content purging, verify compression/minification; output CWV table + prioritized issues + actionable fixes

### tailwind-design-system
- Tailwind CSS v4 only (CSS-first, no `tailwind.config.ts`): `@import "tailwindcss"`, tokens via `@theme { --color-*: ... }`, dark mode via `@custom-variant dark (&:where(.dark, .dark *))`
- Prefer OKLCH color values; token hierarchy brand → semantic → component (`oklch(...) → --color-primary → bg-primary`)
- Component order: base styles → variants → sizes → states → overrides; radius/animate tokens live in `@theme` (`--radius-*`, `--animate-*` + `@keyframes`)
- Base layer applies `border-border` globally and `bg-background text-foreground antialiased` on body; dark overrides go in `.dark` block
- Read `references/details.md` when the top-level patterns are insufficient; v3→v4 migration follows the official upgrade guide

### accessibility
- Target WCAG 2.2 AA; automated score of 100 is not conformance — always pair with manual checks
- Evidence-led flow when page is renderable: Lighthouse a11y audit → a11y-tree snapshot (names/roles/landmarks/headings) → keyboard-walk the flow → fix → re-run
- Contrast: 4.5:1 normal / 3:1 large text & UI components; never color-alone for errors (color + icon + text, `aria-invalid` + describedby)
- Prefer native elements (`button`, `a[href]`, inputs) over ARIA roles; never `outline: none` without `:focus-visible` replacement; targets ≥ 24×24px (44×44 recommended); honor `prefers-reduced-motion`
- Every image needs alt (empty + `role="presentation"` if decorative); every input a programmatic label; `<html lang="es">`; skip link; logical heading order; announce errors with `role="alert"` and focus first error

### seo
- Evidence-led: live Lighthouse SEO + rendered checks when possible; separate crawl/index findings from content/authority; never promise ranking changes
- Technical: robots.txt allows crawling + sitemap ref; self-referencing canonicals; HTTPS-only assets; short lowercase hyphenated URLs with keywords; responsive viewport; 16px+ body, ≥48px tap targets
- On-page: descriptive primary H1 (hierarchy logical, don't fail on multiple valid h1 alone); unique titles (~50–60 chars, keyword near front, brand when useful); unique descriptions (~150–160 chars + CTA); descriptive filenames/alt/dimensions/lazy; descriptive anchor text + breadcrumbs
- Structured data: most specific type for visible accurate content only; validate rendered output — syntax ≠ eligibility
- `llms.txt` is optional/experimental — add only on request; never treat as ranking factor; crawler controls (GPTBot, ClaudeBot, Google-Extended) are product-specific, verify in vendor docs

### astro
- Always consult docs.astro.build for current API; `src/pages/` required (filename = route), `src/components|layouts|styles` by convention, `public/` copied as-is
- CLI: `npx astro dev|build|check|add|sync`; run `astro check` before every build; verify `dist/` non-empty after build
- Set `site:` in astro.config to the final deployed URL (sitemaps + canonicals); deploy via adapter (`npx astro add netlify --yes` for this project)
- Static-first: content collections for catalog content, islands only where interactivity is needed; keep output prerenderable for Netlify static hosting

## Project Conventions

| File | Path | Notes |
|------|------|-------|
| *(none yet)* | — | No AGENTS.md / CLAUDE.md / .cursorrules / GEMINI.md / copilot-instructions.md at project root; conventions section starts empty (expected — agent-instruction phase comes next) |
