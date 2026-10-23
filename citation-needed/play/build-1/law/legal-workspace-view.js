import {workspaceFor} from './workspaces.js?v=20261013l2';
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function workspaceMaterials(s){const w=workspaceFor(s);return `${diagram(s,w)}<div class="source-pair" aria-label="Working materials">${w.materials.map((m,i)=>`<article class="source-card source-${i+1}"><span class="source-tab">${esc(m.label)}</span><h3>${esc(m.title)}</h3><p>${esc(m.note)}</p></article>`).join('')}</div>`;}
function diagram(s,w){
 const done=s.task?.done||0,goal=s.task?.goal||5,n=Math.round(done/goal*5),ink='#3d5260',faint='#c4c3b9',active=i=>i<n?ink:faint;
 const status=s.task?`${done}/${goal} sections`:'Choose an approach to set the work sections';
 let visual='',caption='';
 const text=(x,y,t)=>`<text x="${x}" y="${y}" text-anchor="middle">${t}</text>`;
 const lines=(x,y,i)=>`<path d="M${x} ${y}h66m-66 13h52m-52 13h60" stroke="${active(i)}" stroke-width="3"/>`;
 if(['notice','sources','casefile'].includes(w.surface)){
  caption=w.surface==='notice'?'Proposed decision · stated reasons · unanswered question':w.surface==='sources'?'Original record → quoted claim → supported interpretation':'Fictional opinion: issue · holding · reasoning';
  visual='<rect x="40" y="15" width="240" height="150" rx="2" fill="#fffdf4" stroke="#b3a38d"/><path d="M59 38h174" stroke="#6a7b80" stroke-width="4"/>';
  for(let i=0;i<5;i++){const y=57+i*20;visual+=`<rect x="56" y="${y-7}" width="177" height="14" fill="${i<n?'#e8dba9':'#f3f0e5'}"/><path d="M62 ${y}h${139-i*9}" stroke="${active(i)}" stroke-width="3"/><path d="M246 ${y}h20l10 -5h65" fill="none" stroke="${active(i)}" stroke-width="2"/>`;}
  visual+=text(311,40,w.surface==='casefile'?'CASE BRIEF':'MARGIN');
 }else if(['authority','citations'].includes(w.surface)){
  caption=w.surface==='authority'?'Authority map: court, date and treatment remain attached':'Citation trail: a claim meets its sources and objection';
  const nodes=[[150,14,100,34,'Proposition'],[23,79,112,36,'Opinion'],[149,79,112,36,'Later treatment'],[276,79,102,36,'Commentary'],[126,142,154,27,'Bounded argument']];
  visual='<path d="M200 48v18H79v13m121-13h128v13M200 66v13M79 115v16h123v11m3-27v27m122-27v16H202" fill="none" stroke="#b5b5aa" stroke-width="2"/>';
  nodes.forEach(([x,y,width,h,label],i)=>{visual+=`<rect x="${x}" y="${y}" width="${width}" height="${h}" rx="4" fill="#fffdf4" stroke="${active(i)}" stroke-width="2"/>`+text(x+width/2,y+h/2+4,label);});
 }else if(w.surface==='records'){
  caption='Record register: released, ambiguous and unavailable stay distinct';
  visual='<rect x="20" y="15" width="360" height="150" fill="#fffdf4" stroke="#abb4ae"/>'+text(92,34,'RECORD')+text(223,34,'COVERAGE')+text(337,34,'STATUS');
  for(let i=0;i<5;i++){const y=53+i*23;visual+=`<path d="M22 ${y+9}h356M155 ${y-12}v22M287 ${y-12}v22" stroke="#d4d2c4"/><path d="M38 ${y}h92m38 0h98" stroke="${active(i)}" stroke-width="3"/>`+text(335,y+4,i===3?'missing':i<n?'checked':'open');}
 }else if(w.surface==='teaching'){
  caption='Fictional problem → two reasoned readings → teaching feedback';
  visual='<path d="M200 60v17H90v16m110-16h110v16" fill="none" stroke="#899a95" stroke-width="2"/><rect x="114" y="13" width="172" height="47" fill="#fffdf4" stroke="#a79880"/>'+text(200,33,'Fictional facts')+text(200,49,'What remains uncertain?');
  for(let i=0;i<2;i++){const x=29+i*203;visual+=`<rect x="${x}" y="92" width="137" height="71" rx="3" fill="#fffdf4" stroke="${active(i+1)}" stroke-width="2"/>`+text(x+68,110,'Reading '+(i+1))+lines(x+16,128,i+3);}
 }else if(w.surface==='casebook'){
  caption='An open casebook: opinion on the left, dated interpretation on the right';
  visual='<path d="M200 27Q105 8 30 25v133q83-17 170 0 87-17 170 0V25q-85-17-170 2" fill="#fffdf4" stroke="#a59b89" stroke-width="2"/><path d="M200 27v131" stroke="#bbae98"/>'+text(110,43,'OPINION')+text(289,43,'ANNOTATION');
  for(let i=0;i<5;i++){const y=63+i*18;visual+=`<path d="M52 ${y}h125m45 0h126" stroke="${active(i)}" stroke-width="3"/>`;}
 }else if(w.surface.startsWith('handoff')){
  caption='Current materials → funded responsibilities → the successor’s decision';
  ['Records','Supported roles','Their decision'].forEach((label,i)=>{const x=16+i*130;visual+=`<rect x="${x}" y="38" width="111" height="108" rx="3" fill="#fffdf4" stroke="${active(i)}" stroke-width="2"/>`+text(x+55,60,label)+lines(x+18,82,i+2);if(i<2)visual+=`<path d="M${x+113} 94h15m-5-5 5 5-5 5" fill="none" stroke="${ink}" stroke-width="2"/>`;});
 }else{
  caption=w.surface==='appointment'?'A job talk, course calendar and supported offer':w.surface==='dossier'?'Distinct contributions accumulate in the review file':w.surface==='program'?'Scope, paid roles and update responsibilities take shape':'Manuscript sections develop around a supported claim';
  for(let i=0;i<5;i++){const x=16+i*74,y=23+(i%2)*13;visual+=`<rect x="${x}" y="${y}" width="68" height="128" rx="2" fill="#fffdf4" stroke="${active(i)}" stroke-width="2"/><rect x="${x+6}" y="${y+7}" width="55" height="13" fill="${active(i)}"/><path d="M${x+9} ${y+38}h49m-49 16h40m-40 16h44m-44 16h34" stroke="${active(i)}" stroke-width="3"/>`;}
 }
 return `<figure class="work-diagram" data-diagram="${esc(w.surface)}" data-completed="${done}" aria-label="${esc(caption)}. ${esc(status)}."><svg viewBox="0 0 400 180" role="img" aria-label="${esc(caption)}">${visual}</svg><figcaption>${esc(caption)}<span>Work-progress schematic · ${esc(status)} · fictional materials</span></figcaption></figure>`;
}
export function workspaceArtifact(s,body){const w=workspaceFor(s);return `<div class="folio-label"><span>${esc(w.folio)}</span><span aria-hidden="true">${String(s.chapter).padStart(2,'0')}</span></div><div class="folio-body">${body}</div>`;}
export function workInProgress(s,units=1){
 const t=s.task,w=workspaceFor(s),steps=t.beats.slice(0,t.done).map((beat,i)=>`<li><span class="entry-number" aria-hidden="true">${String(i+1).padStart(2,'0')}</span><span>${esc(beat)}</span></li>`).join('');
 return `<small>${s.phase==='work'?'WORKING COPY':'REVISION COPY'} · ${esc(t.artifact)}</small>${t.saved.length?`<div class="prepared-note"><strong>Preparation retained</strong><p>${esc(t.saved.join(' '))}</p></div>`:''}${steps?`<ol class="work-entries">${steps}</ol>`:`<p class="unwritten">${esc(w.question)}</p>`}<div class="next-entry"><small>NEXT ON THE TABLE</small><p>${esc(t.beats.slice(t.done,t.done+units).join(' ')||'Ready for review.')}</p></div><progress max="${t.goal}" value="${t.done}" aria-label="Completed artifact sections"></progress>`;
}

export function submittedNotes(task){
 return `<details class="submitted-notes"><summary>Read all ${task.goal} completed sections</summary>${task.saved.length?`<p><strong>Preparation retained:</strong> ${esc(task.saved.join(' '))}</p>`:''}<ol>${task.beats.map(beat=>`<li>${esc(beat)}</li>`).join('')}</ol></details>`;
}
