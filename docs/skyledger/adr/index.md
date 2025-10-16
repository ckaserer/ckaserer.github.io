---
id: index
title: Architecture Decision Records (ADRs) 
sidebar_class_name: hidden
---

**Architecture Decision Records (ADRs)** are concise documents that capture important architectural decisions made while building and evolving software systems. They provide **context**, **reasoning**, and **consequences** for each decision, ensuring transparency and traceability.

:::info
ADRs are especially valuable for cloud infrastructure projects (e.g. Azure) where **compliance**, **scalability**, and **regional regulations** (like those in the European Economic Area) matter.
:::

:::tip Quick orientation
Not every discussion becomes an ADR. Write one when a decision is:  
• Hard (costly to reverse)  
• Cross-cutting (affects multiple modules / teams)  
• Governance-relevant (security, compliance, naming, regions)  
• Likely to be questioned in 6+ months.
:::

## Goals of ADRs

- **Document** key architectural decisions
- Enable **team alignment** and **knowledge sharing**
- Support **compliance** and **audit** requirements
- Facilitate future **change management**

## Focus: Azure Foundation & Infrastructure in the EEA

When working with Azure in the EEA, ADRs help address:

- **Data residency** and **sovereignty**
- Compliance with **GDPR** and **local regulations**
- Selection of **Azure regions** and **services**
- **Security** and **identity management**
- **Networking** and **connectivity**

:::tip
Decisions must consider **EEA-specific legal, regulatory, and operational constraints**.
:::

## ADR Framework

We distinguish between **mandatory** and **optional** sections to keep ADRs lightweight while preserving traceability.

### Minimum Required Sections

Every ADR **MUST** include:

1. **Context** – Why a change/decision was needed (business, technical, regulatory drivers).
2. **Decision** – The selected approach stated clearly and unambiguously.
3. **References** – Links or citations supporting the decision (docs, issues, internal pages).

:::note Why References Matter
They ground the decision in evidence (benchmarks, external standards, internal audits) and reduce future re-litigation.
:::

### Recommended (Optional) Sections

Add these when they add clarity:

- **Title** (if not already present as H1)
- **Status** (Proposed, Accepted, Deprecated, Superseded)
- **Consequences** (Impacts, trade-offs, risks)
- **Alternatives Considered** (Rejected options + reasons)
- **Implementation / Migration Notes** (If rollout is non-trivial)
- **Appendix** (Extended examples, tables, benchmarks)

:::info Status lifecycle
Typical flow: Proposed → Accepted → (optionally) Deprecated → Superseded.  
Never delete old ADRs—mark and link to the successor instead.
:::

### Style Notes

- Keep the Decision section **crisp** (1–3 paragraphs + bullet list if needed).
- Prefer **links** over embedding large content blocks; move details to appendices.
- If an ADR supersedes another, **note it in Status** (e.g. "Supersedes ADR-012").
- Use **consistent tense**: Context (past/present), Decision (present), Consequences (future impact).

:::tip Review checklist
Before merging an ADR ask:  
1. Is the Decision sentence quotable on its own?  
2. Are at least 1–2 trade‑offs explicit?  
3. Could someone unfamiliar with the project infer why we didn’t pick the main alternative?  
4. Are external links stable (avoid temporary issue query URLs)?
:::

---

:::note Minimal ADR Template

```markdown
# ADR-NNN: Short Decision Title

**Status:** Proposed | Accepted | Deprecated | Superseded

## Context
One or two paragraphs explaining the problem, drivers, constraints.

## Decision
Clear statement of the chosen approach.

## References
- <link1>
- <link2>

<!-- Optional Sections Below -->

## Consequences (Optional)
- Positive:
- Negative:

## Alternatives Considered (Optional)
- Option A – Reason rejected
- Option B – Reason rejected

## Implementation / Migration (Optional)
Steps or rollout notes if non-trivial.
```

:::

---

:::info
Consistent ADRs help teams make informed, compliant, and auditable decisions for Azure infrastructure in the EEA.
:::

:::note Navigation
Use the sidebar to browse specific domains (e.g., Bicep, Networking). Index pages intentionally stay light—lists of ADRs are derived from the file tree and naming patterns.
:::

---

### Example: Applied Minimal Structure (From Naming Convention ADR)

```markdown
## Context
Consistent naming reduces cognitive load and enables predictable automation.

## Decision
Adopt lower camelCase for parameters and variables with verb-prefixed booleans and pluralized collections.

## References
- https://learn.microsoft.com/azure/azure-resource-manager/bicep/best-practices
- https://learn.microsoft.com/azure/cloud-adoption-framework/ready/azure-best-practices/resource-naming
```
