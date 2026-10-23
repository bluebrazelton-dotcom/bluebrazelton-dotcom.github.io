import {RESEARCH_BALANCE as B, RESEARCH_TASKS as TASKS} from './chapter3-balance.js?v=20261013r2';
import {RESEARCH_FOCUSES as FOCUSES, RESEARCH_STAGES} from './chapter3-content.js?v=20261013r2';
import {WORK_QUALITY} from './balance.js?v=20261013r2';

export const isResearchStage = stage => Object.hasOwn(RESEARCH_STAGES, stage);
const completedStages = ['c3_done','c4_opening'];
const afterCommon = ['c3_credit','c3_focus','c3_focal','c3_review','c3_response','c3_return',...completedStages];
const afterFocal = ['c3_review','c3_response','c3_return',...completedStages];
const responseStages = ['c3_response','c3_return',...completedStages];
const emptyTask = () => ({units:0, quality:[], settled:0, finishEnergy:null});
const record = (state, text) => {if (!state.record.includes(text)) state.record.push(text);};
const planned = (task, units) => TASKS[task].charges.filter(step=>step.at<=units).reduce((sum,step)=>sum+step.cost,0);
export function researchTask(state) {
  if (!state.research) return '';
  if (['c3_work','c3_skill','c3_credit'].includes(state.stage)) return 'common';
  if (['c3_focal','c3_review'].includes(state.stage)) return 'focal';
  if (responseStages.includes(state.stage)) return state.research.response;
  return '';
}
export function researchWork(state) {const task=researchTask(state); return task ? state.research.tasks[task] : null;}
export function researchWorkPerPress(state) {
  const task=researchTask(state), units=researchWork(state)?.units || 0;
  const end = task==='common' && state.notesRoutine ? B.commonBoostEnd
    : task==='bounded' && state.research.claimSkill ? B.claimBoostEnd
    : task==='shared' && state.research.peerCompared ? B.peerBoostEnd : 0;
  return units<end ? Math.min(B.boostedWork,end-units) : 1;
}
export function researchQuality(state, task=researchTask(state)) {
  if (!TASKS[task] || !state.research) return null;
  const work=state.research.tasks[task];
  const exhausted=work.quality.filter(Boolean).length;
  const value=Math.max(WORK_QUALITY.floor, Math.round(100-WORK_QUALITY.maximumLoss*exhausted/TASKS[task].goal));
  const band=exhausted===0 ? 'Careful' : value>WORK_QUALITY.rushedAt ? 'Uneven' : 'Rushed';
  const noun=task==='common' ? 'Source profile' : task==='focal' ? FOCUSES[state.research.focus].title : task==='bounded' ? FOCUSES[state.research.focus].smaller : 'Joint interpretation note';
  const detail=band==='Careful' ? 'Sources, unknowns and use limits are clearly separated.' : band==='Uneven' ? 'The evidence boundaries remain useful; the explanation needs a clearer order.' : 'The closing explanation is rushed; the evidence limits and credited work remain usable.';
  return {task,value,band,exhausted,finished:work.units===TASKS[task].goal,noun,detail,record:`${noun} quality · ${band.toLowerCase()} finish`,text:`Work quality: ${band.toLowerCase()}. ${detail}`};
}
export function researchAssessment(state, task=researchTask(state)) {
  const quality=researchQuality(state,task);
  if (!quality?.finished) return '';
  const goal=task==='common' ? 'the methods-appendix contribution' : task==='focal' ? 'identifying the category problem' : 'this bounded inquiry and its return';
  const finish=state.research.tasks[task].finishEnergy;
  const condition=quality.band==='Careful' ? finish===0 ? 'The final explanation looks tired, but the sources and limits are clear.' : 'The sources and limits are clearly organized.' : `${quality.detail} ${quality.band==='Rushed' ? 'Reorder the closing explanation before using it elsewhere.' : 'Reread the explanation before using it elsewhere.'}`;
  return `${condition} The completed work is sufficient for ${goal}.`;
}
export function sharedAvailability(state) {
  const terms=state.research.terms;
  const missing=[];
  if (!terms.permission) missing.push('The data steward has not permitted joint recoding.');
  if (!terms.nia) missing.push('Nia has not agreed to this joint contribution.');
  if (!terms.tomas) missing.push('Tomas has not agreed to review the interpretation.');
  if (!terms.window) missing.push('No feasible joint-revision window is available.');
  return {eligible:missing.length===0,reason:missing.join(' ')};
}
export function researchCan(state, action) {
  const r=state.research;
  if (action==='enter-c3') return state.stage==='c2_done';
  if (!r) return false;
  const allowed={
    c3_intro:['start-research'], c3_work:['work-c3'],
    c3_skill:state.progress>=B.skillPrice ? ['learn-claim'] : [],
    c3_credit:['credit-research'], c3_focus:Object.keys(FOCUSES).map(key=>`focus-${key}`),
    c3_focal:['work-c3',...(!r.peerCompared && r.tasks.focal.units===9 && state.capacity>=B.peerPrice ? ['compare-nia'] : [])],
    c3_review:['response-bounded',...(sharedAvailability(state).eligible ? ['response-shared'] : [])],
    c3_response:['work-c3'], c3_return:['deliver-research'], c3_done:['enter-c4'], c4_opening:[]
  };
  return allowed[state.stage]?.includes(action) || false;
}
function settle(state, task) {
  const work=state.research.tasks[task];
  const through=planned(task,work.units), due=through-work.settled;
  const spent=Math.min(state.capacity,Math.max(0,due));
  state.capacity-=spent; work.settled=through;
  return spent;
}
function makeReturn(r) {
  const focus=FOCUSES[r.focus], shared=r.response==='shared';
  return {owner:shared ? 'C03-RSP-01' : 'C03-REV-01-R01',focus:r.focus,
    title:shared ? 'Joint category change log and credit/use note' : focus.smaller,
    claim:focus.claim, category:shared ? focus.category : 'Original category retained as unresolved; claim narrowed',
    audience:'Tomas and the supervised research team', use:focus.returnUse,
    credit:shared ? 'Student: source map and drafting; Nia: source coding and access interpretation; Tomas: operational interpretation.' : `Student: ${focus.smaller.toLowerCase()}; Tomas: operational interpretation.${r.peerCompared ? ' Nia: reciprocal source-annotation comparison.' : ''} Published sources are cited with their limits.`,
    authority:shared ? 'Version 2 is a shared interpretation. Each contributor retains credit and may record disagreement. Permission covers this internal revision, not a public release.' : 'The student owns the bounded claim-and-return. Wider inference and shared authority remain unestablished.',
    disagreement:shared ? 'Nia retains “individual experience unknown”; Tomas retains “current local process only.” Neither annotation is removed to manufacture agreement.' : 'The source disagreement or gap remains visible.',
    nextNeed:focus.need};
}
export function researchReturnDraft(state) {return state.research?.response ? makeReturn(state.research) : null;}
function makeReceipt(r) {
  return {id:r.response==='shared' ? 'EVD-C03-SHARED-INTERPRETATION-01' : 'EVD-C03-BOUND-RETURN-01',
    owner:r.response==='shared' ? 'C03-RSP-01' : 'C03-REV-01-R01', focus:r.focus,
    primary:r.response==='shared' ? 'Scholarly Community' : 'Discovery',status:'demonstrated',
    artifact:r.returned.title,audience:r.returned.audience,meaning:r.returned.authority,
    callback:r.response==='shared' ? 'CB-C03-SHARED-CATEGORIES-01' : null};
}
export function researchAct(state, action) {
  if (!researchCan(state,action)) return false;
  if (action==='enter-c3') {
    state.research={version:1,previousProgress:state.progress,claimSkill:false,credited:false,
      focus:'',response:'',peerCompared:false,terms:{permission:true,nia:true,tomas:true,window:true},
      tasks:Object.fromEntries(Object.keys(TASKS).map(task=>[task,emptyTask()])),
      profile:{established:false,challenged:false,resolved:false},returned:null,receipt:null};
    state.stage='c3_intro'; state.energyBudgetVersion=1; state.capacity=B.energy; state.progress=0;
    state.exhaustionVersion=2; state.exhaustionPending=false;
    state.exhaustionNotified=state.seenPopups.includes('energy-exhausted-c3');
    // Retain all Chapter 2 facts; the new chapter begins once through a committed action.
    state.summary=`After rest: ${B.energy} Energy. Chapter 2’s finished work and ${state.research.previousProgress} Progress are recorded; Chapter 3 Progress starts at zero.`;
    record(state,`Chapter 2 Progress · ${state.research.previousProgress} at chapter close`);
    return true;
  }
  const r=state.research;
  if (action==='start-research') {r.profile.established=true;state.stage='c3_work'; const spent=settle(state,'common');state.summary=`Source profile started: −${spent} Energy now; 1 at 12/24 and 1 at 24/24. The source and credit terms remain attached.`;}
  else if (action==='learn-claim') {state.progress-=B.skillPrice;r.claimSkill=true;state.stage='c3_work';record(state,'Bound the Claim · evidence limits practiced');state.summary='Spent 3 Progress. You can now state an inference beside its limits. The smaller response’s first 6 drafting units advance +2 per press.';}
  else if (action==='credit-research') {r.credited=true;state.standing+=1;state.stage='c3_focus';record(state,'Source profile · methods-appendix contribution credited by Dr. Shah');state.summary=`Dr. Shah credits your completed source profile: +1 Standing, now ${state.standing}. ${researchAssessment(state,'common')}`;}
  else if (action.startsWith('focus-')) {r.focus=action.slice(6);state.stage='c3_focal';const spent=settle(state,'focal');state.summary=`${FOCUSES[r.focus].title} started: −${spent} Energy now, 1 at 9/18 and 1 at 18/18. This focus does not select a legacy path.`;}
  else if (action==='compare-nia') {state.capacity-=B.peerPrice;state.progress+=1;r.peerCompared=true;record(state,'Nia Park · reciprocal source comparison completed and credited');state.summary='You check Nia’s source annotations; she checks yours. −1 Energy, +1 Progress. Her credited preparation saves three joint coordination presses; it does not supply later agreement.';}
  else if (action.startsWith('response-')) {r.response=action.slice(9);state.stage='c3_response';const spent=settle(state,r.response);state.summary=`${r.response==='shared' ? 'Joint revision' : 'Smaller claim'} selected; follow-through pending. −${spent} Energy at start. Complete the work and return the artifact before earning evidence.`;}
  else if (action==='work-c3') {
    const task=researchTask(state), work=r.tasks[task], spec=TASKS[task];
    const before=work.units, added=Math.min(researchWorkPerPress(state),spec.goal-before);
    work.quality.push(...Array(added).fill(state.capacity===0)); work.units+=added;
    const gained=Math.floor(work.units/spec.interval)-Math.floor(before/spec.interval); state.progress+=gained;
    const spent=settle(state,task);
    state.summary=`${researchQuality(state,task).noun}: ${work.units}/${spec.goal}. +${added} work${gained ? `, +${gained} Progress` : ''}.${spent ? ` −${spent} Energy at this milestone.` : ''}`;
    if (task==='common' && work.units===12 && !r.claimSkill) state.stage='c3_skill';
    if (work.units===spec.goal) {
      work.finishEnergy=state.capacity;record(state,researchQuality(state,task).record);
      if (task==='common') state.stage='c3_credit';
      else if (task==='focal') {r.profile.challenged=true;state.stage='c3_review';}
      else state.stage='c3_return';
      state.summary=researchAssessment(state,task);
    }
  }
  else if (action==='deliver-research') {
    r.returned=makeReturn(r); r.profile.resolved=true; r.receipt=makeReceipt(r);state.stage='c3_done';
    record(state,`${r.returned.title} · returned to Tomas and research team`);
    record(state,`${r.receipt.primary} · completed ${r.response==='shared' ? 'shared interpretation' : 'bounded claim and return'}`);
    record(state,`Graduate inquiry · ${FOCUSES[r.focus].inquiry}`);
    state.summary=`Your artifact, credit and use note are returned. One ${r.receipt.primary} demonstration is recorded; no second Standing award. ${researchAssessment(state)}`;
  }
  else if (action==='enter-c4') {state.stage='c4_opening';record(state,'Graduate preparation · inquiry carried forward');state.summary='Your specific inquiry enters graduate preparation. Begin the independent master’s design when ready; its new evidence and permission belong to the current project.';}
  return true;
}

// Chapter 2 is sanitized by the existing loader first. Validate new chapter facts
// without inferring consent, exhaustion, credit or delivered evidence from a label.
export function cleanResearchState(base, parsed) {
  const r=parsed.research;
  if (!r || r.version!==1 || !isResearchStage(parsed.stage)) return null;
  if (!Number.isInteger(parsed.capacity) || parsed.capacity<0 || parsed.capacity>B.energy || parsed.energyBudgetVersion!==1) return null;
  if (!Number.isInteger(r.previousProgress) || r.previousProgress<0 || r.previousProgress>100) return null;
  for (const field of ['claimSkill','credited','peerCompared']) if (typeof r[field]!=='boolean') return null;
  if (!['',...Object.keys(FOCUSES)].includes(r.focus) || !['','bounded','shared'].includes(r.response)) return null;
  if (!r.terms || !['permission','nia','tomas','window'].every(key=>typeof r.terms[key]==='boolean')) return null;
  if (!r.profile || r.profile.established!==(parsed.stage!=='c3_intro') || typeof r.profile.challenged!=='boolean' || typeof r.profile.resolved!=='boolean') return null;
  const stage=parsed.stage;
  const hasFocus=['c3_focal',...afterFocal].includes(stage);
  if (Boolean(r.focus)!==hasFocus || Boolean(r.response)!==responseStages.includes(stage)) return null;
  if (r.credited!==['c3_focus','c3_focal',...afterFocal].includes(stage)) return null;
  if (parsed.standing!==(r.credited ? 2 : 1)) return null;
  if (r.claimSkill!== (afterCommon.includes(stage) || stage==='c3_work' && r.tasks?.common?.units>=12)) return null;
  for (const task of Object.keys(TASKS)) {
    const w=r.tasks?.[task], spec=TASKS[task];
    if (!w || !Number.isInteger(w.units) || w.units<0 || w.units>spec.goal) return null;
    if (!Array.isArray(w.quality) || w.quality.length!==w.units || !w.quality.every(n=>typeof n==='boolean')) return null;
    if (w.finishEnergy!==null && (!Number.isInteger(w.finishEnergy) || w.finishEnergy<0 || w.finishEnergy>B.energy)) return null;
    if ((w.finishEnergy!==null)!==(w.units===spec.goal)) return null;
    const started=task==='common' ? stage!=='c3_intro' : task==='focal' ? hasFocus : r.response===task;
    if (!started && w.units!==0) return null;
    if (w.settled!==(started ? planned(task,w.units) : 0)) return null;
  }
  if (stage==='c3_intro' && r.tasks.common.units!==0) return null;
  if (stage==='c3_skill' && r.tasks.common.units!==12) return null;
  if (stage==='c3_work' && (r.tasks.common.units>=24 || r.tasks.common.units===12 && !r.claimSkill)) return null;
  if (afterCommon.includes(stage) && r.tasks.common.units!==24) return null;
  if (stage==='c3_focal' && r.tasks.focal.units>=18 || afterFocal.includes(stage) && r.tasks.focal.units!==18) return null;
  if (r.peerCompared && r.tasks.focal.units<9) return null;
  if (r.profile.challenged!==afterFocal.includes(stage) || r.profile.resolved!==completedStages.includes(stage)) return null;
  if (r.response==='shared' && !Object.values(r.terms).every(Boolean)) return null;
  if (r.response && (stage==='c3_response' ? r.tasks[r.response].units>=TASKS[r.response].goal : r.tasks[r.response].units!==TASKS[r.response].goal)) return null;
  if (completedStages.includes(stage)) {
    if (JSON.stringify(r.returned)!==JSON.stringify(makeReturn(r)) || JSON.stringify(r.receipt)!==JSON.stringify(makeReceipt(r))) return null;
  } else if (r.returned!==null || r.receipt!==null) return null;
  const expected=Object.entries(TASKS).reduce((sum,[key,spec])=>sum+Math.floor(r.tasks[key].units/spec.interval),0)-(r.claimSkill ? B.skillPrice : 0)+(r.peerCompared ? 1 : 0);
  if (parsed.progress!==expected) return null;
  const exhaustionNotified=base.seenPopups.includes('energy-exhausted-c3');
  return {...base,stage,capacity:parsed.capacity,progress:parsed.progress,standing:parsed.standing,
    exhaustionNotified,exhaustionPending:!exhaustionNotified && parsed.exhaustionPending===true,
    energyBudgetVersion:1,research:structuredClone(r),summary:typeof parsed.summary==='string' ? parsed.summary.slice(0,1200) : ''};
}
