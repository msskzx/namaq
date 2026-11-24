import type { GharibData, GharibPlaced } from './gharib';

/**
 * The word page's head (owner, 2026-11-24: sketch quran-design/word-page, designs أ and ب together): where the word gathers
 * most, al-Raghib's opening words on its root, and Ibn Qutaybah's meanings of it as the branches of a tree.
 */

/** The surahs (1-based) holding the word most often, when that is more than once and at most two share it. */
export function mostIn(counts: number[]): { surahs: number[]; count: number } | null {
  const count = Math.max(0, ...counts);
  if (count < 2) return null;
  const surahs = counts.flatMap((each, at) => (each === count ? [at + 1] : []));
  return surahs.length <= 2 ? { surahs, count } : null;
}

/** As long as an opening may run before it stops at a comma, so it reads in a glance. */
const OPENING = 220;
const PAIRS: Record<string, string> = { '«': '»', '(': ')', '[': ']', '﴿': '﴾' };
const CLOSERS = new Set(Object.values(PAIRS));

/** Where a run of his words first leaves a bracket or quotation open (or closes one it never opened), or -1. */
function unbalancedAt(text: string): number {
  const open: number[] = [];
  for (let i = 0; i < text.length; i++) {
    if (PAIRS[text[i]]) open.push(i);
    else if (CLOSERS.has(text[i])) { if (!open.length) return i; open.pop(); }
  }
  return open.length ? open[0] : -1;
}

/** The run before the last comma ahead of `at`, or nothing when there is none. */
const beforeComma = (text: string, at: number) => { const comma = text.lastIndexOf('،', at); return comma > 0 ? text.slice(0, comma) : ''; };

/**
 * A book's first words, exactly as stored: its first line or sentence, stopped at the last comma before `max` when it runs
 * long, before `stop` when given (or right at it when no comma comes before), and before a bracket or quotation the stop would leave open. Empty when no words of its
 * own come before them.
 */
function leading(text: string, max: number, stop?: RegExp): string {
  const line = text.search(/\n|[.؟!](\s|$)/);
  let words = line < 0 ? text : text.slice(0, line + (text[line] === '\n' ? 0 : 1));
  const at = stop ? words.search(stop) : -1;
  if (at >= 0) words = beforeComma(words, at) || words.slice(0, at);
  if (words.length > max) words = beforeComma(words, max);
  const open = unbalancedAt(words);
  if (open >= 0) words = CLOSERS.has(words[open]) ? '' : beforeComma(words, open);
  return words.replace(/[،,:\s]+$/, '');
}

/**
 * Al-Raghib's first words in his article (`leading`), stopped before the first ayah he quotes («قال تعالى:»، «قوله
 * تعالى:»، a «[السورة/ ٣]» reference). None when he opens on an ayah or a quotation. `cut` when his article goes on.
 */
export function raghibOpening(text: string): { text: string; cut: boolean } | null {
  const body = text.trim();
  const opening = leading(body, OPENING, /(و?قوله|قال)( الله)? تعالى|\[[^\]]*\/\s*[٠-٩]+\]/);
  if (!opening) return null;
  return { text: opening, cut: body.replace(/[.\s]+$/, '').length > opening.replace(/\.$/, '').length };
}

/** As long as a branch's words may run when they are not the meaning read out for the quizzes. */
const BRANCH = 120;

/** A branch: one of his entries on the word, with the meaning he gives it in his own words. */
export type MeaningBranch = GharibPlaced & { meaning: string };

/**
 * His meanings of the word, one branch for each entry that explains this word (not a phrase it is in), in mushaf order:
 * the meaning read out for the quizzes where there is one, else his first words after the ayah he quotes (`leading`). Two
 * entries giving the same meaning stay two branches: we never join his meanings ourselves (quran-pages-design rule).
 */
export function meaningBranches(data: GharibData, entries: GharibPlaced[]): MeaningBranch[] {
  return entries.flatMap(entry => {
    if (entry.phrase) return [];
    const own = (said: string) => said.replace(/^[\s:،]*(أي:?)?\s*/, '');
    const meaning = (data.meanings[entry.at] ? own(data.meanings[entry.at]) : leading(own(entry.text.slice(entry.text.indexOf('﴾') + 1)), BRANCH, /﴿/))
      .replace(/[.\s\-–]+$/, '').trim();
    return meaning ? [{ ...entry, meaning }] : [];
  });
}
