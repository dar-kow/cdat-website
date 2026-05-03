# CDAT Website — Post-WCAG-Audit Fixes

> **Mission**: WCAG dogfood audit (2026-05-02) found 6 critical WCAG 4.1.2
> violations in `/docs/migration`. Fix them, re-audit clean, document
> before/after for Series #05 case study material. Plus minor cleanups
> from audit-script adaptations.
>
> **Context**: Sprint 2 QA pass GREEN. wcag-toolkit V0.4 audit caught what
> axe-core missed. Branch: `feat/sde-72-qa-polish` (commit `fdd9ffd`).
> Total estimate: 30-45 min.
> **Mode**: focused, sequential, single session.

---

## 🛡️ IMMUTABLE CONSTRAINTS

### `cdat-pattern/` is HOLY GROUND

`github.com/dar-kow/cdat-pattern` HEAD `7dad025`. **DO NOT TOUCH.**

After every phase, verify untouched:

```bash
cd ~/dev/dar-kow/cdat-pattern
git rev-parse HEAD  # Must equal 7dad025
git status          # Must be clean (only pre-existing untracked package-lock.json OK)
```

### Stay on `feat/sde-72-qa-polish` branch

This polish branch already has 3 commits. We're adding 1-2 more on top.
Do NOT create new branches. Do NOT push. Do NOT merge to main.

### Anti-leakage

Zero firmowych keywords across all output. Forbidden list:
`Crehler / FFCSS / ForgeFront / CoffeeDesk / MojeBambino / StrefaTenisa / Profibiznes`

Verify after every commit:
```bash
grep -ri "crehler\|ffcss\|forgefront\|coffeedesk\|mojebambino\|strefatenisa\|profibiznes" \
  src/ tests/ public/ docs/ 2>/dev/null | grep -v node_modules | wc -l
# Expected: 0
```

### Stop conditions

Pause if:
1. cdat-pattern HEAD changes (any value other than `7dad025`)
2. Re-audit after fix shows ANY new violations not present before
3. E2E test count drops below 92 (currently 92/92 passing)
4. Any forbidden keyword leaks into commits
5. Build fails

---

## 📋 PHASE 1 — Read context (5 min)

Before touching anything, read:

```bash
cd ~/dev/dar-kow/cdat-website
git checkout feat/sde-72-qa-polish
git log --oneline -10
```

Expected: `fdd9ffd docs(wcag-audit)`, `9278532 docs(qa-report)`, `2ec7a77 fix(qa)` plus parent history.

Read the WCAG reports:

```bash
cat wcag-public-report.md | head -100
cat wcag-pro-report.md | grep -A 2 "critical\|migration" | head -50
cat AUDIT-COMPARISON.md | head -80
```

Identify exactly:
- WCAG rule violated (4.1.2 Name, Role, Value)
- File location: `src/content/docs/migration.mdx`
- Number of violations: 6
- Specific lines (grep `migration.mdx` for `^- \[ \]` or `^- \[x\]`)

Confirm understanding before proceeding. Document in scratch notes:
- Exact violation count and locations
- Current state of migration.mdx task lists

---

## 📝 PHASE 2 — Fix `migration.mdx` (10 min)

### Strategy: convert GFM task lists to numbered sequential steps

**Why this approach**:
- Migration steps ARE inherently sequential (step 1 enables step 2)
- Numbered list is semantically correct (HTML `<ol>`)
- Zero accessibility issues (no input elements)
- Reads naturally as a guide
- No custom MDX components needed (less maintenance)

**Why NOT alternatives**:
- Custom MDX checkbox component: more code, more maintenance, marginal UX gain
- Unicode `☐` characters: works but visually mimics interactivity that doesn't exist (deceptive)
- Plain bullets: loses sequential nature visible in original task list

### Steps

```bash
cd ~/dev/dar-kow/cdat-website
code src/content/docs/migration.mdx  # or your preferred editor
```

Find every GFM task list block and convert:

**Before**:
```markdown
- [ ] Audit existing test files
- [ ] Identify feature boundaries
- [ ] Move locators to components.ts
```

**After**:
```markdown
1. **Audit existing test files** — list all `.spec.ts` files and identify Page Objects in use
2. **Identify feature boundaries** — group tests by user-facing functionality
3. **Move locators to components.ts** — extract `page.locator()` calls into dedicated locator file
```

### Style guide for the edits

- Use `**bold**` on the action verb at start (preserves "step" feel)
- Add em-dash explanation that expands on the action (1 short sentence)
- Use backtick code refs for file names and method calls
- Keep line length reasonable (~100 chars)
- Match the surrounding voice (factual, direct, no "you should...")

### Verify post-edit

```bash
# Verify no remaining GFM task lists
grep -n "^- \[" src/content/docs/migration.mdx
# Expected: empty output (zero matches)

# Verify migration.mdx still parses
pnpm astro check 2>&1 | tail -5
# Expected: 0 errors

# Build smoke
pnpm build 2>&1 | tail -10
# Expected: build succeeds, all pages render
```

### Commit

```bash
git add src/content/docs/migration.mdx
git commit -m "fix(a11y): convert GFM task lists to numbered steps in migration docs

GFM task-lists in MDX render as <input type=checkbox disabled> without
label/aria-label, violating WCAG 4.1.2 (Name, Role, Value, Level A).

Caught by sdet-wcag-toolkit V0.4 forms-accessibility specialist (axe-core
default wcag2aa filter missed this — case study material for Series #05).

Migration steps are inherently sequential; numbered list is semantically
correct (<ol>) and zero a11y issues. Each step gets bold action verb +
em-dash explanation for readability."
```

---

## 🔄 PHASE 3 — Re-audit (10 min)

### Setup

```bash
cd ~/dev/dar-kow/cdat-website
pnpm preview --port 4399 &
PREVIEW_PID=$!
trap "kill $PREVIEW_PID 2>/dev/null" EXIT
sleep 5
curl -fsSL http://localhost:4399 > /dev/null && echo "✅ preview up" || { echo "❌ preview failed"; exit 1; }
```

### Run wcag-toolkit V0.4 public audit

Use the same json-config strategy that worked in original audit:

```bash
node ~/dev/dar-kow/sdet-wcag-toolkit/packages/cli/dist/bin/wcag-toolkit.js audit . \
  --multi-page \
  --strategy=json-config \
  --config wcag.config.json \
  --json \
  > /tmp/wcag-rerun-public.json 2>&1
```

Parse results:

```bash
node -e "
const r = JSON.parse(require('fs').readFileSync('/tmp/wcag-rerun-public.json'));
const critical = r.findings?.filter(f => f.severity === 'critical' || f.impact === 'critical') ?? [];
const serious = r.findings?.filter(f => f.severity === 'serious' || f.impact === 'serious') ?? [];
console.log('Critical:', critical.length);
console.log('Serious:', serious.length);
if (critical.length > 0) {
  console.log('REGRESSION — critical findings remain:');
  critical.forEach(c => console.log('  -', c.rule || c.ruleId, c.url || c.page));
}
" 2>&1 | tee /tmp/wcag-rerun-summary.txt
```

**Expected**: `Critical: 0`, `Serious: 0`.

**STOP CONDITION**: If critical > 0, do NOT continue. Document the remaining
violation in scratch notes, ask Dariusz before proceeding (it likely means the
fix in PHASE 2 was incomplete or introduced new issue).

### Run wcag-toolkit V0.4 alpha.4 Pro audit (optional but recommended)

```bash
cd ~/dev/dar-kow/sdet-wcag-pro
node packages/cli-pro/dist/bin/wcag-toolkit-pro.js audit ~/dev/dar-kow/cdat-website \
  --multi-page \
  --strategy=json-config \
  --config ~/dev/dar-kow/cdat-website/wcag.config.json \
  --output ~/dev/dar-kow/cdat-website/wcag-rerun-pro.md
```

Pro tier auto-saves to `wcag-reports/<date>/` if no `--output` specified.
Verify the new traces+screenshots show clean pages.

### Cleanup

```bash
kill $PREVIEW_PID
trap - EXIT
```

---

## 📊 PHASE 4 — Update `AUDIT-COMPARISON.md` (5 min)

Add a new section to `AUDIT-COMPARISON.md` documenting before/after.
This is **Series #05 case study material** — write it like a story arc,
not a changelog.

### Content to append

```markdown

---

## Update: 2026-05-02 — Fixed in 5 minutes

After running these audits, the fix took less time than the audit setup.

**Before fix** (`fdd9ffd`):
- axe-core (Sprint 2 E2E): 0 critical
- wcag-toolkit V0.4 public: **6 critical** (WCAG 4.1.2)
- wcag-toolkit V0.4 alpha.4 Pro: **6 critical** + traces + screenshots

**Root cause**: GitHub Flavored Markdown task lists in `migration.mdx`
rendered as `<input type="checkbox" disabled>` without label/aria-label
attributes. WCAG 4.1.2 (Name, Role, Value) requires accessible names on
all interactive elements.

**Why axe-core missed it**: default `wcag2aa` ruleset skips
`aria-input-field-name` rule for disabled inputs. Disabled inputs are
often considered "non-interactive" by generic scanners. wcag-toolkit's
forms-accessibility specialist runs the rule unconditionally.

**Fix** (commit `<TBD>`):
- Converted GFM task lists to numbered sequential steps (`<ol>`)
- Migration steps are inherently sequential — numbered list is
  semantically correct and zero a11y issues
- Each step: bold action verb + em-dash explanation

**After fix** (re-audit `<TBD>`):
- axe-core: 0 critical (unchanged — still passes)
- wcag-toolkit V0.4 public: **0 critical**
- wcag-toolkit V0.4 alpha.4 Pro: **0 critical**
- Time from finding to fix: 5 minutes
- Lines changed: ~30 markdown (no component code)

## Lesson

Generic accessibility tools establish a baseline.
Specialist tools surface real issues that survive the baseline.
"WCAG-compliant" needs a definition: compliant under WHICH ruleset?

This isn't a critique of axe-core. axe-core ran exactly the rules it was
configured to run. The lesson is that "all green axe" is not equivalent
to "WCAG-compliant" — it's "compliant with the subset of WCAG that axe
checks under its default configuration".

Specialists fill the gap.
```

Replace `<TBD>` placeholders with actual commit SHAs after PHASE 5.

---

## 📦 PHASE 5 — Commit + verification (5 min)

### Commit AUDIT-COMPARISON update

```bash
git add AUDIT-COMPARISON.md
git commit -m "docs(audit): add before/after section to comparison report

Documents the 5-minute fix turnaround after wcag-toolkit found 6 critical
WCAG 4.1.2 violations in migration.mdx that axe-core's default wcag2aa
filter passed.

Material for Series #05 case study (CDAT pattern + WCAG dogfood, planned
June 2026)."
```

Now go back and replace `<TBD>` in AUDIT-COMPARISON.md with the actual SHAs
(this commit's SHA + PHASE 2 commit SHA), then amend:

```bash
# Get SHAs
PHASE2_SHA=$(git log --grep="convert GFM task lists" --format="%h" -n 1)
PHASE5_SHA=$(git log --grep="add before/after section" --format="%h" -n 1)
echo "PHASE 2 commit: $PHASE2_SHA"
echo "PHASE 5 commit: $PHASE5_SHA"

# Replace in AUDIT-COMPARISON.md
sed -i.bak "s/<TBD>/$PHASE5_SHA/g; s/commit \`$PHASE5_SHA\`/commit \`$PHASE2_SHA\`/" AUDIT-COMPARISON.md
# (manual review — sed for both <TBD> isn't ideal; check resulting markdown)
rm AUDIT-COMPARISON.md.bak

git add AUDIT-COMPARISON.md
git commit --amend --no-edit
```

### Final E2E verification

```bash
pnpm test:e2e 2>&1 | tail -20
# Expected: still 92/92 passing (the fix shouldn't affect any test)
```

If any test fails: investigate. The migration.mdx fix shouldn't impact
test surface, but verify.

### Final cdat-pattern verification

```bash
cd ~/dev/dar-kow/cdat-pattern
git rev-parse HEAD
# Expected: 7dad025
git status
# Expected: clean (or only pre-existing untracked package-lock.json)
```

### Branch state recap

```bash
cd ~/dev/dar-kow/cdat-website
git log --oneline feat/sde-72-qa-polish | head -10
```

Expected commit chain (newest first):
- `<sha>` docs(audit): add before/after section to comparison report
- `<sha>` fix(a11y): convert GFM task lists to numbered steps in migration docs
- `fdd9ffd` docs(wcag-audit): three audit perspectives + reports
- `9278532` docs: add Sprint 2 QA + Polish pass report
- `2ec7a77` fix(qa): 4 issues caught during Sprint 2 QA pass
- (then Sprint 1 + Sprint 2 features below)

---

## 🧹 OPTIONAL PHASE 6 — Update `post-qa-wcag-audit.sh` script (5 min)

The original script in `~/dev/dar-kow/sdet-brand-drafts/post-qa-wcag-audit.sh`
needs adaptation based on what actually worked. These are real lessons
worth capturing for future audits:

### Adaptations to apply

1. **Port 4321 → 4399** in script (avoid collision with concurrent dev servers)
2. **Replace `pnpm wcag-toolkit` invocations** with direct binary path:
   `node ~/dev/dar-kow/sdet-wcag-toolkit/packages/cli/dist/bin/wcag-toolkit.js`
3. **Add note about `--output` not supported on audit** in public CLI:
   audit must use `--json` + custom transformer
4. **Sitemap strategy doesn't work for Astro dev preview** (emits prod URLs):
   default to `--strategy=json-config --config wcag.config.json` instead

### Edit script

```bash
cd ~/dev/dar-kow/sdet-brand-drafts
git pull
# Apply adaptations above to post-qa-wcag-audit.sh
git add post-qa-wcag-audit.sh
git commit -m "fix(audit-script): apply adaptations learned from CDAT website run

Real-world adaptations from running the script against cdat-website on
2026-05-02:

- Port 4321 → 4399 (avoid collision with concurrent Astro dev servers)
- Public CLI binary path: bin not on root, use direct node invocation
- Public CLI audit lacks --output; use --json + transformer
- Sitemap strategy doesn't work with Astro preview (emits prod URLs);
  json-config with wcag.config.json works reliably

Future ecosystem audits start from corrected baseline."
git push  # NOTE: this is sdet-brand-drafts, NOT cdat-website — push is OK here
```

**IMPORTANT**: this commit goes to `sdet-brand-drafts/` repo (private),
NOT to cdat-website. The push is fine because it's a private brand drafts repo.

If you skip PHASE 6, no harm — script can be updated later. It's a
"good hygiene" task, not blocking.

---

## 📝 PHASE 7 — Final report (5 min)

Write summary to `~/dev/dar-kow/cdat-website/POST-WCAG-AUDIT-FIXES.md`:

```markdown
# Post-WCAG Audit Fixes — 2026-05-02

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
| wcag-toolkit V0.4 public | 6 critical | 0 critical |
| wcag-toolkit V0.4 alpha.4 Pro | 6 critical | 0 critical |

E2E tests: 92/92 still passing.
cdat-pattern integrity: HEAD `7dad025` untouched.

## Branch state

`feat/sde-72-qa-polish` now has 5 commits:
- `<sha>` docs(audit): add before/after section
- `<sha>` fix(a11y): convert GFM task lists to numbered steps
- `fdd9ffd` docs(wcag-audit): three audit perspectives + reports
- `9278532` docs: add Sprint 2 QA + Polish pass report
- `2ec7a77` fix(qa): 4 issues caught during Sprint 2 QA pass

Awaiting Dariusz review + push + merge to main.

## Series #05 (CDAT, June 2026) — material captured

The before/after section in AUDIT-COMPARISON.md becomes Series #05 Part 1
opening hook material. Direct quote-ready text:

> "Two days before launch, I audited my own pattern site. axe-core said
> GREEN. wcag-toolkit said 6 critical violations. That's how I learned
> that even after 4 episodes about WCAG tooling, you still need to
> dogfood your dogfood."

## Time spent

- Phase 1 (read context): X min
- Phase 2 (fix migration.mdx): X min
- Phase 3 (re-audit): X min
- Phase 4 (update AUDIT-COMPARISON.md): X min
- Phase 5 (commit + verification): X min
- (Phase 6 optional): X min
- Phase 7 (this report): X min

Total: X min.
```

Commit:

```bash
git add POST-WCAG-AUDIT-FIXES.md
git commit -m "docs: add post-WCAG-audit fixes summary report"
```

---

## 🚀 BEGIN

Start at PHASE 1. Work sequentially. Document blockers as you encounter them.

Total estimate: 30-45 min for PHASES 1-5 + 7. PHASE 6 optional adds 5 min.

**Go.**
