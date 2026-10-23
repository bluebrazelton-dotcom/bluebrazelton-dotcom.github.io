import { PLANNING_ENERGY, PLANNING_ENERGY_V1, WORK_ENERGY } from './balance.js?v=20261013r2';

// A local Energy-only trial. Legacy underway chapters keep their prior costs.
export function planningCost(state, kind, approach) {
  if (state.planningVersion < 1) return 0;
  const saving = kind === 'week' ? state.recovery === 'packet' : state.review2 === 'rebuild';
  const prices = state.planningVersion >= 2 ? PLANNING_ENERGY : PLANNING_ENERGY_V1;
  return prices[kind][approach] - (saving ? prices.preparationSaving : 0);
}

// Keep total prices and discounts; smaller costs waive preparation, then finish.
export function energySchedule(state, kind, approach) {
  const total = planningCost(state, kind, approach);
  const steps = WORK_ENERGY[kind];
  return [
    { at: 0, cost: Math.min(1, total) },
    { at: steps.middle, cost: Math.max(0, total - 2) },
    { at: steps.finish, cost: total > 1 ? 1 : 0 }
  ].filter(step => step.cost > 0);
}

export function plannedEnergyThrough(state, kind, work) {
  const approach = kind === 'week' ? state.week : state.projectAim;
  return energySchedule(state, kind, approach).filter(step => step.at <= work).reduce((sum, step) => sum + step.cost, 0);
}

export function pendingWorkEnergy(state) {
  const kind = state.stage === 'c2_work' ? 'week' : ['c2_contribute','c2_switch'].includes(state.stage) ? 'aim' : '';
  if (!kind) return 0;
  const task = kind === 'week' ? 'plan' : 'project';
  if (state[`${task}EnergyVersion`] !== 1) return 0;
  return planningCost(state, kind, kind === 'week' ? state.week : state.projectAim) - state[`${task}EnergySettled`];
}

export function finishStory(state, kind = 'project') {
  const energy = kind === 'plan' ? state.planFinishEnergy : state.projectFinishEnergy;
  if (state.planningVersion < 1 || energy == null) return null;
  const key = energy === 0 ? 'spent' : energy <= PLANNING_ENERGY.tiredAt ? 'tired' : 'room';
  const texts = kind === 'plan' ? {
    room: 'You finish trying the plan with Energy left. The fixed class times still need a response.',
    tired: 'Fitting study around the week takes effort. You finish tired, with your useful plan saved.',
    spent: 'Your Energy is spent, but you finish the plan. Its useful work stays while you address the class-time conflict.'
  } : {
    room: `Your ${state.week === 'protected' ? 'long study block' : 'short study blocks'} and ${state.projectAim === 'place' ? 'broader' : 'focused'} question leave Energy for a calm final read. Further questions stay open for later.`,
    tired: 'You finished tired after fitting the project around your week. The required work is complete; further questions can wait.',
    spent: 'Your Energy was spent when you submitted. You still completed the required work, keeping further questions for a later opportunity.'
  };
  const records = { room: 'Project finish · Energy left for a calm final read', tired: 'Project finish · tired, with required work complete', spent: 'Project finish · Energy spent; required work submitted' };
  return { key, text: texts[key], record: records[key] };
}
