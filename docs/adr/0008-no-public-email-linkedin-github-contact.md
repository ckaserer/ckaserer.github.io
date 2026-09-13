# 0008. No public email — LinkedIn and GitHub only for contact

- Status: Accepted
- Date: 2026-09-13
- Deciders: repo owner + Claude Code

## Context

`Contact.astro` and `Seo.astro` deliberately contain no email address or
`mailto:` link anywhere — not on the homepage, not in the generated CV PDF,
not in the JSON-LD `Person` schema. This is enforced mechanically: both
`ci.yml` and `deploy.yml` grep the built `dist/*.html` and `dist/*.pdf`
files for the email string and fail the build if it's found, and
`.claude/rules/git.md` lists reintroducing an email as a **Forbidden
Action**. Despite being enforced in three places, the reasoning was never
written down — a future contributor (or agent) could reasonably ask "why
not just put an email on a CV site" without knowing this was a deliberate,
load-bearing decision rather than an oversight.

This is a public, indexed site (it ships a sitemap and is crawlable) — any
plaintext email on it is a certainty to be scraped, not a possibility.

## Decision

**No email address appears anywhere in the site, the generated PDF, or any
structured data.** Contact is LinkedIn first, GitHub second — both surfaced
via `Contact.astro` and the Person JSON-LD's `sameAs`/`contactPoint` fields.
This is enforced by CI as a hard guardrail (grep on built artifacts on every
PR and every deploy), not left as a style guideline that could silently
regress.

## Alternatives Considered

- **Public email on the CV/site** (the conventional default) — fastest,
  most direct point of contact, but on a crawlable, sitemapped public site
  it's guaranteed to be scraped and attract spam, and it just duplicates a
  channel LinkedIn/GitHub already cover.
- **A contact form with a backend relay** — no scrapable address in the
  page source, but needs a backend or third-party form service; a static
  personal site shouldn't need a server component or a third-party privacy
  surface just to relay messages.

## Consequences

### Positive

- The CI email-guardrail is the real enforcement mechanism, not convention
  — a PR (human- or agent-authored) that reintroduces an email fails the
  build automatically.
- Zero scrapable address anywhere, and both remaining channels (LinkedIn,
  GitHub) have their own spam/identity layers.

### Negative

- Filters out anyone who wants email specifically, and requires the visitor
  to have or create an account on one of the two remaining platforms.
- Known gap: the guardrail's PDF half greps the raw PDF bytes for the email
  string, but Playwright-generated PDFs typically Flate-compress their
  content streams, so a raw-byte grep is likely a no-op against the PDF
  specifically even if an email were present in it. The HTML half of the
  check is the part actually doing enforcement today; making the PDF check
  real needs actual text extraction (e.g. `pdftotext`), not a raw grep —
  tracked as a known gap, not a live leak (there is currently no email
  anywhere in source to leak).

## References

- `src/components/Contact.astro`, `src/components/Seo.astro`
- `.github/workflows/ci.yml`, `.github/workflows/deploy.yml` — the
  email-leak guardrail step
- `.claude/rules/git.md` — "Reintroducing an email / mailto:" forbidden
  action
