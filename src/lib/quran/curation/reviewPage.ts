import type { Verdict } from './comparePairs';

export type ReviewAction = 'agree' | 'drop';
type Verdicts = Record<string, Verdict>;

const REMOVED = '(owner removed)';

function dropped(verdict: Verdict | undefined): Verdict {
  const why = verdict?.why ?? 'Dropped with the page';
  return { keep: false, why: verdict?.keep === false || why.endsWith(REMOVED) ? why : `${why} ${REMOVED}`, checked: true, ...(verdict?.alone ? { alone: true } : {}) };
}

function agreed(verdict: Verdict | undefined): Verdict {
  const next: Verdict = { ...(verdict ?? { keep: true, why: 'Agreed with the page' }), checked: true };
  delete next.ask;
  return next;
}

/** The verdicts of a page after the owner's choice, worked out from how the page was drafted so switching choices loses nothing. */
export function reviewedVerdicts(drafted: Verdicts, keys: string[], action: ReviewAction): Verdicts {
  return Object.fromEntries(keys.map(key => [key, action === 'drop' ? dropped(drafted[key]) : agreed(drafted[key])]));
}

/** `null` until every pair is checked. */
export function reviewedAs(verdicts: (Verdict | undefined)[]): ReviewAction | null {
  if (!verdicts.length || !verdicts.every(verdict => verdict?.checked)) return null;
  return verdicts.every(verdict => verdict?.keep === false) ? 'drop' : 'agree';
}
