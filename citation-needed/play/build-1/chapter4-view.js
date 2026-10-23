import {MASTERS_STAGES,MASTERS_FOCUSES as F} from './chapter4-content.js?v=20261013r2';
import {MASTERS_TASKS as T} from './chapter4-balance.js?v=20261013r2';
import {mastersTask,mastersWork,mastersWorkPerPress,mastersQuality,alternateAvailability} from './masters.js?v=20261013r2';
const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const lines=rows=>`<dl class="draft-lines">${rows.map(([label,text])=>`<div><dt>${esc(label)}</dt><dd>${esc(text)}</dd></div>`).join('')}</dl>`;
const paper=(title,rows,tail='')=>`<div class="artifact-paper research"><span class="paper-kicker">MASTER’S STUDY · CURRENT SOURCES</span><strong>${esc(title)}</strong>${lines(rows)}${tail}</div>`;
const focus=s=>F[s.research.focus];
export function mastersConfig(s){
  const cfg={...MASTERS_STAGES[s.stage]};
  if(['c4_design','c4_plan','c4_study'].includes(s.stage)){cfg.id=focus(s).id;cfg.title=focus(s).title;}
  if(s.stage==='c4_review')cfg.description=focus(s).collision;
  if(s.stage==='c4_response'){cfg.id=s.graduate.response==='narrow'?'C04-REV-01-R01':'C04-REV-01-R02';cfg.title=s.graduate.response==='narrow'?'Narrow the question, keep the evidence':'Replace the dependency, keep the question';}
  return cfg;
}
function price(s,task){
  const spec=T[task],aligned=task==='design' && s.graduate.opening==='aligned';
  const total=spec.charges.reduce((n,x)=>n+x.cost,0)-(aligned?1:0);
  return `${spec.goal} work units · ${total} Energy: ${spec.charges.map(x=>`${x.cost-(aligned && x.at===24?1:0)} ${x.at?`at ${x.at}/${spec.goal}`:'now'}`).join(', ')}.${total>s.capacity?' Exceeds remaining Energy; further work at zero loses polish.':total===s.capacity?' Finishes with no Energy in reserve.':''}`;
}
function detail(s){
  const task=mastersTask(s),w=mastersWork(s),next=T[task].charges.find(x=>x.at>w.units);
  return `Work ${w.units}/${T[task].goal} · +${mastersWorkPerPress(s)}/press.${next?` Next: ${next.cost-(task==='design' && s.graduate.opening==='aligned' && next.at===24?1:0)} Energy at ${next.at}/${T[task].goal}.`:' No further Energy charge.'}${s.capacity===0?' Work counts; further drafting loses polish.':''}`;
}
function badge(s){
  const g=s.graduate,task=mastersTask(s);
  const label=task==='design' && g.context.preparation!=='absent'?'Earlier inquiry preparation':task==='study' && g.guideConsulted?'Mara’s credited preparation':task==='narrow' && g.skill?'Minimum Defensible Design':'';
  const end=task==='design'?4:6;
  return label?`<div class="upgrade-badge"><strong class="upgrade-value">${mastersWorkPerPress(s)>1?'2×':'+1'}</strong><div><strong>${esc(label)}</strong><span>First ${end} work units at +2/press; ${end/2} presses saved. Sources and permission remain current.</span></div></div>`:'';
}
export function mastersChoices(s,button){
  const g=s.graduate;
  switch(s.stage){
    case 'c4_intro':return button('Use the ordinary baseline','baseline-masters','24 design units · 3 Energy. Public-source and permitted-aggregate study; no special funding required.','primary')+(g.context.openingAvailable?button('Align the teaching and access calendars','align-masters','Optional design variant · 2 Energy total (3 before alignment; 1 saved, already included). Starts the design with one scheduling check replaced. Does not grant alternate evidence or permission.'):'<p class="support-note">Optional calendar alignment unavailable. The ordinary baseline completes the same degree.</p>');
    case 'c4_design':return badge(s)+button('Work on the design','work-c4',detail(s),'primary')+(g.tasks.design.units===0 && g.context.guideAvailable && !g.guideConsulted && s.capacity>0?button('Ask Mara to check the dependency map','consult-guide','Optional · −1 Energy; saves 3 later study presses with credited preparation. Program feedback remains available without her.'):'');
    case 'c4_lesson':return button('Practice Minimum Defensible Design','learn-design','Spend 3 earned Progress · save 3 smaller-response drafting presses. Official methods feedback; no evidence or permission granted.','primary');
    case 'c4_plan':return button('Begin the bounded evidence audit','start-study',price(s,'study'),'primary');
    case 'c4_study':case 'c4_response':return badge(s)+button(s.stage==='c4_study'?'Audit the current evidence':g.response==='narrow'?'Work on the limitation and future-evidence note':'Work on the accountability brief','work-c4',detail(s),'primary');
    case 'c4_review':return button('Narrow the question, keep the evidence','masters-narrow',`${price(s,'narrow')} Complete the versioned limitation and future-evidence note; accept a smaller claim despite its less impressive reach. Pending Discovery demonstration. Full master’s result.`,'primary')+(alternateAvailability(s).eligible?button('Replace the dependency, keep the question','masters-replace',`${price(s,'replace')} Use the current partner register under the displayed terms; return the changed brief to Elise with named credit and retained corrections. Pending Public Contribution demonstration.`):`<p class="support-note">Alternate-source response unavailable: ${esc(alternateAvailability(s).reason)} The smaller response remains a complete master’s result.</p>`);
    case 'c4_defend':return button(g.response==='narrow'?'Complete the note and defend the changed study':'Return the brief and defend the changed study','defend-masters',`${g.response==='narrow'?'Finalize the versioned limitation and future-evidence note.':'Return to Elise Chen with source credit and retained corrections under the displayed terms.'} Committee recognition: +1 Standing. Record one completed response demonstration; no legacy finale is locked.`,'primary');
    case 'c4_doctoral':return button('Read the ordinary doctoral-formation route','open-doctoral','Program advising and methods training. Available with either response, any focus and any guide history.','primary');
    case 'c4_capstone':return button('Consolidate the independent design','consolidate-masters','Retain the latest evidence chain, defended artifact and bounded next question. Enter the visible Chapter 5 Opening.','primary');
    case 'c5_opening':return '<p class="end-note">Chapter 4 is complete. Continue explicitly into doctoral formation when ready.</p>';
  }
}
export function mastersCue(s){
  if(!['c4_design','c4_study','c4_response'].includes(s.stage))return null;
  const task=mastersTask(s),w=mastersWork(s),beat=w.units<6?0:w.units<12?1:2;
  const text=task==='design'?['Separate your desired claim from the minimum current evidence.','Name the owner, dependency and fallback before the study grows.','Finish the exclusions, measurement plan and reliable completion floor.'][beat]:task==='study'?['Audit source dates and measurement definitions.','Compare the evidence with the claim and record missing definitions.','Finish the audit; preserve conflicting or absent information for Review.'][beat]:s.graduate.response==='narrow'?['Draft the smaller supported claim.','Version the limitation and future-evidence note.','Attach the completion floor; the wider question remains open.'][beat]:['Audit the current alternate register and its approved use.','Amend the design, retaining owner corrections and source credit.','Finish the returned planning brief within the agreed limits.'][beat];
  return {key:`${task}:${beat}`,text,count:`Work ${w.units} of ${T[task].goal}.`};
}
function alternateRows(s){
  const a=s.graduate.context.alternate;
  return [['Alternate source',a.source?`${focus(s).alternate} A fresh Chapter 4 register; no Chapter 3 data copied.`:'No current alternate register.'],
    ['Accountable owner',a.owner?'Elise Chen, Harbor Pathways records coordinator, controls the register and may correct the brief.':'No current accountable owner.'],
    ['Alternate use terms',a.permission?'Current owner approval: bounded planning brief and committee defense; named source credit and corrections returned to Elise. No individual linkage, public ranking or causal claims.':'Current alternate-use permission absent.'],
    ['Workload window',a.window?'An agreed 18-unit audit/revision window is current: 4 Energy total; audit remains productive at zero.':'No feasible alternate audit/revision window.']];
}
export function mastersArtifact(s){
  const g=s.graduate,f=focus(s),w=mastersWork(s),task=mastersTask(s);
  const meter=w && ['c4_design','c4_study','c4_response'].includes(s.stage)?`<div class="work-meter"><progress class="work-progress" max="${T[task].goal}" value="${w.units}" aria-label="${esc(task)} master’s work"></progress><span class="paper-progress">Work ${w.units}/${T[task].goal}</span></div>`:'';
  if(s.stage==='c4_intro')return paper(f.title,[['Inherited question',f.question],['Current conditions',g.context.pressured?'Fixed teaching hours restrict demanding coordination. The pressured start is 9/12 Energy; source audit and design revision stay productive.':'Fixed teaching hours and a current access calendar. After rest: 12/12 Energy; a small baseline study fits.'],
    ['New sources and exclusions',`${f.evidence} ${f.exclusion}`],['Current authority','The Cedar Vale program records office permits cited documents and deidentified aggregates for this project. No individual linkage or public aggregate release. Chapter 3 permission does not transfer.'],
    ['Guide and feedback',g.context.guideAvailable?'Mara Velez has formal program authority and a calendar. She can prepare the design, disagree or decline extra work; she cannot grant partner evidence access. The methods clinic preserves official feedback.':'The guide is contested or unavailable. The program methods clinic supplies official design feedback and the committee evaluates the completed project.'],
    ['Preparation',`${g.context.preparation} history: ${g.context.preparation==='absent'?'ordinary orientation supplies all project information':'earlier notes save 2 initial design presses'}; no current evidence, access or permission is inherited.`]],`<details><summary>Read possible alternate-source terms</summary>${lines(alternateRows(s))}</details>`);
  if(['c4_design','c4_lesson','c4_plan'].includes(s.stage))return paper(f.title,[['Desired question',f.question],['Minimum evidence',f.evidence],['Dependency',f.dependency],['Fallback',f.narrow],['Design feedback',g.skill?'Minimum Defensible Design learned. Desired claim, evidence, dependency and completion floor separated.':'The ordinary methods review at 12/24 will teach the completion-floor practice.'],['Terms',g.profile.baseline.terms],['Opening and Support',`${g.opening==='aligned'?'One calendar check replaced; 1 Energy saved at completion.':'Ordinary baseline.'} ${g.guideConsulted?'Mara’s help is credited.':'Program methods feedback remains available.'}`]],meter);
  if(s.stage==='c4_study')return paper('Current evidence audit',[['Current sources',g.profile.baseline.sources],['Intended comparison',f.question],['Known dependency',f.dependency],['Limits',f.exclusion],['Productive work',g.context.pressured?'Coordination is constrained; source audit, measurement notes and design revision remain useful.':'Source audit, measurement notes and design revision protect the completion floor.']],meter+`<details><summary>Read current alternate-source terms</summary>${lines(alternateRows(s))}</details>`);
  if(s.stage==='c4_review')return paper('Review: work retained',[['Unsupported claim or use',f.collision],['Saved work','Your design, source audit, measurement notes and minimum completion floor are retained.'],['Always viable',f.narrow],...alternateRows(s)]);
  if(s.stage==='c4_response')return paper(g.response==='narrow'?'Versioned limitation and future-evidence note':'Changed evidence/use brief',[['Revised claim',g.response==='narrow'?f.narrow:f.alternate],['Completion obligation',g.response==='narrow'?'Retain the narrower claim; complete the limitation and future-evidence note. Discovery evidence remains pending.':'Return the changed brief to Elise Chen, retaining corrections and named credit. Public Contribution evidence remains pending.'],['Use boundary',g.response==='narrow'?g.profile.baseline.terms:'Owner-approved bounded planning brief and defense only; no personal linkage, public ranking or causal claim.'],['Progress',w.units<6?'Drafting the supported claim and limitations.':w.units<12?'Versioning the amended design and obligation.':'Finishing the credited source/use note.']],meter);
  const r=g.profile.resolution,q=mastersQuality(s);
  return paper(s.stage==='c5_opening'?'Defended design · doctoral formation':f.title,[['Changed claim',r.claim],[g.followThrough?'Completed obligation':'Required obligation',g.followThrough?g.followThrough.action:r.obligation],['Effective evidence chain',`Original design → feasibility review → ${g.response==='narrow'?'bounded claim':'alternate-source revision'}. The defended study retains all three versions.`],['Use',r.use],['Assessment',`${q.band} · ${q.value}/100. ${q.detail} The finished study is sufficient for the bounded defense.`],['Recognition',g.bridge.defended_bounded_masters_contribution?'The Cedar Vale master’s committee recognizes the completed contribution.':'Ready for committee defense; formal recognition and demonstrated commitment remain pending.'],['Next question',f.next],['Doctoral route',g.bridge.doctoral_formation_opening?'Ordinary program advising and methods training.':'The ordinary program route follows the defended contribution.']],`<details><summary>Read provenance and independent-design boundary</summary>${lines([['Chapter 3',g.provenance.chapter3],['Direction',g.receipt?`${g.receipt.primary}: one completed response-owned demonstration. All four legacy finales remain open.`:'Selection alone earns no demonstration.'],['Chapter 5','Next, develop a dissertation plan with a doctoral committee and advance to candidacy.']])}</details>`);
}
