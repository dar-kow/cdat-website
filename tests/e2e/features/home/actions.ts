import type { Page } from '@playwright/test';
import { Cdat, LocatorState } from '../../_utils/Cdat';
import { HomeComponents } from './components';
import { HOME_PATH } from './data';

export class HomeActions {
  readonly components: HomeComponents;

  constructor(private readonly page: Page) {
    this.components = new HomeComponents(page);
  }

  async visit(): Promise<void> {
    await this.page.goto(HOME_PATH);
    await Cdat.waitForState(this.components.hero, LocatorState.Visible);
  }

  async scrollToSection(section: 'stats' | 'rules' | 'proof'): Promise<void> {
    const target = section === 'stats'
      ? this.components.statsCounter
      : section === 'rules'
        ? this.components.zeroRulesSection
        : this.components.productionProofSection;
    await target.scrollIntoViewIfNeeded();
    await Cdat.waitForState(target, LocatorState.Visible);
  }

  async clickQuickstart(): Promise<void> {
    await Cdat.waitAndClick(this.components.quickstartCta);
  }

  async readTagline(): Promise<string> {
    return Cdat.waitForText(this.components.tagline);
  }
}
