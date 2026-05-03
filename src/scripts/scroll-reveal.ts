// Scroll-reveal: adds .reveal-shown to elements with .reveal class
// when they enter the viewport. Once-only, IntersectionObserver-based.
// Honors prefers-reduced-motion (CSS skips the transform/opacity).

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function init(): void {
  const els = document.querySelectorAll<HTMLElement>('.reveal');
  if (els.length === 0) return;

  if (REDUCED || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('reveal-shown'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('reveal-shown');
        io.unobserve(entry.target);
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  els.forEach((el) => io.observe(el));
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
}
