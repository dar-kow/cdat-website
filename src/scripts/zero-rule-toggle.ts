type RuleId = 'any' | 'waitForTimeout' | 'else';
type State = 'bad' | 'good';

const STORAGE_KEY_PREFIX = 'cdat-zero-rule-';

function isRuleId(value: string | undefined): value is RuleId {
  return value === 'any' || value === 'waitForTimeout' || value === 'else';
}

function isState(value: string | null): value is State {
  return value === 'bad' || value === 'good';
}

function readStored(rule: RuleId): State | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY_PREFIX + rule);
    return isState(v) ? v : null;
  } catch {
    return null;
  }
}

function writeStored(rule: RuleId, state: State): void {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + rule, state);
  } catch {
    /* private mode — silently ignore */
  }
}

function applyState(card: HTMLElement, state: State): void {
  card.dataset.state = state;
  const toggle = card.querySelector<HTMLButtonElement>('.zr-toggle');
  if (toggle) {
    toggle.setAttribute('aria-checked', state === 'good' ? 'true' : 'false');
  }
  const bad = card.querySelector<HTMLElement>('.zr-code-bad');
  const good = card.querySelector<HTMLElement>('.zr-code-good');
  if (bad) bad.dataset.shown = state === 'bad' ? 'true' : 'false';
  if (good) good.dataset.shown = state === 'good' ? 'true' : 'false';
}

function nextState(current: State): State {
  return current === 'bad' ? 'good' : 'bad';
}

export function initZeroRuleToggles(): void {
  const cards = document.querySelectorAll<HTMLElement>('.zero-rule-card');
  cards.forEach((card) => {
    const rule = card.dataset.rule;
    if (!isRuleId(rule)) return;

    const stored = readStored(rule);
    if (stored !== null) applyState(card, stored);

    const toggle = card.querySelector<HTMLButtonElement>('.zr-toggle');
    if (!toggle) return;

    const handle = (event: Event): void => {
      if (event.type === 'keydown') {
        const ke = event as KeyboardEvent;
        if (ke.key !== 'Enter' && ke.key !== ' ') return;
        ke.preventDefault();
      }
      const current = isState(card.dataset.state ?? null) ? (card.dataset.state as State) : 'bad';
      const next = nextState(current);
      applyState(card, next);
      writeStored(rule, next);
    };

    toggle.addEventListener('click', handle);
    toggle.addEventListener('keydown', handle);
  });
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initZeroRuleToggles, { once: true });
  } else {
    initZeroRuleToggles();
  }
}
