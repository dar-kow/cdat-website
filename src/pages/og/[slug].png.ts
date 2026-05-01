import type { APIRoute } from 'astro';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { getCollection } from 'astro:content';

const FONTS_DIR = join(process.cwd(), 'public', 'fonts');

async function loadFont(filename: string): Promise<Buffer> {
  return readFile(join(FONTS_DIR, filename));
}

interface PageMeta {
  slug: string;
  title: string;
  subtitle: string;
}

async function collectPages(): Promise<PageMeta[]> {
  const docs = await getCollection('docs');
  const examples = await getCollection('examples');

  const pages: PageMeta[] = [
    { slug: 'home',      title: 'CDAT Pattern', subtitle: 'Test architecture for Playwright · 9 systems · 18 months' },
    { slug: 'about',     title: 'About',         subtitle: 'Who built CDAT Pattern?' },
    { slug: 'docs',      title: 'Documentation', subtitle: 'Six pages from quickstart to anti-patterns' },
    { slug: 'examples',  title: 'Examples',      subtitle: 'Basic · Advanced · Enterprise' },
    { slug: 'resources', title: 'Resources',     subtitle: 'VS Code snippets · template · README badge' },
  ];

  for (const doc of docs) {
    pages.push({
      slug: `docs-${doc.id}`,
      title: doc.data.title,
      subtitle: doc.data.description,
    });
  }
  for (const ex of examples) {
    pages.push({
      slug: `examples-${ex.id}`,
      title: ex.data.title,
      subtitle: ex.data.description,
    });
  }
  return pages;
}

export async function getStaticPaths() {
  const pages = await collectPages();
  return pages.map((p) => ({ params: { slug: p.slug }, props: { meta: p } }));
}

export const GET: APIRoute = async ({ props }) => {
  const meta = props.meta as PageMeta;
  const monoBold = await loadFont('JetBrainsMono-Bold.ttf');
  const interReg = await loadFont('Inter-Regular.ttf');

  const subtitle = meta.subtitle.length > 110 ? meta.subtitle.slice(0, 107) + '...' : meta.subtitle;

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          width: '1200px',
          height: '630px',
          backgroundColor: '#0a0e0d',
          padding: '64px',
          color: '#00ff41',
          fontFamily: 'JetBrains Mono',
          position: 'relative',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                fontSize: '24px',
                color: '#4a8a4a',
                fontFamily: 'Inter',
                marginBottom: '24px',
                display: 'flex',
              },
              children: '> cdat.sdet.it',
            },
          },
          {
            type: 'div',
            props: {
              style: {
                fontSize: '88px',
                fontFamily: 'JetBrains Mono',
                fontWeight: 700,
                lineHeight: 1.05,
                marginBottom: '24px',
                display: 'flex',
              },
              children: meta.title,
            },
          },
          {
            type: 'div',
            props: {
              style: {
                fontSize: '32px',
                color: '#ffb000',
                fontFamily: 'Inter',
                lineHeight: 1.35,
                maxWidth: '1080px',
                display: 'flex',
              },
              children: subtitle,
            },
          },
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                bottom: '64px',
                left: '64px',
                right: '64px',
                fontSize: '22px',
                color: '#6b7280',
                fontFamily: 'Inter',
                display: 'flex',
                justifyContent: 'space-between',
              },
              children: [
                { type: 'span', props: { children: '4 layers · 3 zero-rules' } },
                { type: 'span', props: { children: 'MIT licensed · github.com/dar-kow/cdat-pattern' } },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'JetBrains Mono', data: monoBold, weight: 700, style: 'normal' },
        { name: 'Inter', data: interReg, weight: 400, style: 'normal' },
      ],
    }
  );

  const png = new Resvg(svg).render().asPng();
  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
