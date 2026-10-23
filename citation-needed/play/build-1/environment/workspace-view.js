import {workspaceFor} from './workspaces.js?v=20261013e3';
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Native HTML papers stay selectable, keyboard-readable and responsive.
export function workspaceMaterials(state){
 const w=workspaceFor(state);
 const materials=w.materials.map((m,i)=>`<article class="source-card source-${i+1}"><span class="source-tab">${esc(m.label)}</span><h3>${esc(m.title)}</h3><p>${esc(m.note)}</p></article>`).join('');
 return `${workDiagram(state,w)}<div class="source-pair" aria-label="Working materials">${materials}</div>`;
}
function workDiagram(s,w){
 const t=s.task,done=t?.done||0,goal=t?.goal||5,n=Math.round(done/goal*5),ink='#365c50',faint='#c6d0c0';
 const status=t?`${done}/${goal} sections`:'Choose an approach to set the work sections';
 const active=i=>i<n?ink:faint;
 let visual='',caption='';
 if(['notebook','map','reaches','fieldboard'].includes(w.surface)){
  caption=w.surface==='reaches'?'Reference reach and intervention reach':s.approach==='broad'?'A spatial comparison with separate sites':'A repeat-visit record at a permitted site';
  visual='<path d="M0 28 Q65 5 120 34 T250 25 T400 44 M0 150 Q50 108 145 130 T280 146 T400 121" fill="none" stroke="#b7c7a0" stroke-width="18"/><path d="M180 -15 Q100 25 210 57 T167 115 T220 190" fill="none" stroke="#70a7a7" stroke-width="17"/>';
  for(let i=0;i<5;i++){const x=s.approach==='broad'||w.surface==='reaches'?65+i*62:104+i*30,y=[47,73,98,124,146][i];visual+=`<circle cx="${x}" cy="${y}" r="10" fill="${active(i)}" stroke="#fffbed" stroke-width="3"/>`;}
  visual+='<path d="M305 80v-30m-7 8 7-8 7 8" fill="none" stroke="#5e6955" stroke-width="2"/><text x="305" y="98" text-anchor="middle">N</text>';
 }else if(['kit','lab'].includes(w.surface)){
  caption=w.surface==='kit'?'Sample labels develop with the field register':'Sample batch with a separate control position';
  visual='<rect x="24" y="127" width="352" height="24" rx="5" fill="#7d836c"/><path d="M30 154h340" stroke="#b0b6a3" stroke-width="6"/>';
  for(let i=0;i<5;i++)visual+=`<g transform="translate(${44+i*65} 32)"><rect x="0" y="10" width="39" height="95" rx="7" fill="#f2f7ed" stroke="#7b9388" stroke-width="2"/><rect x="4" y="${i<n?52:83}" width="31" height="${i<n?49:18}" rx="4" fill="${active(i)}" opacity=".7"/><rect x="-2" y="4" width="43" height="17" rx="3" fill="${i===4?'#b78348':'#526e64'}"/><rect x="4" y="37" width="31" height="21" fill="#fffbef"/><text x="19" y="52" text-anchor="middle">${i===4?'QC':String(i+1).padStart(2,'0')}</text></g>`;
 }else if(['plot','station'].includes(w.surface)){
  caption='Review layers: observed record, check flags, visible gap';
  visual='<path d="M37 20v125h331" fill="none" stroke="#7b9388" stroke-width="2"/>';
  for(let y=40;y<140;y+=30)visual+=`<path d="M38 ${y}h330" stroke="#d1dbcf"/>`;
  const lines=['M42 113 94 93','M94 93 139 106','M139 106 182 61','M259 83 302 70','M302 70 354 42'];
  lines.forEach((d,i)=>visual+=`<path d="${d}" fill="none" stroke="${active(i)}" stroke-width="4" stroke-linecap="round"/>`);
  visual+='<rect x="195" y="25" width="51" height="114" fill="#d5b68e" opacity=".4"/><text x="221" y="165" text-anchor="middle">gap</text>';
 }else if(w.surface.includes('handoff')){
  caption='Records → funded roles → an independent operating decision';
  for(let i=0;i<3;i++){const x=20+i*128;visual+=`<rect x="${x}" y="41" width="106" height="91" rx="5" fill="#fffbed" stroke="${n>i?ink:faint}" stroke-width="3"/><path d="M${x+20} 65h66m-66 17h50m-50 17h57" stroke="${n>i?ink:faint}" stroke-width="4"/>`;if(i<2)visual+=`<path d="M${x+110} 84h12m-5-5 5 5-5 5" fill="none" stroke="${ink}" stroke-width="2"/>`;}
 }else if(w.surface==='protocol'){
  caption='Equipment scope · worked example · independent validation';
  for(let i=0;i<5;i++)visual+=`<rect x="30" y="${17+i*31}" width="340" height="25" rx="2" fill="#fffbed" stroke="${active(i)}"/><path d="M44 ${30+i*31}h${i<n?12:2}m19 0h${80+i*20}" stroke="${active(i)}" stroke-width="3"/>`;
 }else{
  caption=['dossier','portfolio'].includes(w.surface)?'Completed contributions accumulate in the review file':'Scope, schedule and funded responsibilities take shape';
  for(let i=0;i<5;i++){const x=20+i*72,y=27+(i%2)*14;visual+=`<rect x="${x}" y="${y}" width="68" height="114" rx="2" fill="#fffbef" stroke="${active(i)}" stroke-width="2"/><rect x="${x+5}" y="${y+5}" width="58" height="16" fill="${active(i)}"/><path d="M${x+10} ${y+40}h43m-43 14h35m-35 14h40m-40 14h${i<n?35:9}" stroke="${active(i)}" stroke-width="3"/>`;}
 }
 return `<figure class="work-diagram" data-diagram="${esc(w.surface)}" data-completed="${done}" aria-label="${esc(caption)}. ${esc(status)}."><svg viewBox="0 0 400 180" role="img" aria-label="${esc(caption)}">${visual}</svg><figcaption>${esc(caption)}<span>Work-progress schematic · ${esc(status)}</span></figcaption></figure>`;
}
export function workspaceArtifact(state,body){
 const w=workspaceFor(state);
 return `<div class="folio-label"><span>${esc(w.folio)}</span><span aria-hidden="true">${String(state.chapter).padStart(2,'0')}</span></div><div class="folio-body">${body}</div>`;
}
export function workInProgress(state,units=1){
 const t=state.task,w=workspaceFor(state);
 const steps=t.beats.slice(0,t.done).map((beat,i)=>`<li><span class="entry-number" aria-hidden="true">${String(i+1).padStart(2,'0')}</span><span>${esc(beat)}</span></li>`).join('');
 return `<small>${state.phase==='work'?'WORKING COPY':'REVISION COPY'} · ${esc(t.artifact)}</small>${t.saved.length?`<div class="prepared-note"><strong>Preparation retained</strong><p>${esc(t.saved.join(' '))}</p></div>`:''}${steps?`<ol class="work-entries">${steps}</ol>`:`<p class="unwritten">${esc(w.question)}</p>`}<div class="next-entry"><small>NEXT ON THE TABLE</small><p>${esc(t.beats.slice(t.done,t.done+units).join(' ')||'Ready for review.')}</p></div><progress max="${t.goal}" value="${t.done}" aria-label="Completed artifact sections"></progress>`;
}

export function submittedNotes(task){
 return `<details class="submitted-notes"><summary>Read all ${task.goal} completed sections</summary>${task.saved.length?`<p><strong>Preparation retained:</strong> ${esc(task.saved.join(' '))}</p>`:''}<ol>${task.beats.map(beat=>`<li>${esc(beat)}</li>`).join('')}</ol></details>`;
}
