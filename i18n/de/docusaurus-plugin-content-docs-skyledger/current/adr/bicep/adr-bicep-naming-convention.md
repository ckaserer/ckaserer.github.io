---
id: adr-bicep-naming-convention
title: Bicep Parameter- & Variablen-Namenskonvention
---

## Kontext

**Konsistente Benennung** von Parametern und Variablen reduziert **kognitive Last**, verhindert **Drift** zwischen Modulen und ermöglicht **vorhersagbare Automatisierung** (Linting, Codegenerierung, Policy-Komposition). Bicep erzwingt keinen Stil; **wir wählen bewusst einen**.

:::info Warum das wichtig ist
Jede Abweichung erhöht Review-Aufwand, Risiko falscher Referenzen und erschwert Tooling, das Muster voraussetzt. Frühe Konvention = sichere Automatisierung.
:::

:::note Entscheidungs-Treiber
* Lesbarkeit
* Konsistenz
* Automatisierungsfreundlichkeit
* Ausrichtung an Microsoft Guidance
:::

## Entscheidung

Wir standardisieren folgende **Regeln**:

### 1. **lower camelCase** für alle Parameter- & Variablennamen

Beispiele: `storageAccountName`, `vnetPrefix`, `diagnosticCategories`, `enableSoftDelete`.

> Entspricht offiziellen Azure-Beispielen & Microsoft Bicep Empfehlungen ([Microsoft Learn – Best Practices](https://learn.microsoft.com/azure/azure-resource-manager/bicep/best-practices)).

:::tip Schneller Selbsttest
Unterstrich, führender Großbuchstabe oder Suffix `Param` / `Var`? → Wahrscheinlich Verstoß.
:::

### 2. **Beschreibende, prägnante, domänenrelevante Namen**

Schlecht: `x`, `val1`, `tmpVar`  
Gut: `privateDnsZoneName`, `subnetAddressPrefixes`, `costCenterTag`.

**Signal hoch halten:** Keine unnötigen Suffixe wie `Param`/`Var`.

### 3. **Keine Versionsinfo einbetten** außer fachlich notwendig

`policyDefinitionName` statt `policyDefinitionNameV2`. Falls nötig: strukturiertes Metadaten-Parameter (z. B. `version = '2.1.0'`).

### 4. **Keine hart kodierten Ressourcennamen** wenn konstruierbar

Statt:
```bicep
param storageAccountName string = 'stapp01prodwe'
```
Nutzen:
```bicep
param appName string
param environment string
param regionCode string
var storageAccountName = toLower('st${appName}${environment}${regionCode}')
```
Zentralisiert Logik & reduziert Duplikate.

:::note Zentralisiertes Naming
Alle Konkatenationen in ein gemeinsames Modul (z. B. `naming.bicep`) auslagern. Fachmodule konsumieren nur.
:::

### 5. **Plural für Sammlungen, Singular für Einzelwerte**

`subnetPrefixes` (Array) vs. `subnetPrefix` (String).

### 6. **Booleans mit Verben präfixen**

`enableMonitoring`, `createRoleAssignments`, `usePrivateEndpoints`.  
Vermeide mehrdeutige Nomen wie `monitoring`.

:::info Warum Verben?
`if (enableMonitoring)` liest sich als Intention. Nomen lassen Bedeutung offen.
:::

### 7. **Abkürzungen sparsam**

Nur etablierte: `vnet`, `dns`, `sku`.

### 8. **Typen nicht in Namen kodieren**

Keine Namen wie `arrayOfSubnets`; stattdessen Typ & `@allowed` nutzen.

### 9. **Interne Zwischen-Variablen minimal halten**

Nur wenn sie:
* Duplikat vermeiden
* Lesbarkeit steigern
* Transformation kapseln

:::tip Refactor-Schwelle
> ~60 Zeichen oder 3+ Wiederverwendungen → Variable.
:::

### 10. **Governance-/Compliance-Werte parametrisieren**

`costCenter`, `dataClassification` als Parameter (Auditierbarkeit).

## Nicht-Ziele
* Ressourcen-Namenslängenregeln
* Öffentliche API-Versionierung
* Policy-Definition-Naming
* Standardisierte Bicep-Verzeichnisstruktur

## Begründung
* lower camelCase = schnelles Scannen & Microsoft-Konformität  
* Semantische Teile (`app`, `env`, `regionCode`) ermöglichen deterministische Automation  
* Verb-Booleans lesen sich natürlich  
* Konsistente Plurale reduzieren Fehler  
* Keine hart kodierten Namen = weniger Drift

## Betrachtete Alternativen
| Option | Grund verworfen |
| ------ | --------------- |
| **snake_case** | Unüblich in Azure-Beispielen; schlechter lesbar |
| **PascalCase für Parameter** | Konflikt mit Ressourcentyp-Stil |
| **Ungarische Notation** | Redundant – Typ bereits deklariert |
| **Environment-Suffixe direkt** | Duplikate & Inkonsistenzen |

## Implementierungsleitfaden

:::info Automationsnutzen
Konsistenz ermöglicht Linting, Schema-Diffing & Code-Generierung. Regeln sind Enabler – kein Overhead.
:::

1. Lint-Regel / Skript für camelCase & Pluralisierung.  
2. Naming-Helper zentralisieren.  
3. PR-Review → Verstöße flaggen.  
4. Glossar gepflegter Abkürzungen (`vnet`, `sku`, `caf`, `mg`).

## Beispiele

:::note Lesart
Erster Block = konform; zweiter = Anti-Pattern.
:::

```bicep
// Gut
param location string
param enableMonitoring bool = true
param subnetPrefixes array
param appName string

var logAnalyticsWorkspaceName = toLower('${appName}-law-${location}')

// Weniger ideal
param Location string               // PascalCase
param monitoring bool               // Fehlendes Verb
param subnets array                 // Unspezifisch
param app_name string               // snake_case
```

## Migrationsplan

:::info Schrittweise
Bei Änderungen opportunistisch bereinigen statt Big-Bang.
:::

1. Neue Module: sofort anwenden.  
2. Bestehende: bei Anfassen modernisieren (ohne Breaking Change).  
3. CI: zunächst Warnung (2 Sprints), später Fehler.

## Referenzen
* Microsoft Learn: [Best Practices](https://learn.microsoft.com/azure/azure-resource-manager/bicep/best-practices)  
* Azure CAF Naming: [CAF Naming](https://learn.microsoft.com/azure/cloud-adoption-framework/ready/azure-best-practices/resource-naming)  
* Azure Quickstarts: [Quickstart Templates](https://github.com/Azure/azure-quickstart-templates)  
* .NET Design Guidelines (Boolean-Naming): [.NET Guidelines](https://learn.microsoft.com/dotnet/standard/design-guidelines/names-of-type-members#naming-properties)

## Hinweise

:::info Scope Klarstellung
Dieses ADR betrifft nur Parameter- & Variablennamen – nicht Ressourcennamen.
:::

:::tip Promotion zur Variable
>3 Nutzungen oder Bestandteil eines Namensmusters → Variable.
:::

---
Bei zukünftiger Tooling-Verfügbarkeit (Analyzer) wird dieses ADR erweitert.
