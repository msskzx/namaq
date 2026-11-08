import data from './comparePairs.json';

/** A reader's verdict on one engine pair: is it a real parallel, or only shared vocabulary?
 *  `checked`: the owner reviewed it. `ask`: Claude is unsure and asks the owner this question.
 *  `alone`: this pair keeps its own card and never joins a range or one-to-many card.
 *  `draft`: the verdict before the owner's button press, so the press can be undone; empty when there was none.
 *  `card`: the owner decided this pair with a card's buttons, so a press on the whole page leaves it alone. */
export type Verdict = { keep: boolean; why: string; checked?: boolean; ask?: string; alone?: boolean; draft?: Partial<Verdict>; card?: boolean };

/** Hand-checked verdicts for the compare page, keyed "a|b" with the lower surah first. Unjudged pairs show only in review. */
export const compareVerdicts = data.pairs as Record<string, Verdict>;

export const verdictFor = (a: string, b: string): Verdict | undefined => compareVerdicts[`${a}|${b}`];
export const keptPair = (pair: { a: string; b: string }) => verdictFor(pair.a, pair.b)?.keep === true;
