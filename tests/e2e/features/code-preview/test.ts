import { test, expect } from '@playwright/test';
import { CodePreviewActions } from './actions';
import { EXPECTED_TAB_COUNT, TAB_LABELS } from './data';

test.describe('Code Preview Tabs (WAI-ARIA)', () => {
  test('Given home page, When tablist renders, Then 4 tabs are present with correct labels', async ({ page }) => {
    const actions = new CodePreviewActions(page);
    await actions.visit();

    const count = await actions.components.tabs.count();
    expect(count).toBe(EXPECTED_TAB_COUNT);

    for (const label of TAB_LABELS) {
      await expect(actions.components.tabs.filter({ hasText: label }).first()).toBeVisible();
    }
  });

  test('Given tab focus, When ArrowRight pressed, Then focus moves to next tab (manual activation)', async ({ page }) => {
    const actions = new CodePreviewActions(page);
    await actions.visit();

    const initialActive = await actions.components.activeTab.getAttribute('data-tab-id');
    await actions.pressArrowRightOnTab();

    // Focus should have moved, but selection should NOT auto-activate
    const stillActive = await actions.components.activeTab.getAttribute('data-tab-id');
    expect(stillActive).toBe(initialActive);

    // Now press Enter to activate
    await actions.pressEnterOnFocusedTab();
    const newActive = await actions.components.activeTab.getAttribute('data-tab-id');
    expect(newActive).not.toBe(initialActive);
  });

  test('Given tab focus, When End pressed, Then focus moves to last tab', async ({ page }) => {
    const actions = new CodePreviewActions(page);
    await actions.visit();
    await actions.pressEndOnTab();
    await actions.pressEnterOnFocusedTab();
    const active = await actions.components.activeTab.getAttribute('data-tab-id');
    expect(active).toBe('test');
  });
});
