import { workQuality, QUALITY_WARNING, QUALITY_OPENING } from './quality.js?v=20261013r2';
import { STAGES as OPENING_STAGES, FORMS, POPUPS as OPENING_POPUPS, CHAPTER_PORTRAITS as OPENING_PORTRAITS, CHAPTER_ENERGY_STORY, CHECK_ENERGY_WARNING, PROJECT_CHECK_COPY, PACKET_ENERGY_STEPS, STUDY_CHOICES, NOTES_ROUTINE, RECORD_LABELS, RECORD_WORDING, recordMilestone, WORK_BEATS } from './content.js?v=20261013r2';
import { workDocument, openingDocument, feedbackScene, recognitionScene, packetReview, planReview } from './experience.js?v=20261013r2';
import { planningCost, energySchedule, pendingWorkEnergy, finishStory } from './planning.js?v=20261013r2';
import { PROJECT_AIMS, projectFeedback, reviewQuality } from './feedback.js?v=20261013r2';
import { WORK_GOALS, workPerPress, energyLimit, websiteGoal, exhaustionPopupId, acknowledgeExhaustion, switchPlan, setTestingMode, initialState, loadState, getLoadNotice, saveState, clearState, can, canUndo, act, undoAction } from './engine.js?v=20261013r2';
import { ENERGY_BUDGET, PREPARATION_UPGRADE, STUDY_PACE, PROJECT_REUSE, PROJECT_CHECK } from './balance.js?v=20261013r2';
import {RESEARCH_STAGES, RESEARCH_POPUPS, RESEARCH_PORTRAIT} from './chapter3-content.js?v=20261013r2';
import {isResearchStage, researchWork, researchQuality} from './research.js?v=20261013r2';
import {researchConfig, researchChoices, researchArtifact, researchCue, researchPopupBody} from './chapter3-view.js?v=20261013r2';
import {MASTERS_STAGES,MASTERS_POPUPS,MASTERS_PORTRAIT} from './chapter4-content.js?v=20261013r2';
import {isMastersStage,mastersWork,mastersQuality} from './masters.js?v=20261013r2';
import {mastersConfig,mastersChoices,mastersArtifact,mastersCue} from './chapter4-view.js?v=20261013p7a';
import {isCareerStage,careerNode,CAREER_CHAPTERS,careerWork} from './career.js?v=20261013r2';
import {CAREER_PORTRAITS,CAREER_POPUPS,careerConfig,careerChoices,careerArtifact,careerCue,careerRecordText} from './career-view.js?v=20261013p7a';
import {BUILD,playerText,presentPlayerCopy,directionGuide} from './presentation.js?v=20261013p7b';
const STAGES={...OPENING_STAGES,...RESEARCH_STAGES,...MASTERS_STAGES};
const POPUPS={...OPENING_POPUPS,...RESEARCH_POPUPS,...MASTERS_POPUPS,...CAREER_POPUPS};
const CHAPTER_PORTRAITS={...OPENING_PORTRAITS,3:RESEARCH_PORTRAIT,4:MASTERS_PORTRAIT,...CAREER_PORTRAITS};

const $ = id => document.getElementById(id);
const researchPanel = $('work-panel');
researchPanel.addEventListener('keydown', event => {
  if (event.target !== researchPanel || researchPanel.scrollHeight <= researchPanel.clientHeight) return;
  const page = Math.max(40, researchPanel.clientHeight * .85);
  let next = researchPanel.scrollTop;
  if (event.key === 'PageDown' || event.key === ' ' && !event.shiftKey) next += page;
  else if (event.key === 'PageUp' || event.key === ' ' && event.shiftKey) next -= page;
  else if (event.key === 'ArrowDown') next += 40;
  else if (event.key === 'ArrowUp') next -= 40;
  else if (event.key === 'Home') next = 0;
  else if (event.key === 'End') next = researchPanel.scrollHeight;
  else return;
  event.preventDefault();
  researchPanel.scrollTop = Math.max(0, Math.min(researchPanel.scrollHeight, next));
});
const testing = new URLSearchParams(location.search).get('testing') === '1';
setTestingMode(testing);
const modeLabel = document.querySelector('.slice-label');
modeLabel.textContent = testing ? '· testing tools' : '· the complete career';
modeLabel.className = testing ? 'testing-label' : 'slice-label';
document.querySelector('#mode-note').textContent = testing ? 'Testing tools · Choices reversible; Chapters 1–12.' : 'Chapters 1–12 · Choices are final. Back undoes ordinary work.';
$('build-version').textContent = `Build ${BUILD}`;
let state = loadState();
let previousSpokenState = null;
let renderedChoices = '';
let notice = getLoadNotice();
let activePopupId = '';
const desktopLayout = matchMedia('(min-width:900px)');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let typingBeat = 0;
let nextDecisionPointerAfter = 0;
const keyboardRows = [
  ['key','key','key','key','key','key'],
  ['key','key','key','key','key','key'],
  ['key','space','key']
];
$('laptop-keyboard').innerHTML = keyboardRows.map(row => `<div class="key-row">${row.map(key => `<span class="pixel-key${key === 'space' ? ' space-key' : ''}"></span>`).join('')}</div>`).join('');

function workAction() {
  if (isCareerStage(state.stage)) return careerNode(state)?.kind==='work'?'career-work':'';
  if (['c4_design','c4_study','c4_response'].includes(state.stage)) return 'work-c4';
  if (['c3_work','c3_focal','c3_response'].includes(state.stage)) return 'work-c3';
  if (state.stage === 'c1_prep' && !state.packet) return 'work-packet';
  if (['c2_work', 'c2_contribute'].includes(state.stage)) return 'work-c2';
  return '';
}

function animateTyping(action) {
  if (reducedMotion.matches) return;
  const keys = [...$('laptop-keyboard').querySelectorAll('.pixel-key')];
  keys.forEach(key => key.getAnimations().forEach(animation => animation.cancel()));
  // Short, alternating finger positions; animation never schedules another game action.
  const positions = [1, 8, 3, 10, 5, 13];
  positions.forEach((position, index) => {
    const key = keys[(position + typingBeat % 3) % keys.length];
    key.animate([
      { transform: 'translateY(0)', background: '#35473f', color: '#e0e8d9' },
      { transform: 'translateY(2px)', background: '#d5b979', color: '#26372b', offset: .35 },
      { transform: 'translateY(0)', background: '#35473f', color: '#e0e8d9' }
    ], { duration: 160, delay: index * 35, easing: 'steps(2, end)' });
  });
  typingBeat++;
  const button = $('choices').querySelector(`[data-action="${action}"]`);
  if (button) button.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(2px)', offset: .35 }, { transform: 'translateY(0)' }], { duration: 180, easing: 'steps(2, end)' });
}

function pendingPopupIds() {
  if (state.exhaustionPending && !state.exhaustionNotified) return [exhaustionPopupId(state)];
  switch (state.stage) {
    case 'c1_start': return ['chapter1-intro', 'chapter1-instructions'];
    case 'c1_invest': return ['pages-complete'];
    case 'c1_prep': return state.packet ? ['packet-complete'] : [];
    case 'c1_review': return ['workshop-closure'];
    case 'c2_plan': return ['chapter2-intro'];
    case 'c2_review': return ['plan-complete'];
    case 'c2_feedback': return ['project-complete'];
    case 'c2_done': return ['chapter2-result'];
    case 'c3_intro': return ['chapter3-intro'];
    case 'c3_credit': return ['research-credit'];
    case 'c3_review': return ['research-challenge'];
    case 'c3_done': return ['research-returned'];
    case 'c4_intro': return ['chapter4-intro'];
    case 'c4_review': return ['masters-challenge'];
    case 'c4_doctoral': return ['masters-defended'];
    default: return [];
  }
}

function showPendingPopup() {
  // A native close event is asynchronous; do not reopen its unrecorded popup meanwhile.
  if (activePopupId || $('story-dialog').open || $('restart-dialog').open) return;
  const id = pendingPopupIds().find(candidate => !state.seenPopups.includes(candidate));
  if (!id) return;
  const popup = POPUPS[id];
  const feedback = projectFeedback(state);
  activePopupId = id;
  $('story-dialog').dataset.popupId = id;
  $('story-dialog').dataset.tone = id === 'project-complete' && feedback ? feedback.tone : popup.tone;
  $('story-eyebrow').textContent = popup.eyebrow;
  $('story-title').textContent = popup.title;
  const portrait = popup.chapter ? CHAPTER_PORTRAITS[popup.chapter] : null;
  $('story-dialog').dataset.illustrated = portrait ? 'true' : 'false';
  $('story-image').hidden = !portrait;
  if (portrait) { $('story-image').src = portrait.depleted; $('story-image').alt = portrait.depletedAlt; }
  else { $('story-image').removeAttribute('src'); $('story-image').alt = ''; }
  const body = state.scopeVersion === 1 && state.scope === 'wide' && popup.bodyThree ? popup.bodyThree : state.sourceChecked && popup.bodyChecked ? popup.bodyChecked : popup.body;
  const recognition = id === 'chapter2-result' ? recognitionScene(state) : null;
  $('story-body').textContent = feedback && id === 'project-complete' ? `${feedback.label}. ${feedbackScene(state)}` : recognition || (typeof body === 'string' ? body : body?.[state.form] || '');
  if (id.startsWith('research-') || id==='chapter3-intro') {
    const previous=reviewQuality(state);
    $('story-body').textContent=researchPopupBody(state,id,previous ? `Your earlier submission remains recorded: ${previous.text} ${previous.acceptance}` : 'Your earlier work retains its original assessment.');
  }
  if (id === 'project-complete' && !feedback) {
    const review = reviewQuality(state);
    if (review) $('story-body').textContent += ` ${review.text} ${review.acceptance}`;
  }
  if (id === 'workshop-closure' && packetReview(state)) $('story-body').textContent += ` ${packetReview(state)}`;
  if (id === 'plan-complete' && state.prechecked) $('story-body').textContent = 'Your earlier check located the department timetable. As you match its discussion sections to paid shifts, one required hour clashes. The lecture planner did not show this hour. Another section is open; your notes and planning work carry forward.';
  if (id === 'packet-complete' && packetReview(state)) $('story-body').textContent += ` ${packetReview(state)}`;
  if (id === 'plan-complete' && planReview(state)) $('story-body').textContent += ` ${planReview(state)}`;
  if (id.startsWith('energy-exhausted-c') && workQuality(state)?.finished) $('story-body').textContent += ' This task is already finished; its submitted quality stays recorded.';
  if (testing && id === 'chapter1-instructions') $('story-body').textContent = $('story-body').textContent.replace('Choices are final. Back undoes work presses,', 'Testing tools let you undo choices and work presses,');
  if (state.planningVersion >= 1 && id === 'chapter2-intro') $('story-body').textContent += ' Tasks spend Energy at the start and work milestones. Required work still counts at zero.';
  if (state.energyBudgetVersion === 1 && id === 'chapter2-intro') $('story-body').textContent += ` ${CHAPTER_ENERGY_STORY[2]} After rest, your chapter budget grows to ${energyLimit(state)} Energy.`;
  const quality = ['packet-complete','plan-complete','project-complete'].includes(id) ? workQuality(state, id === 'packet-complete' ? 'packet' : id === 'plan-complete' ? 'plan' : state.form) : null;
  if (quality) $('story-body').textContent += ` Work quality: ${quality.band.toLowerCase()}.`;
  if (quality && id === 'packet-complete' && state.capacity === 0) $('story-body').textContent += ' Your Energy is spent. Rest at the next task break supports future work.';
  const finish = ['plan-complete','project-complete'].includes(id) ? finishStory(state, id === 'plan-complete' ? 'plan' : 'project') : null;
  if (finish) $('story-body').textContent += ` ${finish.text}`;
  $('story-next').textContent = `Next: ${popup.next}`;
  $('story-continue').textContent = popup.button;
  $('story-dialog').showModal();
  presentPlayerCopy($('story-dialog'));
}

function button(label, action, detail = '', kind = '') {
  const work = ['work-packet','work-c2','work-c3','work-c4','career-work'].includes(action);
  return `<button class="choice ${kind}" type="button" data-action="${action}"${work ? ` aria-labelledby="label-${action}"${detail?` aria-describedby="detail-${action}"`:''}` : ''}><span class="choice-title"${work ? ` id="label-${action}"` : ''}>${label}</span>${detail ? `<span class="choice-detail"${work?` id="detail-${action}"`:''}>${detail}</span>` : ''}<span class="choice-arrow" aria-hidden="true">→</span></button>`;
}

function setText(element, value) {
  value = playerText(value);
  if (element.textContent !== value) element.textContent = value;
}

function renderChoices() {
  const html = choices();
  if (html === renderedChoices) return;
  renderedChoices = html;
  const template = document.createElement('template');
  template.innerHTML = html;
  const selector = 'button[aria-labelledby]';
  const current = $('choices').querySelector(selector);
  const next = template.content.querySelector(selector);
  if (!current || !next || current.dataset.action !== next.dataset.action) {
    $('choices').replaceChildren(template.content);
    return;
  }
  // Keep the focused work control attached. Recreating/refocusing it on every press
  // can speak its changing number even when no live region requests an update.
  setText(current.querySelector('.choice-title'), next.querySelector('.choice-title').textContent);
  setText(current.querySelector('.choice-detail'), next.querySelector('.choice-detail').textContent);
  for (const child of [...$('choices').childNodes]) if (child !== current) child.remove();
  let afterWork = false;
  for (const child of [...template.content.childNodes]) {
    if (child === next) { afterWork = true; continue; }
    if (afterWork) $('choices').append(child);
    else $('choices').insertBefore(child, current);
  }
}

function routineBadge(active = true) {
  return `<div class="upgrade-badge"><strong class="upgrade-value">${active ? '2×' : '+1'}</strong><div><strong>Organized notes${active ? '' : ' · gathered'}</strong><span>${active ? state.hasSwitched ? 'Double work while gathering notes · existing notes stay useful' : 'Double work while gathering notes · 25 presses instead of 30' : state.hasSwitched ? 'Notes reused · remaining work advances +1 per press' : 'Prep: 5 presses instead of 10 · remaining work advances +1 per press'}</span></div></div>`;
}

function currentWorkBeat(kind) {
  const beats = WORK_BEATS[kind];
  if (!beats) return null;
  const work = kind === 'packet' ? state.packetWork : state.work;
  const index = beats.findIndex(beat => work < beat.end);
  return index < 0 ? null : { ...beats[index], step: index + 1, total: beats.length };
}

function choices() {
  if (isCareerStage(state.stage)) return careerChoices(state,button);
  if (state.stage==='c5_opening') return button('Begin doctoral formation','start-career','Continue the career through Chapters 5–12. Your completed master’s work stays recorded.','primary');
  if (isMastersStage(state.stage)) return mastersChoices(state,button);
  if (isResearchStage(state.stage)) return researchChoices(state,button);
  switch (state.stage) {
    case 'c1_start': if (state.scopeVersion === 1) return button('Compare two options','scope-focused','Two websites · 1 Energy for each check.') + button('Research a third college too','scope-wide','Three websites · 1 Energy now for broader planning, then 1 per website.');
    case 'c1_start': return button('Compare two options','scope-focused',state.packetBudgetVersion === 1 ? 'Two paths · conserve Energy for the packet.' : 'Start with two nearby paths.') + button('Note a third option too','scope-wide',state.packetBudgetVersion === 1 ? 'A third option · costs 3 extra Energy when the packet starts; it can leave you exhausted.' : 'Check two main paths and keep one more in view.');
    case 'c1_trace': return button('Check a college or training website','trace',`Website ${state.marks + 1} of ${websiteGoal(state)} · +2 Progress · −1 Energy`,'primary');
    case 'c1_invest': return button('Learn this skill','invest','Spend 3 Progress. Spot missing application details sooner.','primary');
    case 'c1_opening': return `${state.support ? '<p class="support-note">Jordan helped you check a route. Energy +1. Workshop eligibility stays the same.</p>' : button('Ask Jordan for help','support','Optional · gain 1 Energy. Jordan cannot change workshop eligibility.')} ${button('Start the workshop packet','prepare',state.packetBudgetVersion === 2 ? '20 inputs · 3 Energy total: 1 now, 1 for the question, 1 for final assembly. 4 before preparation; Spot missing details saves 1 Energy, already included.' : state.packetBudgetVersion === 1 && state.scope === 'wide' ? '20 inputs · 5 Energy total: 3 now +2 at milestones. Your skill’s 1-Energy saving is already included. Work at zero loses polish.' : '20 work presses · 2 Energy total, including the 1 Energy saved by your new skill.','primary')}`;
    case 'c1_prep': return state.packet ? button('Check the workshop notice','advance-c1','Your packet is ready. Stop before choosing a response.','primary') : button('Work on the packet','work-packet',packetWorkDetail(),'primary');
    case 'c1_review': if (state.scopeVersion === 1) return button('Use the packet for university','recover-packet','Reuse saved work · no Energy · save 1 on study planning.','primary') + button('Check what is still open','recover-routes',responsePrice(1,'Keep current public-route answers.'));
    case 'c1_review': return button('Use the packet for university','recover-packet',state.qualityVersion === 1 ? 'Keep prepared work · rest restores up to 1 Energy.' : 'Keep more of your prepared work.','primary') + button('Check what is still open','recover-routes',state.qualityVersion === 1 ? 'Check open routes · rest restores up to 1 Energy.' : 'Learn more about the available routes.');
    case 'c1_boundary': return button('Start at Cedar Vale','enter-c2',`Rest, then start with ${ENERGY_BUDGET.chapters[2]} Energy. Chapter Progress resets to 0; unused Progress does not carry over. Your skills and finished work remain.`,'primary');
    case 'c2_plan': return `${state.samiraSupport ? '<p class="support-note">Samira helped during paid hours. The department still controls class times.</p>' : button('Ask Samira','ask-samira','Optional · no Energy cost. Find the full schedule.')} ${button(STUDY_CHOICES.protected.label,'week-protected',studyDetail('protected'),'primary')}${button(STUDY_CHOICES.distributed.label,'week-distributed',studyDetail('distributed'))}`;
    case 'c2_work': return button('Work on the weekly plan','work-c2',workDetail('week'),'primary') + (can(state, 'intervene') ? button('Check the full class schedule','intervene',checkDetail()) : '');
    case 'c2_review': if (state.responseVersion === 1) return button('Rebuild my week','review-rebuild',responsePrice(2,'Another section · saves 1 on your next project.'),'primary') + button('Ask the department about times','review-question',responsePrice(1,'Confirm current times and another section.'));
    case 'c2_review': return button('Rebuild my week','review-rebuild','Use another section · regain up to 1 Energy · save 1 later.','primary') + button('Ask the department about times','review-question',state.qualityVersion === 1 ? 'Get current times · rest restores up to 1 Energy.' : 'Get the current list of discussion sections.');
    case 'c2_choose': {
      const presses = state.notesRoutine ? PREPARATION_UPGRADE.workEnd / PREPARATION_UPGRADE.workPerPress + WORK_GOALS.project - PREPARATION_UPGRADE.workEnd : WORK_GOALS.project;
      return (state.notesRoutine ? routineBadge() : '') + button('Write an extra-credit paper','form-extra',`${presses} work presses · instructor review.`,'primary') + button('Attend the interest session','form-session',`${presses} work presses · session and note.`);
    }
    case 'c2_aim': return button(PROJECT_AIMS.route.label,'aim-route',planningDetail('aim','route',PROJECT_AIMS.route.detail),'primary') + button(PROJECT_AIMS.place.label,'aim-place',planningDetail('aim','place',PROJECT_AIMS.place.detail));
    case 'c2_contribute': {
      const changing = can(state, 'review-switch');
      const check = can(state, 'intervene') ? button(state.checkTimingVersion === 1 ? PROJECT_CHECK_COPY.label : changing ? 'Check once' : 'Check my work once','intervene',checkDetail(),state.capacity === 1 && state.qualityVersion === 1 ? 'check-spends-last' : '') : '';
      const change = changing ? button('Change project','review-switch','Reuse notes') : '';
      const timing = state.checkTimingVersion === 1 && !state.intervention ? state.work < PROJECT_CHECK.workAt ? ` ${PROJECT_CHECK_COPY.upcoming}` : state.work === PROJECT_CHECK.workAt ? ` ${state.capacity > 0 ? PROJECT_CHECK_COPY.continue : PROJECT_CHECK_COPY.unavailable}` : '' : '';
      return (state.notesRoutine && ['extra','session'].includes(state.form) ? routineBadge(state.work < PREPARATION_UPGRADE.workEnd) : '') + button(FORMS[state.form].workSteps?.[Math.floor(state.work / 10)] || FORMS[state.form].workButton,'work-c2',`${workDetail('aim')}${timing}`,'primary') + (change ? `<div class="project-tools">${check}${change}</div>` : check);
    }
    case 'c2_switch': {
      const plan = switchPlan(state);
      return button(state.form === 'extra' ? 'Use these notes for the session' : 'Use these notes for the paper','confirm-switch',`Start at work ${plan.work}/${WORK_GOALS.project} · ${plan.presses} presses left.`,'primary') + button('Keep my current project','cancel-switch','Keep working where you left off.');
    }
    case 'c2_feedback': return button('Record the finished work','consolidate-c2','Gain Standing from recognized work and see the next public step.','primary');
    case 'c2_done': return button('Begin undergraduate research','enter-c3','Rest, then start Chapter 3 with 10 Energy. Keep your recognized work.','primary');
  }
}

function packetWorkDetail() {
  if (state.packetBudgetVersion !== 2) return `Work ${state.packetWork}/${WORK_GOALS.packet} · each press adds to it.`;
  const step = PACKET_ENERGY_STEPS.find(step => state.packetWork < step.at);
  return `Work ${state.packetWork}/${WORK_GOALS.packet} · ${step.label} at ${step.at}/${WORK_GOALS.packet} (${state.capacity > 0 ? '−1 Energy' : 'work counts at zero'}).`;
}
function checkDetail() {
  const remaining = state.capacity - 1;
  const pending = pendingWorkEnergy(state);
  return `+1 Progress · −1 Energy · ${remaining}/${energyLimit(state)} left.${remaining === 0 && state.qualityVersion === 1 ? ` ${CHECK_ENERGY_WARNING}` : pending ? ` ${pending} Energy still due.` : ''}`;
}
function workDetail(kind) {
  const task = kind === 'week' ? 'plan' : 'project';
  const goal = WORK_GOALS[task];
  const base = kind === 'aim' && state.notesRoutine ? `Work ${state.work}/${goal}.` : `Work ${state.work}/${goal} · +${workPerPress(state)}/press.`;
  if (state[`${task}EnergyVersion`] !== 1) return `Work ${state.work}/${goal} · +${workPerPress(state)} work per press.`;
  let planned = 0;
  const step = energySchedule(state,kind,kind === 'week' ? state.week : state.projectAim).find(step => {
    planned += step.cost;
    return step.at > state.work && planned > state[`${task}EnergySettled`];
  });
  if (!step) return `${base} No further Energy cost.`;
  return `${base} ${state.capacity > 0 ? `−${step.cost} Energy` : 'Work counts at zero'} at ${step.at}/${goal}.`;
}
function responsePrice(cost,detail) { return `${state.capacity < cost ? `${cost} Energy planned; spend ${state.capacity}.` : `−${cost} Energy now.`} ${detail}`; }
function studyDetail(approach) { return `${planningDetail('week', approach, '')} +${STUDY_PACE[approach]}/press · ${Math.ceil(WORK_GOALS.plan / STUDY_PACE[approach])} presses.`; }
function planningDetail(kind, approach, detail) {
  if (state.planningVersion < 1) return detail;
  const cost = planningCost(state, kind, approach);
  const goal = kind === 'week' ? WORK_GOALS.plan : WORK_GOALS.project;
  const price = `${cost} Energy total: ${energySchedule(state,kind,approach).map(step=>`${step.cost} ${step.at === 0 ? 'now' : `at ${step.at}/${goal}`}`).join(', ')}.`;
  const saved = kind === 'week' ? state.recovery === 'packet' : state.review2 === 'rebuild';
  const warning = state.qualityVersion === 1 && state.capacity <= cost ? ' Work at zero loses polish.' : '';
  return `${price}${warning}${saved ? ` ${cost+1} before preparation; ${kind==='week'?'reusing your packet':'rebuilding your week'} saves 1 Energy, already included in this total.` : ''}${kind === 'week' ? '' : ` ${detail}`}`;
}

function draftLines(rows) {
  return rows ? `<dl class="draft-lines">${rows.map(row => `<div><dt>${escapeHtml(row.label)}</dt><dd>${escapeHtml(row.text)}</dd></div>`).join('')}</dl>` : '';
}

function artifact() {
  if (isCareerStage(state.stage)) return careerArtifact(state);
  if (isMastersStage(state.stage)) return mastersArtifact(state);
  if (isResearchStage(state.stage)) return researchArtifact(state);
  if (state.stage === 'c2_switch') {
    const plan = switchPlan(state);
    return `<div class="artifact-paper"><span class="paper-kicker">BEFORE YOU CHANGE PROJECTS</span><strong>${FORMS[state.form].title} → ${FORMS[plan.form].title}</strong><p>${plan.shared}/${PROJECT_REUSE.sharedNotesEnd} source-note units carry over. ${plan.work > plan.shared ? `Your saved work brings the returning project to ${plan.work}/${WORK_GOALS.project}.` : `The new project starts at work ${plan.work}/${WORK_GOALS.project}; later work still needs doing.`} Your current ${state.work}/${WORK_GOALS.project} work stays saved if you return.</p><p>Energy and earned Progress stay. Repeated milestones earn no extra Progress. ${plan.checked ? 'This project’s earlier check stays done.' : 'This project has its own optional check.'} Your aim stays the same.</p></div>`;
  }
  if (state.stage === 'c1_prep') {
    const part = currentWorkBeat('packet')?.detail || 'Packet ready: your list, question, and sources are together.';
    return `<div class="artifact-paper packet"><span class="paper-kicker">WORKSHOP PACKET</span><strong>${part}</strong>${draftLines(workDocument(state, 'packet'))}<progress class="work-progress" max="${WORK_GOALS.packet}" value="${state.packetWork}" aria-label="Workshop packet work"></progress><span class="paper-progress">Work ${state.packetWork}/${WORK_GOALS.packet}</span></div>`;
  }
  if (state.stage === 'c1_review') return `<div class="review-slip"><span class="slip-label">WORKSHOP NOTICE</span><strong>Only partner schools can nominate</strong><span>Hillside is not on the list. ${packetReview(state) || 'Your packet is still yours to use.'}</span></div>`;
  if (state.stage === 'c2_review') return `<div class="review-slip"><span class="slip-label">SCHEDULE UPDATE</span><strong>Discussion overlaps your paid shift</strong><span>The main planner showed the lecture, but not this required hour. Another section is open. ${state.prechecked ? 'Your earlier check found the department timetable.' : 'The department can confirm the current times.'} Your work is saved.</span></div>`;
  if (['c2_choose','c2_aim','c2_contribute','c2_feedback','c2_done'].includes(state.stage)) {
    if (state.stage === 'c2_choose') return `<div class="artifact-paper two-form"><span class="paper-kicker">WHAT YOU KNOW BEFORE YOU CHOOSE</span><p>${testing ? 'Testing tools: projects can be changed.' : 'Choose one project to finish. Your choice is final.'}</p><div class="form-comparison"><span>Extra-credit paper<br><small>Instructor review · class idea and public pages.</small></span><span>Interest session<br><small>Facilitator review · questions and follow-up note.</small></span></div><p>Attendance alone earns no Standing. ${state.review2 === 'rebuild' ? 'Your new study block saves 1 Energy on this task.' : 'You have the department’s current schedule.'} ${state.notesRoutine ? NOTES_ROUTINE.earned : ''}</p></div>`;
    const form = FORMS[state.form];
    const feedback = projectFeedback(state);
    const beat = state.stage === 'c2_contribute' ? currentWorkBeat(state.form) : null;
    let formText = feedback ? state.stage === 'c2_done' ? feedback.result : `${feedback.review} ${feedback.retained}` : state.stage === 'c2_aim' ? `${form.short} ${state.form === 'session' ? 'No project places are available now. The session offers public information and contacts.' : 'The pages explain public routes; only a project owner can confirm a place.'} ${state.planningVersion >= 1 ? 'Keep 1 Energy for an optional check; required work still counts at zero.' : 'An extra check can help narrow a bigger claim.'}` : state.stage === 'c2_done' ? (form.ending || (state.sourceChecked ? form.reviewChecked : form.review)) : state.stage === 'c2_feedback' ? (state.sourceChecked ? form.reviewChecked : form.review) : beat?.detail || form.body;
    if (!feedback && ['c2_feedback','c2_done'].includes(state.stage)) {
      const review = reviewQuality(state);
      if (review) formText += ` ${review.text} ${review.acceptance}`;
    }
    const document = state.stage === 'c2_contribute' ? workDocument(state, state.form) : null;
    return `<div class="artifact-paper ${state.form}"><span class="paper-kicker">${state.stage === 'c2_done' ? 'FINISHED WORK · RECOGNIZED' : state.stage === 'c2_feedback' ? `REVIEWED · ${feedback?.label.toUpperCase() || 'CREDIT COMES NEXT'}` : beat ? `YOUR PROJECT · STEP ${beat.step} OF ${beat.total}` : 'YOUR PROJECT'}</span><strong>${form.title}</strong><small>${form.subtitle}</small>${document ? draftLines(document) : `<p>${formText}</p>`}${state.stage === 'c2_contribute' ? `<div class="work-meter"><progress class="work-progress" max="${WORK_GOALS.project}" value="${state.work}" aria-label="Project work"></progress><span class="paper-progress">Work ${state.work}/${WORK_GOALS.project}${state.intervention ? ' · extra check done' : ''}</span></div>` : ''}</div>`;
  }
  if (state.stage === 'c2_work') {
    const beat = currentWorkBeat('plan');
    return `<div class="artifact-paper planner"><span class="paper-kicker">YOUR WEEK · STEP ${beat.step} OF ${beat.total}</span><strong>${state.week === 'protected' ? 'One long study block' : 'Several short study blocks'}</strong>${draftLines(workDocument(state, 'plan'))}<progress class="work-progress" max="${WORK_GOALS.plan}" value="${state.work}" aria-label="Weekly plan work"></progress><span class="paper-progress">Work ${state.work}/${WORK_GOALS.plan}</span></div>`;
  }
  if (state.stage === 'c1_boundary') return `<div class="artifact-paper"><span class="paper-kicker">STATE UNIVERSITY PLAN</span><strong>${state.recovery === 'packet' ? 'Packet ready to reuse' : 'Open routes checked'}</strong><p>Cedar Vale is open either way. Your choice changes what helps you next.</p></div>`;
  const opening = openingDocument(state);
  if (opening) return `<div class="artifact-paper"><span class="paper-kicker">${escapeHtml(opening.kicker)}</span><strong>${escapeHtml(opening.title)}</strong>${draftLines(opening.rows)}<p class="student-voice">${escapeHtml(opening.voice)}</p></div>`;
  if (state.stage === 'c2_done') return '';
  return `<div class="artifact-paper"><span class="paper-kicker">YOUR ENTRY STEPS AND QUESTIONS</span><strong>${state.stage === 'c1_start' ? 'What do the websites say?' : `${state.marks}/${websiteGoal(state)} websites checked`}</strong><div class="paper-lines" aria-hidden="true"><i></i><i></i><i></i></div><p>${state.capability1 ? 'Workshop question: can Hillside nominate students?' : 'Keep published application details beside the questions you still need to ask.'}</p></div>`;
}

function spokenWorkCue() {
  if (isCareerStage(state.stage)) return careerCue(state);
  if (isMastersStage(state.stage)) return mastersCue(state);
  if (isResearchStage(state.stage)) return researchCue(state);
  const kind = state.stage === 'c1_prep' && !state.packet ? 'packet' : state.stage === 'c2_work' ? 'plan' : state.stage === 'c2_contribute' ? state.form : '';
  if (!kind) return null;
  const beat = currentWorkBeat(kind);
  const label = kind === 'packet' ? 'Workshop packet' : kind === 'plan' ? 'Weekly plan' : FORMS[kind].title;
  const work = kind === 'packet' ? state.packetWork : state.work;
  const goal = kind === 'packet' ? WORK_GOALS.packet : kind === 'plan' ? WORK_GOALS.plan : WORK_GOALS.project;
  const preparation = state.notesRoutine && beat?.step === 2 && ['extra','session'].includes(kind) ? state.hasSwitched ? 'Your gathered notes stay useful; remaining work adds one per press.' : 'Organized notes: preparation takes five presses instead of ten; remaining work adds one per press.' : '';
  return { key: `${kind}:${beat?.step ?? Math.floor(work / 10)}`, text: `${label}${beat ? `, step ${beat.step} of ${beat.total}. ${beat.detail}` : '.'} ${preparation}`.trim(), count: `Work ${work} of ${goal}.` };
}

function updateSpokenStatus(action, cfg) {
  const cue = spokenWorkCue();
  const previous = previousSpokenState;
  const quality = workQuality(state);
  previousSpokenState = { stage: state.stage, cue: cue?.key, capacity: state.capacity, qualityBand: quality?.band };
  // Focused native dialogs provide their own name/description. No result is also
  // requested from the background status region while a modal is open.
  if ($('story-dialog').open || $('restart-dialog').open) { setText($('announcement'), ''); return; }
  const resources = `Progress ${state.progress}. Energy ${state.capacity} of ${energyLimit(state)}.${state.capacity === 0 ? ' Work still counts at zero Energy.' : ''}`;
  let message = '';
  if (action === 'undo') message = `${state.summary} ${cue?.count || cfg.title} ${resources}`;
  else if (!previous || (action && previous.stage !== state.stage)) message = `${cfg.phase}. ${cfg.title}. ${state.summary} ${cue ? `${cue.text} ${cue.count} ${resources}` : ''}`;
  else if (!action) return; // Resize/reflow must not replay spoken progress.
  else if (quality && previous.qualityBand !== quality.band) message = `Work quality: ${quality.band.toLowerCase()}. ${quality.finished ? quality.detail : 'Further work at zero reduces polish; you can still finish.'} ${cue?.count || ''}`;
  else if (cue && previous.cue !== cue.key) message = `${cue.text} ${cue.count} ${resources}`;
  else if (previous.capacity > 0 && state.capacity === 0) message = state.qualityVersion === 1 ? QUALITY_WARNING : `${state.summary} Work still counts at zero Energy.`;
  else if (!['work-packet','work-c2','work-c3','work-c4','career-work'].includes(action)) message = state.summary;
  if (message) setText($('announcement'), message.trim());
}

function render(action = '') {
  if (typeof action !== 'string') action = '';
  const stageChanged=$('work-panel').dataset.stage!==state.stage;
  const cfg = isCareerStage(state.stage) ? careerConfig(state) : isMastersStage(state.stage) ? mastersConfig(state) : isResearchStage(state.stage) ? researchConfig(state) : STAGES[state.stage];
  $('main').classList.toggle('career-active',isCareerStage(state.stage));
  $('work-panel').dataset.stage = state.stage;
  // Long source/authority notes stay keyboard-scrollable on a compact desk.
  if (isResearchStage(state.stage) || isMastersStage(state.stage) || isCareerStage(state.stage)) { $('work-panel').tabIndex=0; $('work-panel').setAttribute('aria-label','Current work and source terms'); }
  else { $('work-panel').removeAttribute('tabindex'); $('work-panel').removeAttribute('aria-label'); }
  $('desk-workspace').dataset.stage = state.stage;
  $('main').dataset.chapter = cfg.chapter;
  $('chapter-title').textContent = CAREER_CHAPTERS[cfg.chapter]?.title || {1:'First Openings',2:'Finding Your Footing',3:'Entering Inquiry',4:'Independent Design'}[cfg.chapter];
  $('chapter-tag').textContent = `Chapter ${cfg.chapter} of 12`;
  const portrait = CHAPTER_PORTRAITS[cfg.chapter];
  $('scene-image').src = state.capacity === 0 ? portrait.depleted : portrait.normal;
  $('scene-image').alt = cfg.chapter >= 3 ? state.capacity===0 ? portrait.depletedAlt : portrait.normalAlt : cfg.chapter === 1 ? 'A student compares public program information outside a high school.' : 'A young woman with curly hair writes beside her laptop and yellow checklist pad in the sunlit university commons.';
  if (state.capacity === 0 && cfg.chapter<3) $('scene-image').alt += ' The student looks tired after spending their Energy.';
  $('scene-caption').textContent = cfg.caption;
  $('scene-note').textContent = cfg.note;
  $('phase-name').textContent = cfg.phase;
  $('step-label').textContent = cfg.label;
  $('work-title').textContent = cfg.title;
  $('work-description').textContent = state.stage === 'c1_prep' && state.packet ? 'Your list, question, and sources are together. Nomination eligibility still needs confirmation. Check the notice when you are ready.' : cfg.description;
  if (state.stage === 'c1_trace') { $('work-title').textContent = `Check ${websiteGoal(state) === 3 ? 'three' : 'two'} college or training websites`; $('work-description').textContent = `Read each program page. Keep its entry requirements and one unanswered question; ${state.marks}/${websiteGoal(state)} checked.`; }
  if (state.qualityVersion === 1 && state.stage === 'c1_opening') $('work-description').textContent = QUALITY_OPENING;
  const finish = ['c2_feedback','c2_done'].includes(state.stage) ? finishStory(state) : null;
  if (finish) $('work-description').textContent = finish.text;
  if (state.stage === 'c2_work') $('work-description').textContent = state.studyPaceVersion === 1 && currentWorkBeat('plan').step === 1 ? STUDY_CHOICES[state.week].workStory : currentWorkBeat('plan').detail;
  if (state.stage === 'c2_contribute' && state.feedbackVersion === 1) $('work-description').textContent = (state.projectAim === 'route' ? 'Your aim: explain one public next step.' : state.intervention ? 'Your wider aim is now narrowed to a public route.' : 'Your aim: explore getting a project place.') + (state.hasSwitched ? ' Shared notes reused.' : '');
  $('artifact').innerHTML = artifact() + (state.stage==='c3_intro'?directionGuide():'');
  renderQuality();
  renderChoices();
  if(stageChanged){$('work-panel').scrollTop=0;$('action-zone').scrollTop=0;}
  const actionCount = $('choices').querySelectorAll('button[data-action]').length;
  $('action-zone').classList.toggle('is-work', Boolean(workAction()));
  $('action-zone').classList.toggle('is-complete', actionCount === 0);
  $('action-zone-label').textContent = actionCount ? 'Ready now' : 'Career complete';
  $('action-hint').textContent = workAction() ? isCareerStage(state.stage)?'Advance to the next part of the artifact; decisions always stop the work.':'Click this box to work, or press the work button.' : actionCount === 0 ? 'Your ending and career record are saved.' : actionCount === 1 ? 'Press the button below to continue.' : 'Choose one of the buttons below.';
  const choicesNearTop = isCareerStage(state.stage) ? careerNode(state)?.kind!=='work' : (state.stage === 'c1_prep' && state.packet) || ['c2_review','c2_feedback','c3_skill','c3_credit','c3_review','c3_return','c4_lesson','c4_review','c4_defend'].includes(state.stage);
  $('action-zone').classList.toggle('near-top', choicesNearTop);
  if (desktopLayout.matches) $('main').prepend($('action-note'));
  else $('desk-workspace').append($('action-note'));
  // The earned-routine explanation is already in the artifact and upgrade badge.
  $('action-note').textContent = state.stage === 'c2_choose' && state.notesRoutine ? state.summary.split(' You also keep source links and open questions together.')[0] : state.summary;
  $('main').classList.toggle('has-update', Boolean($('action-note').textContent));
  $('progress-value').textContent = `${state.progress}`;
  $('capacity-value').textContent = `${state.capacity}/${energyLimit(state)}`;
  $('energy-detail').textContent = state.qualityVersion === 1 || state.research ? 'Work still counts at zero; exhausted work loses polish.' : 'This saved task keeps its earlier rules. Work still counts at zero.';
  $('progress-detail').textContent = state.stage === 'c1_prep' ? `Packet work ${state.packetWork}/${WORK_GOALS.packet} · press to continue` : state.stage === 'c2_work' || state.stage === 'c2_contribute' ? `Main work ${state.work}/${state.stage === 'c2_work' ? WORK_GOALS.plan : WORK_GOALS.project} · press to continue` : cfg.chapter === 1 ? 'Work finished so far. You can spend some on a skill.' : 'Work finished this chapter. Standing comes from recognized work.';
  if (isResearchStage(state.stage) && researchWork(state)) $('progress-detail').textContent=`${researchQuality(state).noun} · ${researchCue(state)?.count || 'finished work recorded'}`;
  if (isMastersStage(state.stage) && mastersWork(state)) $('progress-detail').textContent=`${mastersQuality(state).noun} · ${mastersCue(state)?.count || 'finished work recorded'}`;
  if (isCareerStage(state.stage) && careerWork(state)) $('progress-detail').textContent=`${careerWork(state).title} · ${careerCue(state)?.count || 'finished work recorded'}`;
  $('progress-fill').style.width = `${Math.min(100, state.progress / 15 * 100)}%`;
  $('capacity-fill').style.width = `${state.capacity / energyLimit(state) * 100}%`;
  $('record-count').textContent = `${state.record.length} saved`;
  const standing = state.career ? `Standing ${state.standing} · recognized contributions and formal career milestones` : state.graduate?.bridge.defended_bounded_masters_contribution ? `Standing ${state.standing} · prior contributions and Cedar Vale master’s committee recognition` : state.research?.credited ? `Standing ${state.standing} · Chapter 2 work and Dr. Shah’s research credit` : state.standing ? `Standing 1 · ${FORMS[state.form].creditSource} recognized your work` : 'Standing 0 · no work recognized yet';
  $('standing-status').innerHTML = `<span class="standing-full">${escapeHtml(standing)}</span><span class="standing-short">Standing ${state.standing} · ${state.standing ? 'credited' : 'uncredited'}</span>`;
  const recordItems=state.career?[...state.record].reverse():state.record;
  $('career-record').innerHTML = recordItems.length ? recordItems.map(item => {
    const raw = RECORD_WORDING[item] || item;
    const wording=state.career?raw.replace(/^C\d{2}-[A-Z]+-\d{2}(?:-V\d{2})? · /,''):raw;
    const milestone=recordMilestone(item);
    if(milestone){
      const detail=raw.replace(/^C\d{2}-[A-Z]+-\d{2} · /,'').split(' · ').slice(1).join(' · ');
      return `<li class="record-milestone" title="${escapeHtml(wording)}" aria-label="${escapeHtml(`Milestone: ${wording}`)}"><span class="record-milestone-label"><span aria-hidden="true">✦</span> Milestone</span><strong>${escapeHtml(milestone)}</strong>${detail?`<span class="record-milestone-detail">${escapeHtml(detail)}</span>`:''}</li>`;
    }
    return `<li title="${escapeHtml(wording)}" aria-label="${escapeHtml(wording)}"><span class="record-check" aria-hidden="true">✓</span>${escapeHtml(desktopLayout.matches ? RECORD_LABELS[item] || wording : wording)}</li>`;
  }).join('') : '<li class="empty-record">Finished work will appear here.</li>';
  $('undo').disabled = !canUndo(state);
  $('undo').title = canUndo(state) ? testing ? 'Undo the last action' : 'Undo the last work press' : testing ? 'You can use Back after your next action' : 'Back undoes work presses. Choices are final.';
  setText($('save-status'), notice || 'Saved in this browser');
  showPendingPopup();
  updateSpokenStatus(action, cfg);
  presentPlayerCopy($('main'));
}

function renderQuality() {
  const quality = workQuality(state);
  const panel = $('quality-panel'); panel.hidden = !quality;
  // Keep the quality of the draft beside its work on a narrow screen.
  if (desktopLayout.matches) document.querySelector('.metrics').append(panel);
  else $('work-panel').append(panel);
  if (!quality) return;
  panel.dataset.band = quality.band.toLowerCase();
  $('quality-value').textContent = `${quality.band} · ${quality.value}/100`;
  $('quality-meter').value = quality.value;
  $('quality-meter').setAttribute('aria-label', `${quality.noun} work quality: ${quality.band.toLowerCase()}`);
  $('quality-detail-full').textContent = quality.finished ? quality.detail : state.capacity === 0 ? 'Out of Energy · further work loses polish. You can still finish.' : quality.exhausted ? 'Energy recovered; further decline stops. Earlier rushed work remains.' : 'Careful work so far. Only further work at zero loses polish.';
  const compactFinish = quality.band === 'Rushed'
    ? {packet:'Rushed question; useful comparisons.',plan:'Rushed notes; fixed times saved.',extra:'Rushed conclusion; useful argument.',session:'Rushed follow-up; useful questions.'}
    : {packet:'Useful comparisons; reread the question.',plan:'Fixed times saved; reorder the notes.',extra:'Useful argument; reread the conclusion.',session:'Useful questions; reorder follow-up.'};
  $('quality-detail-short').textContent = quality.finished ? quality.band === 'Careful' ? 'Careful finish; saved.' : compactFinish[quality.task] || 'Less polished finish; evidence limits remain usable.' : state.capacity === 0 ? 'Out of Energy · work loses polish.' : quality.exhausted ? 'Further decline stops; rushed work stays.' : 'Work at zero loses polish.';
}

function escapeHtml(s) { return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function persist(action = '') { const saved = saveState(state); notice = saved ? notice : 'Could not save in this browser'; render(action); }

function takeAction(action, keyboard = false) {
  const ordinaryWork = ['trace','work-packet','work-c2','work-c3','work-c4','career-work'].includes(action);
  if (!keyboard && !ordinaryWork && performance.now() < nextDecisionPointerAfter) return;
  if ($('story-dialog').open || $('restart-dialog').open || !can(state, action)) return;
  const previousStage = state.stage;
  notice = '';
  act(state, action); persist(action);
  animateTyping(action);
  if (!desktopLayout.matches && previousStage !== state.stage && !workAction()) {
    // Reject the tail of a rapid work-click burst on a newly displayed decision.
    // Keyboard activation remains immediate; work presses never have a timer.
    nextDecisionPointerAfter = performance.now() + 450;
    if (!$('story-dialog').open) {
      $('work-title').focus({preventScroll:true});
      $('work-title').scrollIntoView({block:'start',behavior:'instant'});
    }
  }
  if (keyboard && !$('story-dialog').open) {
    const repeatButton = document.querySelector(`[data-action="${action}"]`);
    const target = repeatButton || $('work-title');
    if (document.activeElement !== target) target.focus({ preventScroll: true });
  }
}

$('choices').addEventListener('click', event => {
  if(event.target.closest('#export-career')){
    if(event.detail>0 && performance.now()<nextDecisionPointerAfter)return;
    const blob=new Blob([careerRecordText(state)],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),link=document.createElement('a');
    link.href=url;link.download='living-record-career.txt';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);return;
  }
  const target = event.target.closest('button[data-action]');
  if (!target) return;
  event.stopPropagation();
  takeAction(target.dataset.action, event.detail === 0);
});

$('action-zone').addEventListener('click', event => {
  // Buttons own decisions and optional checks; only ordinary work has a box shortcut.
  if (event.target.closest('button')) return;
  const action = workAction();
  if (action) takeAction(action);
});

$('undo').addEventListener('click', event => {
  if (!undoAction(state)) return;
  notice = 'Last action undone · saved';
  persist('undo');
  if (event.detail === 0 && !$('story-dialog').open) $('work-title').focus({ preventScroll: true });
});

$('story-continue').addEventListener('click', () => $('story-dialog').close());
for (const dialog of [$('story-dialog'), $('restart-dialog')]) dialog.addEventListener('keydown', event => {
  // Holding the work key must not also dismiss a newly focused popup.
  if (event.repeat && ['Enter', ' '].includes(event.key)) event.preventDefault();
});
$('story-dialog').addEventListener('close', () => {
  const closedId = activePopupId;
  if (activePopupId && !state.seenPopups.includes(activePopupId)) {
    state.seenPopups.push(activePopupId);
    if (activePopupId.startsWith('energy-exhausted-c')) acknowledgeExhaustion(state);
    if (!saveState(state)) setText($('save-status'), 'Could not save in this browser');
  }
  activePopupId = '';
  showPendingPopup();
  if (!$('story-dialog').open && !$('restart-dialog').open) {
    $('work-title').focus({ preventScroll: true });
    // A narrow page can shrink after work and put its next decision under the
    // former tap. Show the completed result from its heading before continuing.
    if (!desktopLayout.matches && ['packet-complete','plan-complete','project-complete','research-credit','research-challenge','research-returned'].includes(closedId)) $('work-title').scrollIntoView({ block: 'start', behavior: 'instant' });
  }
});

$('restart').addEventListener('click', () => {
  setText($('announcement'), '');
  $('restart-dialog').showModal();
});

$('restart-cancel').addEventListener('click', () => $('restart-dialog').close());
$('restart-confirm').addEventListener('click', () => {
  clearState(); state = initialState(); notice = '';
  $('restart-dialog').close();
  persist('restart');
});

document.addEventListener('visibilitychange', () => { if (document.hidden) saveState(state); });
desktopLayout.addEventListener('change', render);
render();
