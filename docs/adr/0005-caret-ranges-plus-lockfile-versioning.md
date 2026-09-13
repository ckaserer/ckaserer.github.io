# ADR-0005: Dependency versioning — caret ranges plus a committed lockfile

**Date:** 2026-09-13
**Status:** Accepted

## Context

`package.json` declares every dependency with a caret range (e.g.
`"astro": "^7.3.2"`, `"tailwindcss": "^4.3.3"`), not an exact pin. The
`engines.node` field is a floor (`>=22.12.0`), not an exact version, and both
GitHub Actions workflows pin only the Node **major** version (`'22'`).
`package-lock.json` is committed to the repo and is what CI's `npm ci`
actually installs from — it already fixes exact resolved versions for
reproducible installs, independent of the ranges in `package.json`.

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
<pkg>@latest`, which is a conscious, reviewable action that produces a
lockfile diff in a PR, not something that happens silently in the
background.

Deliberate major-version upgrades (e.g. the Astro 5→7 / Tailwind 3→4 move in
`cde9c9d`) still require checking real compatibility against the actual
target (Node 22 on GitHub Actions, GitHub Pages static hosting) before
bumping the range — not just trusting that `npm outdated` lists a newer
version, or that a green CI run proves runtime compatibility (it only proves
the build and Playwright-rendered pages still work in this repo's own test
surface, not that every consumer is fine).

## Options Considered

| Option | Pros | Cons |
|--------|------|------|
| Exact pins everywhere (`"astro": "7.3.2"`) | Maximum, most explicit reproducibility | The lockfile already gives byte-for-byte reproducible installs via `npm ci`; exact pins add nothing on top of that for this repo's install path, only extra manual bumping for every patch/security release |
| Caret ranges + committed lockfile (chosen) | `npm ci` is fully reproducible; a plain `npm install` (e.g. a first-time clone before running `npm ci`) still gets compatible patch/minor fixes; deliberate upgrades show up as an explicit, reviewable lockfile diff | Relies on discipline to always use `npm ci` in automation, never `npm install`, to avoid accidental drift |
| No committed lockfile | Simplest `package.json` | Non-reproducible installs — CI and local could resolve different versions on different days; never how this repo has operated |

## Consequences

- `npm ci` is the only install command used in `ci.yml` and `deploy.yml` —
  this must stay true; switching either workflow to `npm install` would
  reintroduce the exact drift this ADR avoids.
- A major-version dependency bump is still a deliberate PR: update the range,
  regenerate the lockfile, and verify against the real target environment
  (Node 22 / GitHub Pages) before merging — the cross-repo lesson "enumerate
  actually-available versions and check real compatibility before pinning"
  applies here just as much as to exact pins.
- Security/patch releases within an existing range can be picked up via a
  routine `npm update` + lockfile commit, without needing to touch
  `package.json` at all.

## Links

- `package.json`, `package-lock.json`
- `.github/workflows/ci.yml`, `.github/workflows/deploy.yml` — both use `npm ci`
- Workspace-level `CLAUDE.md` — "Before pinning any version..." cross-repo lesson
