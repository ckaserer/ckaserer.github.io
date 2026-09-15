# Git worktrees to isolate concurrent Claude Code agents in this repo

- Status: Accepted
- Date: 2026-09-13
- Deciders: repo owner + Claude Code

## Context

This repo already requires every session to work from a `git worktree`
rather than the main checkout (`worktree-workflow` skill, `.claude/rules/git.md`).
That convention was adopted for a narrower reason: keeping `main` clean and
enforcing the branch-per-change / PR-only rule ([ADR-0004](2026-09-13-trunk-based-branching-pr-only.md)). It was never
written down as also being *the* answer to a broader problem: more than one
Claude Code agent can end up pointed at this same clone at once (a
background subagent, a second interactive session, automation triggered
mid-task), and if they shared one working directory they'd hit a race
condition on the same `.git` index — one agent's checkout or uncommitted
edit could silently clobber the other's, and both could commit to the
same branch without either side noticing. Nothing in the existing ADRs
records that this is also why one-worktree-per-task matters, so a future
reader (including a future agent deciding whether it's safe to skip the
worktree step "just this once") has no ADR to point to.

Separately, the worktree directory used to live at a plain top-level
`.worktrees/`, reasoned as agent-agnostic. The workspace root reconsidered
that trade-off and moved to `.claude/worktrees/` instead, since Claude Code
is the only agent actually in use across the workspace and that path
matches its native `EnterWorktree`/`ExitWorktree` tooling with no
confirmation friction. This repo follows the same reasoning.

## Decision

Continue requiring one `git worktree` per task/branch, now at
`.claude/worktrees/<branch-slug>` (mechanics: `worktree-isolation` skill;
build/PR-specific steps: `worktree-workflow`), and treat concurrent-agent
isolation as an explicit, additional reason that rule exists and must not
be bypassed — not just a `main`-cleanliness convention. Where the agent is
Claude Code, prefer its native `EnterWorktree`/`ExitWorktree` tools over
manual git commands; the manual sequence stays documented as the fallback
for any other agent, CI, or scripted use.

## Alternatives Considered

- **Top-level `.worktrees/`, agent-agnostic** — this repo's own prior
  choice; works identically for any agent, but fights Claude Code's native
  `EnterWorktree` default and its confirmation prompt, for a portability
  benefit not needed while Claude Code is the only agent in use here.
- **Separate full clones per agent** — full isolation, but duplicates the
  object database and needs its own remote/fetch config per agent; a
  worktree gets the same isolation for free off one shared `.git`, at the
  cost of a separate `npm ci` per worktree (already true today).
- **Manual coordination (agents announce which branch they're using)** — no
  git-level enforcement; a missed announcement reintroduces the exact race
  condition this exists to prevent.
- **Serialize agents on this repo** — defeats the purpose of running agents
  in parallel, and this repo already runs background subagents and
  automation triggered mid-task, neither of which is naturally serial.

## Consequences

### Positive

- Git itself refuses to check out a branch already checked out in another
  worktree — the failure mode this ADR is about is partly closed by git,
  not just by the skill's documented steps.
- Agents can each run their own `npm run build:full`, install their own
  Playwright browser, and commit independently without observing or
  clobbering another agent's in-progress, uncommitted work.
- Codifies *why* `worktree-workflow` isn't optional under concurrency, for
  any agent tempted to shortcut it "since it's just a small doc change."

### Negative

- Per-worktree `npm ci` (and `npx playwright install chromium` when
  touching the OG/PDF generators) means concurrent agents each pay that
  setup cost independently — already true today, just now also justified
  by a second reason.
- Disk usage grows with the number of concurrent agents, since each
  worktree duplicates the working tree and its own `node_modules`.
- Two agents still cannot both hold the same branch — by design, but it
  means even read-only inspection of another agent's in-progress branch
  needs its own worktree rather than a plain checkout.

## Cross-Agent Notes

`.claude/worktrees/` only governs Claude Code's native tooling and the
manual `git worktree add` fallback documented in `worktree-isolation`.
GitHub Copilot CLI/App and OpenAI Codex CLI each manage their own
worktrees in their own external, tool-specific location by default —
outside this repo entirely — and neither currently offers a way to point
that at this path (Copilot: open request,
[copilot-cli#3675](https://github.com/github/copilot-cli/issues/3675);
Codex: configurable, but only at the user/machine level via `CODEX_HOME`,
not per-repo). This doesn't weaken the isolation this ADR is about — each
tool's own worktree still isolates its session — it just means this
repo's convention isn't what a Copilot or Codex session actually uses
unless someone falls back to manual git commands. See `worktree-isolation`
for per-tool detail.

## References

- `.claude/skills/worktree-isolation/SKILL.md` — worktree mechanics and native-tool guidance
- `.claude/skills/worktree-workflow/SKILL.md` — build/PR-specific steps
- `.claude/rules/git.md` — branching and forbidden-actions rules
- [0004](2026-09-13-trunk-based-branching-pr-only.md) — the original motivation for
  branch-per-change; this ADR adds concurrent-agent isolation as a second,
  independent reason the same mechanism is required
- Workspace root `docs/adr/2026-09-14-git-worktrees-for-agent-isolation.md` —
  the workspace root's own decision to use `.claude/worktrees/` for the same
  reason, after reconsidering the tool-agnostic alternative
