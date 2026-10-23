// Creator-authorized first Chapter 3 trial. Later chapter increases remain open.
export const RESEARCH_BALANCE = Object.freeze({energy:10, skillPrice:3, peerPrice:1,
  commonBoostEnd:10, claimBoostEnd:6, peerBoostEnd:6, boostedWork:2});
export const RESEARCH_TASKS = Object.freeze({
  common: Object.freeze({goal:24, interval:4, charges:[{at:0,cost:1},{at:12,cost:1},{at:24,cost:1}]}),
  focal: Object.freeze({goal:18, interval:3, charges:[{at:0,cost:1},{at:9,cost:1},{at:18,cost:1}]}),
  bounded: Object.freeze({goal:12, interval:2, charges:[{at:0,cost:1},{at:12,cost:1}]}),
  shared: Object.freeze({goal:24, interval:4, charges:[{at:0,cost:1},{at:12,cost:2},{at:24,cost:1}]})
});
