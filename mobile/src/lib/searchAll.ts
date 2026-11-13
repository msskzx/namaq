import { notesByDate, readAyahNotes } from '@shared/ayahNotes';
import { searchAll, type SearchSources } from '@shared/quran/searchAll';
import { bundledSources } from '@shared/quran/searchSources';
import { listedPairs } from './compare';

export { GROUP_MAX, warmSearch } from '@shared/quran/searchSources';

let bundled: SearchSources | undefined;

/** The app's sources for the one search: everything bundled, plus the reader's notes on this device. */
export function appSources(): SearchSources {
  const notes = readAyahNotes();
  return { ...(bundled ??= bundledSources(listedPairs)), notes: notesByDate(notes).map(key => ({ key, text: notes[key].text })) };
}

export const searchApp = (query: string) => searchAll(appSources(), query);
