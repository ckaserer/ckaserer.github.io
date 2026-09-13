# ADR-0006: Deploy via `actions/deploy-pages`, not a `gh-pages` branch

**Date:** 2026-09-13
**Status:** Accepted

## Context

The repo's git history shows this was not the first deployment approach
tried: early commits include "added CNAME file" and "remove github action
and use branch deployment", followed by a revert of that same change
("Revert 'remove github action and use branch deployment'"), before finally
settling on the current approach in commit `3f8320b`
("switch to actions/deploy-pages, drop gh-pages branch pattern"). Without a
written record, that history is invisible to anyone (human or agent) reading
the current workflows — the current setup looks like an arbitrary choice
rather than the survivor of an already-tried-and-rejected alternative.

## Decision

**Deploy exclusively via GitHub's first-party Pages deployment mechanism**:
`actions/upload-pages-artifact` uploads `dist/` as a build artifact, and
`actions/deploy-pages` publishes it to the `github-pages` environment. This
runs on every push to `main` (`.github/workflows/deploy.yml`). No
`gh-pages` branch exists, and none should be reintroduced. The custom domain
(`ckaserer.dev`) is configured via `public/CNAME`, which ships as part of the
`dist/` artifact.

## Options Considered

| Option | Pros | Cons |
|--------|------|------|
| `gh-pages` branch + a build action (e.g. a third-party gh-pages action) | Was the repo's actual earlier approach; conceptually simple ("a branch holds the built site") | Requires broader permissions (pushing to a branch) than necessary; the branch's history is synthetic build output mixed into the repo's branch list; was tried in this repo and reverted once already |
| `actions/deploy-pages` (chosen) | First-party GitHub mechanism purpose-built for this; narrow permissions (`pages: write`, `id-token: write`, no `contents: write` needed for deploy); deploy shows up as a proper GitHub "environment" deployment with its own status/URL, separate from any branch | Slightly more workflow YAML (artifact upload + separate deploy job) than a single action call |
| Deploy from a different host (Cloudflare Pages, Netlify, Vercel) | Some offer faster builds or edge features | Moves the site off GitHub Pages entirely — a much bigger change than a deploy-mechanism swap, not something this decision needs to force; GitHub Pages already serves the custom domain fine |

## Consequences

- There is intentionally no `gh-pages` branch. Anyone tempted to
  reintroduce one to "simplify" deployment should read this ADR first: it
  was already tried in this repo and reverted.
- `public/CNAME` remains the single place the custom domain is declared —
  it must survive in `dist/` on every build for the domain to keep working.
- Deploy status is visible via the `github-pages` GitHub Environment, which
  is where to look first when diagnosing a failed deploy (see also the
  `pipeline-debug` skill).

## Links

- `.github/workflows/deploy.yml`
- `public/CNAME`
- `.claude/skills/pipeline-debug/SKILL.md`
