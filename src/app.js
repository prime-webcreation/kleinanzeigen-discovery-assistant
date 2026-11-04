/* Discovery Assistant Prototyp - Stand: 02.11.2026
   Zustand (S), Inhalte, Render-Funktionen, Events. Kein echtes Modell. */
(function(){
var $=function(s){return document.querySelector(s)};
var S={view:'cold',ki:true,q:'',cat:'Möbel & Wohnen',catPick:null,prev:null,chips:[],t:[],scenario:'auto',retry:false,sheet:false,toast:'',radius:'',delivery:'',cond:'',refine:{},open:'',draft:{},fbDone:false,selOpen:false,edit:'',highEdit:false,aborted:false,termPick:''};
var RADII=[5,10,20,50,100];
var CHIPS=['2-Sitzer','< 180cm','kleines Sofa','Ecksofa','< 200 €','Couch','Kompakter 3-Sitzer'];
var CATS=['Möbel & Wohnen','Haus & Garten','Elektronik','Mode & Beauty'];
var L={
 a:{t:'Kleines grünes Sofa',p:'140 €',f:['140x120cm','2-Sitzer'],ort:'Berlin',m:{w:140,km:8,ship:['Versand','Abholung'],cond:'Gebraucht',col:'Grün',tags:['2-Sitzer','kleines Sofa']}},
 h:{t:'Zweisitzer wie neu',p:'95 €',f:['150x90cm','2-Sitzer'],ort:'Hamburg',m:{w:150,km:30,ship:['Versand'],cond:'Neu',col:'Weiß',tags:[]}},
 i:{t:'Kleines Sofa mit Stauraum',p:'80 €',f:['165x85cm'],ort:'Köln',m:{w:165,km:6,ship:['Versand','Abholung'],cond:'Gebraucht',col:'Grau',tags:[]}},
 b:{t:'Gut erhaltene Couch',p:'140 €',f:['140x120cm'],ort:'Ort',m:{w:140,km:14,ship:['Versand','Abholung'],cond:'Neu',col:'Beige',tags:['Couch']}},
 c:{t:'Sofa aus Stoff (in echt kleiner)',p:'75 € VB',miss:'Größe nicht angegeben',ort:'Ort',m:{w:null,km:12,ship:['Versand'],cond:'Gebraucht'}},
 d:{t:'Graues Stoffsofa',p:'140 €',top:1,ort:'Ort'},
 e:{t:'Kleines Stoffsofa, 2-Sitzer',p:'140 €',top:1,ort:'Ort'},
 f:{t:'Schlafsofa, gut erhalten',p:'110 € VB',ort:'Ort'},
 g:{t:'Sofa aus Stoff',p:'75 € VB',ort:'Ort'}
};
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function clearT(){S.t.forEach(clearTimeout);S.t=[]}
var AIV=['waiting','high','low','none','fail'];
function anchorY(){var el=$('.kirow'),bar=$('.statebar'),offset=bar?bar.getBoundingClientRect().bottom:0;return el?Math.max(0,el.getBoundingClientRect().top+window.pageYOffset-Math.max(0,offset)-8):0}
function ensureRoom(){if(!S.ki||AIV.indexOf(S.view)<0)return;var sc=$('.scr');if(!sc)return;var need=anchorY()+window.innerHeight-document.documentElement.scrollHeight;if(need>0)sc.style.paddingBottom=(84+need)+'px'}
function anchorKI(){ensureRoom();var rm=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;window.scrollTo({top:anchorY(),behavior:rm?'auto':'smooth'})}
function go(v){clearT();if(v!=='plain')S.aborted=false;S.highEdit=false;S.termPick='';if(v==='cold'){S.prev=(S.view!=='cold'&&S.view!=='waiting')?S.view:null}else{S.prev=null}S.view=v;S.sheet=false;render();if(v==='high'||v==='low'||v==='none'||v==='fail')anchorKI();else window.scrollTo(0,0)}
function toast(m){S.toast=m;render();setTimeout(function(){S.toast='';render()},2200)}
var RELOAD='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.6-5.9"/><path d="M20 4v5h-5"/></svg>';
var SPARK='<svg viewBox="0 0 26 26" fill="none" stroke="#339E29" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l6 6M8.5 11h5M11 8.5v5"/><path d="M20 3v4M18 5h4" stroke="#8FCB7F"/></svg>';
var KISP='<svg viewBox="0 0 26 26" fill="none" stroke="#339E29" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="12" r="5.5"/><path d="M15.5 16.5l5 5"/><path class="star s1" d="M20 3v5M17.5 5.5h5" stroke="#8FCB7F"/><path class="star s2" d="M5 19v3M3.5 20.5h3" stroke="#8FCB7F" stroke-width="1.8"/></svg>';
var WARN='<svg class="warn" viewBox="0 0 44 44" fill="none" stroke="#339E29" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 6L40 38H4z"/><path d="M22 17v12M22 33v1"/></svg>';

function header(){
  var txt=S.view==='cold'?'':esc(S.q);
  return '<div class="hdr"><button class="hbtn" data-a="back" aria-label="Zurück zur Sucheingabe"><svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#2A2A2A" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3L6 11l8 8"/></svg></button><span class="logo" aria-hidden="true">k</span><span class="sep"></span>'+
  '<button class="hsearch" data-a="edit" aria-label="Suche ändern"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#5D5D5D" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><circle cx="7.5" cy="7.5" r="5"/><path d="M11.5 11.5l5 5"/></svg><span>'+txt+'</span></button></div><div class="stripe"></div>';
}
function cnt(t){return '<div class="cnt">'+t+'</div>'}
function sponsored(){
  return '<div class="sp-h"><b>Gesponsert</b> · Ähnliche Produkte &nbsp;›</div><div class="scroller">'+
  '<div class="scard"><div class="pi"></div><div class="tx"><div>Sofa 2-Sitzer</div><div><span class="pr">79,00 €</span></div></div><span class="top">TOP</span></div>'+
  '<div class="scard"><div class="pi"></div><div class="tx"><div>Kompaktes Sofa</div><div><span class="pr">129,00 €</span></div></div></div></div><div class="hr"></div>';
}
function kirow(){
  var on=S.ki;
  return '<div class="kirow"><h2>KI-Suchhilfe'+optionalInfo()+'</h2><button class="sw-hit" data-a="kitoggle" role="switch" aria-checked="'+on+'" aria-label="KI-Suchhilfe"><span class="sw" aria-checked="'+on+'"></span></button></div><div class="kinote">ⓘ Vorschläge und Trefferhinweise sind KI-gestützt.</div>';
}
function optionalInfo(){return '<button type="button" class="optional-info" id="optional-info" data-a="info" aria-haspopup="dialog" aria-controls="ki-info" aria-label="Optional: Informationen zur KI-Suche und deinen Daten">(optional)</button>'}
var TYPES={
  '2-Sitzer':{t:['Kleines grünes Sofa, 2-Sitzer','Gepflegtes 2-Sitzer-Sofa','Zweisitzer wie neu','2-Sitzer mit Stauraum'],w:140},
  'Kompakter 3-Sitzer':{t:['Kompakter Dreisitzer, grün','3-Sitzer, kompakt und bequem','Dreisitzer, Stoff, hellgrau','Kompakter 3-Sitzer mit Hocker'],w:170},
  'Ecksofa':{t:['Kleines Ecksofa, hellgrau','Ecksofa mit Hocker','Ecksofa in Anthrazit','Kleines Ecksofa mit Bettfunktion'],w:175},
  'Couch':{t:['Gut erhaltene Couch','Couch in Beige','Couch, sehr bequem','Couch mit Armlehnen'],w:150},
  'kleines Sofa':{t:['Kleines grünes Sofa','Kleines Sofa, gut erhalten','Kleines Sofa in Grau','Kleines Sofa, 2-Sitzer'],w:130}
};
var POOL=['a','b','h','i'];
function colorOf(t){return /grün/i.test(t)?'Grün':/grau|anthrazit/i.test(t)?'Grau':/beige/i.test(t)?'Beige':''}
function adapt(k){
  var x=L[k],idx=POOL.indexOf(k);if(idx<0)return x;
  var sel=S.chips.filter(function(c){return TYPES[c]});
  if(!sel.length)return x;
  var y={},n,c=sel[idx%sel.length];for(n in x)y[n]=x[n];y.m={};for(n in x.m)y.m[n]=x.m[n];
  y.t=TYPES[c].t[idx];y.m.tags=[c];var cc=colorOf(y.t);if(cc)y.m.col=cc;y.m.w=TYPES[c].w+idx*5;
  return y;
}
function passes(x,f){
  var m=x.m||{},price=parseFloat(String(x.p).replace(',','.'));
  var chipsOk=(f.chips||[]).every(function(c){return c==='< 200 €'?price<200:c==='< 180cm'?(m.w!=null&&m.w<180):(TYPES[c]?(m.tags||[]).indexOf(c)>-1:true)});
  return chipsOk&&(!f.max||price<f.max)&&(!f.min||price>f.min)&&(!f.mass||(m.w!=null&&m.w<=f.mass))&&(!f.radius||(m.km!=null&&m.km<=f.radius))&&(!f.delivery||(m.ship||[]).indexOf(f.delivery)>-1)&&(!f.cond||m.cond===f.cond)&&(!f.color||m.col===f.color);
}
function curFlt(){
  return {max:S.refine.price&&S.refine.price.o!=='>'?parseInt(S.refine.price.n,10):0,min:S.refine.price&&S.refine.price.o==='>'?parseInt(S.refine.price.n,10):0,mass:S.refine.mass?parseInt(S.refine.mass.n,10):0,radius:S.radius?parseInt(S.radius,10):0,delivery:S.delivery,cond:S.cond==='egal'?'':S.cond,color:S.refine.color?S.refine.color.n:'',chips:S.chips};
}
function fltActive(f){return !!(f.max||f.min||f.mass||f.radius||f.delivery||f.cond||f.color||(f.chips&&f.chips.length))}
function fltLines(x,f,separate,sizeNotice){
  var m=x.m||{},ok=[],nf=[],price=parseFloat(String(x.p).replace(',','.'));
  (f.chips||[]).forEach(function(c){if(c==='< 200 €'){if(price<200)ok.push('< 200 €')}else if(c==='< 180cm'){if(m.w!=null&&m.w<180)ok.push('< 180 cm')}else if((m.tags||[]).indexOf(c)>-1)ok.push(c)});
  if(f.max&&price<f.max)ok.push('< '+f.max+' €');
  if(f.min&&price>f.min)ok.push('> '+f.min+' €');
  if(f.mass&&!sizeNotice){if(m.w==null)nf.push('Breite nicht angegeben');else if(m.w<=f.mass)ok.push('Breite '+m.w+' cm')}
  if(f.radius){if(m.km==null)nf.push('Entfernung nicht angegeben');else if(m.km<=f.radius)ok.push(m.km+' km entfernt')}
  if(f.delivery){if(!m.ship)nf.push(f.delivery+' nicht angegeben');else if(m.ship.indexOf(f.delivery)>-1)ok.push(f.delivery+' möglich')}
  if(f.cond){if(!m.cond)nf.push('Zustand nicht angegeben');else if(m.cond===f.cond)ok.push(m.cond)}
  if(f.color){if(!m.col)nf.push('Farbe nicht angegeben');else if(m.col===f.color)ok.push('Farbe '+m.col)}
  return (nf.length?'<span class="facts nf"><span>ⓘ '+nf.map(function(t){return t.replace(/ nicht angegeben$/,'')}).join(', ')+' nicht angegeben</span></span>':'')+(ok.length?'<span class="facts">'+(separate?ok.slice(0,3).map(function(t){return '<span><span class="fact-check" aria-hidden="true">✓</span> '+esc(t)+'</span>'}).join(''):'<span><span class="fact-check" aria-hidden="true">✓</span> '+ok.slice(0,3).join(', ')+(ok.length>3?' +'+(ok.length-3):'')+'</span>')+'</span>':'');
}
function listing(k,o){
  o=o||{};var x=adapt(k);var h='<button class="lst" data-a="open"><span class="im"><i></i><i></i></span><span class="ct"><span class="ort">'+x.ort+' · Heute</span>';
  if(o.kitag)h+='<span class="kitag" role="img" aria-label="KI-Vorschlag">'+SPARK+'</span>';
  h+='<span class="ti">'+esc(x.t)+'</span>';
  if(o.facts&&x.f&&!(o.flt&&fltActive(o.flt))){h+='<span class="facts">'+x.f.map(function(f){return '<span><span class="fact-check" aria-hidden="true">✓</span> '+esc(f)+'</span>'}).join('')+'</span>'}
  if(o.kib)h+='<span><span class="kib"><span class="fact-check" aria-hidden="true">✓</span> KI-Vorschlag</span> <small style="color:#aeaeae;font-size:10px">'+esc(x.f[0])+'</small></span>';
  if(x.miss&&o.miss)h+='<span class="miss">ⓘ '+esc(x.miss)+'</span>';
  if(o.why&&x.m&&x.m.w!=null)h+='<span class="miss">ⓘ Breite '+x.m.w+' cm, bitte prüfen</span>';
  var act=o.flt&&fltActive(o.flt);
  if(act)h+=fltLines(x,o.flt,o.facts,o.why);
  if(x.top)h+='<span class="dis">Gesponsert</span>';
  h+='<span class="pr">'+x.p+'</span></span>'+(x.top?'<span class="top">TOP</span>':'')+'</button>';
  return h;
}
function secFound(l){return '<div class="sec sec-ki">'+l+'<span class="pill">KI-gestützt</span></div>'}
function secNormal(){return '<div class="sec sec-n">Suchergebnisse<span class="sub"></span></div>'}
function fab(){return '<div class="fabwrap"><button class="fab" data-a="edit">Filter anpassen</button></div>'}
function foot(){return '<div class="foot">Alle Anzeigen bleiben sichtbar und auswählbar. TOP und Gesponsert sind bezahlt und nicht Teil der KI-Auswahl.</div>'}
function sheet(){
  if(!S.sheet)return'';
  return '<dialog id="ki-info" class="sheet-bg" data-a="closesheet" aria-labelledby="ki-info-title" aria-describedby="ki-info-intro"><div class="sheet" data-stop="1"><h3 id="ki-info-title">Über die KI-Suche</h3><p id="ki-info-intro">Die KI-Suchhilfe ist freiwillig. Du kannst sie jederzeit über den Schalter ausschalten.</p><h4>Was macht die Suchhilfe?</h4><p>Sie schlägt passende Kategorien und Suchbegriffe vor. Trefferhinweise beziehen sich auf Angaben im Anzeigentext und können unvollständig sein. Bitte prüfe die Anzeige selbst.</p><p>Normale Suchergebnisse bleiben verfügbar. Bezahlte Anzeigen (TOP und Gesponsert) sind von den KI-Vorschlägen getrennt.</p><h4>Was passiert mit deinen Daten?</h4><p>In diesem Prototyp werden Suchtext und gewählte Filter nur im Arbeitsspeicher dieser Seite verarbeitet. Es werden keine Suchdaten an einen KI-Dienst gesendet oder dauerhaft gespeichert. Beim Neuladen werden deine Eingaben zurückgesetzt.</p><p>Alle Anzeigen sind erfunden; die KI-Suche wird simuliert. Bitte verwende zum Ausprobieren keine persönlichen oder vertraulichen Angaben.</p><button class="btn" data-a="closesheet" autofocus>Verstanden</button></div></dialog>';
}
var infoReturn='#optional-info';
function closeInfo(){S.sheet=false;render();var b=$(infoReturn);if(b)b.focus({preventScroll:true})}
function editHigh(){S.highEdit=true;S.edit='';render();var hc=$('[data-a="highclose"]');if(hc)hc.focus({preventScroll:true})}

function chipBtn(c){return '<button class="chip" aria-pressed="'+(S.chips.indexOf(c)>-1)+'" data-a="chip" data-c="'+esc(c)+'">'+esc(c)+'</button>'}
function cold(){
  var h='<div class="cs">'+(S.prev?'<button class="backrow" data-a="back" aria-label="Zurück zu den Ergebnissen"><svg width="20" height="20" viewBox="0 0 22 22" fill="none" stroke="#2A2A2A" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3L6 11l8 8"/></svg>Zurück</button>':'')+'<div class="fld"><svg class="lupe" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#5D5D5D" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.8"/><path d="M13 13l5 5"/></svg><input id="q" value="'+esc(S.q)+'" placeholder="'+(S.ki?'Was suchst du?':'Wonach suchst du?')+'" aria-label="Suchbegriff"></div>';
  h+='<div class="fld"><span class="ico-p"></span><input value="Deutschland" disabled aria-label="Ort"></div>';
  if(S.ki){
    h+='<div id="catwrap"><p class="catl">Kategorie auswählen</p><div class="catf"><select id="cat"'+(showKiTag()?' class="sug"':'')+' aria-label="Kategorie">'+['Alle Kategorien'].concat(CATS).map(function(c){return '<option'+(c===catShown()?' selected':'')+'>'+esc(c)+'</option>'}).join('')+'</select><span class="ki"'+(showKiTag()?'':' hidden')+'>✦ KI-Vorschlag</span></div><span id="catlive" class="sr" role="status"></span>';
    h+='<div class="selrow">'+[['rad','Umkreis',S.radius,RADII.map(function(v){return [v,'+ '+v+' km']})],['del','Lieferung',S.delivery,[['Abholung','Abholung'],['Versand','Versand']]]].map(function(f){return '<div><label class="catl" for="'+f[0]+'">'+f[1]+'</label><div class="catf sm"><select id="'+f[0]+'"><option value="">optional</option>'+f[3].map(function(o){return '<option value="'+o[0]+'"'+(String(o[0])===f[2]?' selected':'')+'>'+o[1]+'</option>'}).join('')+'</select></div></div>'}).join('')+'</div></div>';
  }
  h+='<div class="tgl"><h2>KI-Suchvorschläge'+optionalInfo()+'</h2><button class="sw-hit" data-a="ki" role="switch" aria-checked="'+S.ki+'" aria-label="KI-Suchvorschläge"><span class="sw" aria-checked="'+S.ki+'"></span></button></div>';
  if(S.ki){
    h+='<p class="nt">ⓘ Ergebnisse und Trefferhinweise sind KI-gestützt.</p><div id="promptwrap"'+(wantCat(S.q)?' hidden':'')+'><p class="nt" style="margin-top:18px">Sobald du ein Suchwort eingibst, werden dir passende Kategorien und Suchbegriffe vorgeschlagen.</p></div>'+selBox({editable:true})+'<div id="chipwrap"'+(wantCat(S.q)?'':' hidden')+'><p class="sg">Wähle aus Vorschlägen</p><div class="chips">'+CHIPS.map(chipBtn).join('')+'</div></div>';
    h+='<div class="zrow"><p class="sg">Zustand</p><div class="chips">'+['Neu','Gebraucht','egal'].map(function(c){return '<button class="chip" aria-pressed="'+(S.cond===c)+'" data-a="cond" data-c="'+c+'">'+c+'</button>'}).join('')+'</div></div>';
  }
  h+='<div class="bottom"><button class="more" data-a="more">Weitere Filter anzeigen</button><button class="btn" data-a="search">Suchen</button><button class="flink" data-a="info">Mehr über die KI-Suche erfahren</button></div></div>';
  return h;
}
function wantCat(q){return /sofa|couch/i.test(q||'')}
function showKiTag(){return S.ki&&!S.catPick&&wantCat(S.q)}
function catShown(){return S.catPick||((S.ki&&wantCat(S.q))?'Möbel & Wohnen':'Alle Kategorien')}
function qline(){return S.chips.length?S.chips.join(', '):S.q}
function waiting(){
  return header()+cnt('0 Ergebnisse - “'+esc(S.q)+'”')+sponsored()+kirow()+
  '<div class="waitbox center" role="status" aria-live="polite">'+KISP+'<span class="dots" aria-hidden="true"><i></i><i></i><i></i></span>KI sucht passende Anzeigen...<br><button class="ulink" data-a="cancel">Abbrechen</button></div>'+
  '<div class="msg" style="padding:14px 18px 0"><p class="mb">Die normalen Suchergebnisse bleiben sichtbar.</p></div>'+secNormal()+listing('d')+fab();
}
function high(){
  var r,f=curFlt(),hits=POOL.filter(function(k){return passes(adapt(k),f)}).slice(0,fltActive(f)?3:2).map(function(k){return listing(k,{facts:1,kitag:1,flt:f})}).join('');
  var none=!hits;
  var fb;
  if(S.fbDone){r='';fb='<div class="fb done"><b>Danke für dein Feedback.</b>Wir blenden den Hinweis für diese Suche aus. Alle Ergebnisse bleiben sichtbar.</div>'}
  else{
    fb='<div class="fb"><span>Passt der Hinweis?</span><button class="th" data-a="fb" data-v="ja" aria-label="Daumen hoch: Hinweis passt"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 11v9H4v-9zM7 11l4-8a2 2 0 0 1 2 2v4h6a2 2 0 0 1 2 2.3l-1.2 6A2 2 0 0 1 17.8 20H7"/></svg></button><button class="th" data-a="fb" data-v="nein" aria-label="Daumen runter: Hinweis passt nicht"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="transform:rotate(180deg)"><path d="M7 11v9H4v-9zM7 11l4-8a2 2 0 0 1 2 2v4h6a2 2 0 0 1 2 2.3l-1.2 6A2 2 0 0 1 17.8 20H7"/></svg></button></div>';
    r=none?'':'<div class="aibox hc"><p class="ln">✓ Passt zu <b>'+esc(S.chips.length?S.chips.slice(0,3).join(', '):S.q)+'</b></p>'+(S.delivery||/versand/i.test(S.q)?'<p class="ln">✓ <b>'+(S.delivery||'Versand')+'</b> laut Anzeige möglich</p>':'')+(S.cond&&S.cond!=='egal'?'<p class="ln">✓ Zustand <b>'+S.cond+'</b> laut Anzeige</p>':'')+(S.radius?'<p class="ln">✓ Umkreis <b>+ '+S.radius+' km</b> berücksichtigt</p>':'')+'<div class="tr">Angaben aus dem Anzeigentext – bitte prüfen.</div></div>';
  }
  if(S.highEdit)r='<div class="aibox high-edit"><button type="button" class="editclose" data-a="highclose" aria-label="Suche anpassen schließen"><span aria-hidden="true">×</span></button>'+selBox({editable:true,query:true})+(!hasSel()&&!S.q?'<p>Keine Kriterien ausgewählt.</p>':'')+'</div>';
  var tail=none?'<div class="msg"><h3>Keine Anzeige erfüllt alle deine Kriterien</h3><p>Die normalen Suchergebnisse bleiben sichtbar.</p></div>':'';
  var mid=none?'':secFound('Gefundene Ergebnisse')+hits+fb+'<div class="msg" style="padding:14px 18px 0"><p class="mb">Die normalen Suchergebnisse bleiben sichtbar.</p></div>';
  return header()+cnt('312 Ergebnisse - “'+esc(qline())+'”')+sponsored()+kirow()+tail+(none&&!S.highEdit?selBox():'')+r+'<div class="hact">'+(S.highEdit?'':'<button data-a="highedit">Suche anpassen</button>')+'<button data-a="newsearch">'+RELOAD+'Neu suchen</button></div>'+mid+secNormal()+listing('e')+(none?fb:'')+foot()+fab();
}
var RF=[
  {k:'mass',label:'Maße',title:'Breite des Sofas',quick:[160,180,200],field:'Eigene Breite',unit:'cm',max:400,fmt:function(d){return 'Breite < '+d.n+' cm'}},
  {k:'price',label:'Preis',title:'Preis',quick:[{v:50,o:'<'},{v:100,o:'<'},{v:200,o:'<'},{v:300,o:'<'},{v:500,o:'<'}],nolabel:1,field:'Eigener Betrag',unit:'€',max:99999,fmt:function(d){return (d.o==='>'?'> ':'< ')+d.n+' €'}},
  {k:'color',label:'Farbe',title:'Farbe des Sofas',quick:['Weiß','Schwarz','Grau','Beige','Braun','Grün','Blau'],choice:1,err:'Bitte wähle eine Farbe.',fmt:function(d){return 'Farbe '+d.n}}
];
function clearSel(){S.chips=[];S.radius='';S.delivery='';S.cond='';resetRefine()}
function lowExample(){S.q='kleines Sofa';S.delivery='Versand';S.refine.mass={n:'180',o:'',text:'Breite < 180 cm'}}
function noResultExample(){
  S.q='kleines Sofa';S.chips=['2-Sitzer'];S.delivery='Versand';
  S.refine={mass:{n:'160',o:'',text:'Breite < 160 cm'},price:{n:'50',o:'<',text:'< 50 €'}};
}
function resetRefine(){S.refine={};S.open='';S.draft={};S.selOpen=false;S.edit=''}
function rfOf(k){return RF.filter(function(r){return r.k===k})[0]}
function rpanel(r){
  var d=S.draft[r.k]||{n:''},id='rp-'+r.k;
  var h='<div class="rpanel" id="'+id+'" role="group" aria-labelledby="'+id+'-t"><button type="button" class="rclose" data-a="rclose" data-k="'+r.k+'" aria-label="'+r.title+' schließen"><span aria-hidden="true">×</span></button><p class="rt" id="'+id+'-t">'+r.title+'</p>';
  h+=(r.nolabel||r.choice?'':'<p class="rl" style="margin-bottom:8px">Schnellauswahl</p>')+'<div class="chips rq">'+r.quick.map(function(q){var o=q&&q.v!=null?q:{v:q,o:''},dl=r.k==='price'?'<':'',on=d.n===String(o.v)&&(d.o||dl)===(o.o||dl);return '<button class="chip" aria-pressed="'+on+'" data-a="rq" data-k="'+r.k+'" data-v="'+o.v+'" data-o="'+(o.o||'')+'">'+(r.choice?o.v:(o.o||'<')+' '+o.v+' '+r.unit)+'</button>'}).join('')+'</div>';
  if(!r.choice)h+='<label class="rl" for="'+id+'-n">'+r.field+'</label><div class="rf"><input class="rin" id="'+id+'-n" data-rk="'+r.k+'" data-rf="n" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="5" placeholder="z. B. '+(r.quick[1].v||r.quick[1])+'" value="'+esc(d.n)+'"'+(d.err?' aria-invalid="true" aria-describedby="'+id+'-e"':'')+'><span class="ru">'+r.unit+'</span></div>';
  if(d.err)h+='<p class="rerr" id="'+id+'-e" role="alert">'+(r.choice?r.err:'Bitte gib eine Zahl zwischen 1 und '+r.max+' ein.')+'</p>';
  if(!r.choice)h+='<div class="ract"><button class="rbtn" data-a="rapply" data-k="'+r.k+'">Übernehmen</button></div>';
  h+='</div>';
  return h;
}
var EDOPT={radius:{t:'Umkreis',o:RADII.map(function(v){return [String(v),'+ '+v+' km']})},delivery:{t:'Lieferung',o:[['Abholung','Abholung'],['Versand','Versand']]},cond:{t:'Zustand',o:[['Neu','Neu'],['Gebraucht','Gebraucht'],['egal','egal']]}};
function hasSel(){return !!(S.chips.length||S.radius||S.delivery||S.cond||Object.keys(S.refine).length)}
function selBox(o){
  o=o||{};
  var expanded=o.editable||S.selOpen;
  var shown=S.chips.map(function(c){return {t:c,k:'chip',v:c,ed:c==='< 200 €'?'refine:price':c==='< 180cm'?'refine:mass':''}});
  if(o.query&&S.q)shown.unshift({t:S.q,k:'q'});
  if(S.radius)shown.push({t:'Umkreis + '+S.radius+' km',k:'radius',ed:'radius'});
  if(S.delivery)shown.push({t:S.delivery,k:'delivery',ed:'delivery'});
  if(S.cond)shown.push({t:S.cond==='egal'?'Zustand egal':S.cond,k:'cond',ed:'cond'});
  Object.keys(S.refine).forEach(function(k){shown.push({t:S.refine[k].text,k:'refine',v:k,ed:'refine:'+k})});
  if(!shown.length){S.selOpen=false;S.edit=''}
  if(!shown.length)return '';
  var h='<div class="pad selbox"><div class="selhead"><b class="sl">Von dir gewählt:</b>'+(o.editable?'':S.selOpen?'<button class="selmore" data-a="selless">Fertig</button>':(o.noMore?'':'<button class="selmore" data-a="selmore" aria-controls="selchips">… anpassen</button>'))+'</div><div class="selchips'+(expanded?' open':'')+'" id="selchips">';
  h+=shown.map(function(c){
    var rm='data-a="unsel" data-k="'+c.k+'" data-v="'+esc(c.v||'')+'"';
    if(!expanded)return '<button class="chip" aria-pressed="true" '+rm+' aria-label="'+esc(c.t)+', Auswahl entfernen">'+esc(c.t)+'<span class="x" aria-hidden="true">×</span></button>';
    if(!c.ed)return '<button class="chip" aria-pressed="true" '+rm+' aria-label="'+esc(c.t)+', Auswahl entfernen">'+esc(c.t)+'<span class="x" aria-hidden="true">×</span></button>';
    return '<span class="chip sp'+(S.edit===c.ed?' act':'')+'"><button class="cl" data-a="selpick" data-e="'+c.ed+'" aria-expanded="'+(S.edit===c.ed)+'" aria-label="'+esc(c.t)+', ändern">'+esc(c.t)+' <span aria-hidden="true">▾</span></button><button class="cx" '+rm+' aria-label="'+esc(c.t)+', Auswahl entfernen"><span aria-hidden="true">×</span></button></span>';
  }).join('')+'</div>';
  if(expanded&&S.edit){
    if(S.edit.indexOf('refine:')===0)h+=rpanel(rfOf(S.edit.slice(7)));
    else{var d=EDOPT[S.edit];h+='<div class="rpanel"><button type="button" class="rclose" data-a="panelclose" aria-label="'+d.t+' schließen"><span aria-hidden="true">×</span></button><label class="rt" for="seled">'+d.t+'</label><select id="seled" class="sel" data-e="'+S.edit+'">'+d.o.map(function(x){return '<option value="'+x[0]+'"'+(S[S.edit]===x[0]?' selected':'')+'>'+x[1]+'</option>'}).join('')+'</select></div>'}
  }
  return h+'</div>';
}
function low(){
  var keys=Object.keys(S.refine),n=[312,148,61,22][Math.min(keys.length+[S.radius,S.delivery,S.cond==='egal'?'':S.cond].filter(Boolean).length,3)];
  var open=S.open?rfOf(S.open):null,flt=curFlt();
  return header()+cnt(n+' Ergebnisse - “'+esc(qline())+'”')+sponsored()+kirow()+
  '<div class="msg"><h3>Keine verlässlich begründete KI-Empfehlung</h3><p>Maße oder Zustand konnten nicht eindeutig überprüft werden. Bitte prüfe die Details in der Anzeige.</p></div>'+
  selBox()+
  '<div class="aibox" style="padding:14px 14px 4px"><p class="h3" style="margin:0 0 6px">Grenze deine Suche weiter ein</p><div class="chips" style="gap:10px">'+RF.map(function(r){var a=S.refine[r.k];return '<button class="chip" aria-pressed="'+!!a+'" aria-expanded="'+(S.open===r.k)+'" aria-controls="rp-'+r.k+'" data-a="refine" data-k="'+r.k+'">'+esc(r.label)+'</button>'}).join('')+'</div>'+(open?rpanel(open):'')+'</div>'+
  secFound('Mögliche Ergebnisse')+listing('c',{miss:1,why:1,flt:flt})+listing('b',{why:1,flt:flt})+'<div class="msg" style="padding:14px 18px 0"><p class="mb">Die normalen Suchergebnisse bleiben sichtbar.</p></div>'+secNormal()+listing('d')+foot()+fab();
}
function none(){
  return header()+cnt('Keine KI-Treffer - “'+esc(S.q)+'”')+sponsored()+kirow()+
  '<div class="msg"><h3>Keine passenden Ergebnisse gefunden</h3><p>Es wurden keine passenden Anzeigen für deine gewählten Kriterien gefunden. Entferne Kriterien oder versuche eine andere Suche.</p></div>'+
  selBox()+
  '<div class="cat"><b>Kategorieempfehlung:</b><button data-a="catrec">Sofas &amp; Sitzgarnituren</button><p class="category-note">Startet eine neue Suche in dieser Kategorie ohne die bisherigen Kriterien.</p></div>'+
  '<div class="aibox" style="padding:14px 14px 4px"><p class="h3" style="margin:0 0 8px;font-size:13px;color:#4B5E52">Versuche es mit einem anderen Suchbegriff</p><p style="font-size:12px;margin:0">Wähle einen Vorschlag und tippe auf „Neu suchen“.</p><div class="chips" style="gap:10px;margin-top:14px">'+['sofa klein','Kleines Schlafsofa','2-Sitzer-Sofa','Kompaktsofa'].map(function(c){return '<button class="chip" aria-pressed="'+(S.termPick===c)+'" data-a="term" data-c="'+c+'">'+c+'</button>'}).join('')+'</div></div>'+
  '<div class="ki-end"><div class="hact two">'+'<span></span>'+'<button data-a="termsearch"'+(S.termPick?'':' disabled')+'>'+RELOAD+'Neu suchen</button></div>'+
  '<p class="normal-results-note">Die normalen Suchergebnisse bleiben sichtbar.</p></div>'+
  secNormal()+listing('e')+foot()+fab();
}
function fail(){
  return header()+cnt('312 Ergebnisse - “'+esc(S.q)+'”')+sponsored()+kirow()+
  '<div role="alert">'+WARN+'<div class="msg"><h3>Deine Suche konnte nicht geladen werden</h3><p>Du kannst die normalen Suchergebnisse weiterhin ansehen.</p><button class="glink retry" data-a="retry" style="margin-top:8px"><span aria-hidden="true">'+RELOAD+'</span>Erneut versuchen</button></div></div>'+
  secNormal()+listing('e')+foot()+fab();
}
function plain(){
  return header()+cnt('312 Ergebnisse - “'+esc(S.q)+'”')+sponsored()+kirow()+
  (S.aborted?'<div class="waitbox center" role="status"><h3>Du hast die Suche abgebrochen</h3><button class="glink retry" data-a="again"><span aria-hidden="true">'+RELOAD+'</span>Neue Suche</button></div><div class="msg" style="padding:14px 18px 0"><p class="mb">Die normalen Suchergebnisse bleiben sichtbar.</p></div>':'')+
  secNormal()+listing('d')+foot()+fab();
}
function render(){
  document.querySelectorAll('[data-j]').forEach(function(b){var k=b.dataset.j,on=k==='cold-on'?S.view==='cold'&&S.ki:k==='cold-off'?S.view==='cold'&&!S.ki:(k==='wait'?'waiting':k)===S.view;b.setAttribute('aria-pressed',String(on))});
  var v={cold:cold,waiting:waiting,high:high,low:low,none:none,fail:fail,plain:plain}[S.view]();
  $('#phone').innerHTML='<div class="scr">'+v+'</div>'+sheet()+(S.toast?'<div class="toast" role="status">'+esc(S.toast)+'</div>':'');ensureRoom();
  var info=$('#ki-info');if(info){info.showModal();info.addEventListener('cancel',function(e){e.preventDefault();closeInfo()})}
  var q=$('#q');if(q){q.addEventListener('input',function(){S.q=q.value;var has=!!q.value.trim(),chips=wantCat(q.value);if(!has)S.catPick=null;var sw=$('#chipwrap'),pw=$('#promptwrap');if(sw)sw.hidden=!chips;if(pw)pw.hidden=chips;var cs=$('#cat');if(cs){cs.value=catShown();cs.classList.toggle('sug',showKiTag())}var kt=$('#catwrap .ki');if(kt)kt.hidden=!showKiTag();var lv=$('#catlive');if(lv)lv.textContent=showKiTag()?'KI schlägt die Kategorie Möbel und Wohnen vor':''})}
  if(q)q.addEventListener('click',function(){if(S.view!=='cold'||!S.ki||q.value.trim())return;q.value='kleines Sofa für meine Wohnung';q.dispatchEvent(new Event('input',{bubbles:true}));q.setSelectionRange(q.value.length,q.value.length)});
  [['#rad','radius'],['#del','delivery']].forEach(function(f){var e=$(f[0]);if(e)e.addEventListener('change',function(){S[f[1]]=e.value;render();var n=$(f[0]);if(n)n.focus()})});
  var c=$('#cat');if(c){c.addEventListener('change',function(){S.cat=c.value;S.catPick=c.value;c.classList.remove('sug');var kt=$('#catwrap .ki');if(kt)kt.hidden=true})}
}

var CUTOFF=0.7; // Annahme laut docs/PROJECT.md, mit Figma und PRD abgleichen
function confidence(q){return (S.chips.indexOf('< 180cm')>-1||S.chips.indexOf('2-Sitzer')>-1||/2-sitzer|180/.test(q))?0.82:0.55}
function outcome(){
  var sc=S.scenario;
  if(sc==='auto'){
    var q=S.q.toLowerCase();
    if(S.retry)return 'high';
    if(!/sofa|couch/.test(q)||/\bsof\b/.test(q))return 'none';
    if(/schlaffunktion|schlafsofa|bettkasten|ausziehbar/.test(q))return 'fail';
    return confidence(q)>=CUTOFF?'high':'low';
  }
  return sc;
}
function startAI(forcedOutcome){
  clearT();S.view='waiting';S.fbDone=false;S.open='';S.draft={};S.selOpen=false;S.edit='';render();anchorKI();
  var o=forcedOutcome||outcome();
  if(o==='slow'){
    S.t.push(setTimeout(function(){S.retry=false;go('fail')},15000));
    return;
  }
  if(o==='fail'){S.t.push(setTimeout(function(){go('fail')},1500));return}
  S.t.push(setTimeout(function(){S.retry=false;go(o)},2600));
}
function search(){
  if(!S.q.trim()){S.q='kleines Sofa für meine Wohnung'}
  if(!S.ki){go('plain');return}
  startAI();
}

function rerun(){if(S.view==='none'){S.retry=false;startAI();return true}return false}
function dropChip(c){var i=S.chips.indexOf(c);if(i>-1)S.chips.splice(i,1)}
function applyRefine(k){
  var r=rfOf(k),d=S.draft[k],v=r.choice?d.n:parseInt(d.n,10);
  if(r.choice?!v:!(v>0&&v<=r.max)){d.err=true;render();var f=$('#rp-'+k+'-n')||$('#rp-'+k+' .chip');if(f)f.focus();return}
  d.n=String(v);d.err=false;
  S.refine[k]={n:d.n,o:d.o||'',text:r.fmt(d)};S.open='';S.edit='';if(k==='price')dropChip('< 200 €');if(k==='mass')dropChip('< 180cm');if(rerun())return;render();
  var tb=$('[data-a="refine"][data-k="'+k+'"]');if(tb)tb.focus();
}
document.addEventListener('input',function(e){
  var t=e.target,k=t.dataset&&t.dataset.rk;if(!k)return;
  var d=S.draft[k];if(!d)return;
  t.value=t.value.replace(/\D/g,'');d.n=t.value;d.o='';d.err=false;
  var p=$('#rp-'+k),er=$('#rp-'+k+'-e');if(er)er.remove();t.removeAttribute('aria-invalid');
  if(p)p.querySelectorAll('.rq .chip').forEach(function(c){c.setAttribute('aria-pressed',c.dataset.v===d.n&&(c.dataset.o||'')===(k==='price'?'<':''))});
});
document.addEventListener('change',function(e){var t=e.target;if(t.id!=='seled')return;S[t.dataset.e]=t.value;S.edit='';if(!rerun())render()});
document.addEventListener('keydown',function(e){
  var t=e.target;if(e.key==='Enter'&&t.dataset&&t.dataset.rk){e.preventDefault();applyRefine(t.dataset.rk)}
});
document.addEventListener('click',function(e){
  var el=e.target.closest('[data-a]');
  if(!el)return;
  if(el.dataset.a==='closesheet'&&e.target.closest('[data-stop]')&&!e.target.closest('button'))return;
  var a=el.dataset.a;
  if(a==='ki'){S.ki=!S.ki;clearSel();render()}
  else if(a==='kitoggle'){clearSel();if(S.ki){S.ki=false;clearT();S.aborted=false;go('plain')}else{S.ki=true;startAI()}}
  else if(a==='chip'){var c=el.dataset.c,i=S.chips.indexOf(c);if(i>-1)S.chips.splice(i,1);else S.chips.push(c);render();var n=document.querySelectorAll('.chip');for(var k=0;k<n.length;k++){if(n[k].dataset.c===c){n[k].focus()}}}
  else if(a==='cond'){var cv=el.dataset.c;S.cond=S.cond===cv?'':cv;render();var cb2=$('[data-a="cond"][data-c="'+cv+'"]');if(cb2)cb2.focus()}
  else if(a==='search')search();
  else if(a==='info'){infoReturn=el.id?'#'+el.id:'.flink[data-a="info"]';S.sheet=true;render()}
  else if(a==='closesheet')closeInfo();
  else if(a==='more')toast('Weitere Filter: in diesem Prototyp nicht enthalten');
  else if(a==='back'){clearT();S.sheet=false;if(S.view==='cold'){var p=S.prev;S.prev=null;if(p)go(p)}else{S.prev=null;S.view='cold';render();window.scrollTo(0,0)}}
  else if(a==='edit'){if(S.view==='high')editHigh();else go('cold')}
  else if(a==='highedit')editHigh();
  else if(a==='highclose'){S.highEdit=false;S.edit='';S.open='';render();var he=$('[data-a="highedit"]');if(he)he.focus({preventScroll:true})}
  else if(a==='panelclose'){var pe=S.edit;S.edit='';render();var pb=$('[data-a="selpick"][data-e="'+pe+'"]');if(pb)pb.focus({preventScroll:true})}
  else if(a==='newsearch'){S.q='';S.chips=[];S.radius='';S.delivery='';S.cond='';S.catPick=null;S.scenario='auto';resetRefine();go('cold')}
  else if(a==='cancel'){clearT();S.aborted=true;go('plain')}
  else if(a==='again'){S.aborted=false;S.retry=false;startAI()}
  else if(a==='retry'){S.retry=true;if(S.scenario==='fail'||S.scenario==='slow')S.scenario='high';startAI()}
  else if(a==='unsel'){S.edit='';var uk=el.dataset.k,uv=el.dataset.v;if(uk==='chip'){var ui=S.chips.indexOf(uv);if(ui>-1)S.chips.splice(ui,1)}else if(uk==='refine'){delete S.refine[uv];if(S.open===uv)S.open=''}else S[uk]='';if(!rerun())render()}
  else if(a==='refine'){var rk=el.dataset.k;S.edit='';if(S.open===rk){S.open=''}else{S.open=rk;var ap=S.refine[rk];S.draft[rk]={n:ap?ap.n:'',o:ap?ap.o:''}}render();var tb=$('[data-a="refine"][data-k="'+rk+'"]');if(tb)tb.focus()}
  else if(a==='rq'){var qk=el.dataset.k,qv=el.dataset.v,qo=el.dataset.o||'',qa=S.refine[qk];if(qa&&qa.n===qv&&(qa.o||'')===qo){delete S.refine[qk];S.open='';S.edit='';if(rerun())return}else{S.draft[qk]={n:qv,o:qo};applyRefine(qk);return}render();var qb=$('[data-a="refine"][data-k="'+qk+'"]');if(qb)qb.focus()}
  else if(a==='selpick'){var se=el.dataset.e;if(S.edit===se){S.edit=''}else{S.edit=se;S.open='';if(se.indexOf('refine:')===0){var sk=se.slice(7),sa=S.refine[sk];S.draft[sk]=sa?{n:sa.n,o:sa.o}:(sk==='price'&&S.chips.indexOf('< 200 €')>-1?{n:'200',o:'<'}:(sk==='mass'&&S.chips.indexOf('< 180cm')>-1?{n:'180',o:''}:{n:'',o:''}))}}render()}
  else if(a==='selmore'){S.selOpen=true;render();var sf=$('[data-a="selless"]');if(sf)sf.focus()}
  else if(a==='selless'){S.selOpen=false;S.edit='';render();var sm=$('[data-a="selmore"]');if(sm)sm.focus()}
  else if(a==='rapply')applyRefine(el.dataset.k)
  else if(a==='rclose'){var ck=el.dataset.k,ce=S.edit;S.open='';S.edit='';delete S.draft[ck];render();var cb=ce?$('[data-a="selpick"][data-e="'+ce+'"]'):$('[data-a="refine"][data-k="'+ck+'"]');if(cb)cb.focus()}
  else if(a==='term'){var term=el.dataset.c;S.termPick=S.termPick===term?'':term;render();var tc=$('[data-a="term"][data-c="'+term+'"]');if(tc)tc.focus({preventScroll:true})}
  else if(a==='termsearch'){if(!S.termPick)return;S.q=S.termPick;S.termPick='';S.chips=[];S.retry=false;S.scenario='auto';$('#scenario').value='auto';startAI()}
  else if(a==='catrec'){clearSel();S.termPick='';S.retry=false;S.q='Sofa';S.cat=S.catPick='Sofas & Sitzgarnituren';S.ki=true;S.scenario='auto';$('#scenario').value='auto';startAI('high')}
  else if(a==='fb'){if(el.dataset.v==='nein'){S.fbDone=true;render()}else toast('Danke. Das Feedback wurde gezählt.')}
  else if(a==='open')toast('Anzeige öffnen: nicht Teil des Prototyps')
});

var J=[['Cold Start (KI an)','cold-on'],['Cold Start (KI aus)','cold-off'],['Waiting','wait'],['High','high'],['Low','low'],['No Result','none'],['Failure','fail']];
$('#jump').innerHTML=J.map(function(j){return '<button class="chip" data-j="'+j[1]+'">'+j[0]+'</button>'}).join('');
function jumpState(e){
  var b=e.target.closest('[data-j]');if(!b)return;
  var k=b.dataset.j;clearT();clearSel();S.retry=false;S.fbDone=false;S.sheet=false;S.toast='';S.prev=null;S.cat='Möbel & Wohnen';S.catPick=null;S.scenario='auto';$('#scenario').value='auto';S.ki=k!=='cold-off';
  var target={
    'cold-on':['cold',''], 'cold-off':['cold',''],
    wait:['waiting','kleines Sofa'], high:['high','kleines Sofa, 2-Sitzer, <180cm, Versand'],
    low:['low','kleines Sofa, Versand'], none:['none','kleines Sof für meine Wohnung'], fail:['fail','kleines Sofa']
  }[k];
  S.q=target[1];
  if(k==='high'){S.q='kleines Sofa';S.chips=['2-Sitzer','< 180cm'];S.delivery='Versand'}
  if(k==='low')lowExample();
  if(k==='none')noResultExample();
  S.view=target[0];go(target[0]);if(target[0]==='waiting')anchorKI();
}
$('#states').addEventListener('click',jumpState);
$('#jump').addEventListener('click',jumpState);
$('#scenario').addEventListener('change',function(e){S.scenario=e.target.value});
function hash(){var on=location.hash==='#mod';$('#mod').classList.toggle('on',on);if(on)$('#mod').open=true}
window.addEventListener('hashchange',hash);hash();
render();
var DIRECT={low:'kleines Sofa, Versand',none:'kleines Sof für meine Wohnung'};
var st=new URLSearchParams(location.search).get('state');
if(st==='off'){S.ki=false;go('cold')}
else if(st==='fail'){S.ki=true;S.q='kleines Sofa';go('fail')}
else if(st==='wait'){S.ki=true;S.q='kleines Sofa';S.view='waiting';go('waiting');anchorKI()}
else if(st&&DIRECT[st]){S.ki=true;S.q=DIRECT[st];if(st==='low')lowExample();if(st==='none')noResultExample();go(st)}
})();
