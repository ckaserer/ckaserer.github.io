---
name: adr
description: Create, list, or update an Any Decision Record (ADR) in docs/adr/ using the shared template and numbering scheme. Use when the user asks to "write an ADR", "document a decision", "record a decision", or "supersede an ADR" — technical or not, as long as it's non-trivial and hard to reverse.
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

Filenames use a **date prefix, not a sequential counter**. A counter
(`0001`, `0002`, ...) requires knowing the highest number already claimed on
main *and* on every other open branch/PR before picking the next one — that
check goes stale the moment two branches exist in parallel, and two
branches picking the same "next" number is a real, observed failure mode (a
whole number can go missing from an abandoned branch while a later one
already landed on main). A date + topic slug can't collide that way: two
ADRs written the same day are already distinguished by their slug, which
they need anyway.

The index table in `docs/adr/README.md` still shows a sequential number per
row — that's what "numbered in appearance" means here. That number is
cosmetic, assigned only when a row is added to the table, in chronological
order. If two branches add a row concurrently, the worst case is an
ordinary text merge conflict in one table — trivial to resolve by hand,
unlike two files permanently claiming the same identity. Always link to an
ADR by its filename, never by its display number alone.

Pre-existing ADRs numbered the old way (`0001-...`, `0002-...`) keep their
filenames as they are — don't rename history. Only new ADRs use the
date-prefixed scheme.

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
   existing table format, if it doesn't exist yet), with the next display
   number after the highest one currently in the table.
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
