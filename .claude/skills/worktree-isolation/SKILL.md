---
name: worktree-isolation
description: Git worktree mechanics for isolating a Claude Code agent's work in this repo when another agent/session may be working the same checkout concurrently. Use when starting any task here, and when cleaning up after a merged PR. For build/PR-specific steps (npm ci, build:full, email guardrail, opening a PR), use the `worktree-workflow` skill instead — it delegates the worktree mechanics here.
---

# Worktree Isolation

Decision and rationale: [ADR 2026-09-13-git-worktrees-for-agent-isolation](../../../docs/adr/2026-09-13-git-worktrees-for-agent-isolation.md).
Branch naming, commit format, and the PR-only rule live in `.claude/rules/git.md`
(always loaded) — this skill covers only the worktree mechanics.

`.claude/worktrees/` is gitignored and matches Claude Code's own native
default worktree location — a deliberate, agent-specific choice since
Claude Code is the only agent in use here today; see the ADR for the
trade-off against a tool-agnostic path.

## Preferred: Native Tooling

If the running agent is Claude Code, prefer its built-in `EnterWorktree`
tool over the manual commands below — it creates the worktree under
`.claude/worktrees/` and switches the session into it in one step. Use
`ExitWorktree` to leave it. Fall back to the manual sequence below for any
other agent, CI, or scripted/non-interactive use.

## Starting a Task (manual fallback)

Run from the **main checkout** (repo root, not a worktree):

```bash
git fetch origin
git merge --ff-only origin/main
git worktree add -b <branch-name> .claude/worktrees/<branch-slug> origin/main
cd .claude/worktrees/<branch-slug>
```

`<branch-slug>` mirrors the branch name with `/` replaced by `-`, e.g.
`feat/add-contact-section` → `.claude/worktrees/feat-add-contact-section`.

### Verify Location Before Editing

```bash
git rev-parse --show-toplevel    # must end in /.claude/worktrees/<branch-slug>
git branch --show-current        # must NOT be main
```

If either check fails — STOP and create a worktree first.

Once the worktree exists, run `npm ci` before editing — see the
`worktree-workflow` skill for this repo's dependency and validation steps.

## Keeping a Branch Fresh

```bash
git fetch origin
git rebase origin/main
git push --force-with-lease
```

## Cleanup After Merge

If the worktree was created with `EnterWorktree`, `ExitWorktree` (action:
`remove`) handles this in one step and runs its own merged/clean checks
first. Otherwise, run these checks from inside the worktree manually. If
any fails — STOP and report; do not delete:

```bash
gh pr view --json state --jq '.state'           # must be "MERGED"
git status --porcelain                           # must be empty
git log origin/<branch-name>..HEAD --oneline     # must be empty
```

If all pass, from the **main checkout**:

```bash
cd <repo-root>
git worktree remove .claude/worktrees/<branch-slug>
git fetch --prune
git branch -d <branch-name>    # safe delete; refuses unmerged branches
```

## Troubleshooting

**`git worktree add` refuses with "already checked out"** — another agent
already has this exact branch open in a worktree elsewhere; pick a different
branch name rather than forcing it (`--force` defeats the isolation this
skill exists for).

**Leftover worktree after an agent session ended abnormally** — from the
main checkout, `git worktree list` shows all of them; confirm the branch is
actually merged or abandoned before running `git worktree remove --force`.
