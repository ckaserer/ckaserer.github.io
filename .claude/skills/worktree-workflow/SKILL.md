---
name: worktree-workflow
description: Build/PR workflow for ckaserer.dev — installing deps in a worktree, running the pre-PR verification checklist, invoking `gh pr create`, and confirming cleanup. For the worktree mechanics themselves (create/verify/cleanup), use the `worktree-isolation` skill. For the PR description content, use the `open-pull-request` skill.
allowed-tools: Bash(git *) Bash(gh *) Bash(npm *) Bash(npx *)
metadata:
  owner: '@ckaserer'
---

# Worktree Workflow

Trunk-based development. `main` is protected — PRs only. Each session owns exactly one worktree end-to-end, including cleanup.

Branch-naming and Conventional Commits rules live in `.claude/rules/git.md` (always loaded). Worktree creation, verification, and cleanup mechanics live in the `worktree-isolation` skill — this skill covers what happens inside the worktree once it exists.

## Install Dependencies

After creating the worktree (see `worktree-isolation`), install dependencies (they are not shared between worktrees):

```bash
npm ci
```

For changes that touch the OG image or CV PDF generators, also install the Playwright browser locally:

```bash
npx playwright install chromium
```

## Making Changes

Edit files normally. After changes are complete, verify the full build before committing:

```bash
npm run build:full   # build + OG image + CV PDF — full CI parity
```

Fix any failures before proceeding. Do not commit with a failing build.

If you changed `src/data/cv.json`, run the email guardrail:

```bash
grep -r --include='*.html' --include='*.pdf' -l 'clemens\.kaserer' dist
```

Must return zero matches.

## Pre-PR Verification

Before calling `gh pr create`:

- [ ] `npm run build:full` passes (typecheck + build + OG + PDF)
- [ ] Email guardrail returns zero matches (if `cv.json` changed)
- [ ] `git status --porcelain` is empty (all changes committed)
- [ ] Branch is rebased on latest `origin/main` (see `worktree-isolation`)
- [ ] PR title follows `type(scope): description` (see `.claude/rules/git.md`)
- [ ] `CLAUDE.md`, `.claude/rules/`, and `.claude/skills/` updated if any conventions or patterns changed

## Opening the PR

```bash
git push -u origin <branch-name>
```

For the PR description content and `gh pr create` invocation, use the `open-pull-request` skill.

## Cleanup After Merge

See the `worktree-isolation` skill for the merged/clean checks and `git worktree remove` steps.

## Troubleshooting

**`npm ci` fails in worktree** — `node_modules/` and `package-lock.json` are not symlinked from the main checkout. Run `npm ci` again from the worktree root.

**Playwright fails locally with "Executable doesn't exist"** — run `npx playwright install chromium` inside the worktree. If Chromium downloads but fails to launch with a missing shared-library error, the OS packages are missing too — see the `pipeline-debug` skill's Playwright section.

**Build passes locally but fails in CI** — check the Node version. Both workflows use Node 22; verify locally with `node --version`. Astro 7 requires Node ≥ 22.12.

**Rebase conflict on `cv.json`** — resolve carefully (it is structured data, not prose). After resolving: `git add src/data/cv.json && git rebase --continue && npm run build:full` to confirm shape integrity.
