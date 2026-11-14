import { dailyIndex, feedTrees } from '@shared/dailyPick';
import { FEED_AHEAD } from '@shared/feedSeen';
export { FEED_AHEAD };
import { pageOfAyah, pageStart, type MushafPage } from '@shared/quran/readerPage';
import surahRows from '@shared/data/quran/surahs.json';
import type { BranchPiece } from '@shared/quran/branchInventory';
import { pairCards, pairOfDay, type PairCard } from '@/app/quran/compare/pairCards';
import { bookmarkKind } from '@shared/bookmarkKind';
import { compareBookmarkAyat, savedAs } from '@shared/compareBookmarks';
import { treeInventory, treePreviewOf, type TreePreview } from '@/app/quran/read/ayahPreview';
import { findProphet, storyTitle } from '@shared/quran/prophets';
import { buildStory, storedText, storyMap, type EventView, type StoryMap } from '@shared/quran/prophets/story';
import { STORIES } from '@shared/quran/prophets/stories';
import verdictData from '@shared/quran/prophets/verdicts.json';
import { keptViews, type PlaceVerdicts } from '@shared/quran/prophets/review';
import { hasStoryCard, storyGroupOfDay } from '@shared/quran/prophets/storyGroup';
import { withUnappliedStoryReviews } from '@/lib/quran/curation/storyReviewLog';
import { AYAT } from '@/app/quran/prophets/ayat';


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

/** The prophets card's story, as the prophets page shows it to readers (kept places only), cut to what its map needs. */
export type StoryCard = { slot: number; slug: string; title: string; phase: number; phases: readonly string[]; map: StoryMap; events: EventView[]; story: number[] };

export function storyCards(day: number, slots: number[]): StoryCard[] {
  const all = withUnappliedStoryReviews(verdictData.places as PlaceVerdicts);
  return slots.filter(hasStoryCard).flatMap(slot => {
    const { slug, phase } = storyGroupOfDay(day, slot);
    const prophet = findProphet(slug);
    if (!prophet) return [];
    const story = STORIES[slug];
    const verdicts = Object.fromEntries(Object.entries(all).filter(([key]) => key.startsWith(`${slug}/`)));
    const events = keptViews(slug, buildStory(story.events, storedText(AYAT[slug])), verdicts);
    const whole = storyMap(events);
    const inGroup = new Set(events.flatMap((event, i) => (event.phase === phase ? whole.places[i].map(place => place.surah) : [])));
    // The words stay behind: the map needs only each place's count.
    const map = { ...whole, surahs: whole.surahs.filter(row => inGroup.has(row.surah)), places: whole.places.map(places => places.map(place => ({ ...place, segments: [] }))) };
    return [{
      slot, slug, title: storyTitle(prophet), phase, phases: story.phases, map,
      events: events.map(event => ({ ...event, segments: [] })),
      // Each event's place in the whole story (the kept story can drop events), for the page's ?event=.
      story: events.map(event => story.events.findIndex(at => at.title === event.title)),
    }];
  });
}

/** A saved item drawn as its own card in the feed: the tree card's tree or the pair card's pair; a saved ayah needs nothing here. */
export type SavedContent = { pair?: PairCard; tree?: TreePreview & { text: string } };

export function savedContent(id: string): SavedContent | null {
  const kind = bookmarkKind({ id });
  if (kind === 'tree') {
    // A tree saved before its id changed is found under its old ids too, as the branches page finds it.
    const piece = treeInventory().find(at => at.id === id) ?? treeInventory().find(at => [at.legacyId, ...(at.legacyIds ?? []), ...(at.group?.aliases ?? [])].includes(id));
    return piece ? { tree: { ...treePreviewOf(piece), text: piece.text } } : null;
  }
  if (kind !== 'compare') return null;
  const surahs = [...new Set(compareBookmarkAyat({ id }).map(key => Number(key.split(':')[0])))].sort((a, b) => a - b);
  const pair = surahs.length ? pairCards(surahs[0], surahs[1] ?? surahs[0]).find(card => savedAs(card.id, [{ id }]).length) : undefined;
  return pair ? { pair } : null;
}
