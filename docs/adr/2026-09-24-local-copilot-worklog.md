# Automatic local consulting worklog for GitHub Copilot CLI sessions

- Status: Accepted
- Date: 2026-09-24
- Deciders: repo owner + Copilot CLI

## Context

As an independent consultant, the repo owner must report, per client, the
date, duration (billed in 0.25 h increments), and a short description of
work performed — increasingly done inside GitHub Copilot CLI sessions
across several parallel client repositories and folders. Reconstructing
this by hand from memory or shell history is unreliable and
time-consuming; some clients require the description in German, others in
English.

A first design required the owner to explicitly pre-register a
`cwd`-prefix → client mapping before working in a folder. In practice this
is exactly the kind of manual bookkeeping the tool exists to eliminate: the
owner works across many client folders and repos, often starting cold in a
new one, and does not want any prep step — mapping a client, editing a
config file, or remembering a session ID — before time starts being
tracked.

The Copilot CLI exposes user-level lifecycle hooks (`sessionStart`,
`userPromptSubmitted`, `agentStop`, `sessionEnd`, `permissionRequest`, and
others) that fire synchronously with structural JSON payloads (session ID,
timestamp, `cwd`, tool name) but never prompt or file content. Critically
for this design:

- `sessionStart` and `agentStop` command hooks can return
  `additionalContext` / a `{"decision": "block", "reason": ...}` output,
  which is injected into the model's own context or forces one more turn —
  confirmed against the official hooks reference and validated live against
  a real, installed Copilot CLI session (not just a synthetic test).
- `permissionRequest` command hooks can return `{"behavior": "allow"}` to
  pre-approve one specific tool call before the normal permission flow
  runs, also validated live.
- This machine enforces an enterprise policy that fails closed on broad
  permission bypass (`--allow-all`/`--allow-all-tools`); a `permissionRequest`
  hook scoped to one exact command is a machine-level mechanism, not a CLI
  flag, so it sidesteps that policy without ever requesting a broad grant.
- Hook delivery order does not match logical event order (must sequence by
  each event's own `timestamp`, not arrival order); real transcript
  timestamps appear as both epoch-ms integers and ISO 8601 strings.

## Decision

Build a small, private, local-only tool (`copilot-worklog`, a separate
repo) with **no manual setup step of any kind**, rather than a spreadsheet
the owner updates by hand, or a cloud service:

- **Capture**: a user-level Copilot CLI hook writes one immutable JSON file
  per lifecycle event into a private inbox (atomic temp-write + rename),
  under `%LOCALAPPDATA%\CopilotWorklog` — never inside a cloud-sync folder
  or a Git working tree, and never containing prompt/file content, only a
  strict field allowlist.
- **Ledger**: a single-writer SQLite database (guarded by a short-lived
  file lock) imports the inbox and *recomputes* `userPromptSubmitted` →
  `agentStop`/`sessionEnd` **runs** deterministically from the immutable
  event log on every import (fixing an earlier design's filename-order
  vs. event-order bug), rather than reducing events online in arrival
  order.
- **Client attribution is fully automatic, never manual**: each run's
  duration is split across the client(s) evidenced by the `cwd` of its own
  events, using two deterministic rules — the Git repository's name (via
  the shared `.git` common directory, so linked worktrees resolve
  correctly) if the path is inside a repo, otherwise the first folder
  segment under a personal workspace root. A run touching more than one
  client is split automatically between them (time attributed to whichever
  client's directory was most recently active) and flagged
  `attribution_estimated` for review — never silently blended, and never
  requiring the owner to decide a mapping in advance. A misattribution is
  corrected after the fact with an append-only `reassign` command; the
  original automatic inference is always kept for audit.
- **Zero-lookup summaries**: `sessionStart` tells the agent, via
  `additionalContext`, its own session ID and the exact
  `copilot-worklog submit-summary` command to run — the agent never needs
  to have "seen" or remembered a session ID. If a run closes with no
  summary yet, `agentStop` forces exactly one extra turn
  (`decision: block`) asking for it, self-limited per run so it can never
  loop. A `permissionRequest` hook pre-approves only that one exact command
  string (rejecting anything chained, redirected, or otherwise widened), so
  no interactive prompt or manually-typed `--allow-tool` flag is ever
  needed — this fully replaces the earlier design's dependency on a
  manually-granted narrow permission.
- **Timing model**: parallel top-level sessions count independently and
  additively (no presence/idle detection — a running agent counts as
  work); overlapping sessions are recorded as-is, not automatically
  deduplicated, and reconciled by the owner at billing time; identifiable
  human-wait spans (permission prompts, `ask_user` calls) are excluded
  best-effort, explicitly flagged as `coverage_incomplete` when the
  evidence is missing rather than silently assumed to be zero; totals are
  rounded **up** to the nearest 0.25 h per client per day, with exact vs.
  rounded time both kept for review.
- **Reports**: CSV and Excel (`Worklog`, `Review`, `ReportInfo` sheets)
  exported on demand and on a daily scheduled task, formula-injection-safe,
  never the ledger's source of truth.
- **Why SQLite, not "just a CSV"**: the CSV/Excel files are the
  human-facing interface, but the ledger needs an atomic, queryable,
  append-only store that many short-lived hook processes (including
  several parallel agents) can write to safely, that supports idempotent
  re-derivation of runs from raw events, and that keeps corrections
  separate from inferred data. SQLite gives all of that as a single
  invisible file with no server, no schema migration tooling, and no setup
  step for the owner — it is implementation detail, never something the
  owner interacts with directly.

## Alternatives Considered

- **Manual `cwd`-prefix → client mapping (the tool's own first design)** —
  rejected after live use: it reintroduced exactly the kind of prep work
  and per-client bookkeeping the tool exists to remove, and silently
  produced `Unassigned` for any folder the owner hadn't thought to map in
  advance.
- **Manual spreadsheet** — zero engineering cost, but exactly the
  unreliable-memory problem this ADR exists to solve; rejected as the
  status quo being replaced.
- **Cloud time-tracking SaaS with a Copilot integration** — would need
  client/project data to leave the machine for a service with its own
  retention and access model, for information that is itself
  billing-sensitive; rejected on privacy grounds for a single-user tool.
- **A CSV/Excel file as the sole store, no SQLite** — rejected: several
  parallel hook processes need to append safely and the ledger needs to
  re-derive runs deterministically from raw events (e.g. after fixing an
  ordering bug) without losing manual corrections; a flat file cannot do
  this atomically or query it efficiently, and does not stay invisible to
  the owner (edits would need to avoid corrupting formulas/formatting).
- **Direct concurrent SQLite writes from every hook process** — hooks run
  synchronously and must be fast and crash-proof; a lock-contention or
  corruption risk from many parallel agent hook processes writing directly
  felt like an unnecessary risk versus an immutable-file inbox with one
  serialized importer.
- **OS presence/idle detection to exclude "away from keyboard" time** —
  investigated and rejected: the owner explicitly wants "agent is running"
  to count as billable work, since much of the value of an agentic
  workflow is exactly that it keeps working unattended.
- **CLI-flag-based `--allow-tool` grants for the summary command** —
  works, but requires the owner (or an installed instructions file) to
  remember to pass it every session; replaced by a `permissionRequest`
  hook that pre-approves only the one exact command automatically, with no
  recurring manual step.

## Consequences

### Positive

- No setup step of any kind: point Copilot CLI at any folder or Git repo,
  and the client, date, and hours are tracked automatically from the first
  session.
- Worklog entries are captured automatically from real Copilot CLI usage,
  removing the memory/reconstruction burden entirely for sessions that ran
  to a normal `agentStop`/`sessionEnd`.
- Bilingual descriptions are produced by the same agent that did the work,
  at the point where the context is freshest, without the owner ever
  needing to supply a session ID or grant a permission by hand.
- Rounding and attribution rules are deterministic, auditable in the
  `Review` sheet, and correctable via an append-only log rather than silent
  edits; automatic multi-client splits within one run are visibly flagged,
  never silently blended.
- Nothing here depends on the cloud-agent product; this only touches CLI
  usage.

### Negative

- Overlapping-session double-counting and coverage-incomplete wait-time
  flags both require the owner's manual judgment at billing time; the tool
  intentionally does not attempt to auto-resolve either, since guessing
  wrong in either direction is worse than a flagged manual step.
- Automatic client attribution is a heuristic (Git repo name, or
  workspace-root folder name): a folder structure that doesn't match either
  rule falls back to `Unassigned`, requiring a manual `reassign` after the
  fact rather than getting the right answer up front.
- The tool is Windows- and this-machine-specific (enterprise policy
  interaction, `%LOCALAPPDATA%` layout, a fixed personal workspace root)
  and is not intended to be portable to other consultants' environments
  without re-verifying the same assumptions.

## References

- `copilot-worklog` repo: `docs/milestone-1-compatibility-findings.md`,
  `docs/milestone-2-capture-ledger-findings.md`
- [GitHub Copilot CLI hooks documentation](https://docs.github.com/en/copilot/concepts/agents/hooks)
