---
name: pipeline-debug
description: Diagnoses GitHub Actions deploy failures for ckaserer.github.io — fetches the failing step, classifies the error type, and recommends a targeted fix. Use when the deploy workflow fails. Never executes remediation.
lastReviewed: 2026-05-12
allowed-tools: ['powershell', 'view', 'grep', 'ask_user']
arguments:
  - name: run_url
    description: 'GitHub Actions run URL or run ID. Skill will ask if missing.'
  - name: error_snippet
    description: 'Error text from the Actions log, if already pasted. Optional — skill fetches it if absent.'
owner: '@ckaserer'
---

# Pipeline Debug

Read-only diagnosis only. Never push commits, merge PRs, or modify workflow files from this skill without explicit user confirmation.

## Workflow Overview

The deploy workflow (`.github/workflows/deploy.yml`) runs on push to `main` and on `workflow_dispatch`. Steps:

1. `actions/checkout@v4` — full clone (`fetch-depth: 0`)
2. `actions/setup-node@v4` — Node 20
3. `npm ci` — install dependencies from lock file
4. `npm run build` — Docusaurus build (output: `./build/`)
5. `peaceiris/actions-gh-pages@v4` — pushes `./build/` to the `gh-pages` branch

## Step 1 — Identify the Failing Step

Fetch the run from the GitHub CLI:

```powershell
gh run view <run-id> --log-failed
```

Or open the run URL directly in a browser and expand the failing step.

If the user has already pasted the error snippet, skip to Step 2.

## Step 2 — Classify the Error

| Class | Signature in log | Fix path |
|-------|-----------------|---------|
| **npm ci failure** | `npm error` / `ERESOLVE` / lock file mismatch | §npm Errors |
| **Docusaurus build error** | `Error: Docusaurus found broken anchors!` or `Error: Docusaurus found broken links` | §Broken Links |
| **TypeScript error** | `error TS` | §TypeScript Errors |
| **Checkout / permissions** | `Permission denied` / `fatal: could not read Username` | §Permissions |
| **Deploy action failure** | `Error: Action failed with "not found"` from `peaceiris/actions-gh-pages` | §Deploy Errors |
| **Mermaid / MDX parse error** | `SyntaxError` in `.md` or `.mdx` file | §Content Errors |

## §npm Errors

| Pattern | Cause | Fix |
|---------|-------|-----|
| `npm error ENOTFOUND` | Network issue fetching registry | Re-run the workflow; transient failure |
| `npm error ERESOLVE` | Peer dependency conflict | Run `npm install` locally, commit updated `package-lock.json` |
| `npm error Cannot find module` | `package-lock.json` out of sync with `package.json` | Run `npm ci` locally; if it fails too, run `npm install` and commit the updated lock |
| Lock file was not committed | `npm ci` requires a committed `package-lock.json` | Run `npm install` locally, commit `package-lock.json` |

## §Broken Links

Docusaurus uses `onBrokenLinks: 'throw'` — any broken internal link fails the build.

```powershell
# Reproduce locally
npm run build 2>&1 | Select-String "broken"
```

The error message includes the source file and the broken target. Common causes:

| Cause | Fix |
|-------|-----|
| Renamed or deleted page | Update all `[text](path)` references to the new path |
| Wrong relative path | Check the path is relative to the current file's location |
| Sidebar entry points to non-existent file | Update `sidebars*.ts` to match actual file paths |
| Cross-plugin link | Use the full route path (`/work-codex/...`), not a relative file path |

## §TypeScript Errors

```powershell
npm run typecheck    # runs tsc
```

Common causes: changed `docusaurus.config.ts` with an invalid type, modified a sidebar file with wrong structure. Fix locally and confirm `npm run build` passes before pushing.

## §Permissions

| Symptom | Fix |
|---------|-----|
| `Permission denied` on `gh-pages` push | Check that `GITHUB_TOKEN` has write permission for Pages. In repo Settings → Actions → General, set "Workflow permissions" to "Read and write permissions" |
| `fatal: could not read Username` | Same as above — the token lacks push access |

## §Deploy Errors (`peaceiris/actions-gh-pages`)

| Pattern | Cause | Fix |
|---------|-------|-----|
| `Error: Action failed with "not found"` | `publish_dir: ./build` doesn't exist — the build step failed | Fix the build step first (see §Broken Links / §TypeScript) |
| `gh-pages` branch force-push rejected | Branch protection on `gh-pages` | Remove branch protection from `gh-pages` in repo Settings |
| CNAME file missing after deploy | `cname:` not set in action config | Verify `cname: ckaserer.dev` is present in `deploy.yml` |

## §Content Errors (MDX / Mermaid)

| Symptom | Fix |
|---------|-----|
| `SyntaxError: Unexpected token` in `.mdx` | MDX v3 requires JSX-compliant syntax; escape `{`, `<`, `>` in prose, or use backtick fences |
| Mermaid diagram fails to render | Use standard ` ```mermaid ` fences — never Azure DevOps `::: mermaid` blocks |
| `YAML Exception` in front matter | Front matter must be valid YAML; check for unescaped `:` or `#` characters |

## Quick Local Reproduction

```powershell
# Full reproduction of what CI does
npm ci
npm run build
```

If this passes locally but fails in CI, the most common cause is a committed `package-lock.json` that differs from `package.json` (someone ran `npm install` without committing the lock file).
