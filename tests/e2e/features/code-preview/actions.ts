import type { Page } from '@playwright/test';
import { Cdat, LocatorState } from '../../_utils/Cdat';
import { CodePreviewComponents } from './components';
import { HOME_WITH_CODE_PREVIEW_PATH } from './data';

export class CodePreviewActions {
  readonly components: CodePreviewComponents;

  constructor(private readonly page: Page) {
    this.components = new CodePreviewComponents(page);
  }

  async visit(): Promise<void> {
    await this.page.goto(HOME_WITH_CODE_PREVIEW_PATH);
    await Cdat.waitForState(this.components.tablist, LocatorState.Visible);
    await this.components.tablist.scrollIntoViewIfNeeded();
  }

  async pressArrowRightOnTab(): Promise<void> {
    await this.components.activeTab.focus();
    await this.page.keyboard.press('ArrowRight');
  }

  async pressEndOnTab(): Promise<void> {
    await this.components.activeTab.focus();
    await this.page.keyboard.press('End');
  }

  async pressEnterOnFocusedTab(): Promise<void> {
    await this.page.keyboard.press('Enter');
  }
}
