// Single source of truth for "how long has CDAT been in production".
//
// Anchor: CDAT real production start was May 2024 - first systems shipping
// the pattern were CRM, logistics, event management, and institutional apps.
// E-commerce rollout (the "18 months in production" milestone referenced at
// GitHub publication time) followed in August 2025.
//
// Re-computed at each Astro build, so every deploy refreshes the numbers.
// If you ever want to back-date or pin (e.g., "frozen at v1.0.0 launch"),
// set FROZEN_MONTHS below to a specific integer.

const PRODUCTION_START = new Date('2024-05-01T00:00:00Z');
const FROZEN_MONTHS: number | null = null;

function diffMonths(from: Date, to: Date): number {
  return (to.getUTCFullYear() - from.getUTCFullYear()) * 12 +
    (to.getUTCMonth() - from.getUTCMonth());
}

export const productionMonths: number =
  FROZEN_MONTHS ?? diffMonths(PRODUCTION_START, new Date());

export function formatTenure(months: number = productionMonths): string {
  if (months < 24) return `${months} months`;
  const years = Math.floor(months / 12);
  const remainder = months % 12;
  if (remainder === 0) return `${years} years`;
  return `${years}+ years`;
}

export const tenureLabel: string = formatTenure(productionMonths);
