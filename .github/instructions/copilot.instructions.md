---
description: 'Repo-wide Copilot context: project summary, skills index, model strategy, and cross-cutting rules for ckaserer.dev'
applyTo: '**'
owner: '@ckaserer'
lastReviewed: 2026-05-12
---

# Repo-Wide Context

## Project Summary

**ckaserer.dev** is a personal landing page / CV site built with [Astro 5](https://astro.build/) and Tailwind CSS, deployed to [ckaserer.dev](https://ckaserer.dev) via GitHub Pages.

**Stack:**
- **Astro 5** — static site generator, zero JS by default, SEO-first
- **Tailwind CSS** — utility-first styling
- **`src/data/cv.json`** — single source of truth for all CV content (experience, skills, certifications, education)
- **GitHub Actions** — builds Astro, generates `cv.pdf` via Playwright, deploys `dist/` to `gh-pages`

**Site sections (single-page):** Hero → About → Experience → Skills → Download CV → Footer

**Key files:**
- `src/data/cv.json` — edit this to update any CV content
- `src/pages/index.astro` — main landing page
- `src/pages/cv.astro` — print-optimised page used by CI to generate the PDF
- `src/components/` — Hero, About, Experience, Skills, CvDownload, Footer, Seo
- `scripts/generate-cv-pdf.mjs` — Playwright PDF generator (runs in CI after build)
- `.github/workflows/deploy.yml` — build + PDF + GitHub Pages deploy

## Cross-Cutting Rules

- All work goes on short-lived branches — never commit directly to `main`
- Run `npm run build` locally before opening a PR — TypeScript errors and broken imports surface here
- CV content goes in `src/data/cv.json` only — never hardcode content into `.astro` components
- Never hardcode secrets, API keys, or personal tokens
- Keep page titles and headings meaningful — the site has a sitemap and robots.txt for SEO

## Skills (load on demand)

| Skill | When to invoke |
|-------|----------------|
| `update-cv` | Adding or updating CV content (experience, skills, certifications, education, contact info) |
| `open-pull-request` | Drafting a PR description before merging to `main` |
| `worktree-workflow` | Creating a branch worktree, rebasing, opening a PR, or cleaning up after merge |
| `pipeline-debug` | Diagnosing a failed GitHub Actions deploy run |
| `create-adr` | Documenting a significant architectural decision (framework, plugin, deployment, design) |
| `repo-stats` | Getting a snapshot of content coverage and Git activity |

## Model Strategy

- **Haiku (`task`/`explore`)** — mechanical work: `npm ci`, file discovery, `git status`, build passes
- **Main context (current model)** — design decisions, component structure, CV content authoring, PR reviews

## Working Style

- Lead with the answer; explain after.
- When the task is ambiguous, ask one focused clarifying question.
- Prefer simple over clever; don't over-engineer.
- `src/data/cv.json` is the user's primary data file — handle it with care and always validate after edits.
