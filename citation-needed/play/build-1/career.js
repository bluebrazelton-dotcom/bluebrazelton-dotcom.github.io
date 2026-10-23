import {DOCTORATE} from './career-doctorate.js?v=20261013r2';
import {APPOINTMENTS} from './career-appointments.js?v=20261013r2';
import {FACULTY} from './career-faculty.js?v=20261013r2';
import {LEGACY} from './career-legacy.js?v=20261013r2';
import {CAREER_VERSION,CAREER_ENERGY,CAREER_TASKS,QUALITY_FLOOR,QUALITY_LOSS} from './career-balance.js?v=20261013r2';
import {chapterState,fact,remember} from './career-facts.js?v=20261013r2';
import {submittedCareerFeedback} from './career-feedback.js?v=20261013r2';

export const CAREER_CHAPTERS=Object.freeze({...DOCTORATE,...APPOINTMENTS,...FACULTY,...LEGACY});
export const isCareerStage=stage=>/^c(?:[5-9]|1[0-2])_/.test(stage)&&stage!=='c5_opening';
export const careerNode=s=>s.career?CAREER_CHAPTERS[s.career.chapter]?.nodes(s)[s.career.node]:null;
export const careerWork=s=>s.career?chapterState(s).tasks[s.career.node]||chapterState(s).tasks[chapterState(s).lastTask]||null:null;
export function scenario(seed){
  const band=['support','mixed','failure'][seed%3];
  return {seed,pressured:seed%4===3,advisorSupport:seed%3!==2,peerWilling:seed%4!==2,niaCurrent:seed%2===0,stagedTerms:seed%4!==2,
    result:band,defense:['accepted','corrections','rereview'][Math.floor(seed/3)%3],
    revision:{source:seed%5!==1,permission:seed%5!==2,willing:seed%5!==3,window:seed%5!==4},
    marketOpen:seed%3!==2,negotiationTerms:seed%4!==3,negotiationGranted:seed%2===0,
    aminaWilling:seed%4!==2,portabilitySource:seed%5!==1,portabilityPermission:seed%5!==2,portabilityWindow:seed%5!==4,portabilityBand:band,tenureOpening:seed%2===0,
    sharedStewardTerms:seed%3!==2,appraisalBand:band,localRelief:seed%2===0,
    publicReady:seed!==7,communityReady:seed!==8,institutionReady:seed!==9,
    academyInvitation:seed!==10,staffWilling:seed%4!==2,academyPackage:seed%3!==2,transferWilling:seed%3!==2,
    nationalActor:seed%5!==1,nationalPermission:seed%5!==2,nationalTerms:seed%5!==3,publicAssent:seed%2===0,
    federatedAssent:seed%2===0,commonsWilling:seed%2===0,endingPressure:['ordinary','changed','severe'][seed%3]};
}
function entry(s){return {progress:s.progress,capacity:s.capacity,record:[...s.record]};}
export function startCareer(s,seed=0,receiptVersion=2){
  if(s.stage!=='c5_opening'||!s.graduate?.bridge.independent_design||!Number.isInteger(seed)||seed<0||seed>11)return false;
  const receipts=[s.research?.receipt,s.graduate?.receipt].filter(r=>r?.demonstrated||(receiptVersion===2&&r?.status==='demonstrated')).map(r=>({owner:r.owner,commitment:r.primary,act:'Completed earlier response',chapter:r.owner.startsWith('C03')?3:4,demonstrated:true}));
  s.career={version:CAREER_VERSION,entry:entry(s),seed,context:scenario(seed),log:[],chapter:5,node:'intro',chapters:{},facts:{},profiles:{},currentProfile:null,receipts,notes:[],witnesses:{}};
  // Older in-progress careers keep their already committed tally and ending.
  // Newly entered careers recognize Chapter 3's status-based receipt as well.
  if(receiptVersion===2)s.career.receiptVersion=2;
  enterChapter(s,5);return true;
}
function enterChapter(s,n){
  const c=s.career;
  c.chapter=n;c.node='intro';c.chapters[n]={choices:{},tasks:{},completed:[],lastTask:null,entryEnergy:CAREER_ENERGY[n]-(c.context.pressured?3:0),closingProgress:null};
  s.stage=`c${n}_intro`;s.progress=0;s.capacity=c.chapters[n].entryEnergy;
  s.exhaustionNotified=s.seenPopups.includes(`energy-exhausted-c${n}`);s.exhaustionPending=false;
  s.summary=`After the chapter break: ${s.capacity}/${CAREER_ENERGY[n]} Energy. ${c.context.pressured?'Current role pressure uses 3 of this chapter’s Energy; required work remains productive. ':''}${CAREER_CHAPTERS[n].note}`;
}
function discount(s,key){return key==='practice'&&fact(s,'practice')?.active?'Versioned practice':key==='method'&&fact(s,'method')?'Method Fit Map':key==='dossier'&&fact(s,'dossier')?'Reusable Dossier':key==='retrieval'&&fact(s,'retrieval')?'Current record index':'';}
export function taskPlan(s,node=careerNode(s)){
  if(node?.kind!=='work')return null;
  const spec=CAREER_TASKS[node.task],saved=chapterState(s).tasks[s.career.node];
  if(!spec)throw Error(`Missing task balance: ${node.task}`);
  const benefit=saved?.discount??discount(s,spec.discount),cost=saved?.cost??Math.max(0,spec.cost-(benefit?1:0));
  const start=Math.min(1,cost),finish=Math.min(1,cost-start),middle=cost-start-finish;
  const mid=spec.stops.length>1?spec.stops[Math.floor((spec.stops.length-1)/2)]:spec.goal;
  const charges=[{at:0,cost:start},{at:mid,cost:middle},{at:spec.goal,cost:finish}].filter(x=>x.cost>0);
  return {...spec,cost,discount:benefit,charges};
}
function charge(s,w,plan){const due=plan.charges.filter(x=>x.at<=w.units).reduce((n,x)=>n+x.cost,0)-w.settled;s.capacity=Math.max(0,s.capacity-due);w.settled+=due;}
function go(s,next){
  const c=s.career,ch=chapterState(s);
  if(next==='$next'){ch.closingProgress=s.progress;remember(s,`chapter-${c.chapter}`,`Chapter ${c.chapter} complete · ${CAREER_CHAPTERS[c.chapter].title}`);enterChapter(s,c.chapter+1);return;}
  c.node=next;s.stage=`c${c.chapter}_${next}`;
  const n=careerNode(s);if(!n)throw Error(`Unknown career node ${s.stage}`);
  if(n.kind==='work'){
    const plan=taskPlan(s,n);ch.tasks[next]={task:n.task,owner:n.owner,title:n.title,units:0,goal:plan.goal,quality:[],settled:0,cost:plan.cost,discount:plan.discount,finishEnergy:null,drafts:[]};ch.lastTask=next;
    charge(s,ch.tasks[next],plan);
    s.summary=`Work started: ${n.title}. ${plan.cost} Energy total; ${plan.charges.filter(x=>x.at===0).reduce((v,x)=>v+x.cost,0)} at the start. ${plan.discount?`${plan.discount} saves 1 Energy on preparation. `:''}Advance through the developing artifact to its next result.`;
  }
}
export function careerActions(s){
  const n=careerNode(s);if(!n)return [];
  if(n.kind==='work')return ['career-work'];
  if(n.kind==='scene')return [`career-continue:${s.career.node}`];
  if(n.kind==='choice')return n.options.filter(o=>o.available).map(o=>`career-choose:${o.key}`);
  return [];
}
export function careerCan(s,action){return action==='start-career'?s.stage==='c5_opening'&&Boolean(s.graduate?.bridge.independent_design):isCareerStage(s.stage)&&careerActions(s).includes(action);}
export function careerAct(s,action){
  if(action==='start-career')return startCareer(s,Math.floor(Math.random()*12));
  if(!careerCan(s,action))return false;
  const c=s.career,ch=chapterState(s),n=careerNode(s),key=c.node;
  c.log.push(action);
  if(n.kind==='work'){
    const w=ch.tasks[key],plan=taskPlan(s,n),stop=plan.stops.find(x=>x>w.units),before=w.units,energy=s.capacity;
    for(let i=before;i<stop;i++){w.quality.push(s.capacity===0);w.units++;charge(s,w,plan);}
    const progress=Math.floor(w.units*6/plan.goal)-Math.floor(before*6/plan.goal);s.progress+=progress;
    const index=plan.stops.indexOf(stop);w.drafts.push(n.drafts[index]||n.drafts.at(-1));
    s.summary=`${w.drafts.at(-1)[0]} completed. +${progress} Progress; ${energy-s.capacity} Energy spent at the disclosed milestones. ${w.units}/${w.goal} work.`;
    if(w.units===w.goal){w.finishEnergy=s.capacity;ch.completed.push(key);n.effect(s);const q=careerQuality(s);remember(s,n.owner,`${n.title} · ${q.band.toLowerCase()} finish${w.finishEnergy===0?' at zero Energy':''}`);go(s,n.next);s.summary=`Work completed: ${n.title}. ${q.detail}`;}
  }else if(n.kind==='choice'){
    const o=n.options.find(x=>`career-choose:${x.key}`===action);ch.choices[key]=o.key;ch.completed.push(key);o.effect(s);s.summary=`${o.label}. ${o.detail}`;go(s,o.next);
  }else{
    ch.completed.push(key);n.effect(s);s.summary=`${n.title} recorded. ${n.next==='$next'?'':n.description}`;go(s,n.next);
  }
  return true;
}
export function careerQuality(s){
  const w=careerWork(s);if(!w)return null;
  const exhausted=w.quality.filter(Boolean).length,value=Math.max(QUALITY_FLOOR,Math.round(100-QUALITY_LOSS*exhausted/w.goal)),band=exhausted===0?'Careful':value>75?'Uneven':'Rushed',finished=w.units===w.goal;
  const detail=submittedCareerFeedback(w.task,band,w.finishEnergy===0);
  return {task:'career',noun:w.title,value,band,exhausted,finished,detail,record:`${w.title} · ${band.toLowerCase()} finish`};
}
// Reconstruct from the verified Chapter 4 boundary and the finite action history.
// Derived currencies, source rights, receipts and endings cannot be inserted into a save.
export function cleanCareerState(base,p){
  const c=p.career;
  if(!c||c.version!==CAREER_VERSION||!Array.isArray(c.log)||c.log.length>600||!c.log.every(x=>typeof x==='string'&&x.length<80))return null;
  try{
    const fresh=structuredClone(base);fresh.career=null;fresh.undoHistory=[];
    if(c.receiptVersion!==undefined&&c.receiptVersion!==2)return null;
    if(!startCareer(fresh,c.seed,c.receiptVersion===2?2:1))return null;
    for(const action of c.log)if(!careerAct(fresh,action))return null;
    if(fresh.stage!==p.stage||fresh.capacity!==p.capacity||fresh.progress!==p.progress||fresh.standing!==p.standing||JSON.stringify(fresh.career)!==JSON.stringify(c))return null;
    fresh.seenPopups=[...base.seenPopups];fresh.exhaustionNotified=fresh.seenPopups.includes(`energy-exhausted-c${c.chapter}`);
    fresh.exhaustionPending=!fresh.exhaustionNotified&&p.exhaustionPending===true;
    fresh.undoMode=p.undoMode;fresh.updatedAt=p.updatedAt;
    fresh.summary=typeof p.summary==='string'?p.summary.slice(0,1500):fresh.summary;
    return fresh;
  }catch{return null;}
}
