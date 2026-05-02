# CDAT Website - Public Audit (sdet-wcag-toolkit V0.4)

**Date:** 2026-05-02
**Toolkit:** sdet-wcag-toolkit V0.4 (public, AGPL-3.0)
**Strategy:** json-config (14 explicit URLs)
**Base URL:** http://localhost:4399
**Total duration:** 13.1s

## Summary

| Metric | Value |
|---|---:|
| Pages audited | 14 |
| Pages skipped | 0 |
| Total findings | 6 |
| Unique findings (deduped) | 6 |

### Findings by severity

| Severity | Count |
|---|---:|
| critical | 6 |

## Findings (deduped, cross-page)

### 1. Form elements must have labels

- **Severity:** critical
- **WCAG:** 4.1.2 Name, Role, Value (Level A, robust)
- **Source:** dynamic (label)
- **Affected pages (1):** /docs/migration/
- **Selector:** `.task-list-item:nth-child(1) > input`
- **Snippet:** `<input type="checkbox" disabled="">`
- **Rationale:** Ensure every form element has a label
- **Help URL:** https://dequeuniversity.com/rules/axe/4.11/label?application=playwright

**Remediation:**

```
Element does not have an implicit (wrapped) <label>
  Element does not have an explicit <label>
  aria-label attribute does not exist or is empty
  aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty
  Element has no title attribute
  Element has no placeholder attribute
  Element's default semantics were not overridden with role="none" or role="presentation"
```

### 2. Form elements must have labels

- **Severity:** critical
- **WCAG:** 4.1.2 Name, Role, Value (Level A, robust)
- **Source:** dynamic (label)
- **Affected pages (1):** /docs/migration/
- **Selector:** `.task-list-item:nth-child(2) > input`
- **Snippet:** `<input type="checkbox" disabled="">`
- **Rationale:** Ensure every form element has a label
- **Help URL:** https://dequeuniversity.com/rules/axe/4.11/label?application=playwright

**Remediation:**

```
Element does not have an implicit (wrapped) <label>
  Element does not have an explicit <label>
  aria-label attribute does not exist or is empty
  aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty
  Element has no title attribute
  Element has no placeholder attribute
  Element's default semantics were not overridden with role="none" or role="presentation"
```

### 3. Form elements must have labels

- **Severity:** critical
- **WCAG:** 4.1.2 Name, Role, Value (Level A, robust)
- **Source:** dynamic (label)
- **Affected pages (1):** /docs/migration/
- **Selector:** `.task-list-item:nth-child(3) > input`
- **Snippet:** `<input type="checkbox" disabled="">`
- **Rationale:** Ensure every form element has a label
- **Help URL:** https://dequeuniversity.com/rules/axe/4.11/label?application=playwright

**Remediation:**

```
Element does not have an implicit (wrapped) <label>
  Element does not have an explicit <label>
  aria-label attribute does not exist or is empty
  aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty
  Element has no title attribute
  Element has no placeholder attribute
  Element's default semantics were not overridden with role="none" or role="presentation"
```

### 4. Form elements must have labels

- **Severity:** critical
- **WCAG:** 4.1.2 Name, Role, Value (Level A, robust)
- **Source:** dynamic (label)
- **Affected pages (1):** /docs/migration/
- **Selector:** `.task-list-item:nth-child(4) > input`
- **Snippet:** `<input type="checkbox" disabled="">`
- **Rationale:** Ensure every form element has a label
- **Help URL:** https://dequeuniversity.com/rules/axe/4.11/label?application=playwright

**Remediation:**

```
Element does not have an implicit (wrapped) <label>
  Element does not have an explicit <label>
  aria-label attribute does not exist or is empty
  aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty
  Element has no title attribute
  Element has no placeholder attribute
  Element's default semantics were not overridden with role="none" or role="presentation"
```

### 5. Form elements must have labels

- **Severity:** critical
- **WCAG:** 4.1.2 Name, Role, Value (Level A, robust)
- **Source:** dynamic (label)
- **Affected pages (1):** /docs/migration/
- **Selector:** `.task-list-item:nth-child(5) > input`
- **Snippet:** `<input type="checkbox" disabled="">`
- **Rationale:** Ensure every form element has a label
- **Help URL:** https://dequeuniversity.com/rules/axe/4.11/label?application=playwright

**Remediation:**

```
Element does not have an implicit (wrapped) <label>
  Element does not have an explicit <label>
  aria-label attribute does not exist or is empty
  aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty
  Element has no title attribute
  Element has no placeholder attribute
  Element's default semantics were not overridden with role="none" or role="presentation"
```

### 6. Form elements must have labels

- **Severity:** critical
- **WCAG:** 4.1.2 Name, Role, Value (Level A, robust)
- **Source:** dynamic (label)
- **Affected pages (1):** /docs/migration/
- **Selector:** `.task-list-item:nth-child(6) > input`
- **Snippet:** `<input type="checkbox" disabled="">`
- **Rationale:** Ensure every form element has a label
- **Help URL:** https://dequeuniversity.com/rules/axe/4.11/label?application=playwright

**Remediation:**

```
Element does not have an implicit (wrapped) <label>
  Element does not have an explicit <label>
  aria-label attribute does not exist or is empty
  aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty
  Element has no title attribute
  Element has no placeholder attribute
  Element's default semantics were not overridden with role="none" or role="presentation"
```

## Per-page durations

| URL | Findings | Duration |
|---|---:|---:|
| / | 0 | 1478ms |
| /about/ | 0 | 850ms |
| /resources/ | 0 | 816ms |
| /docs/ | 0 | 799ms |
| /docs/quickstart/ | 0 | 998ms |
| /docs/architecture/ | 0 | 996ms |
| /docs/zero-rules/ | 0 | 925ms |
| /docs/migration/ | 6 | 845ms |
| /docs/anti-patterns/ | 0 | 939ms |
| /docs/smart-waits/ | 0 | 974ms |
| /examples/ | 0 | 766ms |
| /examples/basic/ | 0 | 925ms |
| /examples/e-commerce/ | 0 | 883ms |
| /examples/crm-erp/ | 0 | 906ms |

---

*Generated from `wcag-audit/findings-public.json` via custom transformer (multi-page audit format not yet supported by built-in `wcag-toolkit report` subcommand).*