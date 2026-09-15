---
title: "Why Every PR in My Repos Gets Squash-Merged, No Exceptions"
description: "Trunk-based development tells you to keep branches short. It doesn't tell you how they land on main — and that gap let a merge commit slip into two of my repos on the same day. Squash merge closes it, cheaply."
pubDate: 2026-09-15
tags: ["git", "trunk-based-development", "ai-agents", "devops"]
---

I've run trunk-based development everywhere I write code for a while now: one `main`, short branches, PR-only, no exceptions. What I hadn't pinned down was *how* a branch lands. This week that gap bit me — the same way, on the same day, in two unrelated repos.

**Squash merge isn't a cosmetic history preference. It's the one merge strategy that keeps an agent's (or your own) messy iteration off `main` permanently, and it costs nothing you weren't already paying for by requiring a PR.**

## What broke

A routine doc fix landed in my homelab infrastructure repo and my personal site's repo as a real, two-parent merge commit — not the single squash commit every earlier PR in either repo had produced. Nobody decided that. GitHub still had all three merge-method buttons enabled, so one wrong click, or one `gh pr merge` without `--squash`, was all it took. `git log --pretty="%H %P"` on `main`'s tip showed it immediately: a commit with two parents, sitting in a history that was supposed to be one line per change.

Neither repo enforces a merge method today because I'd never written the decision down. Trunk-based development was policy; squash merge was just a habit — and habits don't survive a missed click.

## Why this matters more with an agent authoring the code

Most of my PRs are Claude Code sessions, not me typing directly, and that changes the risk. Google's DORA research group found that a 25% rise in AI adoption correlates with real gains in individual flow and productivity — and, in the same report, a drop in software delivery stability and throughput. Their explanation is batch size: AI writes code faster, which means bigger diffs, more for a reviewer to hold in their head, more places for a defect to hide. DORA's own answer to that is "working in small batches," which they describe as a direct safety net against exactly this kind of AI-driven instability.

A short-lived, single-purpose branch already caps how large one change can get. Squash merge finishes the job: whatever an agent tried, reverted, and retried inside that branch — three attempts at a fix, a detour that didn't pan out — never becomes three permanent commits on `main`. Only the diff that actually shipped does.

## Why infrastructure code specifically

This isn't just a personal-site nicety. My homelab repo is infrastructure-as-code for one physical host with no staging environment — a push to `main` is a real deploy against a real machine. When something goes wrong there, `git bisect` is how I find out which change caused it, and bisect only works if every commit on `main` is one coherent, already-reviewed unit. A merge commit with its own buried sub-commits breaks that assumption exactly when I need it least.

**Do** restrict a repo's merge-method setting to squash-only the moment you adopt trunk-based development — don't leave it to memory. **Don't** assume "we already do it this way" is the same as "it's enforced" — I'd already been squash-merging by habit in both repos, and the habit still failed. **Check**: if you ran `git log --pretty="%P"` on your own `main` right now, would every line have exactly one parent? If not, the gap I hit is already open in your repo too.

## What it costs

Squashing does throw something away: the individual commits inside a PR aren't `git blame`-able on `main` afterward, only the final diff and whatever you wrote in the PR description. For a PR that's genuinely several independent, separately-revertable changes, that's a real loss — the fix is splitting it into separate PRs, not fighting the merge strategy. And turning off merge-commit and rebase-merge in GitHub's settings removes those options for everyone who touches the repo next, not just me. Both are trade-offs I'll take over a `main` history I can't fully trust.

Trunk-based development sets the shape of your branches. It says nothing about what happens the moment one lands — and that's exactly the gap an agent, or a tired click, will find first. Squash merge is the cheapest way I know to close it.
