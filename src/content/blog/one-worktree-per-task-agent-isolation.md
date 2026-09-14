---
title: "One Worktree Per Task: Stopping Concurrent Coding Agents From Clobbering Each Other"
description: "A git worktree per task started as a way to keep main clean. It turned out to be the fix for a sharper problem: two coding-agent sessions racing on the same .git index."
pubDate: 2026-09-14
tags: ["git", "worktrees", "ai-agents", "workflow"]
---

Every task I hand to Claude Code in this repo — even a one-line doc fix — starts in its own `git worktree`, on its own branch, never the main checkout. I adopted that rule for a narrower reason first: keeping `main` clean under a branch-per-change, PR-only workflow. I only later wrote down the bigger reason it actually matters: more than one agent can end up pointed at this same clone at once — a background subagent, a second interactive session, automation triggered mid-task — and if they share a working directory, they race on the same `.git` index.

**A shared working directory between two coding-agent sessions isn't sloppy, it's a race condition — and the fix is one worktree per task, not more discipline.**

## What sharing a directory actually breaks

A single checkout has one index and one `HEAD`. If two agents both point at it, one agent's checkout or uncommitted edit can silently overwrite the other's — no error, no merge conflict, just lost work. Worse, both agents could end up committing to the same branch without either one noticing the other was ever there. Neither failure announces itself; you find out later, when a change you were sure you made isn't in the diff.

## Why the original reason wasn't the real reason

I'd already required a worktree per branch before I framed it this way, because trunk-based development with a protected `main` needs branch-per-change anyway. That's a real reason, but it's a `main`-cleanliness reason — it says nothing about what happens when two agents are both mid-task at once. Nothing in my rules said the worktree step was also the fix for that. Which meant an agent tempted to skip it "just this once, it's a tiny change" had no documented reason not to — the concurrency risk existed, but I hadn't written down that this was the mechanism already closing it.

## What actually enforces it

Git itself refuses to check out a branch that's already checked out in another worktree. That's not a convention I have to police — it's a hard stop baked into the tool, so the failure mode this exists to prevent is partly closed by git, not just by a rule an agent could choose to ignore. Each worktree lives at `.claude/worktrees/<branch-slug>`, gitignored, which I picked specifically because it matches Claude Code's own native `EnterWorktree`/`ExitWorktree` tooling — using that path means creating and tearing down a worktree needs no extra confirmation prompt, since it's exactly where the tool already expects to put it.

**Do** create a worktree before editing anything, even a change that looks tiny, whenever more than one agent could plausibly touch this repo. **Don't** force past `git worktree add`'s "already checked out" refusal — that error is the isolation working, not a bug to route around. **Check**: could a second agent be pointed at this repo right now — a background subagent, a scheduled skill run, another session I forgot was open? If the honest answer is "maybe," the worktree isn't optional.

## Where it still costs something

Isolation isn't free. Dependencies aren't shared between worktrees, so every one pays its own `npm ci`. Disk usage scales with how many agents are active at once, since each worktree duplicates the working tree. And the isolation cuts both ways: I can't even peek read-only at another agent's in-progress branch without giving it its own worktree too — there's no shortcut for "just looking."

## Not every agent honors the same convention

`.claude/worktrees/` is Claude Code–specific. GitHub Copilot's CLI and app manage their own worktrees in their own external location outside the repo entirely, and OpenAI's Codex CLI defaults to a path under its own home directory — neither currently lets me point them at `.claude/worktrees/`. That doesn't weaken the isolation itself; each tool still keeps its own sessions apart. It just means "check `.claude/worktrees/`" is advice for Claude Code specifically, not a universal place to look for what any agent is doing.

The worktree step was never really about tidiness. It's what stands between "two agents happened to both touch this repo today" and one of them quietly losing the other's work.
