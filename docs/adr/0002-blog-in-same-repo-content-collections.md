# ADR-0002: Add the blog to this repo using Astro Content Collections

**Date:** 2026-09-13
**Status:** Accepted

## Context

The site is a single-page CV/portfolio. There is now a desire to publish
longer-form writing — starting with lessons learned facilitating technical
workshops, with more topics planned — under the same personal brand at
`ckaserer.dev`, hosted on GitHub Pages.

Two structurally different paths were available:

1. Add the blog as a new section (`/blog`) inside this repo, alongside the
   existing single-page site.
2. Create a second repository dedicated to the blog, deployed separately
   (either its own GitHub Pages user/project site with a subdomain like
   `blog.ckaserer.dev`, or a different static host entirely), and link the two
   together.

The site already has a defined design system (Tailwind `@theme` tokens for
the azure/navy/sky palette, `section-label`/`section-heading`/`pill`
component classes, Inter + JetBrains Mono fonts), a single GitHub Actions
deploy pipeline (`actions/deploy-pages`, no `gh-pages` branch), and a single
apex custom domain via `public/CNAME` (`ckaserer.dev`). Astro (already the
site's framework) has first-class support for Markdown-driven content via its
Content Layer API (`src/content.config.ts` + `astro:content`), which is
purpose-built for exactly this kind of collection of dated posts.

## Decision

**Keep the blog in this repo**, as a new `/blog` route using Astro Content
Collections:

- `src/content.config.ts` defines a `blog` collection (Markdown, glob loader)
  with a typed frontmatter schema: `title`, `description`, `pubDate`,
  `updatedDate?`, `tags`, `draft`.
- Posts live as Markdown files under `src/content/blog/`.
- `src/pages/blog/index.astro` lists posts; `src/pages/blog/[slug].astro`
  renders one via a shared `src/layouts/BlogPost.astro` layout.
- The site's existing design tokens and component classes (`section-label`,
  `section-heading`, `pill`) are reused directly; `@tailwindcss/typography`
  is added and re-themed via `.prose` CSS variable overrides in
  `src/styles/global.css` so post bodies (arbitrary Markdown) match the same
  palette instead of using the plugin's unstyled defaults.
- The sticky nav (previously inline, duplicated between the homepage's
  desktop/mobile markup) was extracted into `src/components/Nav.astro`,
  parameterised by `current: 'home' | 'blog'`, so both the homepage and blog
  pages share one nav implementation instead of drifting copies.
- No new domain, subdomain, or deploy pipeline: blog pages build and deploy
  through the existing `deploy.yml` workflow and ship under the same
  `ckaserer.dev` apex domain.

## Options Considered

| Option | Pros | Cons |
|--------|------|------|
| Blog inside this repo, Astro Content Collections (chosen) | Reuses the existing design system, fonts, and deploy pipeline exactly as-is; one domain, no DNS/cert work; Astro's content layer is built for this; trivial cross-linking between CV and posts | Repo now serves two concerns (CV + blog) instead of one; a very high posting cadence would eventually make this repo's history noisier |
| Separate repo, own subdomain (e.g. `blog.ckaserer.dev`) | Clean separation of concerns; independent deploy cadence; could use a different tool without affecting the CV site | Second GitHub Actions pipeline and Pages config to maintain; DNS + cert setup for a subdomain; design system (colors, fonts, component patterns) must be duplicated or extracted into a shared package to stay visually consistent; cross-linking crosses an origin boundary |
| Separate repo, third-party blogging platform (e.g. a hosted blog product) | Least setup effort | Not GitHub Pages / not under full control of the custom domain the way the rest of the presence is; content lives outside version control the user already uses everywhere else |

## Consequences

- Adding a post is: drop a Markdown file in `src/content/blog/`, run
  `npm run build:full`, open a PR — no new tooling to learn.
- `.claude/skills/worktree-workflow` and `.claude/rules/git.md`'s
  `feat/*` branch convention and Conventional Commits format apply to blog
  changes exactly as they do to CV changes; no new workflow needed.
- If posting volume grows enough that the blog meaningfully outweighs the CV
  content, or a genuinely different design/deploy cadence is wanted later,
  the migration path is to extract `src/content/blog/`, `BlogPost.astro`,
  and the `.prose` theme block into a new repo — nothing here architecturally
  blocks that split later; it just isn't justified yet.
- The nav is now a single shared component (`Nav.astro`) instead of two
  copies — future nav changes (e.g. adding a link) only need to happen once.

## Links

- `src/content.config.ts` — collection schema
- `src/layouts/BlogPost.astro`, `src/pages/blog/index.astro`,
  `src/pages/blog/[slug].astro` — implementation
- [Astro Content Collections docs](https://docs.astro.build/en/guides/content-collections/)
