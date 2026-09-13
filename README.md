# ckaserer.dev

Personal portfolio & CV site — built with [Astro 7](https://astro.build/) + Tailwind CSS 4, deployed to GitHub Pages with an auto-generated PDF CV. Requires Node >=22.12.

**Live:** [ckaserer.dev](https://ckaserer.dev) · **Blog:** [ckaserer.dev/blog](https://ckaserer.dev/blog) · **PDF:** [ckaserer.dev/clemens-kaserer-cv.pdf](https://ckaserer.dev/clemens-kaserer-cv.pdf)

## Stack
- **Astro 7** static site generator
- **Tailwind CSS 4** (via `@tailwindcss/vite`) for styling — theme lives in `src/styles/global.css`; `@tailwindcss/typography` re-themed for blog post bodies
- **Astro Content Collections** (`src/content.config.ts`) for the blog — see `docs/adr/2026-09-13-blog-in-same-repo-content-collections.md`
- **Playwright** to snapshot a print-optimised `/cv` page → `cv.pdf`, and render `/og` → `og-image.png`
- **GitHub Actions** builds, generates assets, deploys via `actions/deploy-pages` (no `gh-pages` branch)

## Single source of truth
Everything CV-related lives in [`src/data/cv.json`](src/data/cv.json). Components and the print page read from it — never hardcode CV content into `.astro` files.

## Local development

```bash
npm ci
npm run dev          # http://localhost:4321
```

> ⚠️ The `Download CV` link 404s under `npm run dev` because `cv.pdf` is generated from the built site. Use `npm run build:full` to produce it locally.

## Build

```bash
npm run build        # static site only → dist/
npm run build:full   # build + og-image.png + cv.pdf
```

`build:full` requires Playwright's Chromium:

```bash
npx playwright install chromium
```

## Scripts
| Script | What it does |
|---|---|
| `npm run dev` | Astro dev server with HMR |
| `npm run build` | Static site → `dist/` |
| `npm run generate-og` | Snapshots `/og` → `public/og-image.png` and `dist/og-image.png` (1200×630) |
| `npm run generate-pdf` | Snapshots `/cv` → `dist/clemens-kaserer-cv.pdf` (no browser header/footer — page size and margins come from the page's own `@page` CSS) |
| `npm run build:full` | The full pipeline (build + og + pdf) |
| `npm run typecheck` | `astro check` |

## Deployment
Pushes to `main` trigger `.github/workflows/deploy.yml`, which runs the full pipeline and publishes `dist/` to GitHub Pages via `actions/deploy-pages` (no `gh-pages` branch; custom domain set via `public/CNAME`).

## Project layout
```
src/
  assets/photo.jpg — headshot, imported via astro:assets for optimized/responsive output
  components/    — Hero, StatsBar, About, Achievements, Experience, Skills, Education, CvDownload, Contact, Footer, Seo, Nav
  content.config.ts — blog collection schema (title, description, pubDate, updatedDate?, tags, draft)
  content/blog/*.md — blog post source (Markdown + frontmatter)
  data/cv.json   — single source of truth (CV content)
  layouts/
    Base.astro     — shared <html>/<head>/<body> shell
    BlogPost.astro — single-post layout (title, date, tags, .prose body)
  pages/
    index.astro  — landing page
    cv.astro     — print-optimised page used by Playwright to render the PDF
    og.astro     — 1200×630 social card snapshotted to /og-image.png
    blog/index.astro   — blog post list
    blog/[slug].astro  — single blog post
  styles/global.css
public/
  og-image.png   — generated; do not edit by hand
scripts/
  generate-cv-pdf.mjs
  generate-og-image.mjs
docs/adr/        — Any Decision Records
CLAUDE.md        — Claude Code project instructions
.claude/
  rules/git.md   — branch naming, commit format, forbidden actions
  skills/        — update-cv, worktree-workflow, open-pull-request, pipeline-debug, adr, repo-stats
```
