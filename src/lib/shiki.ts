import { codeToHtml } from 'shiki';

// `github-dark-default` chosen 2026-05-02 after axe-core flagged tokyo-night
// comment color (#51597d on #1a1b26 = 2.5:1) as WCAG AA contrast failure.
// github-dark-default keeps all token colors above 4.5:1 on its own background.
const THEME = 'github-dark-default';

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
