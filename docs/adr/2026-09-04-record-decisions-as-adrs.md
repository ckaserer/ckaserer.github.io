# Record decisions as ADRs

- Status: Accepted
- Date: 2026-09-04
- Deciders: repo owner + Claude Code

## Context

Decisions worth remembering — architecture, infrastructure, tooling, process, or anything
else non-trivial and hard to reverse — tend to get lost. They live in a commit message that
answers "what changed" but not "what else was considered and why it lost," in a comment that
gets deleted the next time the code around it is refactored, or nowhere at all, in someone's
head. A future reader — including a future Claude Code or Copilot session with no memory of
this conversation — has only what's actually written in the repo to work from. Without a
dedicated place for *why*, that reasoning doesn't survive.

## Decision

We will record every non-trivial, hard-to-reverse decision as a lightweight ADR (Any Decision
Record) under `docs/adr/`, using the shared template and constraints defined in the `adr`
skill (`.claude/skills/adr/`). This file is a literal, identical copy across every repo in
this workspace that uses the skill — not a repo-specific account of when that repo adopted
the practice — so that a Claude Code session, a GitHub Copilot session, or any other agent
bootstrapping in any of these repos finds the same explanation of the convention and the same
worked example to follow when writing a new one. It is dated 2026-09-04, the oldest instance
of this decision anywhere in the workspace (first made in `proxmox`), by deliberate
convention: every copy carries that same date rather than each repo's own adoption date, so
the copies stay identical and never need reconciling against each other.

## Alternatives Considered

- **A repo-specific ADR per repo, each dated to its own adoption** — accurate to each repo's
  own history, but the three copies drift in date and wording, defeating the point of a
  shared, copyable bootstrap file; a session in one repo can no longer assume another repo's
  copy says the same thing.
- **One canonical copy in the workspace root only, referenced by pointer from the others** —
  fails the same way the Copilot-compatibility ADR already ruled out pointer-only sharing: a
  sibling repo's file is invisible to a session, or a sandboxed cloud agent, checked out to a
  single repo.
- **No dedicated ADR for the practice itself, rely on the `adr` skill's own `SKILL.md`** — the
  skill documents *how*; this ADR is *why*, and skipping it leaves every `docs/adr/README.md`
  unable to explain its own existence.

## Consequences

### Positive

- Every repo's `docs/adr/README.md` has a self-describing first entry, and every copy reads
  identically — an agent that has seen this file in one repo already knows what it says in
  another.
- A single canonical wording means updating the practice itself (not an individual decision)
  is a find-and-replace across three files, not three separate rewrites.

### Negative

- The 2026-09-04 date does not reflect when this file was actually authored or committed in
  this repo or `ckaserer.github.io` — both post-date it by more than a week. A reader checking
  `git log` against this file's `Date:` field will find a mismatch; that's a deliberate
  trade-off for identical copies, not an error.
- Keeping three copies identical relies on discipline, not tooling — nothing enforces that a
  future edit to one copy gets mirrored to the other two.

## References

- `.claude/skills/adr/` — the skill and template this ADR itself follows
- `proxmox/docs/adr/2026-09-04-record-decisions-as-adrs.md`,
  `ckaserer.github.io/docs/adr/2026-09-04-record-decisions-as-adrs.md`, workspace root
  `docs/adr/2026-09-04-record-decisions-as-adrs.md` — the three identical copies of this file
- Michael Nygard, [Documenting Architecture Decisions](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
  — the original 2011 write-up this format descends from, under its original, narrower name
