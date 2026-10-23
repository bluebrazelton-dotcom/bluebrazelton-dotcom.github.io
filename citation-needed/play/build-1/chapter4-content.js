// Record jobs are confirmed. Exact people, prose and artifacts are trial expressions.
export const MASTERS_FOCUSES = {
  legibility:{id:'C04-END-01',title:'Route-Legibility Comparison Plan',
    question:'What could a prospective student know at each step of finding a route?',
    evidence:'Dated public notices, advising-sequence documents and current deidentified offer counts.',
    exclusion:'No claim about what an individual saw, understood or eventually achieved.',
    dependency:'Comparable publication dates across two programs',
    collision:'One program retains only its current notice. You cannot reconstruct a matched information window or infer what earlier applicants knew.',
    narrow:'Compare the currently documented entry sequences; identify where the public explanation leaves a step unspecified.',
    alternate:'A current partner-maintained, dated notice archive supports a bounded comparison of publication sequences.',
    next:'How do prospective students interpret the sequence of notices when the timing is documented?'},
  usability:{id:'C04-END-01-V01',title:'Usability Conditions Design',
    question:'Which documented conditions make a nominal offer practically usable?',
    evidence:'Current program schedules, published fees, coordination rules and deidentified take-up totals.',
    exclusion:'Aggregate take-up cannot identify personal motives or establish a causal effect.',
    dependency:'Comparable schedules and cost definitions across two programs',
    collision:'The schedules omit required placement hours, and the totals combine incompatible fee definitions. Nominally similar offers cannot support the intended usability comparison.',
    narrow:'Describe the documented requirements and unresolved conditions in one current offer; do not rank programs by usability.',
    alternate:'A current partner planning ledger documents required hours and fee definitions for a bounded conditions comparison.',
    next:'How do students coordinate paid work and required placement hours under these documented conditions?'},
  carryover:{id:'C04-END-01-V02',title:'Carryover and Redirection Design',
    question:'What effort can carry forward when a route changes or closes?',
    evidence:'Versioned program requirements, current transition rules and deidentified redirection counts.',
    exclusion:'A transition count does not establish choice, forced closure or personal loss.',
    dependency:'A documented distinction between voluntary change and program closure',
    collision:'The administrative category combines voluntary changes with closures. The first design cannot distinguish why a route changed or which prior work was preserved.',
    narrow:'Map the current rules for recognizing prior work; leave motives and individual trajectories unknown.',
    alternate:'A current partner change register separates program closure from other route changes and records permitted carryover rules.',
    next:'How do people decide which prior work to preserve after an institution changes their route?'}
};
const stage=(phase,id,title,description)=>({chapter:4,phase,id,label:`Master’s study · ${phase.toLowerCase()}`,title,description,
  caption:'Cedar Vale State University · graduate study office',note:'One independent study, a defensible boundary and a real next question.'});
export const MASTERS_STAGES={
  c4_intro:stage('Direct','C04-CON-01','The funded week has footnotes','Your funding package includes fixed teaching hours. Start a small study that can finish within the current access calendar. The calendar has generously reserved all its flexibility for Tuesday.'),
  c4_design:stage('Advance','C04-END-01','Design a study that can finish','Separate the desired claim, minimum evidence, dependency and fallback. Current Chapter 4 sources establish this project; earlier research supplies preparation.'),
  c4_lesson:stage('Review','C04-ABL-01','Minimum Defensible Design','Ordinary methods feedback exposes the dependency early. Practice stating what you can finish even if that dependency fails.'),
  c4_plan:stage('Consolidate','C04-END-01','A feasible initial plan','The initial design and its completion floor are saved. The harder feasibility collision is still ahead.'),
  c4_study:stage('Advance','C04-END-01','Complete the bounded evidence work','Audit the current sources and measurement definitions. Design revision remains productive when demanding coordination is unavailable.'),
  c4_review:stage('Review','C04-REV-01','The design needs what it cannot have','Completed work stays useful. Amend the claim or replace the failed dependency using a currently permitted alternate source.'),
  c4_response:stage('Advance','C04-REV-01-R01','Finish the changed study','A response is selected. Complete its versioned artifact and disclosed obligation before earning a demonstration.'),
  c4_defend:stage('Recognition','C04-MIL-01','Defend the changed project','The committee evaluates the completed bounded contribution, including its limits. A narrower project is a complete master’s result.'),
  c4_doctoral:stage('Opening','C04-OPN-02','A doctoral route with a real question','The defended project supports an ordinary doctoral-formation route: program advising and methods training. No exceptional result or special invitation is required.'),
  c4_capstone:stage('Consolidate','C04-CST-01','Own the boundary','Record independent design, retain the effective evidence chain and carry the bounded next question forward.'),
  c5_opening:{...stage('Opening','C05-OPN-01','Doctoral formation begins here','A defended master’s contribution and a bounded question open doctoral formation. Continue when you are ready to begin the next chapter.'),chapter:5,caption:'Doctoral formation · next chapter',note:'The next chapter establishes candidacy, committee and dissertation planning.'}
};
export const MASTERS_POPUPS={
  'chapter4-intro':{eyebrow:'Chapter 4 · Independent Design',title:'A small study you can own',tone:'warm',body:'Your teaching hours and access calendar shape the project. Rest starts a local 12-Energy chapter budget; a pressured calendar starts at 9. Your guide can help prepare the design. Only the current source owners can authorize its use. All four legacy paths remain open.',next:'Read the new project terms and choose the baseline or optional calendar alignment.',button:'Read the design conditions'},
  'masters-challenge':{eyebrow:'Master’s study · feasibility review',title:'Keep the work; change the design',tone:'warm',body:'The known dependency cannot support the intended claim. The original design, source audit and measurement notes remain yours. The smaller response completes the degree; an alternate-source response appears only with current owner, permission and workload terms.',next:'Read the failed dependency and choose a defensible response.',button:'Read the changed conditions'},
  'masters-defended':{eyebrow:'Master’s study · formal recognition',title:'Defended in its changed form',tone:'warm',body:'The Cedar Vale master’s committee recognizes your bounded contribution: one new Standing from the committee’s recognition. The completed response’s obligation is recorded once. A real next question opens doctoral formation through the ordinary program route.',next:'Read the doctoral-formation route and consolidate the inquiry.',button:'Read the next route'},
  'energy-exhausted-c4':{eyebrow:'Chapter 4 · Energy spent',title:'The calendar has used its footnotes',tone:'warm',chapter:4,body:'You lose your place in the design note. Further work at zero Energy is less polished, but source audit, revision and question preparation still count. Finished quality and evidence limits remain saved. The bounded master’s result and ordinary doctoral route remain available.',next:'Continue the changed project; watch the remaining draft’s quality.',button:'Keep the completion floor'}
};
export const MASTERS_PORTRAIT={normal:'assets/masters-office.webp',depleted:'assets/masters-office-tired.webp',
  normalAlt:'The curly-haired protagonist independently drafts a master’s design at a graduate office desk.',
  depletedAlt:'The protagonist rests one hand against her forehead, tired beside her master’s design and laptop.'};
