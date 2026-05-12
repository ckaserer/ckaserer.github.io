---
description: 'Git hard rules — trunk-based development, branch naming, Conventional Commits. Operational workflow lives in the worktree-workflow skill.'
applyTo: '**'
owner: '@ckaserer'
lastReviewed: 2026-05-12
---

# Git Hard Rules

These rules apply to every commit. Operational workflow lives in the `worktree-workflow` skill.

## Branching

- One protected branch: `main` — always deployable; deploy triggers on push to `main`
- All work on short-lived branches, merged via PR only

| Prefix | Format | Purpose |
|--------|--------|---------|
| `feat/*` | `feat/{description}` | New features or sections |
| `fix/*` | `fix/{description}` | Fix build errors, broken styles |
| `docs/*` | `docs/{description}` | CV content updates |
| `refactor/*` | `refactor/{description}` | Restructuring, no content change |
| `ci/*` | `ci/{description}` | GitHub Actions changes |
| `chore/*` | `chore/{description}` | Dependency updates, maintenance |

## Forbidden Actions

| Action | Why |
|--------|-----|
| Push directly to `main` | PRs only |
| `git push --force` without `--lease` | Use `--force-with-lease` |
| Committing secrets or tokens | Permanent leak |
| Reintroducing an `email` / `mailto:` anywhere in the site or PDF | Privacy decision; CI fails the build if found |
| Opening a PR with a failing `npm run build:full` | Broken builds block the deploy |

## Conventional Commits

Format: `<type>(<scope>): <description>`

Scope is optional; use `cv`, `hero`, `ci`, `config`, etc.

| Type | Use |
|------|-----|
| `feat` | New component or page section |
| `fix` | Build error, styling bug |
| `docs` | CV content update |
| `refactor` | Component restructuring |
| `ci` | GitHub Actions changes |
| `chore` | Dependencies, maintenance |

## Copilot Workflow

1. Create a worktree from `origin/main` (see `worktree-workflow` skill)
2. Verify `git branch --show-current` is not `main` before editing
3. Run `npm run build:full` before committing (build + OG image + CV PDF)
4. If `cv.json` changed, run the email guardrail (see `worktree-workflow`)
5. Commit, push, open PR via `gh pr create` (see `open-pull-request` skill)
6. Clean up worktree after merge
