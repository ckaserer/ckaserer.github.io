# Copilot instructions

Read `CLAUDE.md` at this repository's root and `.claude/rules/git.md`, and
follow both as the authoritative source of conventions for this repo (stack,
key files, validation steps, working style, etc.) before making changes.
This file only restates the handful of conventions shared across every repo
the owner works in. A local Copilot CLI session started with `C:\Cloud` as its
current directory can load the workspace-root `CLAUDE.md`, but repository-
scoped and cloud-agent sessions cannot depend on a parent file outside this
checkout. See `docs/adr/2026-09-14-github-copilot-compatibility.md`. Skills
under `.claude/skills/` are natively readable by Copilot's agent mode too—no
separate `.github/skills` copy is needed.

## Shared conventions (apply in every repo, not just this one)

- Commit identity: `Clemens Kaserer <clemens.kaserer@gmail.com>`, not the
  GitHub handle.
- Never commit directly to `main`. Every change, including a one-line fix,
  goes on a feature branch and lands via a pull request.
- Trunk-based development: merge every PR via "Squash and merge" only —
  never a merge commit, never rebase-and-merge — so `main` stays one
  commit per PR.
- Commit messages follow Conventional Commits: `type(scope): summary`,
  imperative mood, summary line ideally ≤72 chars.
- Treat a red CI run on your own PR the same as a red run on `main` — fix it
  on the branch, don't merge through it.
- Delete the feature branch once its PR is merged.
- Before pinning any dependency/package/image version, enumerate the
  actually available versions and check compatibility against the real
  target environment — not just wherever CI/lint happens to run.
- When a value is defined in one file and consumed in another, trace every
  place it's used before treating a change as complete — this is invisible
  to a syntax or type check.

For everything else — this repo's stack, its own validation steps, its
working style — read `CLAUDE.md`.
