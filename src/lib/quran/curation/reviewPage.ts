import type { Verdict } from './comparePairs';

export type ReviewAction = 'agree' | 'drop';
type Verdicts = Record<string, Verdict>;

const REMOVED = '(owner removed)';

const draftOf = (verdict: Verdict | undefined): Verdict | undefined => {
  if (!verdict) return undefined;
  if (verdict.draft) return Object.keys(verdict.draft).length ? { ...(verdict.draft as Verdict), ...(verdict.alone ? { alone: true } : {}) } : undefined;
  return verdict;
};

function dropped(verdict: Verdict | undefined): Verdict {
  const why = verdict?.why ?? 'Dropped with the page';
  return { keep: false, why: verdict?.keep === false || why.endsWith(REMOVED) ? why : `${why} ${REMOVED}`, checked: true, ...(verdict?.alone ? { alone: true } : {}) };
}

function agreed(verdict: Verdict | undefined): Verdict {
  const next: Verdict = { ...(verdict ?? { keep: true, why: 'Agreed with the page' }), checked: true };
  delete next.ask;
  return next;
}

/** What to keep so a choice can be undone: the verdict before it, without `alone`, which a choice never changes. An empty draft means there was no verdict. */
function remembered(verdict: Verdict | undefined): Verdict['draft'] {
  if (!verdict) return {};
  const draft: NonNullable<Verdict['draft']> = { ...verdict };
  delete draft.alone;
  delete draft.draft;
  return draft;
}

/** The verdicts of a page after the owner's choice, worked out from how the page was drafted so switching choices loses nothing. */
export function reviewedVerdicts(current: Verdicts, keys: string[], action: ReviewAction): Verdicts {
  return Object.fromEntries(keys.map(key => {
    const before = draftOf(current[key]);
    const after = action === 'drop' ? dropped(before) : agreed(before);
    return [key, JSON.stringify(after) === JSON.stringify(before) ? after : { ...after, draft: remembered(before) }];
  }));
}

/** The page's verdicts as they were drafted; a pair whose draft was "no verdict" is left out. */
export function restoredVerdicts(current: Verdicts, keys: string[]): Verdicts {
  return Object.fromEntries(keys.flatMap(key => {
    const before = draftOf(current[key]);
    return before ? [[key, before]] : [];
  }));
}

/** `null` until every pair is checked. */
export function reviewedAs(verdicts: (Verdict | undefined)[]): ReviewAction | null {
  if (!verdicts.length || !verdicts.every(verdict => verdict?.checked)) return null;
  return verdicts.every(verdict => verdict?.keep === false) ? 'drop' : 'agree';
}
