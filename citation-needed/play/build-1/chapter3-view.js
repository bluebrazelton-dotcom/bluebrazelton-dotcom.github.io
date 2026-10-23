import {RESEARCH_FOCUSES as FOCUSES, RESEARCH_STAGES} from './chapter3-content.js?v=20261013r2';
import {RESEARCH_BALANCE as B, RESEARCH_TASKS as TASKS} from './chapter3-balance.js?v=20261013r2';
import {researchTask, researchWork, researchWorkPerPress, researchAssessment, sharedAvailability, researchReturnDraft} from './research.js?v=20261013r2';

const esc=text=>String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const lines=rows=>`<dl class="draft-lines">${rows.map(([label,text])=>`<div><dt>${esc(label)}</dt><dd>${esc(text)}</dd></div>`).join('')}</dl>`;
const paper=(kicker,title,rows,tail='')=>`<div class="artifact-paper research"><span class="paper-kicker">${esc(kicker)}</span><strong>${esc(title)}</strong>${lines(rows)}${tail}</div>`;
export function researchConfig(state) {
  const cfg={...RESEARCH_STAGES[state.stage]},r=state.research, focus=FOCUSES[r.focus];
  if (state.stage==='c3_intro') {
    cfg.description=`Your finished ${state.form==='extra' ? 'extra-credit paper' : state.form==='session' ? 'session inquiry note' : state.form==='memo' ? 'class paper' : 'campus guide'} supplies an ordinary university foothold. Dr. Shah offers a defined contribution in an existing study; no old packet or special invitation is required.`;
  }
  if (state.stage==='c3_work') cfg.description=commonBeat(r.tasks.common.units).text;
  if (state.stage==='c3_focal') {cfg.title=focus.title;cfg.description=focalBeat(state).text;}
  if (state.stage==='c3_review') cfg.description=focus.challenge;
  if (['c3_response','c3_return'].includes(state.stage)) {
    cfg.id=r.response==='shared' ? 'C03-RSP-01' : 'C03-REV-01-R01';
    cfg.title=r.response==='shared' ? 'Joint category change log' : focus.smaller;
    cfg.description=state.stage==='c3_response' ? responseBeat(state).text : researchAssessment(state);
  }
  return cfg;
}
function commonBeat(units) {
  return units<8 ? {key:0,text:'Connect each public program description to its source and date. Keep the source legend attached.'}
    : units<12 ? {key:1,text:'Compare the descriptions with the permitted deidentified aggregate table. Its rows count offers, not individual experiences.'}
    : units<20 ? {key:2,text:'Put the inference beside its limit. A row called “available” still needs interpretation.'}
    : {key:3,text:'Finish the source profile and exclusions for the methods appendix. Your name belongs on this contribution.'};
}
function focalBeat(state) {
  const units=state.research.tasks.focal.units;
  return units<6 ? {key:0,text:'Trace the selected question through your source profile. Add the documented starting condition.'}
    : units<9 ? {key:1,text:'Compare the second source; keep conflicting or absent details visible.'}
    : units<15 ? {key:2,text:state.research.peerCompared ? 'Nia’s credited annotations help you keep the unknowns visible. Her agreement to later work remains a separate decision.' : 'Keep drafting your own map. At 9/18, you may exchange source annotations with Nia; continuing passes that opportunity.'}
    : {key:3,text:'Finish the map and its evidence boundary. The category problem now needs a response.'};
}
function responseBeat(state) {
  const r=state.research, units=r.tasks[r.response].units, shared=r.response==='shared';
  return units<6 ? {key:0,text:shared ? 'Compare each contributor’s reading and retain differences. Prepared annotations shorten this coordination only.' : 'Draft the evidence-matched claim and its limits. Bound the Claim helps with this specific drafting step.'}
    : units<(shared ? 18 : 10) ? {key:1,text:shared ? 'Write the revised category and change log. Version 2 belongs to the contributors together; preserve disputed annotations.' : 'Prepare a returned note that identifies what is known and what a future inquiry would need.'}
    : {key:2,text:'Attach source limits, named credit and the intended use. Finish the explanation before returning the work.'};
}
export function researchCue(state) {
  if (!['c3_work','c3_focal','c3_response'].includes(state.stage)) return null;
  const task=researchTask(state), work=researchWork(state), beat=task==='common' ? commonBeat(work.units) : task==='focal' ? focalBeat(state) : responseBeat(state);
  return {key:`${task}:${beat.key}`,text:beat.text,count:`Work ${work.units} of ${TASKS[task].goal}.`};
}
function price(state,task) {
  const spec=TASKS[task],total=spec.charges.reduce((sum,step)=>sum+step.cost,0);
  const warning=total>state.capacity ? ' Budget exceeded: further work at zero loses polish.' : total===state.capacity ? ' Finishes with no Energy in reserve.' : '';
  return `${spec.goal} units · ${total} Energy: ${spec.charges.map(step=>`${step.cost} ${step.at ? `at ${step.at}/${spec.goal}` : 'now'}`).join(', ')}.${warning}`;
}
function workDetail(state) {
  const task=researchTask(state),w=researchWork(state),spec=TASKS[task];
  const next=spec.charges.find(step=>step.at>w.units);
  const pending=spec.charges.filter(step=>step.at>w.units).reduce((sum,step)=>sum+step.cost,0);
  return `Work ${w.units}/${spec.goal} · +${researchWorkPerPress(state)}/press.${next ? ` ${next.cost} Energy at ${next.at}/${spec.goal}; ${pending} remaining.` : ' No further Energy charge.'}${state.capacity===0 ? ' Work counts at zero; further drafting loses polish.' : ''}`;
}
function boost(state) {
  const task=researchTask(state),units=researchWork(state)?.units || 0;
  const active=researchWorkPerPress(state)>1;
  const label=task==='common' && state.notesRoutine ? 'Organized notes' : task==='bounded' && state.research.claimSkill ? 'Bound the Claim' : task==='shared' && state.research.peerCompared ? 'Nia’s credited preparation' : '';
  if (!label) return '';
  const end=task==='common' ? 10 : 6;
  const text=task==='common' ? '19 common-work presses instead of 24' : task==='bounded' ? '9 response presses instead of 12' : '21 coordination/drafting presses instead of 24';
  return `<div class="upgrade-badge"><strong class="upgrade-value">${active ? '2×' : '+1'}</strong><div><strong>${esc(label)}</strong><span>${units<end ? esc(text) : 'Prepared portion finished · remaining work +1 per press'}</span></div></div>`;
}
export function researchChoices(state,button) {
  const r=state.research;
  switch(state.stage) {
    case 'c3_intro':return button('Start the source profile','start-research',price(state,'common'),'primary');
    case 'c3_work':case 'c3_response':return boost(state)+button(state.stage==='c3_work' ? 'Work on the source profile' : r.response==='shared' ? 'Work on the joint revision' : 'Work on the returned note','work-c3',workDetail(state),'primary');
    case 'c3_skill':return button('Practice bounding a claim','learn-claim','Spend 3 Progress · source-linked limits; saves 3 presses on the smaller response.','primary');
    case 'c3_credit':return button('Record the research contribution','credit-research','+1 Standing from Dr. Shah’s named recognition.','primary');
    case 'c3_focus':return Object.entries(FOCUSES).map(([key,focus])=>button(focus.label,`focus-${key}`,`${focus.preview} ${price(state,'focal')}`)).join('');
    case 'c3_focal':return button('Work on the focal map','work-c3',`${workDetail(state)}${r.tasks.focal.units===9 && !r.peerCompared ? ' Continuing skips the peer comparison.' : ''}`,'primary')+(r.tasks.focal.units===9 && !r.peerCompared ? state.capacity>0 ? button('Compare source annotations with Nia','compare-nia','Optional · −1 Energy, +1 Progress. Credit her help; save 3 later joint presses. Further joint work can become rushed.') : '<p class="support-note">No Energy for an optional comparison. Required work remains available.</p>' : '');
    case 'c3_review': {
      const available=sharedAvailability(state);
      return button('Return a smaller claim','response-bounded',`${price(state,'bounded')} ${r.claimSkill ? '9 presses with Bound the Claim.' : '12 presses.'} Keep the wider question open.`,'primary')+(available.eligible ? button('Rebuild the interpretation together','response-shared',`${price(state,'shared')} ${r.peerCompared ? '21 presses with credited preparation.' : '24 presses.'} Shared credit and control; disagreement may remain.`) : `<p class="support-note">Joint revision unavailable: ${esc(available.reason)} The smaller response remains open.</p>`);
    }
    case 'c3_return':return button('Return the artifact and credit/use note','deliver-research','Deliver to Tomas and the research team. Complete one demonstration; no additional Standing.','primary');
    case 'c3_done':return button('Carry the inquiry into graduate preparation','enter-c4','Keep your bounded question, returned artifact and earned evidence.','primary');
    case 'c4_opening':return button('Begin an independent master’s design','start-masters','Rest starts a local 12-Energy budget. Keep your inquiry; establish new sources and permission.','primary');
  }
}
function termsRows(r) {
  return [['Permission',r.terms.permission ? 'Data steward permits internal recoding of these materials; no public release or new individual data.' : 'Joint recoding permission absent.'],
    ['Contributor terms',`${r.terms.nia ? 'Nia agrees' : 'Nia declines'} to source coding with named credit; ${r.terms.tomas ? 'Tomas agrees' : 'Tomas declines'} to operational review. Neither must agree with your interpretation.`],
    ['Project window',r.terms.window ? 'A scheduled revision window is available for this bounded project.' : 'No feasible joint-revision window is available.']];
}
export function researchArtifact(state) {
  const r=state.research,focus=FOCUSES[r.focus],task=researchTask(state),w=researchWork(state);
  const meter=w && ['c3_work','c3_focal','c3_response'].includes(state.stage) ? `<div class="work-meter"><progress class="work-progress" max="${TASKS[task].goal}" value="${w.units}" aria-label="${esc(task)} research work"></progress><span class="paper-progress">Work ${w.units}/${TASKS[task].goal}</span></div>` : '';
  if (state.stage==='c3_intro') return paper('YOUR ROLE AND SOURCE TERMS','A bounded contribution',[
    ['Role','Compare three local institutions’ descriptions for Dr. Shah’s supervised study. No recruitment or individual interviews.'],
    ['Sources','Public program pages and literature; permitted deidentified aggregate table. Keep dates, source links, exclusions and unknowns. Prior coursework supplies preparation, not new evidence.'],
    ['Authority','Dr. Shah supervises; the data steward owns permitted use; Tomas supplies current operational interpretation. Nia has her own methods-training aim and may disagree or decline.'],
    ['Credit and return','Your completed source profile receives named methods-appendix credit. Return the later revised note to Tomas and the team, within the displayed use terms.']]);
  if (['c3_work','c3_skill','c3_credit'].includes(state.stage)) {
    const units=r.tasks.common.units;
    const rows=[['Source legend','Three public descriptions; study literature; a permitted deidentified aggregate table. No individual account is inferred.'],
      ['Draft row',units<8 ? 'Gathering the program descriptions and dates.' : 'Three institutions use “available” while describing different entry sequences, timetables and continuation routes.'],
      ['Inference and limit',units<12 ? 'Checking the meaning of the shared category.' : 'The table records offers. It cannot establish discoverability, individual feasibility or later outcomes.'],
      ['Return',units<24 ? 'Source links and exclusions are being assembled for the methods appendix.' : researchAssessment(state,'common')]];
    return paper(state.stage==='c3_credit' ? 'COMPLETED · CREDIT COMES NEXT' : 'SOURCE PROFILE · COMMON CONTRIBUTION','What does “available” establish?',rows,meter);
  }
  if (state.stage==='c3_focus') return paper('CONTRIBUTION CREDITED · FOCUS OPEN','One study, three possible questions',[
    ['Finding a route','Map source visibility and the order of entry steps.'],['Using an offer','Map documented conditions and unknown feasibility.'],['Changing a route','Map possible carryover without treating departure as failure.'],['Scholarly direction','The focus changes your inquiry. All four legacy paths remain open.']]);
  if (state.stage==='c3_focal') {
    const units=r.tasks.focal.units,visible=Math.min(4,1+Math.floor(units/5));
    return paper('FOCAL MAP · DRAFT',focus.title,focus.rows.slice(0,visible),meter);
  }
  if (state.stage==='c3_review') return paper('REVIEW · WORK RETAINED',focus.smaller,[['Evidence boundary',focus.claim],['Future inquiry',focus.need],...termsRows(r)]);
  if (['c3_response','c3_return'].includes(state.stage)) {
    const units=w.units,shared=r.response==='shared';
    if (state.stage==='c3_return') {
      const draft=researchReturnDraft(state);
      return paper('READY TO RETURN · DEMONSTRATION STILL PENDING',draft.title,[
        ['Claim and category',`${draft.claim} ${draft.category}`],['Named contribution',draft.credit],
        ['Return and use',draft.use],['Interpretation authority',`${draft.authority} ${draft.disagreement}`],
        ['Submission review',researchAssessment(state)]]);
    }
    const rows=[['Claim',units<6 ? 'Drafting the revised claim and its limits.' : focus.claim],
      ['Category',units<(shared ? 12 : 6) ? 'The original “available” row stays unresolved while the response develops.' : shared ? focus.category : 'Keep the original category unresolved; return the smaller supported claim.'],
      ['Credit and use',units<(shared ? 18 : 10) ? shared ? 'Nia, Tomas and the student retain independent annotations and named credit.' : 'Prepare a source-linked note for Tomas’s bounded advising use.' : focus.returnUse],
      ['Return status',state.stage==='c3_return' ? researchAssessment(state) : 'Response selected; demonstration pending until work and delivery are complete.']];
    return paper(shared ? 'JOINT REVISION · INTERNAL USE ONLY' : 'BOUNDED CLAIM · WIDER QUESTION OPEN',shared ? 'Version 2: shared interpretation' : focus.smaller,rows,meter);
  }
  return paper(state.stage==='c4_opening' ? 'GRADUATE OPENING · OWN EVIDENCE NEXT' : 'RETURNED WORK · INQUIRY CONSOLIDATED','Your graduate inquiry',[
    ['Question',focus.inquiry],['Returned result',r.returned.use],['Earned direction',`${r.receipt.primary}: ${r.returned.authority}`],['Next project',`${focus.later} ${researchAssessment(state)} New sources and permission are needed before a wider claim.`]],
    `<details><summary>Read the returned credit and interpretation note</summary>${lines([['Named contributions',r.returned.credit],['Retained disagreement',r.returned.disagreement],['Further evidence needed',r.returned.nextNeed]])}</details>`);
}
export function researchPopupBody(state,id,previousAssessment='') {
  const r=state.research,focus=FOCUSES[r.focus];
  if (id==='chapter3-intro') return `${researchConfig(state).description} Your name belongs on the work you complete. After rest, your chapter budget grows to 10 Energy. ${previousAssessment} Nia’s methods practice matters to her too: “Can we keep the unknowns visible? The blank cells haven’t agreed to become zeroes.”`;
  if (id==='research-credit') return `Dr. Shah includes your source-linked profile in the methods appendix and names your contribution. ${researchAssessment(state,'common')} Record the credit before choosing your focus.`;
  if (id==='research-challenge') return `${focus.challenge} ${researchAssessment(state,'focal')} Existing sources and completed work stay useful; the interpretation must change.`;
  if (id==='research-returned') return `${focus.inquiry} ${r.returned.use} ${researchAssessment(state)} ${r.returned.authority} Graduate preparation is open; the next project establishes its own evidence and permissions.`;
  return '';
}
