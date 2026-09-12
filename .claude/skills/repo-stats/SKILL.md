---
name: repo-stats
description: Collects and displays repository statistics for ckaserer.dev — CV content size, component/page counts, build artifact sizes, and Git activity. Use when asked for repo statistics, CV breakdown, or a quick health snapshot.
allowed-tools: Bash(git *) Bash(node *) Bash(find *) Bash(du *) Bash(grep *)
metadata:
  owner: '@ckaserer'
---

# Repo Stats

Read-only snapshot of the website repository. No files are created or modified.

## Collect Stats

Run from the repo root (or any worktree root):

```bash
# CV content breakdown (from cv.json)
node -e "
const cv = require('./src/data/cv.json');
console.log({
  Employers: cv.experience.length,
  Roles: cv.experience.reduce((n, e) => n + e.roles.length, 0),
  Highlights: cv.experience.reduce((n, e) => n + e.roles.reduce((m, r) => m + r.highlights.length, 0), 0),
  Certifications: cv.certifications.length,
  EducationEntries: cv.education.length,
  SkillsTotal: Object.values(cv.skills).reduce((n, arr) => n + arr.length, 0),
  SummaryChars: cv.summary.length,
  TaglineChars: cv.tagline.length,
  MetaDescriptionChars: cv.metaDescription.length,
});
"

# Skill card balance
node -e "
const cv = require('./src/data/cv.json');
for (const [card, items] of Object.entries(cv.skills)) console.log(card, items.length);
"

# Source files: count + total lines per extension
find src -type f \( -name '*.astro' -o -name '*.ts' -o -name '*.json' -o -name '*.css' \) \
  -exec sh -c 'printf "%s %s\n" "${1##*.}" "$(wc -l < "$1")"' _ {} \; | \
  awk '{ count[$1]++; total[$1]+=$2 } END { for (e in count) printf "%-6s files=%-4d lines=%d\n", e, count[e], total[e] }'

# Components and pages
echo "Components: $(find src/components -maxdepth 1 -name '*.astro' | wc -l)"
echo "Pages:      $(find src/pages -name '*.astro' | wc -l)"

# ADRs (if present)
echo "ADRs: $(find docs/adr -maxdepth 1 -regex '.*/[0-9]\{4\}-.*\.md' 2>/dev/null | wc -l)"

# Skills and rules
echo "Skills: $(find .claude/skills -name 'SKILL.md' 2>/dev/null | wc -l)"
echo "Rules:  $(find .claude/rules -name '*.md' 2>/dev/null | wc -l)"
```

## Build Artifact Sizes

```bash
if [ -d dist ]; then
  echo "dist/ HTML pages:       $(find dist -name '*.html' | wc -l)"
  echo "clemens-kaserer-cv.pdf: $(du -k dist/clemens-kaserer-cv.pdf 2>/dev/null | cut -f1) KB"
  echo "og-image.png:           $(du -k dist/og-image.png 2>/dev/null | cut -f1) KB"
  echo "Total dist size:        $(du -sk dist | cut -f1) KB"
else
  echo "Run 'npm run build:full' first to see artifact sizes."
fi
```

## Privacy Guardrail

```bash
# Must return zero matches — email is intentionally absent from the public site.
# Note: the PDF half of this check is weak (Playwright PDFs usually compress
# their text streams), so treat a clean PDF result as inconclusive, not proof.
if [ -d dist ]; then
  grep -r --include='*.html' --include='*.pdf' -l 'clemens\.kaserer' dist
fi
```

## Git Activity

```bash
echo "Total commits: $(git rev-list --count HEAD)"
echo "Contributors:  $(git log --pretty=format:'%ae' | sort -u | wc -l)"

first=$(git log --pretty=format:'%ai' | tail -1)
first_epoch=$(date -d "$first" +%s 2>/dev/null || date -j -f '%Y-%m-%d %H:%M:%S %z' "$first" +%s)
days=$(( ( $(date +%s) - first_epoch ) / 86400 ))
first_date=$(date -d "$first" +%Y-%m-%d 2>/dev/null || date -j -f '%Y-%m-%d %H:%M:%S %z' "$first" +%Y-%m-%d)
echo "Repo age: $days days (since $first_date)"

echo "Last commit: $(git log -1 --pretty=format:'%ai %s')"

# Top 5 most-changed files
echo "Most-changed files:"
git log --name-only --pretty=format: | grep -E '\.(astro|ts|json|md|mjs|css)$' | sort | uniq -c | sort -rn | head -5

echo "Remote branches: $(git branch -r | grep -vE 'HEAD|gh-pages' | wc -l)"
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
- **A single fact hardcoded in more than one `.astro` file** — the `cv.highlight` field exists precisely so figures like the delivery-speed claim have one source; grep for suspiciously specific numbers/percentages appearing in multiple components as a smell

## Output Format

Present results as compact text tables with section headers. For machine-readable output, have the `node -e` snippets above `JSON.stringify(...)` instead of `console.log(...)`.
