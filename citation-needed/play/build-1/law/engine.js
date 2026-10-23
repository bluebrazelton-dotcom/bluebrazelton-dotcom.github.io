import {BALANCE} from './balance.js';
import {CHAPTERS,UPGRADES,LEGACIES,ACCEPTANCE,DRAFT_ACCEPTANCE,REUSE,chapterFor} from './content.js?v=20261013l2';
export const SAVE_KEY='living-record-legal-scholar-v1';
export const SAVE_VERSION=1;
export const clone=value=>JSON.parse(JSON.stringify(value));
export function initialState(seed=0){
  if(!Number.isInteger(seed)||seed<0||seed>3)throw Error('Invalid campaign seed');
  return {chapter:1,phase:'intro',seed,energy:BALANCE.energy[0],progress:0,skills:[],record:[],scores:{evidence:0,institutions:0,stewardship:0},legacy:null,help:false,approach:null,response:null,task:null,submissions:[],preparation:[],events:[],acknowledged:[],exhausted:[],complete:false};
}
export function currentAgreement(s){
  // A recorded local outcome, never bought with a skill, Energy, or reputation.
  return (s.seed+s.chapter)%3!==0;
}
export function quality(task){return Math.max(BALANCE.qualityFloor,Math.round(100-BALANCE.qualityLoss*task.exhausted/task.goal));}
export function qualityLabel(task){const n=quality(task);return n>90?'Careful':n>75?'Uneven':'Rushed';}
export function feedback(s,submission=s.submissions.at(-1)){
  if(!submission)return '';
  const c=CHAPTERS[submission.chapter-1],label=qualityLabel(submission),tired=submission.finishEnergy===0;
  const state=label==='Careful'?(tired?'Careful, but finished tired.':'Careful, with Energy remaining.'):`${label}: ${c.rough}.`;
  return `${submission.artifact}: ${state} ${c.reviewer} can accept this work because ${submission.acceptedGoal} ${label==='Careful'?'The evidence and its stated limits remain usable.':c.advice}`;
}
export function pendingExhaustion(s){return s.exhausted.includes(s.chapter)&&!s.acknowledged.includes(s.chapter);}
function spend(s,n){const previous=s.energy;s.energy=Math.max(0,s.energy-n);if(previous>0&&s.energy===0&&!s.exhausted.includes(s.chapter))s.exhausted.push(s.chapter);}
function addRecord(s,title,body,milestone=false){s.record.push({chapter:s.chapter,title,body,milestone});}
function optionFor(s){const c=chapterFor(s);return s.phase==='revise'?c.responses.find(o=>o.id===s.response):c.options.find(o=>o.id===s.approach);}
export function pace(s){return s.task?.kind==='main'?(s.skills.includes('pipeline')?2:1):(s.skills.includes('team')?2:1);}
export function taskPreview(s,kind,id){
 const c=chapterFor(s),index=s.chapter-1;
 const broad=kind==='main'?(s.chapter===10?id!=='casebook':id==='broad'):id==='shared';
 let beats=kind==='main'?[...c.beats,...(broad?c.extra:[])]:['Organize the response file and its existing notes.',...c.responseBeats,...(broad?[c.sharedBeat]:[])];
 const saved=[];
 if(kind==='main'&&s.skills.includes('templates')&&beats.length>2){saved.push(beats.shift());}
 if(kind==='response'&&s.help&&beats.length>2){saved.push(beats.shift());}
 let goal=beats.length,cost=kind==='main'?(broad?BALANCE.broadCost[index]:BALANCE.focusedCost[index]):(broad?BALANCE.sharedCost[index]:BALANCE.boundedCost[index]);
 const reused=kind==='main'?REUSE.filter(r=>r.chapter===s.chapter&&(!r.only||r.only===id)&&s.preparation.some(p=>p.chapter===r.from&&p.approach===r.approach)):[];
 for(const r of reused){cost=Math.max(1,cost-(r.cost||0));if(r.sections&&beats.includes(c.reusableBeat))beats.splice(beats.indexOf(c.reusableBeat),1);saved.push(`${r.label}: ${r.why}`);}
 goal=beats.length;
 const speed=kind==='main'?(s.skills.includes('pipeline')?2:1):(s.skills.includes('team')?2:1);
 return {goal,cost,beats,saved,presses:Math.ceil(goal/speed),kind,reused:reused.map(r=>r.label)};
}
function startTask(s,kind,id){
 const c=chapterFor(s),o=(kind==='main'?c.options:c.responses).find(o=>o.id===id);
 const config=taskPreview(s,kind,id);
 s.task={...config,done:0,exhausted:0,paid:1,artifact:o.artifact,track:o.track};
 spend(s,1);
 s.phase=kind==='main'?'work':'revise';
}
export function scheduledCost(task,done=task.done){return done>=task.goal?task.cost:done>=Math.ceil(task.goal/2)?1+Math.floor((task.cost-1)/2):1;}
export function nextCharge(s){if(!s.task)return 0;return scheduledCost(s.task,Math.min(s.task.goal,s.task.done+pace(s)))-s.task.paid;}
export function actions(s){
 if(pendingExhaustion(s))return ['acknowledge'];
 switch(s.phase){
 case 'intro':return ['begin'];
 case 'instructions':return ['continue'];
 case 'plan':return [...Object.entries(BALANCE.upgrades).filter(([id,u])=>s.chapter>=u.chapter&&!s.skills.includes(id)&&s.progress>=u.cost).map(([id])=>'learn:'+id),...(!s.help?['help']:[]),...chapterFor(s).options.map(o=>'approach:'+o.id)];
 case 'work':case 'revise':return ['work'];
 case 'submitted':case 'submitted-response':return ['continue'];
 case 'challenge':return chapterFor(s).responses.filter(o=>!o.needsAgreement||currentAgreement(s)).map(o=>'response:'+o.id);
 case 'recognition':return ['next'];
 default:return [];
 }
}
export function act(s,id){
 if(!actions(s).includes(id))return false;
 if(id==='acknowledge'){s.acknowledged.push(s.chapter);return true;}
 // Every other durable result can be reconstructed from this finite action journal.
 if(id==='begin'){s.phase=s.chapter===1?'instructions':'plan';}
 else if(id==='continue'){
   if(s.phase==='instructions')s.phase='plan';
   else if(s.phase==='submitted')s.phase='challenge';
   else {
     const c=chapterFor(s);s.phase='recognition';
     addRecord(s,c.milestone,c.recognition,true);
   }
 }else if(id==='help'){
   s.help=true;spend(s,BALANCE.helpCost);addRecord(s,'A credited preparation partner',chapterFor(s).help);
 }else if(id.startsWith('learn:')){
   const skill=id.slice(6);s.progress-=BALANCE.upgrades[skill].cost;s.skills.push(skill);addRecord(s,UPGRADES[skill].title,UPGRADES[skill].story);
 }else if(id.startsWith('approach:')){
   s.approach=id.slice(9);if(s.chapter===10)s.legacy=s.approach;startTask(s,'main',s.approach);
 }else if(id.startsWith('response:')){
   s.response=id.slice(9);startTask(s,'response',s.response);
 }else if(id==='work'){
   const t=s.task,amount=Math.min(pace(s),t.goal-t.done);
   // Charge at individual section boundaries even when an upgrade completes two.
   for(let i=0;i<amount;i++){
     if(s.energy===0)t.exhausted++;
     t.done++;
     const due=scheduledCost(t)-t.paid;
     spend(s,due);t.paid+=due;
   }
   if(t.done===t.goal){
     const c=chapterFor(s),submission={...clone(t),chapter:s.chapter,finishEnergy:s.energy,
       acceptedGoal:(t.kind==='main'?DRAFT_ACCEPTANCE:ACCEPTANCE)[s.chapter-1]};
     s.submissions.push(submission);
     if(t.kind==='main')s.preparation.push({chapter:s.chapter,approach:s.approach,artifact:t.artifact});
     const reward=t.kind==='main'?BALANCE.firstReward:BALANCE.responseReward;s.progress+=reward;
     s.scores[t.track]++;
     addRecord(s,t.artifact,feedback(s,submission));
     s.phase=t.kind==='main'?'submitted':'submitted-response';
   }
 }else if(id==='next'){
   if(s.chapter===12){s.complete=true;s.phase='ending';addRecord(s,LEGACIES[s.legacy].title,LEGACIES[s.legacy].ending,true);}
   else {s.chapter++;s.phase='intro';s.energy=BALANCE.energy[s.chapter-1];s.help=false;s.approach=null;s.response=null;s.task=null;}
 }
 s.events.push(id);return true;
}
export function canUndo(s){return s.events.at(-1)==='work'&&!pendingExhaustion(s);}
export function undo(s){
 if(!canUndo(s))return false;
 const replayed=replay({version:1,campaign:'legal-scholar',seed:s.seed,events:s.events.slice(0,-1),acknowledged:s.acknowledged});
 Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,replayed);return true;
}
export function serialize(s){return JSON.stringify({version:SAVE_VERSION,campaign:'legal-scholar',seed:s.seed,events:s.events,acknowledged:s.acknowledged});}
export function replay(data){
 if(!data||data.version!==SAVE_VERSION||data.campaign!=='legal-scholar'||!Array.isArray(data.events)||data.events.length>BALANCE.maxEvents||!Array.isArray(data.acknowledged)||data.acknowledged.some(n=>!Number.isInteger(n)||n<1||n>12)||new Set(data.acknowledged).size!==data.acknowledged.length)throw Error('This is not a supported save for The Legal Scholar.');
 const s=initialState(data.seed);
 for(const event of data.events){
   // Acknowledgements are presentation history, retained across work-only Back.
   if(pendingExhaustion(s))s.acknowledged.push(s.chapter);
   if(typeof event!=='string'||event==='acknowledge'||!act(s,event))throw Error('The save contains an impossible action.');
 }
 s.acknowledged=[...data.acknowledged];
 if(s.acknowledged.some(n=>n>s.chapter)||s.exhausted.some(n=>n<s.chapter&&!s.acknowledged.includes(n)))throw Error('The save has inconsistent chapter notices.');
 return s;
}
export function parseSave(raw){if(typeof raw!=='string'||raw.length>100000)throw Error('The save file is too large or unreadable.');return replay(JSON.parse(raw));}
export function exportRecord(s){return ['THE LIVING RECORD — THE LEGAL SCHOLAR',`Chapter ${s.chapter} of 12`,s.complete?LEGACIES[s.legacy].title:'Career in progress','',...s.record.map(r=>`${r.milestone?'★ MILESTONE: ':''}${r.title}\n${r.body}\n`)].join('\n');}
