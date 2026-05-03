#!/bin/bash
# CDAT Website — wcag-toolkit V0.4 audit
# Run ONLY after CC's Sprint 2 QA pass is complete
# Total runtime: ~10-15 min
# Output: 2 reports (public + Pro tier) — material for Series #01 case study

set -e

CDAT_WEBSITE=~/dev/dar-kow/cdat-website
TOOLKIT_PUBLIC=~/dev/dar-kow/sdet-wcag-toolkit
TOOLKIT_PRO=~/dev/dar-kow/sdet-wcag-pro

# Verify project locations
[ -d "$CDAT_WEBSITE" ] || { echo "❌ cdat-website not found at $CDAT_WEBSITE"; exit 1; }
[ -d "$TOOLKIT_PUBLIC" ] || { echo "❌ sdet-wcag-toolkit not found"; exit 1; }
[ -d "$TOOLKIT_PRO" ] || { echo "❌ sdet-wcag-pro not found (Pro tier audit will be skipped)"; }

# Step 1: Build cdat-website (if not already built)
echo "=== Step 1: Build cdat-website ==="
cd "$CDAT_WEBSITE"
if [ ! -d dist ]; then
  pnpm install
  pnpm build
fi

# Step 2: Start preview server
echo ""
echo "=== Step 2: Start preview server ==="
pnpm preview &
PREVIEW_PID=$!
trap "kill $PREVIEW_PID 2>/dev/null" EXIT
sleep 5
curl -fsSL http://localhost:4321 > /dev/null && echo "✅ preview server up" || { echo "❌ preview failed"; exit 1; }

# Step 3: Public V0.4 multi-page audit (sitemap strategy)
echo ""
echo "=== Step 3: wcag-toolkit V0.4 PUBLIC tier audit ==="
cd "$TOOLKIT_PUBLIC"
pnpm wcag-toolkit audit "$CDAT_WEBSITE" \
  --url http://localhost:4321 \
  --multi-page \
  --strategy=sitemap \
  --max-pages=20 \
  --output "$CDAT_WEBSITE/wcag-public-report.md" \
  2>&1 | tee "$CDAT_WEBSITE/wcag-public-audit.log"

echo "✅ Public report: $CDAT_WEBSITE/wcag-public-report.md"

# Step 4: Pro V0.4 alpha.4 audit (trace + screenshots)
if [ -d "$TOOLKIT_PRO" ]; then
  echo ""
  echo "=== Step 4: wcag-toolkit V0.4 alpha.4 PRO tier audit ==="
  cd "$TOOLKIT_PRO"
  pnpm wcag-toolkit-pro audit "$CDAT_WEBSITE" \
    --url http://localhost:4321 \
    --multi-page \
    --strategy=sitemap \
    --max-pages=20 \
    --trace \
    --screenshots \
    --output "$CDAT_WEBSITE/wcag-pro-report.md" \
    2>&1 | tee "$CDAT_WEBSITE/wcag-pro-audit.log"

  echo "✅ Pro report: $CDAT_WEBSITE/wcag-pro-report.md"
  echo "✅ Traces: $CDAT_WEBSITE/wcag-traces/"
  echo "✅ Screenshots: $CDAT_WEBSITE/wcag-screenshots/"
fi

# Step 5: Stop preview server
kill $PREVIEW_PID 2>/dev/null

# Step 6: Generate side-by-side comparison summary
echo ""
echo "=== Step 6: Comparison summary ==="
cat > "$CDAT_WEBSITE/AUDIT-COMPARISON.md" << 'EOF'
# CDAT Website — Audit Comparison

## Reports

| Source | File | Findings |
|--------|------|----------|
| axe-core (Sprint 2 QA) | (in SPRINT-2-QA-REPORT.md) | basic |
| sdet-wcag-toolkit V0.4 public | wcag-public-report.md | + 5 specialists (semantic, ARIA, keyboard, contrast, forms) |
| sdet-wcag-toolkit V0.4 alpha.4 Pro | wcag-pro-report.md | + traces + screenshots + parallel + per-route |

## Why three?

- **axe-core** = generic, vendor-agnostic baseline. Industry standard.
- **wcag-toolkit public** = static + dynamic + AI 3-layer pipeline z dedup. Pre-audit specialty.
- **wcag-toolkit Pro** = traces + screenshots = visual evidence dla case study.

## For Series #01 narrative

This audit IS the case study material. Three tools, side-by-side, on the same site,
showing **why generic tools miss what specialists catch**.

> "When axe-core isn't enough — building a real accessibility pipeline."

## Next steps

1. Compare findings across 3 reports
2. Cherry-pick most interesting deltas dla Series #01 Part 1
3. Use traces from Pro tier as visual proof in case study
4. Optional: contribute back any new findings to cdat-pattern docs
EOF

echo "✅ Comparison: $CDAT_WEBSITE/AUDIT-COMPARISON.md"
echo ""
echo "🎉 Done! Three audit perspectives generated."
echo ""
echo "Files:"
echo "  - $CDAT_WEBSITE/wcag-public-report.md"
[ -d "$TOOLKIT_PRO" ] && echo "  - $CDAT_WEBSITE/wcag-pro-report.md"
echo "  - $CDAT_WEBSITE/AUDIT-COMPARISON.md"
echo ""
echo "Tip: open all three side-by-side in your editor for the dogfood comparison."
