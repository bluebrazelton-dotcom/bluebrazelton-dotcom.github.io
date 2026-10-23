import {workspaceFor} from './workspaces.js?v=20261013h5';
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Native HTML papers stay selectable, keyboard-readable and responsive.
export function workspaceMaterials(state){
 const w=workspaceFor(state),interview=w.surface==='interview';
 const recorder=interview?'<div class="listening-copy"><span class="reels" aria-hidden="true"><i></i><i></i></span><span><strong>Listening copy</strong><small>Consult the current use agreement before quoting.</small></span></div>':'';
 const materials=w.materials.map((m,i)=>`<article class="source-card source-${i+1}"><span class="source-tab">${esc(m.label)}</span><h3>${esc(m.title)}</h3><p>${esc(m.note)}</p></article>`).join('');
 return `${recorder}<div class="source-pair" aria-label="Working materials">${materials}</div>`;
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
