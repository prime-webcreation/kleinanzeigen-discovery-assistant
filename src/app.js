/* Discovery Assistant Prototyp - Stand: 02.11.2026
   Zustand (S), Inhalte, Render-Funktionen, Events. Kein echtes Modell. */
(function(){
var $=function(s){return document.querySelector(s)};
var S={view:'cold',ki:true,q:'',cat:'Möbel & Wohnen',catPick:null,prev:null,chips:[],t:[],scenario:'auto',retry:false,sheet:false,toast:'',radius:'',delivery:'',cond:'',refine:{},open:'',draft:{},fbDone:false,selOpen:false,edit:'',highEdit:false,aborted:false,termPick:''};
var RADII=[5,10,20,50,100];
var CHIPS=['2-Sitzer','< 180cm','kleines Sofa','Ecksofa','@price','Couch','Kompakter 3-Sitzer','@color'];
var CATS=['Möbel & Wohnen','Haus & Garten','Elektronik','Mode & Beauty'];
var L={
 d:{t:'Graues Stoffsofa',p:'140 €',top:1,ort:'Ort'},
 e:{t:'Kleines Stoffsofa, 2-Sitzer',p:'140 €',top:1,ort:'Ort'},
 f:{t:'Schlafsofa, gut erhalten',p:'110 € VB',ort:'Ort'},
 g:{t:'Sofa aus Stoff',p:'75 € VB',ort:'Ort'}
};
/* weitere normale Suchergebnisse (ohne KI-Bezug, ohne Haken) */
var MORE=[
 {t:'Zweisitzer Sofa, grau',p:'120 €',ort:'Ort'},
 {t:'Ecksofa mit Schlaffunktion',p:'350 € VB',ort:'Ort'},
 {t:'Couch braun, Leder',p:'200 €',ort:'Ort'}
];
function more(){return MORE.map(function(x){return listing(x)}).join('')}
/* Test-Produktkarten (src/produkte.js): sicher = High, unsicher = Low */
var P=window.PRODUKTE||{sicher:[],unsicher:[]};
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function clearT(){S.t.forEach(clearTimeout);S.t=[]}
var AIV=['waiting','high','low','none','fail'];
function anchorY(){var el=$('.kirow'),bar=$('.statebar'),offset=bar?bar.getBoundingClientRect().bottom:0;return el?Math.max(0,el.getBoundingClientRect().top+window.pageYOffset-Math.max(0,offset)-8):0}
function ensureRoom(){if(!S.ki||AIV.indexOf(S.view)<0)return;var sc=$('.scr');if(!sc)return;var need=anchorY()+window.innerHeight-document.documentElement.scrollHeight;if(need>0)sc.style.paddingBottom=(40+need)+'px'}
function anchorKI(){ensureRoom();var rm=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;window.scrollTo({top:anchorY(),behavior:rm?'auto':'smooth'})}
function go(v){clearT();if(v!=='plain')S.aborted=false;S.highEdit=false;S.termPick='';if(v==='cold'){S.prev=(S.view!=='cold'&&S.view!=='waiting')?S.view:null}else{S.prev=null}S.view=v;S.sheet=false;render();if(v==='high'||v==='low'||v==='none'||v==='fail')anchorKI();else window.scrollTo(0,0)}
function toast(m){S.toast=m;render();setTimeout(function(){S.toast='';render()},2200)}
var LUPE='<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/></svg>';
var LUPEKI='<svg viewBox="0 0 26 26" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><circle cx="10.5" cy="14.5" r="6.2"/><path d="M15.2 19.2L21 25"/><path d="M20 2.5v7M16.5 6h7" stroke-width="2.2"/><path d="M10 2v4M8 4h4" stroke-width="1.8"/></svg>';
var RELOAD='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.6-5.9"/><path d="M20 4v5h-5"/></svg>';
var SPARK='<svg viewBox="0 0 26 26" aria-hidden="true"><path d="M10 9l2.3 6.4L19 17.8l-6.7 2.4L10 27l-2.3-6.8L1 17.8l6.7-2.4z" fill="#339E29" transform="translate(0,-3) scale(.95)"/><path d="M20.5 1l1.4 3.8 3.6 1.3-3.6 1.3L20.5 11l-1.4-3.6-3.6-1.3 3.6-1.3z" fill="#9FCB82"/></svg>';
var KIDUO='<svg viewBox="0 0 44 44" fill="none" aria-hidden="true"><path d="M17 15l3 8.4L28.4 26.4 20 29.4 17 38l-3-8.6L5.6 26.4 14 23.4z" fill="#339E29"/><path d="M33 5l1.9 5.1L40 12l-5.1 1.9L33 19l-1.9-5.1L26 12l5.1-1.9z" fill="#9FCB82"/></svg>';
var ICSOFA='<svg viewBox="0 0 24 24" fill="none" stroke="#245914" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 11V8a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v3"/><path d="M4 12a2 2 0 0 1 2 2v2h12v-2a2 2 0 1 1 4 0v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"/><path d="M7 20v1.5M17 20v1.5"/></svg>';
var ICPIN='<svg viewBox="0 0 24 24" fill="none" stroke="#2A2A2A" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/></svg>';
var ICTRUCK='<svg viewBox="0 0 24 24" fill="none" stroke="#2A2A2A" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 6h11v10H2zM13 9h4.5l3.5 3.5V16h-8"/><circle cx="7" cy="17.5" r="1.9" fill="#fff"/><circle cx="17" cy="17.5" r="1.9" fill="#fff"/></svg>';
var ICMIC='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/></svg>';
var ICSTARS='<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M9 7l1.9 5.1L16 14l-5.1 1.9L9 21l-1.9-5.1L2 14l5.1-1.9z"/><path d="M18 2l1.2 3.3 3.3 1.2-3.3 1.2L18 11l-1.2-3.3-3.3-1.2 3.3-1.2z"/></svg>';
var ICINFO='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.6v.4"/></svg>';
var ICCHEV='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
var KISTATIC='<svg viewBox="0 0 44 44" fill="none" aria-hidden="true"><circle cx="18" cy="26" r="9" stroke="#0DAA2B" stroke-width="3.4"/><path d="M25 33l9 9" stroke="#0DAA2B" stroke-width="3.4" stroke-linecap="round"/><path d="M24 12l1.6 4.4L30 18l-4.4 1.6L24 24l-1.6-4.4L18 18l4.4-1.6z" fill="#B7DB9B"/><path d="M35 7l1.9 5.1L42 14l-5.1 1.9L35 21l-1.9-5.1L28 14l5.1-1.9z" fill="#0DAA2B"/></svg>';
var KILUPE='<svg viewBox="0 0 26 26" fill="none" stroke="#339E29" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="12" r="5.5"/><path d="M15.5 16.5l5 5"/></svg>';
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
  return '<div class="kirow">'+kiHead()+'<button class="sw-hit" data-a="kitoggle" role="switch" aria-checked="'+on+'" aria-label="KI-Suche"><span class="sw" aria-checked="'+on+'"></span></button></div>'+(S.kiHint&&on&&Date.now()-S.kiHintT0<3900?'<div class="kinote kihint" style="animation-delay:-'+((Date.now()-S.kiHintT0)/1000).toFixed(2)+'s" role="status">Vorschläge und Trefferhinweise sind KI-gestützt.</div>':'');
}
function kiHead(){return '<h2 class="kih"><span class="kih-ic" aria-hidden="true">'+KISTATIC+'</span>KI-Suche'+optionalInfo()+'</h2>'}
function optionalInfo(){return '<button type="button" class="optional-info" id="optional-info" data-a="info" aria-haspopup="dialog" aria-controls="ki-info" aria-label="Optional: Informationen zur KI-Suche und deinen Daten">(optional)</button>'}
var TYPE_CHIPS=['2-Sitzer','Kompakter 3-Sitzer','Ecksofa','Couch','kleines Sofa'];
/* Prüft eine Karte gegen alle aktiven Kriterien. Ergebnis je Kriterium: s = 'ok' (erfüllt), 'miss' (Angabe fehlt) oder 'fail' (erfüllt nicht).
   Daraus entstehen Treffer (alles ok), Haken (ok) und Hinweise (miss). */
function evalCard(x,f){
  var r=[],price=x.price,sel=(f.chips||[]).filter(function(c){return TYPE_CHIPS.indexOf(c)>-1});
  function add(k,s,label){r.push({k:k,s:s,label:label})}
  if(sel.length){
    if(x.tags==null)add('type','miss','Typ');
    else{var hit=sel.filter(function(c){return x.tags.indexOf(c)>-1});hit.length?add('type','ok',hit.join(', ')):add('type','fail','Typ')}
  }
  if((f.chips||[]).indexOf('< 200 €')>-1)add('p200',price<200?'ok':'fail','< 200 €');
  if((f.chips||[]).indexOf('< 180cm')>-1)x.w==null?add('w180','miss','Breite'):add('w180',x.w<180?'ok':'fail','< 180 cm');
  if(f.max)add('max',price<f.max?'ok':'fail','< '+f.max+' €');
  if(f.min)add('min',price>f.min?'ok':'fail','> '+f.min+' €');
  if(f.mass)x.w==null?add('mass','miss','Breite'):add('mass',x.w<f.mass?'ok':'fail','Breite '+x.w+' cm');
  if(f.radius)x.km==null?add('radius','miss','Entfernung'):add('radius',x.km<=f.radius?'ok':'fail',x.km+' km entfernt');
  if(f.delivery)x.ship==null?add('delivery','miss',f.delivery):add('delivery',x.ship.indexOf(f.delivery)>-1?'ok':'fail',f.delivery+' möglich');
  if(f.cond)x.cond==null?add('cond','miss','Zustand'):add('cond',x.cond===f.cond?'ok':'fail',x.cond);
  if(f.color)x.col==null?add('color','miss','Farbe'):add('color',x.col===f.color?'ok':'fail','Farbe '+x.col);
  return r;
}
function passes(x,f){return evalCard(x,f).every(function(c){return c.s==='ok'})}
function curFlt(){
  return {max:S.refine.price&&S.refine.price.o!=='>'?parseInt(S.refine.price.n,10):0,min:S.refine.price&&S.refine.price.o==='>'?parseInt(S.refine.price.n,10):0,mass:S.refine.mass?parseInt(S.refine.mass.n,10):0,radius:S.radius?parseInt(S.radius,10):0,delivery:S.delivery||(/versand/i.test(S.q)?'Versand':''),cond:S.cond==='egal'?'':S.cond,color:S.refine.color?S.refine.color.n:'',chips:S.chips};
}
function fltActive(f){return !!(f.max||f.min||f.mass||f.radius||f.delivery||f.cond||f.color||(f.chips&&f.chips.length))}
/* Haken (ok) und, wenn gewünscht, Hinweise zu fehlenden Angaben (miss) */
function fltLines(ev,separate,showMiss){
  var ok=ev.filter(function(c){return c.s==='ok'}).map(function(c){return c.label}),nf=showMiss?ev.filter(function(c){return c.s==='miss'}).map(function(c){return c.label}):[];
  return (nf.length?'<span class="facts nf"><span>ⓘ '+nf.join(', ')+' nicht angegeben</span></span>':'')+(ok.length?'<span class="facts">'+(separate?ok.map(function(t){return '<span><span class="fact-check" aria-hidden="true">✓</span> '+esc(t)+'</span>'}).join(''):'<span><span class="fact-check" aria-hidden="true">✓</span> '+esc(ok.slice(0,3).join(', '))+(ok.length>3?' +'+(ok.length-3):'')+'</span>')+'</span>':'');
}
function missingFields(x){var m=[];if(x.w==null)m.push('Größe');if(x.col==null)m.push('Farbe');if(x.cond==null)m.push('Zustand');if(x.ship==null)m.push('Lieferart');if(x.km==null)m.push('Entfernung');if(x.tags==null)m.push('Typ');return m}
/* Low: Karten mit unsicheren Angaben, die keinem gewählten Kriterium widersprechen. Fehlende Angaben zu aktiven Kriterien zuerst. */
function lowCards(f){
  return P.unsicher.map(function(x,i){var ev=evalCard(x,f);return {x:x,i:i,fail:ev.some(function(c){return c.s==='fail'}),miss:ev.filter(function(c){return c.s==='miss'}).length}})
    .filter(function(c){return !c.fail}).sort(function(a,b){return b.miss-a.miss||a.i-b.i}).slice(0,2).map(function(c){return c.x});
}
var THUMB='<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 11v9H4v-9zM7 11l4-8a2 2 0 0 1 2 2v4h6a2 2 0 0 1 2 2.3l-1.2 6A2 2 0 0 1 17.8 20H7"/></svg>';
function cardFb(x){var v=(S.cfb||{})[x.id];return '<span class="cfb">'+['ja','nein'].map(function(k){return '<span class="cth'+(v===k?' on':'')+'" role="button" tabindex="0" aria-pressed="'+(v===k)+'" data-a="cfb" data-id="'+x.id+'" data-v="'+k+'" aria-label="'+(k==='ja'?'Daumen hoch: Hinweis passt':'Daumen runter: Hinweis passt nicht')+'"'+(k==='nein'?' style="--r:180deg"':'')+'>'+THUMB+'</span>'}).join('')+'</span>'}
function listing(k,o){
  o=o||{};var x=typeof k==='string'?L[k]:k;var cm=o.cmp;
  var pill=cm?'<span class="cmp-pill'+(cm.on?' on':'')+'" role="checkbox" tabindex="0" aria-checked="'+cm.on+'" data-a="cmp" data-id="'+cm.id+'"><span class="cmp-box" aria-hidden="true">'+(cm.on?'✓':'')+'</span>'+(cm.on?'Vergleich':'Vergleichen')+'</span>':'';
  var h='<button class="lst'+(cm?' lst-cmp':'')+'" data-a="open"><span class="im"><i></i><i></i>'+pill+'</span><span class="ct">'+(cm?'':'<span class="ort">'+x.ort+' · Heute</span>');
  if(o.kitag)h+='<span class="kitag" role="img" aria-label="KI-Vorschlag">'+SPARK+'</span>';
  h+='<span class="ti">'+esc(x.t)+'</span>';
  if(cm)h+='<span class="pr pr-top">'+x.p+'</span><span class="ort">'+x.ort+(x.km!=null?' ('+x.km+' km)':'')+'</span><span class="ort">'+cm.date+'</span>';
  var rStart=h.length;
  var act=!!(o.flt&&fltActive(o.flt)&&x.price!=null),ev=act?evalCard(x,o.flt):[];
  if(o.facts&&x.f&&!act){h+='<span class="facts">'+x.f.map(function(f){return '<span><span class="fact-check" aria-hidden="true">✓</span> '+esc(f)+'</span>'}).join('')+'</span>'}
  if(o.kib)h+='<span><span class="kib"><span class="fact-check" aria-hidden="true">✓</span> KI-Vorschlag</span> <small style="color:#aeaeae;font-size:10px">'+esc(x.f[0])+'</small></span>';
  if(o.miss){var mf=missingFields(x);if(mf.length)h+='<span class="miss">ⓘ '+mf.join(', ')+' nicht angegeben</span>'}
  /* Breite nur aus dem Anzeigentext: Haken, wenn sie zur gewählten Obergrenze passt, sonst Hinweis "bitte prüfen" */
  var wOk=ev.some(function(c){return (c.k==='mass'||c.k==='w180')&&c.s==='ok'});
  if(o.why&&x.wCheck&&x.w!=null&&!wOk)h+='<span class="miss">ⓘ Breite '+x.w+' cm, bitte prüfen</span>';
  if(act)h+=fltLines(ev,o.facts,!o.miss);
  /* Jede KI-Karte nennt mindestens einen Grund: ohne erfüllte Kriterien und ohne feste Kurzinfos steht der Bezug zur Suche da */
  var hasWhy=(o.facts&&x.f&&!act)||ev.some(function(c){return c.s==='ok'});
  if(o.kitag&&!hasWhy){var q=qline();h+='<span class="facts"><span><span class="fact-check" aria-hidden="true">✓</span> '+(q?'Passt zu '+esc(q):'Passt zu deiner Suche')+'</span></span>'}
  if(o.kitag&&S.cfb&&S.cfb[x.id]==='nein')h=h.slice(0,rStart)+'<span class="miss">Danke für dein Feedback. Hinweis ausgeblendet.</span>';
  if(x.top)h+='<span class="dis">Gesponsert</span>';
  if(o.kitag)h+=cardFb(x);
  h+=(cm?'':'<span class="pr">'+x.p+'</span>')+'</span>'+(x.top?'<span class="top">TOP</span>':'')+'</button>';
  return h;
}
function secFound(l){return '<div class="sec sec-ki">'+l+'<span class="pill">KI-gestützt</span></div>'}
function secNormal(show,noLine){return (show===false?'':'<div class="nrnote">Die normalen Suchergebnisse bleiben sichtbar.</div>')+'<div class="sec sec-n'+(noLine?' sec-nl':'')+'">Suchergebnisse</div>'}
function fab(){return '<div class="fabwrap"><button class="fab" data-a="edit">Filter anpassen</button>'+'</div>'}
function endLink(){return S.ki?'<button class="flink endlink" data-a="info">Mehr über die KI-Suche erfahren</button>':''}
function foot(){return '<div class="foot">Alle Anzeigen bleiben sichtbar und auswählbar. TOP und Gesponsert sind bezahlt und nicht Teil der KI-Auswahl.</div>'+endLink()}
function sheet(){
  if(!S.sheet)return'';
  return '<dialog id="ki-info" class="sheet-bg" data-a="closesheet" aria-labelledby="ki-info-title" aria-describedby="ki-info-intro"><div class="sheet" data-stop="1"><h3 id="ki-info-title">Über die KI-Suche</h3><p id="ki-info-intro">Die KI-Suche ist freiwillig. Du kannst sie jederzeit über den Schalter ausschalten.</p><h4>Was macht die Suchhilfe?</h4><p>Sie schlägt passende Kategorien und Suchbegriffe vor. Trefferhinweise beziehen sich auf Angaben im Anzeigentext und können unvollständig sein. Bitte prüfe die Anzeige selbst.</p><p>Normale Suchergebnisse bleiben verfügbar. Bezahlte Anzeigen (TOP und Gesponsert) sind von den KI-Vorschlägen getrennt.</p><h4>Was passiert mit deinen Daten?</h4><p>In diesem Prototyp werden Suchtext und gewählte Filter nur im Arbeitsspeicher dieser Seite verarbeitet. Es werden keine Suchdaten an einen KI-Dienst gesendet oder dauerhaft gespeichert. Beim Neuladen werden deine Eingaben zurückgesetzt.</p><p>Alle Anzeigen sind erfunden; die KI-Suche wird simuliert. Bitte verwende zum Ausprobieren keine persönlichen oder vertraulichen Angaben.</p><button class="btn" data-a="closesheet" autofocus>Verstanden</button></div></dialog>';
}
var infoReturn='#optional-info';
function closeInfo(){S.sheet=false;render();var b=$(infoReturn);if(b)b.focus({preventScroll:true})}
function editHigh(){S.highEdit=true;S.edit='';render();var hc=$('[data-a="highclose"]');if(hc)hc.focus({preventScroll:true})}

function rfChip(k){var r=RF.filter(function(x){return x.k===k})[0],a=S.refine[k];return '<button class="chip chip-dd" aria-pressed="'+!!a+'" aria-expanded="'+(S.open===k)+'" aria-controls="rp-'+k+'" data-a="refine" data-k="'+k+'">'+esc(a?a.text:r.label)+'<span class="dd" aria-hidden="true">'+ICCHEV+'</span></button>'}
function chipsCold(){return CHIPS.map(function(c){return c.charAt(0)==='@'?rfChip(c.slice(1)):chipBtn(c)}).join('')}
function chipBtn(c){return '<button class="chip" aria-pressed="'+(S.chips.indexOf(c)>-1)+'" data-a="chip" data-c="'+esc(c)+'">'+esc(c)+'</button>'}
function cold(){
  var h='<div class="cs">'+(S.prev?'<button class="backrow" data-a="back" aria-label="Zurück zu den Ergebnissen"><svg width="20" height="20" viewBox="0 0 22 22" fill="none" stroke="#2A2A2A" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3L6 11l8 8"/></svg>Zurück</button>':'')+'<div class="fld"><svg class="lupe" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#5D5D5D" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.8"/><path d="M13 13l5 5"/></svg><input id="q" value="'+esc(S.q)+'" placeholder="'+(S.ki?'Schreibe oder sprich ganze Sätze':'Wonach suchst du?')+'" aria-label="Suchbegriff">'+(S.ki?'<button class="mic" data-a="mic" aria-label="Spracheingabe">'+ICMIC+'</button>':'')+'</div>';
  h+='<div class="fld"><span class="ico-p"></span><input value="Deutschland" disabled aria-label="Ort"></div>';
  if(S.ki){
    h+=selBox({editable:true});
    h+='<div class="kioff kion"><div class="kioff-h">'+kiHead()+'<button class="sw-hit" data-a="ki" role="switch" aria-checked="true" aria-label="KI-Suche"><span class="sw" aria-checked="true"></span></button></div><p class="kioff-s" id="promptwrap"'+(wantCat(S.q)?' hidden':'')+'>Sobald du ein Suchwort eingibst, werden dir passende Kategorien und Suchbegriffe vorgeschlagen.</p></div>';
    h+='<div class="kifeat"><div id="catwrap"><div class="catcard"><span class="cc-ic"><span class="ic-sofa">'+ICSOFA+'</span><span class="ic-ki">'+KIDUO+'</span></span><div class="cc-t"><label class="cc-l" for="cat">Kategorie auswählen</label><div class="catf"><select id="cat"'+(showKiTag()?' class="sug"':hintOn()?' class="empty"':'')+' aria-label="Kategorie">'+['Alle Kategorien'].concat(CATS).map(function(c){return '<option'+(c===catShown()?' selected':'')+'>'+esc(c)+'</option>'}).join('')+'</select><span class="ki kibadge"'+(showKiTag()?'':' hidden')+'>Möbel &amp; Wohnen</span><span id="cathint" class="cc-hint"'+(hintOn()?'':' hidden')+'>Wird beim Tippen vorgeschlagen</span></div></div><span class="cc-chev">'+ICCHEV+'</span></div><span id="catlive" class="sr" role="status"></span>';
    h+='<div class="selrow">'+[['rad','Umkreis',S.radius,RADII.map(function(v){return [v,'+ '+v+' km']}),ICPIN],['del','Lieferung',S.delivery||(S.delEgal?'egal':''),[['Abholung','Abholung'],['Versand','Versand'],['egal','egal']],ICTRUCK]].map(function(f){return '<div><label class="catl" for="'+f[0]+'"><span class="sr-ic">'+f[4]+'</span>'+f[1]+'</label><div class="catf sm"><select id="'+f[0]+'"><option value="">optional</option>'+f[3].map(function(o){return '<option value="'+o[0]+'"'+(String(o[0])===f[2]?' selected':'')+'>'+o[1]+'</option>'}).join('')+'</select></div></div>'}).join('')+'</div></div>';
  }
  if(!S.ki){
    h+='<div class="kioff"><div class="kioff-h">'+kiHead()+'<button class="sw-hit" data-a="ki" role="switch" aria-checked="false" aria-label="KI-Suche"><span class="sw" aria-checked="false"></span></button></div><p class="kioff-t">Finde schneller passende Angebote mit smarten Vorschlägen.</p></div>';
  }
  if(S.ki){
    h+='<div id="chipwrap"'+(wantCat(S.q)?'':' hidden')+'><p class="sg">Wähle aus Vorschlägen</p><div class="chips">'+chipsCold()+'</div>'+(S.open&&S.view==='cold'?rpanel(rfOf(S.open)):'')+'</div>';
    h+='<div class="zrow"><p class="sg">Zustand</p><div class="chips">'+['egal','Neu','Gebraucht'].map(function(c){return '<button class="chip" aria-pressed="'+(S.cond===c)+'" data-a="cond" data-c="'+c+'">'+(c==='egal'?'Alle':c)+'</button>'}).join('')+'</div></div></div>';
  }
  h+='<div class="bottom"><button class="more" data-a="more">Weitere Filter anzeigen'+(S.ki?'<span class="more-chev">'+ICCHEV+'</span>':'')+'</button><button class="btn'+(S.ki?' btn-ki':'')+'" data-a="search">'+(S.ki?'<span class="btn-ic" aria-hidden="true">'+ICSTARS+'</span>':'')+'Suchen</button>'+(S.ki?'<button class="flink" data-a="info"><span class="fl-ic">'+ICINFO+'</span>Mehr über die KI-Suche erfahren</button>':'')+'</div></div>';
  return h;
}
function wantCat(q){return /sofa|couch/i.test(q||'')}
function hintOn(){return S.ki&&!S.catPick&&!showKiTag()}
function showKiTag(){return S.ki&&!S.catPick&&wantCat(S.q)}
function catShown(){return S.catPick||((S.ki&&wantCat(S.q))?'Möbel & Wohnen':'Alle Kategorien')}
function qline(){return S.chips.length?S.chips.join(', '):S.q}
function waiting(){
  return header()+cnt('0 Ergebnisse - “'+esc(S.q)+'”')+sponsored()+kirow()+
  '<div class="waitbox center wait-cancel">'+KILUPE+'<p class="wait-sub">Die normalen Suchergebnisse bleiben sichtbar.</p></div>'+
  '<div class="waitnote center" role="status" aria-live="polite"><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="sr">KI sucht passende Anzeigen</span><button class="ulink" data-a="cancel">Suche abbrechen</button></div>'+
  secNormal(false)+listing('d')+more()+endLink()+fab();
}
function fbBar(){
  if(S.fbDone)return '<div class="fb done"><b>Danke für dein Feedback.</b>Wir blenden den Hinweis für diese Suche aus. Alle Ergebnisse bleiben sichtbar.</div>';
  return '<div class="fb"><span>Passt der Hinweis?</span><button class="th" data-a="fb" data-v="ja" aria-label="Daumen hoch: Hinweis passt"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 11v9H4v-9zM7 11l4-8a2 2 0 0 1 2 2v4h6a2 2 0 0 1 2 2.3l-1.2 6A2 2 0 0 1 17.8 20H7"/></svg></button><button class="th" data-a="fb" data-v="nein" aria-label="Daumen runter: Hinweis passt nicht"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="transform:rotate(180deg)"><path d="M7 11v9H4v-9zM7 11l4-8a2 2 0 0 1 2 2v4h6a2 2 0 0 1 2 2.3l-1.2 6A2 2 0 0 1 17.8 20H7"/></svg></button></div>';
}
function hitsNow(){var f=curFlt();return P.sicher.filter(function(x){return passes(x,f)}).slice(0,fltActive(f)?3:2)}
var CMP_DATES=['Heute, 10:24','Heute, 08:17','Gestern, 18:41'];
var ICSCALE='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v16M7 20h10M4 7h16"/><path d="M4 7l-2.5 6a3.5 3.5 0 0 0 5 0zM20 7l-2.5 6a3.5 3.5 0 0 0 5 0z"/></svg>';
/* Auswahl für den Vergleich: erst die ersten zwei Treffer, danach nach Klick */
function cmpSel(ids){var sel=(S.cmp||ids.slice(0,2)).filter(function(i){return ids.indexOf(i)>-1});return sel}
function cmpCriteria(){var f=curFlt(),a=[];S.chips.slice(0,3).forEach(function(c){a.push(c)});Object.keys(S.refine).forEach(function(k){a.push(S.refine[k].text)});if(f.radius)a.push('bis '+f.radius+' km');if(f.delivery)a.push(f.delivery);if(f.cond)a.push(f.cond);return a.length?a.join(' · '):(S.q||'Deine Suche')}
function cmpCard(){return '<button class="cmpcard" data-a="cmpgo"><span class="cmp-th" aria-hidden="true"><span class="th1"></span><span class="th2"></span><b>VS</b></span><span class="cmp-tx"><b>Sofas im Vergleich</b><small>'+esc(cmpCriteria())+'</small></span><span class="cmp-ch" aria-hidden="true">'+ICCHEV+'</span></button>'}
function cmpBar(n){return '<div class="cmpbar" role="region" aria-label="Vergleich"><span class="cb-ic" aria-hidden="true">'+ICSCALE+'</span><span class="cb-t">'+n+(n===1?' Angebot':' Angebote')+' zum Vergleich ausgewählt</span><button class="cb-btn" data-a="cmpgo"'+(n<2?' disabled':'')+'>Jetzt vergleichen<span aria-hidden="true">'+ICCHEV+'</span></button></div>'}

/* Vergleichsansicht: ausgewählte Anzeigen nebeneinander, Bestwerte markiert */
function compare(){
  var f=curFlt(),all=hitsNow(),ids=all.map(function(x){return x.id}),sel=cmpSel(ids),it=all.filter(function(x){return sel.indexOf(x.id)>-1}),n=it.length;
  function bestMin(fn){var v=it.map(fn).filter(function(x){return x!=null});return v.length>1?Math.min.apply(null,v):null}
  var bp=bestMin(function(x){return x.price}),bk=bestMin(function(x){return x.km});
  var shipN=function(x){return x.ship?x.ship.length:0},bs=Math.max.apply(null,it.map(shipN)),shipDiff=it.some(function(x){return shipN(x)!==bs});
  var neuDiff=it.some(function(x){return x.cond==='Neu'})&&it.some(function(x){return x.cond!=='Neu'});
  /* Zelle: best=true färbt den Bestwert grün und setzt einen Haken */
  function cell(txt,best,cls){return '<div class="tb-c'+(best?' best':'')+(cls?' '+cls:'')+'">'+(best?'<b aria-hidden="true">✓</b>':'')+'<span>'+esc(txt)+'</span></div>'}
  function row(label,fn){return '<div class="tb-l">'+label+'</div>'+it.map(fn).join('')}
  var h='<div class="cmpv"><div class="cv-h"><button class="hbtn" data-a="cmpback" aria-label="Zurück zu den Ergebnissen"><svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="#2A2A2A" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3L6 11l8 8"/></svg></button><h1>Vergleich</h1></div>';
  h+='<div class="cv-intro"><span class="cv-ic" aria-hidden="true">'+SPARK+'</span><p>'+n+' Angebote im Vergleich <span class="cv-leg"><b aria-hidden="true">✓</b> Bester Wert</span></p></div>';
  h+='<div class="tb" style="--n:'+n+'">';
  h+='<div class="tb-l tb-h0"></div>'+it.map(function(x){return '<div class="tb-c tb-hd"><span class="cv-im" aria-hidden="true"></span><b>'+esc(x.t)+'</b><span class="cv-pr">'+x.p+'</span></div>'}).join('');
  h+=row('Preis',function(x){return cell(x.p,bp!=null&&x.price===bp)});
  h+=row('Nähe',function(x){return cell(x.km!=null?x.km+' km':'k. A.',bk!=null&&x.km===bk)});
  h+=row('Breite',function(x){return cell(x.w!=null?x.w+' cm':'k. A.')});
  h+=row('Lieferung',function(x){return cell(x.ship?x.ship.join(' + '):'k. A.',shipDiff&&shipN(x)===bs)});
  h+=row('Zustand',function(x){return cell(x.cond||'k. A.',neuDiff&&x.cond==='Neu')});
  h+=row('Farbe',function(x){return cell(x.col||'k. A.')});
  h+=row('Typ',function(x){return cell(x.tags&&x.tags.length?x.tags.join(', '):'k. A.')});
  h+=row('Passt',function(x){var ok=evalCard(x,f).filter(function(c){return c.s==='ok'}).map(function(c){return c.label});return '<div class="tb-c tb-ok">'+(ok.length?ok.map(function(t){return '<span><b aria-hidden="true">✓</b> '+esc(t)+'</span>'}).join(''):'<span>'+esc(qline()||'deine Suche')+'</span>')+'</div>'});
  h+='</div><p class="cv-note">k. A. = nicht angegeben. Angaben aus dem Anzeigentext, bitte prüfe sie in der Anzeige.</p><div class="cv-act"><button class="btn" data-a="cmpback">Zurück zu den Ergebnissen</button></div></div>';
  return h;
}
function high(){
  var r,f=curFlt(),hitsArr=hitsNow();
  var ids=hitsArr.map(function(x){return x.id}),sel=cmpSel(ids);
  var hits=hitsArr.map(function(x,i){return listing(x,{facts:1,kitag:1,flt:f,cmp:{id:x.id,on:sel.indexOf(x.id)>-1,date:CMP_DATES[i%CMP_DATES.length]}})}).join('');
  var none=!hits;
  var fb=none?fbBar():'';
  r='';
  if(S.highEdit)r='<div class="aibox high-edit"><button type="button" class="editclose" data-a="highclose" aria-label="Suche anpassen schließen"><span aria-hidden="true">×</span></button>'+selBox({editable:true,query:true})+(!hasSel()&&!S.q?'<p>Keine Kriterien ausgewählt.</p>':'')+'</div>';
  else if(!none)r=cmpCard();
  var tail=none?'<div class="msg"><h3>Keine Anzeige erfüllt alle deine Kriterien</h3></div>':'';
  var kibox=none?kirow():'<div class="kibox">'+kirow()+'<p class="kibox-t">Wir haben '+hitsArr.length+(hitsArr.length===1?' passendes Angebot':' passende Angebote')+' gefunden und für dich verglichen.</p><p class="kibox-s">Angaben aus dem Anzeigentext, bitte prüfen.</p></div>';
  var mid=none?'':secFound('Gefundene Ergebnisse')+hits+fb;
  return header()+cnt('312 Ergebnisse - “'+esc(qline())+'”')+sponsored()+kibox+tail+(none&&!S.highEdit?selBox():'')+r+'<div class="hact">'+(S.highEdit?'':'<button data-a="highedit">Suche anpassen</button>')+'<button data-a="newsearch">'+RELOAD+'Neu suchen</button></div>'+(none?fb:'')+mid+secNormal()+listing('e')+more()+foot()+fab()+(none?'':cmpBar(sel.length));
}
var RF=[
  {k:'mass',label:'Maße',title:'Breite des Sofas',quick:[160,180,200],field:'Eigene Breite',unit:'cm',max:400,fmt:function(d){return 'Breite < '+d.n+' cm'}},
  {k:'price',label:'Preis',title:'Preis',quick:[{v:50,o:'<'},{v:100,o:'<'},{v:200,o:'<'},{v:300,o:'<'},{v:500,o:'<'}],nolabel:1,field:'Eigener Betrag',unit:'€',max:99999,fmt:function(d){return (d.o==='>'?'> ':'< ')+d.n+' €'}},
  {k:'color',label:'Farbe',title:'Farbe des Sofas',quick:['Weiß','Schwarz','Grau','Beige','Braun','Grün','Blau'],choice:1,err:'Bitte wähle eine Farbe.',fmt:function(d){return 'Farbe '+d.n}}
];
function clearSel(){S.cmp=null;S.cfb={};S.chips=[];S.radius='';S.delivery='';S.delEgal=false;S.cond='';resetRefine()}
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
  secFound('Mögliche Ergebnisse')+(lowCards(flt).map(function(x){return listing(x,{miss:1,why:1,kitag:1,flt:flt})}).join('')||'<div class="msg"><p>Keine weiteren Anzeigen mit unsicheren Angaben zu deinen Kriterien.</p></div>')+secNormal()+listing('d')+more()+foot()+fab();
}
function none(){
  return header()+cnt('Keine KI-Treffer - “'+esc(S.q)+'”')+sponsored()+kirow()+
  '<div class="msg"><h3>Keine passenden Ergebnisse gefunden</h3><p>Es wurden keine passenden Anzeigen für deine gewählten Kriterien gefunden. Entferne Kriterien oder versuche eine andere Suche.</p></div>'+
  selBox()+
  '<div class="cat"><b>Kategorieempfehlung:</b><button data-a="catrec">Sofas &amp; Sitzgarnituren</button><p class="category-note">Startet eine neue Suche in dieser Kategorie ohne die bisherigen Kriterien.</p></div>'+
  '<div class="aibox" style="padding:14px 14px 4px"><p class="h3" style="margin:0 0 8px;font-size:13px;color:#4B5E52">Versuche es mit einem anderen Suchbegriff</p><p style="font-size:12px;margin:0">Wähle einen Vorschlag und tippe auf „Neu suchen“.</p><div class="chips" style="gap:10px;margin-top:14px">'+['sofa klein','Kleines Schlafsofa','2-Sitzer-Sofa','Kompaktsofa'].map(function(c){return '<button class="chip" aria-pressed="'+(S.termPick===c)+'" data-a="term" data-c="'+c+'">'+c+'</button>'}).join('')+'</div></div>'+
  '<div class="ki-end"><div class="hact two">'+'<span></span>'+'<button data-a="termsearch"'+(S.termPick?'':' disabled')+'>'+RELOAD+'Neu suchen</button></div>'+fbBar()+
  '</div>'+
  secNormal()+listing('e')+more()+foot()+fab();
}
function fail(){
  return header()+cnt('312 Ergebnisse - “'+esc(S.q)+'”')+sponsored()+kirow()+
  '<div class="fail-box" role="alert">'+WARN+'<div class="msg"><h3>Deine Suche konnte nicht geladen werden</h3><p class="fail-sub">Die normalen Suchergebnisse bleiben sichtbar.</p><button class="btn retry-btn" data-a="retry"><span aria-hidden="true">'+LUPEKI+'</span>Neue Suche starten</button></div></div>'+
  secNormal(false,true)+listing('e')+more()+foot()+fab();
}
function plain(){
  return header()+cnt('312 Ergebnisse - “'+esc(S.q)+'”')+sponsored()+kirow()+
  (S.aborted?'<div class="waitbox center" role="status"><h3>Du hast die Suche abgebrochen</h3><p class="wait-sub">Die normalen Suchergebnisse bleiben sichtbar.</p><button class="btn btn-ki again-btn" data-a="again"><span class="btn-ic" aria-hidden="true">'+ICSTARS+'</span>Erneut suchen</button></div>':'')+
  secNormal(false)+listing('d')+more()+foot()+fab();
}
function render(){
  document.querySelectorAll('[data-j]').forEach(function(b){var k=b.dataset.j,on=k==='cold-on'?S.view==='cold'&&S.ki:k==='cold-off'?S.view==='cold'&&!S.ki:(k==='wait'?'waiting':k)===S.view;b.setAttribute('aria-pressed',String(on))});
  var v={cold:cold,waiting:waiting,high:high,low:low,none:none,fail:fail,plain:plain,compare:compare}[S.view]();
  $('#phone').innerHTML='<div class="scr">'+v+'</div>'+sheet()+(S.toast?'<div class="toast" role="status">'+esc(S.toast)+'</div>':'');ensureRoom();
  var info=$('#ki-info');if(info){info.showModal();info.addEventListener('cancel',function(e){e.preventDefault();closeInfo()})}
  var q=$('#q');if(q){q.addEventListener('input',function(){S.q=q.value;var has=!!q.value.trim(),chips=wantCat(q.value);if(!has)S.catPick=null;var sw=$('#chipwrap'),pw=$('#promptwrap');if(sw)sw.hidden=!chips;if(pw)pw.hidden=chips;var cs=$('#cat');if(cs){cs.value=catShown();cs.classList.toggle('sug',showKiTag());cs.classList.toggle('empty',hintOn());var ht=$('#cathint');if(ht)ht.hidden=!hintOn()}var kt=$('#catwrap .ki');if(kt)kt.hidden=!showKiTag();var lv=$('#catlive');if(lv)lv.textContent=showKiTag()?'KI schlägt die Kategorie Möbel und Wohnen vor':''})}
  if(q)q.addEventListener('click',function(){if(S.view!=='cold'||!S.ki||q.value.trim())return;q.value='kleines Sofa für meine Wohnung';q.dispatchEvent(new Event('input',{bubbles:true}));q.setSelectionRange(q.value.length,q.value.length)});
  [['#rad','radius'],['#del','delivery']].forEach(function(f){var e=$(f[0]);if(e)e.addEventListener('change',function(){if(f[1]==='delivery'){S.delEgal=e.value==='egal';S.delivery=S.delEgal?'':e.value}else S[f[1]]=e.value;render();var n=$(f[0]);if(n)n.focus()})});
  var c=$('#cat');if(c){c.addEventListener('change',function(){S.cat=c.value;S.catPick=c.value;c.classList.remove('sug');c.classList.remove('empty');var ht2=$('#cathint');if(ht2)ht2.hidden=true;var kt=$('#catwrap .ki');if(kt)kt.hidden=true})}
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
  clearT();S.view='waiting';S.cmp=null;S.cfb={};S.fbDone=false;S.open='';S.draft={};S.selOpen=false;S.edit='';render();anchorKI();
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

function rerun(){
  if(S.view==='none'){S.retry=false;startAI();return true}
  /* High: Fallen durch das Entfernen von Kriterien die Voraussetzungen weg, startet die KI neu (z. B. nur "kleines Sofa" ergibt Low) */
  if(S.view==='high'&&S.scenario==='auto'){var r=S.retry;S.retry=false;if(outcome()!=='high'){S.highEdit=false;startAI();return true}S.retry=r}
  return false
}
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
  if((e.key==='Enter'||e.key===' ')&&t.classList&&(t.classList.contains('cmp-pill')||t.classList.contains('cth'))){e.preventDefault();t.click()}
});
document.addEventListener('click',function(e){
  var el=e.target.closest('[data-a]');
  if(!el)return;
  if(el.dataset.a==='closesheet'&&e.target.closest('[data-stop]')&&!e.target.closest('button'))return;
  var a=el.dataset.a;
  if(a==='cmp'){var cid=el.dataset.id,cur=S.cmp||hitsNow().map(function(x){return x.id}).slice(0,2),ci=cur.indexOf(cid);S.cmp=cur.slice();if(ci>-1)S.cmp.splice(ci,1);else S.cmp.push(cid);var y0=window.pageYOffset;render();window.scrollTo(0,y0)}
  else if(a==='cmpgo'){var cs0=cmpSel(hitsNow().map(function(x){return x.id}));if(cs0.length<2)toast('Wähle mindestens zwei Angebote aus.');else go('compare')}
  else if(a==='cmpback'){go('high')}
  else if(a==='cfb'){var fid=el.dataset.id,fv=el.dataset.v;S.cfb=S.cfb||{};if(S.cfb[fid]===fv)delete S.cfb[fid];else S.cfb[fid]=fv;var y1=window.pageYOffset;render();window.scrollTo(0,y1);if(fv==='ja'&&S.cfb[fid]==='ja')toast('Danke. Das Feedback wurde gezählt.')}
  else if(a==='mic'){toast('Spracheingabe gibt es in diesem Prototyp noch nicht.')}
  else if(a==='ki'){S.ki=!S.ki;clearSel();render()}
  else if(a==='kitoggle'){clearSel();if(S.ki){S.ki=false;clearT();S.aborted=false;go('plain')}else{S.ki=true;S.kiHint=true;S.kiHintT0=Date.now();startAI()}}
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
  else if(a==='newsearch'){S.q='';S.chips=[];S.radius='';S.delivery='';S.delEgal=false;S.cond='';S.catPick=null;S.scenario='auto';resetRefine();go('cold')}
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
/* Nur für automatische Prüfungen: mit ?test in der URL kommt man an den Zustand */
if(/[?&]test(&|$)/.test(location.search))window.__da={S:S,go:go,render:render,evalCard:evalCard};
})();
