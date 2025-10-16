---
id: adr-bicep-naming-convention
title: Bicep Parameter & Variable Naming Convention
---

## Context

**Consistent naming** of Bicep parameters and variables **reduces cognitive load**, **prevents drift** across modules, and **enables predictable automation** (linting, code generation, policy composition). Bicep does not enforce a naming style; **we adopt one deliberately**.

:::info Why this matters
Naming consistency compounds: every deviation increases review time, risk of mis‑referencing parameters, and friction when building tooling that assumes patterns. Establishing a convention early lets us automate confidently.
:::

:::note Decision Drivers

* Readability
* Consistency
* Automation Friendliness
* Alignment with Microsoft guidance
:::

## Decision

We standardize on the following **rules**:

### 1. **Use lower camelCase** for all parameter and variable identifiers

Examples: `storageAccountName`, `vnetPrefix`, `diagnosticCategories`, `enableSoftDelete`.

> This aligns with official Azure samples and Microsoft Bicep style recommendations ([Microsoft Learn – Bicep best practices](https://learn.microsoft.com/azure/azure-resource-manager/bicep/best-practices)).

:::tip Quick self‑check
If an identifier contains an underscore, starts with an uppercase letter, or ends with `Param` / `Var`, it very likely violates this convention.
:::

### 2. **Prefer descriptive, concise, domain-relevant names**

Bad: `x`, `val1`, `tmpVar`  
Good: `privateDnsZoneName`, `subnetAddressPrefixes`, `costCenterTag`.


**Keep signal high:** avoid unnecessary suffixes like `Param` or `Var` — the context section makes the role clear.

### 3. **Avoid embedding version info** unless semantically required

Prefer `policyDefinitionName` over `policyDefinitionNameV2`. If versioning is essential, include a structured metadata parameter (e.g. `version = '2.1.0'`).

### 4. **No hard‑coded resource names** in parameters when a naming function or convention can compute them

Instead of:

```bicep
param storageAccountName string = 'stapp01prodwe'
```

Use:

```bicep
param appName string
param environment string
param regionCode string
var storageAccountName = toLower('st${appName}${environment}${regionCode}')
```

This keeps naming logic **centralized** and **reduces repetition**.

:::note Centralized naming
Consolidate all concatenation logic inside a shared module (e.g. `naming.bicep`). Application modules should consume names, not craft them. This minimizes future renames when standards evolve.
:::

### 5. **Use plural nouns** for collections; **singular** for single objects

`subnetPrefixes` (array), `subnetPrefix` (string).  
Consistent plurality clarifies data shape at call sites.

### 6. **Prefix booleans with actionable verbs**

`enableMonitoring`, `createRoleAssignments`, `usePrivateEndpoints`.  
Avoid ambiguous names like `monitoring` or `privateEndpoint`.

:::info Why verbs?
Conditions like `if (enableMonitoring)` read as intent. Pure nouns force readers to infer if the symbol is a flag, object, or configuration.
:::

### 7. **Avoid acronyms** unless industry-standard and unambiguous

Prefer `diagnosticSettingsEnabled` over `diagEnabled`, but keep widely accepted ones (e.g., `vnet`, `dns`, `sku`).

### 8. **Constrain with types & allowed values** instead of name hints

Do not encode types in names (`arrayOfSubnets`); rely on Bicep type system and `@allowed` decorators.

### 9. **Keep internal intermediate variables minimal** & private in scope

Only define a variable if it:

* Avoids duplication
* Improves readability
* Encapsulates a transformation (e.g., formatting a resource ID)

:::tip Refactor trigger
Inline expression > ~60 characters or reused 3+ times? Extract to a variable to improve clarity and reduce duplication.
:::

### 10. **Tag-sensitive or compliance-related names** should be externally supplied

If a value participates in governance (e.g. `costCenter`, `dataClassification`), make it a parameter—not a derived variable—to preserve auditability.

## Non-Goals

* Enforcing resource name length rules
* Public API versioning strategy
* Policy definition naming
* Standardized bicep folder structure

## Rationale

* **Lower camelCase** improves scanning in mixed JSON/YAML tooling and matches the predominant style in Microsoft sample repositories.  
* **Separation of semantic parts** (`app`, `env`, `regionCode`) enables deterministic automation and prevents ad-hoc concatenations.  
* **Verb-prefixed booleans** read naturally inside conditions (e.g., `if (enableMonitoring)`), enhancing self-documentation.  
* **Consistent pluralization** speeds comprehension and lowers mistakes in loops.  
* **Avoiding hard-coded names** shifts responsibility to composable naming logic, reducing drift when naming standards evolve.

## Alternatives Considered

| Option | Reason Rejected |
| ------ | --------------- |
| **snake_case** | Inconsistent with Azure/Bicep examples; harder to read in concatenated identifiers |
| **PascalCase for params** | Blurs distinction between resource types (often Pascal) and value inputs |
| **Hungarian notation** (e.g. `arrSubnets`) | Redundant—types already enforced |
| **Embedding environment suffixes** directly in params | Causes duplication and inconsistencies across modules |

## Implementation Guidance

:::info Automation leverage
Consistent naming enables downstream linting, diffing of parameter schemas, and potential code generation (e.g., documentation or test scaffolds). These rules are designed to unlock tooling—not add ceremony.
:::

1. **Add lint rule** (custom script) to check camelCase and pluralization patterns.  
2. **Centralize naming helpers** in a dedicated `naming.bicep` module (separate ADR if complexity grows).  
3. **PR review enforcement:** flag any new parameters violating these rules.  
4. **Maintain a living glossary** of approved abbreviations (`vnet`, `sku`, `caf`, `mg`).

## Examples

:::note How to read this
The first block shows compliant patterns; the second intentionally illustrates anti‑patterns you should flag in reviews.
:::

```bicep
// Good
param location string
param enableMonitoring bool = true
param subnetPrefixes array
param appName string

var logAnalyticsWorkspaceName = toLower('${appName}-law-${location}')

// Less Ideal
param Location string               // PascalCase
param monitoring bool               // Missing verb
param subnets array                 // Plural ok, but vague (prefixes?)
param app_name string               // snake_case
```

## Migration Plan

:::info Gradual adoption
Prefer opportunistic clean‑up when touching a module over a sweeping rename. Large bang‑bang changes increase merge conflicts and risk.
:::

1. **New modules:** adopt immediately.  
2. **Existing modules:** update opportunistically (do not break public contracts without version bump).  
3. **CI check:** warn (2 sprints) then escalate to failure.

## References

> NOTE: Some linked sources may summarize broader Azure IaC style; only naming-relevant aspects adopted here.

* Microsoft Learn (Bicep authoring patterns – variable & parameter clarity): [Best Practices](https://learn.microsoft.com/azure/azure-resource-manager/bicep/best-practices)  
* Azure Resource naming guidance (informs concatenation patterns): [CAF Naming](https://learn.microsoft.com/azure/cloud-adoption-framework/ready/azure-best-practices/resource-naming)  
* Example Azure samples (conventions observation): [Azure Quickstart Templates](https://github.com/Azure/azure-quickstart-templates)  
* Consistent Boolean naming (general code style rationale): [.NET Design Guidelines](https://learn.microsoft.com/dotnet/standard/design-guidelines/names-of-type-members#naming-properties)

## Notes

:::info Scope clarification
This ADR governs only Bicep parameter & variable identifiers—not resource names (those follow CAF / internal naming modules).
:::

:::tip Promote to variable
If a value is used in more than three places or participates in a resource name pattern, promote it from an inline expression to a named variable for maintainability.
:::

---
If future tooling (e.g., custom analyzers) becomes available, we will amend this ADR to codify enforcement.
