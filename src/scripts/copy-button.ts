async function fallbackCopy(text: string): Promise<boolean> {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch {
    ok = false;
  }
  document.body.removeChild(ta);
  return ok;
}

async function copyText(text: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      /* fallthrough */
    }
  }
  return fallbackCopy(text);
}

function initButton(button: HTMLButtonElement): void {
  button.addEventListener('click', async () => {
    const sourceId = button.dataset.copySource;
    if (!sourceId) return;
    const source = document.getElementById(sourceId);
    if (!source) return;
    const raw = source.dataset.raw ?? source.textContent ?? '';
    const ok = await copyText(raw);
    const original = button.textContent ?? '📋 Copy';
    button.dataset.copied = ok ? 'true' : 'false';
    button.textContent = ok ? '✓ Copied!' : '⚠ Copy failed';
    setTimeout(() => {
      button.textContent = original;
      delete button.dataset.copied;
    }, 2000);
  });
}

export function initCopyButtons(): void {
  document.querySelectorAll<HTMLButtonElement>('[data-copy-source]').forEach(initButton);
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCopyButtons, { once: true });
  } else {
    initCopyButtons();
  }
}
