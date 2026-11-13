import treeData from '@shared/data/quran/trees.json';
import surahRows from '@shared/data/quran/surahs.json';
import { branchInventory } from '@shared/quran/branchInventory';
import { branchesHref, type BranchAyah } from '@shared/quran/branches';
import { mushafText } from '@shared/quran/mushafText';
import { normalizeWord } from '@shared/quran/normalize';
import { phrasePresentation } from '@shared/quran/phraseTrees';
import { groupPresentation } from '@shared/quran/mutashabih/presentation';
import { compareLinksOfAyah } from '../compare/pairCards';

/** At most this many trees or compare cards in the sheet; its last button opens them all (the app's PREVIEW_MAX). */
export const PREVIEW_MAX = 10;

export type TreePreview = { id: string; href: string } & ReturnType<typeof phrasePresentation>;
export type ComparePreview = { href: string; page: string; partner: string; words: { text: string; shared: boolean }[] };
export type AyahPreview = { trees: TreePreview[]; compare: ComparePreview[] };

const ayat = treeData.ayat as BranchAyah[];
let indexed: Map<string, BranchAyah> | undefined;
const byKey = () => (indexed ??= new Map(ayat.map(ayah => [ayah.key, ayah])));
let inventory: ReturnType<typeof branchInventory> | undefined;
const nameOf = (surah: number) => surahRows.find(row => row.number === surah)?.name ?? '';

/** The trees that hold an ayah, as the branches list narrowed to it shows them, first few only (the app's treesOfAyah). */
export function treesOfAyah(key: string): TreePreview[] {
  return (inventory ??= branchInventory({}, null)).filter(piece => piece.keys.includes(key)).slice(0, PREVIEW_MAX).map(piece => ({
    id: piece.id,
    href: branchesHref(piece.id),
    ...(piece.group ? groupPresentation(piece.group, byKey()) : phrasePresentation(piece.phrase, ayat, true, true)),
  }));
}

/**
 * The other ayah of each compare card that holds this ayah, one per surah pair, with the words it shares with this ayah
 * marked (spelling only, as a hint; the compare page aligns them properly). The app's compareOfAyah.
 */
export function compareOfAyah(key: string): ComparePreview[] {
  const own = new Set((byKey().get(key)?.words ?? []).map(word => normalizeWord(word)));
  const lead = Number(key.split(':')[0]);
  return compareLinksOfAyah(key).slice(0, PREVIEW_MAX).flatMap(link => {
    if (!link.partner) return [];
    const other = Number(link.partner.split(':')[0]);
    const words = (byKey().get(link.partner)?.words ?? []).filter(word => !word.startsWith('﴿')).map(word => ({ text: mushafText(word), shared: own.has(normalizeWord(word)) }));
    return [{ href: link.href, page: lead === other ? `${nameOf(lead)} مع نفسها` : `${nameOf(lead)} مع ${nameOf(other)}`, partner: link.label, words }];
  });
}

export const ayahPreview = (key: string): AyahPreview => ({ trees: treesOfAyah(key), compare: compareOfAyah(key) });
