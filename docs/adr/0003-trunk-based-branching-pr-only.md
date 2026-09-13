# ADR-0003: Trunk-based development, PR-only workflow

**Date:** 2026-09-13
**Status:** Accepted

## Context

This is a solo-maintained personal site, but it is actively developed through
multiple Claude Code sessions (often running concurrently in separate git
worktrees), not just direct human edits. The workflow needs to guarantee
`main` is always deployable (it deploys automatically on every push, per
`.github/workflows/deploy.yml`), give CI a checkpoint before code reaches
production, and stay safe when several agent sessions are working in the
repo at once.

This decision was already codified operationally in `.claude/rules/git.md`
and the `worktree-workflow` skill, but had never been written down as an ADR
— so the reasoning behind "why PR-only, why short-lived branches" existed
only as a rule to follow, not a decision with alternatives considered.

## Decision

**Trunk-based development, one protected branch.** `main` is always
deployable. All work — including one-line fixes — happens on short-lived
branches (`feat/*`, `fix/*`, `docs/*`, `refactor/*`, `ci/*`, `chore/*`) and
merges only via pull request, never a direct push to `main`. Each Claude Code
session works from its own `git worktree` (see `worktree-workflow` skill),
so concurrent sessions never share a working directory or risk clobbering
each other's uncommitted changes. Commit messages follow Conventional
Commits (`type(scope): summary`).

## Options Considered

| Option | Pros | Cons |
|--------|------|------|
| Direct commits to `main` | Fastest, zero ceremony for a single maintainer | No CI checkpoint before deploy; a bad commit ships immediately; unsafe with concurrent agent sessions editing the same branch |
| Long-lived feature branches / Git Flow (`develop`, release branches) | Familiar to larger teams; supports staged releases | Unnecessary ceremony for a personal site with continuous deploy from `main`; release branches solve a problem (coordinating multiple in-flight releases) this repo doesn't have |
| Trunk-based, PR-only, short-lived branches (chosen) | `main` stays deployable at all times; CI runs on every PR before merge; each worktree/branch is a clean, isolated unit of work — a natural fit for parallel or agent-driven changes | Even a one-line fix needs a branch + PR; slightly more overhead than a direct commit |

## Consequences

- Every change, however small, goes through `git worktree add -b <branch>` →
  edit → `npm run build:full` → PR → merge → worktree cleanup. This is
  spelled out step-by-step in the `worktree-workflow` skill so it isn't
  reinvented per session.
- A red CI run on a PR is treated the same as a red run on `main` — fixed on
  the branch, never merged through.
- Because each session owns its own worktree, two Claude Code sessions can
  work on unrelated branches at the same time without interfering with each
  other's working directory.

## Links

- `.claude/rules/git.md` — branch naming, Conventional Commits format, forbidden actions
- `.claude/skills/worktree-workflow/SKILL.md` — the operational mechanics
- `.github/workflows/deploy.yml` — deploys on every push to `main`, which is why `main` must stay always-deployable
