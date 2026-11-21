// The website feed's item lists, the app's LIST_OF (mobile/src/components/HomeFeed.tsx): each content card kind's items by
// their lasting ids (shared/feedItems.ts), so the browser walks them as the app does and skips what it has seen.
import surahRows from '@shared/data/quran/surahs.json';
import itqan from '@shared/data/quran/itqanBalagha';
import { allAyat, itqanSureAyat } from '@shared/quran/ayahNotes';
import { qiraatAyat } from '@shared/quran/qiraatData';
import { singleAyahPassages } from '@shared/quran/tafsirSadiData';
import { EXAMPLES, exampleKey } from '@shared/quran/iltifat';
import { listStart, type ListKind } from '@shared/homeFeed';
import { TERMS } from '@/lib/balaghaTerms';
import { hadithItems } from '@/lib/forty';
import { sahihItems } from '@/lib/sahih';
import { tarajimItems } from '@/lib/tarajim';
import { storyItems } from '@/lib/homeFeed';
import { drawingItems } from '@/lib/drawingCards';

const lists: Partial<Record<ListKind, readonly string[]>> = {};
const LIST_OF: Record<ListKind, () => readonly string[]> = {
  'note-tafsir': singleAyahPassages, 'note-qiraat': qiraatAyat, 'note-balagha': () => itqanSureAyat(itqan),
  'note-irab': () => allAyat(surahRows.map(surah => surah.numberOfAyat)),
  term: () => TERMS.terms.map(term => term.name),
  // The phone's cards not on the website yet (PHONE_ONLY_KINDS): «مشاهد» scenes, the battle year and the two armies.
  mashahid: () => [], 'battle-year': () => [], 'battle-armies': () => [],
  scene: () => [...EXAMPLES].sort((a, b) => a.surah - b.surah || a.from - b.from).map(exampleKey),
  hadith: () => hadithItems('hadith'), recorded: () => hadithItems('recorded'), rajab: () => hadithItems('rajab'), isnad: () => hadithItems('isnad'),
  bukhari: () => sahihItems('bukhari'), muslim: () => sahihItems('muslim'),
  prophets: () => storyItems('prophets'), sira: () => storyItems('sira'), moment: () => storyItems('moment'),
  tarajim: () => tarajimItems('tarajim'), tie: () => tarajimItems('tie'), life: () => tarajimItems('life'), laqab: () => tarajimItems('laqab'), kunya: () => tarajimItems('kunya'),
  nasab: () => drawingItems('nasab'), ties: () => drawingItems('ties'), battle: () => drawingItems('battle'), 'hadith-scene': () => drawingItems('hadith-scene'),
  opening: () => drawingItems('opening'), oath: () => drawingItems('oath'), event: () => drawingItems('event'),
  'surah-aim': () => drawingItems('surah-aim'), 'surah-link': () => drawingItems('surah-link'),
};
export const itemsOf = (kind: ListKind) => (lists[kind] ??= LIST_OF[kind]());

/** The next `count` items of `kind` from where the day (or a continued story, `after`) starts, wrapping round, each once. */
export function feedItemIds(kind: ListKind, day: number, count: number, after?: string): string[] {
  const list = itemsOf(kind);
  const start = listStart(list, kind, day, after);
  return Array.from({ length: Math.min(count, list.length) }, (_, offset) => list[(start + offset) % list.length]);
}
