import {BALANCE} from './balance.js';
import {CHAPTERS,UPGRADES,LEGACIES,chapterFor} from './content.js?v=20261013e3';
import {SAVE_KEY,initialState,act,actions,canUndo,undo,serialize,parseSave,feedback,quality,qualityLabel,pendingExhaustion,taskPreview,nextCharge,pace,currentAgreement,exportRecord} from './engine.js?v=20261013e3';
import {workspaceFor} from './workspaces.js?v=20261013e3';
import {workspaceMaterials,workspaceArtifact,workInProgress,submittedNotes} from './workspace-view.js?v=20261013e3';
import {workAction} from './action-view.js?v=20261013e3';
const $=id=>document.getElementById(id),esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let state,damaged=null,saveBlocked=false,pendingConfirmation=null,dialogAction=null,lastContext='',busy=false;
const fresh=()=>initialState(Math.floor(Math.random()*4));
try{const raw=localStorage.getItem(SAVE_KEY);state=raw?parseSave(raw):fresh();}catch(error){state=fresh();try{damaged=localStorage.getItem(SAVE_KEY);}catch{}saveBlocked=true;$('recovery-body').textContent=error.message;}
function save(){
 if(saveBlocked)return;
 try{localStorage.setItem(SAVE_KEY,serialize(state));$('saved').textContent='Environmental scientist career saved';$('storage-warning').hidden=true;}
 catch{$('saved').textContent='Not saved · download a copy';$('storage-warning').hidden=false;$('storage-warning').textContent='Browser storage is unavailable. You can keep playing, but download your save before leaving this page.';}
}
function announce(message){$('announcement').textContent=message;}
function choice(id,title,description,detail='',primary=false){return `<button class="choice${primary?' primary':''}" data-action="${esc(id)}"><strong>${esc(title)}</strong><span>${esc(description)}</span>${detail?`<span class="cost">${esc(detail)}</span>`:''}</button>`;}
function describePlan(id,kind){const p=taskPreview(state,kind,id);return `${p.cost} Energy scheduled · up to 1 now, the rest at work milestones · ${p.presses} work presses${p.saved.length?' · preparation reused':''}${p.reused.length?' · '+p.reused.join(', '):''}${p.cost>state.energy?` · ${state.energy} Energy available; work continues at zero with possible loss of polish`:''}`;}
function download(name,data,type='application/json'){const url=URL.createObjectURL(new Blob([data],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function story(title,body,button,action,kicker,image=null){
 const d=$('story');$('story-title').textContent=title;$('story-body').textContent=body;$('story-kicker').textContent=kicker;$('story-next').textContent=button;dialogAction=action;
 $('story-image').hidden=!image;if(image){$('story-image').src=image;$('story-image').alt='The protagonist pauses, tired after the chapter’s work.';}
 $('story-notes').innerHTML=action!=='acknowledge'&&state.task&&['submitted','submitted-response','recognition'].includes(state.phase)?submittedNotes(state.task):'';
 if(!d.open){d.showModal();$('story-next').focus();}
}
function render(){
 const c=chapterFor(state),phase=state.phase,t=state.task,index=state.chapter-1;
 const workspace=workspaceFor(state);
 document.title=`${c.title} · The Environmental Scientist · The Living Record`;
 $('workspace').dataset.surface=workspace.surface;$('workspace').dataset.phase=phase;
 $('workspace-label').textContent=workspace.label;$('workspace-tools').textContent=workspace.tool;
 $('work-materials').innerHTML=workspaceMaterials(state);
 $('chapter-title').textContent=c.title;$('chapter-number').textContent=`Chapter ${state.chapter} of 12`;$('place').textContent=c.place;$('era').textContent=c.era;
 const imagePath='assets/career-atlas.png';
 $('scene-image').src=imagePath;const col=c.scene%3,row=Math.floor(c.scene/3)*2+(state.energy===0?1:0);
 $('scene-image').style.left=`${-col*100}%`;$('scene-image').style.top=`${-row*100}%`;
 $('scene-image').dataset.scene=c.scene;$('scene-image').dataset.tired=state.energy===0;$('scene-image').alt=`${state.energy===0?'The tired protagonist':'The protagonist'} at ${c.place}, during ${c.era.toLowerCase()}.`;
 $('scene-note').textContent=state.complete?LEGACIES[state.legacy].subtitle:(state.chapter>=11?LEGACIES[state.legacy].context:phase==='recognition'?c.carry:`Looking ahead: ${c.carry}`);
 $('energy').textContent=`${state.energy} / ${BALANCE.energy[index]}`;$('energy-meter').max=BALANCE.energy[index];$('energy-meter').value=state.energy;
 $('energy-detail').textContent=state.complete?'Final chapter complete. This Energy total records how you finished; submitted work keeps its assessment.':state.chapter===12?'Work at zero remains productive but loses polish. This is the final chapter.':state.energy===0?'Further work loses polish; required work still counts. Rest at the next chapter break.':'Rest at chapter breaks. Work at zero remains productive.';
 $('progress').textContent=state.progress;$('skills').innerHTML=state.skills.map(id=>`<span class="skill">${esc(UPGRADES[id].title)}</span>`).join('');
 $('quality').textContent=t?`${qualityLabel(t)} · ${quality(t)}`:'Ready';$('quality-meter').value=t?quality(t):100;
 $('quality-detail').textContent=t?['work','revise'].includes(phase)?`${t.exhausted} of ${t.goal} sections completed at zero Energy. Completing the last section at zero does not itself lower quality.`:'Submitted quality stays recorded after rest.':'New work starts Careful. Later exhaustion affects the current artifact.';
 $('back').disabled=!canUndo(state);$('record-count').textContent=`${state.record.length} ${state.record.length===1?'entry':'entries'}`;
 $('record').innerHTML=state.record.length?[...state.record].reverse().map(r=>`<li class="${r.milestone?'milestone':''}">${r.milestone?'<span class="tag">Milestone</span>':''}<strong>${esc(r.title)}</strong><p>${esc(r.body)}</p>${state.submissions.some(t=>t.chapter===r.chapter&&t.artifact===r.title)?submittedNotes(state.submissions.find(t=>t.chapter===r.chapter&&t.artifact===r.title)):''}</li>`).join(''):'<li>Your first contribution will appear here.</li>';
 $('chapter-map').innerHTML=CHAPTERS.map((x,i)=>`<li class="${i===index?'current':''}"${i===index?' aria-current="step"':''}>${esc(x.title)}${i<index?' · completed':''}</li>`).join('');
 $('upgrade-list').innerHTML=Object.entries(UPGRADES).map(([id,u])=>`<p><strong>${esc(u.title)}</strong> · ${state.skills.includes(id)?'Learned':`${BALANCE.upgrades[id].cost} Progress, from Chapter ${BALANCE.upgrades[id].chapter}`}<br>${esc(u.effect)}</p>`).join('');
 $('work').dataset.phase=phase;$('work').dataset.chapter=state.chapter;
 $('phase-label').textContent=({intro:'A new chapter',instructions:'How to play',plan:'Choose your approach',work:'Build the artifact',submitted:'Work submitted',challenge:'A setback, and a way forward',revise:'Revise and return', 'submitted-response':'Response submitted',recognition:'Recognition',ending:'Your legacy'})[phase];
 $('sections').textContent=t?`${t.done} / ${t.goal} sections`:'';$('feedback').hidden=true;
 let title=c.title,description=c.goal,artifact='',buttons='';
 if(phase==='intro'||phase==='instructions'){
  description=c.intro;artifact=state.chapter===1?'<strong>One creek. A question. Somewhere to begin.</strong><p>Your work will become part of a career record.</p>':`<strong>${esc(workspace.folio)}</strong><p>${esc(c.goal)}</p><p>Your earlier contributions remain in the career record. This chapter begins with a fresh Energy budget.</p>`;
  buttons=choice(phase==='intro'?'begin':'continue',phase==='intro'?'Open the chapter':'Start your first project','Choose an approach, do the work, and respond to what happens next.','',true);
 }else if(phase==='plan'){
  title=state.chapter===10?'What should people inherit?':'What will you make?';artifact=`<small>THE CHAPTER’S QUESTION</small><p>${esc(c.goal)}</p>`;
  for(const o of c.options)buttons+=choice('approach:'+o.id,o.title,o.story,describePlan(o.id,'main'),o.id==='focused'||o.id==='observatory');
  buttons+='<div class="optional-actions">';
  if(!state.help)buttons+=choice('help','Check the working plan',c.help,`${BALANCE.helpCost} Energy · one fewer response section · once this chapter`);
  for(const [id,u]of Object.entries(UPGRADES)){if(actions(state).includes('learn:'+id))buttons+=choice('learn:'+id,u.title,u.story,`${BALANCE.upgrades[id].cost} Progress · ${u.effect}`);}
  buttons+='</div>';
 }else if(phase==='work'||phase==='revise'){
  title=t.artifact;description=phase==='work'?c.goal:'Build the selected response, retaining the useful work and its current terms.';
  const next=t.beats.slice(t.done,t.done+pace(state)).join(' ');
  artifact=workInProgress(state,pace(state));
  const charge=nextCharge(state),units=Math.min(pace(state),t.goal-t.done);
  const actionTitle=t.done+units===t.goal?workspace.finish:workspace.action[units===2?1:0];
  const detail=`${units} section${units>1?'s':''} · ${charge?`${charge} Energy scheduled (${Math.min(charge,state.energy)} available)`:'no Energy charge this press'}${state.energy===0?' · exhausted work lowers quality':''}`;
  buttons=workAction({title:actionTitle,next:next||'',detail,workspace,task:t,energyBudget:BALANCE.energy[index],units:pace(state)});
 }else if(phase==='submitted'||phase==='submitted-response'){
  title=t.artifact;description='Your submitted work keeps its quality and finish condition in the career record.';artifact=`<strong>Submitted · ${esc(qualityLabel(t))}</strong><p>${esc(feedback(state))}</p>${submittedNotes(t)}`;
  buttons=choice('continue',phase==='submitted'?'Read the response':'Receive recognition','Your next step builds on the artifact you have just returned.','',true);
 }else if(phase==='challenge'){
  title='The plan meets the world';description=c.setback;artifact=`<small>${esc(c.condition.toUpperCase())}</small><p>${esc(currentAgreement(state)?c.agreement:c.refusal)}</p>`;
  $('feedback').hidden=false;$('feedback').textContent=feedback(state);
  for(const o of c.responses){if(!o.needsAgreement||currentAgreement(state))buttons+=choice('response:'+o.id,o.title,o.story,describePlan(o.id,'response'),o.id==='bounded');else buttons+=`<div class="choice unavailable"><strong>${esc(o.title)} · unavailable this chapter</strong><span>${esc(c.refusal)} Skills and Energy cannot supply this independent access, capacity or decision.</span></div>`;}
 }else if(phase==='recognition'){
  title=c.milestone;description=c.recognition;artifact=`<small>MILESTONE EARNED</small><p>${esc(c.carry)}</p>`;
  $('feedback').hidden=false;$('feedback').textContent=feedback(state);
  buttons=choice('next',state.chapter===12?'See the independent future':`Begin Chapter ${state.chapter+1}`,state.chapter===12?'The handoff is enacted. Its next use belongs to others.':`Rest restores Energy to ${BALANCE.energy[state.chapter]}. Submitted work stays as recorded.`,'',true);
 }else if(phase==='ending'){
  const l=LEGACIES[state.legacy];title=l.title;description=l.ending;artifact=`<small>COMPLETE CAREER · CHAPTERS 1–12</small><p><strong>${esc(l.subtitle)}</strong></p><p>${esc(l.artifact)}</p><small>Continuing responsibility: ${esc(l.custodian)}</small><p>Your record contains ${state.scores.evidence} evidence, ${state.scores.restoration} restoration, and ${state.scores.stewardship} stewardship contributions. These describe completed work, not anyone’s worth.</p>`;
  buttons='<p class="review-note">Your complete career is saved. Download its record below, or continue another separate career using the navigation links.</p><button class="primary" id="ending-export">Download the complete career record</button>';
 }
 const working=['work','revise'].includes(phase);
 $('worksheet').hidden=!working;
 (working?$('worksheet'):$('information-artifact')).append($('artifact'));
 $('work-title').textContent=title;$('description').textContent=description;$('artifact').innerHTML=workspaceArtifact(state,artifact);$('choices').innerHTML=buttons;
 const context=`${state.chapter}:${phase}`;
 if(lastContext&&lastContext!==context&&!['intro','instructions','submitted','submitted-response','recognition'].includes(phase)&&!pendingExhaustion(state)){
  const focusTarget=['plan','challenge','ending'].includes(phase)?$('work-title'):$('action-heading');
  focusTarget.focus({preventScroll:true});
  const bounds=focusTarget.getBoundingClientRect();
  if(bounds.top<0||bounds.bottom>innerHeight)focusTarget.scrollIntoView({block:'start'});
 }
 lastContext=context;
 if(saveBlocked){if(!$('recovery').open)$('recovery').showModal();return;}
 if(pendingExhaustion(state)){story('This chapter has used your Energy',`You have used this chapter’s Energy. Further exhausted work may leave a rougher result: ${c.rough}. Your existing work remains useful, and required work still counts. ${state.chapter===12?'This is the final chapter; the submitted assessment remains in your completed career.':'Rest at the chapter break supports future work without changing a submitted assessment.'}`,'Keep the useful work','acknowledge',`Chapter ${state.chapter} · ${c.title}`,null);}
 else if(phase==='intro')story(c.title,c.intro,state.chapter===1?'See how to play':'Begin this chapter','begin',`Chapter ${state.chapter} of 12 · ${c.era}`);
 else if(phase==='instructions')story('Work, choose, and keep moving','Choose an approach, then press the work button to develop visible artifact sections. Energy is charged at the start and at work milestones. Work remains productive at zero, but further exhausted work loses polish. Finished work earns Progress for lasting skills. Choices are final; Back undoes work presses. Your environmental-science career saves separately from the other three careers. Each chapter includes a first artifact and a response to its review. Each work press completes the listed sections; no waiting is required.','Start the project','continue','How to play');
 else if(phase==='submitted'||phase==='submitted-response')story('Your work is submitted',feedback(state),phase==='submitted'?'Read what happens next':'Receive recognition','continue',`${t.artifact} · ${qualityLabel(t)}`);
 else if(phase==='recognition')story(c.milestone,`${c.recognition} ${feedback(state)}`,state.chapter===12?'See the independent future':`Rest and begin Chapter ${state.chapter+1}`,'next','Milestone');
 else if($('story').open)$('story').close();
}
function perform(id){
 if(busy||saveBlocked)return;busy=true;
 try{if(act(state,id)){
  if($('story').open)$('story').close();save();render();
  announce(state.task?`${state.task.artifact}. ${state.task.done} of ${state.task.goal} sections. Energy ${state.energy}. ${qualityLabel(state.task)} quality.`:`Chapter ${state.chapter}. ${$('work-title').textContent}`);
  // Replaced buttons keep a usable keyboard position after ordinary work.
  if(!$('story').open){const next=document.querySelector(`[data-action="${id==='acknowledge'&&['work','revise'].includes(state.phase)?'work':id}"]`);if(next)next.focus({preventScroll:true});else if(id.startsWith('learn:')||id==='help'||id==='acknowledge')$('action-heading').focus({preventScroll:true});}
 }}finally{busy=false;}
}
$('choices').addEventListener('click',event=>{const button=event.target.closest('[data-action]');if(button)perform(button.dataset.action);if(event.target.id==='ending-export')download('the-environmental-scientist-career.txt',exportRecord(state),'text/plain');});
$('story-next').addEventListener('click',()=>perform(dialogAction));
$('story').addEventListener('cancel',e=>e.preventDefault());
$('recovery').addEventListener('cancel',e=>e.preventDefault());
for(const id of ['story','confirm','recovery'])$(id).addEventListener('keydown',event=>{
 if(event.key!=='Tab')return;
 const targets=[...$(id).querySelectorAll('button,a[href],input,summary')].filter(el=>!el.disabled&&el.getClientRects().length);
 const first=targets[0],last=targets.at(-1);
 if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
 else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
});
$('back').addEventListener('click',()=>{if(undo(state)){save();render();announce('Ordinary work undone. Committed choices remain.');}});
function confirmAction(title,body,action){pendingConfirmation=action;$('confirm-title').textContent=title;$('confirm-body').textContent=body;$('confirm').showModal();$('cancel').focus();}
$('cancel').addEventListener('click',()=>{$('confirm').close();pendingConfirmation=null;});
$('confirm-action').addEventListener('click',()=>{const action=pendingConfirmation;pendingConfirmation=null;$('confirm').close();action?.();});
function reset(){if($('story').open)$('story').close();if($('recovery').open)$('recovery').close();state=fresh();saveBlocked=false;damaged=null;lastContext='';save();render();}
$('restart').addEventListener('click',()=>confirmAction('Start The Environmental Scientist again?','This replaces only your environmental-science career in this browser. Download your current save first if you want to keep it. The other three careers remain separate.',reset));
$('recovery-new').addEventListener('click',()=>confirmAction('Replace the stored environmental-science save?','The stored file will be replaced. Download it first if you want to preserve it for recovery.',reset));
$('download-damaged').addEventListener('click',()=>download('the-environmental-scientist-stored-save.json',damaged??''));
$('export-save').addEventListener('click',()=>download('the-environmental-scientist-save.json',serialize(state)));
$('export-record').addEventListener('click',()=>download('the-environmental-scientist-career.txt',exportRecord(state),'text/plain'));
$('import-save').addEventListener('change',async event=>{
 const file=event.target.files[0];if(!file)return;
 try{if(file.size>100000)throw Error('Save files must be under 100 KB.');const candidate=parseSave(await file.text());confirmAction('Load this environmental-science career?',`Chapter ${candidate.chapter}: ${chapterFor(candidate).title}. This replaces only the current environmental-science save.`,()=>{state=candidate;saveBlocked=false;lastContext='';if($('story').open)$('story').close();save();render();});}
 catch(error){$('storage-warning').hidden=false;$('storage-warning').textContent=`Import was not applied: ${error.message}`;announce($('storage-warning').textContent);}
 event.target.value='';
});
// Another tab must not silently overwrite a newer career.
window.addEventListener('storage',event=>{if(event.key===SAVE_KEY&&event.newValue!==serialize(state)){saveBlocked=true;damaged=event.newValue;$('recovery-body').textContent='This career changed in another tab. Reload this page to use the latest save, or download the stored copy before starting over.';if($('story').open)$('story').close();$('recovery').showModal();}});
render();if(!saveBlocked)save();
