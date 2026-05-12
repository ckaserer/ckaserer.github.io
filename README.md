# ckaserer.dev

Personal portfolio & CV site — built with [Astro 5](https://astro.build/) + Tailwind, deployed to GitHub Pages with an auto-generated PDF CV.

**Live:** [ckaserer.dev](https://ckaserer.dev) · **PDF:** [ckaserer.dev/clemens-kaserer-cv.pdf](https://ckaserer.dev/clemens-kaserer-cv.pdf)

## Stack
- **Astro 5** static site generator
- **Tailwind CSS** for styling
- **Playwright** to snapshot a print-optimised `/cv` page → `cv.pdf`, and render `/og` → `og-image.png`
- **GitHub Actions** builds, generates assets, deploys to `gh-pages`

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
| `npm run generate-pdf` | Snapshots `/cv` → `dist/cv.pdf` (with header/footer + page numbers) |
| `npm run build:full` | The full pipeline (build + og + pdf) |
| `npm run typecheck` | `astro check` |

## Deployment
Pushes to `main` trigger `.github/workflows/deploy.yml`, which runs the full pipeline and publishes `dist/` to `gh-pages` (with `cname: ckaserer.dev`).

## Project layout
```
src/
  components/    — Hero, About, Experience, Skills, Education, StatsBar, CvDownload, Footer, Seo
  data/cv.json   — single source of truth (CV content)
  layouts/Base.astro — shared <html>/<head>/<body> shell
  pages/
    index.astro  — landing page
    cv.astro     — print-optimised page used by Playwright to render the PDF
    og.astro     — 1200×630 social card snapshotted to /og-image.png
  styles/global.css
public/
  photo.jpg      — headshot
  og-image.png   — generated; do not edit by hand
scripts/
  generate-cv-pdf.mjs
  generate-og-image.mjs
```
