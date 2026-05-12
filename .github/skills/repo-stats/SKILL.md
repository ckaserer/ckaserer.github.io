---
name: repo-stats
description: Collects and displays repository statistics for ckaserer.dev — CV content size, component/page counts, build artifact sizes, and Git activity. Use when asked for repo statistics, CV breakdown, or a quick health snapshot.
lastReviewed: 2026-05-12
allowed-tools: ['powershell', 'view', 'ask_user']
owner: '@ckaserer'
---

# Repo Stats

Read-only snapshot of the website repository. No files are created or modified.

## Collect Stats

Run from the repo root (or any worktree root):

```powershell
# CV content breakdown (from cv.json)
$cv = Get-Content src\data\cv.json -Raw | ConvertFrom-Json
[PSCustomObject]@{
    Employers           = $cv.experience.Count
    Roles               = ($cv.experience.roles | Measure-Object).Count
    Highlights          = ($cv.experience.roles.highlights | Measure-Object).Count
    Certifications      = $cv.certifications.Count
    EducationEntries    = $cv.education.Count
    SkillsTotal         = ($cv.skills.PSObject.Properties.Value | ForEach-Object { $_.Count } | Measure-Object -Sum).Sum
    SummaryChars        = $cv.summary.Length
    TaglineChars        = $cv.tagline.Length
    MetaDescriptionChars= $cv.metaDescription.Length
} | Format-List

# Skill card balance
$cv.skills.PSObject.Properties | ForEach-Object {
    [PSCustomObject]@{ Card = $_.Name; Items = $_.Value.Count }
} | Format-Table -AutoSize

# Source files
Get-ChildItem src -Recurse -Include '*.astro','*.ts','*.json','*.css' |
    Group-Object Extension |
    Select-Object Name, Count, @{n='Lines';e={($_.Group | Get-Content | Measure-Object -Line).Lines}} |
    Format-Table -AutoSize

# Components and pages
"Components: $((Get-ChildItem src\components -Filter '*.astro').Count)"
"Pages:      $((Get-ChildItem src\pages -Recurse -Filter '*.astro').Count)"

# ADRs (if present)
$adrs = Get-ChildItem docs\adr -Filter '????-*.md' -ErrorAction SilentlyContinue |
    Where-Object { $_.BaseName -match '^\d{4}-' }
"ADRs: $($adrs.Count)"

# Skills and instructions
"Skills:       $((Get-ChildItem .github\skills -Filter 'SKILL.md' -Recurse -ErrorAction SilentlyContinue).Count)"
"Instructions: $((Get-ChildItem .github\instructions -Filter '*.instructions.md' -ErrorAction SilentlyContinue).Count)"
```

## Build Artifact Sizes

```powershell
if (Test-Path dist) {
    "dist/ HTML pages: $((Get-ChildItem dist -Recurse -Filter '*.html').Count)"
    "clemens-kaserer-cv.pdf: $([math]::Round((Get-Item dist\clemens-kaserer-cv.pdf).Length / 1KB, 1)) KB"
    "og-image.png:     $([math]::Round((Get-Item dist\og-image.png).Length / 1KB, 1)) KB"
    "Total dist size:  $([math]::Round(((Get-ChildItem dist -Recurse | Measure-Object -Property Length -Sum).Sum) / 1KB, 1)) KB"
} else {
    "Run 'npm run build:full' first to see artifact sizes."
}
```

## Privacy Guardrail

```powershell
# Must return zero matches — email is intentionally absent from the public site
if (Test-Path dist) {
    Get-ChildItem dist -Recurse -Include *.html, *.pdf |
        Select-String -Pattern 'clemens\.kaserer' -List
}
```

## Git Activity

```powershell
$commits = (git rev-list --count HEAD)
"Total commits: $commits"

$contributors = git log --pretty=format:'%ae' | Sort-Object -Unique
"Contributors: $($contributors.Count)"

$first = [datetime](git log --pretty=format:'%ai' | Select-Object -Last 1)
$days  = ([datetime]::Now - $first).Days
"Repo age: $days days (since $($first.ToString('yyyy-MM-dd')))"

"Last commit: $(git log -1 --pretty=format:'%ai %s')"

# Top 5 most-changed files
git log --name-only --pretty=format: |
    Where-Object { $_ -match '\.(astro|ts|json|md|mjs|css)$' } |
    Group-Object | Sort-Object Count -Descending |
    Select-Object -First 5 Name, Count |
    Format-Table -AutoSize

$branches = git branch -r | Where-Object { $_ -notmatch 'HEAD|gh-pages' }
"Remote branches: $($branches.Count)"
```

## What to Look For

After collecting, highlight any of the following if noteworthy:

- **Skill card imbalance** — cards with < 4 or > 10 items break the 5-card layout visually
- **Tagline > 160 chars** — too long for the hero one-liner
- **metaDescription > 160 chars** — Google truncates SERP descriptions
- **Email leak** — any match in §Privacy Guardrail is a release blocker
- **Stale branches** — many remote branches with no recent commits suggest unmerged work
- **`clemens-kaserer-cv.pdf` > ~250 KB** — likely an unintended image or font issue
- **ADR coverage** — at least one ADR per major structural decision (framework, deploy target, design system)

## Output Format

Present results as compact text tables with section headers. For machine-readable output, pipe individual queries to `ConvertTo-Json`.
