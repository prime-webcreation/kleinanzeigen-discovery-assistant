# Test-Produktkarten

Die Daten stehen in [src/produkte.js](../src/produkte.js). Die Haken und Hinweise auf den Karten sind **nicht von Hand gesetzt**, sondern werden in `src/app.js` aus diesen Angaben berechnet (`evalCard`). Ändert man die Daten, ändern sich die Haken mit.

## Regeln

Jedes aktive Kriterium wird pro Karte einzeln geprüft. Das Ergebnis ist ok (Haken), fehlt (Angabe nicht vorhanden) oder nicht erfüllt.

| Kriterium | Haken, wenn |
|---|---|
| Typ-Chips (2-Sitzer, Kompakter 3-Sitzer, Ecksofa, Couch, kleines Sofa) | die Karte mindestens einen der gewählten Typen hat (ODER) |
| Chip < 200 € | Preis unter 200 € |
| Chip < 180cm | Breite unter 180 cm |
| Preis < N oder > N | Preis unter N beziehungsweise über N (genau N zählt nicht) |
| Breite < N | Breite unter N cm (genau N zählt nicht) |
| Umkreis | Entfernung bis einschließlich N km |
| Lieferung | gewählte Lieferart ist bei der Karte angegeben |
| Zustand | Zustand stimmt überein |
| Farbe | Farbe stimmt überein |

Alle Kriterien zusammen gelten als UND, nur die Typ-Chips untereinander als ODER. Ein Suchtext mit dem Wort "Versand" zählt wie die Lieferart Versand.

## Wo die Karten erscheinen

- **High-Confidence:** nur Karten aus der Gruppe sicher (alle Angaben vorhanden), die **alle** Kriterien erfüllen. Es werden höchstens 3 Karten gezeigt (2, wenn keine Kriterien gewählt sind). Jede Karte zeigt für jedes Kriterium einen Haken. Ohne Kriterien zeigt sie ihre festen Kurzinfos (Feld `f`). Erfüllt keine Karte alle Kriterien, erscheint "Keine Anzeige erfüllt alle deine Kriterien".
- **Low-Confidence:** Karten aus der Gruppe unsicher (mindestens eine Angabe fehlt oder soll geprüft werden), die **keinem** Kriterium widersprechen. Karten, bei denen eine Angabe zu einem aktiven Kriterium fehlt, kommen zuerst. Es werden höchstens 2 Karten gezeigt. Auf jeder Karte steht in einer Zeile, welche Angaben fehlen ("ⓘ Größe, Farbe nicht angegeben"), darunter die erfüllten Kriterien mit Haken. Stammt die Breite nur aus dem Anzeigentext (`wCheck`), steht "Breite N cm, bitte prüfen". Passt die Breite zur gewählten Obergrenze, steht stattdessen ein Haken.
- **No Result:** Beispiel mit 2-Sitzer, Versand, Breite < 160 cm und < 50 €. Entfernt man genau eines dieser Kriterien, gibt es Treffer: ohne 2-Sitzer S07, ohne Versand S05, ohne Breite S06, ohne < 50 € S01, S02 und S18.

## Sichere Karten (High)

| ID | Titel | Preis | Breite | Entfernung | Lieferart | Zustand | Farbe | Typ | Grenzfall |
|---|---|---|---|---|---|---|---|---|---|
| S01 | Kleines grünes Sofa | 140 € | 140 cm | 8 km | Versand + Abholung | Gebraucht | Grün | 2-Sitzer, kleines Sofa | Standardfall, zwei Typen |
| S02 | Zweisitzer wie neu | 95 € | 150 cm | 30 km | Versand | Neu | Weiß | 2-Sitzer | nur Versand, neu |
| S03 | Kleines Sofa mit Stauraum | 80 € | 165 cm | 6 km | Versand + Abholung | Gebraucht | Grau | kleines Sofa | Breite zwischen 160 und 180 |
| S04 | Gut erhaltene Couch | 140 € | 140 cm | 14 km | Versand + Abholung | Gebraucht | Beige | Couch | Couch, beige |
| S05 | 2-Sitzer Samt, schmal | 49 € | 145 cm | 3 km | Abholung | Gebraucht | Blau | 2-Sitzer | 2-Sitzer unter 50 € und unter 160 cm, nur Abholung (kein Versand) |
| S06 | 2-Sitzer Ledersofa, breit | 48 € | 165 cm | 19 km | Versand | Gebraucht | Braun | 2-Sitzer | 2-Sitzer unter 50 € mit Versand, aber nicht unter 160 cm |
| S07 | Kleine Couch zum Verschenken | 35 € | 150 cm | 49 km | Versand | Gebraucht | Beige | Couch | unter 50 €, unter 160 cm, Versand, aber kein 2-Sitzer |
| S08 | Kompakter Dreisitzer, grün | 190 € | 170 cm | 20 km | Versand + Abholung | Gebraucht | Grün | Kompakter 3-Sitzer | Entfernung genau 20 km |
| S09 | 3-Sitzer, kompakt und bequem | 299 € | 180 cm | 50 km | Versand | Neu | Grau | Kompakter 3-Sitzer | Breite genau 180 cm (nicht unter 180), Entfernung genau 50 km |
| S10 | Kleines Ecksofa, hellgrau | 249 € | 175 cm | 80 km | Abholung | Gebraucht | Grau | Ecksofa | nur Abholung, weit entfernt |
| S11 | Ecksofa in Anthrazit | 450 € | 195 cm | 120 km | Versand + Abholung | Neu | Schwarz | Ecksofa | über 100 km, über 200 cm |
| S12 | Ecksofa mit Hocker | 199 € | 181 cm | 14 km | Versand | Gebraucht | Braun | Ecksofa | Breite 181 cm (knapp über 180), Preis 199 € (knapp unter 200) |
| S13 | Couch in Beige | 100 € | 159 cm | 5 km | Versand + Abholung | Gebraucht | Beige | Couch | Preis genau 100 € (nicht unter 100), Breite 159 cm (knapp unter 160) |
| S14 | Couch, sehr bequem | 520 € | 210 cm | 30 km | Abholung | Neu | Blau | Couch | teuerste Karte, breiteste Karte |
| S15 | Kleines Sofa in Grau | 50 € | 130 cm | 20 km | Versand + Abholung | Gebraucht | Grau | kleines Sofa | Preis genau 50 € (weder unter noch über 50), Entfernung genau 20 km |
| S16 | Kleines Sofa, gut erhalten | 120 € | 160 cm | 10 km | Versand | Gebraucht | Schwarz | kleines Sofa | Breite genau 160 cm (nicht unter 160) |
| S17 | Kleines Sofa in Weiß | 75 € | 125 cm | 9 km | Versand + Abholung | Neu | Weiß | kleines Sofa | schmalste Karte, neu |
| S18 | Kleines Sofa, Stoff braun | 85 € | 135 cm | 7 km | Versand | Gebraucht | Braun | kleines Sofa, 2-Sitzer | zwei Typen |
| S19 | Zweisitzer in Blau | 200 € | 155 cm | 11 km | Versand + Abholung | Neu | Blau | 2-Sitzer | Preis genau 200 € (nicht unter 200) |
| S20 | Kleines Sofa in Beige | 99 € | 128 cm | 6 km | Abholung | Gebraucht | Beige | kleines Sofa | nur Abholung, Preis 99 € (knapp unter 100) |
| S21 | Couch mit Armlehnen | 150 € | 150 cm | 18 km | Versand | Gebraucht | Schwarz | Couch | Couch, schwarz |
| S22 | Zweisitzer in Grün, neuwertig | 160 € | 140 cm | 25 km | Versand + Abholung | Neu | Grün | 2-Sitzer | neu, grün |

## Unsichere Karten (Low)

| ID | Titel | Preis | Breite | Entfernung | Lieferart | Zustand | Farbe | Typ | Grenzfall |
|---|---|---|---|---|---|---|---|---|---|
| U01 | Sofa aus Stoff (in echt kleiner) | 75 € VB | fehlt | 12 km | Versand | Gebraucht | Grau | keiner | Breite fehlt |
| U02 | Gut erhaltene Couch | 140 € | 140 cm (nur aus dem Text) | 14 km | Versand + Abholung | Gebraucht | Beige | Couch | Breite nur aus dem Anzeigentext, bitte prüfen |
| U03 | Sofa, Farbe siehe Foto | 130 € | 145 cm | 9 km | Versand + Abholung | Gebraucht | fehlt | 2-Sitzer | Farbe fehlt |
| U04 | Zweisitzer, Zustand unbekannt | 70 € | 150 cm | 22 km | Versand | fehlt | Grau | 2-Sitzer | Zustand fehlt |
| U05 | Ecksofa, Lieferung nach Absprache | 260 € | 175 cm | 16 km | fehlt | Gebraucht | Beige | Ecksofa | Lieferart fehlt |
| U06 | Couch, Standort unklar | 90 € | 155 cm | fehlt | Versand + Abholung | Gebraucht | Braun | Couch | Entfernung fehlt |
| U07 | Sofa klein, Maße im Text | 60 € | 130 cm (nur aus dem Text) | 7 km | Abholung | Gebraucht | Grün | kleines Sofa | Breite nur aus dem Anzeigentext, nur Abholung |
| U08 | Dreisitzer, Maße fehlen | 210 € | fehlt | 40 km | Versand | Gebraucht | Grau | Kompakter 3-Sitzer | Breite fehlt, Preis über 200 € |
| U09 | Sofa, Typ nicht klar | 55 € | 140 cm | 11 km | Versand + Abholung | Neu | Schwarz | fehlt | Typ nicht erkennbar |
| U10 | Kleines Sofa, Breite 190 laut Text | 110 € | 190 cm (nur aus dem Text) | 8 km | Versand | Gebraucht | Weiß | kleines Sofa | Breite 190 cm nur aus dem Anzeigentext |
| U11 | Sofa, kaum Angaben | 45 € | fehlt | 25 km | Versand | fehlt | fehlt | fehlt | viele Angaben fehlen, Preis unter 50 € |

## Abgedeckt

- **Preis:** 35 bis 520 €, mit den Grenzwerten 49, 50, 99, 100, 199 und 200 €.
- **Breite:** 125 bis 210 cm, mit den Grenzwerten 159, 160, 180 und 181 cm. Genau 160 und genau 180 cm sind **nicht** unter 160 beziehungsweise 180.
- **Entfernung:** 3 bis 120 km, mit den Grenzwerten 20 und 50 km (zählen als innerhalb).
- **Lieferart:** nur Versand, nur Abholung, beides, fehlt.
- **Zustand:** Neu, Gebraucht, fehlt.
- **Farbe:** Weiß, Schwarz, Grau, Beige, Braun, Grün, Blau, fehlt.
- **Typ:** alle fünf Typ-Chips, zwei Typen auf einer Karte (S01, S18), kein Vorschlagstyp (U01), nicht erkennbar (U09, U11).

## Prüfen

Mit `?test` hinter der URL (zum Beispiel `index.html?test`) legt der Prototyp `window.__da` an, damit sich Filterkombinationen automatisch durchspielen lassen. Ohne `?test` gibt es diesen Zugang nicht. Geprüft wurden 720 Kombinationen je für High und Low gegen eine unabhängige Berechnung aus den Rohdaten (Treffer, Haken, Hinweise "nicht angegeben" und "bitte prüfen").
