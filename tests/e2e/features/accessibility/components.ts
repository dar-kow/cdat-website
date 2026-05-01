import type { Page, Locator } from '@playwright/test';

// Accessibility feature has no interactive UI components; AxeBuilder is invoked
// in test.ts directly. This file exists only for CDAT 4-file conformance.

export class AccessibilityComponents {
  readonly main: Locator;

  constructor(page: Page) {
    this.main = page.locator('main#main');
  }
}
