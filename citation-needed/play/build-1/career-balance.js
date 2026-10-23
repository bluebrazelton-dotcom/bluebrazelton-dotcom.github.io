// October 12 production trial. These values are independent of the frozen model.
export const CAREER_VERSION = 1;
export const CAREER_ENERGY = Object.freeze({5:14,6:15,7:10,8:16,9:18,10:20,11:18,12:16});
// Every stop adds a concrete draft element or reaches a review. No timer gates play.
const task = (goal, cost, stops, discount = '') => ({goal,cost,stops,discount});
export const CAREER_TASKS = Object.freeze({
  methods:task(18,4,[6,12,18]), roles:task(18,5,[6,12,18]), proposal:task(12,3,[6,12],'practice'),
  coherent:task(12,3,[6,12],'method'), staged:task(18,6,[6,12,18],'practice'),
  evidence:task(24,6,[8,16,24],'practice'), bounded:task(18,5,[6,12,18],'method'), construct:task(24,8,[8,16,24],'practice'), defense:task(12,4,[6,12]),
  dossier:task(18,4,[6,12,18],'practice'), retarget:task(6,1,[6],'dossier'), negotiate:task(12,5,[6,12]),
  portability:task(24,6,[8,16,24],'practice'), carry:task(12,4,[6,12],'method'), compare:task(24,7,[8,16,24]), program:task(18,6,[6,12,18],'practice'),
  portfolio:task(24,6,[8,16,24],'practice'), operate:task(18,5,[6,12,18],'practice'), appraisal:task(12,3,[6,12],'retrieval'), repair:task(12,4,[6,12]), conditions:task(18,6,[6,12,18]), tenure:task(12,3,[6,12],'retrieval'),
  anchor:task(18,6,[6,12,18]), safeguard:task(12,5,[6,12]), lineage:task(12,4,[6,12]), promotion:task(12,4,[6,12],'retrieval'),
  national:task(18,5,[6,12,18]), correction:task(6,2,[6]), sustained:task(12,4,[6,12]), safeguard2:task(6,3,[6]), nationalBound:task(12,3,[6,12]), nationalShared:task(18,6,[6,12,18]), nomination:task(6,2,[6]),
  legacyPreparation:task(18,6,[6,12,18]), legacyNarrow:task(12,5,[6,12]), legacyShared:task(18,8,[6,12,18])
});
export const SKILL_PRICE = 3;
export const QUALITY_FLOOR = 40;
export const QUALITY_LOSS = 60;
