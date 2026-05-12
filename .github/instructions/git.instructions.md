---
description: 'Git hard rules — trunk-based development, branch naming, Conventional Commits. Operational workflow lives in the worktree-workflow skill.'
applyTo: '**'
owner: '@ckaserer'
lastReviewed: 2026-05-12
---

# Git Hard Rules

These rules apply to every commit. The operational workflow (creating worktrees, rebasing, opening PRs) lives in the `worktree-workflow` skill.

## Branching

- One long-lived protected branch: `main` — always deployable; deploy triggers automatically on push to `main`
- All work on short-lived branches (< 1 day target), merged to `main` via PR only

| Prefix | Format | Purpose |
|--------|--------|---------|
| `feat/*` | `feat/{description}` | New pages, sections, or features |
| `fix/*` | `fix/{description}` | Fix broken links, typos, config errors |
| `docs/*` | `docs/{description}` | Content-only updates |
| `refactor/*` | `refactor/{description}` | Restructuring with no content change |
| `ci/*` | `ci/{description}` | GitHub Actions / deploy changes |
| `chore/*` | `chore/{description}` | Dependency updates, maintenance |

Include a short kebab-case description, e.g. `feat/add-adr-section` or `fix/broken-sidebar-link`.
If a GitHub issue exists, prefix with the issue number: `feat/42-add-adr-section`.

## Forbidden Actions

| Action | Why forbidden |
|--------|---------------|
| Push or commit to `main` directly | PRs only — keeps site always deployable |
| `git push --force` (without `--lease`) | Use `--force-with-lease` instead |
| Committing secrets, tokens, or API keys | Permanent leak |
| Declaring done with a failing `npm run build` | Broken builds block everyone |

## Conventional Commits

Format: `<type>(<scope>): <description>` — see [conventionalcommits.org](https://www.conventionalcommits.org/en/v1.0.0/).

Scope is optional but recommended: use the section name (`work-codex`, `personal-os`, `skyledger`, `ci`, `config`).

| Type | Use |
|------|-----|
| `feat` | New page, section, or Docusaurus plugin |
| `fix` | Fix broken link, typo, build error |
| `docs` | Content-only update |
| `refactor` | Restructuring without content change |
| `ci` | GitHub Actions changes |
| `chore` | Dependency updates, maintenance |

Examples:
- `feat(work-codex): add ADR section with first three records`
- `fix(personal-os): correct broken cross-reference link`
- `chore: upgrade docusaurus to 3.10.0`

## Copilot Workflow — Mandatory Per Task

1. **Create a worktree** from `origin/main` (see `worktree-workflow` skill).
2. **Verify location** before editing: `git branch --show-current` must not be `main`.
3. **Run `npm run build`** before committing — catches broken links and TypeScript errors early.
4. **Commit, push, open PR** as the final step. Use `gh pr create` (see `open-pull-request` skill).
5. **Clean up** the worktree after the PR merges (see `worktree-workflow` skill).
