# Record decisions as ADRs

- Status: Accepted
- Date: 2026-09-14
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
what it replaced.

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

### Negative

- Cannot retroactively become "0001" in this repo's numbering — the `adr`
  skill assigns the display number when a row is added to the table and
  never renumbers existing rows, so this lands at the end of the index
  despite describing the practice that, in hindsight, should have come
  first.
- Adds one more file every future `adr`-skill or numbering-scheme change
  must keep consistent across repos, on top of the ones that already exist.

## References

- `.claude/skills/adr/` — the skill and template this ADR itself follows
- `proxmox/docs/adr/2026-09-04-record-architecture-decisions.md` — the same
  decision, recorded there as that repo's actual 0001
- workspace root `docs/adr/2026-09-14-record-decisions-as-adrs.md` — the
  same decision applied to the workspace root repo
