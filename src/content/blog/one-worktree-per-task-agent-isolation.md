---
title: "Why Every Coding-Agent Task Gets Its Own Git Worktree"
description: "More than one Claude Code session can end up pointed at the same repo at once. A shared checkout turns that into a race condition on the same .git index — a worktree per task is how I close it."
pubDate: 2026-09-15
tags: ["git", "worktrees", "ai-agents", "workflow"]
---

I never let a Claude Code task run against this repo's main checkout. Every task — a background subagent, a second interactive session, automation triggered mid-task — gets its own `git worktree` first, because more than one of those can be pointed at the same clone at the same time, and a shared checkout has exactly one `.git` index for them to fight over.

**Two agents sharing one checkout isn't a style problem — it's a race condition on the same `.git` index, and the only fix that actually holds is giving each task its own worktree.**

## What a shared checkout actually risks

A checkout has one index and one `HEAD`. If two agents are both pointed at it, one agent's checkout or uncommitted edit can silently overwrite the other's — no merge conflict, no warning, just a change that's gone. They could each commit to the same branch without ever seeing the other's commits until later. Neither failure announces itself; you find out when a change you were sure you made isn't in the diff.

## Options I ruled out

**Manual coordination** — agents announce which branch they're using before touching the repo — has no git-level enforcement. One missed announcement, and the exact race condition this is meant to prevent comes right back.

**A full clone per agent** gives real isolation, but it duplicates the entire object database and needs its own remote and fetch configuration per agent — a heavier fix than the problem calls for, when a worktree gets the same isolation off one shared `.git`.

**Serializing agents on the repo** — one at a time, no overlap — removes the race condition by removing the reason to run more than one agent. This repo already runs background subagents and automation triggered mid-task, neither of which is naturally serial; forcing them to queue defeats the point of running more than one agent at all.

## The rule, and what actually backs it

One worktree per task, at `.claude/worktrees/<branch-slug>`, gitignored. I picked that path deliberately because it matches Claude Code's own native `EnterWorktree`/`ExitWorktree` tooling — creating and removing a worktree there needs no extra confirmation prompt, since it's exactly where the tool already expects to find them.

It isn't just a rule an agent has to remember to follow, either. Git itself refuses to check out a branch that's already checked out in another worktree — part of the protection is enforced by the tool, not left to discipline.

**Do** create the worktree before touching a single file, even for a change that looks trivial, any time a second agent could plausibly be active. **Don't** force past git's "already checked out" refusal with `--force` — that refusal is the safeguard doing its job, not an obstacle. **Check**: could another agent — a background subagent, automation triggered mid-task, a session I forgot was open — be pointed at this repo right now? If the answer isn't a clear no, create the worktree.

## What it costs

Isolation isn't free. Dependencies aren't shared between worktrees, so each one pays for its own install. Disk usage grows with how many worktrees are open at once, since each duplicates the working tree. And there's no free read-only peek at another agent's in-progress branch — even just looking needs a worktree of its own.

## Not every tool keeps the same rule

`.claude/worktrees/` is a Claude Code-specific location. GitHub Copilot's CLI and app, and OpenAI's Codex CLI, each manage worktrees in their own external location outside the repo, and neither currently lets me redirect that into `.claude/worktrees/`. That doesn't undo the isolation — each tool still keeps its own sessions apart — it just means checking `.claude/worktrees/` only tells me what Claude Code is doing, not any other agent.

None of this is about tidy history. It's what keeps two agents that happen to touch this repo on the same day from quietly overwriting each other's work.
