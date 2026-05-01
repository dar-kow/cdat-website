# CDAT Website

> Landing site for [CDAT Pattern](https://github.com/darco81/cdat-pattern) - modern 4-layer test architecture for Playwright

🌐 **Live**: [cdat.sdet.it](https://cdat.sdet.it) (coming soon)
📦 **Pattern repo**: [github.com/darco81/cdat-pattern](https://github.com/darco81/cdat-pattern)

## What is this?

This repository contains the source for **cdat.sdet.it** - landing page and interactive documentation for CDAT Pattern.

The pattern itself (examples, templates, `@cdat/utils` package, raw docs) lives in the [`cdat-pattern`](https://github.com/darco81/cdat-pattern) repository.

This site **wraps** that pattern in interactive UI: animated diagrams, side-by-side code comparison, live examples, and a guided learning path.

## Stack

- **Framework**: Astro 5
- **Styling**: Tailwind v4
- **Content**: MDX + Shiki
- **Deployment**: Docker on VPS, nginx + Let's Encrypt

## Local development

```bash
pnpm install
pnpm dev
```

→ http://localhost:4321

## License

MIT - see [LICENSE](./LICENSE)

---

**Looking for the pattern itself?** → [github.com/darco81/cdat-pattern](https://github.com/darco81/cdat-pattern)
