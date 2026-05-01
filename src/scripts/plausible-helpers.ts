type PlausibleProps = Record<string, string>;
type PlausibleFn = (event: string, opts?: { props?: PlausibleProps }) => void;
type WindowWithPlausible = Window & { plausible?: PlausibleFn };

export function trackEvent(name: string, props?: PlausibleProps): void {
  if (typeof window === 'undefined') return;
  const fn = (window as WindowWithPlausible).plausible;
  if (typeof fn !== 'function') return;
  fn(name, props ? { props } : undefined);
}
