import { test, expect } from '@playwright/test';
import { FunnelActions } from './actions';
import {
  EXPECTED_PORTFOLIO_HOST,
  EXPECTED_SERVICES_HOST,
  REQUIRED_UTM_PARAMS,
} from './data';

test.describe('Funnel CTAs + UTM', () => {
  test('Given footer renders, When About CTA inspected, Then UTM params are present', async ({ page }) => {
    const actions = new FunnelActions(page);
    await actions.visitHome();

    const href = await actions.readFooterAboutHref();
    expect(href).toContain(EXPECTED_PORTFOLIO_HOST);
    for (const param of REQUIRED_UTM_PARAMS) {
      expect(href).toContain(param);
    }
  });

  test('Given /about page, When primary CTA inspected, Then UTM points to portfolio', async ({ page }) => {
    const actions = new FunnelActions(page);
    await actions.visitAbout();

    const href = await actions.readAboutPortfolioHref();
    expect(href).toContain(EXPECTED_PORTFOLIO_HOST);
    expect(href).toContain('utm_source=cdat');
    expect(href).toContain('utm_medium=about');
  });

  test('Given /about page, When secondary CTA inspected, Then UTM points to services', async ({ page }) => {
    const actions = new FunnelActions(page);
    await actions.visitAbout();

    const href = await actions.readAboutServicesHref();
    expect(href).toContain(EXPECTED_SERVICES_HOST);
    expect(href).toContain('utm_source=cdat');
    expect(href).toContain('utm_campaign=funnel_services');
  });
});
