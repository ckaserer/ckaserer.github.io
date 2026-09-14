# Add lightweight GitHub Copilot compatibility alongside Claude Code instructions

- Status: Accepted
- Date: 2026-09-14
- Deciders: repo owner + Claude Code

## Context

Supersedes [Standardize AI-agent tooling on Claude Code conventions](2026-09-13-claude-code-over-github-copilot-conventions.md).

That earlier ADR moved this repo's AI-agent instructions fully to Claude
Code's format and dropped the Copilot-native `.github/instructions/*.md` +
`.github/skills/*/SKILL.md` this repo originally had (`8b7cd02`), reasoning
that maintaining both formats in parallel creates two sources of truth that
drift. That held while Copilot was, at best, a hypothetical second consumer
here. It no longer holds: the repo owner now actively uses Copilot as a
second agent across their repos, on the same codebases Claude Code works in
— including this one — so Copilot getting zero native conventions is a real
cost, not a theoretical one.

What's changed since the original migration, and what makes revisiting this
cheap rather than a full reversal: Copilot's agent mode has gained native
support for reading `.claude/skills/*/SKILL.md` directly (in addition to
`.github/skills`), so the skills already migrated to Claude Code's format
don't need to be duplicated or reformatted a second time — the expensive
half of the original problem is gone on its own. What's left is prose
conventions (`CLAUDE.md`, `.claude/rules/git.md`), and
`.github/copilot-instructions.md` content is injected into every Copilot
request the same way `CLAUDE.md` is for Claude Code; an agentic Copilot
session (VS Code Agent Mode, GitHub's cloud coding agent) has real file-read
tools, so a plain instruction to "read file X" is something it actually acts
on, not inert text.

## Decision

Add `.github/copilot-instructions.md` containing the small, low-churn
conventions shared across every repo the owner works in (commit identity,
contribution workflow basics, cross-repo engineering lessons), inlined
literally, plus a one-line instruction to read this repo's own `CLAUDE.md`
and `.claude/rules/git.md` as authoritative for everything repo-specific. No
`.github/skills` duplication and no generation/sync tooling.

## Alternatives Considered

- **Full reversal — restore `.github/instructions`/`.github/skills` as a
  second maintained format** — this is exactly the two-sources-of-truth
  problem the original ADR rejected, and skills don't even need it anymore
  given Copilot's native `.claude/skills` support.
- **Pointer-only, no literal content** — the shared conventions live in the
  workspace root's `CLAUDE.md`, a sibling repo GitHub's cloud coding agent
  never checks out (sandboxed to this repo alone); a pointer there would
  silently resolve to nothing. Only safe for content already inside this
  repo, hence the `CLAUDE.md` pointer but not a workspace-root pointer.
- **Leave the Claude-Code-only decision standing** — zero effort, but ignores
  that Copilot is now a real, actively-used agent on this repo.

## Consequences

### Positive

- Copilot sessions here get the same branch/commit/PR conventions and
  cross-repo lessons as Claude Code, without reviving the parallel-skills
  maintenance burden the original ADR was actually worried about.
- Skills stay single-sourced in `.claude/skills/`, usable from both tools.

### Negative

- The shared-conventions block in `.github/copilot-instructions.md` is a
  literal duplicate of part of the workspace root's `CLAUDE.md` — updates to
  that shared content must be hand-propagated to this file (and its
  equivalent in every other repo); nothing enforces that structurally.
- Whether the `CLAUDE.md` pointer is followed depends on the Copilot surface
  having file-read tools attached; a bare "Ask"-mode chat without workspace
  tools won't act on it.

## References

- `docs/adr/2026-09-13-claude-code-over-github-copilot-conventions.md` — superseded
- `8b7cd02` — the original Copilot → Claude Code migration
- `.github/copilot-instructions.md`
