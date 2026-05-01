// Minimal local copy of the Cdat smart-wait utility, attribution to:
// https://github.com/dar-kow/cdat-pattern/tree/main/packages/cdat-utils (MIT)
//
// This site eats its own dog food — the meta-tests use CDAT to test CDAT.

import { expect, type Locator, type Page } from '@playwright/test';

export enum LocatorState {
  Visible = 'visible',
  Hidden = 'hidden',
  Attached = 'attached',
  Detached = 'detached',
}

export class Cdat {
  static readonly SHORT_TIMEOUT = 2_000;
  static readonly DEFAULT_TIMEOUT = 10_000;
  static readonly LONG_TIMEOUT = 30_000;

  static async waitAndClick(locator: Locator, timeout = Cdat.DEFAULT_TIMEOUT): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
    await expect(locator).toBeEnabled({ timeout });
    await locator.click({ timeout });
  }

  static async waitAndFill(locator: Locator, value: string, timeout = Cdat.DEFAULT_TIMEOUT): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
    await locator.fill(value, { timeout });
    await expect(locator).toHaveValue(value, { timeout });
  }

  static async waitForState(locator: Locator, state: LocatorState, timeout = Cdat.DEFAULT_TIMEOUT): Promise<void> {
    await locator.waitFor({ state, timeout });
  }

  static async waitForText(locator: Locator, timeout = Cdat.DEFAULT_TIMEOUT): Promise<string> {
    await locator.waitFor({ state: 'visible', timeout });
    return (await locator.textContent({ timeout })) ?? '';
  }

  static async checkState(locator: Locator, state: LocatorState, timeout = Cdat.SHORT_TIMEOUT): Promise<boolean> {
    try {
      await locator.waitFor({ state, timeout });
      return true;
    } catch {
      return false;
    }
  }
}
