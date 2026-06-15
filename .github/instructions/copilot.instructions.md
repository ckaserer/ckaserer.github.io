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
- **Tailwind CSS 3** — utility-first styling; custom palette in `tailwind.config.mjs` (azure / navy / sky / canvas / surface / muted)
- **`src/data/cv.json`** — single source of truth for all CV content (summary, experience, skills, certifications, education, contact handles)
- **Playwright** — generates `clemens-kaserer-cv.pdf` and `og-image.png` from rendered Astro pages
- **GitHub Actions** — builds Astro, runs OG + PDF generation, uploads Pages artifact, deploys via `actions/deploy-pages` (no `gh-pages` branch)

**Site sections (single-page):** Hero → About (with "How I work with AI" band) → StatsBar → Experience → Skills → Education → Contact → CvDownload → Footer

**Key files:**
- `src/data/cv.json` — edit this to update any CV content
- `src/pages/index.astro` — main landing page (composes the section components)
- `src/pages/cv.astro` — single-column ATS-friendly page used by Playwright to generate `clemens-kaserer-cv.pdf` (`noindex`, excluded from sitemap). Browser view at `/cv` is identical to the downloaded PDF — do not add a sidebar or multi-column layout here.
- `src/pages/og.astro` — 1200×630 page used by Playwright to render `og-image.png` (`noindex`, excluded from sitemap)
- `src/components/` — Hero, About, StatsBar, Experience, Skills, Education, Contact, CvDownload, Footer, Seo
- `src/components/Seo.astro` — meta tags, Open Graph, Twitter card, Person + ContactPoint JSON-LD
- `scripts/generate-cv-pdf.mjs` — Playwright PDF generator (writes `dist/clemens-kaserer-cv.pdf`)
- `scripts/generate-og-image.mjs` — Playwright PNG snapshot (writes `public/og-image.png` AND `dist/og-image.png`)
- `astro.config.mjs` — sitemap config (filters out `/og` and `/cv`)
- `public/robots.txt` — disallows `/og` and `/cv`; points to `/sitemap-index.xml`
- `.github/workflows/deploy.yml` — push to `main` → build + OG + PDF + deploy
- `.github/workflows/ci.yml` — PR build validation (typecheck + build:full)

## NPM Scripts

| Script | What it does |
|--------|--------------|
| `npm run dev` | Astro dev server (http://localhost:4321) |
| `npm run build` | Astro static build → `dist/` |
| `npm run build:full` | `build` + OG image + CV PDF — full CI parity |
| `npm run typecheck` | `astro check` (TS + Astro diagnostics) |
| `npm run generate-og` | Run only the Playwright OG generator (build must have run) |
| `npm run generate-pdf` | Run only the Playwright PDF generator (build must have run) |

`npm run build:full` is the canonical local validation before opening a PR.

## Cross-Cutting Rules

- All work goes on short-lived branches — never commit directly to `main`
- Run `npm run build:full` locally before opening a PR — TypeScript errors, broken imports, OG render and PDF render all surface here
- CV content goes in `src/data/cv.json` only — never hardcode content into `.astro` components
- Email is **deliberately not on the site** — contact is LinkedIn first, GitHub second; do not reintroduce a `mailto:` anywhere (homepage, CV PDF, JSON-LD)
- Never hardcode secrets, API keys, or personal tokens
- Keep page titles and headings meaningful — the site has a sitemap and robots.txt for SEO
- `/og` and `/cv` must stay `noindex` and excluded from the sitemap
- **Living documentation rule:** When any task reveals new architectural decisions, conventions, or best practices (ATS compatibility, layout choices, tooling constraints), update the relevant `.github/skills/*.md` and `.github/instructions/*.md` files in the same commit. Skills and instructions are the institutional memory for this repo — keep them current.

## Skills (load on demand)

| Skill | When to invoke |
|-------|----------------|
| `update-cv` | Adding or updating CV content (experience, skills, certifications, education, summary, tagline) |
| `open-pull-request` | Drafting a PR description before merging to `main` |
| `worktree-workflow` | Creating a branch worktree, rebasing, opening a PR, or cleaning up after merge |
| `pipeline-debug` | Diagnosing a failed GitHub Actions deploy or PR-CI run |
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
- After changing components or data, run `npm run build:full` and verify both the homepage and `dist/cv.pdf` render correctly.

