import { mushafText } from '@shared/quran/mushafText';
import { normalizeWord } from '@shared/quran/normalize';
import { branchList, EMPTY_LIST } from './branchList';
import { ayahOf } from './branches';
import { compareTargetsOfAyah, type CompareTarget } from './compare';

export const PREVIEW_MAX = 10;

export function treePiecesOfAyah(key: string) {
  return branchList({ ...EMPTY_LIST, ayah: key }).slice(0, PREVIEW_MAX);
}

export function compareOfAyah(key: string): { target: CompareTarget; partner: string; words: { text: string; shared: boolean }[] }[] {
  const own = new Set((ayahOf(key)?.words ?? []).map(word => normalizeWord(word)));
  return compareTargetsOfAyah(key).slice(0, PREVIEW_MAX).map(target => {
    const partner = `${target.other}:${target.ayat[1]}`;
    const words = (ayahOf(partner)?.words ?? []).filter(word => !word.startsWith('﴿')).map(word => ({ text: mushafText(word), shared: own.has(normalizeWord(word)) }));
    return { target, partner, words };
  });
}

