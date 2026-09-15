# Astro over Docusaurus as the site framework

- Status: Accepted
- Date: 2026-09-13
- Deciders: repo owner + Claude Code

## Context

The repo did not start as an Astro site. Commit `9e6b0d6` ("feat: replace
Docusaurus with Astro 5 personal landing page") replaced a Docusaurus 3
setup — per that commit's own description, a "knowledge-base" — with Astro.
Docusaurus is purpose-built for multi-page, versioned documentation sites: a
sidebar-driven doc tree, doc versioning, built-in search, MDX-heavy content
pages. The actual target here is, and always has been since that rewrite, a
single-page personal profile/CV (Hero → About → Experience → Skills →
CvDownload → Footer, later extended) plus generated PDF/OG assets — not a
multi-page documentation site.

## Decision

**Astro, not Docusaurus (or another docs-site generator).** Astro's
component-island model renders zero JS by default and imposes no
documentation-site information architecture — there's no sidebar, doc
versioning, or content-tree assumption to work around to get a fully custom,
single-page, animation-driven design. This has held up under later needs
too: the blog added in [2026-09-13: Blog in this repo via Content Collections](2026-09-13-blog-in-same-repo-content-collections.md)
was implemented with Astro's own Content Collections rather than requiring a
different tool.

## Alternatives Considered

- **Stay on Docusaurus** — built-in docs navigation, versioning, and search
  are useful for a knowledge base, but all of that is dead weight for a
  single-page profile; fighting a docs-site's default information
  architecture to produce a custom single-page layout is more friction than
  building it directly.
- **Plain static HTML, or Hugo/Jekyll** — plain HTML loses component reuse
  entirely (the site has a dozen reusable sections); Hugo/Jekyll templating
  is more friction than Astro components for the interactive,
  animation-heavy single-page design actually shipped.

## Consequences

### Positive

- Zero-JS-by-default components and first-class Markdown/content
  collections meant the later blog need
  ([2026-09-13: Blog in this repo via Content Collections](2026-09-13-blog-in-same-repo-content-collections.md)) was solved inside
  Astro itself, evidence the original choice generalizes further than "just
  a CV page."
- Static output deploys cleanly to GitHub Pages with no extra tooling.

### Negative

- Fewer built-in docs-specific features (versioning, doc search) than
  Docusaurus — not needed for this site's actual shape today, but would be
  missed if the site ever needed genuinely multi-page, docs-style content at
  scale, which would warrant revisiting this decision.
- The entire single-page composition, the `cv.json`-as-single-source-of-truth
  pattern, and the Playwright-driven PDF/OG generation all now exist
  downstream of this choice, assuming Astro's static-build-plus-component
  model.

## References

- Commit `9e6b0d6` — the original Docusaurus → Astro replacement
- [2026-09-13: Blog in this repo via Content Collections](2026-09-13-blog-in-same-repo-content-collections.md) — a later content
  need solved within Astro, not by switching tools again
