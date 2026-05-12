---
name: update-cv
description: Updates the CV content on ckaserer.dev by editing src/data/cv.json — the single source of truth for all CV sections. Use when asked to add, update, or remove experience entries, skills, certifications, or education; or to change contact details, the summary, or the tagline.
lastReviewed: 2026-05-12
allowed-tools: ['view', 'edit', 'powershell', 'ask_user']
owner: '@ckaserer'
---

# Update CV

All CV content lives in **`src/data/cv.json`**. Editing this one file updates the website and the generated PDF simultaneously.

## Schema Reference

```jsonc
{
  // Personal / contact
  "name": "string",
  "initials": "string",          // 2 letters, shown in hero avatar
  "title": "string",             // one-line role under the name
  "tagline": "string",           // hero sub-heading — 1–2 sentences
  "location": "string",
  "email": "string",
  "website": "string",
  "github": "string",            // username only, no URL
  "linkedin": "string",          // username only, no URL
  "twitter": "string",           // username only, no URL

  // About section
  "summary": "string",           // 2–4 sentences for the About section

  // Experience — array of employers, each with one or more roles
  "experience": [
    {
      "company": "string",
      "url": "string | null",
      "roles": [
        {
          "title": "string",
          "start": "YYYY-MM",    // ISO year-month
          "end": "YYYY-MM | null",  // null = current
          "location": "string",
          "description": "string",
          "highlights": ["string"]  // 2–5 bullet points
        }
      ]
    }
  ],

  // Skills — object with category arrays
  "skills": {
    "cloud":      ["string"],
    "iac":        ["string"],
    "containers": ["string"],
    "cicd":       ["string"],
    "languages":  ["string"],
    "practices":  ["string"]
  },

  // Certifications
  "certifications": [
    { "name": "string", "issuer": "string", "year": number }
  ],

  // Education
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "start": "YYYY",
      "end": "YYYY"
    }
  ]
}
```

## Workflow

### Step 1 — Read current state
```powershell
Get-Content src/data/cv.json | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

### Step 2 — Edit

Use the `edit` tool to make targeted changes to `src/data/cv.json`. Common operations:

**Add a new role to an existing employer:**
Find the correct `"company"` entry and append to its `"roles"` array.

**Add a new employer:**
Append a new object to the top-level `"experience"` array. Put most recent employer first.

**Add a certification:**
Append to `"certifications"`. Keep sorted by year descending.

**Update a skill category:**
Edit the relevant array under `"skills"`. Add new skills; remove outdated ones.

**Update contact or summary:**
Edit the top-level fields directly.

### Step 3 — Validate

```powershell
npm run build
```

This must complete without errors. If it fails:
- `src/data/cv.json` must be valid JSON — check for trailing commas or missing quotes
- All date strings must be `"YYYY-MM"` format or `null`
- No field in the schema may be removed (it will cause a TypeScript error or runtime null)

### Step 4 — Verify locally (optional but recommended)

```powershell
npm run dev
# Open http://localhost:4321 and check the site looks correct
```

### Step 5 — Commit and open PR

Use the `worktree-workflow` skill. Suggested commit message:

```
docs(cv): update <section> — <what changed>
```

Examples:
- `docs(cv): add Avanade Manager role from 2023`
- `docs(cv): add AZ-900 certification`
- `docs(cv): update skills — add FinOps, remove Ansible`

After the PR merges to `main`, GitHub Actions automatically rebuilds the site and regenerates `cv.pdf`.

## Things to Avoid

- Do NOT hardcode dates as plain years — always use `"YYYY-MM"` for `start`/`end` fields
- Do NOT leave any field as `null` unless the schema explicitly shows `| null` (e.g. `end` for current roles, `url` for employers without a website)
- Do NOT add extra fields not in the schema — the TypeScript build will fail
- Do NOT edit `src/pages/cv.astro` or `src/components/*.astro` for content-only changes — the JSON is the only place to change
