import type { Page, Locator } from '@playwright/test';

export class DocsQuickstartComponents {
  readonly heading: Locator;
  readonly sidebar: Locator;
  readonly activeNavLink: Locator;
  readonly codeBlocks: Locator;
  readonly githubFooterLink: Locator;
  readonly architectureLink: Locator;

  constructor(page: Page) {
    this.heading           = page.getByRole('heading', { level: 1, name: /quickstart/i });
    this.sidebar           = page.locator('aside.docs-sidebar');
    this.activeNavLink     = page.locator('aside.docs-sidebar a.active');
    this.codeBlocks        = page.locator('pre.shiki-pre');
    this.githubFooterLink  = page.locator('p.gh-link a');
    this.architectureLink  = page.getByRole('link', { name: /architecture/i }).first();
  }
}
