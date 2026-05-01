export const PAGES_TO_SCAN = [
  '/',
  '/about',
  '/docs',
  '/docs/quickstart',
  '/docs/architecture',
  '/examples',
  '/examples/basic',
  '/resources',
] as const;

// WCAG 2.1 AA tags — safe baseline for new sites.
export const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] as const;
