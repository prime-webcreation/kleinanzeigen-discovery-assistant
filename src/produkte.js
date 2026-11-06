/* Test-Produktkarten für den KI-Prototyp (Daten, keine Logik).
   Jede Karte hat feste Angaben. Die Haken und Hinweise in den Ergebnissen werden
   in src/app.js aus diesen Angaben berechnet (evalCard), nichts davon ist von Hand gesetzt.

   Felder
     id     kurze Kennung (nur zum Nachschlagen in docs/TESTDATEN.md)
     t      Titel
     p      Preis als Text (wie angezeigt), price = Preis als Zahl in Euro
     ort    Ortsangabe
     w      Breite in cm, null = nicht angegeben
     km     Entfernung in km, null = nicht angegeben
     ship   ['Versand','Abholung'] oder Teilmenge, null = nicht angegeben
     cond   'Neu' | 'Gebraucht', null = nicht angegeben
     col    Farbe, null = nicht angegeben
     tags   Sofa-Typen: '2-Sitzer','Kompakter 3-Sitzer','Ecksofa','Couch','kleines Sofa';
            [] = Typ bekannt, aber keiner der Vorschläge; null = Typ nicht erkennbar
     wCheck true = Breite stammt nur aus dem Anzeigentext und soll geprüft werden
     f      feste Kurzinfos für den Fall, dass keine Kriterien gewählt sind
     grenz  Notiz, welchen Grenzfall die Karte abdeckt (nur Doku)

   sicher:    alle Angaben vorhanden, erscheinen im High-Confidence-State
   unsicher:  mindestens eine Angabe fehlt oder ist zu prüfen, erscheinen im Low-Confidence-State */
window.PRODUKTE={
sicher:[
 {id:'S01',t:'Kleines grünes Sofa',p:'140 €',price:140,ort:'Ort',w:140,km:8,ship:['Versand','Abholung'],cond:'Gebraucht',col:'Grün',tags:['2-Sitzer','kleines Sofa'],f:['140x120cm','2-Sitzer'],grenz:'Standardfall, zwei Typen'},
 {id:'S02',t:'Zweisitzer wie neu',p:'95 €',price:95,ort:'Ort',w:150,km:30,ship:['Versand'],cond:'Neu',col:'Weiß',tags:['2-Sitzer'],f:['150x90cm','2-Sitzer'],grenz:'nur Versand, neu'},
 {id:'S03',t:'Kleines Sofa mit Stauraum',p:'80 €',price:80,ort:'Ort',w:165,km:6,ship:['Versand','Abholung'],cond:'Gebraucht',col:'Grau',tags:['kleines Sofa'],f:['165x85cm'],grenz:'Breite zwischen 160 und 180'},
 {id:'S04',t:'Gut erhaltene Couch',p:'140 €',price:140,ort:'Ort',w:140,km:14,ship:['Versand','Abholung'],cond:'Gebraucht',col:'Beige',tags:['Couch'],f:['140x120cm'],grenz:'Couch, beige'},
 {id:'S05',t:'2-Sitzer Samt, schmal',p:'49 €',price:49,ort:'Ort',w:145,km:3,ship:['Abholung'],cond:'Gebraucht',col:'Blau',tags:['2-Sitzer'],f:['145x80cm','2-Sitzer'],grenz:'2-Sitzer unter 50 € und unter 160 cm, nur Abholung (kein Versand)'},
 {id:'S06',t:'2-Sitzer Ledersofa, breit',p:'48 €',price:48,ort:'Ort',w:165,km:19,ship:['Versand'],cond:'Gebraucht',col:'Braun',tags:['2-Sitzer'],f:['165x85cm','2-Sitzer'],grenz:'2-Sitzer unter 50 € mit Versand, aber nicht unter 160 cm'},
 {id:'S07',t:'Kleine Couch zum Verschenken',p:'35 €',price:35,ort:'Ort',w:150,km:49,ship:['Versand'],cond:'Gebraucht',col:'Beige',tags:['Couch'],f:['150x85cm'],grenz:'unter 50 €, unter 160 cm, Versand, aber kein 2-Sitzer'},
 {id:'S08',t:'Kompakter Dreisitzer, grün',p:'190 €',price:190,ort:'Ort',w:170,km:20,ship:['Versand','Abholung'],cond:'Gebraucht',col:'Grün',tags:['Kompakter 3-Sitzer'],f:['170x90cm','3-Sitzer'],grenz:'Entfernung genau 20 km'},
 {id:'S09',t:'3-Sitzer, kompakt und bequem',p:'299 €',price:299,ort:'Ort',w:180,km:50,ship:['Versand'],cond:'Neu',col:'Grau',tags:['Kompakter 3-Sitzer'],f:['180x90cm','3-Sitzer'],grenz:'Breite genau 180 cm (nicht unter 180), Entfernung genau 50 km'},
 {id:'S10',t:'Kleines Ecksofa, hellgrau',p:'249 €',price:249,ort:'Ort',w:175,km:80,ship:['Abholung'],cond:'Gebraucht',col:'Grau',tags:['Ecksofa'],f:['175x140cm','Ecksofa'],grenz:'nur Abholung, weit entfernt'},
 {id:'S11',t:'Ecksofa in Anthrazit',p:'450 €',price:450,ort:'Ort',w:195,km:120,ship:['Versand','Abholung'],cond:'Neu',col:'Schwarz',tags:['Ecksofa'],f:['195x150cm','Ecksofa'],grenz:'über 100 km, über 200 cm'},
 {id:'S12',t:'Ecksofa mit Hocker',p:'199 €',price:199,ort:'Ort',w:181,km:14,ship:['Versand'],cond:'Gebraucht',col:'Braun',tags:['Ecksofa'],f:['181x140cm','Ecksofa'],grenz:'Breite 181 cm (knapp über 180), Preis 199 € (knapp unter 200)'},
 {id:'S13',t:'Couch in Beige',p:'100 €',price:100,ort:'Ort',w:159,km:5,ship:['Versand','Abholung'],cond:'Gebraucht',col:'Beige',tags:['Couch'],f:['159x85cm'],grenz:'Preis genau 100 € (nicht unter 100), Breite 159 cm (knapp unter 160)'},
 {id:'S14',t:'Couch, sehr bequem',p:'520 €',price:520,ort:'Ort',w:210,km:30,ship:['Abholung'],cond:'Neu',col:'Blau',tags:['Couch'],f:['210x95cm'],grenz:'teuerste Karte, breiteste Karte'},
 {id:'S15',t:'Kleines Sofa in Grau',p:'50 €',price:50,ort:'Ort',w:130,km:20,ship:['Versand','Abholung'],cond:'Gebraucht',col:'Grau',tags:['kleines Sofa'],f:['130x80cm'],grenz:'Preis genau 50 € (weder unter noch über 50), Entfernung genau 20 km'},
 {id:'S16',t:'Kleines Sofa, gut erhalten',p:'120 €',price:120,ort:'Ort',w:160,km:10,ship:['Versand'],cond:'Gebraucht',col:'Schwarz',tags:['kleines Sofa'],f:['160x80cm'],grenz:'Breite genau 160 cm (nicht unter 160)'},
 {id:'S17',t:'Kleines Sofa in Weiß',p:'75 €',price:75,ort:'Ort',w:125,km:9,ship:['Versand','Abholung'],cond:'Neu',col:'Weiß',tags:['kleines Sofa'],f:['125x75cm'],grenz:'schmalste Karte, neu'},
 {id:'S18',t:'Kleines Sofa, Stoff braun',p:'85 €',price:85,ort:'Ort',w:135,km:7,ship:['Versand'],cond:'Gebraucht',col:'Braun',tags:['kleines Sofa','2-Sitzer'],f:['135x80cm','2-Sitzer'],grenz:'zwei Typen'},
 {id:'S19',t:'Zweisitzer in Blau',p:'200 €',price:200,ort:'Ort',w:155,km:11,ship:['Versand','Abholung'],cond:'Neu',col:'Blau',tags:['2-Sitzer'],f:['155x85cm','2-Sitzer'],grenz:'Preis genau 200 € (nicht unter 200)'},
 {id:'S20',t:'Kleines Sofa in Beige',p:'99 €',price:99,ort:'Ort',w:128,km:6,ship:['Abholung'],cond:'Gebraucht',col:'Beige',tags:['kleines Sofa'],f:['128x78cm'],grenz:'nur Abholung, Preis 99 € (knapp unter 100)'},
 {id:'S21',t:'Couch mit Armlehnen',p:'150 €',price:150,ort:'Ort',w:150,km:18,ship:['Versand'],cond:'Gebraucht',col:'Schwarz',tags:['Couch'],f:['150x90cm'],grenz:'Couch, schwarz'},
 {id:'S22',t:'Zweisitzer in Grün, neuwertig',p:'160 €',price:160,ort:'Ort',w:140,km:25,ship:['Versand','Abholung'],cond:'Neu',col:'Grün',tags:['2-Sitzer'],f:['140x85cm','2-Sitzer'],grenz:'neu, grün'}
],
unsicher:[
 {id:'U01',t:'Sofa aus Stoff (in echt kleiner)',p:'75 € VB',price:75,ort:'Ort',w:null,km:12,ship:['Versand'],cond:'Gebraucht',col:'Grau',tags:[],grenz:'Breite fehlt'},
 {id:'U02',t:'Gut erhaltene Couch',p:'140 €',price:140,ort:'Ort',w:140,km:14,ship:['Versand','Abholung'],cond:'Gebraucht',col:'Beige',tags:['Couch'],wCheck:true,grenz:'Breite nur aus dem Anzeigentext, bitte prüfen'},
 {id:'U03',t:'Sofa, Farbe siehe Foto',p:'130 €',price:130,ort:'Ort',w:145,km:9,ship:['Versand','Abholung'],cond:'Gebraucht',col:null,tags:['2-Sitzer'],grenz:'Farbe fehlt'},
 {id:'U04',t:'Zweisitzer, Zustand unbekannt',p:'70 €',price:70,ort:'Ort',w:150,km:22,ship:['Versand'],cond:null,col:'Grau',tags:['2-Sitzer'],grenz:'Zustand fehlt'},
 {id:'U05',t:'Ecksofa, Lieferung nach Absprache',p:'260 €',price:260,ort:'Ort',w:175,km:16,ship:null,cond:'Gebraucht',col:'Beige',tags:['Ecksofa'],grenz:'Lieferart fehlt'},
 {id:'U06',t:'Couch, Standort unklar',p:'90 €',price:90,ort:'Ort',w:155,km:null,ship:['Versand','Abholung'],cond:'Gebraucht',col:'Braun',tags:['Couch'],grenz:'Entfernung fehlt'},
 {id:'U07',t:'Sofa klein, Maße im Text',p:'60 €',price:60,ort:'Ort',w:130,km:7,ship:['Abholung'],cond:'Gebraucht',col:'Grün',tags:['kleines Sofa'],wCheck:true,grenz:'Breite nur aus dem Anzeigentext, nur Abholung'},
 {id:'U08',t:'Dreisitzer, Maße fehlen',p:'210 €',price:210,ort:'Ort',w:null,km:40,ship:['Versand'],cond:'Gebraucht',col:'Grau',tags:['Kompakter 3-Sitzer'],grenz:'Breite fehlt, Preis über 200 €'},
 {id:'U09',t:'Sofa, Typ nicht klar',p:'55 €',price:55,ort:'Ort',w:140,km:11,ship:['Versand','Abholung'],cond:'Neu',col:'Schwarz',tags:null,grenz:'Typ nicht erkennbar'},
 {id:'U10',t:'Kleines Sofa, Breite 190 laut Text',p:'110 €',price:110,ort:'Ort',w:190,km:8,ship:['Versand'],cond:'Gebraucht',col:'Weiß',tags:['kleines Sofa'],wCheck:true,grenz:'Breite 190 cm nur aus dem Anzeigentext'},
 {id:'U11',t:'Sofa, kaum Angaben',p:'45 €',price:45,ort:'Ort',w:null,km:25,ship:['Versand'],cond:null,col:null,tags:null,grenz:'viele Angaben fehlen, Preis unter 50 €'}
]
};
