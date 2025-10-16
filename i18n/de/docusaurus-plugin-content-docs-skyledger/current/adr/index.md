---
id: index
title: Architecture Decision Records (ADRs)
sidebar_class_name: hidden
---

**Architecture Decision Records (ADRs)** sind prägnante Dokumente, die wichtige Architekturentscheidungen beim Aufbau und der Weiterentwicklung von Softwaresystemen festhalten. Sie liefern **Kontext**, **Begründung** und **Konsequenzen** jeder Entscheidung und schaffen so Transparenz und Nachvollziehbarkeit.

:::info
ADRs sind besonders wertvoll für Cloud-Infrastrukturprojekte (z. B. Azure), in denen **Compliance**, **Skalierbarkeit** und **regionale Regularien** (wie im Europäischen Wirtschaftsraum) eine Rolle spielen.
:::

:::tip Schnelle Einordnung
Nicht jedes Gespräch wird zu einem ADR. Schreibe eins, wenn eine Entscheidung:  
• Schwer rückgängig zu machen ist  
• Quer über Teams/Module wirkt  
• Governance-relevant ist (Security, Compliance, Namenskonventionen, Regionen)  
• In > 6 Monaten hinterfragt werden könnte.
:::

## Ziele von ADRs

- **Dokumentieren** zentraler Architekturentscheidungen
- **Teamabgleich** und **Wissensaustausch** ermöglichen
- **Compliance**- und **Audit**-Anforderungen unterstützen
- Zukünftiges **Änderungsmanagement** erleichtern

## Fokus: Azure Foundation & Infrastruktur im EWR

Für Azure im EWR adressieren ADRs:

- **Datenresidenz** und **Souveränität**
- Einhaltung von **DSGVO** und **lokalen Vorgaben**
- Auswahl von **Azure-Regionen** und **Services**
- **Security** und **Identity Management**
- **Netzwerk** und **Konnektivität**

:::tip
Entscheidungen müssen **EWR-spezifische rechtliche, regulatorische und operative Rahmenbedingungen** berücksichtigen.
:::

## ADR-Rahmen

Wir unterscheiden zwischen **Pflicht**- und **Optional**-Abschnitten, um ADRs schlank und dennoch nachvollziehbar zu halten.

### Pflichtabschnitte

Jedes ADR **MUSS** enthalten:

1. **Context** – Warum eine Änderung/Entscheidung nötig war (fachlich, technisch, regulatorisch).
2. **Decision** – Die gewählte Lösung klar und eindeutig formuliert.
3. **References** – Links oder Belege, die die Entscheidung stützen (Dokumente, Issues, interne Seiten).

:::note Warum References wichtig sind
Sie verankern Entscheidungen in Evidenz (Benchmarks, Standards, Audits) und reduzieren spätere Grundsatzdiskussionen.
:::

### Optionale Abschnitte

Füge sie hinzu, wenn sie Mehrwert schaffen:

- **Title** (falls nicht H1)
- **Status** (Proposed, Accepted, Deprecated, Superseded)
- **Consequences** (Auswirkungen, Trade-offs, Risiken)
- **Alternatives Considered** (Verworfene Optionen + Gründe)
- **Implementation / Migration Notes** (Bei nicht-trivialer Einführung)
- **Appendix** (Ausführliche Beispiele, Tabellen, Benchmarks)

:::info Status-Lebenszyklus
Typischer Ablauf: Proposed → Accepted → (optional) Deprecated → Superseded.  
Alte ADRs niemals löschen – markieren und auf Nachfolger verweisen.
::: 

### Stilhinweise

- Decision Abschnitt **prägnant** halten (1–3 Absätze + Bullets falls nötig).
- **Links bevorzugen** statt große Inhaltsblöcke einzubetten; Details in Anhänge auslagern.
- Wenn ein ADR ein anderes ersetzt, **im Status vermerken** (z. B. "Supersedes ADR-012").
- **Einheitliche Zeitform**: Context (Vergangenheit/Gegenwart), Decision (Gegenwart), Consequences (zukünftige Wirkung).

:::tip Review-Checkliste
Vor dem Merge prüfen:  
1. Ist der Decision-Satz allein zitierfähig?  
2. Sind 1–2 Trade-offs explizit?  
3. Könnte jemand Externes erkennen, warum Alternativen verworfen wurden?  
4. Sind externe Links stabil?
:::

---

:::note Minimales ADR Template

```markdown
# ADR-NNN: Kurzer Entscheidungstitel

**Status:** Proposed | Accepted | Deprecated | Superseded

## Context
Ein bis zwei Absätze zu Problem, Treibern, Constraints.

## Decision
Klare Aussage zum gewählten Ansatz.

## References
- <link1>
- <link2>

<!-- Optionale Abschnitte unten -->

## Consequences (Optional)
- Positiv:
- Negativ:

## Alternatives Considered (Optional)
- Option A – Grund
- Option B – Grund

## Implementation / Migration (Optional)
Schritte oder Rollout-Hinweise bei Nicht-Trivialität.
```

:::

---

:::info
Konsistente ADRs helfen, informierte, compliance-konforme und auditierbare Entscheidungen für Azure-Infrastruktur im EWR zu treffen.
:::

:::note Navigation
Nutze die Sidebar für thematische Bereiche (z. B. Bicep, Netzwerk). Index-Seiten bleiben bewusst schlank – Listen ergeben sich aus Dateistruktur und Benennung.
:::

---

### Beispiel: Minimale Struktur angewendet (Aus Naming Convention ADR)

```markdown
## Context
Konsistente Benennung reduziert kognitive Last und ermöglicht vorhersagbare Automation.

## Decision
Lower camelCase für Parameter & Variablen mit Verb-Präfix bei Booleans und pluralisierten Sammlungen.

## References
- https://learn.microsoft.com/azure/azure-resource-manager/bicep/best-practices
- https://learn.microsoft.com/azure/cloud-adoption-framework/ready/azure-best-practices/resource-naming
```
