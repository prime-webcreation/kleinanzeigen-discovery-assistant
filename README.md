# Kleinanzeigen Discovery Assistant (Prototyp)

Stand: 02.11.2026

Klickbarer Prototyp für ein KI-Feature in der Suche von Kleinanzeigen. Entstanden im Modulprojekt 2 der Weiterbildung **AI-Native Designer**.

> **Hinweis:** Lernprojekt ohne Verbindung zu Kleinanzeigen. Alle Daten sind erfunden, es läuft **kein echtes Modell**. Getestet wird die Oberfläche um das Modell, nicht die Modellqualität.

## Idee in einem Satz

Käufer:innen beschreiben in eigenen Worten, was sie suchen. Der Assistent schlägt Kategorie und Suchbegriffe vor, zeigt Trefferhinweise aus dem Anzeigentext und bleibt dabei optional und transparent.

## Zustände des Prototyps

| Zustand | Was der Prototyp zeigt |
|---|---|
| Cold Start | Sucheingabe, Kategorie, Umkreis, Lieferung, Vorschlags-Chips, Zustand, KI-Schalter |
| Waiting | Ladezustand "KI sucht passende Anzeigen..." mit Link "Abbrechen". Nach "Abbrechen" erscheint ein grüner Hinweis "Du hast die Suche abgebrochen" mit "Erneut suchen" |
| High Confidence | Nur Karten, bei denen alle gewählten Kriterien passen, mit Begründung und Daumen-Feedback |
| Low Confidence | Keine sicher begründete Empfehlung, Eingrenzen mit Maße, Preis, Farbe |
| No Result | Kategorieempfehlung, alternative Suchbegriffe, Anzeige der gewählten Angaben |
| Failure (Error) | Fehlermeldung "Deine Suche konnte nicht geladen werden", "Erneut versuchen" |
| Normale Suche | Erscheint, wenn die KI ausgeschaltet ist, nur normale Ergebnisse |

## So kommst du in jeden Zustand

### Über die Suche (so testen auch Testpersonen in Maze)

Der Zustand hängt vom **Suchtext** und den gewählten **Chips** ab. Die Prüfung läuft in dieser Reihenfolge, der erste Treffer gewinnt:

| Reihenfolge | Bedingung | Zustand | Beispiel |
|---|---|---|---|
| 1 | Es folgt ein "Erneut versuchen" nach einem Fehler | High | Klick auf "Erneut versuchen" |
| 2 | Suchtext enthält weder "Sofa" noch "Couch", oder das Wort "Sof" (Tippfehler) | **No Result** | "Fahrrad", "kleines Sof" |
| 3 | Suchtext enthält "Schlaffunktion", "Schlafsofa", "Bettkasten" oder "ausziehbar" | **Failure** | "Schlafsofa für kleine Wohnung" |
| 4 | Confidence mindestens 0,7 | **High** | "Sofa" plus Chip "2-Sitzer" |
| 5 | Confidence unter 0,7 | **Low** | "kleines Sofa" ohne weitere Angabe |

Nach dem Tipp auf "Suchen" läuft immer erst **Waiting**: 2,6 s bis zum Ergebnis, bei Failure 1,5 s. Der Suchtext wird dabei klein geschrieben geprüft. Ist das Suchfeld leer, wird "kleines Sofa für meine Wohnung" eingesetzt.

Wichtig für Failure: Das Wort muss im **Suchfeld** stehen. Ein Chip allein löst es nicht aus.

### Über die sichtbaren State-Buttons

Oben in der Prototypansicht stehen immer **Cold Start, Waiting, High, Low, No Result und Failure** bereit. Ein Klick zeigt den Zustand sofort, ohne vorherige Suche. Die kompakte, dunkelgraue Leiste markiert den aktiven Button hell. Sie bleibt beim Scrollen sichtbar und bricht auf Mobilgeräten in zwei Reihen um.

Jeder Einstieg setzt Filter, Eingrenzungen, Feedback, offene Dialoge und ein erzwungenes nächstes Ergebnis zurück. Cold Start öffnet eine leere Suche mit eingeschalteter KI. Waiting bleibt beim direkten Einstieg stehen, bis ein anderer Zustand gewählt oder die Suche abgebrochen wird. Bei einer regulären Suche gelten weiterhin die unten dokumentierten Wartezeiten.

### Über die Moderationsleiste (für Team und Pilot)

Hänge `#mod` an die URL, zum Beispiel `http://localhost:8000/#mod`. Unter dem Telefon erscheint die Leiste "Moderation":

| Button | Springt zu | Suchtext, der dabei gesetzt wird |
|---|---|---|
| Cold Start (KI an) | Cold Start, alles zurückgesetzt | leer |
| Cold Start (KI aus) | Cold Start mit ausgeschalteter KI | leer |
| Waiting | Ladezustand, bleibt bis zum nächsten Wechsel | "kleines Sofa" |
| High | High Confidence mit ausgewählten Chips und Versand | "kleines Sofa" plus Chips "2-Sitzer", "< 180cm" und Lieferung "Versand" |
| Low | Low Confidence mit vorausgewähltem Versand und Breite | "kleines Sofa" plus Lieferung "Versand" und Breite < 180 cm |
| No Result | No Result mit nicht erfüllbaren Beispielkriterien | "kleines Sofa", 2-Sitzer, Versand, Breite < 120 cm, < 50 € |
| Failure | Fehlerzustand | "kleines Sofa" |

Jeder Sprung setzt Chips, Umkreis, Lieferung, Zustand und Eingrenzungen zurück.

Das Dropdown **Nächstes KI-Ergebnis** erzwingt das Ergebnis der nächsten Suche, unabhängig vom Suchtext: Automatisch, High, Low, No Result, Failure (sofort) oder Langsam. "Langsam" bleibt im Ladezustand und zeigt nach 15 s den Fehler.

Ohne `#mod` bleibt die zusätzliche Moderationsleiste verborgen; die State-Buttons oben sind weiterhin sichtbar.

### Direkte Test-Einstiege

Mit einem Parameter öffnet der Prototyp sofort einen Zustand, KI bleibt eingeschaltet, die Moderationsleiste bleibt verborgen:

| Link | Zustand | Suchanfrage |
|---|---|---|
| `?state=low` | Low Confidence | "kleines Sofa" plus Lieferung "Versand" und Breite < 180 cm |
| `?state=none` | No Result | "kleines Sofa", 2-Sitzer, Versand, Breite < 120 cm, < 50 € |

Ohne Parameter (oder bei unbekanntem Wert) startet der Prototyp wie gewohnt im Cold Start.

### Beispiel-Szenario "Umzug in eine kleine Wohnung"

1. Cold Start: "Sofa" tippen, Chip "kleines Sofa" wählen, Suchen. Ergebnis ist **Low Confidence**.
2. In der Suche zu "Schlafsofa für kleine Wohnung" ändern. Ergebnis ist der **Error**.
3. "Erneut versuchen" führt zu **High Confidence**.

## Schwellenwerte und Regeln

Alle Zahlen sind **Annahmen**, es gibt keine echten Baseline-Werte (siehe [docs/PROJECT.md](docs/PROJECT.md)).

| Was | Wert | Wo im Code |
|---|---|---|
| Cut-off Confidence | **0,7**, ab 0,7 High, darunter Low | `CUTOFF` in `src/app.js` |
| Confidence hoch (0,82) | Chip "2-Sitzer" oder "< 180cm" gewählt, oder "2-sitzer" bzw. "180" im Suchtext | `confidence()` |
| Confidence niedrig (0,55) | alles andere | `confidence()` |
| Waiting bis Ergebnis | 2,6 s | `startAI()` |
| Waiting bis Failure | 1,5 s | `startAI()` |
| Langsam: Fehler | nach 15 s | `startAI()` |

Die Confidence ist eine einfache Regel und keine Modellausgabe. Sie dient nur dazu, den Wechsel zwischen High und Low zu zeigen.

### Eingaben in den Eingrenzen-Feldern (Low)

| Feld | Schnellauswahl | Eigener Wert |
|---|---|---|
| Maße (Breite) | < 160, < 180, < 200 cm | 1 bis 400 cm |
| Preis | < 50, < 100, < 200, < 300, < 500 € | 1 bis 99999 € |
| Farbe | Weiß, Schwarz, Grau, Beige, Braun, Grün, Blau | keine |
| Umkreis (Cold Start) | + 5, 10, 20, 50, 100 km | keine |
| Lieferung | Abholung, Versand | keine |
| Zustand | Neu, Gebraucht, egal | keine |

"Zustand egal" filtert nichts. Maße, Preis und Farbe können nach dem Tipp auf den Chip direkt gewählt werden, ein Tipp auf einen Schnellwert übernimmt ihn sofort.

## Verhalten der Auswahl

Im Cold Start mit eingeschalteter KI setzt ein Klick in das leere Suchfeld den Beispieltext „kleines Sofa für meine Wohnung“ ein und zeigt passende Vorschläge. Vorhandener Suchtext bleibt erhalten; bei ausgeschalteter KI erfolgt keine automatische Eingabe. Die Suche startet erst über „Suchen“.

Der No-Result-Direkteinstieg zeigt vorausgewählte, entfernbare Kriterien, die keine Beispielanzeige gemeinsam erfüllt. Die Kategorieempfehlung „Sofas & Sitzgarnituren“ startet eine breitere Suche ohne diese Kriterien und zeigt nach Waiting simulierte High-Ergebnisse.

Im No-Result-State wählt ein Klick auf einen alternativen Suchbegriff zunächst nur den Chip aus. Ein weiterer Klick entfernt die Auswahl, ein anderer Chip ersetzt sie. Erst „Neu suchen“ startet die Suche mit dem ausgewählten Begriff; ohne Auswahl ist der Link deaktiviert.

Im Bereich **Suchergebnisse** wird in jedem Ergebniszustand nur eine normale Beispielanzeige gezeigt, damit der Wireframe kompakt bleibt.

**(optional)** neben der KI-Suchhilfe bzw. den KI-Suchvorschlägen öffnet ein Infofenster zur Funktion und zur Datenverarbeitung im Prototyp. Dasselbe Fenster ist über „Mehr über die KI-Suche erfahren“ erreichbar. Es lässt sich mit „Verstanden“, Escape oder einem Klick außerhalb schließen; der Tastaturfokus kehrt zum Auslöser zurück.

- **Chip antippen** wählt aus, **nochmal antippen** entfernt die Auswahl, in jedem Zustand. Ausgewählte Chips zeigen ein kleines **×**.
- **High → Suche anpassen** bleibt im High State und zeigt Suchtext und gewählte Kriterien direkt im grünen Hinweisfeld als ausgewählte Chips. Begriffe lassen sich antippen und entfernen; Maße, Preis, Farbe, Umkreis, Lieferung und Zustand lassen sich über den Pfeil bearbeiten oder über × entfernen. Das × oben rechts schließt die Bearbeitung und zeigt wieder den aktualisierten Hinweis. Auch die weißen Bearbeitungsfelder lassen sich über ein × schließen. Änderungen bleiben erhalten. Unter den normalen Suchergebnissen bleibt eine Beispielkarte mit TOP.
- **"Von dir gewählt"** zeigt höchstens zwei Reihen. "… anpassen" öffnet alle Chips, ein Tipp auf den Text öffnet das Auswahlfeld zum Umschalten, das × entfernt.
- **KI-Schalter aus und wieder an** setzt alle Auswahlen zurück (Chips, Umkreis, Lieferung, Zustand, Eingrenzungen). Suchtext und Kategorie bleiben.
- **Low Confidence** zeigt die Zahl der Ergebnisse je nach Anzahl der Auswahlen: 312, 148, 61, dann 22.
- **High Confidence** zeigt höchstens 2 Karten, bei aktiven Filtern höchstens 3. Gibt es keine Karte, die **alle** Kriterien erfüllt, steht dort "Keine Anzeige erfüllt alle deine Kriterien". Das Feedback "Passt der Hinweis?" steht dann ganz unten.
- **Daumen runter** blendet den grünen Hinweis aus und zeigt "Danke für dein Feedback".
- Karten sind erfunden: Preis, Breite, Entfernung, Versand, Zustand und Farbe stehen im Code im Objekt `L` in `src/app.js`.

## Lokal starten

Keine Installation nötig. Die Schrift Inter liegt lokal im Projekt (assets/fonts/inter.woff2, Lizenz in assets/fonts/OFL-Inter.txt), es werden keine Anfragen an Google gesendet.

```bash
# Variante 1: direkt im Browser öffnen
open index.html            # macOS
start index.html           # Windows

# Variante 2: kleiner lokaler Server (z. B. mit Python)
python3 -m http.server 8000
# danach http://localhost:8000 öffnen
```

In VS Code geht es auch mit der Erweiterung **Live Server** (Rechtsklick auf `index.html`, "Open with Live Server").

## Test in Maze

1. Prototyp über GitHub Pages veröffentlichen (siehe unten)
2. In Maze einen Website-Test-Block anlegen und die Pages-URL eintragen
3. Aufgaben, Erfolgskriterien und Tracking siehe [docs/PROJECT.md](docs/PROJECT.md)
4. Vor dem Versand selbst pilotieren

## Veröffentlichen mit GitHub Pages

Der Workflow `.github/workflows/pages.yml` veröffentlicht `index.html` sowie die Ordner `src/` und `assets/` bei jedem Push auf `main`.

1. Repository auf GitHub anlegen und pushen
2. Auf GitHub: **Settings, Pages, Source: GitHub Actions**
3. Push auf `main` löst das Deployment aus
4. URL: `https://<dein-github-name>.github.io/<repo-name>/`

Achtung: Pages ist öffentlich. Bei privaten Repositories braucht Pages einen bezahlten GitHub-Plan.

## Projektstruktur

```
.
├── index.html                  Prototyp (Markup)
├── src/
│   ├── styles.css              Gestaltung
│   └── app.js                  Verhalten und Zustände
├── assets/
│   └── fonts/
│       ├── inter.woff2         Schrift Inter (lokal eingebunden)
│       └── OFL-Inter.txt       Lizenz der Schrift (SIL Open Font License)
├── docs/
│   └── PROJECT.md              Experiment-Plan (Lesson 7)
├── README.md                   Diese Datei
└── .github/workflows/
    └── pages.yml               Deployment auf GitHub Pages
```

## Dokumentation

- Experiment-Plan: [docs/PROJECT.md](docs/PROJECT.md)
- PRD: 🔴 MUST Link zum "Kleinanzeigen Discovery AI Feature PRD" hier einfügen

## Offene Punkte

| Status | Punkt |
|---|---|
| 🔴 MUST | PRD-Link in README und docs/PROJECT.md eintragen |
| 🟡 CHECK | Cut-off 0,7 mit dem Wert in Figma und den Zielen im PRD abgleichen |
| 🔵 ASK | Wird in Maze ein Pflicht-Pilot vom Kurs verlangt? |
| 🟢 DONE | Prototyp mit 6 Zuständen, Eingrenzen, Szenarien und Moderationsleiste |

## Autorin

Mandy Jendroska (@soulfreelancer), Weiterbildung AI-Native Designer.
