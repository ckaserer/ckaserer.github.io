# Any Decision Records

Decisions are recorded using the template and rules in the `adr` skill
(`.claude/skills/adr/`): ≤150 lines, ≤1 diagram, same section structure every time.

| # | Title | Status |
|---|---|---|
| [0001](2026-09-12-cv-photo-vs-ats-parsing.md) | Keep the photo in the CV, accept the ATS parsing trade-off | Accepted |
| [0002](2026-09-13-blog-in-same-repo-content-collections.md) | Add the blog to this repo using Astro Content Collections | Accepted |
| [0003](2026-09-13-trunk-based-branching-pr-only.md) | Trunk-based development, PR-only workflow | Accepted |
| [0004](2026-09-13-local-playwright-validation-before-pr.md) | Require a local full-pipeline build before opening a PR | Accepted |
| [0005](2026-09-13-caret-ranges-plus-lockfile-versioning.md) | Dependency versioning — caret ranges plus a committed lockfile | Accepted |
| [0006](2026-09-13-deploy-via-actions-deploy-pages.md) | Deploy via `actions/deploy-pages`, not a `gh-pages` branch | Accepted |
| [0007](2026-09-13-astro-over-docusaurus.md) | Astro over Docusaurus as the site framework | Accepted |
| [0008](2026-09-13-no-public-email-linkedin-github-contact.md) | No public email — LinkedIn and GitHub only for contact | Accepted |
| [0009](2026-09-13-claude-code-over-github-copilot-conventions.md) | Standardize AI-agent tooling on Claude Code conventions | Superseded by 0012 |
| [0010](2026-09-13-record-decisions-as-adrs.md) | Record decisions as ADRs | Accepted |
| [0011](2026-09-13-git-worktrees-for-agent-isolation.md) | Git worktrees to isolate concurrent Claude Code agents in this repo | Accepted |
| [0012](2026-09-14-github-copilot-compatibility.md) | Add lightweight GitHub Copilot compatibility alongside Claude Code instructions | Accepted |
