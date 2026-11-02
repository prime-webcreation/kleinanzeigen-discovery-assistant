# Experiment-Plan: Kleinanzeigen Discovery Assistant

Stand: 02.11.2026 · Modul 2, Lesson 7 (Scoping Your Experiment)

Alle Zahlen sind **Annahmen**. Echte Baseline-Werte von Kleinanzeigen liegen nicht vor.

PRD: 🔴 MUST Link zum "Kleinanzeigen Discovery AI Feature PRD" einfügen

## 1. Hypothese

> Wir glauben, dass **Käufer:innen mit vager Suche** auf **einen Vorschlag des Assistenten tippen**, wenn **der Discovery Assistant Kategorie, Suchbegriffe und Trefferhinweise anzeigt**, gemessen am **Tap auf Vorschlag oder Treffer innerhalb der Session**.

| Teil | Inhalt | Muss sein |
|---|---|---|
| Nutzer:in | Käufer:in mit vager Suche, z. B. "kleines Sofa" | Tester-Profil |
| Verhalten | Tippt auf Vorschlag oder Treffer | Aufgabe im Test |
| KI-Feature | Kategorie-Vorschlag, Chips, Trefferhinweise | Im Prototyp sichtbar |
| Signal | Tap, Klickpfad, Antworten | Per Maze erfasst |

## 2. Testmethode

| Methode | Entscheidung | Begründung |
|---|---|---|
| **Usability-Test (unmoderiert)** | Gewählt | Beantwortet Verständnis- und Vertrauensfragen ohne Moderator |
| Wizard of Oz | Verworfen | Kein Moderator verfügbar |
| A/B | Verworfen | Braucht großes Sample und Live-Traffic |
| Longitudinal | Verworfen | Zeitaufwand zu hoch |
| Micro-Feedback | Verworfen | Setzt ein laufendes Produkt voraus |

## 3. Erfolgskriterien

Format: Track [Metrik], Pass bei [Schwelle], dann [Konsequenz]. Schwellen vor dem Test festlegen.

| Metrik | Schwelle (Annahme) | Konsequenz bei Fail |
|---|---|---|
| Task Completion: Tap auf Vorschlag oder Treffer | 6 von 8 Testern | Rückfragen und Chips überarbeiten |
| Reason Comprehension: erklärt in eigenen Worten, warum der Vorschlag erscheint | 5 von 8 | Begründungstext im Interface ändern |
| Time to First Result: Zeit bis zum passenden Inserat | 5 von 8 unter 90 s | Anzahl der Rückfragen reduzieren |

Immer absolute Zahlen nennen ("6 von 8"), nicht nur Prozent.

## 4. Accuracy vs. Confidence

- **Accuracy:** wie oft die Ausgabe stimmt. Wird nicht im Prototyp getestet.
- **Confidence:** wie sicher sich das Modell ist. Das Interface reagiert darauf.
- Cut-off (Annahme): **0,7**. Er wird später mit echten Daten kalibriert.

| Band | Screen im Prototyp | Verhalten |
|---|---|---|
| High | `high` | Trefferhinweise aus dem Anzeigentext, Feedback-Daumen |
| Low | `low` | Keine sichere Empfehlung, Suche per Chips eingrenzen |
| No Result | `none` | Kategorieempfehlung und alternative Begriffe |
| Failure | `fail` | Fehlermeldung, normale Suche bleibt nutzbar |

Der Prototyp ist statisch: pro Band ein fester Screen, kein Modell.

## 5. Tracking

| Signal | Frage | Erfassung (Maze) |
|---|---|---|
| Direct success | Hat sie den Vorschlag genutzt? | Klickpfad auf Vorschlag oder Treffer |
| Fallback | Wechselte sie zur normalen Suche? | Pfad: KI-Schalter aus oder normale Treffer |
| Friction | Wo hat sie gezögert? | Misclicks, Zeit pro Screen |
| Comprehension | Hat sie die Logik verstanden? | Open Question: "Warum wurde dir das gezeigt?" |
| Trust calibration | Vertraut sie dem Hinweis angemessen? | Opinion Scale: "Würdest du dem Hinweis folgen?" |

## 6. Aufbau und Pilot in Maze

1. Neue Studie, unmoderiert, von null starten
2. Block "Website Test" mit der GitHub-Pages-URL (ohne `#mod`)
3. Aufgabe als Intent: "Du suchst ein kleines Sofa für eine Wohnung. Finde eins, das du dir ansehen würdest."
4. Erwarteten Pfad festlegen
5. Opinion Scale und Open Question ergänzen
6. **Selbst pilotieren**, danach erst versenden

Hinweis: Website-Tasks enden nicht am letzten Screen. Im Pilot prüfen, wie Tester das Ende erreichen.

## 7. Staged Rollout (optional)

| Stufe | Traffic | Zweck |
|---|---|---|
| Shadow | 0 % sichtbar | Modell läuft im Hintergrund, Ausgaben werden geprüft |
| Canary | ca. 5 % | Echte Nutzung bei kleinem Risiko |
| Gradual scale | bis 100 % | Schrittweise Ausweitung |

Rollback-Trigger: Wenn [Metrik] [Richtung] um [Schwelle] über [Zeitraum], dann [Aktion].

| Metrik | Richtung | Schwelle | Zeitraum | Aktion |
|---|---|---|---|---|
| Suchabbruchrate | steigt | 5 %-Punkte | 7 Tage | Feature abschalten |
| Kontaktaufnahmen pro Session | fällt | 10 % | 7 Tage | Zurück auf Canary |
| Fallback zur normalen Suche | steigt | über 40 % | 3 Tage | Pausieren, Rückfragen überarbeiten |

Nutzer:innen bleiben in ihrer Variante, sonst verfälschen sich beide Gruppen.

## Offene Punkte

| Status | Punkt |
|---|---|
| 🔴 MUST | PRD-Link einfügen |
| 🟡 CHECK | Schwellen gegen PRD-Ziele prüfen |
| 🔵 ASK | Fordert der Kurs eine bestimmte Abgabeform? |
| 🟢 DONE | Prototyp mit Moderationsleiste |
