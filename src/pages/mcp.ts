import type { APIRoute } from 'astro';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { createCdatMcpServer } from '../lib/mcp/createServer';

// MCP endpoint must run at request time, not be prerendered.
export const prerender = false;

const INFO = {
  name: 'cdat-pattern',
  version: '1.0.0',
  description:
    'Model Context Protocol endpoint for CDAT Pattern docs + examples. Connect any MCP client to consume CDAT content programmatically.',
  transport: 'streamable-http',
  spec: 'https://modelcontextprotocol.io',
  tools: ['list_docs', 'read_doc', 'list_examples', 'read_example', 'search'],
  usage: {
    'claude-desktop': {
      mcpServers: {
        'cdat-pattern': {
          transport: { type: 'streamable-http', url: 'https://cdat.sdet.it/mcp' },
        },
      },
    },
  },
} as const;

async function handleMcpRequest(request: Request): Promise<Response> {
  // Stateless mode: fresh server + transport per request.
  // Acceptable here because tool handlers are stateless (read-only over content).
  const server = createCdatMcpServer();
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });

  await server.connect(transport);
  try {
    return await transport.handleRequest(request);
  } finally {
    // Ensure cleanup; transport.close() shuts the SSE/stream if any.
    await server.close().catch(() => {
      /* swallow */
    });
  }
}

export const GET: APIRoute = async ({ request }) => {
  const accept = request.headers.get('accept') ?? '';
  // Browsers / curl without MCP headers get a friendly JSON description.
  if (!accept.includes('text/event-stream') && !accept.includes('application/json')) {
    return new Response(JSON.stringify(INFO, null, 2), {
      status: 200,
      headers: { 'content-type': 'application/json; charset=utf-8' },
    });
  }
  return handleMcpRequest(request);
};

export const POST: APIRoute = async ({ request }) => handleMcpRequest(request);

export const DELETE: APIRoute = async ({ request }) => handleMcpRequest(request);
