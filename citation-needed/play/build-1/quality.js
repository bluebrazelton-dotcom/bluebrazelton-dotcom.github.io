import { WORK_QUALITY } from './balance.js?v=20261013r2';
import {isResearchStage, researchTask, researchQuality} from './research.js?v=20261013r2';
import {isMastersStage,mastersTask,mastersQuality} from './masters.js?v=20261013r2';
import {isCareerStage,careerQuality} from './career.js?v=20261013r2';

export const QUALITY_WARNING = 'Out of Energy: you can finish, but further work will be less polished until you recover.';
export const QUALITY_OPENING = 'Ms. Ortiz points you to a workshop. Nomination is unconfirmed; preparing the packet still gives you useful work.';
export const emptyQualityWork = () => ({ packet: [], plan: [], extra: [], session: [] });
export function qualityTask(state) {
  if (isCareerStage(state.stage)) return 'career';
  if (isMastersStage(state.stage)) return mastersTask(state);
  if (isResearchStage(state.stage)) return researchTask(state);
  if (['c1_prep','c1_review','c1_boundary'].includes(state.stage)) return 'packet';
  if (['c2_work','c2_review','c2_choose'].includes(state.stage)) return 'plan';
  if (['c2_aim','c2_contribute','c2_switch','c2_feedback','c2_done'].includes(state.stage)) return state.form;
  return '';
}
export function recordQualityWork(state, task, added) {
  if (state.qualityVersion !== 1 || !state.qualityWork[task]) return;
  state.qualityWork[task].push(...Array(added).fill(state.capacity === 0));
}
export function workQuality(state, task = qualityTask(state)) {
  if (task==='career') return careerQuality(state);
  if (['design','study','narrow','replace'].includes(task)) return mastersQuality(state,task);
  if (['common','focal','bounded','shared'].includes(task)) return researchQuality(state,task);
  if (state.qualityVersion !== 1 || !state.qualityWork?.[task]) return null;
  const units = state.qualityWork[task];
  // An older finished task with no ledger keeps its original receipt.
  if (!units.length && !['c2_aim','c2_work','c2_contribute'].includes(state.stage)) return null;
  const goal = WORK_QUALITY.goals[task];
  const exhausted = units.filter(Boolean).length;
  const value = Math.max(WORK_QUALITY.floor, Math.round(100 - WORK_QUALITY.maximumLoss * exhausted / goal));
  const band = exhausted === 0 ? 'Careful' : value > WORK_QUALITY.rushedAt ? 'Uneven' : 'Rushed';
  const finished = units.length === goal;
  const noun = {packet:'Workshop packet',plan:'Weekly plan',extra:'Extra-credit paper',session:'Session inquiry note'}[task];
  const details = {
    packet: ['Your comparisons and question are easy to follow.', 'Your comparisons remain useful; the final question needs a clearer sentence.', 'Your comparisons remain useful, but the closing question is hurried and needs another read.'],
    plan: ['Your fixed times and study notes are clear.', 'Your fixed times are saved; some study notes need a clearer order.', 'Your fixed times are saved, but the study notes are rushed and harder to follow.'],
    extra: ['Your argument and closing paragraph have a careful finish.', 'Your central argument is useful; the closing paragraph needs another read.', 'Your central argument is useful, but the conclusion is rushed and its links need another read.'],
    session: ['Your questions and follow-up note are clearly organized.', 'Your questions are useful; the follow-up note needs a clearer order.', 'Your questions are useful, but the follow-up note is rushed and harder to follow.']
  };
  const detail = details[task][band === 'Careful' ? 0 : band === 'Uneven' ? 1 : 2];
  return {task, value, band, exhausted, finished, noun, detail, record:`${noun} quality · ${band.toLowerCase()} finish`, text:`Work quality: ${band.toLowerCase()}. ${detail}`};
}
