import { mushafText } from '@shared/quran/mushafText';
import { normalizeWord } from '@shared/quran/normalize';
import { branchList, EMPTY_LIST } from './branchList';
import { ayahOf, cardOf } from './branches';
import { compareTargetsOfAyah, type CompareTarget } from './compare';

/** At most this many trees or compare cards in the sheet; the button at its end opens them all. */
export const PREVIEW_MAX = 10;

/** The trees that hold an ayah, as the branches list narrowed to it shows them, first few only. */
export function treesOfAyah(key: string) {
  return branchList({ ...EMPTY_LIST, ayah: key }).slice(0, PREVIEW_MAX).map(piece => cardOf(piece));
}

/**
 * The other ayah of each compare card that holds this ayah, one per surah pair, with the words it shares with this ayah
 * marked (spelling only, as a hint; the compare page aligns them properly).
 */
export function compareOfAyah(key: string): { target: CompareTarget; partner: string; words: { text: string; shared: boolean }[] }[] {
  const own = new Set((ayahOf(key)?.words ?? []).map(word => normalizeWord(word)));
  return compareTargetsOfAyah(key).slice(0, PREVIEW_MAX).map(target => {
    const partner = `${target.other}:${target.ayat[1]}`;
    const words = (ayahOf(partner)?.words ?? []).filter(word => !word.startsWith('﴿')).map(word => ({ text: mushafText(word), shared: own.has(normalizeWord(word)) }));
    return { target, partner, words };
  });
}

