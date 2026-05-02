import type { Page, Locator } from '@playwright/test';

export class FunnelComponents {
  readonly footerAboutCta: Locator;
  readonly footerGithubLink: Locator;
  readonly aboutPagePortfolioCta: Locator;
  readonly aboutPageServicesCta: Locator;

  constructor(page: Page) {
    this.footerAboutCta        = page.locator('footer a.funnel-cta');
    this.footerGithubLink      = page.locator('footer').getByRole('link', { name: /github/i });
    this.aboutPagePortfolioCta = page.locator('article.about-page a.cta-primary');
    this.aboutPageServicesCta  = page.locator('article.about-page a.cta-secondary');
  }
}
