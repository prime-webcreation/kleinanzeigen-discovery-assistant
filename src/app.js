/* Discovery Assistant Prototyp - Stand: 02.11.2026
   Zustand (S), Inhalte, Render-Funktionen, Events. Kein echtes Modell. */
(function(){
var $=function(s){return document.querySelector(s)};
var S={view:'cold',ki:true,q:'',cat:'Möbel & Wohnen',catPick:null,prev:null,chips:[],t:[],scenario:'auto',retry:false,sheet:false,toast:'',radius:'',delivery:'',cond:'',refine:{},open:'',draft:{},fbDone:false,showCancel:false};
var RADII=[5,10,20,50,100];
var CHIPS=['2-Sitzer','< 180cm','kleines Sofa','Ecksofa','Sitzgarnituren','Couch','Kompakter 3-Sitzer'];
var CATS=['Möbel & Wohnen','Haus & Garten','Elektronik','Mode & Beauty'];
var L={
 a:{t:'Kleines grünes Sofa',p:'140 €',f:['140x120cm','2-Sitzer'],ort:'Berlin',m:{w:140,km:8,ship:['Versand','Abholung'],cond:'Gebraucht',tags:['2-Sitzer','kleines Sofa']}},
 h:{t:'Zweisitzer wie neu',p:'95 €',f:['150x90cm','2-Sitzer'],ort:'Hamburg',m:{w:150,km:30,ship:['Versand'],cond:'Neu',tags:[]}},
 i:{t:'Kleines Sofa mit Stauraum',p:'80 €',f:['165x85cm'],ort:'Köln',m:{w:165,km:6,ship:['Versand','Abholung'],cond:'Gebraucht',tags:[]}},
 b:{t:'Gut erhaltene Couch',p:'140 €',f:['140x120cm'],ort:'Gelsenkirchen',m:{w:140,km:14,ship:['Abholung'],cond:'Neu',tags:['Couch']}},
 c:{t:'Sofa aus Stoff (in echt kleiner)',p:'75 € VB',miss:'Größe nicht angegeben',ort:'Ort',m:{w:null,km:12,ship:['Versand'],cond:'Gebraucht'}},
 d:{t:'Graues Stoffsofa',p:'140 €',top:1,ort:'Ort'},
 e:{t:'Kleines Stoffsofa, 2-Sitzer',p:'140 €',top:1,ort:'Ort'},
 f:{t:'Schlafsofa, gut erhalten',p:'110 € VB',ort:'Ort'},
 g:{t:'Sofa aus Stoff',p:'75 € VB',ort:'Ort'}
};
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function clearT(){S.t.forEach(clearTimeout);S.t=[]}
var AIV=['waiting','high','low','none','fail'];
function anchorY(){var el=$('.kirow');return el?Math.max(0,el.getBoundingClientRect().top+window.pageYOffset-8):0}
function ensureRoom(){if(!S.ki||AIV.indexOf(S.view)<0)return;var sc=$('.scr');if(!sc)return;var need=anchorY()+window.innerHeight-document.documentElement.scrollHeight;if(need>0)sc.style.paddingBottom=(84+need)+'px'}
function anchorKI(){ensureRoom();var rm=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;window.scrollTo({top:anchorY(),behavior:rm?'auto':'smooth'})}
function go(v){clearT();if(v==='cold'){S.prev=(S.view!=='cold'&&S.view!=='waiting')?S.view:null}else{S.prev=null}S.view=v;S.sheet=false;render();if(v==='high'||v==='low'||v==='none'||v==='fail')anchorKI();else window.scrollTo(0,0)}
function toast(m){S.toast=m;render();setTimeout(function(){S.toast='';render()},2200)}
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
  return '<div class="kirow"><h2>KI-Suchhilfe<u>(optional)</u></h2><button class="sw-hit" data-a="kitoggle" role="switch" aria-checked="'+on+'" aria-label="KI-Suchhilfe"><span class="sw" aria-checked="'+on+'"></span></button></div><div class="kinote">ⓘ Vorschläge und Trefferhinweise sind KI-gestützt.</div>';
}
var TYPES={
  '2-Sitzer':{t:['Kleines grünes Sofa, 2-Sitzer','Gepflegtes 2-Sitzer-Sofa','Zweisitzer wie neu','2-Sitzer mit Stauraum'],w:140},
  'Kompakter 3-Sitzer':{t:['Kompakter Dreisitzer, grün','3-Sitzer, kompakt und bequem','Dreisitzer, Stoff, hellgrau','Kompakter 3-Sitzer mit Hocker'],w:170},
  'Ecksofa':{t:['Kleines Ecksofa, hellgrau','Ecksofa mit Hocker','Ecksofa in Anthrazit','Kleines Ecksofa mit Bettfunktion'],w:175},
  'Sitzgarnituren':{t:['Sitzgarnitur 3-2-1, Stoff','Sitzgarnitur, 2-teilig','Sitzgarnitur in Leder','Sitzgarnitur 3-1-1'],w:240},
  'Couch':{t:['Gut erhaltene Couch','Couch in Beige','Couch, sehr bequem','Couch mit Armlehnen'],w:150},
  'kleines Sofa':{t:['Kleines grünes Sofa','Kleines Sofa, gut erhalten','Kleines Sofa in Grau','Kleines Sofa, 2-Sitzer'],w:130}
};
var POOL=['a','b','h','i'];
function adapt(k){
  var x=L[k],idx=POOL.indexOf(k);if(idx<0)return x;
  var sel=S.chips.filter(function(c){return TYPES[c]});
  if(!sel.length)return x;
  var y={},n,c=sel[idx%sel.length];for(n in x)y[n]=x[n];y.m={};for(n in x.m)y.m[n]=x.m[n];
  y.t=TYPES[c].t[idx];y.m.tags=[c];y.m.w=TYPES[c].w+idx*5;
  return y;
}
function passes(x,f){
  var m=x.m||{},price=parseFloat(String(x.p).replace(',','.'));
  var chipsOk=(f.chips||[]).every(function(c){return c==='< 180cm'?(m.w!=null&&m.w<180):(TYPES[c]?(m.tags||[]).indexOf(c)>-1:true)});
  return chipsOk&&(!f.max||price<=f.max)&&(!f.mass||(m.w!=null&&m.w<=f.mass))&&(!f.radius||(m.km!=null&&m.km<=f.radius))&&(!f.delivery||(m.ship||[]).indexOf(f.delivery)>-1)&&(!f.cond||m.cond===f.cond);
}
function curFlt(){
  return {max:S.refine.price?parseInt(S.refine.price.n,10):0,mass:S.refine.mass?parseInt(S.refine.mass.n,10):0,radius:S.radius?parseInt(S.radius,10):0,delivery:S.delivery,cond:S.cond,chips:S.chips};
}
function fltActive(f){return !!(f.max||f.mass||f.radius||f.delivery||f.cond||(f.chips&&f.chips.length))}
function fltLines(x,f){
  var m=x.m||{},ok=[],nf=[],price=parseFloat(String(x.p).replace(',','.'));
  (f.chips||[]).forEach(function(c){if(c==='< 180cm'){if(m.w!=null&&m.w<180)ok.push('< 180 cm')}else if((m.tags||[]).indexOf(c)>-1)ok.push(c)});
  if(f.max&&price<=f.max)ok.push('unter '+f.max+' €');
  if(f.mass){if(m.w==null)nf.push('Breite nicht angegeben');else if(m.w<=f.mass)ok.push('Breite '+m.w+' cm')}
  if(f.radius){if(m.km==null)nf.push('Entfernung nicht angegeben');else if(m.km<=f.radius)ok.push(m.km+' km entfernt')}
  if(f.delivery){if(!m.ship)nf.push(f.delivery+' nicht angegeben');else if(m.ship.indexOf(f.delivery)>-1)ok.push(f.delivery+' möglich')}
  if(f.cond){if(!m.cond)nf.push('Zustand nicht angegeben');else if(m.cond===f.cond)ok.push(m.cond)}
  return (nf.length?'<span class="facts nf">'+nf.map(function(t){return '<span>ⓘ '+t+'</span>'}).join('')+'</span>':'')+(ok.length?'<span class="facts">'+ok.map(function(t){return '<span>✓ '+t+'</span>'}).join('')+'</span>':'');
}
function listing(k,o){
  o=o||{};var x=adapt(k);var h='<button class="lst" data-a="open"><span class="im"><i></i><i></i></span><span class="ct"><span class="ort">'+x.ort+' · Heute</span>';
  if(o.kitag)h+='<span class="kitag" role="img" aria-label="KI-Vorschlag">'+SPARK+'</span>';
  h+='<span class="ti">'+esc(x.t)+'</span>';
  if(o.facts&&x.f&&!(o.flt&&fltActive(o.flt))){h+='<span class="facts">'+x.f.map(function(f){return '<span>✓ '+esc(f)+'</span>'}).join('')+'</span>'}
  if(o.kib)h+='<span><span class="kib">✓ KI-Vorschlag</span> <small style="color:#aeaeae;font-size:10px">'+esc(x.f[0])+'</small></span>';
  if(x.miss&&o.miss&&!(o.flt&&o.flt.mass))h+='<span class="miss">ⓘ '+esc(x.miss)+'</span>';
  var act=o.flt&&fltActive(o.flt);
  if(act)h+=fltLines(x,o.flt);
  if(x.top)h+='<span class="dis">Gesponsert</span>';
  h+='<span class="pr">'+x.p+'</span></span>'+(x.top?'<span class="top">TOP</span>':'')+'</button>';
  return h;
}
function secFound(l,wait){return '<div class="sec sec-ki">'+l+'<span class="pill">KI-gestützt</span></div>'+(wait?'<div class="dots" aria-hidden="true"><span class="row"><i></i><i></i><i></i></span><span>Ergebnisse werden geladen</span></div>':'')}
function secNormal(){return '<div class="sec sec-n">Suchergebnisse<span class="sub"></span></div>'}
function fab(){return '<div class="fabwrap"><button class="fab" data-a="edit">Filter anpassen</button></div>'}
function foot(){return '<div class="foot">Alle Anzeigen bleiben sichtbar und auswählbar. TOP und Gesponsert sind bezahlt und nicht Teil der KI-Auswahl.</div>'}
function sheet(){
  if(!S.sheet)return'';
  return '<div class="sheet-bg" data-a="closesheet"><div class="sheet" role="dialog" aria-modal="true" aria-label="Über die KI-Suche" data-stop="1"><h3>Über die KI-Suche</h3><ul><li>Sie schlägt Kategorie und Suchbegriffe vor. Du entscheidest.</li><li>Trefferhinweise stammen nur aus dem Anzeigentext. Bitte prüfe die Anzeige.</li><li>Bezahlte Anzeigen (TOP, Gesponsert) sind getrennt und beeinflussen die KI-Auswahl nicht.</li><li>Du kannst die KI-Suche jederzeit ausschalten. Die normale Suche bleibt gleich.</li></ul><button class="btn" data-a="closesheet">Verstanden</button></div></div>';
}

function chipBtn(c){return '<button class="chip" aria-pressed="'+(S.chips.indexOf(c)>-1)+'" data-a="chip" data-c="'+esc(c)+'">'+esc(c)+'</button>'}
function cold(){
  var h='<div class="cs">'+(S.prev?'<button class="backrow" data-a="back" aria-label="Zurück zu den Ergebnissen"><svg width="20" height="20" viewBox="0 0 22 22" fill="none" stroke="#2A2A2A" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3L6 11l8 8"/></svg>Zurück</button>':'')+'<div class="fld"><svg class="lupe" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#5D5D5D" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.8"/><path d="M13 13l5 5"/></svg><input id="q" value="'+esc(S.q)+'" placeholder="'+(S.ki?'Was suchst du?':'Wonach suchst du?')+'" aria-label="Suchbegriff"></div>';
  h+='<div class="fld"><span class="ico-p"></span><input value="Deutschland" disabled aria-label="Ort"></div>';
  if(S.ki){
    h+='<div id="catwrap"><p class="catl">Kategorie auswählen</p><div class="catf"><select id="cat"'+(showKiTag()?' class="sug"':'')+' aria-label="Kategorie">'+['Alle Kategorien'].concat(CATS).map(function(c){return '<option'+(c===catShown()?' selected':'')+'>'+esc(c)+'</option>'}).join('')+'</select><span class="ki"'+(showKiTag()?'':' hidden')+'>✦ KI-Vorschlag</span></div><span id="catlive" class="sr" role="status"></span>';
    h+='<div class="selrow">'+[['rad','Umkreis',S.radius,RADII.map(function(v){return [v,'+ '+v+' km']})],['del','Lieferung',S.delivery,[['Abholung','Abholung'],['Versand','Versand']]]].map(function(f){return '<div><label class="catl" for="'+f[0]+'">'+f[1]+'</label><div class="catf sm"><select id="'+f[0]+'"><option value="">optional</option>'+f[3].map(function(o){return '<option value="'+o[0]+'"'+(String(o[0])===f[2]?' selected':'')+'>'+o[1]+'</option>'}).join('')+'</select></div></div>'}).join('')+'</div></div>';
  }
  h+='<div class="tgl"><h2>KI-Suchvorschläge<u>(optional)</u></h2><button class="sw-hit" data-a="ki" role="switch" aria-checked="'+S.ki+'" aria-label="KI-Suchvorschläge"><span class="sw" aria-checked="'+S.ki+'"></span></button></div>';
  if(S.ki){
    h+='<p class="nt">ⓘ Ergebnisse und Trefferhinweise sind KI-gestützt.</p><div id="promptwrap"'+(wantCat(S.q)?' hidden':'')+'><p class="nt" style="margin-top:18px">Sobald du ein Suchwort eingibst, werden dir passende Kategorien und Suchbegriffe vorgeschlagen.</p></div><div id="chipwrap"'+(wantCat(S.q)?'':' hidden')+'><p class="sg">Wähle aus Vorschlägen</p><div class="chips">'+CHIPS.map(chipBtn).join('')+'</div></div>';
    h+='<div class="zrow"><p class="sg">Zustand</p><div class="chips">'+['Neu','Gebraucht'].map(function(c){return '<button class="chip" aria-pressed="'+(S.cond===c)+'" data-a="cond" data-c="'+c+'">'+c+'</button>'}).join('')+'</div></div>';
  }
  h+='<div class="bottom"><button class="more" data-a="more">Weitere Filter anzeigen</button><button class="btn" data-a="search">Suchen</button><button class="flink" data-a="info">Mehr über die KI-Suche erfahren</button></div></div>';
  return h;
}
function wantCat(q){return /sofa|couch/i.test(q||'')}
function showKiTag(){return S.ki&&!S.catPick&&wantCat(S.q)}
function catShown(){return S.catPick||((S.ki&&wantCat(S.q))?'Möbel & Wohnen':'Alle Kategorien')}
function qline(){return S.chips.length?S.chips.join(', '):S.q}
function waiting(){
  var cancel=S.showCancel?'<br><button class="ulink" data-a="cancel">Suche abbrechen</button>':'';
  return header()+cnt('0 Ergebnisse - “'+esc(S.q)+'”')+sponsored()+kirow()+
  '<div class="waitbox center" role="status" aria-live="polite">'+KISP+'KI sucht passende Anzeigen...'+cancel+'</div>'+
  secFound('Gefundene Ergebnisse',true)+secNormal()+listing('d')+listing('g')+fab();
}
function high(){
  var r,f=curFlt(),hits=POOL.filter(function(k){return passes(adapt(k),f)}).slice(0,fltActive(f)?3:2).map(function(k){return listing(k,{facts:1,kitag:1,flt:f})}).join('')||'<div class="msg"><p>Keine Anzeige erfüllt alle deine Kriterien. Die normalen Suchergebnisse bleiben sichtbar.</p></div>';
  if(S.fbDone)r='<div class="aibox"><p class="ln" style="margin:0"><b style="color:var(--ink);font-weight:700">Danke für dein Feedback.</b></p><div class="tr" style="text-align:left">Wir blenden den Hinweis für diese Suche aus. Alle Ergebnisse bleiben sichtbar.</div></div>';
  else r='<div class="aibox hc"><div class="tr">Angaben aus dem Anzeigentext – bitte prüfen.</div><p class="ln">✓ Passt zu <b>'+esc(S.chips.length?S.chips.slice(0,3).join(', '):S.q)+'</b></p>'+(S.delivery||/versand/i.test(S.q)?'<p class="ln">✓ <b>'+(S.delivery||'Versand')+'</b> laut Anzeige möglich</p>':'')+(S.cond?'<p class="ln">✓ Zustand <b>'+S.cond+'</b> laut Anzeige</p>':'')+(S.radius?'<p class="ln">✓ Umkreis <b>+ '+S.radius+' km</b> berücksichtigt</p>':'')+'<div class="fb"><span>Passt der Hinweis?</span><button class="th" data-a="fb" data-v="ja" aria-label="Daumen hoch: Hinweis passt"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 11v9H4v-9zM7 11l4-8a2 2 0 0 1 2 2v4h6a2 2 0 0 1 2 2.3l-1.2 6A2 2 0 0 1 17.8 20H7"/></svg></button><button class="th" data-a="fb" data-v="nein" aria-label="Daumen runter: Hinweis passt nicht"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="transform:rotate(180deg)"><path d="M7 11v9H4v-9zM7 11l4-8a2 2 0 0 1 2 2v4h6a2 2 0 0 1 2 2.3l-1.2 6A2 2 0 0 1 17.8 20H7"/></svg></button></div></div>';
  return header()+cnt('312 Ergebnisse - “'+esc(qline())+'”')+sponsored()+kirow()+r+secFound('Gefundene Ergebnisse')+hits+secNormal()+listing('e')+listing('f')+listing('g')+foot()+fab();
}
var RF=[
  {k:'mass',label:'Maße auswählen',title:'Breite des Sofas',quick:[160,180,200],field:'oder eigene Breite',unit:'cm',max:400,fmt:function(d){return 'Breite bis '+d.n+' cm'}},
  {k:'price',label:'Preis festlegen',title:'Höchstpreis',quick:[50,100,200],field:'oder eigener Betrag',unit:'€',max:99999,fmt:function(d){return 'bis '+d.n+' €'}}
];
function resetRefine(){S.refine={};S.open='';S.draft={}}
function rfOf(k){return RF.filter(function(r){return r.k===k})[0]}
function rpanel(r){
  var d=S.draft[r.k]||{n:''},id='rp-'+r.k;
  var h='<div class="rpanel" id="'+id+'" role="group" aria-labelledby="'+id+'-t"><p class="rt" id="'+id+'-t">'+r.title+'</p>';
  h+='<p class="rl" style="margin-bottom:8px">'+'Schnellauswahl'+'</p><div class="chips rq">'+r.quick.map(function(v){return '<button class="chip" aria-pressed="'+(d.n===String(v))+'" data-a="rq" data-k="'+r.k+'" data-v="'+v+'">bis '+v+' '+r.unit+'</button>'}).join('')+'</div>';
  h+='<label class="rl" for="'+id+'-n">'+r.field+'</label><div class="rf"><input class="rin" id="'+id+'-n" data-rk="'+r.k+'" data-rf="n" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="5" placeholder="z. B. '+r.quick[1]+'" value="'+esc(d.n)+'"'+(d.err?' aria-invalid="true" aria-describedby="'+id+'-e"':'')+'><span class="ru">'+r.unit+'</span></div>';
  if(d.err)h+='<p class="rerr" id="'+id+'-e" role="alert">Bitte gib eine Zahl zwischen 1 und '+r.max+' ein.</p>';
  h+='<div class="ract"><button class="rbtn" data-a="rapply" data-k="'+r.k+'">Übernehmen</button><button class="rclr" data-a="rclear" data-k="'+r.k+'">'+(S.refine[r.k]?'Entfernen':'Abbrechen')+'</button></div></div>';
  return h;
}
function low(){
  var keys=Object.keys(S.refine),n=[312,148,61,22][Math.min(keys.length+[S.radius,S.delivery,S.cond].filter(Boolean).length,3)];
  var chosen=S.chips;
  var shown=chosen.map(function(c){return {t:c,k:'chip',v:c}});
  if(S.radius)shown.push({t:'Umkreis + '+S.radius+' km',k:'radius'});
  if(S.delivery)shown.push({t:S.delivery,k:'delivery'});
  if(S.cond)shown.push({t:S.cond,k:'cond'});
  keys.forEach(function(k){shown.push({t:S.refine[k].text,k:'refine',v:k})});
  var open=S.open?rfOf(S.open):null,flt=curFlt();
  return header()+cnt(n+' Ergebnisse - “'+esc(qline())+'”')+sponsored()+kirow()+
  '<div class="msg"><h3>Keine verlässlich begründete KI-Empfehlung</h3></div>'+
  (shown.length?'<div class="pad" style="margin-top:14px;display:flex;align-items:center;gap:10px;flex-wrap:wrap"><b style="font-size:12px">Von dir gewählt:</b>'+shown.map(function(c){return '<button class="chip" aria-pressed="true" data-a="unsel" data-k="'+c.k+'" data-v="'+esc(c.v||'')+'" aria-label="'+esc(c.t)+', Auswahl entfernen">'+esc(c.t)+'</button>'}).join('')+'</div>':'')+
  '<div class="aibox" style="padding:14px 14px 4px"><p class="h3" style="margin:0 0 6px">Grenze deine Suche weiter ein</p><div class="chips" style="gap:10px">'+RF.map(function(r){var a=S.refine[r.k];return '<button class="chip" aria-pressed="'+!!a+'" aria-expanded="'+(S.open===r.k)+'" aria-controls="rp-'+r.k+'" data-a="refine" data-k="'+r.k+'">'+esc(a?a.text:r.label)+'</button>'}).join('')+'</div>'+(open?rpanel(open):'')+'<p class="ln" style="color:#5E6B66;margin:4px 0 12px">Maße oder Zustand konnten nicht eindeutig überprüft werden. Bitte prüfe die Details in der Anzeige.</p></div>'+
  secFound('Mögliche Ergebnisse')+listing('c',{miss:1,flt:flt})+listing('b',{flt:flt})+'<div class="msg" style="padding:14px 18px 0"><p class="mb">Die normalen Suchergebnisse bleiben sichtbar.</p></div>'+secNormal()+listing('d')+listing('f')+listing('g')+foot()+fab();
}
function none(){
  return header()+cnt('Keine KI-Treffer - “'+esc(S.q)+'”')+sponsored()+kirow()+
  '<div class="msg"><h3>Keine passenden Ergebnisse gefunden</h3><p>Es wurde nichts gefunden, das sicher zu deiner Suche passt.</p></div>'+
  '<div class="cat"><b>Kategorieempfehlung:</b><button data-a="catrec">Sofas &amp; Sitzgarnituren</button></div>'+
  '<div class="aibox" style="padding:14px 14px 4px"><p class="h3" style="margin:0 0 8px;font-size:13px;color:#4B5E52">Versuche es mit einem anderen Suchbegriff</p><p style="font-size:12px;margin:0">oder Tippe auf einen Vorschlag, um neu zu suchen.</p><div class="chips" style="gap:10px;margin-top:14px">'+['sofa klein','Kleines Schlafsofa','2-Sitzer-Sofa','Kompaktsofa'].map(function(c){return '<button class="chip" data-a="term" data-c="'+c+'">'+c+'</button>'}).join('')+'</div></div>'+
  secNormal()+listing('e')+listing('f')+listing('g')+foot()+fab();
}
function fail(){
  return header()+cnt('312 Ergebnisse - “'+esc(S.q)+'”')+sponsored()+kirow()+
  '<div role="alert">'+WARN+'<div class="msg"><h3>Deine Suche konnte nicht geladen werden</h3><p>Du kannst die normalen Suchergebnisse weiterhin ansehen.</p><button class="glink" data-a="retry" style="margin-top:8px">Erneut versuchen</button></div></div>'+
  secNormal()+listing('e')+listing('f')+listing('g')+foot()+fab();
}
function plain(){
  return header()+cnt('312 Ergebnisse - “'+esc(S.q)+'”')+sponsored()+kirow()+secNormal()+listing('d')+listing('e')+listing('f')+listing('g')+foot()+fab();
}
function render(){
  var v={cold:cold,waiting:waiting,high:high,low:low,none:none,fail:fail,plain:plain}[S.view]();
  $('#phone').innerHTML='<div class="scr">'+v+'</div>'+sheet()+(S.toast?'<div class="toast" role="status">'+esc(S.toast)+'</div>':'');ensureRoom();
  var q=$('#q');if(q){q.addEventListener('input',function(){S.q=q.value;var has=!!q.value.trim(),chips=wantCat(q.value);if(!has)S.catPick=null;var sw=$('#chipwrap'),pw=$('#promptwrap');if(sw)sw.hidden=!chips;if(pw)pw.hidden=chips;var cs=$('#cat');if(cs){cs.value=catShown();cs.classList.toggle('sug',showKiTag())}var kt=$('#catwrap .ki');if(kt)kt.hidden=!showKiTag();var lv=$('#catlive');if(lv)lv.textContent=showKiTag()?'KI schlägt die Kategorie Möbel und Wohnen vor':''})}
  [['#rad','radius'],['#del','delivery']].forEach(function(f){var e=$(f[0]);if(e)e.addEventListener('change',function(){S[f[1]]=e.value})});
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
    if(/schlaffunktion/.test(q))return 'fail';
    return confidence(q)>=CUTOFF?'high':'low';
  }
  return sc;
}
function startAI(){
  clearT();S.view='waiting';S.showCancel=false;S.fbDone=false;resetRefine();render();anchorKI();
  var o=outcome();
  if(o==='slow'){
    S.t.push(setTimeout(function(){S.showCancel=true;render()},6000));
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

function applyRefine(k){
  var r=rfOf(k),d=S.draft[k],v=parseInt(d.n,10);
  if(!(v>0&&v<=r.max)){d.err=true;render();var f=$('#rp-'+k+'-n');if(f)f.focus();return}
  d.n=String(v);d.err=false;
  S.refine[k]={n:d.n,text:r.fmt(d)};S.open='';render();
  var tb=$('[data-a="refine"][data-k="'+k+'"]');if(tb)tb.focus();
}
document.addEventListener('input',function(e){
  var t=e.target,k=t.dataset&&t.dataset.rk;if(!k)return;
  var d=S.draft[k];if(!d)return;
  t.value=t.value.replace(/\D/g,'');d.n=t.value;d.err=false;
  var p=$('#rp-'+k),er=$('#rp-'+k+'-e');if(er)er.remove();t.removeAttribute('aria-invalid');
  if(p)p.querySelectorAll('.rq .chip').forEach(function(c){c.setAttribute('aria-pressed',c.dataset.v===d.n)});
});
document.addEventListener('keydown',function(e){
  var t=e.target;if(e.key==='Enter'&&t.dataset&&t.dataset.rk){e.preventDefault();applyRefine(t.dataset.rk)}
});
document.addEventListener('click',function(e){
  var el=e.target.closest('[data-a]');
  if(!el)return;
  if(el.dataset.a==='closesheet'&&e.target.closest('[data-stop]')&&!e.target.closest('button'))return;
  var a=el.dataset.a;
  if(a==='ki'){S.ki=!S.ki;if(!S.ki)S.chips=[];render()}
  else if(a==='kitoggle'){if(S.ki){S.ki=false;clearT();go('plain')}else{S.ki=true;startAI()}}
  else if(a==='chip'){var c=el.dataset.c,i=S.chips.indexOf(c);if(i>-1)S.chips.splice(i,1);else S.chips.push(c);render();var n=document.querySelectorAll('.chip');for(var k=0;k<n.length;k++){if(n[k].dataset.c===c){n[k].focus()}}}
  else if(a==='cond'){var cv=el.dataset.c;S.cond=S.cond===cv?'':cv;render();var cb2=$('[data-a="cond"][data-c="'+cv+'"]');if(cb2)cb2.focus()}
  else if(a==='search')search();
  else if(a==='info'){S.sheet=true;render()}
  else if(a==='closesheet'){S.sheet=false;render()}
  else if(a==='more')toast('Weitere Filter: in diesem Prototyp nicht enthalten');
  else if(a==='back'){clearT();S.sheet=false;if(S.view==='cold'){var p=S.prev;S.prev=null;if(p)go(p)}else{S.prev=null;S.view='cold';render();window.scrollTo(0,0)}}
  else if(a==='edit'){go('cold')}
  else if(a==='cancel'){clearT();go('plain');toast('Suche abgebrochen. Normale Ergebnisse angezeigt.')}
  else if(a==='retry'){S.retry=true;if(S.scenario==='fail'||S.scenario==='slow')S.scenario='high';startAI()}
  else if(a==='unsel'){var uk=el.dataset.k,uv=el.dataset.v;if(uk==='chip'){var ui=S.chips.indexOf(uv);if(ui>-1)S.chips.splice(ui,1)}else if(uk==='refine'){delete S.refine[uv];if(S.open===uv)S.open=''}else S[uk]='';render()}
  else if(a==='refine'){var rk=el.dataset.k;if(S.refine[rk]){delete S.refine[rk];S.open=''}else if(S.open===rk){S.open=''}else{S.open=rk;var ap=S.refine[rk];S.draft[rk]={n:ap?ap.n:''}}render();var tb=$('[data-a="refine"][data-k="'+rk+'"]');if(tb)tb.focus()}
  else if(a==='rq'){var qd=S.draft[el.dataset.k];qd.n=qd.n===el.dataset.v?'':el.dataset.v;qd.err=false;render();var qb=$('[data-a="rq"][data-k="'+el.dataset.k+'"][data-v="'+el.dataset.v+'"]');if(qb)qb.focus()}
  else if(a==='rapply')applyRefine(el.dataset.k)
  else if(a==='rclear'){delete S.refine[el.dataset.k];S.open='';render();var cb=$('[data-a="refine"][data-k="'+el.dataset.k+'"]');if(cb)cb.focus()}
  else if(a==='term'){S.q=el.dataset.c;S.chips=[];S.scenario='auto';startAI()}
  else if(a==='catrec'){S.cat='Sofas & Sitzgarnituren';toast('Kategorie übernommen. Tippe auf einen Begriff, um neu zu suchen.')}
  else if(a==='fb'){if(el.dataset.v==='nein'){S.fbDone=true;render()}else toast('Danke. Das Feedback wurde gezählt.')}
  else if(a==='open')toast('Anzeige öffnen: nicht Teil des Prototyps')
});

var J=[['Cold Start (KI an)','cold-on'],['Cold Start (KI aus)','cold-off'],['Waiting','wait'],['High','high'],['Low','low'],['No Result','none'],['Failure','fail']];
$('#jump').innerHTML=J.map(function(j){return '<button class="chip" data-j="'+j[1]+'">'+j[0]+'</button>'}).join('');
$('#jump').addEventListener('click',function(e){
  var k=e.target.dataset.j;if(!k)return;clearT();S.retry=false;S.fbDone=false;resetRefine();
  if(k==='cold-on'){S.ki=true;S.chips=[];S.q='';S.radius='';S.delivery='';S.cond='';S.catPick=null;S.view='cold';go('cold')}
  else if(k==='cold-off'){S.ki=false;S.chips=[];S.view='cold';go('cold')}
  else if(k==='wait'){S.ki=true;S.view='waiting';S.showCancel=false;render();anchorKI();S.t.push(setTimeout(function(){S.showCancel=true;render()},6000));S.t.push(setTimeout(function(){go('fail')},15000))}
  else if(k==='high'){S.ki=true;S.q='kleines Sofa, 2-Sitzer, <180cm, Versand';S.chips=[];go('high')}
  else if(k==='low'){S.ki=true;S.q='kleines Sofa, Versand';go('low')}
  else if(k==='none'){S.ki=true;S.q='kleines Sof für meine Wohnung';go('none')}
  else if(k==='fail'){S.ki=true;S.q='kleines Sofa';go('fail')}
});
$('#scenario').addEventListener('change',function(e){S.scenario=e.target.value});
function hash(){var on=location.hash==='#mod';$('#mod').classList.toggle('on',on);if(on)$('#mod').open=true}
window.addEventListener('hashchange',hash);hash();
render();
})();
