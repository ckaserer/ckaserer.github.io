---
id: index
sidebar_label: Bicep
title: Bicep Architecture Decision Records
description: Overview of all Bicep related Architecture Decision Records (ADRs) and a short introduction to the Bicep DSL for Azure infrastructure.
---

:::info Starting Point
All Azure Bicep related Architecture Decision Records are collected in this folder. Use this index as the starting point when you need to understand why specific infrastructure authoring conventions or patterns were chosen.
:::

## What is Bicep?

Bicep is a domain specific language (DSL) for declaring Azure resources *as code*. It transpiles to standard Azure Resource Manager (ARM) JSON templates, but offers a far more concise, readable, and modular authoring experience.

## Why we use (and like) Bicep

**Key advantages:**

:::note At a glance
These benefits compound in larger repositories where readability, early validation, and modular reuse directly affect delivery velocity.
:::

1. **Clean, declarative syntax** – Significantly less noise than raw ARM JSON; easier code reviews and onboarding.
2. **First‑class type safety & IntelliSense** – Rich tooling (VS Code extension) with real‑time validation against Azure resource schemas.
3. **Modularity & reusability** – Native modules encourage composition, promote standardization, and reduce duplication across environments/tenants.
4. **No state file** – Unlike Terraform, desired state is inferred directly from the template + Azure; reduces drift concerns around external state backends.
5. **Native Azure integration** – Immediate support for new resource types and API versions as they appear (no provider lag).
6. **Transparent output** – Compiled ARM JSON is always accessible, aiding troubleshooting, compliance reviews, and change tracking.
7. **Shift‑left validation** – `bicep build` and `what-if` (via Azure CLI / PowerShell) enable early detection of breaking or destructive changes.

> Tip: Combine `az deployment sub what-if` (or group/tenant scopes) with your Bicep files to preview impacts before executing changes.

## When Bicep is a great fit

Use Bicep for Azure‑only infrastructure where:

- You want fast adoption of new Azure features.
- You value strong schema alignment and IDE feedback.
- You need to enforce naming, tagging, and policy conventions centrally (see related ADRs).
- Multi‑environment / multi‑subscription patterns can leverage shared modules.

:::tip Quick fit heuristic
If 90%+ of managed resources are Azure-native and new Azure features need fast adoption, Bicep keeps lead-time low.
:::

## When to re‑evaluate

If you require extensive multi‑cloud orchestration, complex graph‑driven dependencies spanning non‑Azure systems, or external plugins/providers, then Terraform or Pulumi might supplement (not necessarily replace) Bicep for those specific domains.

:::info Supplement, not replace
It is common to use Terraform/Pulumi for cross-cloud/network edge constructs while retaining Bicep for core Azure platform modules.
:::

---

If something is unclear or missing, open an issue referencing this index so we can refine the catalogue.

:::note Contribute
Open a draft ADR early rather than after implementation—discussion before rollout avoids rework and captures rationale while fresh.
:::
