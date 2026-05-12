---
description: 'Repo-wide Copilot context: project summary, skills index, model strategy, and cross-cutting rules for ckaserer.dev'
applyTo: '**'
owner: '@ckaserer'
lastReviewed: 2026-05-12
---

# Repo-Wide Context

## Project Summary

**ckaserer.dev** is a personal website built with [Docusaurus 3](https://docusaurus.io/) (TypeScript), published to [ckaserer.dev](https://ckaserer.dev) via GitHub Pages. It has three content sections:

- **Work Codex** (`docs/work-codex/`) — professional frameworks, processes, and tooling
- **Personal OS** (`docs/personal-os/`) — personal productivity systems and workflows
- **Sky Ledger** (`docs/skyledger/`) — aviation logs and reflections

Deploy: push to `main` → GitHub Actions (`deploy.yml`) builds with `npm run build` → deploys to `gh-pages` branch → served at `ckaserer.dev`.

## Cross-Cutting Rules

- All work goes on short-lived branches (`feat/*`, `fix/*`, `docs/*`, `chore/*`) — never commit directly to `main`
- Run `npm run build` locally before opening a PR — Docusaurus throws on broken links (`onBrokenLinks: 'throw'`)
- Mermaid diagrams are supported — use standard ` ```mermaid ` fences (GitHub Markdown, **not** Azure DevOps `::: mermaid` blocks)
- Never hardcode secrets, API keys, or tokens in content or config
- Keep page titles and headings meaningful — Algolia search is live on the site
- i18n is enabled (`en` default, `de` locale) — add translations under `i18n/de/` when adding new UI strings

## Skills (load on demand)

When the active task matches one of these, invoke the skill instead of guessing:

| Skill | When to invoke |
|-------|----------------|
| `open-pull-request` | Drafting a PR description before merging to `main` |
| `worktree-workflow` | Creating a branch worktree, rebasing, opening a PR, or cleaning up after merge |
| `pipeline-debug` | Diagnosing a failed GitHub Actions deploy run |
| `create-adr` | Documenting a significant architectural or content-strategy decision |
| `repo-stats` | Getting a snapshot of content coverage, page counts, and Git activity |

## Model Strategy

- **Haiku (`task`/`explore`)** — mechanical work: `npm ci`, file discovery, `git status`, lint passes
- **Main context (current model)** — content authoring, Docusaurus config, design decisions, PR reviews

## Working Style

- Lead with the answer; explain after. Skip filler ("Certainly!", "Great question!").
- When the task is ambiguous, ask one focused clarifying question — don't assume.
- Prefer simple over clever; don't over-engineer.
- Notice nearby issues but don't expand scope without saying so.
