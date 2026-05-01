export const PERSON_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Dariusz Kowalski',
  jobTitle: 'AI-Powered Test Automation Architect',
  url: 'https://portfolio.sdet.it',
  sameAs: [
    'https://github.com/dar-kow',
    'https://www.linkedin.com/in/darius-kowalski',
  ],
} as const;

export const WEBSITE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'CDAT Pattern',
  url: 'https://cdat.sdet.it',
  description: 'Modern 4-layer test architecture for Playwright + TypeScript',
  author: PERSON_SCHEMA,
} as const;

export const SOFTWARE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareSourceCode',
  name: 'CDAT Pattern',
  codeRepository: 'https://github.com/dar-kow/cdat-pattern',
  programmingLanguage: 'TypeScript',
  license: 'https://opensource.org/licenses/MIT',
  author: PERSON_SCHEMA,
} as const;

export interface ArticleSchemaInput {
  title: string;
  description: string;
  url: string;
  datePublished?: string;
}

export function articleSchema(input: ArticleSchemaInput): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.title,
    description: input.description,
    url: input.url,
    datePublished: input.datePublished ?? '2026-05-01',
    author: PERSON_SCHEMA,
  };
}
