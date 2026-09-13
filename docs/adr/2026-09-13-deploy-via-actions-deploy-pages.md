# Deploy via `actions/deploy-pages`, not a `gh-pages` branch

- Status: Accepted
- Date: 2026-09-13
- Deciders: repo owner + Claude Code

## Context

The repo's git history shows this was not the first deployment approach
tried: early commits include "added CNAME file" and "remove github action
and use branch deployment", followed by a revert of that same change
("Revert 'remove github action and use branch deployment'"), before finally
settling on the current approach in commit `3f8320b` ("switch to
actions/deploy-pages, drop gh-pages branch pattern"). Without a written
record, that history is invisible to anyone (human or agent) reading the
current workflows — the current setup looks like an arbitrary choice rather
than the survivor of an already-tried-and-rejected alternative.

## Decision

**Deploy exclusively via GitHub's first-party Pages deployment mechanism**:
`actions/upload-pages-artifact` uploads `dist/` as a build artifact, and
`actions/deploy-pages` publishes it to the `github-pages` environment. This
runs on every push to `main` (`.github/workflows/deploy.yml`). No
`gh-pages` branch exists, and none should be reintroduced. The custom domain
(`ckaserer.dev`) is configured via `public/CNAME`, which ships as part of
the `dist/` artifact.

## Alternatives Considered

- **`gh-pages` branch + a build action** (e.g. a third-party gh-pages
  action) — was this repo's actual earlier approach, but requires broader
  permissions than necessary, mixes synthetic build output into the repo's
  branch list, and was already tried here and reverted once.
- **Deploy from a different host** (Cloudflare Pages, Netlify, Vercel) —
  some offer faster builds or edge features, but moving off GitHub Pages
  entirely is a much bigger change than a deploy-mechanism swap, and GitHub
  Pages already serves the custom domain fine.

## Consequences

### Positive

- Narrow permissions (`pages: write`, `id-token: write`, no `contents:
  write` needed for deploy), and the deploy shows up as a proper GitHub
  "environment" deployment with its own status/URL, separate from any
  branch.
- Deploy status is visible via the `github-pages` GitHub Environment, which
  is where to look first when diagnosing a failed deploy (see also the
  `pipeline-debug` skill).

### Negative

- There is intentionally no `gh-pages` branch. Anyone tempted to
  reintroduce one to "simplify" deployment needs to read this ADR first —
  it was already tried in this repo and reverted.
- `public/CNAME` remains the single place the custom domain is declared; it
  must survive in `dist/` on every build or the domain silently stops
  working.

## References

- `.github/workflows/deploy.yml`
- `public/CNAME`
- `.claude/skills/pipeline-debug/SKILL.md`
