---
title: "Why My Whole Workstation Lives Under One Short Folder"
description: "Every repo, OneDrive file, and client SharePoint library on my work machine sits under one root — because every folder inside it answers a single question: who's responsible if this disappears?"
pubDate: 2026-09-23
tags: ["workflow", "git", "onedrive", "sharepoint", "windows"]
draft: false
---

Every repository, personal work file, and client project asset on my primary workstation lives under one folder: `C:\Cloud`. I put it directly under `C:\`, not three levels into my user profile, because I'm the only person who logs into this machine — there's no other account to isolate it from.

**A short shared root only stays useful if every folder underneath it has exactly one owner responsible for keeping it durable — a Git remote or a Microsoft cloud sync engine, never both, and never neither.**

## Three folders, three owners

`C:\Cloud\Repos\<owner>\<repository>` holds Git working trees that don't belong to any client or organizational context — personal projects, experiments, anything I'd otherwise call "just mine." Nothing here syncs through OneDrive or SharePoint. The Git remote is the only backup, which is exactly the point: one clear owner, no ambiguity about where history actually lives.

`C:\Cloud\OneDrive - <Organization>` is my individual company OneDrive — the personal cloud drive tied to my own account, not a shared library. It holds things that don't fit a repository or a specific client engagement: reusable assets I use across projects, training material from courses I've attended, installer executables for apps I want to keep on hand, and presales material I reference often enough that re-finding it each time would waste more effort than storing it once.

`C:\Cloud\<Organization>` and `C:\Cloud\<Client>` are Teams-connected SharePoint sync roots. Client project data and any repositories tied to that project go there first, not into my personal `Repos` folder or my personal OneDrive — because a client team needs that content reachable through their own Teams channel, regardless of how I've organized my own machine.

## Putting a repo inside a SharePoint sync root

A Git working tree writes constantly to its own `.git` folder — a new object on every commit, index updates on every checkout, log entries on every fetch. Point a general-purpose sync engine like OneDrive at that folder and it tries to notice, checksum, and upload every one of those small changes, which is exactly the kind of file churn Microsoft's own OneDrive guidance warns can overwhelm sync and cause instability.

The fix isn't keeping repositories out of SharePoint. It's telling OneDrive to simply not look inside `.git` — SharePoint still syncs the working files a client team needs to see, while the Git remote stays the one authoritative copy of history.

## How I set that up

On this machine, that exclusion is a machine-level OneDrive policy, not a per-library setting, so it applies uniformly to any sync root:

```powershell
# Requires an elevated (Administrator) PowerShell session
New-Item -Path 'HKLM:\SOFTWARE\Policies\Microsoft\OneDrive\EnableODIgnoreFolderListFromGPO' -Force
New-ItemProperty -Path 'HKLM:\SOFTWARE\Policies\Microsoft\OneDrive\EnableODIgnoreFolderListFromGPO' `
  -Name '1' -PropertyType String -Value '.git' -Force
```

To confirm it's set, without changing anything:

```powershell
Get-ItemProperty -Path 'HKLM:\SOFTWARE\Policies\Microsoft\OneDrive\EnableODIgnoreFolderListFromGPO'
```

That's a numbered list of exact folder names OneDrive should skip; mine currently holds one entry, `.git`. Writing to `HKLM` needs an elevated session, and on a workstation your organization manages centrally, this same policy may need to come from Group Policy or Intune rather than a local registry edit — check with your IT team before assuming a local change like this is yours to make. Verify the actual sync behavior in your own OneDrive setup before relying on it; a personal company OneDrive can sit under a different tenant policy than mine.

Two limits are worth stating plainly. First, this is machine-local — it governs what this OneDrive client skips going forward, and it does nothing to remove `.git` metadata a sync engine already uploaded before the policy existed. Second, it doesn't make SharePoint a substitute Git remote. If a branch was never pushed, or a commit sits untracked locally, that content is exactly as exposed to loss inside a SharePoint-synced repo as it would be anywhere else — the exclusion only keeps `.git` out of OneDrive's own sync stream.

## The actual test

**Do** decide, for every folder under a shared root, whether Git or a Microsoft sync engine is responsible for keeping it durable — before deciding where a new file or repo goes. **Don't** assume that placing a repository inside a synced folder means its history is backed up — only a pushed remote does that. **Check**: for any folder under `C:\Cloud`, can you name its one owner in a single sentence? If not, that's a decision still waiting to be made, not a location problem.

The folder structure isn't the interesting part. What matters is that every subtree inside it already answers "who's responsible if this disappears" — so I never have to work that out under pressure.
