---
id: index
sidebar_label: Bicep
title: Bicep Architecture Decision Records
description: Übersicht aller Bicep-bezogenen ADRs und kurze Einführung in die Bicep DSL für Azure Infrastruktur.
---

:::info Startpunkt
Alle Azure Bicep bezogenen Architecture Decision Records sind hier gesammelt. Nutze dieses Verzeichnis als Startpunkt, um zu verstehen, warum bestimmte Konventionen oder Muster gewählt wurden.
:::

## Was ist Bicep?

Bicep ist eine Domain Specific Language (DSL) zur deklarativen Definition von Azure Ressourcen *as code*. Sie transpiliert nach ARM (Azure Resource Manager) JSON Templates, bietet aber eine deutlich prägnantere, lesbarere und modularere Authoring-Erfahrung.

## Warum wir Bicep nutzen

**Hauptvorteile:**

:::note Auf einen Blick
Diese Vorteile skalieren mit Repository-Größe: Lesbarkeit, frühe Validierung und modulare Wiederverwendung beschleunigen Delivery.
:::

1. **Saubere deklarative Syntax** – Weniger Rauschen als pures ARM JSON; einfachere Reviews & Onboarding.
2. **Erstklassige Typsicherheit & IntelliSense** – Reiches Tooling (VS Code Extension) mit Echtzeit-Schema-Validierung.
3. **Modularität & Wiederverwendung** – Native Module fördern Komposition, Standardisierung und verringern Duplikate.
4. **Kein State File** – Im Gegensatz zu Terraform: Zielzustand wird aus Template + Azure abgeleitet; weniger Drift-Risiko.
5. **Native Azure Integration** – Neue Ressourcentypen & API-Versionen sofort nutzbar (kein Provider-Lag).
6. **Transparenter Output** – Kompiliertes ARM JSON erleichtert Troubleshooting, Compliance-Reviews und Change Tracking.
7. **Shift-left Validation** – `bicep build` und `what-if` ermöglichen frühe Erkennung destruktiver Änderungen.

> Tipp: Nutze `az deployment sub what-if` (oder andere Scopes) um Auswirkungen vor Ausführung zu sehen.

## Wann Bicep besonders geeignet ist

Nutze Bicep für Azure-only Infrastruktur wenn:

- Du schnelle Adoption neuer Azure Features brauchst.
- Starke Schema-Alignments & IDE-Feedback entscheidend sind.
- Naming-, Tagging- und Policy-Konventionen zentral durchgesetzt werden sollen.
- Multi-Environment / Multi-Subscription Muster gemeinsame Module nutzen können.

:::tip Schneller Eignungs-Check
Wenn >90% der Ressourcen Azure-nativ sind und Feature-Adaption Geschwindigkeit zählt, reduziert Bicep Lead-Time.
:::

## Wann neu bewerten

Bei umfangreicher Multi-Cloud Orchestrierung, komplexen abteilungsübergreifenden Abhängigkeiten oder externen Providern können Terraform oder Pulumi Bicep ergänzen (nicht zwingend ersetzen).

:::info Ergänzung statt Ersatz
Häufig werden Terraform/Pulumi für Cross-Cloud / Edge genutzt, während Bicep Kern-Plattform-Module abbildet.
:::

---

Wenn etwas unklar ist oder fehlt, öffne ein Issue mit Verweis auf dieses Verzeichnis.

:::note Beitrag
Erstelle ein ADR früh als Draft – Diskussion vor Implementierung spart Rework und bewahrt frische Entscheidungsgründe.
:::
