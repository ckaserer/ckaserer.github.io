# Automatic local consulting worklog for GitHub Copilot CLI sessions

- Status: Proposed
- Date: 2026-09-24
- Deciders: repo owner + Copilot CLI

## Context

As an independent consultant, the repo owner must report, per client, the
date, duration (billed in 0.25 h increments), and a short description of
work performed — increasingly done inside GitHub Copilot CLI sessions
across several parallel client repositories. Reconstructing this by hand
from memory or shell history is unreliable and time-consuming; some clients
require the description in German, others in English.

The Copilot CLI exposes user-level lifecycle hooks
(`sessionStart`, `userPromptSubmitted`, `agentStop`, `sessionEnd`, and
others) that fire synchronously with structural JSON payloads (session ID,
timestamp, `cwd`, tool name) but never prompt or file content. Hooks cannot
see wall-clock human "thinking time" directly, cannot see child/subagent
timers reliably, and — critically for this machine — this machine enforces
an enterprise policy that fails closed on broad permission bypass
(`--allow-all`/`--allow-all-tools`), so any design element that needs the
agent to run a specific command non-interactively must use a narrowly
scoped `--allow-tool` grant, never a broad one.

Live probing (see `copilot-worklog` repo, `docs/milestone-1` and
`docs/milestone-2` findings) confirmed: repo-level hooks did not fire in
this environment (only user-level hooks did); hook delivery order does not
match logical event order (must sequence by each event's own `timestamp`);
real transcript timestamps appear as both epoch-ms integers and ISO 8601
strings; and the exact event names for permission/`ask_user` wait-time
detection remain unverified against a real transcript.

## Decision

Build a small, private, local-only tool (`copilot-worklog`, a separate
repo) rather than a spreadsheet the owner updates by hand, or a cloud
service:

- **Capture**: a user-level Copilot CLI hook writes one immutable JSON file
  per lifecycle event into a private inbox (atomic temp-write + rename),
  under `%LOCALAPPDATA%\CopilotWorklog` — never inside a cloud-sync folder
  or a Git working tree, and never containing prompt/file content, only a
  strict field allowlist.
- **Ledger**: a single-writer SQLite database (guarded by a short-lived
  file lock) imports the inbox, reduces `userPromptSubmitted` →
  `agentStop`/`sessionEnd` pairs into **runs**, and attributes each run to
  a client via a `cwd` path-prefix mapping the owner configures explicitly
  ahead of time (mapping a client after a run has already closed does not
  retroactively re-attribute it; an explicit `reassign` command with an
  append-only corrections log fixes that).
- **Timing model**: parallel top-level sessions count independently and
  additively (no presence/idle detection — a running agent counts as
  work); overlapping sessions are recorded as-is, not automatically
  deduplicated, and reconciled by the owner at billing time; identifiable
  human-wait spans (permission prompts, `ask_user` calls) are excluded
  best-effort, explicitly flagged as `coverage_incomplete` when the
  evidence is missing rather than silently assumed to be zero; totals are
  rounded **up** to the nearest 0.25 h per client per day, with exact vs.
  rounded time both kept for review.
- **Bilingual descriptions**: an installed instructions file asks the
  agent itself to submit one short German and one short English sentence
  describing what it did, via `copilot-worklog submit-summary`, granted
  only through a narrow `--allow-tool` pattern for that one command — never
  broad bypass — with a single automatic reminder if a run closes without
  one.
- **Reports**: CSV and Excel (`Worklog`, `Review`, `ReportInfo` sheets)
  exported on demand and on a daily scheduled task, formula-injection-safe,
  never the ledger's source of truth.
- Blog post deferred until after a real multi-week trial of this design.

## Alternatives Considered

- **Manual spreadsheet** — zero engineering cost, but exactly the
  unreliable-memory problem this ADR exists to solve; rejected as the
  status quo being replaced.
- **Cloud time-tracking SaaS with a Copilot integration** — would need
  client/project data to leave the machine for a service with its own
  retention and access model, for information that is itself
  billing-sensitive; rejected on privacy grounds for a single-user tool.
- **Direct concurrent SQLite writes from every hook process** — hooks run
  synchronously and must be fast and crash-proof; a lock-contention or
  corruption risk from many parallel agent hook processes writing directly
  felt like an unnecessary risk versus an immutable-file inbox with one
  serialized importer.
- **OS presence/idle detection to exclude "away from keyboard" time** —
  investigated and rejected: the owner explicitly wants "agent is running"
  to count as billable work, since much of the value of an agentic
  workflow is exactly that it keeps working unattended.
- **Broad `--allow-all` for the summary-submission command** — ruled out
  directly by this machine's enterprise policy, which fails closed on
  bypass-permission escalation; confirmed narrow `--allow-tool` grants work
  reliably instead.

## Consequences

### Positive

- Worklog entries are captured automatically from real Copilot CLI usage,
  removing the memory/reconstruction burden entirely for sessions that ran
  to a normal `agentStop`/`sessionEnd`.
- Bilingual descriptions are produced by the same agent that did the work,
  at the point where the context is freshest, rather than reconstructed
  later.
- Rounding and attribution rules are deterministic, auditable in the
  `Review` sheet, and correctable via an append-only log rather than silent
  edits.
- Nothing here depends on the cloud-agent product; this only touches CLI
  usage.

### Negative

- Overlapping-session double-counting and coverage-incomplete wait-time
  flags both require the owner's manual judgment at billing time; the tool
  intentionally does not attempt to auto-resolve either, since guessing
  wrong in either direction is worse than a flagged manual step.
- Several assumptions (permission/`ask_user` event names in the real
  transcript schema, `subagentStart`/`subagentStop` payload shape,
  `sessionStart.additionalContext` reliability) remain unverified pending
  further real-world observation; behavior in those cases degrades to an
  explicit `coverage_incomplete` flag rather than a wrong number.
- The tool is Windows- and this-machine-specific (enterprise policy
  interaction, `%LOCALAPPDATA%` layout) and is not intended to be portable
  to other consultants' environments without re-verifying the same
  assumptions.

## References

- `copilot-worklog` repo: `docs/milestone-1-compatibility-findings.md`,
  `docs/milestone-2-capture-ledger-findings.md`
- [GitHub Copilot CLI hooks documentation](https://docs.github.com/en/copilot/concepts/agents/hooks)
