# 0002. Add the blog to this repo using Astro Content Collections

- Status: Accepted
- Date: 2026-09-13
- Deciders: repo owner + Claude Code

## Context

The site is a single-page CV/portfolio. There is now a desire to publish
longer-form writing — starting with lessons learned facilitating technical
workshops, with more topics planned — under the same personal brand at
`ckaserer.dev`, hosted on GitHub Pages.

Two structurally different paths were available: add the blog as a new
section (`/blog`) inside this repo, alongside the existing single-page site;
or create a second repository dedicated to the blog, deployed separately
(its own GitHub Pages site with a subdomain like `blog.ckaserer.dev`, or a
different static host entirely), linked back to this one.

The site already has a defined design system (Tailwind `@theme` tokens for
the azure/navy/sky palette, `section-label`/`section-heading`/`pill`
component classes, Inter + JetBrains Mono fonts), a single GitHub Actions
deploy pipeline (`actions/deploy-pages`, no `gh-pages` branch), and a single
apex custom domain via `public/CNAME` (`ckaserer.dev`). Astro (already the
site's framework) has first-class support for Markdown-driven content via
its Content Layer API (`src/content.config.ts` + `astro:content`), purpose
built for exactly this kind of collection of dated posts.

## Decision

**Keep the blog in this repo**, as a new `/blog` route using Astro Content
Collections: `src/content.config.ts` defines a typed `blog` collection
(Markdown, glob loader); posts live under `src/content/blog/`;
`src/pages/blog/index.astro` and `src/pages/blog/[slug].astro` render them
through a shared `src/layouts/BlogPost.astro` layout, reusing the site's
existing design tokens. No new domain, subdomain, or deploy pipeline — blog
pages build and deploy through the existing `deploy.yml` workflow under the
same `ckaserer.dev` apex domain.

## Alternatives Considered

- **Separate repo, own subdomain** (e.g. `blog.ckaserer.dev`) — cleaner
  separation of concerns and an independent deploy cadence, but needs a
  second GitHub Actions pipeline, DNS/cert setup for a subdomain, and the
  design system duplicated or extracted into a shared package to stay
  visually consistent.
- **Separate repo, third-party blogging platform** — least setup effort,
  but not GitHub Pages or under full control of the custom domain, and
  content would live outside the version control used everywhere else.

## Consequences

### Positive

- Adding a post is: drop a Markdown file in `src/content/blog/`, run
  `npm run build:full`, open a PR — no new tooling to learn.
- The existing `worktree-workflow` skill, `.claude/rules/git.md`'s branch
  convention, and Conventional Commits apply to blog changes exactly as they
  do to CV changes.
- The sticky nav, previously duplicated between the homepage's desktop and
  mobile markup, was extracted into a single shared `src/components/Nav.astro`
  as part of this change — future nav changes only need to happen once.

### Negative

- The repo now serves two concerns (CV + blog) instead of one; a very high
  posting cadence would eventually make its history noisier.
- If posting volume grows enough to outweigh the CV content, splitting the
  blog into its own repo later means extracting `src/content/blog/`,
  `BlogPost.astro`, and the `.prose` theme block — not blocked by this
  decision, but not free either.

## References

- `src/content.config.ts` — collection schema
- `src/layouts/BlogPost.astro`, `src/pages/blog/index.astro`,
  `src/pages/blog/[slug].astro` — implementation
- [Astro Content Collections docs](https://docs.astro.build/en/guides/content-collections/)
