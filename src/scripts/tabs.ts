// WAI-ARIA tabs pattern — manual activation (focus does NOT auto-activate).
// Spec: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/

function getTabs(tablist: HTMLElement): HTMLButtonElement[] {
  return Array.from(tablist.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
}

function activateTab(tab: HTMLButtonElement, tablist: HTMLElement): void {
  const panelId = tab.getAttribute('aria-controls');
  if (!panelId) return;
  const panel = document.getElementById(panelId);
  if (!panel) return;

  const allTabs = getTabs(tablist);
  for (const t of allTabs) {
    const selected = t === tab;
    t.setAttribute('aria-selected', selected ? 'true' : 'false');
    t.setAttribute('tabindex', selected ? '0' : '-1');
    t.classList.toggle('cp-tab-active', selected);
    const sibPanelId = t.getAttribute('aria-controls');
    if (!sibPanelId) continue;
    const sibPanel = document.getElementById(sibPanelId);
    if (!sibPanel) continue;
    if (selected) sibPanel.removeAttribute('hidden');
    else sibPanel.setAttribute('hidden', '');
  }
}

function setupTablist(tablist: HTMLElement): void {
  const tabs = getTabs(tablist);
  if (tabs.length === 0) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      activateTab(tab, tablist);
      tab.focus();
    });
  });

  tablist.addEventListener('keydown', (event) => {
    const ke = event as KeyboardEvent;
    const current = document.activeElement;
    if (!(current instanceof HTMLButtonElement) || current.getAttribute('role') !== 'tab') return;
    if (!tabs.includes(current)) return;

    const i = tabs.indexOf(current);
    let next: HTMLButtonElement | null = null;

    if (ke.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
    else if (ke.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
    else if (ke.key === 'Home') next = tabs[0];
    else if (ke.key === 'End') next = tabs[tabs.length - 1];
    else if (ke.key === 'Enter' || ke.key === ' ') {
      ke.preventDefault();
      activateTab(current, tablist);
      return;
    } else return;

    if (next) {
      ke.preventDefault();
      next.focus();
    }
  });
}

export function initTabs(): void {
  const tablists = document.querySelectorAll<HTMLElement>('[role="tablist"]');
  tablists.forEach(setupTablist);
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTabs, { once: true });
  } else {
    initTabs();
  }
}
