# CDAT Website

> Landing site for [CDAT Pattern](https://github.com/dar-kow/cdat-pattern) — 4-layer test architecture for Playwright. Battle-tested across 9 production systems over 18 months.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Built with CDAT](https://cdat.sdet.it/badge.svg)](https://cdat.sdet.it)
[![e2e](https://github.com/dar-kow/cdat-website/actions/workflows/e2e.yml/badge.svg)](https://github.com/dar-kow/cdat-website/actions/workflows/e2e.yml)
[![deploy](https://github.com/dar-kow/cdat-website/actions/workflows/deploy.yml/badge.svg)](https://github.com/dar-kow/cdat-website/actions/workflows/deploy.yml)

**Live:** [cdat.sdet.it](https://cdat.sdet.it)
**Pattern repo:** [github.com/dar-kow/cdat-pattern](https://github.com/dar-kow/cdat-pattern)
**MCP endpoint:** `https://cdat.sdet.it/mcp`

---

## What is this?

The source for **cdat.sdet.it** — landing page, interactive documentation, and MCP server for the CDAT Pattern.

The pattern itself (raw docs, examples, `@cdat/utils` package) lives in [`cdat-pattern`](https://github.com/dar-kow/cdat-pattern). This site **wraps** that pattern in interactive UI: animated 4-layer diagram, side-by-side bad/good code comparisons, Zero Rules toggle cards, POM-vs-CDAT comparison, and a guided learning path.

## MCP server

`/mcp` exposes CDAT documentation to AI agents over Streamable HTTP (Model Context Protocol). Add to your client and ask Claude/GPT/Cursor to "explain CDAT", "show me the Actions layer", or "find Playwright anti-patterns".

**Claude Desktop / Cursor config:**

```json
{
  "mcpServers": {
    "cdat": {
      "url": "https://cdat.sdet.it/mcp"
    }
  }
}
```

Tools exposed: `search_docs`, `get_layer`, `list_zero_rules`, `get_zero_rule`.

## This site is tested with CDAT

Every test under `tests/e2e/` follows the CDAT 4-file structure (components / data / actions / test). 124+ E2E tests across chromium / firefox / webkit / mobile-chrome — self-referential evidence that the pattern scales. See `tests/e2e/features/` for live examples.

## Stack

- **Framework:** Astro 6 (hybrid: static prerender + Node adapter for `/mcp`)
- **Styling:** Tailwind v4 + custom design tokens (`src/styles/tokens.css`)
- **Content:** MDX + Shiki (`github-dark-default` theme)
- **MCP:** `@modelcontextprotocol/sdk` 1.29 over WebStandard Streamable HTTP
- **Tests:** Playwright + axe-core, 4-browser matrix in CI
- **Deploy:** Docker on VPS, system nginx + certbot, Cloudflare proxy, GHA self-hosted runner

## Local development

```bash
pnpm install
pnpm dev          # http://localhost:4321
pnpm build        # → dist/ (static + node entry)
pnpm preview      # serve built output
pnpm test:e2e     # full Playwright matrix
```

## Project layout

```
src/
  components/   # Astro components (CdatDiagram, ZeroRuleCard, …)
  layouts/      # BaseLayout, DocsLayout
  pages/        # routes (index, about, docs/, examples/, mcp.ts)
  sections/     # homepage sections
  scripts/      # client-side TS (zero-rule-toggle, scroll-reveal)
  styles/       # global.css, tokens.css
  lib/          # shiki, schemas, mcp tools
public/         # static assets (favicon, badge, fonts, templates)
tests/e2e/      # CDAT-pattern Playwright tests
infra/          # nginx vhost, deploy notes
```

## Contributing

Issues and PRs welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).

## License

MIT — see [LICENSE](./LICENSE).

---

**Looking for the pattern itself?** → [github.com/dar-kow/cdat-pattern](https://github.com/dar-kow/cdat-pattern)
