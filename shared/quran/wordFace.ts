import type { GharibData, GharibPlaced } from './gharib';
import { leading, OPENING } from './opening';


export function mostIn(counts: number[]): { surahs: number[]; count: number } | null {
  const count = Math.max(0, ...counts);
  if (count < 2) return null;
  const surahs = counts.flatMap((each, at) => (each === count ? [at + 1] : []));
  return surahs.length <= 2 ? { surahs, count } : null;
}

export function raghibOpening(text: string): { text: string; cut: boolean } | null {
  const body = text.trim();
  const opening = leading(body, OPENING, /(و?قوله|قال)( الله)? تعالى|\[[^\]]*\/\s*[٠-٩]+\]/);
  if (!opening) return null;
  return { text: opening, cut: body.replace(/[.\s]+$/, '').length > opening.replace(/\.$/, '').length };
}

const BRANCH = 120;

export type MeaningBranch = GharibPlaced & { meaning: string };

export function meaningBranches(data: GharibData, entries: GharibPlaced[]): MeaningBranch[] {
  return entries.flatMap(entry => {
    if (entry.phrase) return [];
    const own = (said: string) => said.replace(/^[\s:،]*(أي:?)?\s*/, '');
    const meaning = (data.meanings[entry.at] ? own(data.meanings[entry.at]) : leading(own(entry.text.slice(entry.text.indexOf('﴾') + 1)), BRANCH, /﴿/))
      .replace(/[.\s\-–]+$/, '').trim();
    return meaning ? [{ ...entry, meaning }] : [];
  });
}
