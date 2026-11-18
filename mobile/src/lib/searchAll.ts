import { notesByDate, readAyahNotes } from '@shared/ayahNotes';
import { ADHKAR } from '@shared/adhkar';
import { searchAll, type AdhkarItem, type SearchSources } from '@shared/quran/searchAll';
import { bundledSources } from '@shared/quran/searchSources';
import { listedPairs } from './compare';

export { GROUP_MAX, warmSearch } from '@shared/quran/searchSources';

let bundled: SearchSources | undefined;

/** The adhkar's own words, each opening its card on its first occasion's tab. The Quran selection is found among the ayat. */
export const ADHKAR_ITEMS: AdhkarItem[] = ADHKAR.flatMap(item => (item.content.kind === 'text' ? [{ id: item.id, occasion: item.occasions[0], text: item.content.text }] : []));

/** The app's sources for the one search: everything bundled, the adhkar, and the reader's notes on this device. */
export function appSources(): SearchSources {
  const notes = readAyahNotes();
  return { ...(bundled ??= bundledSources(listedPairs)), adhkar: ADHKAR_ITEMS, notes: notesByDate(notes).map(key => ({ key, text: notes[key].text })) };
}

export const searchApp = (query: string) => searchAll(appSources(), query);
