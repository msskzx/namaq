import { notesByDate, readAyahNotes } from '@shared/ayahNotes';
import { searchAll, SEARCH_ORDER, type SearchHit, type SearchSources } from '@shared/quran/searchAll';
import { ADHKAR_ITEMS, bundledSources, GROUP_MAX } from '@shared/quran/searchSources';
import { battleLine, searchBattles } from '@shared/battles/battle';
import { searchSahih, type SahihSlug } from '@shared/sahih';

import { sayingStart, searchForty } from '@shared/hadith';
import { listedPairs } from './compare';
import { STORIES, STORY_CHAPTERS } from './stories';
import { personLine, personName, searchPeople } from './tarajim';
import { BATTLES } from './battles';
import { FORTY } from './hadith';
import bukhari from '@shared/data/hadith/bukhari.json';
import muslim from '@shared/data/hadith/muslim.json';
import type { SahihIndex } from '@shared/sahih';

/** The sira stories' chapters first (a chapter is what one looks for by «الوفود»), then each story. */
const SIRA_ITEMS = [...STORY_CHAPTERS.map(chapter => ({ title: chapter.name, chapter: chapter.name })), ...STORIES.map(story => ({ title: story.name, slug: story.slug }))];

export { GROUP_MAX, warmSearch } from '@shared/quran/searchSources';

let bundled: SearchSources | undefined;


/** The app's sources for the one search: everything bundled, the adhkar, and the reader's notes on this device. */
export function appSources(): SearchSources {
  const notes = readAyahNotes();
  return { ...(bundled ??= bundledSources(listedPairs)), adhkar: ADHKAR_ITEMS, sira: SIRA_ITEMS, notes: notesByDate(notes).map(key => ({ key, text: notes[key].text })) };
}

/**
 * What the app finds besides the website's kinds (owner, 2026-11-24: the search found no people, hadith or battles):
 * a person by name, kunya or laqab; a battle by its name or place; a hadith of the Forty by its words, or a Sahih bab by
 * its heading (the bab headings ship with the app; the Sahihs' words are searched in the hadith tab once downloaded).
 */
export type AppHit = SearchHit
  | { kind: 'person'; slug: string; name: string; line: string }
  | { kind: 'battle'; slug: string; name: string; line: string }
  | { kind: 'hadith'; book: SahihSlug | 'forty'; n: number; kitab?: number; title: string; place: string };
export type AppKind = AppHit['kind'];
export type AppGroup = { kind: AppKind; hits: AppHit[] };

/** Names first, as they are few and exact: a surah, a person, a battle; then the website's order, the hadith after the sira. */
export const APP_ORDER: AppKind[] = (['surah', 'person', 'battle', ...SEARCH_ORDER.filter(kind => kind !== 'surah')] as AppKind[])
  .flatMap(kind => (kind === 'sira' ? ['sira', 'hadith'] as AppKind[] : [kind]));

const FIND = GROUP_MAX + 1;
/** The Sahihs' kitabs and bab headings, which ship with the app (lib/sahih.ts reads the same files; it also reaches the downloads). */
const SAHIH: Record<SahihSlug, SahihIndex> = { bukhari: bukhari as SahihIndex, muslim: muslim as SahihIndex };
const SAHIH_SLUGS: SahihSlug[] = ['bukhari', 'muslim'];

function hadithHits(query: string): Extract<AppHit, { kind: 'hadith' }>[] {
  const forty = searchForty(FORTY.entries, query)
    .map(entry => ({ kind: 'hadith' as const, book: 'forty' as const, n: entry.n, title: sayingStart(entry.text), place: `${FORTY.books.nawawi.title}، ${entry.heading}` }));
  const babs = searchSahih(SAHIH_SLUGS.map(slug => ({ index: SAHIH[slug] })), query, FIND).babs.map(hit => {
    const book = SAHIH[hit.book];
    const kitab = book.kitabs.find(each => each.n === hit.kitab);
    return { kind: 'hadith' as const, book: hit.book, n: hit.n, kitab: hit.kitab, title: kitab?.babs[hit.bab ?? 0]?.title ?? '', place: `${book.title}، ${kitab?.title ?? ''}` };
  });
  return [...forty, ...babs].slice(0, FIND);
}

export function searchApp(query: string): AppGroup[] {
  const typed = query.trim();
  if (!typed) return [];
  const groups: AppGroup[] = searchAll(appSources(), typed);
  const more: AppGroup[] = [
    { kind: 'person', hits: searchPeople(typed).slice(0, FIND).map(person => ({ kind: 'person', slug: person.slug, name: personName(person), line: personLine(person) })) },
    { kind: 'battle', hits: searchBattles(BATTLES, typed).slice(0, FIND).map(battle => ({ kind: 'battle', slug: battle.slug, name: battle.name, line: battleLine(battle) })) },
    { kind: 'hadith', hits: hadithHits(typed) },
  ];
  return [...groups, ...more.filter(group => group.hits.length)].sort((a, b) => APP_ORDER.indexOf(a.kind) - APP_ORDER.indexOf(b.kind));
}
