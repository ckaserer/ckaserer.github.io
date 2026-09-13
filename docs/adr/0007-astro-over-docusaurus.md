# ADR-0007: Astro over Docusaurus as the site framework

**Date:** 2026-09-13
**Status:** Accepted

## Context

The repo did not start as an Astro site. Commit `9e6b0d6`
("feat: replace Docusaurus with Astro 5 personal landing page") replaced a
Docusaurus 3 setup — per that commit's own description, a "knowledge-base"
— with Astro. Docusaurus is purpose-built for multi-page, versioned
documentation sites: a sidebar-driven doc tree, doc versioning, built-in
search, MDX-heavy content pages. The actual target here is, and always has
been since that rewrite, a single-page personal profile/CV (Hero → About →
Experience → Skills → CvDownload → Footer, later extended) plus generated
PDF/OG assets — not a multi-page documentation site.

## Decision

**Astro, not Docusaurus (or another docs-site generator).** Astro's
component-island model renders zero JS by default and imposes no
documentation-site information architecture — there's no sidebar, doc
versioning, or content-tree assumption to work around to get a fully custom,
single-page, animation-driven design. This has held up under later needs
too: the blog added in ADR-0002 was implemented with Astro's own Content
Collections rather than requiring a different tool.

## Options Considered

| Option | Pros | Cons |
|--------|------|------|
| Stay on Docusaurus | Built-in docs navigation, versioning, and search — useful if the site were a knowledge base | All of that is dead weight for a single-page profile; fighting a docs-site's default information architecture (sidebar nav, doc tree) to produce a custom single-page marketing/CV layout is more friction than building it directly |
| Astro (chosen) | Zero-JS-by-default components, full control over a custom single-page layout, first-class Markdown/content collections for the later blog need, static output that deploys cleanly to GitHub Pages | Fewer built-in docs-specific features (versioning, doc search) — not needed for this site's actual shape |
| Plain static HTML, or Hugo/Jekyll | Simplest possible (plain HTML) or mature templating ecosystem (Hugo/Jekyll) | Plain HTML loses component reuse entirely (the site has a dozen reusable sections); Hugo/Jekyll templating is more friction than Astro components for the interactive, animation-heavy single-page design actually shipped |

## Consequences

- The entire single-page composition, the `cv.json`-as-single-source-of-truth
  pattern, and the Playwright-driven PDF/OG generation all exist downstream
  of this choice — they assume Astro's static-build-plus-component model.
- If a future need reintroduces genuinely multi-page, docs-style content at
  scale, that would warrant revisiting this decision — but the blog need
  (ADR-0002) was successfully solved within Astro itself, which is evidence
  the original choice generalizes further than "just a CV page."

## Links

- Commit `9e6b0d6` — the original Docusaurus → Astro replacement
- `docs/adr/0002-blog-in-same-repo-content-collections.md` — a later content need solved within Astro, not by switching tools again
