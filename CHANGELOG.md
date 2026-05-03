# Changelog

All notable changes to **cdat-website** are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] — 2026-05-03

First public release. `cdat.sdet.it` is live.

### Added

- **Site:** 14 pages — homepage, About, Resources, Docs (overview / quick-start / 4 layers / 3 zero-rules / patterns / migration / tooling / FAQ), Examples (basic / advanced / migration).
- **Homepage sections:** animated 4-layer SVG diagram, stats counter (9 systems / 18 months / 100% type-safe), Zero Rules interactive toggle cards, code preview, POM-vs-CDAT side-by-side, production proof, CTA strip.
- **MCP server** at `/mcp` — Streamable HTTP transport via `@modelcontextprotocol/sdk` 1.29; tools `search_docs`, `get_layer`, `list_zero_rules`, `get_zero_rule`. Hybrid Astro setup (static prerender + `@astrojs/node` adapter for the single MCP route).
- **SEO + AI discoverability:** sitemap.xml (`@astrojs/sitemap`), `llms.txt` + `llms-full.txt`, per-page Open Graph images generated at build time (Satori + resvg), JSON-LD schemas (Website / Person / Software / Article), canonical URLs, robots.txt.
- **E2E tests:** 124 Playwright tests structured per CDAT (components / data / actions / test) across chromium · firefox · webkit · mobile-chrome.
- **Accessibility:** WCAG 2.1 AA pass via axe-core; keyboard-navigable Zero Rules toggle (`role="switch"`, `aria-checked`, `aria-controls`); skip-to-content link; focus-visible outlines; `prefers-reduced-motion` honoured throughout.
- **Branding:** custom CDAT favicon (4-layer mini-diagram, matrix-green on terminal-dark), `theme-color` meta, JetBrains Mono + Inter font stack, terminal-dark default colour scheme.
- **Deploy pipeline:** GHA self-hosted runner on VPS, Docker compose stack bound to `127.0.0.1:8092`, system nginx + Let's Encrypt vhost, Cloudflare orange-cloud proxy. Push to `main` → auto-build → recreate container → smoke (`/mcp tools/list`, container probe, public HTTPS) → Docker prune.

### Design polish (post-launch sprint, 2026-05-03)

- Mobile horizontal scroll eliminated across all viewports (375 / 768 / 1024 / 1440).
- Zero Rules cards redesigned: was 3-column grid with internal horizontal scrollbars; now stacked single-column with side-layout (explanation left, code right) at ≥1024px. Code samples shortened to fit comfortably.
- Hamburger nav with animated bars→X transform, escape-key close, outside-click close, viewport-change auto-close.
- Scroll-reveal (IntersectionObserver, threshold 0.12) on lower sections; hero stays opacity 1 from t=0 to satisfy axe contrast checks.
- Universal `pre, code { max-width: 100% }` + grid-item `min-width: 0` to prevent Shiki blocks forcing parent overflow.

### Infrastructure notes

- Pinned `packageManager: pnpm@10.28.2` in `package.json` (required by `pnpm/action-setup@v4`).
- Native amd64 Docker build on VPS (Mac arm64 image incompatible with x86 host).
- nginx vhost combines `listen 443 ssl http2;` (split form fails to validate on this version).
- MCP smoke uses `Accept: application/json, text/event-stream` (Streamable HTTP requires both).

[Unreleased]: https://github.com/dar-kow/cdat-website/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/dar-kow/cdat-website/releases/tag/v1.0.0
