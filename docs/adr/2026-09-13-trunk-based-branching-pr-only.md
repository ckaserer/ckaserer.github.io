# Trunk-based development, PR-only workflow

- Status: Superseded by [Trunk-based development with squash merge](2026-09-15-trunk-based-development-squash-merge.md)
- Date: 2026-09-13
- Deciders: repo owner + Claude Code

## Context

This is a solo-maintained personal site, but it is actively developed
through multiple Claude Code sessions (often running concurrently in
separate git worktrees), not just direct human edits. The workflow needs to
guarantee `main` is always deployable (it deploys automatically on every
push, per `.github/workflows/deploy.yml`), give CI a checkpoint before code
reaches production, and stay safe when several agent sessions are working in
the repo at once.

This was already codified operationally in `.claude/rules/git.md` and the
`worktree-workflow` skill, but had never been written down as an ADR — so
the reasoning behind "why PR-only, why short-lived branches" existed only as
a rule to follow, not a decision with alternatives considered.

## Decision

**Trunk-based development, one protected branch.** `main` is always
deployable. All work — including one-line fixes — happens on short-lived
branches (`feat/*`, `fix/*`, `docs/*`, `refactor/*`, `ci/*`, `chore/*`) and
merges only via pull request, never a direct push to `main`. Each Claude
Code session works from its own `git worktree`, so concurrent sessions never
share a working directory or risk clobbering each other's uncommitted
changes. Commit messages follow Conventional Commits (`type(scope):
summary`).

## Alternatives Considered

- **Direct commits to `main`** — fastest, zero ceremony for a single
  maintainer, but no CI checkpoint before deploy, and unsafe with concurrent
  agent sessions editing the same branch.
- **Long-lived feature branches / Git Flow** (`develop`, release branches)
  — familiar for larger teams, but unnecessary ceremony for a personal site
  with continuous deploy from `main`; release branches solve a
  multiple-in-flight-releases problem this repo doesn't have.

## Consequences

### Positive

- `main` stays deployable at all times, and CI runs on every PR before
  merge.
- Each worktree/branch is a clean, isolated unit of work — a natural fit for
  parallel or agent-driven changes; two Claude Code sessions can work on
  unrelated branches at the same time without interfering with each other's
  working directory.
- A red CI run on a PR is treated the same as a red run on `main` — fixed on
  the branch, never merged through.

### Negative

- Even a one-line fix needs a branch + PR, which is more overhead than a
  direct commit for a solo maintainer.
- The mechanics (`git worktree add -b <branch>` → edit → `build:full` → PR
  → merge → worktree cleanup) have to be spelled out somewhere
  (`worktree-workflow` skill) or they get reinvented, inconsistently, per
  session.

## References

- `.claude/rules/git.md` — branch naming, Conventional Commits format,
  forbidden actions
- `.claude/skills/worktree-workflow/SKILL.md` — the operational mechanics
- `.github/workflows/deploy.yml` — deploys on every push to `main`, which is
  why `main` must stay always-deployable
