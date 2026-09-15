# Trunk-based development with squash merge

- Status: Accepted
- Date: 2026-09-15
- Deciders: repo owner + Claude Code

## Context

Supersedes [Trunk-based development, PR-only workflow](2026-09-13-trunk-based-branching-pr-only.md).
That ADR already decided one protected `main`, short-lived branches, and
PR-only merges — but never pinned down *how* a branch lands, and that gap
already produced a concrete drift: PR #37 (`fix/adr-remove-numbering`,
merged 2026-09-15) landed as a real two-parent merge commit instead of the
single-commit squash every earlier PR here used, visible in `git log
--pretty="%H %P"` on `main`'s tip. `gh api repos/ckaserer/ckaserer.github.io`
confirms why nothing caught it: `allow_merge_commit` and
`allow_rebase_merge` are both still `true` alongside `allow_squash_merge`,
so picking the wrong GitHub UI button, or a `gh pr merge` invocation
without `--squash`, silently works.

`main` deploys automatically on every push
(`.github/workflows/deploy.yml`), and this repo is now also a blog, not
just a CV — posts land through the same PR pipeline as code. Both cases
want the same thing the old ADR didn't specify: a `main` history that
reads as exactly one line per shipped change, reliable enough to bisect
a bad deploy back to its PR without guessing which commits on a merge
node actually mattered.

## Decision

This repo uses **trunk-based development with one protected `main`,
short-lived single-purpose branches, and GitHub's "Squash and merge" as
the only enabled merge method** — never a merge commit, never
rebase-and-merge. Every merged PR becomes exactly one commit on `main`,
matching what every PR here did until #37. GitHub repo settings
(`allow_squash_merge: true`, `allow_merge_commit: false`,
`allow_rebase_merge: false`, `delete_branch_on_merge: true`) enforce this
so the next PR can't repeat the same drift by accident — the old ADR's
worktree isolation and PR-only rules still apply unchanged, this just
closes the one thing they left open.

## Alternatives Considered

- **Merge commit** — what PR #37 actually did; rejected because it breaks
  the one-commit-per-shipped-change property `git bisect`/rollback depends
  on, and permanently adds a PR's intermediate commits (fixups, agent
  iteration) to `main`.
- **Rebase and merge** — linear history without a merge commit, but still
  preserves every intermediate commit, so it doesn't restore
  one-commit-per-change either; GitHub's own docs warn against continuing
  work on a branch after either a squash or rebase merge.
- **Long-lived feature branches / Git Flow** — already rejected in the
  superseded ADR, and reaffirmed by DORA's trunk-based-development research
  ([dora.dev/capabilities/trunk-based-development](https://dora.dev/capabilities/trunk-based-development/)):
  fewer active branches and shorter branch lifetimes correlate with higher
  delivery performance.

## Consequences

### Positive

- Restores a `main` history that's reliably one commit per shipped
  change — code or blog post — bisectable back to a specific PR.
- Closes the exact gap PR #37 exposed — GitHub settings, not memory,
  now stop a merge-commit or rebase-merge from landing.
- Matches DORA's small-batches guidance, which frames frequent, small,
  squashed integration as a safety net against the throughput/stability
  regressions DORA's 2024 report ties to AI-assisted development
  ([dora.dev/capabilities/working-in-small-batches](https://dora.dev/capabilities/working-in-small-batches/)) —
  directly relevant here since most PRs are Claude-Code-authored.

### Negative

- Per-commit granularity inside a PR is lost on `main` — only the squashed
  diff and PR description survive.
- Restricting the GitHub merge-method setting to squash-only removes the
  other two options entirely; reversible with one `gh api` call.
- Doesn't retroactively fix PR #37's merge commit already on `main` — this
  ADR only prevents a repeat.

## References

- PR [#37](https://github.com/ckaserer/ckaserer.github.io/pull/37) — the
  merge-commit drift that prompted this ADR
- [DORA: Trunk-based development](https://dora.dev/capabilities/trunk-based-development/)
- [DORA: Working in small batches](https://dora.dev/capabilities/working-in-small-batches/)
- [DORA 2024 Accelerate State of DevOps Report](https://dora.dev/research/2024/dora-report/)
- [GitHub Docs: About pull request merges](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/incorporating-changes-from-a-pull-request/about-pull-request-merges)
- `.claude/rules/git.md` — updated alongside this ADR to state the
  squash-only requirement explicitly
- `claude-workspace/docs/adr/2026-09-15-trunk-based-development-squash-merge.md`,
  `proxmox/docs/adr/2026-09-15-trunk-based-development-squash-merge.md` —
  sibling decisions for the same policy, each in its own repo context
