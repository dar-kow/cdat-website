import type { APIRequestContext } from '@playwright/test';
import { MCP_PATH, INIT_PAYLOAD } from './data';

interface JsonRpcResponse<T = unknown> {
  jsonrpc: '2.0';
  id: number;
  result?: T;
  error?: { code: number; message: string };
}

interface ToolListResult {
  tools: Array<{ name: string; title?: string; description?: string }>;
}

interface ToolCallResult {
  content: Array<{ type: string; text: string }>;
  isError?: boolean;
}

export class McpActions {
  constructor(private readonly request: APIRequestContext) {}

  async getInfo(): Promise<{ name: string; tools: string[] }> {
    const res = await this.request.get(MCP_PATH);
    if (!res.ok()) throw new Error(`GET /mcp returned ${res.status()}`);
    return res.json();
  }

  async rpc<T>(payload: Record<string, unknown>): Promise<JsonRpcResponse<T>> {
    const res = await this.request.post(MCP_PATH, {
      headers: {
        'content-type': 'application/json',
        accept: 'application/json, text/event-stream',
      },
      data: payload,
    });
    if (!res.ok()) {
      throw new Error(`POST /mcp returned ${res.status()}`);
    }
    return res.json();
  }

  async initialize(): Promise<JsonRpcResponse> {
    return this.rpc(INIT_PAYLOAD);
  }

  async listTools(): Promise<ToolListResult> {
    const r = await this.rpc<ToolListResult>({
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/list',
      params: {},
    });
    if (!r.result) throw new Error(`tools/list error: ${r.error?.message}`);
    return r.result;
  }

  async callTool(name: string, args: Record<string, unknown> = {}): Promise<ToolCallResult> {
    const r = await this.rpc<ToolCallResult>({
      jsonrpc: '2.0',
      id: 3,
      method: 'tools/call',
      params: { name, arguments: args },
    });
    if (!r.result) throw new Error(`tools/call error: ${r.error?.message}`);
    return r.result;
  }

  parseToolText<T>(result: ToolCallResult): T {
    return JSON.parse(result.content[0]?.text ?? 'null') as T;
  }
}
