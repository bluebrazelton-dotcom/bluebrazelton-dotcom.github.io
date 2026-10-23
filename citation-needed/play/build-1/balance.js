// Local Phase 5 trial values; these are not final campaign balance.
export const ENERGY_BUDGET = Object.freeze({ legacy: 6, chapters: Object.freeze({ 1: 6, 2: 8, 3: 10 }) });
export const PREPARATION_UPGRADE = Object.freeze({ workEnd: 10, workPerPress: 2 });
export const STUDY_PACE = Object.freeze({ protected: 2, distributed: 1 });
export const PROJECT_REUSE = Object.freeze({ sharedNotesEnd: 10 });
export const PROJECT_CHECK = Object.freeze({ workAt: 10 });
export const WORK_ENERGY = Object.freeze({
  week: Object.freeze({ middle: 12, finish: 24 }),
  aim: Object.freeze({ middle: 10, finish: 30 })
});
// Bounded polish loss from exhausted work, separate from completion and credit.
export const WORK_QUALITY = Object.freeze({ goals: Object.freeze({packet:20,plan:24,extra:30,session:30}), maximumLoss:60, floor:40, rushedAt:75, widerPacketCost:3 });
export const CAUSE_ENERGY = Object.freeze({ widerPlanning:1, packetStart:1, routesCheck:1, responses:Object.freeze({rebuild:2,question:1}) });
// Total task costs. New commitments split these over start and work milestones.
export const PLANNING_ENERGY_V1 = Object.freeze({ week: Object.freeze({ protected: 3, distributed: 2 }), aim: Object.freeze({ route: 3, place: 4 }), preparationSaving: 1, tiredAt: 2 });
export const PLANNING_ENERGY = Object.freeze({ week: Object.freeze({ protected: 3, distributed: 2 }), aim: Object.freeze({ route: 3, place: 3 }), preparationSaving: 1, tiredAt: 2 });
