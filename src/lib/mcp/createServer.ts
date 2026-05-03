import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getCollection } from 'astro:content';

const SITE_URL = 'https://cdat.sdet.it';

interface DocSummary {
  slug: string;
  title: string;
  description: string;
  url: string;
  order: number;
}

interface ExampleSummary {
  slug: string;
  title: string;
  description: string;
  complexity: 'basic' | 'advanced' | 'meta';
  codeLink: string;
  url: string;
}

interface SearchHit {
  source: 'docs' | 'examples';
  slug: string;
  title: string;
  url: string;
  matches: string[];
}

function stripFrontmatter(body: string): string {
  return body.replace(/^---[\s\S]*?---\n/, '');
}

async function loadDocs(): Promise<DocSummary[]> {
  const docs = await getCollection('docs');
  return docs
    .map((d) => ({
      slug: d.id,
      title: d.data.title,
      description: d.data.description,
      url: `${SITE_URL}/docs/${d.id}`,
      order: d.data.order,
    }))
    .sort((a, b) => a.order - b.order);
}

async function loadExamples(): Promise<ExampleSummary[]> {
  const examples = await getCollection('examples');
  return examples.map((e) => ({
    slug: e.id,
    title: e.data.title,
    description: e.data.description,
    complexity: e.data.complexity,
    codeLink: e.data.codeLink,
    url: `${SITE_URL}/examples/${e.id}`,
  }));
}

async function readDoc(slug: string): Promise<string | null> {
  const docs = await getCollection('docs');
  const doc = docs.find((d) => d.id === slug);
  if (!doc) return null;
  return stripFrontmatter(doc.body ?? '');
}

async function readExample(slug: string): Promise<string | null> {
  const examples = await getCollection('examples');
  const ex = examples.find((e) => e.id === slug);
  if (!ex) return null;
  return stripFrontmatter(ex.body ?? '');
}

function findMatches(body: string, query: string, contextChars = 80): string[] {
  const re = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
  const hits: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = re.exec(body)) !== null) {
    const start = Math.max(0, match.index - contextChars);
    const end = Math.min(body.length, match.index + query.length + contextChars);
    hits.push(`…${body.slice(start, end).replace(/\s+/g, ' ').trim()}…`);
    if (hits.length >= 3) break;
  }
  return hits;
}

async function searchAll(query: string): Promise<SearchHit[]> {
  if (!query || query.length < 2) return [];
  const results: SearchHit[] = [];

  const docs = await getCollection('docs');
  for (const d of docs) {
    const matches = findMatches(d.body ?? '', query);
    if (matches.length > 0) {
      results.push({
        source: 'docs',
        slug: d.id,
        title: d.data.title,
        url: `${SITE_URL}/docs/${d.id}`,
        matches,
      });
    }
  }

  const examples = await getCollection('examples');
  for (const e of examples) {
    const matches = findMatches(e.body ?? '', query);
    if (matches.length > 0) {
      results.push({
        source: 'examples',
        slug: e.id,
        title: e.data.title,
        url: `${SITE_URL}/examples/${e.id}`,
        matches,
      });
    }
  }

  return results;
}

export function createCdatMcpServer(): McpServer {
  const server = new McpServer({
    name: 'cdat-pattern',
    version: '1.0.0',
  });

  server.registerTool(
    'list_docs',
    {
      title: 'List CDAT documentation pages',
      description:
        'Returns the catalogue of CDAT documentation pages (quickstart, architecture, zero-rules, migration, anti-patterns, smart-waits) with title, description, slug, and URL. Use this first to discover what is available before reading.',
      inputSchema: {},
    },
    async () => {
      const docs = await loadDocs();
      return {
        content: [{ type: 'text', text: JSON.stringify(docs, null, 2) }],
      };
    }
  );

  server.registerTool(
    'read_doc',
    {
      title: 'Read a CDAT documentation page',
      description:
        'Returns the full markdown body of a single docs page identified by slug. Slugs come from list_docs (e.g., "quickstart", "architecture", "zero-rules", "migration", "anti-patterns", "smart-waits").',
      inputSchema: {
        slug: z.string().describe('Doc slug from list_docs'),
      },
    },
    async ({ slug }) => {
      const body = await readDoc(slug);
      if (body === null) {
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: `Doc not found: "${slug}". Use list_docs to see available slugs.`,
            },
          ],
        };
      }
      return {
        content: [{ type: 'text', text: body }],
      };
    }
  );

  server.registerTool(
    'list_examples',
    {
      title: 'List CDAT example projects',
      description:
        'Returns the catalogue of CDAT examples (basic login, e-commerce multi-feature, crm-erp enterprise) with title, complexity tier, GitHub source link, and slug. Use first to discover examples before reading.',
      inputSchema: {},
    },
    async () => {
      const examples = await loadExamples();
      return {
        content: [{ type: 'text', text: JSON.stringify(examples, null, 2) }],
      };
    }
  );

  server.registerTool(
    'read_example',
    {
      title: 'Read a CDAT example walkthrough',
      description:
        'Returns the full markdown body of a single example walkthrough identified by slug. Slugs come from list_examples (e.g., "basic", "e-commerce", "crm-erp").',
      inputSchema: {
        slug: z.string().describe('Example slug from list_examples'),
      },
    },
    async ({ slug }) => {
      const body = await readExample(slug);
      if (body === null) {
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: `Example not found: "${slug}". Use list_examples to see available slugs.`,
            },
          ],
        };
      }
      return {
        content: [{ type: 'text', text: body }],
      };
    }
  );

  server.registerTool(
    'search',
    {
      title: 'Full-text search across CDAT docs and examples',
      description:
        'Substring search across all docs and examples. Returns up to 3 context-rich snippets per matching page. Case-insensitive. Use to quickly locate specific terms.',
      inputSchema: {
        query: z.string().min(2).describe('Search term, minimum 2 characters'),
      },
    },
    async ({ query }) => {
      const results = await searchAll(query);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                query,
                hits: results.length,
                results,
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  return server;
}
