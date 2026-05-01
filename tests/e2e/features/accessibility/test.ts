import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { AccessibilityActions } from './actions';
import { PAGES_TO_SCAN, AXE_TAGS } from './data';

test.describe('Accessibility (axe-core)', () => {
  for (const path of PAGES_TO_SCAN) {
    test(`Given ${path}, When axe scan runs, Then zero serious/critical violations`, async ({ page }) => {
      const actions = new AccessibilityActions(page);
      await actions.visit(path);

      const results = await new AxeBuilder({ page })
        .withTags([...AXE_TAGS])
        .analyze();

      const blocking = results.violations.filter(
        (v) => v.impact === 'serious' || v.impact === 'critical'
      );

      // Log full violation list for debug (visible in Playwright report)
      if (blocking.length > 0) {
        console.error(`a11y violations on ${path}:`, JSON.stringify(blocking, null, 2));
      }

      expect(blocking).toEqual([]);
    });
  }
});
