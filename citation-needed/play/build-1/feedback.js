// Bounded Chapter 2 trial copy. Selection rules live in engine.js; no random rolls.
import { workQuality } from './quality.js?v=20261013r2';
export const PROJECT_AIMS = {
  route: { label: 'Focus on one public next step', detail: 'Explain a route the pages can support. No project place is promised.' },
  place: { label: 'Explore getting a project place', detail: 'A bigger question with gaps. An extra check can help narrow the work.' }
};

export const PROJECT_FEEDBACK = {
  extra: {
    intended: {
      label: 'As hoped', tone: 'success',
      review: 'You focused on one route. After an ordinary revision, your instructor accepts the paper’s link between a class idea and the public pages. It does not promise project access.',
      retained: 'You keep a clear explanation of one route and what its sources can support.',
      result: 'Your instructor credits the finished paper. You keep a class idea linked to one public route and its limits.',
      record: 'Paper preparation · class idea linked to one public route and its limits'
    },
    mixed: {
      label: 'A narrower result', tone: 'review',
      review: 'Your bigger question went beyond the pages. The extra check helped you remove the claim about getting a place. Your instructor accepts the narrower paper about one route.',
      retained: 'You keep the class idea and a useful account limited to that current route.',
      result: 'Your instructor credits the finished paper after its wider claim is removed. The explanation of one current route stays useful.',
      record: 'Paper preparation · wider claim narrowed to one current route'
    },
    productive_setback: {
      label: 'A useful setback', tone: 'setback',
      review: 'The pages cannot promise a project place. Your instructor rejects that part, but accepts your finished page comparison with its limit stated. The bigger question needs a project owner.',
      retained: 'You keep the comparison and a question: who can confirm the next project opening?',
      result: 'Your instructor credits the finished paper’s page comparison, with the access claim set aside. You keep the source limit and a question for a project owner.',
      record: 'Paper preparation · page comparison kept; project-owner question saved'
    }
  },
  session: {
    intended: {
      label: 'As hoped', tone: 'success',
      review: 'You focused on the public next step. The facilitator accepts your prepared questions and inquiry note, and confirms the current follow-up route. No project place is promised.',
      retained: 'You keep two prepared questions and a checked public follow-up step.',
      result: 'The facilitator recognizes your prepared questions and inquiry note. You keep two questions and the current public follow-up route.',
      record: 'Session preparation · two questions and current public follow-up saved'
    },
    mixed: {
      label: 'A narrower result', tone: 'review',
      review: 'No project places are available now. Your extra check helped you revise the inquiry note around the public contact route. The facilitator accepts your questions and inquiry note with that limit.',
      retained: 'You keep the prepared questions and a contact route, with no guarantee of a place.',
      result: 'The facilitator recognizes your prepared questions and inquiry note after the revision. You keep the public contact route and its no-guarantee limit.',
      record: 'Session preparation · inquiry note revised to a public contact route'
    },
    productive_setback: {
      label: 'A useful setback', tone: 'setback',
      review: 'You asked about a project place, but none are available now. The facilitator still accepts your prepared questions and inquiry note, and points you to the listed project contact.',
      retained: 'You keep the note and a next question: when should you ask about another opening?',
      result: 'The facilitator recognizes your prepared questions and inquiry note despite no available place. You keep the note and a project contact to ask about the next opening.',
      record: 'Session preparation · inquiry note kept; ask project owner about next opening'
    }
  }
};

const REVIEW_CONTEXT = {
  extra: {
    intended: 'You focused on one public route.',
    mixed: 'Your extra check removed the wider claim about getting a place.',
    productive_setback: 'The instructor sets aside the unsupported claim about getting a place.'
  },
  session: {
    intended: 'You focused on the public follow-up.',
    mixed: 'Your extra check narrowed the note to the public contact route; no places are available now.',
    productive_setback: 'You asked about a project place, but none are available now.'
  }
};
const REVIEW_ACCEPTANCE = {
  extra: {
    intended: 'The paper is accepted for its class idea and sources, without promising access.',
    mixed: 'The narrower paper about one current route is accepted.',
    productive_setback: 'Your page comparison is accepted; the bigger question needs a project owner.'
  },
  session: {
    intended: 'Your questions and note are accepted, and the current follow-up route is confirmed.',
    mixed: 'Your questions and revised note are accepted with that limit.',
    productive_setback: 'Your questions and note are accepted, with the listed project contact as your next step.'
  }
};

// All completed-work feedback remembers the submitted ledger and finish Energy.
// Recognition/rest cannot erase the exhausted finish or change its acceptance.
const WORK_REVIEW = {
  packet: {
    Careful: 'Ms. Ortiz finds your comparisons and question easy to follow.',
    Uneven: 'Ms. Ortiz notices the uneven final question after you worked without Energy, and asks for a clearer sentence.',
    Rushed: 'Ms. Ortiz notices the rushed final question after you worked without Energy, and marks it for another read.',
    spent: 'Ms. Ortiz notices your tired finish, but the comparisons and question are clear enough to use.',
    acceptance: 'The packet is complete enough to reuse for university planning; workshop eligibility is a separate rule.'
  },
  plan: {
    Careful: 'Your fixed class times and study notes are clear.',
    Uneven: 'Working without Energy leaves some study notes uneven and in need of a clearer order.',
    Rushed: 'Working without Energy leaves the study notes rushed and harder to follow.',
    spent: 'You finish with no Energy left, but the fixed times and study notes are clear enough to use.',
    acceptance: 'The plan is still usable for arranging another section around your paid shift.'
  },
  extra: {
    Careful: 'Your instructor finds a carefully finished argument and conclusion.',
    Uneven: 'Your instructor flags the uneven closing paragraph after you worked without Energy, and asks for another read.',
    Rushed: 'Your instructor flags the rushed conclusion after you worked without Energy: the links between ideas need another read.',
    spent: 'Your instructor notices a tired finish with no Energy left, but the class idea and sources are clear enough for credit.',
    acceptance: 'The paper still meets the extra-credit goal through its class idea and page comparison.'
  },
  session: {
    Careful: 'The facilitator finds your questions and follow-up clearly organized.',
    Uneven: 'The facilitator notices the uneven follow-up note after you worked without Energy, and asks for a clearer order.',
    Rushed: 'The facilitator notices the rushed follow-up after you worked without Energy, and asks you to reorder it.',
    spent: 'The facilitator notices a tired finish with no Energy left, but your prepared questions and inquiry note are clear enough to recognize.',
    acceptance: 'Your questions and inquiry note still meet the session goal of a prepared public follow-up.'
  }
};

export function completedWorkReview(state, task = state.form) {
  const lines = WORK_REVIEW[task];
  if (!lines) return null;
  const quality = workQuality(state, task);
  const finishEnergy = task === 'plan' ? state.planFinishEnergy : ['extra','session'].includes(task) ? state.projectFinishEnergy : ['c1_prep','c1_review'].includes(state.stage) && state.packet ? state.capacity : null;
  const spent = finishEnergy === 0;
  if (!quality?.finished && !spent) return null;
  // Quality-free older submissions can report a known exhausted finish without
  // inventing missing exhausted units or retroactively assigning a lower band.
  const band = quality?.finished ? quality.band : null;
  const text = band && band !== 'Careful' ? lines[band] : spent ? lines.spent : lines.Careful;
  return { band, spent, text, acceptance: lines.acceptance };
}

export function reviewQuality(state) {
  return ['extra','session'].includes(state.form) ? completedWorkReview(state) : null;
}

export function projectFeedback(state) {
  const base = state.feedbackVersion === 1 ? PROJECT_FEEDBACK[state.form]?.[state.feedbackOutcome] : null;
  const quality = base && reviewQuality(state);
  if (!quality) return base;
  return {
    ...base,
    review: `${REVIEW_CONTEXT[state.form][state.feedbackOutcome]} ${quality.text} ${REVIEW_ACCEPTANCE[state.form][state.feedbackOutcome]}`,
    result: `${base.result}${quality.band === 'Careful' && !quality.spent ? '' : ` ${quality.text}`}`
  };
}
