import data from './comparePairs.json';

import type { Verdict } from '@shared/quran/compareCards';

export type { Verdict } from '@shared/quran/compareCards';

/** Hand-checked verdicts for the compare page, keyed "a|b" with the lower surah first. Unjudged pairs show only in review. */
export const compareVerdicts = data.pairs as Record<string, Verdict>;

export const verdictFor = (a: string, b: string): Verdict | undefined => compareVerdicts[`${a}|${b}`];
export const keptPair = (pair: { a: string; b: string }) => verdictFor(pair.a, pair.b)?.keep === true;
