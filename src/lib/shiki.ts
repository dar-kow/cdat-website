import { codeToHtml } from 'shiki';

const THEME = 'tokyo-night';

export async function highlight(code: string, lang: string): Promise<string> {
  return codeToHtml(code, {
    lang,
    theme: THEME,
    transformers: [
      {
        pre(node) {
          node.properties.tabindex = '0';
          const cls = (node.properties.class as string | undefined) ?? '';
          node.properties.class = `${cls} shiki-pre`.trim();
        },
      },
    ],
  });
}
