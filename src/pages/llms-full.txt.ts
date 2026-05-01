import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

function stripFrontmatter(body: string): string {
  return body.replace(/^---[\s\S]*?---\n/, '');
}

export const GET: APIRoute = async () => {
  const docs = (await getCollection('docs')).sort((a, b) => a.data.order - b.data.order);
  const examples = await getCollection('examples');

  const sections: string[] = [
    `# CDAT Pattern — Full Content`,
    ``,
    `> Modern 4-layer test architecture for Playwright + TypeScript. Production-proven alternative to Page Object Model.`,
    ``,
    `Pattern source: https://github.com/dar-kow/cdat-pattern`,
    `Author: Dariusz Kowalski — https://portfolio.sdet.it`,
    ``,
    `---`,
    ``,
    `# Documentation`,
    ``,
  ];

  for (const doc of docs) {
    sections.push(`## ${doc.data.title}`);
    sections.push('');
    sections.push(`> ${doc.data.description}`);
    sections.push(`> URL: https://cdat.sdet.it/docs/${doc.id}`);
    sections.push('');
    sections.push(stripFrontmatter(doc.body ?? ''));
    sections.push('');
    sections.push('---');
    sections.push('');
  }

  sections.push(`# Examples`);
  sections.push('');

  for (const ex of examples) {
    sections.push(`## ${ex.data.title} (${ex.data.complexity})`);
    sections.push('');
    sections.push(`> ${ex.data.description}`);
    sections.push(`> URL: https://cdat.sdet.it/examples/${ex.id}`);
    sections.push(`> Source: ${ex.data.codeLink}`);
    sections.push('');
    sections.push(stripFrontmatter(ex.body ?? ''));
    sections.push('');
    sections.push('---');
    sections.push('');
  }

  return new Response(sections.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
