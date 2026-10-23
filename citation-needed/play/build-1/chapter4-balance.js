// Chapter 4 implementation trial; campaign balance and human pacing remain open.
export const MASTERS_BALANCE = Object.freeze({energy:12, pressuredEnergy:9, skillPrice:3, guidePrice:1, boost:2});
export const MASTERS_TASKS = Object.freeze({
  design:{goal:24, interval:4, charges:[{at:0,cost:1},{at:12,cost:1},{at:24,cost:1}]},
  study:{goal:24, interval:4, charges:[{at:0,cost:1},{at:12,cost:2},{at:24,cost:1}]},
  narrow:{goal:12, interval:2, charges:[{at:0,cost:1},{at:12,cost:1}]},
  replace:{goal:18, interval:3, charges:[{at:0,cost:1},{at:9,cost:2},{at:18,cost:1}]}
});
