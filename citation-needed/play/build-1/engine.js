import { ENERGY_BUDGET, PREPARATION_UPGRADE, STUDY_PACE, PROJECT_REUSE, PROJECT_CHECK, WORK_QUALITY, CAUSE_ENERGY } from './balance.js?v=20261013r2';
import { emptyQualityWork, recordQualityWork, workQuality, QUALITY_WARNING } from './quality.js?v=20261013r2';
import { planningCost, energySchedule, plannedEnergyThrough, finishStory } from './planning.js?v=20261013r2';
import { PROJECT_FEEDBACK } from './feedback.js?v=20261013r2';
import { WORK_ENERGY_LABELS } from './content.js?v=20261013r2';
import {isResearchStage, researchCan, researchAct, cleanResearchState, researchWorkPerPress} from './research.js?v=20261013r2';
import {isMastersStage, mastersCan, mastersAct, cleanMastersState, mastersWorkPerPress} from './masters.js?v=20261013r2';
import {MASTERS_BALANCE} from './chapter4-balance.js?v=20261013r2';
import {isCareerStage,careerCan,careerAct,cleanCareerState} from './career.js?v=20261013r2';
import {CAREER_ENERGY} from './career-balance.js?v=20261013r2';

const KEY = 'living-record-opening-v1';
const VALID_STAGES = new Set(['c1_start','c1_trace','c1_invest','c1_opening','c1_prep','c1_review','c1_boundary','c2_plan','c2_work','c2_review','c2_choose','c2_aim','c2_contribute','c2_switch','c2_feedback','c2_done']);
const VALID_POPUPS = new Set(['chapter1-intro','chapter1-instructions','pages-complete','packet-complete','workshop-closure','chapter2-intro','plan-complete','project-complete','chapter2-result','energy-exhausted','energy-exhausted-c1','energy-exhausted-c2','chapter3-intro','research-credit','research-challenge','research-returned','energy-exhausted-c3','chapter4-intro','masters-challenge','masters-defended','energy-exhausted-c4']);
const HISTORY_LIMIT = 128;
let loadNotice = '';
let testingMode = false;
const WORK_ACTIONS = new Set(['trace','work-packet','work-c2','work-c3','work-c4','career-work']);
for(let chapter=5;chapter<=12;chapter++)VALID_POPUPS.add(`energy-exhausted-c${chapter}`);
export function setTestingMode(enabled) { testingMode = enabled === true; }
export function websiteGoal(state) { return state.scopeVersion === 1 && state.scope === 'wide' ? 3 : 2; }
export function exhaustionPopupId(state) { return `energy-exhausted-c${state.graduate && isMastersStage(state.stage) ? 4 : state.stage==='c4_opening' ? 3 : Number(state.stage.match(/^c(\d+)_/)?.[1])}`; }
export function acknowledgeExhaustion(state) { state.exhaustionPending = false; state.exhaustionNotified = true; const id = exhaustionPopupId(state); if (!state.seenPopups.includes(id)) state.seenPopups.push(id); }
export const WORK_GOALS = Object.freeze({ packet: 20, plan: 24, project: 30 });
export function energyLimit(state) {
  if (state.career && isCareerStage(state.stage)) return CAREER_ENERGY[state.career.chapter];
  if (state.graduate && isMastersStage(state.stage)) return MASTERS_BALANCE.energy;
  if (state.energyBudgetVersion !== 1) return ENERGY_BUDGET.legacy;
  const chapter = Number(state.stage.match(/^c(\d+)_/)?.[1]);
  const limit = ENERGY_BUDGET.chapters[chapter === 4 ? 3 : chapter];
  if (!Number.isInteger(limit)) throw new Error('Missing chapter Energy budget');
  return limit;
}
const FORM_WORK = Object.freeze({ extra: 'Extra-credit paper', session: 'Research interest session', memo: 'Class paper', handoff: 'Campus guide' });
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

export function initialState() {
  return { version: 1, economyVersion: 2, qualityVersion: 1, packetBudgetVersion: 2, scopeVersion: 1, responseVersion: 1, exhaustionVersion: 2, exhaustionPending: false, exhaustionNotified: false, qualityWork: emptyQualityWork(), planningVersion: 2, studyPaceVersion: 1, checkTimingVersion: 0, planEnergyVersion: 0, planEnergySettled: 0, projectEnergyVersion: 0, projectEnergySettled: 0, energyBudgetVersion: 1, planFinishEnergy: null, projectFinishEnergy: null, feedbackVersion: 0, projectAim: '', feedbackOutcome: '', projectVersion: 0, projectWork: { extra: 0, session: 0 }, projectChecks: { extra: false, session: false }, projectProgressAwarded: 0, hasSwitched: false, stage: 'c1_start', progress: 0, capacity: ENERGY_BUDGET.chapters[1], marks: 0, scope: '', capability1: false, packet: false, packetWork: 0, support: false, recovery: '', week: '', samiraSupport: false, review2: '', capability2: false, notesRoutine: false, form: '', work: 0, intervention: false, prechecked: false, sourceChecked: false, standing: 0, summary: '', record: [], seenPopups: [], undoHistory: [], updatedAt: Date.now() };
}

// A task aim and a source check affect the work, never institutional availability.
export function selectFeedback(aim, checked) {
  return aim === 'route' ? 'intended' : aim === 'place' ? checked ? 'mixed' : 'productive_setback' : '';
}

function cleanState(parsed) {
    if (isCareerStage(parsed?.stage)) {
      const origin=parsed.career?.entry;
      if(!origin || !Array.isArray(origin.record) || origin.record.length>256 || !origin.record.every(x=>typeof x==='string'&&x.length<1600))return null;
      const base=cleanState({...parsed,stage:'c5_opening',standing:3,progress:origin.progress,capacity:origin.capacity,record:origin.record,career:null});
      return base ? cleanCareerState(base,parsed) : null;
    }
    if (isMastersStage(parsed?.stage)) {
      const g=parsed.graduate;
      const base=cleanState({...parsed,stage:'c4_opening',standing:2,progress:g?.previousProgress,capacity:g?.entryEnergy,graduate:null});
      return base ? cleanMastersState(base,parsed) : null;
    }
    if (isResearchStage(parsed?.stage)) {
      // Completed Chapter 2 facts retain their original save and quality policy.
      const base=cleanState({...parsed, stage:'c2_done', standing:1,
        progress:parsed.research?.previousProgress, capacity:Math.min(parsed.capacity,ENERGY_BUDGET.chapters[2]),research:null});
      return base ? cleanResearchState(base,parsed) : null;
    }
    if (parsed?.version !== 1 || !VALID_STAGES.has(parsed.stage)) return null;
    const clean = { ...initialState(), ...parsed, undoHistory: [] };
    if (parsed.energyBudgetVersion != null && ![0,1].includes(parsed.energyBudgetVersion)) return null;
    clean.energyBudgetVersion = parsed.energyBudgetVersion === 1 ? 1 : 0;
    const maxEnergy = energyLimit(clean);
    if (clean.energyBudgetVersion === 1 && (!Number.isInteger(parsed.capacity) || parsed.capacity < 0 || parsed.capacity > maxEnergy)) return null;
    for (const field of ['scopeVersion','responseVersion']) {
      if (parsed[field] != null && ![0,1].includes(parsed[field])) return null;
      clean[field] = parsed[field] === 1 ? 1 : 0;
    }
    if (parsed.exhaustionVersion != null && ![0,1,2].includes(parsed.exhaustionVersion)) return null;
    clean.exhaustionVersion = parsed.exhaustionVersion >= 1 ? 2 : 0;
    for (const field of ['exhaustionPending','exhaustionNotified']) {
      if (parsed[field] != null && typeof parsed[field] !== 'boolean') return null;
      clean[field] = parsed[field] === true;
    }
    clean.undoMode = ['play','testing'].includes(parsed.undoMode) ? parsed.undoMode : 'legacy';
    if (parsed.studyPaceVersion != null && ![0,1].includes(parsed.studyPaceVersion)) return null;
    clean.studyPaceVersion = parsed.studyPaceVersion === 1 ? 1 : 0;
    if (parsed.checkTimingVersion != null && ![0,1].includes(parsed.checkTimingVersion)) return null;
    // Already-selected projects keep their promised flexible check opportunity.
    clean.checkTimingVersion = parsed.checkTimingVersion === 1 ? 1 : 0;
    if (parsed.planningVersion != null && ![0,1,2].includes(parsed.planningVersion)) return null;
    clean.planningVersion = [1,2].includes(parsed.planningVersion) ? parsed.planningVersion : 0;
    for (const task of ['plan','project']) {
      const version = `${task}EnergyVersion`, settled = `${task}EnergySettled`;
      if (parsed[version] != null && ![0,1].includes(parsed[version])) return null;
      clean[version] = parsed[version] === 1 ? 1 : 0;
      clean[settled] = parsed[settled] ?? 0;
      if (!Number.isInteger(clean[settled]) || clean[settled] < 0 || clean[settled] > 4) return null;
      if (clean[version] === 0 && clean[settled] !== 0) return null;
      if (clean[version] === 1 && clean.planningVersion < 1) return null;
    }
    for (const field of ['planFinishEnergy','projectFinishEnergy']) {
      clean[field] = parsed[field] ?? null;
      if (clean[field] !== null && (!Number.isInteger(clean[field]) || clean[field] < 0 || clean[field] > maxEnergy)) return null;
      if (clean.planningVersion === 0) clean[field] = null;
    }
    if (clean.projectFinishEnergy !== null && !['c2_feedback','c2_done'].includes(clean.stage)) return null;
    if (clean.planningVersion >= 1 && ['c2_feedback','c2_done'].includes(clean.stage) && clean.projectFinishEnergy === null) return null;
    const legacyEconomy = parsed.economyVersion !== 2;
    clean.economyVersion = 2;
    clean.progress = clamp(Number(clean.progress) || 0, 0, 100);
    clean.capacity = clamp(Number(clean.capacity) || 0, 0, maxEnergy);
    clean.marks = clamp(Number(clean.marks) || 0, 0, websiteGoal(clean));
    clean.packetWork = clamp(Number(parsed.packetWork ?? (clean.packet ? WORK_GOALS.packet : 0)) || 0, 0, WORK_GOALS.packet);
    const oldWork = clamp(Number(clean.work) || 0, 0, legacyEconomy ? 6 : WORK_GOALS.project);
    clean.work = legacyEconomy && clean.stage === 'c2_work' ? oldWork * 4 : legacyEconomy && clean.stage === 'c2_contribute' ? oldWork * 5 : oldWork;
    if (clean.stage === 'c2_work') clean.work = clamp(clean.work, 0, WORK_GOALS.plan - 1);
    if (['c2_contribute','c2_switch'].includes(clean.stage)) clean.work = clamp(clean.work, 0, WORK_GOALS.project - 1);
    if (clean.stage === 'c1_prep') clean.packet = clean.packetWork === WORK_GOALS.packet;
    clean.standing = clamp(Number(clean.standing) || 0, 0, 1);
    if (![clean.marks, clean.packetWork, oldWork, clean.standing].every(Number.isInteger)) return null;
    // Missing fields identify historical saves; do not infer past exhaustion.
    if (parsed.qualityVersion != null && ![0,1].includes(parsed.qualityVersion)) return null;
    if (parsed.packetBudgetVersion != null && ![0,1,2].includes(parsed.packetBudgetVersion)) return null;
    clean.qualityVersion = parsed.qualityVersion === 1 ? 1 : 0;
    clean.packetBudgetVersion = [1,2].includes(parsed.packetBudgetVersion) ? parsed.packetBudgetVersion : 0;
    if (clean.scopeVersion === 1 && clean.packetBudgetVersion !== 2) return null;
    clean.qualityWork = emptyQualityWork();
    if (clean.qualityVersion === 1) {
      if (!parsed.qualityWork || Object.keys(clean.qualityWork).some(task => !Array.isArray(parsed.qualityWork[task]) || parsed.qualityWork[task].length > WORK_QUALITY.goals[task] || !parsed.qualityWork[task].every(n => typeof n === 'boolean'))) return null;
      for (const task of Object.keys(clean.qualityWork)) clean.qualityWork[task] = [...parsed.qualityWork[task]];
      const currentTask = clean.stage === 'c1_prep' ? 'packet' : clean.stage === 'c2_work' ? 'plan' : ['c2_aim','c2_contribute','c2_switch'].includes(clean.stage) ? clean.form : '';
      const amount = currentTask === 'packet' ? clean.packetWork : clean.work;
      if (currentTask && clean.qualityWork[currentTask]?.length !== amount) return null;
      if (['c2_feedback','c2_done'].includes(clean.stage) && clean.qualityWork[clean.form]?.length !== WORK_GOALS.project) return null;
    }
    clean.record = Array.isArray(clean.record) ? clean.record.filter(x => typeof x === 'string').slice(0, 64) : [];
    clean.seenPopups = Array.isArray(parsed.seenPopups) ? [...new Set(parsed.seenPopups.filter(id => VALID_POPUPS.has(id)))] : [];
    // The old global notice does not identify its chapter. Treat an acknowledged
    // old notice as read in the saved chapter, so refresh never repeats it.
    const exhaustionId = exhaustionPopupId(clean);
    if (parsed.exhaustionVersion !== 2 && (clean.exhaustionNotified || clean.seenPopups.includes('energy-exhausted'))) {
      if (!clean.seenPopups.includes(exhaustionId)) clean.seenPopups.push(exhaustionId);
    }
    clean.exhaustionNotified = clean.seenPopups.includes(exhaustionId);
    if (clean.exhaustionVersion === 0 || clean.exhaustionNotified) clean.exhaustionPending = false;
    clean.scope = ['focused','wide'].includes(clean.scope) ? clean.scope : '';
    clean.recovery = ['packet','routes'].includes(clean.recovery) ? clean.recovery : '';
    clean.week = ['protected','distributed'].includes(clean.week) ? clean.week : '';
    clean.review2 = ['rebuild','question'].includes(clean.review2) ? clean.review2 : '';
    clean.form = ['extra','session','memo','handoff'].includes(clean.form) ? clean.form : '';
    clean.capability1 = Boolean(clean.capability1);
    clean.capability2 = Boolean(clean.capability2);
    // Do not retroactively award the trial to older saves or Back snapshots.
    clean.notesRoutine = parsed.notesRoutine === true && Boolean(clean.review2) && ['c2_choose','c2_aim','c2_contribute','c2_switch','c2_feedback','c2_done'].includes(clean.stage);
    clean.packet = Boolean(clean.packet);
    clean.support = Boolean(clean.support);
    clean.samiraSupport = Boolean(clean.samiraSupport);
    clean.intervention = Boolean(clean.intervention);
    clean.prechecked = Boolean(clean.prechecked);
    clean.sourceChecked = Boolean(clean.sourceChecked);
    // Older projects keep their original feedback and recognition, including Back snapshots.
    if (parsed.feedbackVersion != null && ![0, 1].includes(parsed.feedbackVersion)) return null;
    clean.feedbackVersion = parsed.feedbackVersion === 1 ? 1 : 0;
    clean.projectAim = ['route','place'].includes(parsed.projectAim) ? parsed.projectAim : '';
    clean.feedbackOutcome = ['intended','mixed','productive_setback'].includes(parsed.feedbackOutcome) ? parsed.feedbackOutcome : '';
    if (clean.feedbackVersion === 0) {
      clean.projectAim = ''; clean.feedbackOutcome = '';
      if (['c2_aim','c2_switch'].includes(clean.stage)) return null;
    } else {
      if (!['extra','session'].includes(clean.form) || !['c2_aim','c2_contribute','c2_switch','c2_feedback','c2_done'].includes(clean.stage)) return null;
      if (clean.standing !== (clean.stage === 'c2_done' ? 1 : 0)) return null;
      if (clean.stage === 'c2_aim' && (clean.projectAim || clean.feedbackOutcome || clean.work !== 0)) return null;
      if (clean.stage !== 'c2_aim' && !clean.projectAim) return null;
      if (['c2_feedback','c2_done'].includes(clean.stage)) {
        if (clean.feedbackOutcome !== selectFeedback(clean.projectAim, clean.sourceChecked)) return null;
      } else if (clean.feedbackOutcome) return null;
    }
    if (parsed.projectVersion != null && ![0, 1].includes(parsed.projectVersion)) return null;
    if (clean.feedbackVersion === 1) {
      const finished = ['c2_feedback','c2_done'].includes(clean.stage);
      clean.projectVersion = 1;
      if (parsed.projectVersion !== 1) {
        // Safely adopt current feedback-trial saves without granting any work or rewards.
        clean.projectWork = { extra: 0, session: 0, [clean.form]: finished ? WORK_GOALS.project : clean.work };
        clean.projectChecks = { extra: false, session: false, [clean.form]: finished ? clean.sourceChecked : clean.intervention };
        clean.projectProgressAwarded = Math.floor(clean.projectWork[clean.form] / 5);
        clean.hasSwitched = false;
      } else {
        if (!parsed.projectWork || !parsed.projectChecks) return null;
        clean.projectWork = { extra: parsed.projectWork.extra, session: parsed.projectWork.session };
        clean.projectChecks = { extra: parsed.projectChecks.extra, session: parsed.projectChecks.session };
        if (!Object.values(clean.projectWork).every(n => Number.isInteger(n) && n >= 0 && n <= WORK_GOALS.project)) return null;
        if (!Object.values(clean.projectChecks).every(value => typeof value === 'boolean')) return null;
        clean.projectProgressAwarded = parsed.projectProgressAwarded;
        const earnedFloor = Math.floor(Math.max(...Object.values(clean.projectWork)) / 5);
        if (!Number.isInteger(clean.projectProgressAwarded) || clean.projectProgressAwarded !== earnedFloor) return null;
        clean.hasSwitched = parsed.hasSwitched === true;
        if (clean.projectWork[clean.form] !== (finished ? WORK_GOALS.project : clean.work)) return null;
        if (clean.projectWork[otherProject(clean.form)] >= WORK_GOALS.project) return null;
        if (clean.projectChecks[clean.form] !== (finished ? clean.sourceChecked : clean.intervention)) return null;
        if (clean.hasSwitched !== (clean.projectWork[otherProject(clean.form)] > 0)) return null;
        if (!clean.hasSwitched && clean.projectChecks[otherProject(clean.form)]) return null;
        if (clean.stage === 'c2_aim' && (Object.values(clean.projectWork).some(Boolean) || clean.hasSwitched || Object.values(clean.projectChecks).some(Boolean))) return null;
      }
      if (clean.stage === 'c2_switch' && clean.work === 0) return null;
    } else {
      if (parsed.projectVersion === 1) return null;
      clean.projectVersion = 0; clean.projectWork = { extra: 0, session: 0 }; clean.projectChecks = { extra: false, session: false }; clean.projectProgressAwarded = 0; clean.hasSwitched = false;
    }
    clean.summary = typeof clean.summary === 'string' ? clean.summary.slice(0, 600).replaceAll('Capacity', 'Energy') : '';
    if (clean.stage === 'c1_trace' && clean.marks >= websiteGoal(clean)) return null;
    if (clean.stage === 'c1_invest' && clean.progress < 3) return null;
    if (clean.stage === 'c1_boundary' && !clean.recovery) return null;
    if (clean.stage.startsWith('c2_') && !clean.recovery) return null;
    if (['c2_work','c2_review','c2_choose','c2_aim','c2_contribute','c2_switch','c2_feedback','c2_done'].includes(clean.stage) && !clean.week) return null;
    if (['c2_aim','c2_contribute','c2_switch','c2_feedback','c2_done'].includes(clean.stage) && !clean.form) return null;
    if (clean.planEnergyVersion === 1) {
      if (!clean.week || ['c2_plan','c1_start','c1_trace','c1_invest','c1_opening','c1_prep','c1_review','c1_boundary'].includes(clean.stage)) return null;
      const through = clean.stage === 'c2_work' ? clean.work : WORK_GOALS.plan;
      if (clean.planEnergySettled !== plannedEnergyThrough(clean,'week',through)) return null;
    }
    if (clean.projectEnergyVersion === 1) {
      if (!clean.projectAim || clean.projectVersion !== 1 || !['c2_contribute','c2_switch','c2_feedback','c2_done'].includes(clean.stage)) return null;
      if (clean.projectEnergySettled !== plannedEnergyThrough(clean,'aim',Math.max(...Object.values(clean.projectWork)))) return null;
    }
    // A testing-mode return to Chapter 2 must not retain later research facts.
    clean.research=null;
    clean.graduate=null;
    clean.career=null;
    return clean;
}

function snapshot(state) {
  const { undoHistory, ...saved } = state;
  return { ...saved, ...(state.career ? {career:structuredClone(state.career)} : {}), ...(state.research ? {research:structuredClone(state.research)} : {}), ...(state.graduate ? {graduate:structuredClone(state.graduate)} : {}), record: [...state.record], seenPopups: [...state.seenPopups], projectWork: { ...state.projectWork }, projectChecks: { ...state.projectChecks }, qualityWork: Object.fromEntries(Object.entries(state.qualityWork).map(([task,units]) => [task,[...units]])) };
}

function applyMode(state) {
  // Testing history must never make committed choices reversible in normal play.
  if (!testingMode && state.undoMode !== 'play') state.undoHistory = [];
  state.undoMode = testingMode ? 'testing' : 'play';
  if (!testingMode && state.stage === 'c2_switch') {
    state.stage = 'c2_contribute';
    state.summary = 'Your current project stays selected. Continue the work; your saved work and Energy remain.';
  }
}

export function loadState() {
  loadNotice = '';
  let raw;
  try { raw = localStorage.getItem(KEY); }
  catch {
    loadNotice = 'Could not read the saved game in this browser';
    return initialState();
  }
  try {
    if (!raw) return initialState();
    const parsed = JSON.parse(raw);
    const clean = cleanState(parsed);
    if (!clean) throw new Error('Invalid saved state');
    clean.undoHistory = Array.isArray(parsed.undoHistory)
      ? parsed.undoHistory.slice(-HISTORY_LIMIT).map(cleanState).filter(Boolean).map(snapshot)
      : [];
    applyMode(clean);
    return clean;
  } catch {
    loadNotice = 'Your saved game could not be loaded. A new game has started.';
    return initialState();
  }
}
export function getLoadNotice() { return loadNotice; }

export function saveState(state) {
  applyMode(state);
  state.updatedAt = Date.now();
  try { localStorage.setItem(KEY, JSON.stringify(state)); return true; }
  catch { return false; }
}

export function clearState() { try { localStorage.removeItem(KEY); } catch {} }
export function addRecord(state, text) { if (!state.record.includes(text)) state.record.push(text); }
export function canUndo(state) { return (testingMode || state.undoMode === 'play') && Array.isArray(state.undoHistory) && state.undoHistory.length > 0; }
export function undoAction(state) {
  if (!canUndo(state)) return false;
  const previous = cleanState(state.undoHistory.at(-1));
  if (!previous || (!testingMode && previous.undoMode !== 'play')) return false;
  const remaining = state.undoHistory.slice(0, -1);
  const exhaustionRead = state.seenPopups.filter(id => id.startsWith('energy-exhausted-c'));
  Object.assign(state, previous, { undoHistory: remaining, summary: testingMode ? 'Back one step. Your last action has been undone.' : 'Back one work press. Your choices stay selected.' });
  state.seenPopups = [...new Set([...state.seenPopups, ...exhaustionRead])];
  state.exhaustionNotified = state.seenPopups.includes(exhaustionPopupId(state));
  if (state.exhaustionNotified) state.exhaustionPending = false;
  applyMode(state);
  return true;
}
export function can(state, action) {
  if (isCareerStage(state.stage) || action==='start-career') return careerCan(state,action);
  if (isMastersStage(state.stage) || action==='start-masters') return mastersCan(state,action);
  if (isResearchStage(state.stage) || action==='enter-c3') return researchCan(state,action);
  const allowed = {
    c1_start: ['scope-focused','scope-wide'],
    c1_trace: state.marks < websiteGoal(state) ? ['trace'] : [],
    c1_invest: state.progress >= 3 ? ['invest'] : [],
    c1_opening: ['prepare', ...(state.support ? [] : ['support'])],
    c1_prep: state.packetWork < WORK_GOALS.packet ? ['work-packet'] : ['advance-c1'],
    c1_review: ['recover-packet','recover-routes'],
    c1_boundary: ['enter-c2'],
    c2_plan: ['week-protected','week-distributed', ...(state.samiraSupport ? [] : ['ask-samira'])],
    c2_work: ['work-c2', ...(!state.intervention && state.capacity > 0 ? ['intervene'] : [])],
    c2_review: ['review-rebuild','review-question'],
    c2_choose: ['form-extra','form-session'],
    c2_aim: ['aim-route','aim-place'],
    c2_contribute: ['work-c2', ...(!state.intervention && state.capacity > 0 && (state.checkTimingVersion !== 1 || state.work === PROJECT_CHECK.workAt) ? ['intervene'] : []), ...(testingMode && state.feedbackVersion === 1 && state.projectVersion === 1 && state.work > 0 ? ['review-switch'] : [])],
    c2_switch: testingMode ? ['confirm-switch','cancel-switch'] : ['cancel-switch'],
    c2_feedback: ['consolidate-c2'],
    c2_done: []
  };
  return allowed[state.stage]?.includes(action) ?? false;
}

export function workPerPress(state) {
  if (isMastersStage(state.stage)) return mastersWorkPerPress(state);
  if (isResearchStage(state.stage)) return researchWorkPerPress(state);
  if (state.stage === 'c2_work' && state.studyPaceVersion === 1) return Math.min(STUDY_PACE[state.week] || 1, WORK_GOALS.plan - state.work);
  return state.stage === 'c2_contribute' && state.notesRoutine && ['extra','session'].includes(state.form) && state.work < PREPARATION_UPGRADE.workEnd
    ? Math.min(PREPARATION_UPGRADE.workPerPress, PREPARATION_UPGRADE.workEnd - state.work) : 1;
}

export function otherProject(form) { return form === 'extra' ? 'session' : 'extra'; }
export function switchPlan(state) {
  const form = otherProject(state.form);
  const shared = Math.min(PROJECT_REUSE.sharedNotesEnd, Math.max(state.work, ...Object.values(state.projectWork)));
  const work = Math.max(state.projectWork[form], shared);
  const boosted = state.notesRoutine ? Math.max(0, PREPARATION_UPGRADE.workEnd - work) : 0;
  const presses = Math.ceil(boosted / PREPARATION_UPGRADE.workPerPress) + WORK_GOALS.project - work - boosted;
  return { form, shared, work, presses, checked: state.projectChecks[form] };
}

export function pressWork(state) {
  if (!['c2_work','c2_contribute'].includes(state.stage)) return false;
  const firstCycle = state.stage === 'c2_work';
  const goal = firstCycle ? WORK_GOALS.plan : WORK_GOALS.project;
  if (state.work >= goal) return false;
  const previousWork = state.work;
  const added = Math.min(workPerPress(state), goal - previousWork);
  recordQualityWork(state, firstCycle ? 'plan' : state.form, added);
  state.work += added;
  const energyTask = firstCycle ? 'plan' : 'project';
  let workEnergy = 0;
  if (state[`${energyTask}EnergyVersion`] === 1) {
    const planned = plannedEnergyThrough(state, firstCycle ? 'week' : 'aim', state.work);
    const due = Math.max(0, planned - state[`${energyTask}EnergySettled`]);
    workEnergy = Math.min(state.capacity, due);
    state.capacity -= workEnergy;
    // Settled includes a milestone reached at zero; recovery never back-charges it.
    state[`${energyTask}EnergySettled`] = Math.max(planned, state[`${energyTask}EnergySettled`]);
  }
  const interval = goal / 6;
  // Award every crossed work milestone, including ones crossed by a two-unit press.
  const milestone = Math.floor(state.work / interval);
  const gained = !firstCycle && state.projectVersion === 1 ? Math.max(0, milestone - state.projectProgressAwarded) : milestone - Math.floor(previousWork / interval);
  if (!firstCycle && state.projectVersion === 1) {
    state.projectWork[state.form] = state.work;
    state.projectProgressAwarded += gained;
  }
  state.progress += gained;
  state.summary = `${firstCycle ? 'Weekly plan' : FORM_WORK[state.form]}: work ${state.work}/${goal}. +${added} work${added > 1 ? firstCycle ? ' from uninterrupted study' : ' from your organized notes' : ''}.${gained ? ` +${gained} Progress.` : ''} ${state.capacity === 0 && state.qualityVersion !== 1 ? 'You can still work at zero Energy.' : ''}`.trim();
  if (workEnergy) state.summary += ` ${WORK_ENERGY_LABELS[firstCycle ? 'week' : state.form]?.[state.work] || 'Work milestone'}: −${workEnergy} Energy.`;
  if (state.work >= goal) {
    const protectedCost = firstCycle ? state.recovery === 'packet' : state.review2 === 'rebuild';
    const cost = state.planningVersion >= 1 || protectedCost || state.capacity === 0 ? 0 : 1;
    state.capacity = clamp(state.capacity - cost, 0, energyLimit(state));
    if (state.planningVersion >= 1) state[firstCycle ? 'planFinishEnergy' : 'projectFinishEnergy'] = state.capacity;
    if (firstCycle) state.prechecked = state.intervention;
    else {
      state.sourceChecked = state.intervention;
      if (state.feedbackVersion === 1) state.feedbackOutcome = selectFeedback(state.projectAim, state.sourceChecked);
    }
    state.stage = firstCycle ? 'c2_review' : 'c2_feedback';
    const reason = protectedCost ? (firstCycle ? 'you reused your packet' : 'you rebuilt your week') : 'basic work continues at lower effort';
    state.summary = `${firstCycle ? 'Weekly plan' : FORM_WORK[state.form]} finished: work ${goal}/${goal}, +6 Progress across the task${state.intervention ? ', plus +1 from your extra check' : ''}. Energy ${cost ? '−1' : `unchanged because ${reason}`}. ${firstCycle ? 'The class-time conflict needs your choice.' : 'Your work is ready for feedback.'}`;
    if (!firstCycle && state.hasSwitched) state.summary = `${FORM_WORK[state.form]} finished: work 30/30. Across both forms: 6 Progress from work, ${Object.values(state.projectChecks).filter(Boolean).length} from checks. Energy ${cost ? '−1' : 'unchanged'}. Read the feedback.`;
    if (state.planningVersion >= 1) state.summary = `${firstCycle ? 'Weekly plan' : FORM_WORK[state.form]} finished. Energy ${state.capacity}/${energyLimit(state)}; ${state[`${energyTask}EnergyVersion`] === 1 ? 'paid at start and work milestones' : 'paid with your choice'}. ${firstCycle ? 'The class-time conflict needs your choice.' : 'Required work is saved; read the feedback.'}`;
    const quality = workQuality(state, firstCycle ? 'plan' : state.form);
    if (quality) {
      addRecord(state, quality.record);
      state.summary = `${firstCycle ? 'Weekly plan' : FORM_WORK[state.form]} finished. Energy ${state.capacity}/${energyLimit(state)}. Work quality: ${quality.band.toLowerCase()}. ${firstCycle ? 'The class-time conflict needs your choice.' : 'Read the feedback.'}`;
    }
    if (workEnergy) state.summary += ` ${WORK_ENERGY_LABELS[firstCycle ? 'week' : state.form]?.[goal] || 'Work finished'}: −${workEnergy} Energy.`;
    state.intervention = false;
    state.work = 0;
  }
  return true;
}

export function act(state, action) {
  if (!can(state, action)) return false;
  const energyBefore = state.capacity;
  applyMode(state);
  state.undoHistory = testingMode || WORK_ACTIONS.has(action) ? [...state.undoHistory, snapshot(state)].slice(-HISTORY_LIMIT) : [];
  if (isCareerStage(state.stage) || action==='start-career') {
    careerAct(state,action);
    if (!state.exhaustionNotified && state.capacity===0 && (energyBefore>0 || action==='career-work')) state.exhaustionPending=true;
    return true;
  }
  if (isMastersStage(state.stage) || action==='start-masters') {
    mastersAct(state,action);
    if (!state.exhaustionNotified && state.capacity===0 && (energyBefore>0 || WORK_ACTIONS.has(action))) state.exhaustionPending=true;
    if (state.capacity===0 && ['c4_design','c4_study','c4_response'].includes(state.stage)) state.summary+=` ${QUALITY_WARNING}`;
    return true;
  }
  if (isResearchStage(state.stage) || action==='enter-c3') {
    researchAct(state,action);
    if (!state.exhaustionNotified && state.capacity===0 && (energyBefore>0 || WORK_ACTIONS.has(action))) state.exhaustionPending=true;
    if (state.capacity===0 && ['c3_work','c3_focal','c3_response'].includes(state.stage)) state.summary+=` ${QUALITY_WARNING}`;
    return true;
  }
  switch (action) {
    case 'scope-focused': case 'scope-wide':
      state.scope = action === 'scope-focused' ? 'focused' : 'wide'; state.stage = 'c1_trace';
      if (state.scopeVersion === 1 && state.scope === 'wide') state.capacity = Math.max(0,state.capacity - CAUSE_ENERGY.widerPlanning);
      state.summary = state.scopeVersion === 1 ? state.scope === 'wide' ? 'Three websites to compare. Broader planning: −1 Energy now.' : 'Two websites to compare. Energy stays available for research.' : state.scope === 'focused' ? 'You chose two paths to compare.' : 'You chose two main paths and will note a third option.'; break;
    case 'trace':
      state.marks++; state.progress += 2; state.capacity = clamp(state.capacity - 1, 0, energyLimit(state));
      state.summary = `Page ${state.marks} checked: +2 Progress, −1 Energy. ${state.marks === websiteGoal(state) ? 'Your entry steps and questions list is finished.' : `${websiteGoal(state)-state.marks} website${websiteGoal(state)-state.marks === 1 ? ' remains' : 's remain'}.`}`;
      if (state.marks === websiteGoal(state)) { state.stage = 'c1_invest'; addRecord(state, state.scopeVersion === 1 ? `${websiteGoal(state)}-website rules and questions list · finished` : 'Rules and questions list · finished'); }
      break;
    case 'invest':
      state.progress -= 3; state.capability1 = true; state.stage = 'c1_opening';
      state.summary = 'Spent 3 Progress. Spot missing details saves 1 Energy on the packet; only the workshop can decide nomination.';
      addRecord(state, 'Spot missing rules · learned skill'); break;
    case 'support':
      state.support = true;
      const jordanEnergy = state.capacity < energyLimit(state) ? 1 : 0;
      state.capacity += jordanEnergy;
      state.summary = `Jordan helps you check one route. ${jordanEnergy ? '+1 Energy.' : 'Energy is already full.'} Workshop eligibility stays the same.`;
      addRecord(state, 'Jordan helped check one route'); break;
    case 'prepare':
      recordQualityWork(state, 'packet', 1);
      if (state.packetBudgetVersion === 2) state.capacity = Math.max(0,state.capacity - CAUSE_ENERGY.packetStart);
      else if (state.packetBudgetVersion === 1 && state.scope === 'wide') state.capacity = Math.max(0, state.capacity - WORK_QUALITY.widerPacketCost);
      state.packet = false; state.packetWork = 1; state.stage = 'c1_prep';
      state.summary = state.packetBudgetVersion === 2 ? 'Packet organized: work 1/20. −1 Energy now; −1 at 10/20 for the question and at 20/20 for assembly, if Energy remains.' : state.packetBudgetVersion === 1 && state.scope === 'wide' ? 'Workshop packet: work 1/20. Noting a third option costs up to 3 Energy now; packet milestones still cost 2 with your skill.' : 'Workshop packet: work 1/20. You start from your school-route notes. Energy unchanged.'; break;
    case 'work-packet': {
      recordQualityWork(state, 'packet', 1);
      state.packetWork++;
      const gained = state.packetWork % 5 === 0 ? 1 : 0;
      state.progress += gained;
      const energyCost = (state.packetWork === 10 || state.packetWork === 20 || (!state.capability1 && state.packetWork === 5)) && state.capacity > 0 ? 1 : 0;
      state.capacity -= energyCost;
      state.packet = state.packetWork === WORK_GOALS.packet;
      state.summary = `Workshop packet: work ${state.packetWork}/${WORK_GOALS.packet}.${gained ? ' +1 Progress.' : ''}${energyCost ? state.packetBudgetVersion === 2 ? state.packetWork === 10 ? ' Question developed: −1 Energy.' : ' Packet assembled: −1 Energy.' : ' −1 Energy.' : ''}${state.packet ? ' Packet ready. Nomination eligibility still needs confirmation.' : ''}`;
      if (state.packet) { const quality = workQuality(state, 'packet'); if (quality) { addRecord(state, quality.record); state.summary += ` Work quality: ${quality.band.toLowerCase()}.`; } }
      break;
    }
    case 'advance-c1':
      state.stage = 'c1_review';
      state.summary = 'A workshop notice arrives. Hillside is not a partner school. Your finished packet is saved.'; break;
    case 'recover-packet': case 'recover-routes':
      state.recovery = action === 'recover-packet' ? 'packet' : 'routes'; state.stage = 'c1_boundary';
      state.summary = state.recovery === 'packet' ? 'You reuse the workshop packet for Cedar Vale. It will save 1 Energy when you start class work.' : 'You check which public routes are still open. You bring clearer questions to Cedar Vale.';
      addRecord(state, state.recovery === 'packet' ? 'Workshop packet · ready to reuse' : 'Open routes note · current answers');
      addRecord(state, 'Cedar Vale plan · university route open');
      if (state.scopeVersion === 1) {
        const spent = state.recovery === 'routes' ? Math.min(state.capacity,CAUSE_ENERGY.routesCheck) : 0; state.capacity -= spent;
        state.summary = state.recovery === 'packet' ? 'Your packet is ready to reuse; no extra Energy. It saves 1 on the university study pattern.' : `Public routes checked: −${spent} Energy. Current answers stay saved.`;
        state.summary += ' Rest comes at the chapter break; packet quality stays recorded.';
      } else if (state.qualityVersion === 1) { state.capacity = Math.min(energyLimit(state),state.capacity+1); state.summary += ' You rest after the packet: up to +1 Energy. Its finish quality stays recorded.'; }
      break;
    case 'enter-c2':
      state.energyBudgetVersion = 1;
      state.stage = 'c2_plan'; state.capacity = energyLimit(state); state.progress = 0;
      state.planningVersion = 2; state.planFinishEnergy = null; state.projectFinishEnergy = null;
      state.studyPaceVersion = 1;
      state.qualityVersion = 1; state.qualityWork.plan = [];
      state.responseVersion = 1; state.exhaustionVersion = 2;
      state.exhaustionPending = false; state.exhaustionNotified = state.seenPopups.includes(exhaustionPopupId(state));
      state.summary = `You start at Cedar Vale after rest: Progress 0, Energy ${state.capacity}/${energyLimit(state)}. Your preparation supports a larger university week.`; break;
    case 'week-protected': case 'week-distributed':
      state.studyPaceVersion = 1;
      state.week = action === 'week-protected' ? 'protected' : 'distributed'; state.stage = 'c2_work'; state.work = 0;
      state.summary = state.week === 'protected' ? 'You set aside one long study block. Basic work starts moving.' : 'You make room for short study blocks. Basic work starts moving.';
      if (state.planningVersion >= 1) {
        state.planEnergyVersion = 1;
        state.planEnergySettled = plannedEnergyThrough(state,'week',0);
        const cost = planningCost(state, 'week', state.week), spent = Math.min(state.capacity, state.planEnergySettled);
        state.capacity -= spent; state.planFinishEnergy = null;
        state.summary = `${state.week === 'protected' ? 'Long study block' : 'Short study blocks'} started: ${cost} Energy total, −${spent} now${state.recovery === 'packet' ? '; your packet saves 1' : ''}. ${energySchedule(state,'week',state.week).filter(step=>step.at>0).map(step=>`${step.cost} Energy at ${step.at}/${WORK_GOALS.plan}`).join(', ') || 'No further Energy cost'}. Work remains available at zero.`;
      }
      break;
    case 'ask-samira':
      state.samiraSupport = true;
      state.summary = 'Samira points you to the department timetable during her paid hours. Her help gets credit. Only the department controls class times.';
      break;
    case 'intervene':
      state.intervention = true; state.progress += 1; state.capacity = clamp(state.capacity - 1, 0, energyLimit(state));
      if (state.stage === 'c2_contribute' && state.projectVersion === 1) state.projectChecks[state.form] = true;
      state.summary = state.stage === 'c2_work' ? 'Full schedule check: +1 Progress, −1 Energy. You learn early where the department posts discussion times.' : state.feedbackVersion !== 1 ? 'Extra project check: +1 Progress, −1 Energy. This helps you make a clearer final result.' : state.capacity === 0 && state.qualityVersion === 1 ? 'Project check recorded: +1 Progress, −1 Energy. Limits noted; no place is promised.' : state.projectAim === 'route' ? 'Extra project check: +1 Progress, −1 Energy. You confirm your route’s limits. No project place is promised.' : state.form === 'extra' ? 'Extra project check: +1 Progress, −1 Energy. You narrow the paper to a public route; the pages cannot promise access.' : 'Extra project check: +1 Progress, −1 Energy. No project places now; you narrow the note to a public contact route.';
      break;
    case 'work-c2': pressWork(state); break;
    case 'review-rebuild': case 'review-question':
      state.review2 = action === 'review-rebuild' ? 'rebuild' : 'question'; state.capability2 = true; state.stage = 'c2_choose';
      const reviewEnergy = (state.qualityVersion === 1 || state.review2 === 'rebuild' || state.samiraSupport) && state.capacity < energyLimit(state) ? 1 : 0;
      state.capacity += reviewEnergy;
      state.summary = state.review2 === 'rebuild' ? `You use another section and rearrange your week. ${reviewEnergy ? '+1 Energy now.' : 'Energy is already full.'} Your next ${state.planningVersion >= 1 ? 'project aim' : 'task'} costs 1 less Energy${state.planningVersion >= 1 ? '' : ' to finish'}. Your earlier work stays.` : `The department confirms the current discussion times and another class section. Your earlier work stays. ${state.samiraSupport ? reviewEnergy ? 'Samira’s help restores 1 Energy.' : 'Samira helps you ask clearly; Energy is already full.' : 'You can use the public office route without Samira.'}`;
      if (state.qualityVersion === 1) state.summary = state.review2 === 'rebuild'
        ? `Another section makes the week workable. ${reviewEnergy ? '+1 Energy now after rest.' : 'Energy is full after rest.'} Rebuilding saves 1 on project preparation. The plan quality stays recorded.`
        : `${state.samiraSupport ? 'Samira helps you ask clearly. ' : ''}The department confirms the current times and another section. Rest restores ${reviewEnergy ? '1 Energy' : 'no Energy; it is full'}. The plan quality stays recorded.`;
      if (state.responseVersion === 1) {
        state.capacity -= reviewEnergy;
        const spent = Math.min(state.capacity,CAUSE_ENERGY.responses[state.review2]); state.capacity -= spent;
        state.summary = state.review2 === 'rebuild' ? `Week rebuilt: −${spent} Energy now. Another section fits; rebuilding saves 1 on project preparation.` : `Department request: −${spent} Energy now. Current discussion times and another section confirmed.`;
        state.summary += ' Plan quality stays recorded; rest follows the finished project.';
      }
      state.notesRoutine = true;
      state.summary += ' You also keep source links and open questions together. Organized notes now give +2 work per press during the first preparation step of either project; later work stays +1.';
      addRecord(state, 'Find the current class times · learned skill');
      addRecord(state, 'Organized notes · faster project preparation'); break;
    case 'form-extra': case 'form-session':
      state.projectEnergyVersion = 0; state.projectEnergySettled = 0;
      state.checkTimingVersion = 1;
      state.form = action === 'form-extra' ? 'extra' : 'session'; state.stage = 'c2_aim'; state.work = 0; state.intervention = false;
      state.feedbackVersion = 1; state.projectAim = ''; state.feedbackOutcome = ''; state.sourceChecked = false;
      state.projectVersion = 1; state.projectWork = { extra: 0, session: 0 }; state.projectChecks = { extra: false, session: false }; state.projectProgressAwarded = 0; state.hasSwitched = false;
      state.projectFinishEnergy = null;
      state.qualityVersion = 1; state.exhaustionVersion = 2; state.qualityWork.extra = []; state.qualityWork.session = [];
      state.summary = state.form === 'extra' ? 'You chose the extra-credit paper. Set the question you want it to answer.' : 'You chose the public research interest session. Set the question for your prepared questions and note.'; break;
    case 'aim-route': case 'aim-place':
      state.projectAim = action === 'aim-route' ? 'route' : 'place'; state.stage = 'c2_contribute';
      state.summary = state.projectAim === 'route' ? 'You focus on one public next step, within what the pages and session can support.' : 'You explore getting a project place. A source check can help narrow this bigger question; useful work stays.';
      if (state.planningVersion >= 1) {
        state.projectEnergyVersion = 1;
        state.projectEnergySettled = plannedEnergyThrough(state,'aim',0);
        const cost = planningCost(state, 'aim', state.projectAim), spent = Math.min(state.capacity, state.projectEnergySettled);
        state.capacity -= spent;
        state.summary = `${state.projectAim === 'route' ? 'Focused public-route aim' : 'Broader project-place question'} started: ${cost} Energy total, −${spent} now${state.review2 === 'rebuild' ? '; rebuilding saves 1' : ''}. ${energySchedule(state,'aim',state.projectAim).filter(step=>step.at>0).map(step=>`${step.cost} Energy at ${step.at}/${WORK_GOALS.project}`).join(', ')}. Required work and submission count at zero.`;
      }
      break;
    case 'review-switch':
      state.stage = 'c2_switch';
      state.summary = 'Review the change first. Your Energy, earned Progress and current work stay in place until you choose.'; break;
    case 'cancel-switch':
      state.stage = 'c2_contribute';
      state.summary = 'You keep your current project. No work, Progress or Energy changed.'; break;
    case 'confirm-switch': {
      const plan = switchPlan(state);
      if (state.qualityVersion === 1) {
        const source = state.qualityWork[state.form];
        const target = state.qualityWork[plan.form];
        while (target.length < plan.work) target.push(source[target.length] ?? false);
      }
      state.form = plan.form; state.work = plan.work; state.projectWork[state.form] = plan.work;
      state.intervention = plan.checked; state.sourceChecked = false; state.hasSwitched = true; state.stage = 'c2_contribute';
      state.summary = `${FORM_WORK[state.form]}: work ${plan.work}/30, ${plan.presses} presses left. Notes reused; Progress/Energy unchanged.`;
      break;
    }
    case 'consolidate-c2':
      state.stage = 'c2_done'; state.standing = 1;
      const recognitionEnergy = state.capacity < energyLimit(state) ? 1 : 0;
      state.capacity += recognitionEnergy;
      const recognition = {
        extra: { actor: 'Your instructor', work: 'your extra-credit paper', record: 'Extra-credit paper · credited by instructor' },
        session: { actor: 'The research facilitator', work: 'your session questions and inquiry note', record: 'Research interest session · inquiry note recognized' },
        memo: { actor: 'Your instructor', work: 'your class paper', record: 'Class paper · credited contribution · teacher' },
        handoff: { actor: 'The Commons coordinator', work: 'your campus guide', record: 'Campus guide · credited contribution · Commons coordinator' }
      }[state.form];
      state.summary = `${recognition.actor} recognizes ${recognition.work}: +1 Standing. ${recognitionEnergy ? '+1 Energy.' : 'Energy is already full.'} Public research next steps are now available.`;
      if (state.qualityVersion === 1) state.summary = `${recognition.actor} recognizes ${recognition.work}: +1 Standing. ${recognitionEnergy ? '+1 Energy after rest.' : 'Energy is full.'} Submitted quality stays recorded; public next steps are open.`;
      state.record = [
        ...['extra','session','plan','packet'].map(task => workQuality(state,task)).filter(q => q?.finished).map(q => q.record),
        ['memo','handoff'].includes(state.form) ? 'Public research orientation · now open' : 'Public research next steps · now open',
        recognition.record,
        ...(finishStory(state) ? [finishStory(state).record] : []),
        ...(state.feedbackVersion === 1 ? [PROJECT_FEEDBACK[state.form][state.feedbackOutcome].record] : []),
        'Study plan that works · finished',
        ...(state.notesRoutine ? ['Organized notes · faster project preparation'] : []),
        ...(state.hasSwitched ? ['Shared source notes · reused between paper and session'] : []),
        ['memo','handoff'].includes(state.form) ? 'Find the office in charge · learned skill' : 'Find the current class times · learned skill',
        `Cedar Vale plan · ${state.recovery === 'packet' ? 'reused packet' : 'open routes note'}`,
        ...(state.scopeVersion === 1 ? [`${websiteGoal(state)}-website rules and questions list · finished`] : []),
        ...(state.support ? ['Jordan helped check one route'] : []),
        ...(state.samiraSupport && state.review2 === 'question' ? ['Samira helped prepare the question · credited'] : [])
      ]; break;
  }
  if (state.exhaustionVersion >= 1 && !state.exhaustionNotified && state.capacity === 0 && (energyBefore > 0 || WORK_ACTIONS.has(action))) state.exhaustionPending = true;
  if (state.qualityVersion === 1 && state.capacity === 0 && ['c1_prep','c2_work','c2_contribute'].includes(state.stage) && (state.stage !== 'c1_prep' || !state.packet)) state.summary += ` ${QUALITY_WARNING}`;
  return true;
}
