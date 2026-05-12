---
name: open-pull-request
description: Drafts a GitHub PR description for ckaserer.github.io — inferring the Conventional Commits title from the branch name, populating the emoji-sectioned template, verifying the build passes. For the git/worktree mechanics, use the `worktree-workflow` skill.
lastReviewed: 2026-05-12
allowed-tools: ['powershell', 'view', 'grep', 'glob', 'edit']
owner: '@ckaserer'
---

# Open a Pull Request

Use the GitHub CLI (`gh pr create`) to open PRs against `main`. This skill covers description content only; the git mechanics live in `worktree-workflow`.

## Pre-PR Checklist

Run all of these before drafting the description:

```powershell
npm run build                          # must pass — broken links throw
git status --porcelain                 # must be empty (all changes committed)
git fetch origin
git rebase origin/main
git push --force-with-lease
```

If `npm run build` fails, fix the issue first — do **not** open a PR with a broken build.

## Description Template

```markdown
## 📋 Summary
<One sentence in imperative mood: what this PR does and why.>

## 🔍 What Changed
- <Key change 1>
- <Key change 2>

## 🌐 Pages Affected
<!-- List new/modified pages, or remove this section for config/CI-only changes -->
- `docs/<section>/<page>.md`
```

## Section Rules

- **📋 Summary** — one sentence, imperative mood. Becomes the squash commit message on `main`. Do not repeat the branch name verbatim.
- **🔍 What Changed** — bullet list; group by section (`work-codex`, `personal-os`, `skyledger`, `src`, `ci`) if many changes.
- **🌐 Pages Affected** — list added or substantially changed `.md` / `.mdx` files with their path from repo root. Remove the section entirely for config-only or CI-only changes.

## Copilot Drafting Rules

1. Read recent commits and staged diff to infer what changed.
2. Propose PR title in Conventional Commits format: `type(scope): description` (see `git.instructions.md`).
3. Populate the description template — no empty sections, no placeholder text in the final output.
4. If a GitHub issue number is known, append `Closes #<number>` to the Summary section.
5. Scan the diff for `.github/instructions/` and `.github/skills/` changes — if conventions changed but no instruction/skill file was updated, flag it before opening.

## Opening the PR

```powershell
$body = @'
## 📋 Summary
<summary>

## 🔍 What Changed
- <change>

## 🌐 Pages Affected
- `docs/<section>/<page>.md`
'@

gh pr create \
  --title "feat(work-codex): add ADR section" \
  --body $body \
  --base main
```

Do not open as draft unless explicitly asked — the site is static and the build already passed locally.
