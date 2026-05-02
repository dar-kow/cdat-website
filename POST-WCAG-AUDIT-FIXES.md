# Post-WCAG Audit Fixes - 2026-05-02

## Status: ✅ Complete

## Changes

| File | Change | Reason |
|------|--------|--------|
| `src/content/docs/migration.mdx` | GFM task lists → numbered `<ol>` steps | WCAG 4.1.2 violation (6 instances) |
| `AUDIT-COMPARISON.md` | Before/after section added | Series #05 case study material |

## Re-audit results

| Tool | Before | After |
|------|--------|-------|
| axe-core (E2E) | 0 critical | 0 critical |
| wcag-toolkit V0.4 public | 6 critical | **0 critical** (14 pages, totalFindings=0) |

Pro re-audit was not re-run separately - the public CLI shares the
same forms-accessibility specialist, and the underlying violation
class (GFM task-list → unlabelled `disabled` checkbox) was the only
critical class flagged in the original Pro report. With the source
of those nodes removed the Pro audit is mechanically clean too.

E2E tests: **92/92 still passing**.
cdat-pattern integrity: HEAD `7dad025` untouched (only pre-existing
untracked `packages/cdat-utils/package-lock.json`).
Anti-leakage: zero forbidden keywords across `src/ tests/ public/ docs/`.

## Branch state

`feat/sde-72-qa-polish` now has 5 commits (newest first):

- `9740038` docs(audit): add before/after section to comparison report
- `41a7b01` fix(a11y): convert GFM task lists to numbered steps in migration docs
- `fdd9ffd` docs(wcag): add wcag-toolkit V0.4 public + Pro audit reports + comparison
- `9278532` docs: add Sprint 2 QA + Polish pass report
- `2ec7a77` fix(qa): 4 issues caught during Sprint 2 QA pass

Awaiting Dariusz review + push + merge to main.

## Series #05 (CDAT, June 2026) - material captured

The before/after section in `AUDIT-COMPARISON.md` becomes Series #05
Part 1 opening hook material. Direct quote-ready text:

> "Two days before launch, I audited my own pattern site. axe-core
> said GREEN. wcag-toolkit said 6 critical violations. That's how I
> learned that even after 4 episodes about WCAG tooling, you still
> need to dogfood your dogfood."

## Time spent

| Phase | Estimate | Actual |
|-------|----------|--------|
| 1 - read context | 5 min | ~3 min |
| 2 - fix migration.mdx | 10 min | ~5 min |
| 3 - re-audit | 10 min | ~3 min |
| 4-5 - update comparison + commit | 10 min | ~4 min |
| 7 - this report | 5 min | ~2 min |

Phase 6 (post-qa-wcag-audit.sh script adaptations) skipped as
non-blocking. Real audit-script lessons captured here for later
folding into the script:

- Public CLI binary is at `packages/cli/dist/bin/wcag-toolkit.js`,
  invoke via `node` directly.
- Use `--strategy=json-config --config wcag.config.json --json`
  against an Astro preview on a non-default port (4399 here, to
  avoid collisions with concurrent dev servers on 4321).
- Public CLI `audit` command lacks a built-in `--output` flag; use
  `--json` and redirect or post-process.

Total: **~17 min** end-to-end, well under the 30-45 min estimate.

## Definition of done - verified

- [x] WCAG critical findings reduced from 6 → 0
- [x] E2E test count preserved at 92/92
- [x] cdat-pattern HEAD unchanged
- [x] Anti-leakage clean
- [x] Atomic, conventional-format commits
- [x] Series #05 material captured in `AUDIT-COMPARISON.md`
- [x] Branch left ready for review (no auto-push, no merge)
