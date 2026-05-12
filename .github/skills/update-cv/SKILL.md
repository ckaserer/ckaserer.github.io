---
name: update-cv
description: Updates the CV content on ckaserer.dev by editing src/data/cv.json — the single source of truth for all CV sections. Use when asked to add, update, or remove experience entries, skills, certifications, or education; or to change the summary, tagline, or social handles.
lastReviewed: 2026-05-12
allowed-tools: ['view', 'edit', 'powershell', 'ask_user']
owner: '@ckaserer'
---

# Update CV

All CV content lives in **`src/data/cv.json`**. Editing this one file updates the homepage, the CV PDF, and the JSON-LD metadata simultaneously.

## Schema Reference (current)

```jsonc
{
  // Identity
  "name": "string",
  "initials": "string",          // 2 letters, shown in hero avatar
  "title": "string",             // one-line role under the name
  "tagline": "string",           // hero sub-heading — keep ≤ ~160 chars
  "metaDescription": "string",   // <meta name="description"> — keep ≤ 160 chars
  "location": "string",
  "website": "string",           // full URL incl. https://

  // Social handles (usernames only, NO URLs — components compose them)
  "github": "string",
  "linkedin": "string",

  // NOTE: there is intentionally NO "email" field.
  // Contact is LinkedIn first, GitHub second. Do not add a mailto anywhere.

  // About
  "summary": "string",           // ~400–500 chars; rendered as one paragraph

  // Experience — array of employers, each with one or more roles
  "experience": [
    {
      "company": "string",
      "url": "string | null",
      "roles": [
        {
          "title": "string",
          "start": "YYYY-MM",        // ISO year-month
          "end":   "YYYY-MM | null", // null = current
          "location": "string",
          "description": "string",   // 1–2 sentences
          "highlights": ["string"]   // 2–4 short bullets (~8–12 words each)
        }
      ]
    }
  ],

  // Skills — five fixed category keys, mapped to cards in Skills.astro
  "skills": {
    "azurePlatform": ["string"],   // Azure architecture & platform services
    "cloudNative":   ["string"],   // Kubernetes, OpenShift, runtimes
    "automation":    ["string"],   // IaC, CI/CD, scripting (Python/PowerShell/Bash)
    "ai":            ["string"],   // AI engineering practices, NOT model names
    "practices":     ["string"]    // Leadership, methodology, governance
  },

  // Certifications (sorted by year DESC; older renewable certs may stay at original year)
  "certifications": [
    {
      "name":   "string",
      "issuer": "string",
      "year":   number,            // year EARNED (verified via MS Learn share URL)
      "url":    "string"           // public credential share URL (omit for fundamentals)
    }
  ],

  // Education
  "education": [
    {
      "institution": "string",
      "degree":      "string",
      "start":       "string",     // free-form, often ""
      "end":         "string"      // free-form description, e.g. "Matura"
    }
  ]
}
```

## Workflow

### Step 1 — Read current state

```powershell
Get-Content src\data\cv.json -Raw | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

### Step 2 — Edit

Use the `edit` tool to make targeted changes. Common operations:

**Add a new role to an existing employer**
Find the correct `"company"` entry and prepend to its `"roles"` array (most recent first).

**Add a new employer**
Prepend a new object to the top-level `"experience"` array (most recent employer first).

**Add a certification**
Append to `"certifications"` and resort by `year` DESC. Verify the earned year by opening the MS Learn share URL with Playwright and reading "Earned on: …".

**Update a skill card**
Edit the relevant array under `"skills"`. Aim for ~5–9 entries per card so the 5-card layout stays balanced — sparse cards look broken.

**Update summary, tagline, or metaDescription**
Edit the top-level fields directly. Keep `tagline` ≤ ~160 chars and `metaDescription` ≤ 160 chars.

### Step 3 — Validate

```powershell
npm run build:full
```

This must complete without errors. Three things run:
1. `astro build` → `dist/` (TS + JSON shape errors surface here)
2. `node scripts/generate-og-image.mjs` → renders `/og` to `dist/og-image.png`
3. `node scripts/generate-cv-pdf.mjs` → renders `/cv` to `dist/clemens-kaserer-cv.pdf`

If it fails:
- `cv.json` must be valid JSON — check for trailing commas or unclosed strings
- `start`/`end` for roles must be `"YYYY-MM"` or `null`
- Skill keys must be exactly `azurePlatform`, `cloudNative`, `automation`, `ai`, `practices`
- Do not add new top-level fields without updating the components that read them

### Step 4 — Verify the PDF

```powershell
Start-Process .\dist\clemens-kaserer-cv.pdf
```

Sanity-check: name in header, all roles present, no orphan section breaks, no email anywhere.

### Step 5 — Email guardrail

```powershell
# Must return zero matches
Get-ChildItem dist -Recurse -Include *.html, *.pdf |
  Select-String -Pattern 'clemens\.kaserer' -List
```

If anything returns, you reintroduced an email — remove it before committing.

### Step 6 — Commit and open PR

Use the `worktree-workflow` skill. Suggested commit prefixes:

| Change | Commit prefix |
|--------|---------------|
| Pure content (text, dates, bullets) | `docs(cv): …` |
| Schema or component restructure with content | `refactor(cv): …` |
| New section or capability | `feat(cv): …` |

After the PR merges to `main`, GitHub Actions rebuilds and regenerates `clemens-kaserer-cv.pdf` and `og-image.png`.

## Things to Avoid

- Do NOT reintroduce an `email` field or `mailto:` link anywhere
- Do NOT hardcode dates as plain years for `experience` — always `"YYYY-MM"` or `null`
- Do NOT edit `src/components/*.astro` or `src/pages/cv.astro` for content-only changes
- Do NOT add a certification without verifying the **earned** year (renewals get new IDs; the original Earned date is what visitors see for the supplied share URL)
- Do NOT let a single skill card become tool-listy (e.g. only one named GitOps engine) — prefer the practice over the engine

## Cert year verification

Each `certifications[].url` is a public MS Learn share link. To verify the year:

```powershell
# Open in browser; the credential page shows "Earned on: <day> <Month> <year>"
Start-Process 'https://learn.microsoft.com/api/credentials/share/en-gb/ckaserer/<ID>?sharingId=55FE29056B9A8FEB'
```

The share URL redirects to a SPA — if scraping, render with Playwright and look for "Earned on:".
