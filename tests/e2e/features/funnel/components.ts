import type { Page, Locator } from '@playwright/test';

export class FunnelComponents {
  readonly footerAboutCta: Locator;
  readonly footerGithubLink: Locator;
  readonly aboutPagePortfolioCta: Locator;
  readonly aboutPageServicesCta: Locator;

  constructor(page: Page) {
    this.footerAboutCta        = page.locator('footer a.funnel-cta');
    this.footerGithubLink      = page.locator('footer').getByRole('link', { name: /github/i });
    this.aboutPagePortfolioCta = page.getByRole('link', { name: /view full portfolio/i });
    this.aboutPageServicesCta  = page.getByRole('link', { name: /test architecture/i });
  }
}
