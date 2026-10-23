import {MASTERS_STAGES,MASTERS_FOCUSES as F} from './chapter4-content.js?v=20261013r2';
import {MASTERS_BALANCE as B,MASTERS_TASKS as T} from './chapter4-balance.js?v=20261013r2';
import {WORK_QUALITY} from './balance.js?v=20261013r2';
export const isMastersStage=stage=>Object.hasOwn(MASTERS_STAGES,stage);
const order=Object.keys(MASTERS_STAGES);
const empty=()=>({units:0,quality:[],settled:0,finishEnergy:null});
const record=(s,text)=>{if(!s.record.includes(text))s.record.push(text);};
export function mastersTask(s){
  if(['c4_design','c4_lesson','c4_plan'].includes(s.stage))return 'design';
  if(['c4_study','c4_review'].includes(s.stage))return 'study';
  return s.graduate?.response || '';
}
export function mastersWork(s){return s.graduate?.tasks[mastersTask(s)] || null;}
export function mastersWorkPerPress(s){
  const g=s.graduate,task=mastersTask(s),units=mastersWork(s)?.units || 0;
  const end=task==='design' && g.context.preparation!=='absent' ? 4 : task==='study' && g.guideConsulted ? 6 : task==='narrow' && g.skill ? 6 : 0;
  return units<end ? Math.min(B.boost,end-units) : 1;
}
export function mastersQuality(s,task=mastersTask(s)){
  if(!T[task] || !s.graduate)return null;
  const w=s.graduate.tasks[task],exhausted=w.quality.filter(Boolean).length;
  const value=Math.max(WORK_QUALITY.floor,Math.round(100-WORK_QUALITY.maximumLoss*exhausted/T[task].goal));
  const band=exhausted===0?'Careful':value>WORK_QUALITY.rushedAt?'Uneven':'Rushed';
  const noun=task==='design'?F[s.research.focus].title:task==='study'?'Current evidence audit':task==='narrow'?'Versioned limitation and future-evidence note':'Alternate-source accountability brief';
  const detail=band==='Careful'?'Sources and design limits are clearly separated.':band==='Uneven'?'The explanation needs a clearer order; the evidence boundary remains usable.':'The closing explanation is rushed; completed work and evidence limits remain usable.';
  return {task,value,band,exhausted,finished:w.units===T[task].goal,noun,detail,record:`${noun} quality · ${band.toLowerCase()} finish`};
}
export function alternateAvailability(s){
  const a=s.graduate.context.alternate;
  const missing=Object.entries(a).filter(([,yes])=>!yes).map(([key])=>({source:'current alternate source',owner:'accountable owner',permission:'current use permission',window:'feasible workload window'}[key]));
  return {eligible:missing.length===0,reason:missing.length?`Missing ${missing.join(', ')}.`:''};
}
export function baseline(g,focus){return {owner:'C04-END-01',variant:F[focus].id,version:1,
  sources:F[focus].evidence,authority:'Cedar Vale program records office; public document publishers',
  terms:'Current project use: cited public documents and permitted deidentified program aggregates. No individual linkage or public release of the aggregate table.',
  exclusions:F[focus].exclusion,dependency:F[focus].dependency,provenance:'Current Chapter 4 sources; Chapter 3 contributes preparation only.'};}
export function reviewProfile(focus){return {owner:'C04-REV-01',amends:'C04-END-01',version:2,failedDependency:F[focus].dependency,unsupported:F[focus].collision};}
export function resolution(g,focus){return g.response==='narrow'?
  {owner:'C04-REV-01-R01',amends:'C04-REV-01',version:3,claim:F[focus].narrow,
    evidence:'Retained currently permitted baseline evidence',obligation:'A versioned limitation and future-evidence note, retaining the narrower claim despite its less impressive reach.',use:'Bounded committee defense; no stronger external claim.'}:
  {owner:'C04-REV-01-R02',amends:'C04-REV-01',version:3,claim:F[focus].alternate,
    evidence:'Current Harbor Pathways partner register',authority:'Elise Chen, accountable partner records coordinator',
    obligation:'Return the changed evidence/use brief to Elise Chen, retain her corrections and named source credit.',use:'Owner-approved bounded planning brief and committee defense; no personal linkage, public ranking or causal claim.'};}
export function mastersReceipt(g){return {id:g.response==='narrow'?'EVD-C04-LIMIT-01':'EVD-C04-ACCOUNT-01',owner:g.response==='narrow'?'C04-REV-01-R01':'C04-REV-01-R02',primary:g.response==='narrow'?'Discovery':'Public Contribution',demonstrated:true};}
export function mastersFollowThrough(g,focus){const r=resolution(g,focus);return {owner:r.owner,artifactVersion:3,
  action:g.response==='narrow'?'Limitation and future-evidence note completed':'Changed brief returned with source credit and retained owner corrections',
  recipient:g.response==='narrow'?'Cedar Vale master’s committee':'Elise Chen and Cedar Vale master’s committee',use:r.use};}
function planned(g,task,units){return T[task].charges.filter(x=>x.at<=units).reduce((n,x)=>n+x.cost,0)-(task==='design' && g.opening==='aligned' && units>=24?1:0);}
function settle(s,task){const w=s.graduate.tasks[task],due=planned(s.graduate,task,w.units)-w.settled;const spent=Math.min(s.capacity,due);s.capacity-=spent;w.settled+=due;return spent;}
export function mastersCan(s,action){
  if(action==='start-masters')return s.stage==='c4_opening';
  if(!s.graduate)return false;
  const g=s.graduate;
  const actions={c4_intro:['baseline-masters',...(g.context.openingAvailable?['align-masters']:[])],
    c4_design:['work-c4',...(g.tasks.design.units===0 && g.context.guideAvailable && !g.guideConsulted && s.capacity>=B.guidePrice?['consult-guide']:[])],
    c4_lesson:s.progress>=B.skillPrice?['learn-design']:[],c4_plan:['start-study'],c4_study:['work-c4'],
    c4_review:['masters-narrow',...(alternateAvailability(s).eligible?['masters-replace']:[])],
    c4_response:['work-c4'],c4_defend:['defend-masters'],c4_doctoral:['open-doctoral'],c4_capstone:['consolidate-masters'],c5_opening:[]};
  return actions[s.stage]?.includes(action) || false;
}
export function mastersAct(s,action){
  if(action==='start-masters'){
    s.graduate={version:1,previousProgress:s.progress,entryEnergy:s.capacity,context:{preparation:s.research.response==='shared'?'shared':'bounded',guideAvailable:true,pressured:false,openingAvailable:true,alternate:{source:true,owner:true,permission:true,window:true}},
      opening:'',guideConsulted:false,skill:false,response:'',profile:{baseline:null,review:null,resolution:null},tasks:Object.fromEntries(Object.keys(T).map(k=>[k,empty()])),
      receipt:null,followThrough:null,bridge:{},provenance:{chapter3:'Quiet preparation history; no current evidence, access or permission.',question:F[s.research.focus].question}};
    s.stage='c4_intro';s.progress=0;s.capacity=B.energy;s.exhaustionPending=false;s.exhaustionNotified=s.seenPopups.includes('energy-exhausted-c4');
    s.summary='After rest: Energy 12/12. Current source and authority terms are new; the inherited focal inquiry remains active.';return true;
  }
  const g=s.graduate,focus=s.research.focus;
  if(action==='baseline-masters' || action==='align-masters'){
    g.opening=action==='align-masters'?'aligned':'baseline';g.profile.baseline=baseline(g,focus);s.stage='c4_design';const spent=settle(s,'design');
    record(s,`C04-CON-01 · fixed teaching hours and current access calendar`);
    record(s,`C04-OPN-01 · ${g.opening==='aligned'?'calendar alignment accepted; saves 1 design Energy at completion':'ordinary baseline retained'}`);
    s.summary=`Design begins: −${spent} Energy. ${g.opening==='aligned'?'Calendar alignment replaces one scheduling check; saves 1 Energy at 24/24.':'The ordinary source audit remains feasible.'} No alternate permission or commitment is granted.`;
  }else if(action==='consult-guide'){
    g.guideConsulted=true;s.capacity-=B.guidePrice;record(s,'C04-REL-01 · Mara Velez’s credited design preparation');
    s.summary='Mara checks the dependency map during program hours: −1 Energy. Credited preparation gives +2 work/press for the first 6 study units, saving 3 presses. Source permission remains with the records owners.';
  }else if(action==='learn-design'){
    g.skill=true;s.progress-=B.skillPrice;s.stage='c4_design';record(s,'C04-ABL-01 · Minimum Defensible Design learned');
    s.summary=`Spend 3 Progress. ${g.context.guideAvailable?'Mara and the program methods clinic':'The program methods clinic'} help separate the desired claim, minimum evidence and fallback. The skill saves 3 drafting presses on the smaller response; the later collision is unresolved.`;
  }else if(action==='start-study'){
    s.stage='c4_study';const spent=settle(s,'study');s.summary=`Cycle 4.2 begins: −${spent} Energy. Audit current evidence and definitions; 2 Energy at 12/24 and 1 at 24/24. Source audit remains available under schedule pressure.`;
  }else if(action==='masters-narrow' || action==='masters-replace'){
    g.response=action==='masters-narrow'?'narrow':'replace';s.stage='c4_response';const spent=settle(s,g.response);
    s.summary=`${g.response==='narrow'?'Narrower claim':'Alternate-source accountability'} selected: −${spent} Energy. Demonstration pending until the changed artifact and obligation are completed and defended.`;
  }else if(action==='work-c4'){
    const task=mastersTask(s),w=g.tasks[task],spec=T[task],before=w.units,added=Math.min(mastersWorkPerPress(s),spec.goal-before);
    w.quality.push(...Array(added).fill(s.capacity===0));w.units+=added;s.progress+=Math.floor(w.units/spec.interval)-Math.floor(before/spec.interval);
    const spent=settle(s,task);s.summary=`${mastersQuality(s,task).noun}: ${w.units}/${spec.goal}. +${added} work${spent?`; −${spent} Energy at this milestone`:''}.`;
    if(task==='design' && w.units===12 && !g.skill)s.stage='c4_lesson';
    if(w.units===spec.goal){w.finishEnergy=s.capacity;record(s,mastersQuality(s,task).record);
      if(task==='design')s.stage='c4_plan';
      else if(task==='study'){g.profile.review=reviewProfile(focus);s.stage='c4_review';}
      else{g.profile.resolution=resolution(g,focus);s.stage='c4_defend';}
      s.summary=`${mastersQuality(s,task).band} finish. The completed bounded work remains sufficient for its stated goal; its evidence limits stay attached.`;
    }
  }else if(action==='defend-masters'){
    g.followThrough=mastersFollowThrough(g,focus);g.receipt=mastersReceipt(g);g.bridge.defended_bounded_masters_contribution={owner:'C04-MIL-01',artifact:F[focus].title,profileVersion:3};s.standing+=1;s.stage='c4_doctoral';
    record(s,`${g.followThrough.owner} · ${g.followThrough.action} · ${g.followThrough.recipient}`);
    record(s,'C04-MIL-01 · defended bounded master’s contribution · Cedar Vale committee');record(s,`${g.receipt.primary} · completed ${g.response==='narrow'?'limitation and future-evidence note':'owner-accountable evidence/use brief'}`);
    s.summary=`${g.followThrough.action}. The committee recognizes the changed bounded study: +1 Standing. The completed obligation records one ${g.receipt.primary} demonstration. No result or scholarly direction locks a legacy finale.`;
  }else if(action==='open-doctoral'){
    g.bridge.doctoral_formation_opening={owner:'C04-OPN-02',route:'Ordinary doctoral program advising and methods training'};s.stage='c4_capstone';
    record(s,'C04-OPN-02 · ordinary doctoral-formation route open');s.summary='Program advising and methods training provide the next route. A selective invitation, guide Support or favorable finding is unnecessary.';
  }else if(action==='consolidate-masters'){
    g.bridge.independent_design={owner:'C04-CST-01',nextQuestion:F[focus].next,effectiveProfileVersion:3};s.stage='c5_opening';
    const foreground=[`Master’s study · ${F[focus].title}`,`Next question · ${F[focus].next}`,'C04-CST-01 · independent design and effective evidence chain retained','C05-OPN-01 · doctoral formation next'];
    s.record=[...foreground,...s.record.filter(x=>!foreground.includes(x))];s.summary='The defended artifact, amended evidence profile and bounded next question lead your Living Record. Earlier preparation remains provenance. Continue explicitly into doctoral formation when ready.';
  }
  return true;
}
export function cleanMastersState(base,p){
  const g=p.graduate,i=order.indexOf(p.stage);if(!g || g.version!==1 || i<0 || p.energyBudgetVersion!==1)return null;
  const integer=(n,max)=>Number.isInteger(n) && n>=0 && n<=max;
  if(!integer(g.previousProgress,100) || !integer(g.entryEnergy,10) || !integer(p.capacity,B.energy))return null;
  const c=g.context;if(!c || !['absent','bounded','shared'].includes(c.preparation) || !['guideAvailable','pressured','openingAvailable'].every(k=>typeof c[k]==='boolean'))return null;
  if(c.preparation!=='absent' && c.preparation!==(p.research.response==='shared'?'shared':'bounded'))return null;
  if(!c.alternate || Object.keys(c.alternate).sort().join(',')!=='owner,permission,source,window' || !Object.values(c.alternate).every(x=>typeof x==='boolean'))return null;
  if(!['','baseline','aligned'].includes(g.opening) || (i>0)!==Boolean(g.opening) || g.opening==='aligned' && !c.openingAvailable)return null;
  if(typeof g.guideConsulted!=='boolean' || g.guideConsulted && (!c.guideAvailable || i===0) || typeof g.skill!=='boolean')return null;
  if(!['','narrow','replace'].includes(g.response) || (i>=6)!==Boolean(g.response) || g.response==='replace' && !alternateAvailability(p).eligible)return null;
  if(!g.profile || JSON.stringify(g.profile.baseline)!==JSON.stringify(i>0?baseline(g,p.research.focus):null) || JSON.stringify(g.profile.review)!==JSON.stringify(i>=5?reviewProfile(p.research.focus):null) || JSON.stringify(g.profile.resolution)!==JSON.stringify(i>=7?resolution(g,p.research.focus):null))return null;
  for(const [task,spec] of Object.entries(T)){
    const w=g.tasks?.[task],started=task==='design'?i>0:task==='study'?i>=4:g.response===task;
    if(!w || !integer(w.units,spec.goal) || !Array.isArray(w.quality) || w.quality.length!==w.units || !w.quality.every(x=>typeof x==='boolean'))return null;
    if(w.settled!==(started?planned(g,task,w.units):0) || !started && w.units!==0)return null;
    if(w.finishEnergy!==null && !integer(w.finishEnergy,B.energy) || (w.finishEnergy!==null)!==(w.units===spec.goal))return null;
  }
  if(g.skill!==(i>=3 || p.stage==='c4_design' && g.tasks.design.units>=12))return null;
  if(p.stage==='c4_lesson' && g.tasks.design.units!==12 || p.stage==='c4_design' && (g.tasks.design.units>=24 || g.tasks.design.units===12 && !g.skill) || i>=3 && g.tasks.design.units!==24)return null;
  if(p.stage==='c4_study' && g.tasks.study.units>=24 || i>=5 && g.tasks.study.units!==24)return null;
  if(g.response && (p.stage==='c4_response'?g.tasks[g.response].units>=T[g.response].goal:g.tasks[g.response].units!==T[g.response].goal))return null;
  const expected=Object.entries(T).reduce((n,[k,spec])=>n+Math.floor(g.tasks[k].units/spec.interval),0)-(g.skill?B.skillPrice:0);
  if(p.progress!==expected || p.standing!==(i>=8?3:2))return null;
  if(JSON.stringify(g.receipt)!==JSON.stringify(i>=8?mastersReceipt(g):null))return null;
  if(JSON.stringify(g.followThrough)!==JSON.stringify(i>=8?mastersFollowThrough(g,p.research.focus):null))return null;
  if(JSON.stringify(g.provenance)!==JSON.stringify({chapter3:'Quiet preparation history; no current evidence, access or permission.',question:F[p.research.focus].question}))return null;
  const bridge={};if(i>=8)bridge.defended_bounded_masters_contribution={owner:'C04-MIL-01',artifact:F[p.research.focus].title,profileVersion:3};
  if(i>=9)bridge.doctoral_formation_opening={owner:'C04-OPN-02',route:'Ordinary doctoral program advising and methods training'};
  if(i>=10)bridge.independent_design={owner:'C04-CST-01',nextQuestion:F[p.research.focus].next,effectiveProfileVersion:3};
  if(JSON.stringify(g.bridge)!==JSON.stringify(bridge))return null;
  const spent=Object.values(g.tasks).reduce((n,w)=>n+w.settled,0)+(g.guideConsulted?B.guidePrice:0);
  if(p.capacity!==Math.max(0,(c.pressured?B.pressuredEnergy:B.energy)-spent))return null;
  const seen=base.seenPopups,notified=seen.includes('energy-exhausted-c4');
  return {...base,stage:p.stage,capacity:p.capacity,progress:p.progress,standing:p.standing,graduate:structuredClone(g),exhaustionNotified:notified,exhaustionPending:!notified && p.exhaustionPending===true,summary:typeof p.summary==='string'?p.summary.slice(0,1200):''};
}
