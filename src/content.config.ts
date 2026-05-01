import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const docs = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(200),
    order: z.number().default(99),
    lang: z.enum(['en', 'pl']).default('en'),
    updated: z.coerce.date().optional(),
  }),
});

const examples = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/examples' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(200),
    complexity: z.enum(['basic', 'advanced', 'meta']),
    codeLink: z.string().url(),
  }),
});

export const collections = { docs, examples };
