import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const docs = (await getCollection('docs')).sort((a, b) => a.data.order - b.data.order);
  const examples = await getCollection('examples');

  const content = `# CDAT Pattern

> Modern 4-layer test architecture for Playwright + TypeScript. Production-proven alternative to Page Object Model.

## Documentation

${docs.map((d) => `- [${d.data.title}](https://cdat.sdet.it/docs/${d.id}): ${d.data.description}`).join('\n')}

## Examples

${examples.map((e) => `- [${e.data.title}](https://cdat.sdet.it/examples/${e.id}): ${e.data.description}`).join('\n')}

## Pattern Repository

- [Source code](https://github.com/dar-kow/cdat-pattern): MIT-licensed reference implementation with examples and @cdat/utils package

## Author

Dariusz Kowalski - AI-Powered Test Automation Architect
- Portfolio: https://portfolio.sdet.it
- LinkedIn: https://www.linkedin.com/in/darius-kowalski
- Services: https://sdet.it
`;

  return new Response(content, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
