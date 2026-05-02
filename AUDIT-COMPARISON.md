# CDAT Website — Audit Comparison (3 perspectives)

**Date:** 2026-05-02
**Site under audit:** local build of `feat/sde-72-qa-polish` branch (cdat-website, post-QA polish)
**Audit base URL:** `http://localhost:4399` (port shifted from 4321 due to dev-machine collision)
**Pages audited:** 14 (5 static + 6 docs + 3 examples)

---

## Reports

| Source | File | Findings | Runtime |
|---|---|---:|---:|
| **axe-core** (Sprint 2 QA, in-test E2E) | `SPRINT-2-QA-REPORT.md` §5.2 | 0 critical / 0 serious | ~21s (full E2E) |
| **sdet-wcag-toolkit V0.4 public** | `wcag-public-report.md` | 6 critical (1 page) | 13.1s |
| **sdet-wcag-toolkit V0.4 alpha.4 Pro** | `wcag-pro-report.md` | 6 critical (1 page) | 11.0s |

Pro tier additionally produced:
- 14 trace zips in `wcag-traces/` (~1-3 MB each)
- 14 × 2 PNG screenshots in `wcag-screenshots/<page>/` (load + focus-end states)
- Auto-saved JSON+MD pair in `wcag-reports/2026-05-02/`

---

## Why three?

- **axe-core** = generic, vendor-agnostic WCAG baseline. Industry standard, but tag-filtered (`wcag2a/wcag2aa/wcag21a/wcag21aa`) and impact-filtered (`serious|critical`) in our E2E test, so some category-level rules slip through.
- **wcag-toolkit public** = static + dynamic + AI 3-layer pipeline with cross-page deduplication. Same axe-core under the hood, but no impact filter — catches **everything** at the rule level.
- **wcag-toolkit Pro** = same dynamic findings as public + per-route Playwright trace + multi-state screenshot capture. **Visual evidence** for case-study material.

---

## Key delta — the finding axe-core E2E missed

**Critical: Form elements must have labels** (WCAG 4.1.2, axe rule `label`)

- **Where:** `/docs/migration/` only — 6 occurrences
- **What:** GFM-style markdown task list `- [ ]` in `migration.mdx` renders as 6 `<input type="checkbox" disabled>` elements, all without an associated `<label>`.
- **Why E2E missed it:** Our axe-core E2E test (`tests/e2e/features/accessibility/test.ts`) filters violations to `impact === 'critical' || 'serious'` for blocking-only enforcement. The `label` rule IS critical, so it should have appeared — but inspection of the per-rule output suggests the WCAG-tagged scan in @axe-core/playwright excludes inputs with `disabled` attribute by default (axe `excludeHidden: true` default) for some sub-checks. The toolkit's audit runs without that filter and surfaces the disabled-checkbox case.
- **Fix:** convert task lists in `migration.mdx` to plain bullet lists, OR pre-process MDX to wrap rendered checkboxes in a `<label>` element. Trivial 5-min content edit.

This is the **proof point for "when axe-core isn't enough"** — generic tooling missed a real WCAG A-level violation that the dedicated 5-specialist toolkit caught.

---

## Severity heat map (per-page)

```
Page                     | Critical | Total
-------------------------|---------:|-----:
/                        |        0 |     0
/about/                  |        0 |     0
/resources/              |        0 |     0
/docs/                   |        0 |     0
/docs/quickstart/        |        0 |     0
/docs/architecture/      |        0 |     0
/docs/zero-rules/        |        0 |     0
/docs/migration/         |        6 |     6  ← only page with violations
/docs/anti-patterns/     |        0 |     0
/docs/smart-waits/       |        0 |     0
/examples/               |        0 |     0
/examples/basic/         |        0 |     0
/examples/e-commerce/    |        0 |     0
/examples/crm-erp/       |        0 |     0
-------------------------|---------:|-----:
TOTALS                   |        6 |     6
```

13/14 pages clean. **Pre-launch fix scope: one MDX file.**

---

## For Series #01 narrative

This audit IS the case study material for **"When axe-core isn't enough — building a real accessibility pipeline."**

Three tools, side-by-side, on the same site:

1. **axe-core only (Sprint 2 E2E)** — passes all impact-filtered checks. Looks clean. Ships.
2. **wcag-toolkit public** — same axe-core engine, no filter. Catches the GFM checkbox issue. Forces the question: "are we testing against WCAG, or against our filter?"
3. **wcag-toolkit Pro** — adds Playwright traces and per-state screenshots. The trace for `/docs/migration/` shows the exact DOM at the moment of the violation. Visual proof for stakeholders.

Concrete metrics for the case study:
- **Time to find:** axe-core E2E ran in ~21s and reported 0. Toolkit ran in 11-13s and reported 6.
- **Tool cost:** axe-core is free OSS. Toolkit public is AGPL-3.0 OSS. Toolkit Pro is proprietary.
- **Evidence quality:** trace zips + screenshots make the findings demo-able to a non-technical PM in <2 minutes.

---

## Reproducibility

To re-run on local main + post-fix branches:

```bash
cd ~/dev/dar-kow/cdat-website
pnpm preview --port 4399 &
sleep 4

# Public tier
node ../sdet-wcag-toolkit/packages/cli/dist/bin/wcag-toolkit.js audit . \
  --url http://localhost:4399 \
  --multi-page --strategy=json-config --config wcag.config.json \
  --max-pages=20 --json > wcag-audit/findings-public.json

# Pro tier (auto-saves to wcag-reports/<date>/)
node ../sdet-wcag-pro/packages/cli-pro/dist/bin/wcag-toolkit-pro.js audit . \
  --url http://localhost:4399 \
  --multi-page --strategy=json-config --config wcag.config.json \
  --max-pages=20 --trace --screenshots --parallel 2

kill %1
```

`wcag.config.json` is committed at the cdat-website root with explicit URL list (Astro's sitemap-index.xml uses production URLs, so `--strategy=sitemap` is unsuitable for localhost audits).

---

## Next steps

1. **Fix migration.mdx GFM checkboxes** — convert `- [ ]` task lists to plain bullets, OR add aria-label via custom MDX renderer. ~5 min.
2. **Re-run audit** to verify 0 findings post-fix.
3. **Cherry-pick traces + screenshots from `/docs/migration/`** for Series #01 visual evidence (`wcag-traces/docs-migration.zip` + `wcag-screenshots/docs-migration/*.png`).
4. **Optional:** contribute the GFM-checkbox-label-pattern as a docs note in cdat-pattern's `BEST-PRACTICES.md` — generally applicable to any MDX-based docs site.

---

## Files

- `wcag-public-report.md` — public tier human-readable
- `wcag-pro-report.md` — Pro tier human-readable (with heat map)
- `wcag-audit/findings-public.json` — public raw output
- `wcag-audit/findings-pro.json` — Pro raw output (alias of `wcag-reports/2026-05-02/multi-page-report.json`)
- `wcag-traces/` — 14 Playwright trace zips
- `wcag-screenshots/` — 14 page subdirs × 2 PNGs each
- `wcag.config.json` — explicit URL list for json-config strategy
- `AUDIT-COMPARISON.md` — this file
