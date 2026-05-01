import type { Page, Locator } from '@playwright/test';

export class HomeComponents {
  readonly hero: Locator;
  readonly cdatDiagram: Locator;
  readonly statsCounter: Locator;
  readonly tagline: Locator;
  readonly subTagline: Locator;
  readonly quickstartCta: Locator;
  readonly githubCta: Locator;
  readonly deepDiveCta: Locator;
  readonly zeroRulesSection: Locator;
  readonly productionProofSection: Locator;

  constructor(private readonly page: Page) {
    this.hero                   = page.locator('section.hero');
    this.cdatDiagram            = page.locator('svg.cdat-diagram');
    this.statsCounter           = page.locator('section.stats-counter');
    this.tagline                = page.locator('p.tagline');
    this.subTagline             = page.locator('p.sub-tagline');
    this.quickstartCta          = page.getByRole('link', { name: /quickstart/i }).first();
    this.githubCta              = page.getByRole('link', { name: /view on github/i });
    this.deepDiveCta            = page.getByRole('link', { name: /read deep dive/i });
    this.zeroRulesSection       = page.locator('section.zero-rules');
    this.productionProofSection = page.locator('section.production-proof');
  }
}
