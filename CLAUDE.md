# ckaserer.dev — Project Instructions

**ckaserer.dev** is a personal landing page / CV site built with [Astro 7](https://astro.build/) and Tailwind CSS 4, deployed to [ckaserer.dev](https://ckaserer.dev) via GitHub Pages. Requires Node >=22.12.

## Stack

- **Astro 7** — static site generator, zero JS by default, SEO-first
- **Tailwind CSS 4** (via `@tailwindcss/vite`) — utility-first styling; custom palette lives in the `@theme` block in `src/styles/global.css` (azure / navy / sky / canvas / surface / muted) — there is no `tailwind.config.mjs` under v4
- **`@tailwindcss/typography`** — registered via `@plugin "@tailwindcss/typography";` in `global.css`; re-themed to the site palette via `.prose` CSS variable overrides in the same file (`@layer components`) — used for blog post bodies
- **`src/data/cv.json`** — single source of truth for all CV content (summary, experience, skills, certifications, education, contact handles, and the reusable `highlight` metric)
- **Astro Content Collections** (`src/content.config.ts`) — the `blog` collection; Markdown posts live under `src/content/blog/`. See `docs/adr/0002-blog-in-same-repo-content-collections.md` for why the blog lives in this repo instead of a separate one.
- **Playwright** — generates `clemens-kaserer-cv.pdf` and `og-image.png` from rendered Astro pages
- **GitHub Actions** — builds Astro, runs OG + PDF generation, uploads Pages artifact, deploys via `actions/deploy-pages` (no `gh-pages` branch)

**Site sections (single-page, `/`):** Hero → StatsBar → About (with "How I work with AI" band) → Experience → Skills → Education → Achievements → CvDownload → Contact → Footer

**Blog (`/blog`):** `blog/index.astro` lists posts newest-first; `blog/[slug].astro` renders one via `BlogPost.astro`. Both share `Nav.astro` with the homepage.

## Key Files

- `src/data/cv.json` — edit this to update any CV content. See the `update-cv` skill before touching it.
- `src/pages/index.astro` — main landing page (composes the section components)
- `src/pages/cv.astro` — single-column ATS-friendly page used by Playwright to generate `clemens-kaserer-cv.pdf` (`noindex`, excluded from sitemap). Browser view at `/cv` is identical to the downloaded PDF — do not add a sidebar or multi-column layout here. See `docs/adr/0001-cv-photo-vs-ats-parsing.md` before removing the photo or restructuring the header.
- `src/pages/og.astro` — 1200×630 page used by Playwright to render `og-image.png` (`noindex`, excluded from sitemap)
- `src/content.config.ts` — defines the `blog` content collection schema (`title`, `description`, `pubDate`, `updatedDate?`, `tags`, `draft`)
- `src/content/blog/*.md` — blog post source; add a post by dropping a new Markdown file here with frontmatter matching the schema above
- `src/layouts/BlogPost.astro` — shared layout for a single post (title, date, tags, `.prose` body)
- `src/pages/blog/index.astro`, `src/pages/blog/[slug].astro` — blog list and post routes
- `src/components/` — Hero, About, StatsBar, Experience, Skills, Education, Achievements, Contact, CvDownload, Footer, Seo, Nav
- `src/components/Nav.astro` — sticky nav shared by the homepage and blog pages; takes a `current: 'home' | 'blog'` prop to switch section links between same-page anchors and `/#anchor` cross-page links
- `src/components/Seo.astro` — meta tags, Open Graph, Twitter card, Person + ContactPoint JSON-LD
- `scripts/generate-cv-pdf.mjs` — Playwright PDF generator (writes `dist/clemens-kaserer-cv.pdf`)
- `scripts/generate-og-image.mjs` — Playwright PNG snapshot (writes `public/og-image.png` AND `dist/og-image.png`)
- `astro.config.mjs` — Tailwind Vite plugin, sitemap config (filters out `/og` and `/cv`)
- `public/robots.txt` — disallows `/og` and `/cv`; points to `/sitemap-index.xml`
- `docs/adr/` — Architecture Decision Records; see the `create-adr` skill
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

- All work goes on short-lived branches — never commit directly to `main`. Git branch naming, commit format, and forbidden actions live in `.claude/rules/git.md`.
- Run `npm run build:full` locally before opening a PR — TypeScript errors, broken imports, OG render and PDF render all surface here
- CV content goes in `src/data/cv.json` only — never hardcode content into `.astro` components. A single fact (e.g. the delivery-speed claim) belongs in exactly one field (`cv.highlight`); if a component needs it, read it from there instead of writing a second copy — a past drift across four hardcoded copies of the same figure is the reason this rule is spelled out
- Email is **deliberately not on the site** — contact is LinkedIn first, GitHub second; do not reintroduce a `mailto:` anywhere (homepage, CV PDF, JSON-LD)
- Never hardcode secrets, API keys, or personal tokens
- Keep page titles and headings meaningful — the site has a sitemap and robots.txt for SEO
- `/og` and `/cv` must stay `noindex` and excluded from the sitemap
- **Living documentation rule:** when any task reveals new architectural decisions, conventions, or best practices (ATS compatibility, layout choices, tooling constraints), update the relevant `.claude/skills/*.md`, `.claude/rules/*.md`, or this file in the same commit — they are the institutional memory for this repo

## Skills (load on demand)

| Skill | When to invoke |
|-------|----------------|
| `/update-cv` | Adding or updating CV content (experience, skills, certifications, education, summary, tagline, headline metric) |
| `/open-pull-request` | Drafting a PR description before merging to `main` |
| `/worktree-workflow` | Creating a branch worktree, rebasing, opening a PR, or cleaning up after merge |
| `/pipeline-debug` | Diagnosing a failed GitHub Actions deploy or PR-CI run |
| `/create-adr` | Documenting a significant architectural decision (framework, plugin, deployment, design) |
| `/repo-stats` | Getting a snapshot of content coverage and Git activity |

## Working Style

- Lead with the answer; explain after.
- When the task is ambiguous, ask one focused clarifying question.
- Prefer simple over clever; don't over-engineer.
- `src/data/cv.json` is the user's primary data file — handle it with care and always validate after edits.
- After changing components or data, run `npm run build:full` and take a Playwright screenshot of the affected page (see `update-cv`'s Step 4) — Claude Code can't open a browser or PDF viewer directly, so a screenshot is the only real visual check available.
- For read-only repo surveys (finding where something is defined, counting occurrences) prefer a fast, targeted search over reading whole files; the `repo-stats` skill already covers the common "give me a snapshot" case.
