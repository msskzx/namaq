// A saved home-feed card on the website, found by its kind and item (`card:<kind>:<item>`, shared/bookmarkKind.ts) and
// built by the same functions that build it for the feed, so a saved card looks as it did there (the app's SavedFeedCard).
import { termCardOf, type TermCard } from '@/lib/balaghaTerms';
import { hadithCardOf, type HadithCard } from '@/lib/forty';
import { siraCardOf, storyCardOf, type SiraCard, type StoryCard } from '@/lib/homeFeed';
import { isSahihSlug, sahihCardOf, type SahihCard } from '@/lib/sahih';
import { nameCardOf, tarajimCardOf, type NameCard, type TarajimCard } from '@/lib/tarajim';
import { cardOfBookmark } from '@shared/bookmarkKind';
import itqan from '@shared/data/quran/itqanBalagha';
import { noteBody, type NoteBody } from '@shared/quran/ayahNoteBody';
import { EXAMPLES, exampleKey, exampleView, type ExampleView } from '@shared/quran/iltifat';
import { exampleReference, type LataifReference } from '@shared/quran/lataif';
import { ayahMushafWords } from '@/app/quran/read/irab';
import { loadReaderAyat } from '@/lib/quran/readerAyat';
import { isAyahKey } from '@shared/quran/ayahContext';
import { LIST_KINDS, type ListKind } from '@shared/homeFeed';
import { itemsOf } from '@/lib/feedLists';

export type SavedFeedCard =
  | { kind: 'hadith' | 'rajab' | 'recorded' | 'isnad'; card: HadithCard }
  | { kind: 'bukhari' | 'muslim'; card: SahihCard }
  | { kind: 'tarajim' | 'tie' | 'life'; card: TarajimCard }
  | { kind: 'laqab' | 'kunya'; card: NameCard }
  | { kind: 'sira' | 'moment'; card: SiraCard }
  | { kind: 'prophets'; card: StoryCard }
  | { kind: 'term'; card: TermCard }
  | { kind: 'note-qiraat'; ayah: string }
  | { kind: 'note-tafsir' | 'note-irab' | 'note-balagha'; note: NoteBody }
  | { kind: 'scene'; view: ExampleView; reference: LataifReference };

const NOTES = { 'note-tafsir': 'tafsir', 'note-irab': 'irab', 'note-balagha': 'balagha' } as const;

/** The card a `card:` bookmark names, or null when the website does not draw that kind or the data no longer holds it. */
export async function savedFeedCard(id: string, day: number): Promise<SavedFeedCard | null> {
  const saved = cardOfBookmark(id);
  if (!saved) return null;
  const { kind, item } = saved;
  // Only an item its kind's list holds, as the app's SavedFeedCard: no ayah past a surah's end, no story group too wide for a card.
  if ((LIST_KINDS as readonly string[]).includes(kind) && !itemsOf(kind as ListKind).includes(item)) return null;
  switch (kind) {
    case 'hadith': case 'rajab': case 'recorded': case 'isnad': { const card = hadithCardOf(kind, item); return card ? { kind, card } : null; }
    case 'tarajim': case 'tie': case 'life': { const card = tarajimCardOf(kind, item); return card ? { kind, card } : null; }
    case 'laqab': case 'kunya': { const card = nameCardOf(kind, item); return card ? { kind, card } : null; }
    case 'sira': case 'moment': { const card = await siraCardOf(kind, item); return card ? { kind, card } : null; }
    case 'prophets': { const card = storyCardOf(item); return card ? { kind, card } : null; }
    case 'term': { const card = await termCardOf(item, day); return card ? { kind, card } : null; }
    case 'note-qiraat': return /^\d{1,3}:\d{1,3}$/.test(item) ? { kind, ayah: item } : null;
    case 'note-tafsir': case 'note-irab': case 'note-balagha': {
      if (!isAyahKey(item)) return null;
      const note = noteBody(NOTES[kind], item, day, kind === 'note-irab' ? (await ayahMushafWords(item)).words : []);
      return note ? { kind, note } : null;
    }
    case 'scene': {
      const example = EXAMPLES.find(each => exampleKey(each) === item);
      if (!example) return null;
      const words = new Map((await loadReaderAyat()).map(ayah => [ayah.key, ayah.words]));
      const view = exampleView(example, key => words.get(key));
      return { kind, view, reference: exampleReference(view, itqan) };
    }
    default: {
      if (!isSahihSlug(kind)) return null;
      const card = await sahihCardOf(kind, item);
      return card ? { kind, card } : null;
    }
  }
}
