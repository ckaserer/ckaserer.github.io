---
name: pipeline-debug
description: Diagnoses GitHub Actions failures (deploy on push to main, or PR build validation) for ckaserer.dev — fetches the failing step, classifies the error type, and recommends a targeted fix. Use when a workflow fails. Never executes remediation.
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

## Workflows

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `.github/workflows/ci.yml` | `pull_request` to `main` | Validate the build (typecheck + `build:full`) |
| `.github/workflows/deploy.yml` | `push` to `main`, `workflow_dispatch` | Build + OG image + CV PDF + deploy `dist/` to `gh-pages` |

Both workflows share these steps in order:

1. `actions/checkout@v4`
2. `actions/setup-node@v4` — Node 20, npm cache
3. `npm ci` — install dependencies
4. (deploy only) Cache Playwright browsers
5. `npx playwright install --with-deps chromium`
6. `npm run typecheck` (CI) / `npm run build` (deploy)
7. `node scripts/generate-og-image.mjs` (deploy) — needs `dist/`
8. `node scripts/generate-cv-pdf.mjs` (deploy) — needs `dist/`
9. (deploy only) `peaceiris/actions-gh-pages@v4` → push `./dist` to `gh-pages`

## Step 1 — Identify the Failing Step

```powershell
gh run view <run-id> --log-failed
```

Or open the run URL in the browser and expand the failing step.

## Step 2 — Classify the Error

| Class | Signature in log | Section |
|-------|------------------|---------|
| **npm ci failure** | `npm error` / `ERESOLVE` / lock file mismatch | §npm Errors |
| **Astro / TypeScript error** | `error TS` / `[ERROR] [astro]` / `Cannot find module` | §Astro & TS Errors |
| **JSON shape error** | `Unexpected token` while reading `cv.json` / null reference | §cv.json Errors |
| **Playwright browser missing** | `browserType.launch: Executable doesn't exist` | §Playwright Errors |
| **OG / PDF generation** | `Timeout` / `net::ERR_CONNECTION_REFUSED` from generator scripts | §OG & PDF Errors |
| **Pages deploy failure** | `Error: Action failed with "not found"` from `peaceiris/actions-gh-pages` | §Deploy Errors |
| **Permissions** | `Permission denied` / `fatal: could not read Username` | §Permissions |

## §npm Errors

| Pattern | Cause | Fix |
|---------|-------|-----|
| `npm error ENOTFOUND` | Network issue fetching registry | Re-run the workflow; transient |
| `npm error ERESOLVE` | Peer dependency conflict | `npm install` locally, commit updated `package-lock.json` |
| `npm error Cannot find module` | `package-lock.json` out of sync | `npm install` locally, commit updated lock |
| Lock file not committed | `npm ci` requires committed lock | Commit `package-lock.json` |

## §Astro & TS Errors

```powershell
# Reproduce locally
npm run typecheck
npm run build
```

| Pattern | Cause | Fix |
|---------|-------|-----|
| `Cannot find module '../data/cv.json'` | File moved/deleted | Restore path or update import |
| `Property '<x>' does not exist on type` | New field referenced from a component, missing in `cv.json` (or vice versa) | Either add the field to `cv.json` or remove the reference |
| `[ERROR] [astro]` with file:line | Astro template syntax error | Open the offending `.astro` file at that line |

## §cv.json Errors

| Pattern | Cause | Fix |
|---------|-------|-----|
| `Unexpected token } in JSON` | Trailing comma or stray character | Run `Get-Content cv.json -Raw \| ConvertFrom-Json` to locate |
| `Cannot read properties of null` while rendering Experience | A role has missing `start` or malformed `end` | Set `end` to `"YYYY-MM"` or `null`, never `""` |
| Missing skill card on rendered page | Skill key renamed without updating `Skills.astro` | Use exactly: `azurePlatform`, `cloudNative`, `automation`, `ai`, `practices` |

## §Playwright Errors

| Pattern | Cause | Fix |
|---------|-------|-----|
| `browserType.launch: Executable doesn't exist` | Playwright browser not installed in CI | Verify `npx playwright install --with-deps chromium` step ran before the generator scripts |
| `playwright/.cache` cache miss every run | No browser cache step | Add `actions/cache` keyed on the Playwright version (already wired in `deploy.yml`) |
| Local pass, CI fail with chromium errors | Linux missing system libs | `--with-deps` flag installs them; ensure it's not stripped |

## §OG & PDF Errors

The generators spin up a static server against `dist/` then drive Chromium against `localhost:4174` / `4175`.

| Pattern | Cause | Fix |
|---------|-------|-----|
| `net::ERR_CONNECTION_REFUSED` | Static server didn't start (build failed) | Fix the build first; `dist/` must exist |
| `TimeoutError: page.goto` | `/cv` or `/og` route missing or 500-ing | Verify `src/pages/cv.astro` and `src/pages/og.astro` build correctly |
| PDF generated but blank | Page CSS uses fonts that didn't load before snapshot | Generators wait for `networkidle`; if changed, restore that wait |
| `cv.pdf` contains an email | Email reintroduced in `cv.json` or `cv.astro` | Remove; verify with `Select-String 'clemens\.kaserer' dist\cv.pdf` |

## §Deploy Errors (`peaceiris/actions-gh-pages`)

| Pattern | Cause | Fix |
|---------|-------|-----|
| `Action failed with "not found"` | `publish_dir: ./dist` doesn't exist — build step failed | Fix the build/generator step first |
| `gh-pages` force-push rejected | Branch protection on `gh-pages` | Remove protection on `gh-pages` (it is a deploy artifact branch) |
| CNAME missing after deploy | `cname:` removed from action config | Restore `cname: ckaserer.dev` in `deploy.yml` |
| Concurrency cancellation | Two pushes in-flight; one cancels the other | Expected behaviour with `concurrency: pages-deploy` group; the latest push wins |

## §Permissions

| Symptom | Fix |
|---------|-----|
| `Permission denied` on `gh-pages` push | Settings → Actions → General → "Workflow permissions" → "Read and write permissions" |
| `fatal: could not read Username` | Same as above — token lacks push access |

## Quick Local Reproduction

```powershell
# Full reproduction of what deploy CI does
npm ci
npx playwright install --with-deps chromium
npm run build:full
```

If this passes locally but fails in CI, the most common cause is a `package-lock.json` out of sync, or a Playwright version bump that invalidated the browser cache (re-run; the cache will repopulate).
