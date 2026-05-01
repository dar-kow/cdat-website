import type { Page } from '@playwright/test';
import { Cdat, LocatorState } from '../../_utils/Cdat';
import { AccessibilityComponents } from './components';

export class AccessibilityActions {
  readonly components: AccessibilityComponents;

  constructor(private readonly page: Page) {
    this.components = new AccessibilityComponents(page);
  }

  async visit(path: string): Promise<void> {
    await this.page.goto(path);
    await Cdat.waitForState(this.components.main, LocatorState.Visible);
  }
}
