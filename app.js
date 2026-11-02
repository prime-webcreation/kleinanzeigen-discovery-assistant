/* Discovery Assistant Prototyp - Stand: 02.11.2026
   Zustand (S), Inhalte, Render-Funktionen, Events. Kein echtes Modell. */
(function(){
var $=function(s){return document.querySelector(s)};
var S={view:'cold',ki:true,q:'',cat:'Möbel & Wohnen',catPick:null,prev:null,chips:[],t:[],scenario:'auto',retry:false,sheet:false,toast:'',refine:[],fbDone:false,showCancel:false};
var CHIPS=['2-Sitzer','< 180cm','kleines Sofa','Ecksofa','Sitzgarnituren','Couch','Versand','Kompakter 3-Sitzer'];
var CATS=['Möbel & Wohnen','Haus & Garten','Elektronik','Mode & Beauty'];
var EX=['2-Sitzer Couch bis 180 cm','kleines Sofa für meine Wohnung','Sofa mit Schlaffunktion','kleines Sof für meine Wohnung'];
var L={
 a:{t:'Kleines grünes Sofa',p:'140 €',f:['140x120cm','2-Sitzer'],ort:'Berlin'},
 b:{t:'Gut erhaltene Couch',p:'140 €',f:['140x120cm'],ort:'Gelsenkirchen'},
 c:{t:'Sofa aus Stoff (in echt kleiner)',p:'75 € VB',miss:'Größe nicht angegeben',ort:'Ort'},
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
function listing(k,o){
  var x=L[k];o=o||{};var h='<button class="lst" data-a="open"><span class="im"><i></i><i></i></span><span class="ct"><span class="ort">'+x.ort+' · Heute</span>';
  if(o.kitag)h+='<span class="kitag" role="img" aria-label="KI-Vorschlag">'+SPARK+'</span>';
  h+='<span class="ti">'+esc(x.t)+'</span>';
  if(o.facts&&x.f){h+='<span class="facts">'+x.f.map(function(f){return '<span>✓ '+esc(f)+'</span>'}).join('')+'<small>laut Beschreibung*</small></span>'}
  if(o.kib)h+='<span><span class="kib">✓ KI-Vorschlag</span> <small style="color:#aeaeae;font-size:10px">'+esc(x.f[0])+'</small></span>';
  if(x.miss&&o.miss)h+='<span class="miss">ⓘ '+esc(x.miss)+'</span>';
  if(x.top)h+='<span class="dis">Gesponsert</span>';
  h+='<span class="pr">'+x.p+'</span></span>'+(x.top?'<span class="top">TOP</span>':'')+'</button>';
  return h;
}
function secFound(l,wait){return '<div class="sec sec-ki">'+l+'<span class="pill">KI-gestützt</span></div>'+(wait?'<div class="dots" aria-hidden="true"><span class="row"><i></i><i></i><i></i></span><span>Ergebnisse werden geladen</span></div>':'')}
function secNormal(){return '<div class="sec sec-n">Suchergebnisse<span class="sub">inkl. bezahlter Anzeigen (TOP)</span></div>'}
function fab(){return '<div class="fabwrap"><button class="fab" data-a="edit">Filter anpassen</button></div>'}
function foot(){return '<div class="foot">Alle Anzeigen bleiben sichtbar und auswählbar. TOP und Gesponsert sind bezahlt und nicht Teil der KI-Auswahl.</div>'}
function sheet(){
  if(!S.sheet)return'';
  return '<div class="sheet-bg" data-a="closesheet"><div class="sheet" role="dialog" aria-modal="true" aria-label="Über die KI-Suche" data-stop="1"><h3>Über die KI-Suche</h3><ul><li>Sie schlägt Kategorie und Suchbegriffe vor. Du entscheidest.</li><li>Trefferhinweise stammen nur aus dem Anzeigentext. Bitte prüfe die Anzeige.</li><li>Bezahlte Anzeigen (TOP, Gesponsert) sind getrennt und beeinflussen die KI-Auswahl nicht.</li><li>Du kannst die KI-Suche jederzeit ausschalten. Die normale Suche bleibt gleich.</li></ul><button class="btn" data-a="closesheet">Verstanden</button></div></div>';
}

function cold(){
  var h='<div class="cs">'+(S.prev?'<button class="backrow" data-a="back" aria-label="Zurück zu den Ergebnissen"><svg width="20" height="20" viewBox="0 0 22 22" fill="none" stroke="#2A2A2A" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3L6 11l8 8"/></svg>Zurück</button>':'')+'<div class="fld"><svg class="lupe" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#5D5D5D" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.8"/><path d="M13 13l5 5"/></svg><input id="q" value="'+esc(S.q)+'" placeholder="'+(S.ki?'Beschreibe, wonach du suchst...':'Wonach suchst du?')+'" aria-label="Suchbegriff"></div>';
  h+='<div class="fld"><span class="ico-p"></span><input value="Deutschland" disabled aria-label="Ort"></div>';
  if(S.ki){
    h+='<div id="catwrap"><p class="catl">Kategorie auswählen</p><div class="catf"><select id="cat" aria-label="Kategorie">'+['Alle Kategorien'].concat(CATS).map(function(c){return '<option'+(c===catShown()?' selected':'')+'>'+esc(c)+'</option>'}).join('')+'</select><span class="ki"'+(showKiTag()?'':' hidden')+'>✦ KI-Vorschlag</span></div><span id="catlive" class="sr" role="status"></span></div>';
  }
  h+='<div class="tgl"><h2>KI-Suchvorschläge<u>(optional)</u></h2><button class="sw-hit" data-a="ki" role="switch" aria-checked="'+S.ki+'" aria-label="KI-Suchvorschläge"><span class="sw" aria-checked="'+S.ki+'"></span></button></div>';
  if(S.ki){
    h+='<p class="nt">ⓘ Ergebnisse und Trefferhinweise sind KI-gestützt.</p><div id="promptwrap"'+(S.q.trim()?' hidden':'')+'><p class="nt" style="margin-top:18px">ⓘ Sobald du etwas eingibst, zeigt dir die KI passende Suchbegriffe zur Auswahl.</p><p class="sg" style="font-size:14px;margin-top:22px">Zum Ausprobieren</p><div class="chips">'+EX.map(function(c){return '<button class="chip" data-a="example" data-c="'+esc(c)+'">'+esc(c)+'</button>'}).join('')+'</div></div><div id="chipwrap"'+(S.q.trim()?'':' hidden')+'><p class="sg">Wähle aus Vorschlägen</p><div class="chips">'+CHIPS.map(function(c){return '<button class="chip" aria-pressed="'+(S.chips.indexOf(c)>-1)+'" data-a="chip" data-c="'+esc(c)+'">'+esc(c)+'</button>'}).join('')+'</div></div>';
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
  var r;
  if(S.fbDone)r='<div class="aibox"><p class="ln" style="margin:0"><b style="color:var(--ink);font-weight:700">Danke für dein Feedback.</b></p><div class="tr" style="text-align:left">Wir blenden den Hinweis für diese Suche aus. Alle Ergebnisse bleiben sichtbar.</div></div>';
  else r='<div class="aibox hc"><div class="tr">Angaben aus dem Anzeigentext – bitte prüfen.</div><p class="ln">✓ Passt zu <b>'+esc(S.chips.length?S.chips.slice(0,3).join(', '):'kleines Sofa, 2-Sitzer, < 180cm')+'</b></p><p class="ln">✓ <b>Versand</b> laut Anzeige möglich</p><div class="fb"><span>Passt der Hinweis?</span><button class="th" data-a="fb" data-v="ja" aria-label="Daumen hoch: Hinweis passt"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 11v9H4v-9zM7 11l4-8a2 2 0 0 1 2 2v4h6a2 2 0 0 1 2 2.3l-1.2 6A2 2 0 0 1 17.8 20H7"/></svg></button><button class="th" data-a="fb" data-v="nein" aria-label="Daumen runter: Hinweis passt nicht"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="transform:rotate(180deg)"><path d="M7 11v9H4v-9zM7 11l4-8a2 2 0 0 1 2 2v4h6a2 2 0 0 1 2 2.3l-1.2 6A2 2 0 0 1 17.8 20H7"/></svg></button></div></div>';
  return header()+cnt('312 Ergebnisse - “'+esc(qline())+'”')+sponsored()+kirow()+r+secFound('Gefundene Ergebnisse')+listing('a',{facts:1,kitag:1})+listing('b',{facts:1,kitag:1})+secNormal()+listing('e')+listing('f')+listing('g')+foot()+fab();
}
function low(){
  var n=[312,148,61,22][Math.min(S.refine.length,3)];
  var chosen=S.chips.length?S.chips:['kleines Sofa','Versand'];
  return header()+cnt(n+' Ergebnisse - “'+esc(chosen.join(', '))+'”')+sponsored()+kirow()+
  '<div class="msg"><h3>Keine verlässlich begründete KI-Empfehlung</h3><p class="mb">Die normalen Suchergebnisse bleiben sichtbar.</p></div>'+
  '<div class="pad" style="margin-top:14px;display:flex;align-items:center;gap:10px;flex-wrap:wrap"><b style="font-size:12px">Von dir gewählt:</b>'+chosen.map(function(c){return '<span class="chip static" aria-pressed="true">'+esc(c)+'</span>'}).join('')+'</div>'+
  '<div class="aibox" style="padding:14px 14px 4px"><p class="ln" style="color:#5E6B66">Maße oder Zustand konnten nicht eindeutig überprüft werden. Bitte prüfe die Details in der Anzeige.</p><p class="h3" style="margin:6px 0">Grenze deine Suche weiter ein</p><div class="chips" style="gap:10px">'+['Maße auswählen','Entfernung festlegen','Preis festlegen'].map(function(c){return '<button class="chip" aria-pressed="'+(S.refine.indexOf(c)>-1)+'" data-a="refine" data-c="'+c+'">'+c+'</button>'}).join('')+'</div></div>'+
  secFound('Mögliche Ergebnisse')+listing('c',{miss:1})+listing('b')+secNormal()+listing('d')+listing('f')+listing('g')+foot()+fab();
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
  var q=$('#q');if(q){q.addEventListener('input',function(){S.q=q.value;var has=!!q.value.trim();if(!has)S.catPick=null;var sw=$('#chipwrap'),pw=$('#promptwrap');if(sw)sw.hidden=!has;if(pw)pw.hidden=has;var cs=$('#cat');if(cs)cs.value=catShown();var kt=$('#catwrap .ki');if(kt)kt.hidden=!showKiTag();var lv=$('#catlive');if(lv)lv.textContent=showKiTag()?'KI schlägt die Kategorie Möbel und Wohnen vor':''})}
  var c=$('#cat');if(c){c.addEventListener('change',function(){S.cat=c.value;S.catPick=c.value;var kt=$('#catwrap .ki');if(kt)kt.hidden=true})}
}

function outcome(){
  var sc=S.scenario;
  if(sc==='auto'){
    var q=S.q.toLowerCase();
    if(S.retry)return 'high';
    if(!/sofa|couch/.test(q)||/\bsof\b/.test(q))return 'none';
    if(/schlaffunktion/.test(q))return 'fail';
    return (S.chips.indexOf('< 180cm')>-1||S.chips.indexOf('2-Sitzer')>-1||/2-sitzer|180/.test(q))?'high':'low';
  }
  return sc;
}
function startAI(){
  clearT();S.view='waiting';S.showCancel=false;S.fbDone=false;S.refine=[];render();anchorKI();
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

document.addEventListener('click',function(e){
  var el=e.target.closest('[data-a]');
  if(!el)return;
  if(el.dataset.a==='closesheet'&&e.target.closest('[data-stop]')&&!e.target.closest('button'))return;
  var a=el.dataset.a;
  if(a==='ki'){S.ki=!S.ki;if(!S.ki)S.chips=[];render()}
  else if(a==='kitoggle'){if(S.ki){S.ki=false;clearT();go('plain')}else{S.ki=true;startAI()}}
  else if(a==='chip'){var c=el.dataset.c,i=S.chips.indexOf(c);if(i>-1)S.chips.splice(i,1);else S.chips.push(c);render();var n=document.querySelectorAll('.chip');for(var k=0;k<n.length;k++){if(n[k].dataset.c===c){n[k].focus()}}}
  else if(a==='example'){S.q=el.dataset.c;render();var qi=$('#q');if(qi)qi.focus()}
  else if(a==='search')search();
  else if(a==='info'){S.sheet=true;render()}
  else if(a==='closesheet'){S.sheet=false;render()}
  else if(a==='more')toast('Weitere Filter: in diesem Prototyp nicht enthalten');
  else if(a==='back'){clearT();S.sheet=false;if(S.view==='cold'){var p=S.prev;S.prev=null;if(p)go(p)}else{S.prev=null;S.view='cold';render();window.scrollTo(0,0)}}
  else if(a==='edit'){go('cold')}
  else if(a==='cancel'){clearT();go('plain');toast('Suche abgebrochen. Normale Ergebnisse angezeigt.')}
  else if(a==='retry'){S.retry=true;if(S.scenario==='fail'||S.scenario==='slow')S.scenario='high';startAI()}
  else if(a==='refine'){var c2=el.dataset.c,j=S.refine.indexOf(c2);if(j>-1)S.refine.splice(j,1);else S.refine.push(c2);render()}
  else if(a==='term'){S.q=el.dataset.c;S.chips=[];S.scenario='auto';startAI()}
  else if(a==='catrec'){S.cat='Sofas & Sitzgarnituren';toast('Kategorie übernommen. Tippe auf einen Begriff, um neu zu suchen.')}
  else if(a==='fb'){if(el.dataset.v==='nein'){S.fbDone=true;render()}else toast('Danke. Das Feedback wurde gezählt.')}
  else if(a==='open')toast('Anzeige öffnen: nicht Teil des Prototyps')
});

var J=[['Cold Start (KI an)','cold-on'],['Cold Start (KI aus)','cold-off'],['Waiting','wait'],['High','high'],['Low','low'],['No Result','none'],['Failure','fail']];
$('#jump').innerHTML=J.map(function(j){return '<button class="chip" data-j="'+j[1]+'">'+j[0]+'</button>'}).join('');
$('#jump').addEventListener('click',function(e){
  var k=e.target.dataset.j;if(!k)return;clearT();S.retry=false;S.fbDone=false;S.refine=[];
  if(k==='cold-on'){S.ki=true;S.chips=[];S.q='';S.catPick=null;S.view='cold';go('cold')}
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
