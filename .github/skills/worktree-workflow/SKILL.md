---
name: worktree-workflow
description: Git worktree mechanics for ckaserer.dev — creating a branch worktree from main, rebasing on origin/main, running the pre-PR verification checklist, invoking `gh pr create`, and post-merge cleanup. For the PR description content, use the `open-pull-request` skill.
lastReviewed: 2026-05-12
allowed-tools: ['powershell', 'view']
owner: '@ckaserer'
---

# Worktree Workflow

Trunk-based development. `main` is protected — PRs only. Each Copilot session owns exactly one worktree end-to-end, including cleanup.

Branch-naming and Conventional Commits rules live in `git.instructions.md` (always loaded). This skill covers the operational workflow.

## Starting a Task

Run from the **main checkout** (repo root, not a worktree):

```powershell
git fetch origin
git merge --ff-only origin/main

git worktree add -b <branch-name> .worktrees/<branch-name> origin/main
cd .worktrees/<branch-name>
```

Worktree directory mirrors the branch name with `/` replaced by `-`:
`feat/add-contact-section` → `.worktrees/feat-add-contact-section`

### Verify Location Before Editing

```powershell
git rev-parse --show-toplevel    # must end in /.worktrees/<branch-name>
git branch --show-current        # must NOT be main
```

If either check fails — STOP and create a worktree first.

## Install Dependencies

After creating the worktree, install dependencies (they are not shared between worktrees):

```powershell
npm ci
```

For changes that touch the OG image or CV PDF generators, also install the Playwright browser locally:

```powershell
npx playwright install chromium
```

## Making Changes

Edit files normally. After changes are complete, verify the full build before committing:

```powershell
npm run build:full   # build + OG image + CV PDF — full CI parity
```

Fix any failures before proceeding. Do not commit with a failing build.

If you changed `src/data/cv.json`, run the email guardrail:

```powershell
Get-ChildItem dist -Recurse -Include *.html, *.pdf |
  Select-String -Pattern 'clemens\.kaserer' -List
```

Must return zero matches.

## Keeping a Branch Fresh

```powershell
git fetch origin
git rebase origin/main
git push --force-with-lease
```

## Pre-PR Verification

Before calling `gh pr create`:

- [ ] `npm run build:full` passes (typecheck + build + OG + PDF)
- [ ] Email guardrail returns zero matches (if `cv.json` changed)
- [ ] `git status --porcelain` is empty (all changes committed)
- [ ] Branch is rebased on latest `origin/main`
- [ ] PR title follows `type(scope): description` (see `git.instructions.md`)
- [ ] `.github/instructions/` and `.github/skills/` updated if any conventions or patterns changed

## Opening the PR

```powershell
git push -u origin <branch-name>

$body = @'
## 📋 Summary
<one sentence>

## 🔍 What Changed
- <change 1>

## 📁 Files Touched
- `src/data/cv.json` — <what>
'@

gh pr create `
  --title "<type(scope): description>" `
  --body $body `
  --base main
```

For description content rules, see the `open-pull-request` skill.

## Cleanup After Merge

Run all checks from inside the worktree. If any fails — STOP and report; do not delete:

```powershell
# 1. PR is merged
gh pr view --json state --jq '.state'    # must be "MERGED"

# 2. Working tree clean
git status --porcelain                    # must be empty

# 3. No unpushed commits
git log origin/<branch-name>..HEAD --oneline    # must be empty
```

If all pass, from the **main checkout**:

```powershell
cd <repo-root>
git worktree remove .worktrees/<branch-name>
git fetch --prune
git branch -d <branch-name>    # safe delete; refuses unmerged branches
```

## Troubleshooting

**`npm ci` fails in worktree** — `node_modules/` and `package-lock.json` are not symlinked from the main checkout. Run `npm ci` again from the worktree root.

**Playwright fails locally with "Executable doesn't exist"** — run `npx playwright install chromium` inside the worktree.

**Build passes locally but fails in CI** — check the Node version. Both workflows use Node 20; verify locally with `node --version`. Astro 5 requires Node ≥ 18.18.

**Rebase conflict on `cv.json`** — resolve carefully (it is structured data, not prose). After resolving: `git add src/data/cv.json && git rebase --continue && npm run build:full` to confirm shape integrity.
