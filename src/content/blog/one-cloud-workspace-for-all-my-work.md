---
title: "Why My Whole Workstation Lives Under One Short Folder"
description: "Every repo, OneDrive file, and client SharePoint library on my work machine sits under one root — because every folder inside it answers a single question: who's responsible if this disappears?"
pubDate: 2026-09-23
tags: ["workflow", "git", "onedrive", "sharepoint", "windows"]
draft: false
---

Every repository, personal work file, and client project asset on my primary workstation lives under one folder: `C:\Cloud`. I put it directly under `C:\`, not three levels into my user profile, because I'm the only person who logs into this machine — there's no other account to isolate it from.

**A short shared root only stays useful if every folder underneath it has a clearly assigned owner for keeping it durable. For a Git repository, that's deliberately two owners at once — SharePoint for the working files, the Git remote for history — and the only way to keep that split clean is telling OneDrive to leave `.git` alone.**

## Three folders, one rule each

`C:\Cloud\Repos\<owner>\<repository>` holds Git working trees that don't belong to any client or organizational context — personal projects, experiments, anything I'd otherwise call "just mine." Nothing here syncs through OneDrive or SharePoint. The Git remote is the only backup, which is exactly the point: one clear owner, no ambiguity about where history actually lives.

`C:\Cloud\OneDrive - <Organization>` is my individual company OneDrive — the personal cloud drive tied to my own account, not a shared library. It holds things that don't fit a repository or a specific client engagement: reusable assets I use across projects, training material from courses I've attended, installer executables for apps I want to keep on hand, and presales material I reference often enough that re-finding it each time would waste more effort than storing it once.

`C:\Cloud\<Organization>` and `C:\Cloud\<Client>` are Teams-connected SharePoint sync roots, and I put client-specific Git repositories there too, not into my personal `Repos` folder — because a client team needs that project reachable through their own Teams channel, repository included, regardless of how I've organized my own machine.

## Putting a repo inside a SharePoint sync root

A Git working tree writes constantly to its own `.git` folder — a new object on every commit, index updates on every checkout, log entries on every fetch. Point a general-purpose sync engine like OneDrive at that folder and it tries to notice, checksum, and upload every one of those small changes, which is exactly the kind of file churn Microsoft's own OneDrive guidance warns can overwhelm sync and cause instability — in my experience, that shows up as sync conflicts on the very files that change fastest.

I don't keep repositories out of SharePoint to avoid that. I tell OneDrive to simply not look inside `.git`: SharePoint still syncs the working files a client team needs to see, while the Git remote stays the one authoritative copy of history.

## How I set that up

On this machine, that exclusion is a machine-level OneDrive policy, so it covers every sync root at once:

```powershell
# Requires an elevated (Administrator) PowerShell session
New-Item -Path 'HKLM:\SOFTWARE\Policies\Microsoft\OneDrive\EnableODIgnoreFolderListFromGPO' -Force
New-ItemProperty -Path 'HKLM:\SOFTWARE\Policies\Microsoft\OneDrive\EnableODIgnoreFolderListFromGPO' `
  -Name '1' -PropertyType String -Value '.git' -Force
```

Verify it, without changing anything:

```powershell
Get-ItemProperty -Path 'HKLM:\SOFTWARE\Policies\Microsoft\OneDrive\EnableODIgnoreFolderListFromGPO'
```

On a centrally managed workstation, this may need to come from Group Policy or Intune instead of a local edit — check with IT, and confirm the actual sync behavior in your own OneDrive setup before relying on it. Two limits hold regardless: it's machine-local and won't remove `.git` metadata already uploaded, and it doesn't make SharePoint a substitute Git remote — an unpushed branch is still unpushed.

## The actual test

**Do** name who backs up every folder — for a repo, name both: the sync engine for the files, the remote for history. **Don't** assume a repo's history is safe just because its folder syncs — only a pushed remote proves that. **Check**: for any folder under `C:\Cloud`, can you say who backs it up in one sentence?

The folder structure isn't the interesting part. What matters is that every subtree inside it already answers "who's responsible if this disappears" — so I never have to work that out under pressure.
