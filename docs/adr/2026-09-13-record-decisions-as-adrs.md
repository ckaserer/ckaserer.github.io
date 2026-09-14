# Record decisions as ADRs

- Status: Accepted
- Date: 2026-09-13
- Deciders: repo owner + Claude Code

## Context

This repo already has ten-plus ADRs covering real decisions (framework
choice, deploy strategy, branching model, dependency versioning, and more),
all following the shared template and numbering scheme documented in the
`adr` skill (`.claude/skills/adr/`). What's missing is the ADR that states
the practice itself — why these decisions get written down as ADRs under
`docs/adr/` at all, rather than left in commit messages or this repo's
`CLAUDE.md`. A future reader (including a future Claude Code or Copilot
session) landing in `docs/adr/` sees the outcome of the convention — a
dated folder of files — with no record of why the convention exists or
what it replaced. This ADR is dated to 2026-09-13, not to the day it was
actually written (2026-09-14), per the `adr` skill's own backdating rule for
retroactive ADRs. Specifically, commit `e8b8f61` ("consolidate on a
general-purpose Any Decision Record skill") is when the `adr` skill, and the
"Any" in ADR, arrived in *this* repo — but that commit was itself a sync,
41 seconds behind the workspace root's `8805ebc`, where "Architecture
Decision Record" was actually generalized to "Any Decision Record" first.
The first several decision records here predate both, written under the
original "Architecture Decision Record" framing before it generalized.

## Decision

We will record every non-trivial, hard-to-reverse decision about this
site — content architecture, tooling, deployment, or process — as a
lightweight ADR under `docs/adr/`, using the shared template and
constraints defined in the `adr` skill (`.claude/skills/adr/`). This ADR
documents that practice itself, matching the equivalent ADR now recorded
in every other repo that uses the same skill.

## Alternatives Considered

- **Leave it implicit** — the practice is already followed consistently
  across every existing ADR in this repo; writing it down is pure upside,
  not a real alternative being weighed.
- **Rely on the workspace root's copy of this ADR** — the workspace root's
  `CLAUDE.md` reaches this repo via directory walk-up for Claude Code, but
  a sibling repo's `docs/adr/` file does not, and Copilot's sandboxed cloud
  agent can't see the workspace root file at all — the same reasoning
  already applied in `2026-09-14-github-copilot-compatibility.md`. Only a
  copy inside this checkout is reliably visible to every agent working
  here.
- **Fold this into the `adr` skill's own `SKILL.md`** — the skill documents
  *how* to write an ADR; *why the practice exists* belongs in an ADR of its
  own, consistent with how every other process decision in this repo is
  recorded.

## Consequences

### Positive

- `docs/adr/README.md` now has an entry that explains the table's own
  existence, instead of assuming a reader already knows.
- Matches the identical ADR added to the workspace root and to every other
  repo cloned there that follows the `adr` skill, so the reasoning doesn't
  have to be rediscovered per repo.
- Backdating this ADR to the skill's actual arrival date, rather than the
  day it was written, lets it sort into its true chronological position
  (0010) instead of being silently appended after everything, including
  ADRs written a full day later.

### Negative

- Still can't become "0001" here, but for a real reason now, not a
  numbering artifact: nine decisions in this repo genuinely predate the
  `adr` skill's generalization, written under the original "Architecture
  Decision Record" framing before that reached this repo. This ADR
  correctly sorts after those, not before them.
- Backdating and reordering required renumbering two ADRs already in this
  table (old 0010→0011, 0011→0012) and fixing the one bare `[ADR-0010]`
  cross-reference to the worktrees ADR in `.claude/rules/git.md` — the kind
  of upkeep the `adr` skill's backdating rule now calls out explicitly, but
  that a future repo attempting the same thing must still do by hand.

## References

- `.claude/skills/adr/` — the skill and template this ADR itself follows,
  including its backdating rule for retroactive ADRs
- `proxmox/docs/adr/2026-09-04-record-decisions-as-adrs.md` — the same
  decision, recorded there as that repo's actual 0001
- workspace root `docs/adr/2026-09-13-record-decisions-as-adrs.md` — the
  same decision applied to the workspace root repo, where "Any Decision
  Record" actually originated (commit `8805ebc`)
