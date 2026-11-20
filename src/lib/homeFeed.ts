import { dailyIndex, feedTrees } from '@shared/dailyPick';
import { lastNumber, momentItem, storyItem } from '@shared/feedItems';
import { FEED_AHEAD, FEED_FAR } from '@shared/feedSeen';
export { FEED_AHEAD, FEED_FAR };
import { pageOfAyah, pageStart, type MushafPage } from '@shared/quran/readerPage';
import surahRows from '@shared/data/quran/surahs.json';
import type { BranchPiece } from '@shared/quran/branchInventory';
import { pairCards, pairOfDay, type PairCard } from '@/app/quran/compare/pairCards';
import { bookmarkKind } from '@shared/bookmarkKind';
import { compareBookmarkAyat, savedAs } from '@shared/compareBookmarks';
import { treeInventory, treePreviewOf, type TreePreview } from '@/app/quran/read/ayahPreview';
import { pieceSources } from '@shared/quran/pieceSources';
import type { QuizSource } from '@shared/quiz/sources';
import { findProphet, storyTitle } from '@shared/quran/prophets';
import { quranStoryText } from '@shared/quran/prophets/storyText';
import { buildStory, storyMap, type EventView, type StoryMap } from '@shared/quran/prophets/story';
import { STORIES } from '@shared/quran/prophets/stories';
import verdictData from '@shared/quran/prophets/verdicts.json';
import { keptViews, type PlaceVerdicts } from '@shared/quran/prophets/review';
import { hasStoryCard, storyGroupOfDay } from '@shared/quran/prophets/storyGroup';
import { withUnappliedStoryReviews } from '@/lib/quran/curation/storyReviewLog';
import momentsData from '@shared/data/battles/moments.json';
import type { AppMoment, AppMomentBattle } from '@shared/battles/battle';
import type { AppReport, AppStory } from '@shared/stories/story';
import { STORIES as SIRA_STORIES, storyAyat } from '@/lib/stories';
import type { AyatPage } from '@/lib/storyAyat';


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
/** A pair or a tree with the sources its card's line names (owner, 2026-11-20: every card has one). */
export type FeedPair = PairCard & { sources: QuizSource[] };
export type FeedTree = TreePreview & { text: string; sources: QuizSource[] };
const pairGroup = (pair: PairCard) => (pair.group ? treeInventory().find(piece => piece.id === pair.group || [piece.legacyId, ...(piece.legacyIds ?? []), ...(piece.group?.aliases ?? [])].includes(pair.group!))?.group : undefined);
const feedPair = (pair: PairCard): FeedPair => ({ ...pair, sources: pieceSources(pair.sides.flatMap(side => side.ayat.map(ayah => `${side.surah}:${ayah.number}`)), pairGroup(pair)) });
const feedTree = (piece: BranchPiece): FeedTree => ({ ...treePreviewOf(piece), text: piece.text, sources: pieceSources(piece.keys, piece.group) });

export function feedContent(day: number, pairOffsets: number[], treeOffsets: number[]): { pairs: FeedPair[]; trees: FeedTree[] } {
  return {
    pairs: pairOffsets.flatMap(offset => { const pair = pairOfDay(day + offset); return pair ? [feedPair(pair)] : []; }),
    trees: treeOffsets.flatMap(offset => { const piece = treeOfDay(day, offset); return piece ? [feedTree(piece)] : []; }),
  };
}

/** The home page's reading card: the page (drawn by MushafPage, its first lines only), the surah running at its top, and the surah its first lines belong to. */
export async function pageSlice(page: number) {
  const data = (await import(`../../shared/data/quran/mushaf/${page}.json`)).default as MushafPage;
  const before = surahRows.findLast(row => row.page != null && row.page < page)?.number;
  return { surah: pageStart(data, before).surah, page, top: before, data };
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
export type StoryCard = { slot: number; /** The card's lasting id (shared/feedItems.ts storyItem). */ item: string; slug: string; title: string; phase: number; phases: readonly string[]; map: StoryMap; events: EventView[]; story: number[] };

export function storyCards(day: number, slots: number[]): StoryCard[] {
  return slots.filter(hasStoryCard).flatMap(slot => {
    const { slug, phase } = storyGroupOfDay(day, slot);
    const card = storyCard(slot, slug, phase);
    return card ? [card] : [];
  });
}
function storyCard(slot: number, slug: string, phase: number): StoryCard | null {
  const prophet = findProphet(slug);
  if (!prophet) return null;
  const all = withUnappliedStoryReviews(verdictData.places as PlaceVerdicts);
  const story = STORIES[slug];
  const verdicts = Object.fromEntries(Object.entries(all).filter(([key]) => key.startsWith(`${slug}/`)));
  const events = keptViews(slug, buildStory(story.events, quranStoryText), verdicts);
  const whole = storyMap(events);
  // The words stay behind: the map needs only each place's count.
  const map = { ...whole, places: whole.places.map(places => places.map(place => ({ ...place, segments: [] }))) };
  return {
    slot, item: storyItem(slug, phase), slug, title: storyTitle(prophet), phase, phases: story.phases, map,
    events: events.map(event => ({ ...event, segments: [] })),
    // Each event's place in the whole story (the kept story can drop events), for the page's ?event=.
    story: events.map(event => story.events.findIndex(at => at.title === event.title)),
  };
}

/**
 * The «السيرة والمغازي» cards (the app's SiraPost and MomentPost, mobile/src/components/HomeFeed.tsx): a sira story's first
 * report whole with its ayat in the mushaf's lines, or one moment of a battle, taking turns batch by batch.
 */
export type SiraCard = { slot: number; /** The card's lasting id: the story's slug, or shared/feedItems.ts momentItem. */ item: string } & (
  | { kind: 'sira'; slug: string; name: string; report: AppReport; ayat: AppStory['ayat']; pages: AyatPage[][] }
  | { kind: 'moment'; battle: Pick<AppMomentBattle, 'slug' | 'name' | 'kind' | 'year'>; moment: AppMoment; n: number });

const SIRA_FEED = SIRA_STORIES.filter(story => story.reports[0]);
const MOMENT_FEED = (momentsData as AppMomentBattle[]).flatMap(battle => battle.moments.map((moment, i) => ({ battle, moment, n: i + 1 })));
const turnOf = (day: number, at: number, count: number) => ((((day * 37 + at) % count) + count) % count);

export async function siraCards(day: number, slots: number[]): Promise<SiraCard[]> {
  const cards = await Promise.all(slots.map(async (slot): Promise<SiraCard | null> => {
    // A story in even batches, a battle's moment in odd ones, each list in the day's turn; a list with nothing in it brings no card.
    const turn = Math.floor(slot / 2);
    if (slot % 2 === 0) {
      if (!SIRA_FEED.length) return null;
      const story = SIRA_FEED[turnOf(day, turn, SIRA_FEED.length)];
      return { slot, kind: 'sira', item: story.slug, slug: story.slug, name: story.name, report: story.reports[0], ayat: story.ayat, pages: await storyAyat(story) };
    }
    if (!MOMENT_FEED.length) return null;
    return momentCard(slot, MOMENT_FEED[turnOf(day, turn, MOMENT_FEED.length)]);
  }));
  return cards.filter((card): card is SiraCard => card !== null);
}
const momentCard = (slot: number, { battle, moment, n }: (typeof MOMENT_FEED)[number]): SiraCard =>
  ({ slot, kind: 'moment', item: momentItem(battle.slug, n), battle: { slug: battle.slug, name: battle.name, kind: battle.kind, year: battle.year }, moment, n });

/** A saved item drawn as its own card in the feed: the tree card's tree or the pair card's pair; a saved ayah needs nothing here. */
export type SavedContent = { pair?: FeedPair; tree?: FeedTree };

export function savedContent(id: string): SavedContent | null {
  const kind = bookmarkKind({ id });
  if (kind === 'tree') {
    // A tree saved before its id changed is found under its old ids too, as the branches page finds it.
    const piece = treeInventory().find(at => at.id === id) ?? treeInventory().find(at => [at.legacyId, ...(at.legacyIds ?? []), ...(at.group?.aliases ?? [])].includes(id));
    return piece ? { tree: feedTree(piece) } : null;
  }
  if (kind !== 'compare') return null;
  const surahs = [...new Set(compareBookmarkAyat({ id }).map(key => Number(key.split(':')[0])))].sort((a, b) => a - b);
  const pair = surahs.length ? pairCards(surahs[0], surahs[1] ?? surahs[0]).find(card => savedAs(card.id, [{ id }]).length) : undefined;
  return pair ? { pair: feedPair(pair) } : null;
}

/**
 * A saved feed card by its kind and item (`card:<kind>:<item>`, shared/bookmarkKind.ts), drawn as the feed drew it: the
 * story and sira cards here, the others from their own modules (src/lib/feedCard.ts gathers them).
 */
export async function siraCardOf(kind: string, item: string): Promise<SiraCard | null> {
  if (kind === 'sira') {
    const story = SIRA_FEED.find(each => each.slug === item);
    return story ? { slot: 0, kind: 'sira', item: story.slug, slug: story.slug, name: story.name, report: story.reports[0], ayat: story.ayat, pages: await storyAyat(story) } : null;
  }
  const found = kind === 'moment' ? MOMENT_FEED.find(each => momentItem(each.battle.slug, each.n) === item) : undefined;
  return found ? momentCard(0, found) : null;
}
export function storyCardOf(item: string): StoryCard | null {
  const split = lastNumber(item);
  return split && STORIES[split.head] && split.n >= 0 && split.n < STORIES[split.head].phases.length ? storyCard(0, split.head, split.n) : null;
}
