---
title: "One Worktree Per Task: Stopping Concurrent Coding Agents From Clobbering Each Other"
description: "I give every Claude Code task its own git worktree for one reason: more than one agent can end up pointed at the same repo at once, and a shared working directory means they'd race on the same .git index."
pubDate: 2026-09-14
tags: ["git", "worktrees", "ai-agents", "workflow"]
---

Every task I hand to Claude Code in this repo — even a one-line doc fix — starts in its own `git worktree`, on its own branch, never the main checkout. I introduced that rule to solve one specific problem: more than one agent can end up pointed at this same clone at once — a background subagent, a second interactive session, automation triggered mid-task — and if they share a working directory, they race on the same `.git` index.

**A shared working directory between two coding-agent sessions isn't sloppy, it's a race condition — and the fix is one worktree per task, not more discipline.**

## What sharing a directory actually breaks

A single checkout has one index and one `HEAD`. If two agents both point at it, one agent's checkout or uncommitted edit can silently overwrite the other's — no error, no merge conflict, just lost work. Worse, both agents could end up committing to the same branch without either one noticing the other was ever there. Neither failure announces itself; you find out later, when a change you were sure you made isn't in the diff.

## A useful side effect, not the reason

This repo also runs trunk-based development — `main` is protected, every change lands through a PR, which already implies one branch per task. A worktree happens to support that cleanly too: each task gets its own branch instead of jostling for space in one checkout. But that overlap is a side effect, not the justification. Branch-per-change would still hold even if every agent shared one working directory and switched branches by hand — it just wouldn't be safe the moment two agents were active at once. The worktree is what makes it safe under concurrency; the clean `main` history is a bonus it happens to come with.

## What actually enforces it

Git itself refuses to check out a branch that's already checked out in another worktree. That's not a convention I have to police — it's a hard stop baked into the tool, so the failure mode this exists to prevent is partly closed by git, not just by a rule an agent could choose to ignore. Each worktree lives at `.claude/worktrees/<branch-slug>`, gitignored, which I picked specifically because it matches Claude Code's own native `EnterWorktree`/`ExitWorktree` tooling — using that path means creating and tearing down a worktree needs no extra confirmation prompt, since it's exactly where the tool already expects to put it.

**Do** create a worktree before editing anything, even a change that looks tiny, whenever more than one agent could plausibly touch this repo. **Don't** force past `git worktree add`'s "already checked out" refusal — that error is the isolation working, not a bug to route around. **Check**: could a second agent be pointed at this repo right now — a background subagent, a scheduled skill run, another session I forgot was open? If the honest answer is "maybe," the worktree isn't optional.

## Where it still costs something

Isolation isn't free. Dependencies aren't shared between worktrees, so every one pays its own `npm ci`. Disk usage scales with how many agents are active at once, since each worktree duplicates the working tree. And the isolation cuts both ways: I can't even peek read-only at another agent's in-progress branch without giving it its own worktree too — there's no shortcut for "just looking."

## Not every agent honors the same convention

`.claude/worktrees/` is Claude Code–specific. GitHub Copilot's CLI and app manage their own worktrees in their own external location outside the repo entirely, and OpenAI's Codex CLI defaults to a path under its own home directory — neither currently lets me point them at `.claude/worktrees/`. That doesn't weaken the isolation itself; each tool still keeps its own sessions apart. It just means "check `.claude/worktrees/`" is advice for Claude Code specifically, not a universal place to look for what any agent is doing.

The worktree step was never really about tidiness. It's what stands between "two agents happened to both touch this repo today" and one of them quietly losing the other's work.
