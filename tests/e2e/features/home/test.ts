import { test, expect } from '@playwright/test';
import { HomeActions } from './actions';
import {
  EXPECTED_TAGLINE_FRAGMENT,
  EXPECTED_STAT_TARGETS,
  EXPECTED_QUICKSTART_URL,
  ZERO_RULES_COUNT,
} from './data';

test.describe('Home page', () => {
  test('Given visitor lands on /, When page loads, Then hero is visible with diagram', async ({ page }) => {
    const actions = new HomeActions(page);
    await actions.visit();

    await expect(actions.components.hero).toBeVisible();
    await expect(actions.components.cdatDiagram).toBeVisible();

    const tagline = await actions.readTagline();
    expect(tagline).toContain(EXPECTED_TAGLINE_FRAGMENT);
  });

  test('Given visitor scrolls to stats, When in viewport, Then counter shows target numbers', async ({ page }) => {
    const actions = new HomeActions(page);
    await actions.visit();
    await actions.scrollToSection('stats');

    const statsText = await actions.components.statsCounter.textContent();
    for (const target of EXPECTED_STAT_TARGETS) {
      expect(statsText).toContain(target);
    }
  });

  test('Given visitor clicks Quickstart CTA, When navigation, Then quickstart docs page loads', async ({ page }) => {
    const actions = new HomeActions(page);
    await actions.visit();
    await actions.clickQuickstart();
    await expect(page).toHaveURL(EXPECTED_QUICKSTART_URL);
  });

  test('Given visitor scrolls to Zero Rules section, When in viewport, Then 3 cards rendered', async ({ page }) => {
    const actions = new HomeActions(page);
    await actions.visit();
    await actions.scrollToSection('rules');

    const cards = actions.components.zeroRulesSection.locator('.zero-rule-card');
    await expect(cards).toHaveCount(ZERO_RULES_COUNT);
  });

  test('Given prefers-reduced-motion is set, When page loads, Then diagram animations are frozen', async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    const actions = new HomeActions(page);
    await actions.visit();

    const animationName = await actions.components.cdatDiagram
      .locator('.box rect')
      .first()
      .evaluate((el) => getComputedStyle(el).animationName);

    expect(animationName === 'none' || animationName === '').toBe(true);
    await ctx.close();
  });
});
