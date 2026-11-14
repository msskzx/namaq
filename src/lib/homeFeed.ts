import { dailyIndex, feedTrees } from '@shared/dailyPick';
import { FEED_AHEAD } from '@shared/feedSeen';
export { FEED_AHEAD };
import { pageOfAyah, pageStart, type MushafPage } from '@shared/quran/readerPage';
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
  const pairs = offsets.map(offset => pairOfDay(day + offset));
  const trees = offsets.map(offset => treeOfDay(day, offset));
  return {
    pairs: pairs.map(pair => pair?.id ?? null),
    trees: trees.map(piece => piece?.id ?? null),
    // Their ayat, for putting what is memorized first («قدّم ما أحفظه في التأمل», shared/memorized.ts).
    pairKeys: pairs.map(pair => pair?.sides.flatMap(side => side.ayat.map(ayah => `${side.surah}:${ayah.number}`)) ?? []),
    treeKeys: trees.map(piece => piece?.keys ?? []),
  };
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

const loadPage = async (page: number) => (await import(`../../shared/data/quran/mushaf/${page}.json`)).default as MushafPage;
const surahBefore = (page: number) => surahRows.findLast(row => row.page != null && row.page < page)?.number;

/**
 * The home recall card's page (owner, 2026-11-14: the mushaf around the ayah): the page an ayah is on and the page before it,
 * each with the surah running at its top, for MushafPage to draw a few of their lines.
 */
export async function ayahPages(key: string) {
  const [surah, ayah] = key.split(':').map(Number);
  const start = surahRows.find(row => row.number === surah)?.page;
  if (!start) return null;
  const page = await pageOfAyah(surah, ayah, start, loadPage);
  if (!page) return null;
  const at = async (number: number) => ({ page: number, top: surahBefore(number), data: await loadPage(number) });
  return { ...(await at(page)), previous: page > 1 ? await at(page - 1) : null };
}
