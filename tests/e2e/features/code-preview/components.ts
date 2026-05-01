import type { Page, Locator } from '@playwright/test';

export class CodePreviewComponents {
  readonly tablist: Locator;
  readonly tabs: Locator;
  readonly activeTab: Locator;
  readonly visiblePanel: Locator;
  readonly copyButton: Locator;

  constructor(page: Page) {
    this.tablist      = page.locator('[role="tablist"]').first();
    this.tabs         = page.locator('[role="tab"]');
    this.activeTab    = page.locator('[role="tab"][aria-selected="true"]');
    this.visiblePanel = page.locator('[role="tabpanel"]:not([hidden])');
    this.copyButton   = page.locator('button.cp-copy').first();
  }
}
