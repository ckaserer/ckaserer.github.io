# 0009. Standardize AI-agent tooling on Claude Code conventions

- Status: Accepted
- Date: 2026-09-13
- Deciders: repo owner + Claude Code

## Context

The repo's original AI-agent-facing instructions (introduced alongside the
Docusaurus → Astro rewrite in `9e6b0d6`) were written as GitHub Copilot
instructions and skills. Commit `8b7cd02` ("docs(tooling): migrate GitHub
Copilot instructions/skills to Claude Code conventions") later moved all of
that to Claude Code's format: an always-loaded `CLAUDE.md`, on-demand
`.claude/skills/*` (e.g. `update-cv`, `worktree-workflow`,
`open-pull-request`, `pipeline-debug`, `adr`, `repo-stats`), and
always-loaded `.claude/rules/git.md`. This repo is now actively developed
primarily through Claude Code sessions — including this ADR itself — so
which AI-tooling convention it standardizes on is a real architectural
choice, not a cosmetic one: it determines where the "why" behind every other
decision in this repo actually lives and stays current.

## Decision

**All AI-agent instructions live exclusively in Claude Code's format** —
`CLAUDE.md`, `.claude/skills/*`, `.claude/rules/*` — with no GitHub
Copilot-specific instruction files maintained in parallel.

## Alternatives Considered

- **Maintain both Copilot and Claude Code instruction formats in parallel**
  — works regardless of which AI tool a given contributor uses, but creates
  two sources of truth for the same conventions (branch naming, CV data
  rules, ATS rules, ADR process) that will drift the moment one is updated
  and the other isn't — the same duplicated-fact problem this repo's own
  `cv.highlight` single-source-of-truth rule warns against, at the tooling
  layer instead of the content layer.
- **No structured AI-agent instructions at all, rely on ad hoc prompting** —
  zero maintenance overhead, but every session would need to rediscover
  conventions (branch naming, CV single-source-of-truth, ADR process, email
  guardrail rationale) from scratch or by reading raw code/history.

## Consequences

### Positive

- Every future convention (a new skill, a new hard rule, this very ADR
  process) is written once, in Claude Code's format, not duplicated.
- The "Living documentation rule" in `CLAUDE.md` — update the relevant
  skill/rule/`CLAUDE.md` in the same commit as the change it documents —
  only has one place to apply, not two.

### Negative

- A contributor using a different AI tool gets no tool-native equivalent —
  they'd read `CLAUDE.md` as documentation rather than have it auto-loaded.
- If the primary AI tool used on this repo changes again in the future, this
  ADR needs to be explicitly superseded rather than quietly ignored, or the
  "single source of truth" property it establishes silently erodes.

## References

- Commit `8b7cd02` — the Copilot → Claude Code migration
- `CLAUDE.md` — "Living documentation rule"
- `.claude/skills/`, `.claude/rules/git.md`
