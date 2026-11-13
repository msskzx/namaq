import { dailyIndex, feedTrees } from '@shared/dailyPick';
import { FEED_AHEAD } from '@shared/feedSeen';
export { FEED_AHEAD };
import { pageStart, type MushafPage } from '@shared/quran/readerPage';
import surahRows from '@shared/data/quran/surahs.json';
import type { BranchPiece } from '@shared/quran/branchInventory';
import { pairOfDay, type PairCard } from '@/app/quran/compare/pairCards';
import { treeInventory, treePreviewOf, type TreePreview } from '@/app/quran/read/ayahPreview';


let fits: BranchPiece[] | undefined;
/** The feed's tree for a day, `offset` trees on, as the app's `treeOfDay` (mobile/src/lib/daily.ts). */
export function treeOfDay(day: number, offset = 0) {
  fits ??= feedTrees(treeInventory());
  return fits.length ? fits[(dailyIndex(day, fits.length) + offset) % fits.length] : undefined;
}

/** The ids of the next pairs and trees from a day, by offset, for the browser to skip what it has seen (shared/feedSeen.ts). */
export function feedIds(day: number, count = FEED_AHEAD) {
  const offsets = Array.from({ length: count }, (_, offset) => offset);
  return { pairs: offsets.map(offset => pairOfDay(day + offset)?.id ?? null), trees: offsets.map(offset => treeOfDay(day, offset)?.id ?? null) };
}

/** The picked pairs and trees, by offset from the day. */
export function feedContent(day: number, pairOffsets: number[], treeOffsets: number[]): { pairs: PairCard[]; trees: (TreePreview & { text: string })[] } {
  return {
    pairs: pairOffsets.flatMap(offset => pairOfDay(day + offset) ?? []),
    trees: treeOffsets.flatMap(offset => { const piece = treeOfDay(day, offset); return piece ? [{ ...treePreviewOf(piece), text: piece.text }] : []; }),
  };
}

/** The home page's reading card: a page's first lines and the surah they belong to. */
export async function pageSlice(page: number) {
  const data = (await import(`../../shared/data/quran/mushaf/${page}.json`)).default as MushafPage;
  const before = surahRows.findLast(row => row.page != null && row.page < page)?.number;
  return pageStart(data, before);
}
