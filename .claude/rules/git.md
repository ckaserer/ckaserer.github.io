# Git Hard Rules

These rules apply to every commit. Worktree mechanics live in the `worktree-isolation` skill; build/PR workflow lives in `worktree-workflow`.

## Branching

- One protected branch: `main` — always deployable; deploy triggers on push to `main`
- All work on short-lived branches, merged via PR only
- Merge every PR via GitHub's "Squash and merge" only — never a merge commit, never
  rebase-and-merge — so `main` stays one commit per PR
  ([ADR 2026-09-15: Trunk-based development with squash merge](../../docs/adr/2026-09-15-trunk-based-development-squash-merge.md))

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

## Standard Workflow

1. Create a worktree from `origin/main` (see `worktree-isolation` skill) —
   required both to keep `main` clean ([ADR 2026-09-15: Trunk-based development with squash merge](../../docs/adr/2026-09-15-trunk-based-development-squash-merge.md))
   and to isolate concurrent agent sessions from racing on the same `.git`
   index ([ADR 2026-09-13: Git worktrees for agent isolation](../../docs/adr/2026-09-13-git-worktrees-for-agent-isolation.md))
2. Verify `git branch --show-current` is not `main` before editing
3. Run `npm run build:full` before committing (build + OG image + CV PDF)
4. If `cv.json` changed, run the email guardrail (see `worktree-workflow`)
5. Commit, push, open PR via `gh pr create` (see `open-pull-request` skill)
6. Clean up worktree after merge
