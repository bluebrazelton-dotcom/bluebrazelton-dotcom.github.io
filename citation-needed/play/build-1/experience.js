// Reviewable artifact fragments for existing work. No saved state or game effects.
import { reviewQuality, completedWorkReview } from './feedback.js?v=20261013r2';
// A fragment is a student note/draft, never an invitation or another actor's approval.
export const STUDENT_VOICE = {
  start: 'I want to ask questions people take seriously. First, I need a way into college.',
  university: 'I want to do research here. First, class and paid work have to fit on the same page.',
  jordan: 'Jordan: “Keep the page beside the question. It makes asking for help much easier.”',
  samira: 'Samira, during paid hours: “Start with the department timetable. The lecture calendar is only half the conversation.”',
  ortiz: 'Ms. Ortiz: “You have a useful question. Let’s find out who can answer it.”'
};

const PACKET_NOTES = [
  { at: 0, label: 'From my list', text: state => state.scopeVersion === 1 && state.scope === 'wide' ? 'Three programs compared, with entry requirements and unanswered questions beside each source.' : 'College and training pages: entry requirements beside the questions I still need to ask.' },
  { at: 5, label: 'Source note', text: 'The workshop describes the program. A school nomination is a separate step.' },
  { at: 10, label: 'My question', text: 'Can Hillside nominate a student, and who confirms that?' },
  { at: 15, label: 'Packet note', text: state => state.scopeVersion === 1 && state.scope === 'wide' ? 'Keep the third college in the comparison, with its source and open question. Nomination is unconfirmed.' : 'Keep the comparison, question and page references together. Nomination is still unconfirmed.' },
  { at: 20, label: 'Ready to carry', text: state => state.scopeVersion === 1 && state.scope === 'wide' ? 'Three options compared, with sources and questions ready to reuse. The workshop decides nomination.' : 'A finished comparison and a better question. The work can travel even if this route closes.' }
];

const PLAN_NOTES = [
    { at: 0, label: 'Fixed first', text: 'Copy the listed lecture time and paid shifts. The department posts the full discussion times.' },
  { at: 6, label: 'Study space', text: state => state.week === 'protected' ? 'Reserve one long block around the listed class and work times.' : 'Place shorter study blocks in the gaps between class and paid shifts.' },
  { at: 12, label: 'Trial note', text: 'Reading and preparation fit the draft. Required discussion times still need confirmation.' },
    { at: 18, label: 'Question to keep', text: state => state.intervention ? 'The department timetable is located. Which discussion section fits my paid shift?' : 'Where are the discussion times, and which section fits my paid shift?' }
];

const PROJECT_NOTES = {
  extra: [
    { at: 0, label: 'Paper question', text: state => state.projectAim === 'place' ? 'Can these public pages tell me how to get a project place?' : 'How can a first-year student find one public research next step?' },
    { at: 5, label: 'Source note', text: 'The research pages list preparation and contacts. A project owner confirms places.' },
    { at: 10, label: 'Class idea', text: 'Seeing a route and being able to use it are different things.' },
    { at: 15, label: 'Draft to test', text: state => state.projectAim === 'place' && !state.intervention ? 'These listed routes may lead to a project place. What can the pages actually establish?' : 'Public pages show where to start. They cannot promise access to a project.' },
    { at: 20, label: 'Revision margin', text: state => state.projectAim === 'place' && !state.intervention ? 'The access claim needs a project owner. Keep the page comparison and mark the gap.' : 'Limit the argument to one public route and name the question a project owner must answer.' },
    { at: 25, label: 'Closing line', text: state => state.projectAim === 'place' && !state.intervention ? 'My comparison is ready. The place question remains unresolved; the draft still reaches beyond what these pages can confirm.' : 'The pages show a first contact, not a promised place. My comparison records that limit.' }
  ],
  session: [
    { at: 0, label: 'Session purpose', text: state => state.projectAim === 'place' ? 'Ask about getting a project place. The page says none are available now.' : 'Find a public follow-up step I can check after the session.' },
    { at: 5, label: 'Page note', text: 'Public interest session: prepare questions, attend, and keep an inquiry note.' },
    { at: 10, label: 'Question 1', text: 'What preparation helps a first-year student take a supervised research step?' },
    { at: 15, label: 'Question 2', text: state => state.projectAim === 'place' && !state.intervention ? 'Who can confirm another project opening, and when should I ask?' : 'Where can I check the current public follow-up and its requirements?' },
    { at: 20, label: 'Session card', text: 'Two questions, with their source page. A useful answer needs a current contact.' },
    { at: 25, label: 'Follow-up draft', text: state => state.projectAim === 'place' && !state.intervention ? '“No places are listed now. Who can tell me when the next opening might be posted?”' : '“Which current public contact should I use to ask about research preparation?”' }
  ]
};

export function workDocument(state, kind) {
  const work = kind === 'packet' ? state.packetWork : state.work;
  const notes = kind === 'packet' ? PACKET_NOTES : kind === 'plan' ? PLAN_NOTES : PROJECT_NOTES[kind];
  if (!notes) return null; // Historical forms retain their own original presentation.
  const available = notes.filter(note => work >= note.at);
  return available.slice(-2).map(note => ({
    label: note.label,
    text: typeof note.text === 'function' ? note.text(state) : note.text
  }));
}

export function openingDocument(state) {
  if (state.stage === 'c2_plan') return {
    kicker: 'CEDAR VALE · WEEK DRAFT', title: 'A place for study, a place for paid work',
    rows: [{ label: 'Carryover', text: state.recovery === 'packet' ? 'Packet source list and questions.' : 'Open-routes note and current questions.' },
      { label: 'Check', text: 'Department discussion times; lecture time is listed.' }],
    voice: state.samiraSupport ? STUDENT_VOICE.samira : STUDENT_VOICE.university
  };
  if (!['c1_start','c1_trace','c1_invest','c1_opening'].includes(state.stage)) return null;
  const rows = state.marks === 0 ? [{ label: 'First question', text: 'Which pages tell me how to start, and what do they leave unanswered?' }] : [
    { label: 'College page', text: 'Entry steps are listed. Keep the source beside the question it leaves open.' },
    ...(state.marks > 1 ? [{ label: 'Training page', text: 'Compare its entry steps with the college page. Different labels need a careful read.' }] : []),
    ...(state.scopeVersion === 1 && state.marks > 2 ? [{label:'Third college',text:'Another college lists an entry route. Keep its source and the question about who confirms requirements.'}] : [])
  ];
  if (state.marks > 2) rows.splice(0,2,{label:'First two sources',text:'College and training entry requirements, with their source pages and open questions.'});
  if (state.capability1) rows[state.marks > 2 ? 0 : rows.length - 1] = { label: 'Workshop question', text: 'Can Hillside nominate students? The school and workshop must confirm that step.' };
  return {
    kicker: 'MY SOURCES & QUESTIONS', title: state.stage === 'c1_start' ? 'A first way in' : `${state.marks}/${state.scopeVersion === 1 && state.scope === 'wide' ? 3 : 2} websites checked`, rows,
    voice: state.stage === 'c1_start' ? STUDENT_VOICE.start : state.stage === 'c1_opening' ? state.support ? STUDENT_VOICE.jordan : STUDENT_VOICE.ortiz : state.stage === 'c1_invest' ? 'My new habit: put “Who decides?” beside anything a page cannot settle.' : state.scope === 'wide' ? state.scopeVersion === 1 ? 'Three pages, three questions. Keep each source beside what it can actually tell me.' : 'Keep a third possibility in view; finish comparing these two first.' : 'Two pages, two useful questions. A place to start.'
  };
}

// The popup is the scene; the following work card keeps the full feedback contract.
export const FEEDBACK_SCENES = {
  extra: {
    intended: 'Your instructor circles the link between the class idea and one public route: “Keep the limit beside the argument.” You keep that explanation and the sources behind it.',
    mixed: 'The instructor keeps the explanation of one route and removes the promise of a place. Your extra check helped narrow the paper. You keep an argument the pages can support.',
    productive_setback: 'The instructor sets aside the access claim: the pages cannot speak for a project owner. You keep the finished comparison and a better question in the margin.'
  },
  session: {
    intended: 'You bring two prepared questions to the session. The facilitator accepts your inquiry note and confirms the public follow-up. You keep a next step you can check.',
    mixed: 'Your extra check changes the question you bring. No project places are available now; the facilitator accepts the revised note about the public contact route. You keep the questions and that route, with no guarantee of a place.',
    productive_setback: 'There are no project places now. The facilitator still accepts your prepared questions and inquiry note. You keep the listed project contact and a question about the next opening.'
  }
};

export function feedbackScene(state) {
  if (state.feedbackVersion !== 1) return null;
  const scene = FEEDBACK_SCENES[state.form]?.[state.feedbackOutcome];
  if (!scene) return null;
  const quality = reviewQuality(state);
  return scene + (quality ? ` ${quality.text} ${quality.acceptance}` : '');
}

export function packetReview(state) {
  const review = completedWorkReview(state, 'packet');
  return review ? `${review.text} ${review.acceptance}` : '';
}

export function planReview(state) {
  const review = completedWorkReview(state, 'plan');
  return review ? `${review.text} ${review.acceptance}` : '';
}

export function recognitionScene(state) {
  if (!['extra','session'].includes(state.form)) return null;
  const review = reviewQuality(state);
  const assessment = review ? `${review.text} ${review.acceptance} ` : '';
  return assessment + (state.form === 'extra'
    ? 'Your instructor credits the finished extra-credit paper. You gain 1 Standing, and the public research next-steps page is open.'
    : 'The facilitator recognizes your prepared questions and inquiry note. You gain 1 Standing, and the public follow-up page is open.');
}
