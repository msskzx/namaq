import type { GharibData, GharibPlaced } from './gharib';
import { leading, OPENING } from './opening';

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
