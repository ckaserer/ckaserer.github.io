---
title: "Letting Copilot CLI Track My Own Billable Hours"
description: "I stopped reconstructing consulting timesheets from memory. A local hook-based tool now tracks date, client, and duration automatically from real Copilot CLI usage, and asks the agent for a one-line bilingual summary — with zero manual client setup."
pubDate: 2026-09-24
tags: ["workflow", "copilot", "automation", "consulting"]
draft: false
---

As an independent consultant, I bill by the quarter hour, per client, with a short description of what I did. Reconstructing that from memory at the end of the week was never reliable, and an increasing share of my actual work happens inside GitHub Copilot CLI sessions across several client repositories and folders — which turns out to be exactly the kind of activity a machine can observe far more precisely than I can remember it.

**The first version of this tool required me to map each client folder by hand before working in it. That was still bookkeeping — just moved earlier. The version that actually stuck required none.**

## What it does now

`copilot-worklog` is a small local tool I built for myself, installed once via a PowerShell script. From that point on:

- A user-level Copilot CLI hook writes one immutable event per session lifecycle step (session start, prompt submitted, agent stop, and a few others) into a private inbox — never the prompt text or file contents, only structural fields like timestamps and the working directory.
- A SQLite ledger imports those events and recomputes runs and their client attribution deterministically every time, so a later bug fix or a late-arriving event never has to guess at ordering.
- **Client attribution is automatic**: the tool looks at the working directory each event happened in. Inside a Git repository, it uses the repository's name. Otherwise, it uses the first folder under my personal workspace root — the same folder-name convention I already described in [an earlier post about keeping my whole workstation under one root](/blog/one-cloud-workspace-for-all-my-work). If I switch folders mid-session, the run is split between clients automatically and flagged for review, rather than silently picking one.
- At the start of every session, a hook tells the agent its own session ID and the exact command to run — I never look anything up, and neither does the agent. If a run ends without a short bilingual summary (one German sentence, one English sentence, for clients on either side), the agent is asked for one, exactly once, before the turn is allowed to end.
- That one command is pre-approved automatically for exactly that use, so there's no permission prompt to click through and no broad "allow everything" grant — which matters, since this machine's enterprise policy fails closed on exactly that kind of broad bypass.
- Reports export as CSV and Excel, rounded up to the nearest 0.25 h per client per day, with a `Review` sheet showing the exact numbers and every automatic assumption the tool made, so nothing goes to an invoice unchecked.

## The mapping I removed

My first design mapped a folder prefix to a client ID with an explicit command, run once per client, before starting work there. It felt reasonable on paper — deterministic, explicit, no ambiguity. In practice it meant any folder I hadn't thought to map in advance came back `Unassigned`, which is precisely the failure mode I was trying to design away: work that happened but isn't attributed to anyone.

Replacing it with an automatic rule based on Git repository name or workspace folder name removed a manual step without losing the audit trail — I can still correct a wrong attribution after the fact with an append-only `reassign` command, and the tool keeps its original automatic guess for reference. The difference is that correction is now the exception, not something required up front for every new client.

## Why SQLite and not just a spreadsheet

The Excel/CSV files are what I actually look at. The SQLite ledger behind them exists because several things need to be true at once: multiple parallel Copilot CLI sessions writing safely without corrupting each other, the ability to recompute runs from scratch when I fix a bug in the reduction logic, and a place to keep a correction separate from the original automatic guess. A spreadsheet can't do any of that atomically. SQLite does, invisibly, as a single file I never open by hand.

## The actual test

**Do** design the smallest possible action a machine can take on your behalf, then automate exactly that — not a slightly bigger thing that's easier to build. **Don't** accept "map it once" as zero setup; it isn't. **Check**: if you open Copilot CLI in a folder you've never touched before, does the thing you built already know what to do with it?
