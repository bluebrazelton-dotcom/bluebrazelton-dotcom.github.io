// Chapter 3 production expression of the confirmed eleven-unit roster.
// Prices and work counts live in chapter3-balance.js; this file owns readable content.
export const RESEARCH_FOCUSES = Object.freeze({
  legibility: {
    owner: 'C03-END-01', label: 'Can people find the route?', title: 'Route-legibility map',
    preview: 'Compare source visibility, advising language and the steps someone must discover.',
    rows: [
      ['Published route', 'Cedar Vale lists an evening certificate on its public program page.'],
      ['Missing step', 'The application instructions link to a separate advising page, which links to a dated form.'],
      ['Source conflict', 'The public page says “apply online”; the current advising note says a meeting comes first.'],
      ['Claim boundary', 'A published route is not necessarily findable or understandable. We have no evidence about every applicant’s experience.']
    ],
    challenge: 'Your first row marks the certificate “available.” Nia follows its links and finds three different starting points. Tomas confirms that the advising meeting comes first. The row describes publication, not whether someone can find a usable sequence.',
    smaller: 'Source-conflict note',
    claim: 'The sources disagree about the first application step; this map can locate that disagreement, not establish how every applicant navigates it.',
    category: 'Published route; starting instructions conflict; advising confirmation needed',
    need: 'How do people discover and interpret the sequence? A new study would need participant agreement and an appropriate way to observe that process.',
    returnUse: 'Tomas receives the source-conflict note for the next advising-materials review. It identifies the conflicting links; it does not authorize changing the published page.',
    inquiry: 'How does the visibility of application steps shape which education-to-work routes people can find?',
    later: 'A source-sequence map to help design a graduate inquiry about discoverability.'
  },
  usability: {
    owner: 'C03-END-01-V01', label: 'Can people actually use it?', title: 'Practicability map',
    preview: 'Compare schedules, costs, care, transport and access requirements; preserve unknowns.',
    rows: [
      ['Published offer', 'The certificate offers evening classes and a required daytime placement.'],
      ['Use conditions', 'The placement timetable and travel cost are known; individual work and care arrangements are not.'],
      ['Evidence gap', 'A permitted aggregate table counts offers. It does not record whether a particular person could take one.'],
      ['Claim boundary', 'An offer does not establish practicability. An unknown care or access condition stays unknown.']
    ],
    challenge: 'Your “available” row combines evening classes with a daytime placement. Tomas points out the placement window; Nia asks where your table records care or transport conditions. It does not. Counting an offer cannot establish that people can use it.',
    smaller: 'Use-conditions note',
    claim: 'The route is offered under documented timetable and placement conditions; whether it fits a particular person’s circumstances remains unknown.',
    category: 'Offered; placement and travel conditions documented; individual feasibility unknown',
    need: 'Which conditions make an offer practicable? A new study would require permission and a suitable way to learn about people’s circumstances.',
    returnUse: 'Tomas receives the use-conditions note for the placement briefing. It keeps documented conditions separate from unknown individual circumstances; no participant is assigned a feasibility score.',
    inquiry: 'Which documented and unrecorded conditions make an education-to-work offer practicable?',
    later: 'A conditions map to help frame a graduate inquiry about practicability.'
  },
  carryover: {
    owner: 'C03-END-01-V02', label: 'What survives a change of route?', title: 'Carryover map',
    preview: 'Trace recognized prior work, transfer terms and support after a route changes or closes.',
    rows: [
      ['Changed route', 'An old certificate closes; a public transfer notice describes an alternate entry route.'],
      ['Retained work', 'Some completed coursework may count, subject to individual review. Advising contacts remain available.'],
      ['Unresolved outcome', 'The permitted aggregate table says “did not complete” without recording later transfer or changed aims.'],
      ['Claim boundary', 'Leaving the original route does not establish that all work or progress was lost. Individual carryover is unconfirmed.']
    ],
    challenge: 'The table labels departure “did not complete.” Tomas shows the transfer notice; Nia finds that the category has no place for retained coursework or changed aims. Your existing material cannot tell you what happened after departure.',
    smaller: 'Carryover-questions note',
    claim: 'The material records departure from the original route, not the loss of all prior work; possible carryover needs individual confirmation.',
    category: 'Original route left; possible carryover identified; later outcome unrecorded',
    need: 'What work and relationships carry forward after a route changes? A new study would need current permission and evidence about subsequent routes.',
    returnUse: 'Tomas receives the carryover-questions note for transfer advising. It identifies questions to ask; it neither grants transfer credit nor claims that departure was failure.',
    inquiry: 'What work and relationships carry forward when an education-to-work route changes or closes?',
    later: 'A carryover map to help design a graduate inquiry about changed routes.'
  }
});

const stage = (phase, id, label, title, description) => ({chapter:3, phase, id, label,
  title, description, caption:'Cedar Vale State University · shared research room',
  note:'Keep sources, unknowns and the people responsible for each decision visible.'});
export const RESEARCH_STAGES = {
  c3_intro: stage('Opening','C03-OPN-01','Undergraduate research · your role','A first research contribution','Join a supervised study of local education-to-work routes. Your contribution is small, source-linked and credited by name.'),
  c3_work: stage('Work','C03-END-01','Research · common contribution','Build the source profile','Compare three institutions’ public descriptions with the study’s permitted materials. “Available” is a starting category, not yet a conclusion.'),
  c3_skill: stage('Learn','C03-ABL-01','Research · methods practice','Bound the Claim','Dr. Shah asks you to put what a source establishes beside what it leaves unknown. You have earned enough Progress to practice this distinction.'),
  c3_credit: stage('Recognition','C03-MIL-01','Research · first contribution','Your work belongs in the methods appendix','Dr. Shah reviews your completed source profile. Recording this contribution earns one new Standing; the inquiry itself still needs a focus.'),
  c3_focus: stage('Choose','C03-END-01','Research · choose a focus','What needs a closer look?','Choose one question for this project. Each produces a different map and evidence problem. None selects a permanent scholarly path.'),
  c3_focal: stage('Work','C03-END-01','Research · focal map','Develop your research map','Keep documented conditions beside the things your sources cannot establish.'),
  c3_review: stage('Review','C03-REV-01','Research · evidence challenge','One category hides different situations','Your completed map exposes a problem with “available.” Choose how to revise the interpretation and return useful work.'),
  c3_response: stage('Work','C03-REV-01-R01','Research · response in progress','Revise and prepare the return','Your selected response is pending until the work and its return are completed. Contributor terms remain visible.'),
  c3_return: stage('Return','C03-REV-01-R01','Research · completed response','Put the revised work into use','The draft is finished. Return the artifact with its source limits, contributor credit and use terms. Selecting a response alone earns no commitment evidence.'),
  c3_done: stage('Transition','C03-CST-01','Research · graduate preparation','A question worth carrying forward','Your contribution is credited and the revised work has been returned. Carry this bounded inquiry into graduate preparation.'),
  c4_opening: {...stage('Opening','C03-CST-01','Graduate preparation · chapter boundary','Learning to investigate a question','After completing your undergraduate degree, you begin master’s study. Carry your inquiry into a new project with current evidence, permissions and supervision.'),chapter:4,caption:'Graduate preparation · chapter boundary',note:'The optional Chapter 4 feasibility Opening appears inside the new design.'}
};

export const RESEARCH_POPUPS = {
  'chapter3-intro': {eyebrow:'Chapter 3 · Entering Inquiry',title:'Your first research role',tone:'warm',next:'Read the role and source terms, then begin.',button:'Read the project'},
  'research-credit': {eyebrow:'Research · common contribution',title:'Named work, named credit',tone:'warm',next:'Record this contribution, then choose a focus.',button:'Read the contribution'},
  'research-challenge': {eyebrow:'Research · evidence challenge',title:'The spreadsheet needs a better question',tone:'warm',next:'Compare a smaller claim with a joint interpretation.',button:'Consider the responses'},
  'research-returned': {eyebrow:'Research · work returned',title:'An inquiry you can stand behind',tone:'warm',next:'Carry the question into graduate preparation.',button:'Read your inquiry'},
  'energy-exhausted-c3': {eyebrow:'Chapter 3 · Energy spent',title:'The sources have not become simpler',tone:'warm',chapter:3,body:'You reread the same source line and lose your place. Research still moves forward at zero Energy, but further drafting and coordination will be less polished. Your source limits and contributor terms still matter. Finished work remains acceptable for its stated goal; rest at a later chapter break supports future work.',next:'Continue the inquiry; watch the quality of the remaining work.',button:'Keep the limits visible'}
};

export const RESEARCH_PORTRAIT = {
  normal:'assets/research-room.webp', depleted:'assets/research-room-tired.webp',
  normalAlt:'The curly-haired, medium-brown protagonist compares research sources with Nia at a university table.',
  depletedAlt:'The protagonist rests their head on one hand, tired while revising research notes in the same university room.'
};
