# 0001. Keep the photo in the CV, accept the ATS parsing trade-off

- Status: Accepted
- Date: 2026-09-12
- Deciders: repo owner + Claude Code

## Context

`src/pages/cv.astro` is the single source of both the browser `/cv` view and
the Playwright-generated `clemens-kaserer-cv.pdf`. It was built around a
documented ATS-compatibility research pass (see
`.github/skills/update-cv/SKILL.md`, "ATS Compliance") citing Jobscan,
TopResume, PDFMiner, and ResumeGenius sources. That research is correct and
still applies — it does not change with this ADR.

Two of the documented "Forbidden" rules are nonetheless present in the
shipped page:

1. **`<img>` (photo)** in the CV header. Some ATS parsers (per TopResume)
   either drop the photo, render it as `$&%#*`-style garbage in the
   extracted text, or in rare cases reject the file outright.
2. **Contact info inside an HTML `<header>` element.** TopResume's study
   found ~25% parse loss for contact fields placed in `<header>`/`<footer>`
   landmarks specifically, as some parsers skip those regions expecting site
   chrome, not content.

This is a personal, human-facing CV as much as a machine-facing one — most
distribution today is a direct download link or LinkedIn/GitHub, not blind
ATS upload, and the photo/header layout is deliberate design work
(`cv.astro` mirrors the visual identity of the homepage). The two risks are
not equal weight: the photo is a known, bounded, cosmetic-at-worst risk; the
`<header>` tag is a free fix with zero visual cost.

## Decision

**Keep the photo.** It stays in the CV header on both the `/cv` browser view
and the generated PDF. This is a conscious trade-off, not an oversight —
accept some ATS parse risk in exchange for a stronger, consistent
personal-brand presentation across the homepage and CV.

**Fix the `<header>` element**, since it costs nothing. The contact row and
photo are now wrapped in a plain `<div class="cv-header">` instead of
`<header class="cv-header">` — same styling, same layout, but it removes one
of the two documented risk factors for free.

## Alternatives Considered

- **Remove the photo entirely** — fully ATS-compliant per all four cited
  sources, but the CV loses the personal-brand consistency it shares with
  the homepage and becomes visually generic.
- **Keep the photo only in the browser `/cv` view, strip it from the
  generated PDF** — would give an ATS-safe PDF while keeping the photo
  visible to human visitors online, but breaks the "single source of truth"
  principle that `cv.astro` is identical for both outputs, adding a second
  code path to maintain.

## Consequences

### Positive

- The `<header>` → `<div>` fix removes one of the two ATS risk factors with
  no downside, partially offsetting the accepted photo risk.
- If ATS rejection ever becomes a real, observed problem, the fallback path
  (a no-photo PDF variant, the second rejected alternative above) is already
  known rather than something to figure out under pressure.

### Negative

- The CV may render slightly worse (or, rarely, get rejected) in some
  automated ATS pipelines. This is accepted, not accidental.
- Future edits to `cv.astro` should not "fix" the photo by removing it
  without opening a new ADR that supersedes this one — that constraint has
  to be remembered, not enforced mechanically.

## References

- `.github/skills/update-cv/SKILL.md` — ATS Compliance section (source
  research)
- Jobscan (1M+ resume scans), TopResume (1,000-resume study), PDFMiner
  docs, ResumeGenius vendor matrix — cited in the skill doc above
