# CDAT Website

> Landing site for [CDAT Pattern](https://github.com/dar-kow/cdat-pattern) — modern 4-layer test architecture for Playwright

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Built with CDAT Pattern](https://cdat.sdet.it/badge.svg)](https://cdat.sdet.it)
[![e2e](https://github.com/dar-kow/cdat-website/actions/workflows/e2e.yml/badge.svg)](https://github.com/dar-kow/cdat-website/actions/workflows/e2e.yml)

🌐 **Live**: [cdat.sdet.it](https://cdat.sdet.it) (coming soon)
📦 **Pattern repo**: [github.com/dar-kow/cdat-pattern](https://github.com/dar-kow/cdat-pattern)

## What is this?

This repository contains the source for **cdat.sdet.it** — landing page and interactive documentation for CDAT Pattern.

The pattern itself (examples, templates, `@cdat/utils` package, raw docs) lives in the [`cdat-pattern`](https://github.com/dar-kow/cdat-pattern) repository.

This site **wraps** that pattern in interactive UI: animated diagrams, side-by-side code comparison, live examples, and a guided learning path.

## This site is tested with CDAT

Every test under `tests/e2e/` follows the CDAT 4-file structure (components / data / actions / test). Self-referential evidence that the pattern scales — see `tests/e2e/features/` for live examples.

## Stack

- **Framework**: Astro 5
- **Styling**: Tailwind v4
- **Content**: MDX + Shiki
- **Tests**: Playwright + axe-core (chromium / firefox / webkit matrix in CI)
- **Deployment**: Docker on VPS, nginx + Let's Encrypt

## Local development

```bash
pnpm install
pnpm dev          # localhost:4321
pnpm build        # static output to dist/
pnpm test:e2e     # run E2E tests against pnpm preview
```

## License

MIT — see [LICENSE](./LICENSE)

---

**Looking for the pattern itself?** → [github.com/dar-kow/cdat-pattern](https://github.com/dar-kow/cdat-pattern)
