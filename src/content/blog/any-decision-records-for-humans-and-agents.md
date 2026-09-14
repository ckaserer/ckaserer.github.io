---
title: "Any Decision Record: Writing Decisions Down So an Agent Doesn't Re-litigate Them"
description: "Decision records aren't just for architecture, and not just for one project. Across every repo I maintain with Claude Code or GitHub Copilot, an ADR is the difference between an agent re-arguing a settled call and reading why it was made."
pubDate: 2026-09-13
tags: ["adr", "documentation", "ai-agents", "decision-records"]
---

Every non-trivial, hard-to-reverse decision I make — a deployment mechanism, a framework choice, a contact policy, a storage layout, even whether to keep a photo on an ATS-unfriendly CV — gets a decision record: **Context**, **Decision**, **Alternatives Considered**, **Consequences**. Nothing exotic; the format is decades old, going back to Michael Nygard's original write-up on what he called Architecture Decision Records.

I've stopped calling it "architecture" in my head, though. Across the repos I run this in — a personal site, a homelab infrastructure project, work codebases — most of what earns a record isn't architecture at all: a branching model, a versioning policy, a privacy trade-off, a tooling choice between two AI coding assistants. "Any Decision Record" is the more honest expansion of the same three letters, and I keep it in every repo I touch, not just the ones with a system to design.

## What I tried instead — and why it wasn't enough

None of this was decided in the abstract. It's what my repos actually did before I standardized on `docs/adr/`, and why each approach broke down.

**Commit messages and PR descriptions as the only record.** Git history genuinely shows things like a deployment mechanism being switched, reverted, and switched again — the back-and-forth is right there in the log. But a commit message answers "what changed," not "what else did we try, and why did we rule it out." A few commits later, that context is buried under everything that happened since, and nobody — human or agent — reads the full log before touching the same file again.

**Comments in the code.** A comment lives inside one file, at one line. A decision like "keep the CV photo, accept the ATS parsing risk" isn't about a line of code; it's about a trade-off that spans a component, a build script, and a written rationale that shouldn't get deleted the moment someone refactors the markup — which comments routinely do.

**Putting it all in the always-loaded instructions file** (`CLAUDE.md`, or a Copilot instructions file). That file is good at directives — "do this, don't do that." It's bad at *why*, at length, with rejected alternatives, because that's not what it's for. A directive with no rationale attached is worse than no directive: an agent that hits "don't reintroduce a `gh-pages` branch" with no context has no way to distinguish a considered decision from an arbitrary preference, and considered decisions are exactly the ones worth respecting under pressure to "simplify."

**Tribal knowledge.** The default failure mode, and the one that matters most now that so much of this work runs through AI coding sessions: an agent cannot ask a hallway question. Whatever isn't written down in the repo when a session starts effectively doesn't exist for it.

## Why this helps a human

The usual reasons still apply: a settled debate — "why not just put an email on the CV," "why not a `gh-pages` branch" — gets answered by a link instead of a re-argued conversation. A decision record is referenceable ("see the deploy-mechanism ADR") instead of re-described in prose every time it comes up. This matters whether the next reader is a teammate or just me, six months later, having forgotten my own reasoning.

## Why this helps an agent more

This is the part that's easy to underrate. A fresh Claude Code or Copilot session's entire understanding of *why* a repo looks the way it does comes from what's actually written in the repo — nothing else. Two things follow from that.

**A decision record is a guardrail against well-intentioned "cleanup."** One of my ADRs says outright: don't fix a CV's ATS-parsing risk by silently deleting the photo — that trade-off was already made, on purpose. Without that sentence, "remove the photo, it's flagged as an ATS risk" is exactly the kind of helpful-looking fix an agent might make on its own initiative. With it, the same agent reads the ADR and stops.

**A fixed structure is easier for a model to trust than free prose.** A commit message can say anything, in any order, and an agent has to infer what was actually rejected. Every ADR I write answers the same four questions in the same order — what was the situation, what was decided, what else was on the table and why it lost, what does this cost going forward. That consistency is what makes it something an agent can rely on instead of just read.

There's a good demonstration of this from the numbering scheme itself. I originally numbered ADRs sequentially (`0001`, `0002`, ...) and tried to make that safe across parallel branches with a script that scanned for the highest number already claimed. It still wasn't safe enough — two branches created around the same time can each compute "next" independently and land on the same number, and a number can go missing entirely if the branch that claimed it never merges. The actual fix wasn't a smarter scan; it was removing the need for one. New records are now named by date (`YYYY-MM-DD-slug.md`) instead of a reserved integer — two decisions from the same day are already distinguished by their slug, so there's nothing left to collide over. The index table still shows a sequential number per row, but that's cosmetic now, assigned once, when the row is added — not something any two branches need to agree on in advance.

## When it's actually worth one

**Do:** write one when the decision is non-trivial, hard to reverse, or when "why not the obvious alternative" is a question someone will ask again later — a framework choice, a deployment mechanism, a privacy/contact policy, a branching model, a vendor pick that has nothing to do with software architecture at all.
**Don't:** write one for reversible, low-stakes preferences — that's what a style guide or a rule file is for. A record for "we use two-space indentation" just adds noise that buries the ones that matter.
**Check:** if you deleted this decision's record, would a future reader — human or agent — plausibly make a different, worse choice? If yes, it earns the file. If the answer is "no, they'd land in the same place anyway," it probably didn't need one.

The folder isn't for looking rigorous. It's what keeps a decision made once from having to be re-made, or accidentally un-made, every time someone new — human or otherwise, in this repo or the next one — starts reading the code instead of the history behind it.
