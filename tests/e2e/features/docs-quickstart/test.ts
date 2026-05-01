import { test, expect } from '@playwright/test';
import { DocsQuickstartActions } from './actions';
import { ACTIVE_NAV_LABEL, MIN_CODE_BLOCKS, GITHUB_RAW_PATTERN } from './data';

test.describe('Docs > Quickstart', () => {
  test('Given visitor opens /docs/quickstart, When page loads, Then heading and sidebar render', async ({ page }) => {
    const actions = new DocsQuickstartActions(page);
    await actions.visit();
    await expect(actions.components.heading).toBeVisible();
    await expect(actions.components.sidebar).toBeVisible();
  });

  test('Given visitor on quickstart page, When sidebar renders, Then Quickstart entry is active', async ({ page }) => {
    const actions = new DocsQuickstartActions(page);
    await actions.visit();
    const label = (await actions.readActiveNavLabel()).trim();
    expect(label).toBe(ACTIVE_NAV_LABEL);
  });

  test('Given quickstart docs, When page renders, Then multiple Shiki code blocks are present', async ({ page }) => {
    const actions = new DocsQuickstartActions(page);
    await actions.visit();
    const count = await actions.components.codeBlocks.count();
    expect(count).toBeGreaterThanOrEqual(MIN_CODE_BLOCKS);
  });

  test('Given quickstart docs, When footer renders, Then GitHub link points to cdat-pattern repo', async ({ page }) => {
    const actions = new DocsQuickstartActions(page);
    await actions.visit();
    const href = await actions.readGithubLinkHref();
    expect(href).toMatch(GITHUB_RAW_PATTERN);
  });
});
