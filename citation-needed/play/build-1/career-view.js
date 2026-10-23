import {CAREER_CHAPTERS,careerNode,careerWork,careerQuality,taskPlan} from './career.js?v=20261013r2';
import {CAREER_ENERGY} from './career-balance.js?v=20261013r2';
import {chapterState,fact,ROUTES} from './career-facts.js?v=20261013r2';
const esc=x=>{
 let text=String(x??'');
 // All four actor labels name more than one independent person/body.
 // Correct display grammar without rewriting drafts in accepted saved careers.
 for(const [key,r] of Object.entries(ROUTES)){
  const subject=r.actor+(key==='community'?',':'');
  text=text.replaceAll(`${r.actor} has`,`${subject} have`).replaceAll(`${r.actor} retains`,`${subject} retain`)
   .replaceAll(`The latest permitted ${r.carrier.toLowerCase()} retains its`,`The legacy artifact, “${r.carrier},” retains its`);
 }
 return text.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
};
const lines=rows=>`<dl class="draft-lines">${rows.map(([label,text])=>`<div><dt>${esc(label)}</dt><dd>${esc(text)}</dd></div>`).join('')}</dl>`;
const imageNames={5:'doctoral-formation',6:'dissertation',7:'job-market',8:'early-career',9:'tenure',10:'full-professor',11:'national-stage',12:'legacy'};
export const CAREER_PORTRAITS=Object.fromEntries(Object.entries(imageNames).map(([n,name])=>[n,{normal:`assets/${name}.png`,depleted:`assets/${name}-tired.png`,normalAlt:`The scholar at work during ${CAREER_CHAPTERS[n].title}.`,depletedAlt:`The same scholar pauses, visibly tired, during ${CAREER_CHAPTERS[n].title}.`}]));
const fatigue={
  5:['A crowded doctoral week','Teaching preparation, methods work and the candidacy plan have used this chapter’s Energy. Further drafting may be less polished; the committee still assesses the completed, defensible plan.'],
  6:['The last pages take more effort','The dissertation’s sustained evidence and revision work has used your Energy. You can finish the stated contribution and defense. Further exhausted writing loses polish; it does not change what the evidence supports.'],
  7:['A demanding search window','Applications, interpretation and appointment terms have used your Energy. The reusable dossier and protected platform remain. A tired explanation can still make the actual contribution clear.'],
  8:['A fixed term takes its toll','New-setting research and faculty responsibilities have used this chapter’s Energy. Keep working within the current boundaries; a less polished artifact can still complete the contribution and the accepted platform.'],
  9:['The work has filled the week','Research, teaching, maintenance and the appraisal have used your Energy. The written repair and durable-security route remain. Exhausted documentation loses polish without erasing completed work.'],
  10:['Freedom still has a workload','The new contribution and its maintenance decisions have used this chapter’s Energy. Complete the finite obligations; a title does not require endless capacity.'],
  11:['A wider audience, a tired scholar','The contribution, corrections and returns have used your Energy. The bounded response and recognition remain reachable. Further drafting loses polish; source rights and actor choices stay intact.'],
  12:['The handoff can still be completed','Preparing a legacy has used your Energy. Finish the permitted handoff at its prepared scale or protected minimum. A tired explanation does not revoke the independent actors’ rights or the ending.' ]
};
export const CAREER_POPUPS=Object.fromEntries(Object.entries(fatigue).map(([n,[title,body]])=>[`energy-exhausted-c${n}`,{eyebrow:`CHAPTER ${n} · ENERGY`,title,body,tone:'setback',chapter:Number(n),next:'Continue the current work with its boundaries intact.',button:'Continue with care'}]));
const cycleGroups={5:[['intro','method','methods','lesson'],['rolesChoice','roles','practice'],['proposal','review','coherent','staged','candidacy','complete']],6:[['intro','design','evidence'],['review','bounded','construct'],['defenseReady','defense','defended']],7:[[]],8:[['intro','testChoice','portability','review','carry','compare','steward'],['programChoice','program','accept']],9:[['intro','direction','nonforeground','portfolio'],['lineageIntro','operate','steward'],['appraisal','review','repair','conditions'],['readiness','tenure','secured']],10:[['intro','direction','anchor','academy'],['safeguard','lineage','lineageWork'],['promotionReady','promotion','promoted']],11:[['intro','form','national','critic','correction','sustained','noteChoice','consent','safeguard2','package'],['review','nationalBound','nationalShared','nomination','eminence','summits']],12:[[]]};
export function careerConfig(s){const c=s.career,n=careerNode(s),ch=CAREER_CHAPTERS[c.chapter],index=cycleGroups[c.chapter].findIndex(x=>x.includes(c.node));return {chapter:c.chapter,title:n.title,description:n.description,caption:ch.caption,note:ch.note,id:n.owner,phase:c.node==='intro'?`Begin Chapter ${c.chapter}`:n.kind==='ending'?'Career complete':n.kind==='choice'?'Choose your direction':n.kind==='work'?'Develop the work':'Read the result',label:`${c.chapter}.${Math.max(0,index)+1} · ${n.kind==='ending'?'What continues':ch.title}`};}
export function costText(s,node){
  if(node?.kind!=='work')return '';
  const p=taskPlan(s,node),grouped=new Map();for(const x of p.charges)grouped.set(x.at,(grouped.get(x.at)||0)+x.cost);
  const charge=[...grouped].map(([at,cost])=>`${cost} ${at?`at ${at}/${p.goal}`:'at the start'}`).join(', ');
  const saved=chapterState(s).tasks[s.career.node],remaining=p.cost-(saved?.task===node.task?saved.settled:0);
  return `${p.goal} work · ${p.cost} Energy total (${charge||'no charge'}).${p.discount?` ${p.cost+1} before preparation; ${p.discount} saves 1 Energy, already included in this total.`:''}${remaining>s.capacity?' Remaining charges exceed your Energy; work continues at zero with less polish.':''}`;
}
// Preview required work-to-work handoffs on a copy; never add a saved action.
export function followThrough(s,node){
 if(node?.kind!=='work')return null;
 const preview=structuredClone(s);node.effect(preview);preview.career.node=node.next;
 const following=CAREER_CHAPTERS[preview.career.chapter].nodes(preview)[node.next];
 if(following?.kind!=='work')return null;
 const plan=taskPlan(preview,following);
 return {title:following.title,cost:plan.cost,start:plan.charges.filter(x=>x.at===0).reduce((n,x)=>n+x.cost,0)};
}
function followThroughText(s,node){const next=followThrough(s,node);return next?` Required follow-through: ${next.title} (${next.cost} Energy total). Finishing this task starts it immediately and charges its first ${next.start} Energy.`:'';}
function nextPrice(s,next,effect=()=>{}){const preview=structuredClone(s);effect(preview);preview.career.node=next;const node=CAREER_CHAPTERS[preview.career.chapter].nodes(preview)[next];return node?.kind==='work'?` ${costText(preview,node)}${followThroughText(preview,node)}`:next==='$next'?` Rest, then begin with ${CAREER_ENERGY[s.career.chapter+1]-(s.career.context.pressured?3:0)} Energy.`:'';}
export function careerChoices(s,button){
 const c=s.career,n=careerNode(s);
 if(n.kind==='ending')return '<button type="button" class="choice primary" id="export-career"><span class="choice-title">Save the career record</span><span class="choice-detail">Download this ending and the completed record as a text file.</span></button>';
 if(n.kind==='work'){
  const w=careerWork(s),p=taskPlan(s,n),stop=p.stops.find(x=>x>w.units),index=p.stops.indexOf(stop),next=n.drafts[index];
  const due=p.charges.filter(x=>x.at>w.units&&x.at<=stop).reduce((v,x)=>v+x.cost,0);
  const follow=followThrough(s,n),previousStop=p.stops.at(-2)??0;
  const finishingDue=p.charges.filter(x=>x.at>previousStop).reduce((v,x)=>v+x.cost,0)+(follow?.start||0);
  const nextCharge=follow?` Finishing also starts “${follow.title}” and charges its first ${follow.start} Energy: ${finishingDue} Energy due on the finishing press, limited by your remaining Energy.`:'';
  return `${p.discount?`<div class="upgrade-badge"><strong class="upgrade-value">−1</strong><div><strong>${esc(p.discount)}</strong><span>1 Energy saved; already included in the displayed total and charges.</span></div></div>`:''}`+button('Advance the current work','career-work',`Next: ${next?.[0]||'completed artifact'}. ${w.units} → ${stop}/${w.goal} work; ${due} Energy at the disclosed milestones.${nextCharge}${s.capacity===0?' Further work loses polish.':''}`,'primary');
 }
 if(n.kind==='choice')return n.options.filter(o=>o.available).map((o,i)=>button(o.label,`career-choose:${o.key}`,o.detail+nextPrice(s,o.next,o.effect),i===0?'primary':'')).join('');
 return button(n.label,`career-continue:${c.node}`,nextPrice(s,n.next,n.effect).trim()||'Record this result and continue when ready.','primary');
}
function contributionChapters(notes){
 const groups=new Map();let currentChapter=5;
 for(const note of notes){
  // Owner IDs identify a continuing contribution, not when its next act occurs.
  // Chapter-completion markers preserve the actual chronology in old saves too.
  const completedChapter=Number(note.owner.match(/^chapter-(\d+)$/)?.[1]);
  const key=completedChapter||currentChapter;
  if(!groups.has(key))groups.set(key,[]);
  groups.get(key).push(note);
  if(completedChapter)currentChapter=completedChapter+1;
 }
 return `<div class="ending-chapters">${[...groups].sort(([a],[b])=>a-b).map(([chapter,entries])=>`<details class="ending-chapter" data-chapter="${chapter}"><summary>${chapter?`Chapter ${chapter} · ${esc(CAREER_CHAPTERS[chapter].title)}`:'Other contributions'} <span class="entry-count">(${entries.length} ${entries.length===1?'entry':'entries'})</span></summary><ol class="ending-record">${entries.map(x=>`<li>${esc(x.text)}</li>`).join('')}</ol></details>`).join('')}</div>`;
}
export function careerArtifact(s){
 const c=s.career,n=careerNode(s),w=careerWork(s),q=careerQuality(s);
 if(n.kind==='ending'){
  const e=fact(s,'ending');return `<div class="artifact-paper research career-ending"><span class="paper-kicker">THE LIVING RECORD · COMPLETED CAREER</span><strong>${esc(e.title)}</strong><p class="ending-proof">${esc(e.proof)}</p>${e.secondaryProof?`<p>${esc(e.secondaryProof)}</p>`:''}${lines([['Earned recognition',e.recognition],['What continues',e.carrier],['Independent authority',e.authority],['Final expression',e.form==='protected'?'The prepared minimum was enacted with its defining continuation intact.':e.form==='changed'?'The actors’ revised form was enacted with independent continuation intact.':'The prepared plan was enacted at its disclosed scale.']])}<details class="contribution-record"><summary>Read contributions from Chapters 5–12</summary><p>Open a chapter to read its contributions. The download includes the complete career record.</p>${contributionChapters(c.notes)}</details><p class="student-voice">The record closes. The work does not.</p></div>`;
 }
 let body=n.kind==='work'?
   `${w.drafts.length?lines([w.drafts.at(-1)]):'<p class="student-voice">The source boundaries are set. The first advance will add a concrete part of this artifact.</p>'}${w.drafts.length>1?`<details><summary>Earlier parts of this draft</summary>${lines(w.drafts.slice(0,-1))}</details>`:''}<p class="task-cost">${esc(costText(s,n)+followThroughText(s,n))}</p>`:lines(n.lines||[]);
 if(c.chapter===5&&c.node==='intro')body+=`<aside class="work-rhythm"><strong>How work develops from here</strong><p>Each work press now completes a named part of a draft. Read the new part before advancing. The button shows the next part and its Energy cost; the finished draft stays available to reread. Chapter openings and results appear here in the work panel.</p></aside>`;
 if(n.kind!=='work'&&q?.finished){
  body+=`<div class="completed-draft"><strong>Completed work · ${esc(w.title)}</strong>${lines(w.drafts.slice(-1))}${w.drafts.length>1?`<details><summary>Read the completed draft</summary>${lines(w.drafts.slice(0,-1))}</details>`:''}</div>`;
  body+=`<p class="finish-feedback"><strong>${esc(w.title)} · ${esc(q.band)}</strong><br>${esc(q.detail)}</p>`;
 }
 if(n.kind==='work'&&w.units===0){
  const previous=chapterState(s).tasks[chapterState(s).completed.at(-1)];
  if(previous?.drafts.length)body=`<details><summary>Read the work just completed</summary><strong>${esc(previous.title)}</strong>${lines(previous.drafts)}</details>`+body;
 }
 const current=c.profiles[c.currentProfile];
 if(current)body+=`<details class="source-note"><summary>Current source and use boundary</summary>${lines([['Claim',current.claim],['Permitted use and responsibility',current.terms]])}</details>`;
 return `<div class="artifact-paper research career-paper"><span class="paper-kicker">${esc(CAREER_CHAPTERS[c.chapter].title.toUpperCase())} · WORKING RECORD</span>${body}</div>`;
}
export function careerCue(s){if(careerNode(s)?.kind!=='work')return null;const w=careerWork(s);return {key:`${s.stage}:${w.units}`,text:w.drafts.at(-1)?.[0]||'Current artifact ready to develop.',count:`Work ${w.units}/${w.goal}.`};}
export function careerRecordText(s){const e=fact(s,'ending');return ['THE LIVING RECORD',e?.title||CAREER_CHAPTERS[s.career.chapter].title,e?.recognition||'',e?.proof||'',e?.secondaryProof||'',...(e?['Authority handed on: '+e.authority,'']:[]),'COMPLETED RECORD',...s.record.map(x=>'- '+x)].join('\n');}
