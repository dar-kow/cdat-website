import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const baseUrl = site?.toString().replace(/\/$/, '') ?? 'https://cdat.sdet.it';

  const agentCard = {
    name: 'CDAT Documentation Agent',
    description:
      'Agent for CDAT (Component-Driven Architecture for Testing) pattern documentation. 4-layer architecture (data → actions → components → test) for scalable test automation. Provides docs, code examples, and integration guidance for Playwright + TypeScript stacks.',
    url: baseUrl,
    version: '1.0.0',
    documentationUrl: `${baseUrl}/llms.txt`,
    capabilities: {
      streaming: false,
      pushNotifications: false,
      stateTransitionHistory: false,
    },
    authentication: {
      schemes: ['public'],
      credentials: null,
    },
    defaultInputModes: ['text/plain', 'application/json'],
    defaultOutputModes: ['text/plain', 'application/json'],
    skills: [
      {
        id: 'list_docs',
        name: 'List CDAT documentation pages',
        description:
          'Returns the ordered catalog of CDAT pattern documentation pages (intro, 4-layer breakdown, zero rules, migration from Page Object Model, tooling). Each entry includes slug, title, and one-line description. Use this to discover what docs exist before drilling into a specific topic with read_doc. Not for code examples (use list_examples) or arbitrary keyword lookup (use search).',
        tags: ['docs', 'catalog', 'discovery'],
        examples: [
          'What CDAT documentation pages are available?',
          'Where should I start learning the CDAT pattern?',
          'List every doc that covers the 4-layer architecture.',
        ],
      },
      {
        id: 'read_doc',
        name: 'Retrieve full doc page content',
        description:
          'Fetches the complete markdown body of a single CDAT documentation page by slug. Returns the frontmatter (title, description, order) plus the full content including code blocks, callouts, and cross-links to other docs and examples. Slugs come from list_docs output. Use this when you need the full text of a specific doc; for partial extraction or finding matching snippets across content, call search instead.',
        tags: ['docs', 'content', 'markdown'],
        examples: [
          'Show me the full content of the 4-layer-pattern doc.',
          'Read the zero-rules guide end to end.',
          'Get the migration-from-page-object doc with all code samples.',
        ],
      },
      {
        id: 'list_examples',
        name: 'List CDAT code examples',
        description:
          'Returns the catalog of runnable CDAT example walkthroughs, each demonstrating a specific aspect of the 4-layer pattern (data, actions, components, test). Entries include slug, title, and one-line description tagging the scenario covered. Use this to discover what examples exist before reading one in full with read_example. Each example is a real, end-to-end CDAT implementation with rationale, not a snippet.',
        tags: ['examples', 'catalog', 'playwright'],
        examples: [
          'What CDAT code examples are available?',
          'Show me examples that demonstrate the actions layer.',
          'List examples involving Playwright fixtures or API mocking.',
        ],
      },
      {
        id: 'read_example',
        name: 'Retrieve full example with code',
        description:
          'Fetches the complete markdown body of a single CDAT example by slug, including every code block (data.ts, components.ts, actions.ts, test.ts) plus the narrative explaining design decisions and when the pattern applies. Slugs come from list_examples output. Use this to study a real CDAT implementation end to end; for cross-example comparison or finding a specific snippet, prefer search.',
        tags: ['examples', 'code', 'walkthrough'],
        examples: [
          'Read the login-flow example in full.',
          'Show me the example using shared Playwright fixtures.',
          'Get the complete code for the API-mocking CDAT example.',
        ],
      },
      {
        id: 'search',
        name: 'Search docs and examples',
        description:
          'Case-insensitive substring search across the full corpus of CDAT docs and examples. Returns matching pages with title, type (doc/example), slug, and a snippet showing the match in context. Use this for cross-cutting questions ("where is X discussed?", "find all mentions of Y") or when you do not yet know which doc or example to read. Note: exact substring matching only — not semantic or fuzzy search.',
        tags: ['search', 'discovery', 'docs', 'examples'],
        examples: [
          "Search the CDAT corpus for 'waitForTimeout'.",
          'Find every mention of fixtures across docs and examples.',
          "Search for the 'zero any' rule.",
        ],
      },
    ],
    contact: {
      name: 'Dariusz Kowalski',
      url: 'https://portfolio.sdet.it/contact',
    },
  };

  return new Response(JSON.stringify(agentCard, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
