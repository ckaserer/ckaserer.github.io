---
name: create-adr
description: Creates Architecture Decision Records (ADRs) for ckaserer.dev — documenting significant decisions about Astro configuration, components, build pipeline, design system, deployment, or content strategy. Use when asked to create, write, or draft an ADR, or when a significant design choice needs to be captured.
allowed-tools: Read Write Edit Bash(git *) Bash(gh *) Glob Grep
metadata:
  owner: '@ckaserer'
---

# ADR Creation Workflow

ADRs live in `docs/adr/` (create the folder on the first ADR). The site itself is single-page and does **not** render `docs/` — ADRs are repo-only documentation.

Follow these three phases in order.

## Phase 1 — Scope and Number

### 1a. Reserve a non-colliding ADR number

An ADR can land on any branch, not just one named `adr-NNNN` — e.g. a blog
feature branch that also adds an ADR documenting that feature's own
architecture. Matching on branch-name or PR-title patterns misses those, so
scan the actual `docs/adr/` tree on every open remote branch directly:

```bash
git fetch origin --quiet

highest=$(
  for b in $(git ls-remote --heads origin | awk '{print $2}' | sed 's#refs/heads/##'); do
    git ls-tree --name-only "origin/$b" docs/adr/ 2>/dev/null
  done | grep -oE '[0-9]{4}' | sort -un | tail -1
)

next=$(( ${highest:-0} + 1 ))
printf 'Next free ADR number: %04d\n' "$next"
```

If `docs/adr/` does not exist yet, the first ADR is `0001`.

### 1b. Decision scope

If the topic spans multiple independent decisions, list each as a separate ADR with sequential numbers and confirm with the user before proceeding.

## Phase 2 — Draft

**Where:** `docs/adr/NNNN-title-with-hyphens.md`

**Template:**

```markdown
# ADR-NNNN: Title

**Date:** YYYY-MM-DD
**Status:** Proposed | Accepted | Superseded by [ADR-XXXX]

## Context

<What is the situation or problem that forces this decision? What constraints apply? What does the current state look like?>

## Decision

<What was decided? State it clearly in the first sentence.>

<Detail the chosen approach, configuration, or pattern.>

## Options Considered

| Option | Pros | Cons |
|--------|------|------|
| <Option A> | | |
| <Option B> | | |

## Consequences

<What becomes easier or harder as a result? What follow-up work does this create? What is the migration path if we ever reverse this?>

## Links

- [Reference doc](<url>)
```

**Fill every section** — no placeholders or empty sections in the committed file.

### Typical decision areas for this repo

| Area | Example decisions |
|------|-------------------|
| **Astro config** | Upgrading to a new major version, enabling integrations, image optimisation strategy |
| **Components & data** | Section composition (single-page vs routed), `cv.json` schema changes, design tokens in Tailwind |
| **Build pipeline** | Playwright-driven OG/PDF generation, Node version, caching strategy |
| **Deployment** | Staying on GitHub Pages vs moving to Cloudflare Pages / Azure Static Web Apps, custom domain setup |
| **SEO & metadata** | JSON-LD shape, sitemap exclusions, robots policy |
| **Privacy** | Contact strategy (e.g. dropping the public email), analytics opt-in |
| **AI tooling** | Skills and instructions structure, model strategy for Claude Code |
| **CV content trade-offs** | ATS-parseability vs visual/brand consistency (see ADR-0001) |

## Phase 3 — Polish and Register

1. Re-read for logical flow and clarity.
2. Add a short Mermaid diagram only if it genuinely clarifies the decision.
3. Update or create `docs/adr/index.md` with a one-line entry:

```markdown
| [ADR-NNNN](./NNNN-title.md) | Title | Accepted |
```

## Opening the PR

Use the `worktree-workflow` skill with this PR title override:

- **Title:** `docs(adr): add ADR-NNNN <short title>`
- **Summary:** one sentence on why this decision was needed now
- **What Changed:** new ADR file path; index update if applicable
