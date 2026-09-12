---
name: pipeline-debug
description: Diagnoses GitHub Actions failures (deploy on push to main, or PR build validation) for ckaserer.dev — fetches the failing step, classifies the error type, and recommends a targeted fix. Use when a workflow fails. Never executes remediation.
argument-hint: "[run-url-or-id] [error-snippet]"
arguments: [run_url, error_snippet]
allowed-tools: Bash(gh *) Read Grep
metadata:
  owner: '@ckaserer'
---

# Pipeline Debug

Read-only diagnosis only. Never push commits, merge PRs, or modify workflow files from this skill without explicit user confirmation.

`$run_url` — GitHub Actions run URL or run ID. Ask if missing.
`$error_snippet` — error text from the Actions log, if already pasted. Optional — fetch it if absent.

## Workflows

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `.github/workflows/ci.yml` | `pull_request` to `main` | Validate the build (typecheck + `build:full`) |
| `.github/workflows/deploy.yml` | `push` to `main`, `workflow_dispatch` | Build + OG image + CV PDF, upload Pages artifact, deploy via `actions/deploy-pages` |

Both workflows share these steps in order:

1. `actions/checkout@v4`
2. `actions/setup-node@v4` — Node 22, npm cache
3. `npm ci` — install dependencies
4. (deploy only) Cache Playwright browsers
5. `npx playwright install --with-deps chromium`
6. `npm run typecheck` (CI) / `npm run build` (deploy)
7. `node scripts/generate-og-image.mjs` (deploy) — needs `dist/`
8. `node scripts/generate-cv-pdf.mjs` (deploy) — needs `dist/`
9. (deploy only) `actions/upload-pages-artifact@v3` (build job) → `actions/deploy-pages@v4` (deploy job, `github-pages` environment)

> Pages source: **GitHub Actions** (Settings → Pages). No `gh-pages` branch is used. CNAME is shipped via `public/CNAME`, which Astro copies to `dist/CNAME`.

## Step 1 — Identify the Failing Step

```bash
gh run view $run_url --log-failed
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
| **Pages deploy failure** | `Error: deployment_failed` from `actions/deploy-pages` | §Deploy Errors |
| **Permissions** | `Permission denied` / `fatal: could not read Username` | §Permissions |

## §npm Errors

| Pattern | Cause | Fix |
|---------|-------|-----|
| `npm error ENOTFOUND` | Network issue fetching registry | Re-run the workflow; transient |
| `npm error ERESOLVE` | Peer dependency conflict | `npm install` locally, commit updated `package-lock.json`. Check whether an integration package (e.g. `@astrojs/*`) has fallen behind a major-version bump of its peer (`astro`, `tailwindcss`) — the fix may be dropping that integration, not forcing the install |
| `npm error Cannot find module` | `package-lock.json` out of sync | `npm install` locally, commit updated lock |
| Lock file not committed | `npm ci` requires committed lock | Commit `package-lock.json` |
| `EBADENGINE` warning | Installed Node doesn't satisfy a package's `engines.node` | Usually non-fatal; check `package.json`'s own `engines.node` still matches what CI's `setup-node` installs |

## §Astro & TS Errors

```bash
# Reproduce locally
npm run typecheck
npm run build
```

| Pattern | Cause | Fix |
|---------|-------|-----|
| `Cannot find module '../data/cv.json'` | File moved/deleted | Restore path or update import |
| `Property '<x>' does not exist on type` | New field referenced from a component, missing in `cv.json` (or vice versa) | Either add the field to `cv.json` or remove the reference |
| `[ERROR] [astro]` with file:line | Astro template syntax error | Open the offending `.astro` file at that line |
| `astro check` prints "Packages cannot be installed automatically in CI" and exits 0 anyway | `@astrojs/check` / `typescript` missing from `devDependencies` — `npm run typecheck` was silently a no-op | `npm install --save-dev @astrojs/check typescript` and commit; this class of failure won't show as a red CI step, only as bugs that should have been caught by typecheck slipping through |

## §cv.json Errors

| Pattern | Cause | Fix |
|---------|-------|-----|
| `Unexpected token } in JSON` | Trailing comma or stray character | Read the file and check for it directly, or `node -e "JSON.parse(require('fs').readFileSync('src/data/cv.json'))"` to get the exact parse error |
| `Cannot read properties of null` while rendering Experience | A role has missing `start` or malformed `end` | Set `end` to `"YYYY-MM"` or `null`, never `""` |
| Missing skill card on rendered page | Skill key renamed without updating `Skills.astro` | Use exactly: `azurePlatform`, `cloudNative`, `automation`, `ai`, `practices` |

## §Playwright Errors

| Pattern | Cause | Fix |
|---------|-------|-----|
| `browserType.launch: Executable doesn't exist` | Playwright browser not installed in CI | Verify `npx playwright install --with-deps chromium` step ran before the generator scripts |
| `error while loading shared libraries: libatk-1.0.so.0` (or similar `.so` file) | Chromium binary downloaded but OS-level shared libraries are missing (common in a fresh sandbox/container that skipped `--with-deps`) | `sudo npx playwright install-deps chromium` — this needs sudo locally, unlike CI where the runner already has package-manager privileges |
| `Playwright does not support chromium on <platform>` | Pinned Playwright version predates support for a very new OS release | Bump `playwright` / `@playwright/browser-chromium` to latest — newer releases add support for newer platforms faster than this repo tends to notice |
| `playwright/.cache` cache miss every run | No browser cache step | Add `actions/cache` keyed on the Playwright version (already wired in `deploy.yml`) |
| Local pass, CI fail with chromium errors | Linux missing system libs | `--with-deps` flag installs them; ensure it's not stripped |

## §OG & PDF Errors

The generators spin up a static server against `dist/` then drive Chromium against `localhost:4174` / `4175`.

| Pattern | Cause | Fix |
|---------|-------|-----|
| `net::ERR_CONNECTION_REFUSED` | Static server didn't start (build failed) | Fix the build first; `dist/` must exist |
| `TimeoutError: page.goto` | `/cv` or `/og` route missing or 500-ing | Verify `src/pages/cv.astro` and `src/pages/og.astro` build correctly |
| PDF generated but blank | Page CSS uses fonts that didn't load before snapshot | Generators wait for `networkidle`; if changed, restore that wait |
| `clemens-kaserer-cv.pdf` contains an email | Email reintroduced in `cv.json` or `cv.astro` | Remove; verify with `grep -a 'clemens\.kaserer' dist/clemens-kaserer-cv.pdf` — note this grep is a weak check against a compressed PDF; don't treat a clean result as proof |

## §Deploy Errors (`actions/deploy-pages`)

| Pattern | Cause | Fix |
|---------|-------|-----|
| `Error: No artifact found` | `upload-pages-artifact` step failed or `dist/` missing | Fix the build/generator step first; ensure `path: ./dist` in the upload step |
| `HttpError: Not Found` on deploy | Pages source not set to "GitHub Actions" | Settings → Pages → Source = "GitHub Actions" |
| `id-token` permission error | Workflow missing `id-token: write` | Restore top-level `permissions:` block (`pages: write`, `id-token: write`) |
| CNAME missing after deploy | `public/CNAME` removed | Restore `public/CNAME` containing `ckaserer.dev`; Astro copies it into `dist/` |
| Concurrency cancellation | Two pushes in-flight | Expected with `concurrency: pages` group; the latest push wins (we use `cancel-in-progress: false` so deploys queue) |

## §Permissions

| Symptom | Fix |
|---------|-----|
| `id-token` / OIDC error | Workflow `permissions:` block must include `pages: write` and `id-token: write` |
| Environment protection blocks deploy | Settings → Environments → `github-pages` → adjust required reviewers / branch rules |
| `git push` rejected: "refusing to allow a Personal Access Token to create or update workflow" | The PAT lacks the `workflow` OAuth scope, needed for any commit touching `.github/workflows/*.yml`. This is a credential change — surface it to the user rather than working around it (e.g. `gh auth refresh -s workflow`) |

## Quick Local Reproduction

```bash
# Full reproduction of what deploy CI does
npm ci
npx playwright install --with-deps chromium   # or: sudo npx playwright install-deps chromium
npm run build:full
```

If this passes locally but fails in CI, the most common cause is a `package-lock.json` out of sync, or a Playwright version bump that invalidated the browser cache (re-run; the cache will repopulate).
