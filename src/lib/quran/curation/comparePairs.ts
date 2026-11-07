import data from './comparePairs.json';

/** A reader's verdict on one engine pair: is it a real parallel, or only shared vocabulary?
 *  `checked`: the owner reviewed it. `ask`: Claude is unsure and asks the owner this question. */
export type Verdict = { keep: boolean; why: string; checked?: boolean; ask?: string };

/** Hand-checked verdicts for the compare page, keyed "a|b" with the lower surah first. Unjudged pairs are kept. */
export const compareVerdicts = data.pairs as Record<string, Verdict>;

export const verdictFor = (a: string, b: string): Verdict | undefined => compareVerdicts[`${a}|${b}`];
export const keptPair = (pair: { a: string; b: string }) => verdictFor(pair.a, pair.b)?.keep !== false;
