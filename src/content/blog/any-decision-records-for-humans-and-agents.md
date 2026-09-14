---
title: "Any Decision Record: Writing Decisions Down So an Agent Doesn't Re-litigate Them"
description: "Decision records aren't just for architecture, and not just for one project. Across every repo I maintain with Claude Code or GitHub Copilot, an ADR is the difference between an agent re-arguing a settled call and reading why it was made."
pubDate: 2026-09-13
tags: ["adr", "documentation", "ai-agents", "decision-records"]
---

Every non-trivial, hard-to-reverse decision I make — a deployment mechanism, a framework choice, a contact policy, a storage layout, even whether to keep a photo on an ATS-unfriendly CV — gets a decision record: **Context**, **Decision**, **Alternatives Considered**, **Consequences**. Nothing exotic; the format is decades old, going back to Michael Nygard's original write-up on what he called Architecture Decision Records.

I've stopped calling it "architecture" in my head, though. Across the repos I run this in — a personal site, a homelab infrastructure project, work codebases — most of what earns a record isn't architecture at all: a branching model, a versioning policy, a privacy trade-off, a tooling choice between two AI coding assistants. "Any Decision Record" is the more honest expansion of the same three letters, and I keep it in every repo I touch, not just the ones with a system to design.

## What didn't work before

None of this was decided in the abstract — it's what my repos did before I standardized on `docs/adr/`. Commit messages capture *what* changed, not what else was considered and why it lost. A code comment lives at one line, not across the trade-off it's explaining. The always-loaded instructions file (`CLAUDE.md`) is good at directives, bad at rationale — and a directive with no reasoning attached is just as easy for an agent to "simplify" away as a stray preference. And tribal knowledge doesn't exist for an agent that can't ask a hallway question.

## Why this helps a human

The usual reasons still apply: a settled debate — "why not just put an email on the CV," "why not a `gh-pages` branch" — gets answered by a link instead of a re-argued conversation. A decision becomes referenceable instead of re-described in prose every time it comes up. That's true whether the next reader is a teammate or just me, six months later, having forgotten my own reasoning.

## Why this helps an agent more

This is easy to underrate. A fresh Claude Code or Copilot session's entire understanding of *why* a repo looks the way it does comes from what's written in the repo — nothing else.

**A decision record is a guardrail against well-intentioned "cleanup."** One of my ADRs says outright: don't fix a CV's ATS-parsing risk by deleting the photo — that trade-off was already made, on purpose. Without that sentence, an agent might "fix" it on its own initiative. With it, the same agent reads the ADR and stops.

**A fixed structure is easier for a model to trust than free prose.** Every ADR answers the same four questions in the same order, so an agent isn't inferring what was rejected — it's reading it.

A good example: I originally numbered ADRs sequentially and scanned for the highest number claimed so far — but two branches could still land on the same number. The fix wasn't a smarter scan; it was naming records by date (`YYYY-MM-DD-slug.md`) instead, so there's nothing left to collide over.

## When it's actually worth one

**Do:** write one when the decision is non-trivial, hard to reverse, or when "why not the obvious alternative" is a question someone will ask again later.

**Don't:** write one for reversible, low-stakes preferences — that's what a style guide or a rule file is for.

**Check:** if you deleted this record, would a future reader — human or agent — plausibly make a different, worse choice? If yes, it earns the file.

The folder isn't for looking rigorous. It's what keeps a decision made once from having to be re-made, or accidentally un-made, every time someone new — human or otherwise, in this repo or the next one — starts reading the code instead of the history behind it.
