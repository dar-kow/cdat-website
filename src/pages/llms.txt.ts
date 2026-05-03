import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const docs = (await getCollection('docs')).sort((a, b) => a.data.order - b.data.order);
  const examples = await getCollection('examples');

  const content = `# CDAT Pattern

> Modern 4-layer test architecture for Playwright + TypeScript. Production-proven alternative to Page Object Model.

## TL;DR

CDAT splits each test feature into **four files** with strict dependency direction:

- \`components.ts\` — locators only, no logic
- \`data.ts\` — types and fixtures, no Playwright imports
- \`actions.ts\` — business logic, no assertions
- \`test.ts\` — scenarios + assertions (only place \`expect()\` lives)

Two empirically-proven "zero rules" + one guideline:

- **Zero \`any\`** — every signature properly typed
- **Zero \`page.waitForTimeout()\`** — smart waits via \`@cdat/utils\` Cdat helper
- **Early-return guideline** — prefer flat code over nested if/else (guideline, not law — production data shows ranges 9-45 \`else\` per repo)

Battle-tested across **9 production systems over 18 months**. MIT licensed.

## Documentation

${docs.map((d) => `- [${d.data.title}](https://cdat.sdet.it/docs/${d.id}): ${d.data.description}`).join('\n')}

## Examples

${examples.map((e) => `- [${e.data.title}](https://cdat.sdet.it/examples/${e.id}): ${e.data.description}`).join('\n')}

## Pattern Repository

- [Source code](https://github.com/dar-kow/cdat-pattern): MIT-licensed reference implementation with examples and @cdat/utils package

## MCP Endpoint

This site exposes a Model Context Protocol endpoint so any MCP-compatible client (Claude Desktop, Cursor, Continue, etc.) can consume CDAT content programmatically — no scraping required.

- **URL:** https://cdat.sdet.it/mcp
- **Transport:** Streamable HTTP (stateless, JSON responses by default)
- **Tools:**
  - \`list_docs\` — catalogue all documentation pages
  - \`read_doc\` — full markdown body of one doc by slug
  - \`list_examples\` — catalogue all example walkthroughs
  - \`read_example\` — full markdown body of one example by slug
  - \`search\` — case-insensitive substring search across docs + examples

Claude Desktop config (\`~/Library/Application Support/Claude/claude_desktop_config.json\` on macOS):

\`\`\`json
{
  "mcpServers": {
    "cdat-pattern": {
      "transport": { "type": "streamable-http", "url": "https://cdat.sdet.it/mcp" }
    }
  }
}
\`\`\`

## Author

Dariusz Kowalski — AI-Powered Test Automation Architect

- Portfolio: https://portfolio.sdet.it
- LinkedIn: https://www.linkedin.com/in/darius-kowalski
- Services: https://sdet.it
`;

  return new Response(content, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
