import type { Page } from '@playwright/test';
import { Cdat, LocatorState } from '../../_utils/Cdat';
import { DocsQuickstartComponents } from './components';
import { QUICKSTART_PATH } from './data';

export class DocsQuickstartActions {
  readonly components: DocsQuickstartComponents;

  constructor(private readonly page: Page) {
    this.components = new DocsQuickstartComponents(page);
  }

  async visit(): Promise<void> {
    await this.page.goto(QUICKSTART_PATH);
    await Cdat.waitForState(this.components.heading, LocatorState.Visible);
  }

  async readActiveNavLabel(): Promise<string> {
    return Cdat.waitForText(this.components.activeNavLink);
  }

  async readGithubLinkHref(): Promise<string> {
    await Cdat.waitForState(this.components.githubFooterLink, LocatorState.Visible);
    return (await this.components.githubFooterLink.getAttribute('href')) ?? '';
  }
}
