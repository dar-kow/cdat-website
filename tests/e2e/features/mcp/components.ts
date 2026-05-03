import type { Page, Locator } from '@playwright/test';

// MCP feature test surface is HTTP-only (no UI), so components are minimal.
// Kept for CDAT 4-file conformance.

export class McpComponents {
  readonly main: Locator;

  constructor(page: Page) {
    this.main = page.locator('main');
  }
}
