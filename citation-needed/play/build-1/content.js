// Playable wording for the confirmed Chapter 1–2 record jobs. Exact copy remains open to review.
export const CHAPTER_ENERGY_STORY = Object.freeze({ 2: 'Your school preparation gives you more room to take on a university week.' });
export const CHECK_ENERGY_WARNING = 'Further work loses polish.';
export const PROJECT_CHECK_COPY = Object.freeze({
  upcoming: 'Source check at 10/30, before the next step.',
  continue: 'Continuing skips the check.',
  unavailable: 'No Energy for the source check; work still counts.',
  label: 'Check the sources once'
});
export const WORK_ENERGY_LABELS = Object.freeze({
  week: Object.freeze({ 12:'Try the study blocks', 24:'Finish the weekly plan' }),
  extra: Object.freeze({ 10:'Gather source notes', 30:'Submit the paper' }),
  session: Object.freeze({ 10:'Gather source notes', 30:'Finish the inquiry note' })
});
export const PACKET_ENERGY_STEPS = Object.freeze([
  Object.freeze({ at:10, label:'Finish the question' }),
  Object.freeze({ at:20, label:'Assemble the packet' })
]);
export const STUDY_CHOICES = Object.freeze({
  protected: Object.freeze({ label:'One long study block', workStory:'One uninterrupted stretch cuts repeated setup, so your preparation moves faster. The department still owns the full class schedule.' }),
  distributed: Object.freeze({ label:'Several short study blocks', workStory:'Try your plan in the gaps between classes and paid shifts, conserving Energy for later work. The department still owns the full class schedule.' })
});
export const STAGES = {
  c1_start: { chapter: 1, phase: 'Choose', id: 'C01-END-01', label: 'High school · first project', title: 'Which paths are open?', description: 'For class, you compare nearby college and training options. Their websites describe programs and application steps but leave some practical questions unanswered.', caption: 'Hillside Public High School · after class', note: 'Make a list of what the pages say and what you still need to ask.' },
  c1_trace: { chapter: 1, phase: 'Work', id: 'C01-END-01', label: 'High school · check the websites', title: 'Check two college or training websites', description: 'Read a program page on each website. Write down one entry requirement and one question the page does not answer.', caption: 'Hillside Public High School · school route board', note: 'Each check adds Progress and costs Energy. The finished list helps you learn a lasting skill.' },
  c1_invest: { chapter: 1, phase: 'Upgrade', id: 'C01-ABL-01', label: 'High school · first upgrade', title: 'Learn to spot missing details', description: 'Notice what a program page leaves unanswered and who can clarify it. Spend 3 Progress to keep using that skill.', caption: 'Hillside Public High School · a useful habit forms', note: 'You will notice the workshop’s nomination requirement early. That saves 1 Energy when you prepare your packet.' },
  c1_opening: { chapter: 1, phase: 'Choose', id: 'C01-OPN-01', label: 'High school · workshop lead', title: 'A workshop could help', description: 'Ms. Ortiz sees your work and points you to a regional workshop. You do not yet know whether Hillside can nominate students. You can still prepare useful materials.', caption: 'Hillside Public High School · Ms. Ortiz offers a lead', note: 'You know about the nomination question before spending more effort. The state university remains an option.' },
  c1_prep: { chapter: 1, phase: 'Work', id: 'C01-OPN-01', label: 'High school · workshop packet', title: 'Build the workshop packet', description: 'Put your list, a better question, and your sources together. Each press adds a little work. The packet stays useful even if the workshop closes.', caption: 'Hillside Public High School · workshop packet', note: 'This packet takes 20 work presses. Your new skill saves 1 Energy.' },
  c1_review: { chapter: 1, phase: 'Decision', id: 'C01-REV-01', label: 'High school · workshop notice', title: 'The workshop route closes', description: 'The workshop now accepts nominations only from partner schools. Hillside is not one. The eligibility rule closes this route; your packet remains useful.', caption: 'Hillside Public High School · workshop notice', note: 'Your work is still useful. Choose what to do with it.' },
  c1_boundary: { chapter: 1, phase: 'Chapter result', id: 'C01-CST-01', label: 'High school · route plan', title: 'The state university is still open', description: 'You make a plan for Cedar Vale State University. The workshop closed, but your work helps with the next step.', caption: 'Hillside Public High School · route plan complete', note: 'Both choices lead to Cedar Vale. Your choice changes what you bring.' },
  c2_plan: { chapter: 2, phase: 'Choose', id: 'C02-CON-01 · C02-END-01', label: 'University · first week', title: 'Make a week you can use', description: 'A long study block moves preparation faster; short blocks leave more Energy for later work. Make room around class and paid shifts.', caption: 'Cedar Vale State University · Student Commons', note: 'Your choice sets up the work you will do next.' },
  c2_work: { chapter: 2, phase: 'Work', id: 'C02-END-01', label: 'University · try the plan', title: 'Try the plan', description: 'Try your study plan around that class. The main planner shows the lecture time, but the department has the full schedule. You can check it early.', caption: 'Cedar Vale State University · weekly plan', note: 'The work bar moves with each press. At zero Energy, your presses still count.' },
  c2_review: { chapter: 2, phase: 'Decision', id: 'C02-REV-01', label: 'University · schedule clash', title: 'A class time overlaps your shift', description: 'Your plan is saved. Another section is open, but Samira and the front desk cannot move class times.', caption: 'Cedar Vale State University · schedule update', note: 'Choose how to make the week work.' },
  c2_choose: { chapter: 2, phase: 'Choose', id: 'C02-CST-01', label: 'University · choose a path', title: 'Choose your next step', description: 'Your week is workable again. Your instructor offers an extra-credit paper, and a public research interest session is listed. Choose one to pursue now.', caption: 'Cedar Vale State University · work takes shape', note: 'Both paths can lead to public research next steps. Your choice changes what you do first.' },
  c2_aim: { chapter: 2, phase: 'Choose', id: 'C02-CST-01', label: 'University · project aim', title: 'What question will guide the work?', description: 'Pick a question for this project. Useful work stays with you either way.', caption: 'Cedar Vale State University · a question takes shape', note: 'Either aim leaves useful work. A check can clarify limits, but cannot create an opening.' },
  c2_switch: { chapter: 2, phase: 'Choose', id: 'C02-END-01 · C02-CST-01', label: 'University · change project', title: 'Put your notes to another use?', description: 'Source notes can help either project. Drafting, questions and session work stay attached to the project where you did them.', caption: 'Cedar Vale State University · useful notes stay', note: 'Review what carries over before choosing. Your work and Energy stay saved.' },
  c2_contribute: { chapter: 2, phase: 'Work', id: 'C02-CST-01', label: 'University · chosen path', title: 'Follow your chosen path', description: 'Gather notes, then finish your chosen work. Recognition comes after review.', caption: 'Cedar Vale State University · project in progress', note: 'The work bar moves with each press. An optional check can improve the result.' },
  c2_feedback: { chapter: 2, phase: 'Feedback', id: 'C02-CST-01', label: 'University · feedback', title: 'See what your work adds up to', description: 'A teacher or research facilitator responds to your finished work. Read what they accepted and what still needs a clear limit.', caption: 'Cedar Vale State University · reviewed work', note: 'Standing arrives when the finished work is recognized in the next step.' },
  c2_done: { chapter: 2, phase: 'Chapter result', id: 'C02-MIL-01 · C02-OPN-01', label: 'University · next door opens', title: 'A new research door opens', description: 'Your finished work is recognized. Cedar Vale’s public research next-steps page now shows supervised projects, methods preparation, course credit, and who to contact.', caption: 'Cedar Vale State University · the next public route', note: 'Your finished work opened a public path into research.' }
};

export const FORMS = {
  extra: { title: 'Extra-Credit Inquiry Paper', subtitle: 'Extra credit · Introduction to Social Inquiry', workButton: 'Work on the extra-credit paper', workSteps: ['Gather source notes for the paper', 'Draft the extra-credit paper', 'Revise the paper and check its limits'], creditSource: 'course instructor', body: 'Use one class idea and two current university pages to explain how a first-year student can find a supervised research opportunity. Name one question the pages do not answer.', short: 'An extra-credit paper about finding undergraduate research.', review: 'Your instructor asks you to narrow the paper to one route and name what the public pages cannot promise. The revision can earn extra credit.', reviewChecked: 'Your extra check kept the paper focused on one current route. Your instructor is ready to credit it.', ending: 'Your instructor credits the finished paper for its careful account of one public research route and its limits.' },
  session: { title: 'Research Interest Session', subtitle: 'Public session · undergraduate research office', workButton: 'Prepare for the interest session', workSteps: ['Gather notes for the session', 'Prepare two research questions', 'Attend and write a follow-up note'], creditSource: 'research facilitator', body: 'Read the public session page, prepare two questions about supervised research, attend the session, and write down one next step. The facilitator reviews your short inquiry note.', short: 'An interest session with prepared questions and a follow-up note.', review: 'The facilitator says your questions and inquiry note are useful. Check the current sign-up page before assuming a project place is yours.', reviewChecked: 'Your extra check found the current sign-up page. The facilitator confirms your inquiry note and public follow-up route.', ending: 'The facilitator recognizes your prepared questions and inquiry note. You have a public follow-up route, not a promised project place.' },
  // Older saved games may still be partway through the previous two-form prototype.
  memo: { title: 'Access in Practice Memo', subtitle: 'Class paper · Introduction to Social Inquiry', workButton: 'Work on the class paper', creditSource: 'course instructor', body: 'Use one class idea and two current university pages to explain why a course can look open online but still need a department code. Say what the pages show and what they leave out.', short: 'A class paper about the course sign-up gap, with a clear limit on its claim.', review: 'The instructor asks you to describe this term’s sign-up steps without claiming they work the same for everyone. Your revised paper counts as finished class work.', reviewChecked: 'Your extra check named the current sign-up steps. The instructor accepts your paper after a normal revision.' },
  handoff: { title: 'Verified Referral Handoff', subtitle: 'Campus resource guide · staff review', workButton: 'Work on the campus guide', creditSource: 'Commons staff coordinator', body: 'Check which office handles one referral, what a student needs, when you checked it, who updates the guide, and where to go if the first route fails. Do not use anyone’s private story.', short: 'A checked campus guide with a named person who keeps it current.', review: 'The coordinator credits your guide for local use, but asks you not to promise what another office will do. Your checked correction counts.', reviewChecked: 'Your extra check named the office in charge and the guide’s limit. The coordinator accepts it into the current guide after a normal revision.' }
};

export const NOTES_ROUTINE = {
  title: 'Organized notes',
  earned: 'Your revised week keeps source links and open questions together.',
  active: 'Organized notes: +2 work per press while gathering notes. Later work: +1 per press.',
  finished: 'Notes preparation finished. The remaining work advances +1 per press.'
};

// Presentation of existing work, not extra actions, rewards, or saved milestones.
export const WORK_BEATS = {
  packet: [
    { end: 5, detail: 'Gather the pages you checked.' },
    { end: 10, detail: 'Compare the entry requirements and application steps. Note what you still need to ask.' },
    { end: 15, detail: 'Write the question about school nominations.' },
    { end: 20, detail: 'Check the source list and make the packet clear.' }
  ],
  plan: [
    { end: 6, detail: 'Put the listed class times and paid shifts on your plan.' },
    { end: 12, detail: 'Fit your chosen study blocks around those fixed times.' },
    { end: 18, detail: 'Try the pattern with reading and class preparation.' },
    { end: 24, detail: 'Keep what worked and note what still needs checking.' }
  ],
  extra: [
    { end: 10, detail: 'Gather notes from two public pages and connect one class idea.' },
    { end: 20, detail: 'Turn the notes into a draft. Separate facts from open questions.' },
    { end: 30, detail: 'Revise the claim and name what the pages cannot promise.' }
  ],
  session: [
    { end: 10, detail: 'Read the public session page and gather notes on research routes.' },
    { end: 20, detail: 'Use your notes to prepare two questions about supervised research.' },
    { end: 30, detail: 'Attend with your questions, then write a note on the public next step.' }
  ]
};

// Concise receipts for the dashboard; saves keep the complete original record text.
export const RECORD_LABELS = {
  'Rules and questions list · finished': 'Entry steps and questions · finished',
  '2-website rules and questions list · finished': '2-website entry steps and questions · finished',
  '3-website rules and questions list · finished': '3-website entry steps and questions · finished',
  'Spot missing rules · learned skill': 'Spot missing details · learned',
  'Workshop packet · ready to reuse': 'Packet · ready to reuse',
  'Open routes note · current answers': 'Open routes · checked',
  'Cedar Vale plan · university route open': 'University route · open',
  'Find the current class times · learned skill': 'Current class times · learned',
  'Organized notes · faster project preparation': 'Organized notes · faster prep',
  'Public research next steps · now open': 'Research next steps · open',
  'Extra-credit paper · credited by instructor': 'Extra-credit paper · credited',
  'Research interest session · inquiry note recognized': 'Session inquiry note · recognized',
  'Study plan that works · finished': 'Study plan · finished',
  'Cedar Vale plan · reused packet': 'University plan · reused packet',
  'Cedar Vale plan · open routes note': 'University plan · routes checked',
  'Samira helped prepare the question · credited': 'Samira helped with a question',
  'Paper preparation · class idea linked to one public route and its limits': 'Paper · class idea and source limits',
  'Paper preparation · wider claim narrowed to one current route': 'Paper · wider claim narrowed',
  'Paper preparation · page comparison kept; project-owner question saved': 'Paper · comparison and question kept',
  'Session preparation · two questions and current public follow-up saved': 'Session · questions and next step kept',
  'Session preparation · inquiry note revised to a public contact route': 'Session · note narrowed to contact route',
  'Session preparation · inquiry note kept; ask project owner about next opening': 'Session · note and timing question kept',
  'Shared source notes · reused between paper and session': 'Source notes · reused between projects',
  'Project finish · Energy left for a calm final read': 'Project finish · Energy left',
  'Project finish · tired, with required work complete': 'Project finish · tired but complete',
  'Project finish · Energy spent; required work submitted': 'Project finish · spent, submitted'
};

// Preserve saved receipt identifiers while using the current wording at every size.
export const RECORD_WORDING = Object.freeze({
  'Rules and questions list · finished':'Entry steps and questions list · finished',
  '2-website rules and questions list · finished':'2-website entry steps and questions list · finished',
  '3-website rules and questions list · finished':'3-website entry steps and questions list · finished',
  'Spot missing rules · learned skill':'Spot missing details · learned skill'
});

// Presentation anchors for already-earned accomplishments. Drafts, preparation,
// invitations and routine chapter-complete receipts keep their ordinary style.
const RECORD_MILESTONES = [
  [/^Cedar Vale plan · university route open$/, 'University route opened'],
  [/^Extra-credit paper · credited by instructor$/, 'Extra-credit paper credited'],
  [/^Research interest session · inquiry note recognized$/, 'Research inquiry recognized'],
  [/^Class paper · credited contribution · teacher$/, 'Class paper credited'],
  [/^Campus guide · credited contribution · Commons coordinator$/, 'Campus guide recognized'],
  [/^Source profile · methods-appendix contribution credited by Dr\. Shah$/, 'Research contribution credited'],
  [/^C04-MIL-01 · defended bounded master’s contribution · Cedar Vale committee$/, 'Master’s contribution defended'],
  [/^Doctoral candidacy · /, 'Advanced to doctoral candidacy'],
  [/^Doctorate defended · /, 'Doctorate defended'],
  [/^Accepted .+ · known workload and access terms$/, null],
  [/^Assistant professor · /, 'Assistant professor'],
  [/^Durable academic security · /, 'Durable academic security'],
  [/^Full professor · /, 'Full professor'],
  [/^Distinguished Professor · elected to the National Academy$/, 'Distinguished Professor · Academy member'],
  [/^(Field-Defining Scholar|Public Scholar|Institution Builder|Generational Mentor) · (full|changed|protected) handoff enacted · /, null]
];
export function recordMilestone(item) {
  const match=RECORD_MILESTONES.find(([pattern])=>pattern.test(item));
  return match ? match[1] || item.split(' · ')[0] : null;
}

// Short story beats for the playable slice. These explain existing results; they do not grant rewards.
// Each future chapter supplies its own matched normal/depleted protagonist pair.
export const CHAPTER_PORTRAITS = Object.freeze({
  1: Object.freeze({ normal:'assets/high-school.png', depleted:'assets/high-school-tired.png', depletedAlt:'The tired protagonist holds college research pages outside the high school.' }),
  2: Object.freeze({ normal:'assets/state-university-desk-v2.png', depleted:'assets/state-university-tired.png', depletedAlt:'The tired protagonist rests their head on one hand while working at a university desk.' })
});

export const POPUPS = {
  'energy-exhausted-c1': {tone:'setback',eyebrow:'Chapter 1 · Energy spent',title:'The packet is asking a lot',body:'School, college research and workshop preparation have used your Energy. The questions and pages you have built still count. You can finish, but further work at zero will lose polish. Rest at the chapter break supports what comes next.',next:'Keep your useful work and watch the packet’s quality.',button:'Keep going',chapter:1},
  'energy-exhausted-c2': {tone:'setback',eyebrow:'Chapter 2 · Energy spent',title:'A full week catches up with you',body:'Classes, paid shifts and extra preparation have filled the week. Your university work can still move forward, though another tired pass may leave a rough argument or a hard-to-follow note. Rest at a task break supports future work; it leaves submitted quality as recorded.',next:'Continue with the quality meter beside your work.',button:'Keep going',chapter:2},
  'chapter1-intro': { tone: 'intro', eyebrow: 'Chapter 1 · First Openings', title: 'Your first project starts here', body: 'You want to ask questions people take seriously. At Hillside Public High School, a class project gives you a first step: compare college and training paths. The websites are confident. Your notebook has follow-up questions.', next: 'Choose where to start your list.', button: 'See how to play' },
  'chapter1-instructions': { tone: 'intro', eyebrow: 'How to play', title: 'Work, choose, and keep moving', body: 'Choose an action, then press the work button to fill a task bar. Progress tracks finished work. Energy helps with extra effort, but work still counts at zero. Choices are final. Back undoes work presses, and this browser saves your place.', next: 'Start by choosing which paths to compare.', button: 'Start Chapter 1' },
  'pages-complete': { bodyThree:'Three websites, three sets of entry requirements, and questions worth keeping. Your third college adds another route to compare, with its source and unanswered question saved. Each college or program can confirm its own application details.', tone: 'success', eyebrow: 'Task complete', title: 'Your list is ready', body: 'Two websites, two sets of entry requirements, and questions worth keeping. Your list now separates what a page says from what someone still needs to confirm. That is a habit you can use well beyond this assignment.', next: 'Spend 3 Progress to learn a skill you can use again.', button: 'Continue' },
  'packet-complete': { bodyThree:'Your packet compares three options with their sources and open questions. The extra college remains in your comparison. Ms. Ortiz helps you keep the nomination question beside its sources; only the workshop can confirm eligibility.', tone: 'success', eyebrow: 'Task complete', title: 'The packet is ready', body: 'The loose pages have become a packet: a comparison, a question, and sources you can find again. “Now we know what to ask,” Ms. Ortiz says. Hillside’s nomination eligibility still needs confirmation.', next: 'Read the workshop notice when you are ready.', button: 'Read the result' },
  'workshop-closure': { tone: 'setback', eyebrow: 'Workshop notice', title: 'This route is closed', body: 'The workshop now accepts nominations only from partner schools. Hillside is not one. “That answers the nomination question,” Ms. Ortiz says. “Your comparison is still yours.” The packet has another use; Cedar Vale remains open.', next: 'Choose how to use what you made.', button: 'Choose a next step' },
  'chapter2-intro': { tone: 'intro', eyebrow: 'Chapter 2 · Finding Your Footing', title: 'Welcome to Cedar Vale', body: 'At Cedar Vale State University, you want to move from reading about research to doing it. First comes a week that fits class and paid work. The calendar has plenty of blank space. Your obligations have other ideas.', next: 'Choose a study pattern, then try it.', button: 'Start Chapter 2' },
  'plan-complete': { tone: 'setback', eyebrow: 'Task complete · schedule update', title: 'A class time overlaps your shift', body: 'Your week has taken shape. Then the department’s discussion timetable arrives: one required hour overlaps your paid shift. The main planner showed the lecture, not the whole class. Another section is open; your notes and planning work carry forward.', next: 'Choose whether to rebuild your week or ask the department.', button: 'Choose a response' },
  'project-complete': { tone: 'review', eyebrow: 'Task complete · feedback', title: 'Your chosen work is finished', body: { extra: 'Your extra-credit paper is ready. The instructor wants one clear research route and an honest limit on what the pages can promise.', session: 'You attended the interest session and finished your inquiry note. The facilitator reviews your prepared questions and points you to the current follow-up page.', memo: 'Your paper about the course sign-up gap is ready. The instructor wants the steps tied to this term, without claiming every student has the same experience.', handoff: 'Your campus guide is ready. Commons staff can use it locally, but they want its limits stated clearly.' }, bodyChecked: { extra: 'Your extra check kept the paper focused. The instructor is ready to credit it.', session: 'Your extra check found the current sign-up page. The facilitator confirms your inquiry note and follow-up route.', memo: 'Your extra check named the current sign-up steps. The instructor accepts your paper after a normal revision.', handoff: 'Your extra check named the office and the guide’s limit. Commons staff accept the corrected guide.' }, next: 'Read the feedback, then record the finished work.', button: 'Read the feedback' },
  'chapter2-result': { tone: 'success', eyebrow: 'Chapter 2 complete', title: 'Your work opened a door', body: { extra: 'Your instructor accepted the extra-credit paper. You gained 1 Standing, and Cedar Vale’s public research next steps are available.', session: 'The facilitator recognized your session questions and inquiry note. You gained 1 Standing, and the public follow-up page is available.', memo: 'Your instructor recognized your finished paper. You gained 1 Standing, and public research next steps are available.', handoff: 'Commons staff recognized your finished guide. You gained 1 Standing, and public research next steps are available.' }, next: 'Begin undergraduate research in Chapter 3 when you are ready.', button: 'See the result' }
};
