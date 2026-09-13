# Architecture Decision Records

Decisions are recorded using the template and rules in the `adr` skill
(`.claude/skills/adr/`): ≤150 lines, ≤1 diagram, same section structure every time.

| # | Title | Status |
|---|---|---|
| [0001](0001-cv-photo-vs-ats-parsing.md) | Keep the photo in the CV, accept the ATS parsing trade-off | Accepted |
| [0002](0002-blog-in-same-repo-content-collections.md) | Add the blog to this repo using Astro Content Collections | Accepted |
| [0003](0003-trunk-based-branching-pr-only.md) | Trunk-based development, PR-only workflow | Accepted |
| [0004](0004-local-playwright-validation-before-pr.md) | Require a local full-pipeline build before opening a PR | Accepted |
| [0005](0005-caret-ranges-plus-lockfile-versioning.md) | Dependency versioning — caret ranges plus a committed lockfile | Accepted |
| [0006](0006-deploy-via-actions-deploy-pages.md) | Deploy via `actions/deploy-pages`, not a `gh-pages` branch | Accepted |
| [0007](0007-astro-over-docusaurus.md) | Astro over Docusaurus as the site framework | Accepted |
| [0008](0008-no-public-email-linkedin-github-contact.md) | No public email — LinkedIn and GitHub only for contact | Accepted |
| [0009](0009-claude-code-over-github-copilot-conventions.md) | Standardize AI-agent tooling on Claude Code conventions | Accepted |
| [0010](2026-09-13-git-worktrees-for-agent-isolation.md) | Git worktrees to isolate concurrent Claude Code agents in this repo | Proposed |
