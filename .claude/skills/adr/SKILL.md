---
name: adr
description: Create, list, or update an Any Decision Record (ADR) in docs/adr/ using the shared template and date-based naming. Use when the user asks to "write an ADR", "document a decision", "record a decision", or "supersede an ADR" — technical or not, as long as it's non-trivial and hard to reverse.
---

# ADR skill

"ADR" here stands for **Any Decision Record**, not just "Architecture" —
this skill is for any non-trivial, hard-to-reverse decision: architecture
and infrastructure, yes, but equally tooling choices, process changes,
vendor selection, or anything else where a future reader (including a
future Claude Code or Copilot session) needs to know *why*, not just
*what*. Don't use it for routine implementation detail that's easily
reversed or already obvious from the code.

## Hard constraints

Every ADR MUST:

- Be **≤150 lines** of markdown (excluding front matter, if any). If the
  content doesn't fit, the decision is too broad — split it into two ADRs
  instead of stretching the limit. This applies regardless of domain: a
  process or vendor-selection ADR should be exactly as tight as a
  storage-layout one.
- Contain **at most 1 mermaid diagram**, and only when a diagram genuinely
  clarifies the decision (a topology, a sequence, a data flow, a decision
  tree). Most ADRs — especially non-technical ones — don't need one. Don't
  add a diagram just to have one.
- Use the exact section structure from `template.md` in this skill
  directory, so every ADR looks the same at a glance regardless of which
  repo or which kind of decision it documents.
- Be named `docs/adr/YYYY-MM-DD-kebab-slug.md`, dated the day the ADR is
  drafted. See "Numbering" below for why this replaced sequential integers.

## Numbering

**There is no numbering, anywhere, ever — not even cosmetic.** Filenames
use a date prefix, not a sequential counter. A counter (`0001`, `0002`,
...) requires knowing the highest number already claimed on main *and* on
every other open branch/PR before picking the next one — that check goes
stale the moment two branches exist in parallel, and two branches picking
the same "next" number is a real, observed failure mode (a whole number
can go missing from an abandoned branch while a later one already landed
on main). A date + topic slug can't collide that way: two ADRs written the
same day are already distinguished by their slug, which they need anyway.

An earlier version of this rule kept a "cosmetic" sequential number in the
`docs/adr/README.md` index table, reasoning that a display-only number
couldn't collide the way a filename number could. In practice that number
still leaked everywhere: cross-references inside other ADRs, `CLAUDE.md`,
`copilot-instructions.md`, and `docs/requirements.md` all started citing
`[ADR-0007]` instead of the file, and when an ADR got backdated and rows
shifted, those bare-number references silently went stale or pointed at
the wrong decision. **Never assign, display, or reference an ADR by a
sequential number, in any file, in any repo.** The index table has no `#`
column — lead with a `Date` column instead, linking the date itself to the
file:

```
| Date | Title | Status |
|---|---|---|
| [2026-09-04](2026-09-04-record-decisions-as-adrs.md) | Record decisions as ADRs | Accepted |
```

Reference an ADR from anywhere — another ADR's body, `CLAUDE.md`, a
`copilot-instructions.md`, a blog post, a PR description — by its
date-prefixed filename or title, never a bare number:
`[ADR 2026-09-04: Self-hosted runner placement](2026-09-04-self-hosted-runner-placement.md)`.

If this scheme itself changes again in the future, rename every existing
ADR to match it — filenames should never be left on a stale convention.
Update every cross-reference (ADR bodies, the README index, `CLAUDE.md`,
`copilot-instructions.md`, and any blog post that names one) as part of
that same rename.

## Backdating a retroactive ADR

Some ADRs document a practice that was already in effect before anyone
wrote it down — most commonly, the "why we record decisions as ADRs" ADR
itself, added after the fact to a repo that already had one. Backdate its
filename and `Date:` field to when that practice actually started (the
first commit that added `.claude/skills/adr/`, or the first file under
`docs/adr/` if that came first — whichever is earlier), not to the day it
was written. Then insert its row into `docs/adr/README.md` at its correct
chronological position instead of appending it. Because nothing is
numbered, this is the entire fix — there's no cosmetic number to shift and
no `[ADR-NNNN]`-style cross-reference anywhere that could go stale as a
result; every reference already points at the (unchanged) filename.

Verify "first commit" by reading its actual diff, not just its existence —
a skill file can appear on one date and still be renamed or reworded
later (e.g. "Architecture Decision Record" → "Any Decision Record"); use
whichever commit the ADR's own content actually matches. When those two
dates diverge for a repo that already has a long ADR history, prefer the
date the underlying *decision* was made over the date shared terminology
was synced in — a wording sync isn't a new decision. Flag the trade-off to
the user rather than picking silently if the two dates genuinely conflict.

### When the ADR is itself a literal shared copy

The "why we record decisions as ADRs" ADR is a special case even among
backdated ADRs: it's meant to exist as a byte-for-byte identical copy in
every repo that uses this skill, the same way `SKILL.md` and `template.md`
already are, so any agent bootstrapping in any of these repos finds the
same explanation and the same worked example. When that's the intent,
don't give each repo's copy its own adoption date — use one shared date
across every copy (the oldest instance of the decision anywhere in the
workspace) and one shared wording, even where that date predates a given
repo's own git history. State that explicitly in the ADR's own
Consequences section so a reader doesn't mistake the mismatch for an
error. Still insert it at its correct chronological position in every
affected repo's table, not just the one being edited.

## Steps to create a new ADR

1. Pick a short kebab-case slug for the title, e.g. `storage-layout`,
   `vendor-selection`.
2. Copy `template.md` from this skill directory to
   `docs/adr/YYYY-MM-DD-kebab-slug.md`, using today's date.
3. Fill in every section. Do not leave placeholder text (`<...>`) in the
   final file — if a section genuinely doesn't apply, write "N/A" and a
   one-line reason rather than deleting the heading.
4. Set `Status` to `Proposed` unless the user says to mark it `Accepted`
   directly.
5. Add a row to `docs/adr/README.md` (create it from scratch, matching the
   existing table format, if it doesn't exist yet), in chronological order
   by date. No number — see "Numbering" above.
6. Check the line count before finishing: the file must be ≤150 lines.

## Steps to supersede an existing ADR

1. Create the new ADR normally (steps above).
2. In the new ADR's `Context` section, reference the old one by filename:
   `Supersedes [old title](old-filename.md).`
3. In the **old** ADR, change its `Status` line to:
   `Superseded by [new title](new-filename.md)`. Do not delete or rewrite
   the old ADR's content — history stays intact.
4. Update the status column for both rows in `docs/adr/README.md`.

## Style notes

- Write the `Decision` section as one or two direct, declarative sentences.
  If you can't state the decision in two sentences, the ADR is trying to
  cover too much.
- `Consequences` must include at least one negative/trade-off, even for a
  decision you're confident in — an ADR with only upsides usually means the
  trade-offs weren't examined.
- Keep `Alternatives Considered` to the options that were seriously on the
  table, with a one-line reason each was rejected. Don't pad it with
  strawmen.
