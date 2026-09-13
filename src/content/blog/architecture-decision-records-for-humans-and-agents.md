---
title: "Why This Site Keeps a docs/adr Folder — Specification for Humans and Agents"
description: "Architecture Decision Records aren't just for teams. On a repo maintained largely through Claude Code sessions, they're the difference between an agent re-litigating a settled decision and reading why it was made."
pubDate: 2026-09-13
tags: ["adr", "documentation", "ai-agents", "architecture"]
---

This site's repo has a `docs/adr/` folder. Every non-trivial, hard-to-reverse decision — deployment mechanism, framework choice, contact policy, even whether to keep a photo on an ATS-unfriendly CV — gets a numbered Architecture Decision Record: **Context**, **Decision**, **Options Considered**, **Consequences**. Nothing exotic; the format is decades old.

What's worth writing about is *why*, for a repo like this one. It isn't maintained by a team that needs onboarding docs. It's maintained largely through Claude Code sessions — each one starting with zero memory of every conversation that came before it. That changes what an ADR is actually for.

## What we tried instead — and why it wasn't enough

None of this was decided in the abstract. It's what this repo actually did before `docs/adr/` existed, and why each approach broke down.

**Commit messages and PR descriptions as the only record.** This repo's git history genuinely shows GitHub Pages deployment being switched to a `gh-pages` branch, reverted, and switched again to `actions/deploy-pages` — the real back-and-forth is right there in the log. But a commit message answers "what changed," not "what else did we try, and why did we rule it out." Three commits later, that context is buried under everything that happened since, and nobody — human or agent — reads the full log before touching a workflow file.

**Comments in the code.** A comment lives inside one file, at one line. A decision like "keep the CV photo, accept the ATS parsing risk" isn't about a line of code; it's about a trade-off that spans a component, a build script, and a written rationale that shouldn't get deleted the moment someone refactors the header markup — which comments routinely do.

**Putting it all in `CLAUDE.md`.** `CLAUDE.md` is this repo's always-loaded operating instructions — "do this, don't do that." It's good at directives. It's bad at *why*, at length, with rejected alternatives, because that's not what it's for. A directive with no rationale attached is actually worse than no directive: an agent that hits "don't reintroduce a `gh-pages` branch" with no context has no way to distinguish a considered decision from an arbitrary preference, and considered decisions are exactly the ones worth respecting under pressure to "simplify."

**Tribal knowledge.** The default failure mode, and the one that matters most here: a Claude Code session cannot ask a hallway question. Whatever isn't written down in the repo when a session starts effectively doesn't exist for it.

## Why this helps a human

The usual reasons still apply: a settled debate — "why not just put an email on the CV," "why not a `gh-pages` branch" — gets answered by a link instead of a re-argued conversation. A numbered ADR is referenceable ("see ADR-0006") instead of re-described in prose every time it comes up.

## Why this helps an agent more

This is the part that's easy to underrate. A fresh Claude Code session's entire understanding of *why* the repo looks the way it does comes from what's actually written in the repo — nothing else. Two things follow from that:

**An ADR is a guardrail against well-intentioned "cleanup."** ADR-0001 says outright: don't fix the CV's ATS-parsing risk by silently deleting the photo — that trade-off was already made, on purpose. Without that sentence, "remove the photo, it's flagged as an ATS risk" is exactly the kind of helpful-looking fix an agent might make on its own initiative. With it, the same agent reads the ADR and stops.

**A fixed structure is easier for a model to trust than free prose.** A commit message can say anything, in any order, and an agent has to infer what was actually rejected. Every ADR here answers the same four questions in the same order — what was the situation, what was decided, what else was on the table and why it lost, what does this cost going forward. That consistency is what makes it something an agent can rely on instead of just read.

There's a good demonstration of this from writing these very ADRs: the `create-adr` skill's own script for reserving the next ADR number worked by pattern-matching branch names and PR titles like `adr-NNNN`. It missed an ADR sitting on a branch named for its feature instead — `feat/blog-section` — and would have silently reused an already-taken number. The bug wasn't found by reading the script; it was found by actually running it and getting a wrong answer. The fix — scan `docs/adr/` on every branch directly, don't infer from names — is itself now a small, permanent lesson about not trusting a heuristic over the real state it's supposed to reflect.

## When it's actually worth an ADR

**Do:** write one when the decision is non-trivial, hard to reverse, or when "why not the obvious alternative" is a question someone will ask again later — a framework choice, a deployment mechanism, a privacy/contact policy, a branching model.
**Don't:** write one for reversible, low-stakes preferences — that's what a style guide or a rule file (`.claude/rules/git.md` here) is for. An ADR for "we use two-space indentation" just adds noise that buries the ones that matter.
**Check:** if you deleted this decision's ADR, would a future session (human or agent) plausibly make a different, worse choice? If yes, it earns the file. If the answer is "no, they'd land in the same place anyway," it probably didn't need one.

The folder isn't for looking rigorous. It's what keeps a decision made once from having to be re-made, or accidentally un-made, every time someone new — human or otherwise — starts reading the code instead of the history behind it.
