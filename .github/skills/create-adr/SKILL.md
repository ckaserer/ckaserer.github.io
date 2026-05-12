---
name: create-adr
description: Creates Architecture Decision Records (ADRs) for ckaserer.dev — documenting significant decisions about Docusaurus configuration, plugins, themes, content structure, or site architecture. Use when asked to create, write, or draft an ADR, or when a significant design choice needs to be captured.
lastReviewed: 2026-05-12
allowed-tools: ['view', 'edit', 'create', 'glob', 'grep', 'task']
owner: '@ckaserer'
---

# ADR Creation Workflow

Follow these three phases in order.

## Phase 1 — Scope and Number

### 1a. Reserve a non-colliding ADR number

```powershell
git fetch origin --quiet

# Highest number already on main
$onMain = git ls-tree --name-only origin/main docs/work-codex/adr/ 2>$null |
  Select-String '^\d{4}' |
  ForEach-Object { [int]($_ -replace '^(\d{4}).*','$1') } |
  Measure-Object -Maximum | Select-Object -ExpandProperty Maximum

# Numbers claimed by open branches
$onBranches = git ls-remote --heads origin |
  Select-String 'adr-(\d{4})' -AllMatches |
  ForEach-Object { $_.Matches | ForEach-Object { [int]$_.Groups[1].Value } }

# Numbers claimed by open PRs
$onPrs = gh pr list --state open --json title,headRefName |
  ConvertFrom-Json |
  ForEach-Object { "$($_.title) $($_.headRefName)" } |
  Select-String 'adr-?(\d{4})' -AllMatches |
  ForEach-Object { $_.Matches | ForEach-Object { [int]$_.Groups[1].Value } }

$next = (@($onMain) + @($onBranches) + @($onPrs) | Measure-Object -Maximum).Maximum + 1
"Next free ADR number: $next"
```

If the `docs/work-codex/adr/` folder does not exist yet, it starts at `0001`.

### 1b. Decision scope

If the topic spans multiple independent decisions, list each as a separate ADR with sequential numbers and confirm with the user before proceeding.

## Phase 2 — Draft

**Where:** `docs/work-codex/adr/NNNN-title-with-hyphens.md`

**Template:**

```markdown
# ADR-NNNN: Title

**Date:** YYYY-MM-DD
**Status:** Proposed | Accepted | Superseded by [ADR-XXXX]

## Context

<What is the situation or problem that forces this decision? What constraints apply?>

## Decision

<What was decided? State it clearly in the first sentence.>

<Detail the chosen approach, configuration, or pattern.>

## Options Considered

| Option | Pros | Cons |
|--------|------|------|
| <Option A> | | |
| <Option B> | | |

## Consequences

<What becomes easier or harder as a result? What follow-up work does this create?>

## Links

- [Docusaurus docs / relevant reference](<url>)
```

**Fill every section** — no placeholders or empty sections in the committed file.

### Typical decision areas for this repo

| Area | Example decisions |
|------|-------------------|
| **Docusaurus config** | Upgrading to a new major version, enabling/disabling `future.v4` |
| **Plugins** | Adding `plugin-content-blog`, `plugin-search-local`, third-party plugins |
| **Themes** | Custom CSS approach, dark mode strategy, typography choices |
| **Content structure** | New top-level section, sidebar organization, cross-section linking strategy |
| **i18n** | Adding a new locale, translation workflow |
| **Search** | Staying with Algolia vs switching to local search |
| **CI/CD** | Changing the deploy action, adding link-checking step |

## Phase 3 — Polish and Register

1. Reread for logical flow and clarity
2. Add a Mermaid diagram if it genuinely clarifies the decision (optional)
3. Update or create `docs/work-codex/adr/index.md` with a one-line entry for the new ADR:

```markdown
| [ADR-NNNN](./NNNN-title.md) | Title | Accepted |
```

## Opening the PR

Use the `worktree-workflow` skill with this PR title override:

- **Title:** `docs(adr): add ADR-NNNN <short title>`
- **Summary:** one sentence on why this decision was needed now
- **What Changed:** new ADR file path only
- **Pages Affected:** `docs/work-codex/adr/NNNN-title.md`
