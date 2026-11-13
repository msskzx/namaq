import corpus from '../data/quran/trees.json';
import surahRows from '../data/quran/surahs.json';
import wordsData from '../data/quran/words.json';
import poemData from '../tajwid/tuhfat-al-atfal.json';
import type { BranchAyah } from './branches';
import { indexAyat, searchAyat, type IndexedAyah } from './ayahSearch';
import { branchInventory, distinctBranchPieces } from './branchInventory';
import { searchSharedPhrases } from './branchSearch';
import { curatedFor } from './curatedComparisons';
import { PROPHETS, prophetName } from './prophets';
import { STORIES } from './prophets/stories';
import { searchWords, type WordsData } from './words';
import { numberVerses, type Poem } from '../tajwid/poem';
import { holdsTerms, type CompareItem, type EventItem, type SearchSources, type TuhfaItem } from './searchAll';

/** Results a group lists at most when opened in full; the finders return one more, so a page can say there are more. */
export const GROUP_MAX = 100;
const FIND = GROUP_MAX + 1;

const words = wordsData as unknown as WordsData;
const names: Record<number, string> = Object.fromEntries(surahRows.map(row => [row.number, row.name]));
/** A compare page's name, as the compare pages title it. */
export const pairName = (a: number, b: number) => (a === b ? `سورة ${names[a]} مع نفسها` : `سورة ${names[a]} وسورة ${names[b]}`);

let indexed: IndexedAyah[] | undefined;
const ayahIndex = () => (indexed ??= indexAyat(corpus.ayat as BranchAyah[]));

/** Builds the ayah index ahead of the first search, so typing does not wait for it. */
export const warmSearch = () => void ayahIndex();

let lists: { compare: CompareItem[]; events: EventItem[]; tuhfa: TuhfaItem[] } | undefined;
function staticLists(pairs: { a: number; b: number }[]) {
  return (lists ??= {
    compare: pairs.map(({ a, b }) => {
      const story = curatedFor(a, b);
      return { a, b, title: story ? `${story.name.ar}: ${pairName(a, b)}` : pairName(a, b) };
    }),
    events: PROPHETS.flatMap(prophet => (STORIES[prophet.slug]?.events ?? []).map((event, i) => ({ slug: prophet.slug, event: i, title: event.title, prophet: prophetName(prophet) }))),
    tuhfa: numberVerses(poemData as Poem).flatMap((chapter, i) => chapter.verses.map(verse => ({ chapter: i, verse: verse.number, first: verse.first, second: verse.second }))),
  });
}

/**
 * Everything the app bundles, for the one search: the Quran's ayat and words, the default trees list, the listed compare pages,
 * the prophets' events and the Tuhfa. The reader's notes live on the device, so each side adds its own. docs/plans/search-everything.md
 */
export function bundledSources(pairs: { a: number; b: number }[]): SearchSources {
  return {
    surahs: surahRows,
    ayat: query => searchAyat(ayahIndex(), query, FIND).hits.map(hit => ({ kind: 'ayah', key: hit.key, words: hit.words, from: hit.from, to: hit.to })),
    words: query => searchWords(words, query, FIND).map(id => ({ kind: 'word', id, name: words.lemmas[id][0], count: words.lemmas[id][1] })),
    trees: query => {
      // The trees page forgives a leading و/ف («فرعون» finds «راعون»); here the trees that hold the words as typed come alone when there are any.
      const found = distinctBranchPieces(searchSharedPhrases(branchInventory({}, null), query));
      const typed = found.filter(piece => holdsTerms(piece.text, query));
      return (typed.length ? typed : found).slice(0, FIND).map(piece => ({ kind: 'tree', id: piece.id, text: piece.text }));
    },
    ...staticLists(pairs),
  };
}
