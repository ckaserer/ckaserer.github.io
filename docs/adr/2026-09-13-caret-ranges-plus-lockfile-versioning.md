# 0005. Dependency versioning — caret ranges plus a committed lockfile

- Status: Accepted
- Date: 2026-09-13
- Deciders: repo owner + Claude Code

## Context

`package.json` declares every dependency with a caret range (e.g.
`"astro": "^7.3.2"`, `"tailwindcss": "^4.3.3"`), not an exact pin. The
`engines.node` field is a floor (`>=22.12.0`), not an exact version, and both
GitHub Actions workflows pin only the Node **major** version (`'22'`).
`package-lock.json` is committed and is what CI's `npm ci` actually installs
from — it already fixes exact resolved versions for reproducible installs,
independent of the ranges in `package.json`.

This is a personal site with no dedicated on-call and infrequent manual
maintenance windows; the versioning strategy needs to balance getting
security/bug-fix updates without silently drifting onto a breaking major
version.

## Decision

**Keep caret ranges in `package.json`, rely on the committed
`package-lock.json` for reproducibility.** A fresh `npm ci` (used by both
`ci.yml` and `deploy.yml`) always installs the exact versions recorded in
the lockfile — nothing floats at install time in CI or deploy. Caret ranges
only matter when someone deliberately runs `npm update` or `npm install
<pkg>@latest`, which produces a reviewable lockfile diff in a PR, not
something that happens silently in the background. Deliberate major-version
upgrades still require checking real compatibility against the actual
target (Node 22 on GitHub Actions, GitHub Pages static hosting) before
bumping the range — not just trusting `npm outdated` or a green CI run,
which only proves this repo's own build and Playwright-rendered pages still
work, not that every consumer is fine.

## Alternatives Considered

- **Exact pins everywhere** (`"astro": "7.3.2"`) — maximum explicitness, but
  the committed lockfile already gives byte-for-byte reproducible installs
  via `npm ci`; exact pins add nothing on top of that here, only extra
  manual bumping for every patch/security release.
- **No committed lockfile** — simplest `package.json`, but non-reproducible
  installs (CI and local could resolve different versions on different
  days) — never how this repo has operated.

## Consequences

### Positive

- `npm ci` is fully reproducible, and a plain `npm install` (e.g. a
  first-time clone before running `npm ci`) still gets compatible
  patch/minor fixes.
- A deliberate upgrade shows up as an explicit, reviewable lockfile diff in
  a PR rather than silent drift.

### Negative

- Relies on discipline to always use `npm ci` in automation, never `npm
  install`, to avoid accidental drift — `ci.yml` and `deploy.yml` switching
  to `npm install` would reintroduce exactly the drift this ADR avoids.
- A major-version dependency bump is still a deliberate PR that has to
  verify against the real target environment (Node 22 / GitHub Pages), not
  just trust the range — the cross-repo lesson "enumerate actually-available
  versions and check real compatibility before pinning" applies here just
  as much as to exact pins.

## References

- `package.json`, `package-lock.json`
- `.github/workflows/ci.yml`, `.github/workflows/deploy.yml` — both use
  `npm ci`
- Workspace-level `CLAUDE.md` — "Before pinning any version..." cross-repo
  lesson
