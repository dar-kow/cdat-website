export const MCP_PATH = '/mcp';

export const EXPECTED_TOOL_NAMES = [
  'list_docs',
  'read_doc',
  'list_examples',
  'read_example',
  'search',
] as const;

export const EXPECTED_DOCS_COUNT = 6;
export const EXPECTED_EXAMPLES_COUNT = 3;
export const SEARCH_PROBE = 'waitForTimeout';
export const SEARCH_PROBE_MIN_HITS = 2;

export const INIT_PAYLOAD = {
  jsonrpc: '2.0' as const,
  id: 1,
  method: 'initialize',
  params: {
    protocolVersion: '2025-03-26',
    capabilities: {},
    clientInfo: { name: 'cdat-e2e', version: '1.0.0' },
  },
};
