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

/**
 * Al-Raghib's first words in his article, as he wrote them: his first sentence, or, when it runs long or reaches a
 * quotation («قال تعالى:»), up to the comma before; none when he opens on one. `cut` when his article goes on after it (the page then offers the whole).
 */
export function raghibOpening(text: string): { text: string; cut: boolean } | null {
  const flat = text.replace(/\s+/g, ' ').trim();
  const stop = flat.search(/[.؟!](\s|$)/);
  let end = stop < 0 ? flat.length : stop + 1;
  const quote = flat.slice(0, end).search(/(^|[،,]?\s)(قال|وقال|يقال|ويقال|نحو|كقوله|وقوله|ومنه)[^،.]{0,20}:/);
  // An article that opens on a quotation has no words of his own to open with.
  if (quote === 0) return null;
  if (quote > 0) end = quote;
  if (end > OPENING) {
    const comma = flat.lastIndexOf('،', OPENING);
    if (comma > 0) end = comma;
  }
  const opening = flat.slice(0, end).replace(/[،,:\s]+$/, '');
  return { text: opening, cut: opening.length < flat.length - 1 };
}

/** A branch: one of his entries on the word, with the meaning he gives it in his own words. */
export type MeaningBranch = GharibPlaced & { meaning: string };

/**
 * His meanings of the word, one branch for each entry that explains this word and gives a meaning, in mushaf order. Two
 * entries giving the same meaning stay two branches: we never join his meanings ourselves (quran-pages-design rule).
 */
export function meaningBranches(data: GharibData, entries: GharibPlaced[]): MeaningBranch[] {
  return entries.flatMap(entry => {
    const meaning = entry.phrase ? undefined : data.meanings[entry.at]?.replace(/^أي:?\s*/, '').replace(/\.$/, '').trim();
    return meaning ? [{ ...entry, meaning }] : [];
  });
}
