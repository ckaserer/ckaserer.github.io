---
name: repo-stats
description: Collects and displays repository statistics for ckaserer.github.io — file counts, lines of content by section and language, documentation coverage, and Git activity. Use when asked for repo statistics, content overview, page counts, or a quick health snapshot.
lastReviewed: 2026-05-12
allowed-tools: ['powershell', 'view', 'ask_user']
owner: '@ckaserer'
---

# Repo Stats

Collects a structured overview of the website repository. Read-only — no files are created or modified.

## Collect Stats

Run from the repo root (or any worktree root):

```powershell
# Content files per section
$sections = @('docs/work-codex', 'docs/personal-os', 'docs/skyledger')
foreach ($s in $sections) {
    $files = Get-ChildItem $s -Recurse -Include '*.md','*.mdx' -ErrorAction SilentlyContinue
    $lines = $files | Get-Content | Measure-Object -Line
    [PSCustomObject]@{
        Section = Split-Path $s -Leaf
        Files   = $files.Count
        Lines   = $lines.Lines
    }
} | Format-Table -AutoSize

# Source files (TypeScript / CSS / config)
Get-ChildItem src,*.ts,*.json -Recurse -Include '*.ts','*.tsx','*.css','*.json' `
    -Exclude 'node_modules','build','.docusaurus' |
    Group-Object Extension |
    Select-Object Name, Count, @{n='Lines';e={($_.Group | Get-Content | Measure-Object -Line).Lines}} |
    Format-Table -AutoSize

# i18n translations
$i18nFiles = Get-ChildItem i18n -Recurse -Include '*.json','*.md','*.mdx' -ErrorAction SilentlyContinue
"i18n files: $($i18nFiles.Count)"

# ADRs
$adrs = Get-ChildItem docs/work-codex/adr -Filter '????-*.md' -ErrorAction SilentlyContinue |
    Where-Object { $_.BaseName -match '^\d{4}-' }
"ADRs: $($adrs.Count)"

# Skills and instructions
"Skills:       $((Get-ChildItem .github/skills -Filter 'SKILL.md' -Recurse -ErrorAction SilentlyContinue).Count)"
"Instructions: $((Get-ChildItem .github/instructions -Filter '*.instructions.md' -ErrorAction SilentlyContinue).Count)"
```

## Git Activity

```powershell
# Total commits on main
$commits = (git rev-list --count HEAD)
"Total commits: $commits"

# Unique contributors
$contributors = git log --pretty=format:'%ae' | Sort-Object -Unique
"Contributors: $($contributors.Count)"

# Repo age
$first  = [datetime](git log --pretty=format:'%ai' | Select-Object -Last 1)
$days   = ([datetime]::Now - $first).Days
"Repo age: $days days (since $($first.ToString('yyyy-MM-dd')))"

# Last commit
"Last commit: $(git log -1 --pretty=format:'%ai %s')"

# Top 5 most-changed files
git log --name-only --pretty=format: origin/main |
    Where-Object { $_ -match '\.(md|mdx|ts|json)$' } |
    Group-Object | Sort-Object Count -Descending |
    Select-Object -First 5 Name, Count |
    Format-Table -AutoSize

# Open branches
$branches = git branch -r | Where-Object { $_ -notmatch 'HEAD|gh-pages' }
"Remote branches: $($branches.Count)"
```

## What to Look For

After collecting, highlight any of the following if noteworthy:

- **Content imbalance** — sections with significantly fewer pages than others may indicate gaps
- **Large `.md` files** — very long pages are better split; Docusaurus renders them all at once
- **ADR coverage** — aim for at least one ADR per major structural decision (config, plugins, content strategy)
- **Stale branches** — many remote branches with no recent commits suggest unmerged work or forgotten experiments
- **i18n completeness** — if German translations exist for some sections but not others, flag it

## Output Format

Present results as a compact text table with section headers. If called from another skill or script, add `-AsJson` logic or pipe to `ConvertTo-Json` for machine-readable output.
