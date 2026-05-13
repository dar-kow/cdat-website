import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const baseUrl = site?.toString().replace(/\/$/, '') ?? 'https://cdat.sdet.it';

  const manifest = {
    version: '2025-06-18',
    name: 'cdat-docs-mcp',
    description:
      'Read-only MCP server exposing CDAT (Component-Driven Architecture for Testing) pattern documentation and code examples for AI agents. Streamable HTTP transport, stateless, no authentication required.',
    servers: [
      {
        name: 'cdat-docs',
        url: `${baseUrl}/mcp`,
        transport: 'http',
        auth: { type: 'none' },
        capabilities: {
          tools: true,
          resources: false,
          prompts: false,
        },
      },
    ],
    contact: {
      name: 'Dariusz Kowalski',
      url: 'https://portfolio.sdet.it/contact',
    },
  };

  return new Response(JSON.stringify(manifest, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
