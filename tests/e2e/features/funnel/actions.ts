import type { Page } from '@playwright/test';
import { Cdat, LocatorState } from '../../_utils/Cdat';
import { FunnelComponents } from './components';
import { ABOUT_PATH, HOME_PATH } from './data';

export class FunnelActions {
  readonly components: FunnelComponents;

  constructor(private readonly page: Page) {
    this.components = new FunnelComponents(page);
  }

  async visitHome(): Promise<void> {
    await this.page.goto(HOME_PATH);
  }

  async visitAbout(): Promise<void> {
    await this.page.goto(ABOUT_PATH);
    await Cdat.waitForState(this.components.aboutPagePortfolioCta, LocatorState.Visible);
  }

  async readFooterAboutHref(): Promise<string> {
    await this.components.footerAboutCta.scrollIntoViewIfNeeded();
    return (await this.components.footerAboutCta.getAttribute('href')) ?? '';
  }

  async readAboutPortfolioHref(): Promise<string> {
    return (await this.components.aboutPagePortfolioCta.getAttribute('href')) ?? '';
  }

  async readAboutServicesHref(): Promise<string> {
    return (await this.components.aboutPageServicesCta.getAttribute('href')) ?? '';
  }
}
