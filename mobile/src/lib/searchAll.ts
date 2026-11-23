import { notesByDate, readAyahNotes } from '@shared/ayahNotes';
import { searchAll, type SearchSources } from '@shared/quran/searchAll';
import { ADHKAR_ITEMS, bundledSources } from '@shared/quran/searchSources';
import { listedPairs } from './compare';
import { STORIES, STORY_CHAPTERS } from './stories';

/** The sira stories' chapters first (a chapter is what one looks for by «الوفود»), then each story. */
const SIRA_ITEMS = [...STORY_CHAPTERS.map(chapter => ({ title: chapter.name, chapter: chapter.name })), ...STORIES.map(story => ({ title: story.name, slug: story.slug }))];

export { GROUP_MAX, warmSearch } from '@shared/quran/searchSources';

let bundled: SearchSources | undefined;


/** The app's sources for the one search: everything bundled, the adhkar, and the reader's notes on this device. */
export function appSources(): SearchSources {
  const notes = readAyahNotes();
  return { ...(bundled ??= bundledSources(listedPairs)), adhkar: ADHKAR_ITEMS, sira: SIRA_ITEMS, notes: notesByDate(notes).map(key => ({ key, text: notes[key].text })) };
}

export const searchApp = (query: string) => searchAll(appSources(), query);
