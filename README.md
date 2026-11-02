# Kleinanzeigen Discovery Assistant (Prototyp)

Stand: 02.11.2026

Klickbarer Prototyp für ein KI-Feature in der Suche von Kleinanzeigen. Entstanden im Modulprojekt 2 der Weiterbildung **AI-Native Designer**.

> **Hinweis:** Lernprojekt ohne Verbindung zu Kleinanzeigen. Alle Daten sind erfunden, es läuft **kein echtes Modell**. Getestet wird die Oberfläche um das Modell, nicht die Modellqualität.

## Idee in einem Satz

Käufer:innen beschreiben in eigenen Worten, was sie suchen. Der Assistent schlägt Kategorie und Suchbegriffe vor, zeigt Trefferhinweise aus dem Anzeigentext und bleibt dabei optional und transparent.

## Zustände des Prototyps

| Zustand | Was passiert |
|---|---|
| Cold Start | Sucheingabe, Kategorie-Vorschlag, Chips, KI-Schalter |
| Waiting | Ladezustand, nach 6 s "Suche abbrechen" |
| High Confidence | Treffer mit Hinweisen (Angaben aus dem Anzeigentext), Daumen-Feedback |
| Low Confidence | Keine sicher begründete Empfehlung, Suche per Chips eingrenzen |
| No Result | Kategorieempfehlung und alternative Suchbegriffe |
| Failure | Fehlermeldung, normale Ergebnisse bleiben sichtbar |

## Lokal starten

Keine Installation nötig. Es ist eine einzelne Datei.

```bash
# Variante 1: direkt im Browser öffnen
open index.html            # macOS
start index.html           # Windows

# Variante 2: kleiner lokaler Server (z. B. mit Python)
python3 -m http.server 8000
# danach http://localhost:8000 öffnen
```

In VS Code geht es auch mit der Erweiterung **Live Server** (Rechtsklick auf `index.html`, "Open with Live Server").

## Moderationsmodus (für Tests)

Hänge `#mod` an die URL, dann erscheint unter dem Telefon die Leiste "Moderation":

- direkt in jeden Zustand springen
- das nächste KI-Ergebnis festlegen (High, Low, No Result, Failure, Langsam)

Für Testpersonen den Link **ohne** `#mod` verwenden.

## Test in Maze

1. Prototyp über GitHub Pages veröffentlichen (siehe unten)
2. In Maze einen Website-Test-Block anlegen und die Pages-URL eintragen
3. Aufgaben, Erfolgskriterien und Tracking siehe [docs/PROJECT.md](docs/PROJECT.md)
4. Vor dem Versand selbst pilotieren

## Veröffentlichen mit GitHub Pages

Der Workflow `.github/workflows/pages.yml` veröffentlicht `index.html` bei jedem Push auf `main`.

1. Repository auf GitHub anlegen und pushen
2. Auf GitHub: **Settings, Pages, Source: GitHub Actions**
3. Push auf `main` löst das Deployment aus
4. URL: `https://<dein-github-name>.github.io/<repo-name>/`

Achtung: Pages ist öffentlich. Bei privaten Repositories braucht Pages einen bezahlten GitHub-Plan.

## Projektstruktur

```
.
├── index.html                  Prototyp (HTML, CSS, JS in einer Datei)
├── README.md                   Diese Datei
├── docs/
│   └── PROJECT.md              Experiment-Plan (Lesson 7)
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
| 🟡 CHECK | Schwellenwerte mit den Zielen im PRD abgleichen |
| 🔵 ASK | Wird in Maze ein Pflicht-Pilot vom Kurs verlangt? |
| 🟢 DONE | Prototyp mit 6 Zuständen und Moderationsleiste |

## Autorin

Mandy Jendroska (@soulfreelancer), Weiterbildung AI-Native Designer.
