// Production trial, October 12, 2026. Numbers are independent of presentation.
export const BALANCE = Object.freeze({
  energy: [6,8,10,11,12,13,14,15,16,17,18,19],
  focusedCost: [2,3,4,4,5,5,6,6,7,7,8,8],
  broadCost: [4,6,8,9,10,11,12,13,14,15,16,17],
  boundedCost: [2,3,3,4,4,5,5,6,6,7,7,8],
  sharedCost: [3,4,5,6,6,7,8,8,9,10,11,12],
  firstReward: 3, responseReward: 4, helpCost: 1,
  qualityLoss: 60, qualityFloor: 40, maxEvents: 1200,
  upgrades: {
    catalog: {chapter:2,cost:4},
    crosswalk: {chapter:5,cost:7},
    workshop: {chapter:8,cost:10}
  }
});
