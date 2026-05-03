import { test, expect } from '@playwright/test';
import { McpActions } from './actions';
import {
  EXPECTED_TOOL_NAMES,
  EXPECTED_DOCS_COUNT,
  EXPECTED_EXAMPLES_COUNT,
  SEARCH_PROBE,
  SEARCH_PROBE_MIN_HITS,
} from './data';

interface DocSummary {
  slug: string;
  title: string;
}

interface ExampleSummary {
  slug: string;
  complexity: string;
}

interface SearchResponse {
  query: string;
  hits: number;
  results: Array<{ source: string; slug: string; matches: string[] }>;
}

test.describe('MCP endpoint (/mcp)', () => {
  test('Given browser-style GET, When /mcp loads, Then friendly JSON info returned', async ({ request }) => {
    const actions = new McpActions(request);
    const info = await actions.getInfo();
    expect(info.name).toBe('cdat-pattern');
    expect(info.tools).toEqual(expect.arrayContaining([...EXPECTED_TOOL_NAMES]));
  });

  test('Given MCP client, When initialize sent, Then server returns capabilities + serverInfo', async ({ request }) => {
    const actions = new McpActions(request);
    const res = await actions.initialize();
    expect(res.error).toBeUndefined();
    expect(res.result).toBeDefined();
    const result = res.result as { protocolVersion: string; serverInfo: { name: string } };
    expect(result.protocolVersion).toBeDefined();
    expect(result.serverInfo.name).toBe('cdat-pattern');
  });

  test('Given MCP client, When tools/list called, Then 5 expected tools returned', async ({ request }) => {
    const actions = new McpActions(request);
    const list = await actions.listTools();
    expect(list.tools).toHaveLength(EXPECTED_TOOL_NAMES.length);
    const names = list.tools.map((t) => t.name);
    for (const expected of EXPECTED_TOOL_NAMES) {
      expect(names).toContain(expected);
    }
  });

  test('Given MCP client, When list_docs called, Then 6 docs returned with valid slugs', async ({ request }) => {
    const actions = new McpActions(request);
    const result = await actions.callTool('list_docs');
    const docs = actions.parseToolText<DocSummary[]>(result);
    expect(docs).toHaveLength(EXPECTED_DOCS_COUNT);
    expect(docs.map((d) => d.slug)).toEqual(
      expect.arrayContaining(['quickstart', 'architecture', 'zero-rules', 'migration', 'anti-patterns', 'smart-waits'])
    );
  });

  test('Given MCP client, When read_doc(quickstart), Then >800 chars markdown returned', async ({ request }) => {
    const actions = new McpActions(request);
    const result = await actions.callTool('read_doc', { slug: 'quickstart' });
    expect(result.isError).toBeFalsy();
    const text = result.content[0]?.text ?? '';
    expect(text.length).toBeGreaterThan(800);
  });

  test('Given MCP client, When list_examples called, Then 3 examples with complexity tier', async ({ request }) => {
    const actions = new McpActions(request);
    const result = await actions.callTool('list_examples');
    const examples = actions.parseToolText<ExampleSummary[]>(result);
    expect(examples).toHaveLength(EXPECTED_EXAMPLES_COUNT);
    for (const ex of examples) {
      expect(['basic', 'advanced', 'meta']).toContain(ex.complexity);
    }
  });

  test('Given MCP client, When search(waitForTimeout), Then at least 2 hits returned', async ({ request }) => {
    const actions = new McpActions(request);
    const result = await actions.callTool('search', { query: SEARCH_PROBE });
    const data = actions.parseToolText<SearchResponse>(result);
    expect(data.hits).toBeGreaterThanOrEqual(SEARCH_PROBE_MIN_HITS);
  });

  test('Given invalid slug, When read_doc called, Then isError=true returned', async ({ request }) => {
    const actions = new McpActions(request);
    const result = await actions.callTool('read_doc', { slug: 'this-doc-does-not-exist' });
    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain('Doc not found');
  });
});
