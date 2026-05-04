export const HOME_PATH = '/';

export const EXPECTED_TAGLINE_FRAGMENT = 'Test architecture for Playwright';
// Tenure ("N months in production") grows monthly via build-time recompute,
// so assert on the format — not a fixed value — to avoid release-day flakes.
export const EXPECTED_STAT_TARGETS: ReadonlyArray<string | RegExp> = [
  '9 production',
  /\d+ months in production/,
  '0 hardcoded',
];
export const EXPECTED_QUICKSTART_URL = /\/docs\/quickstart\/?$/;
export const EXPECTED_GITHUB_URL = /github\.com\/dar-kow\/cdat-pattern/;

export const ZERO_RULES_COUNT = 3;
