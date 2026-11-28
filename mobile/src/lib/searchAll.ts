import { notesByDate, readAyahNotes } from '@shared/ayahNotes';
import { searchAll, SEARCH_ORDER, type SearchHit, type SearchSources } from '@shared/quran/searchAll';
import { ADHKAR_ITEMS, bundledSources, GROUP_MAX } from '@shared/quran/searchSources';
import { battleLine, searchBattles } from '@shared/battles/battle';
import { searchSahih, type SahihSlug, type SahihIndex } from '@shared/sahih';

import { sayingStart, searchForty } from '@shared/hadith';
import { listedPairs } from './compare';
import { STORIES, STORY_CHAPTERS } from './stories';
import { personLine, personName, searchPeople } from './tarajim';
import { BATTLES } from './battles';
import { FORTY } from './hadith';
import bukhari from '@shared/data/hadith/bukhari.json';
import muslim from '@shared/data/hadith/muslim.json';

const SIRA_ITEMS = [...STORY_CHAPTERS.map(chapter => ({ title: chapter.name, chapter: chapter.name })), ...STORIES.map(story => ({ title: story.name, slug: story.slug }))];

export { GROUP_MAX, warmSearch } from '@shared/quran/searchSources';

let bundled: SearchSources | undefined;


export function appSources(): SearchSources {
  const notes = readAyahNotes();
  return { ...(bundled ??= bundledSources(listedPairs)), adhkar: ADHKAR_ITEMS, sira: SIRA_ITEMS, notes: notesByDate(notes).map(key => ({ key, text: notes[key].text })) };
}

export type AppHit = SearchHit
  | { kind: 'person'; slug: string; name: string; line: string }
  | { kind: 'battle'; slug: string; name: string; line: string }
  | { kind: 'hadith'; book: SahihSlug | 'forty'; n: number; kitab?: number; title: string; place: string };
export type AppKind = AppHit['kind'];
export type AppGroup = { kind: AppKind; hits: AppHit[] };

export const APP_ORDER: AppKind[] = (['surah', 'person', 'battle', ...SEARCH_ORDER.filter(kind => kind !== 'surah')] as AppKind[])
  .flatMap(kind => (kind === 'sira' ? ['sira', 'hadith'] as AppKind[] : [kind]));

const FIND = GROUP_MAX + 1;
const SAHIH: Record<SahihSlug, SahihIndex> = { bukhari: bukhari as SahihIndex, muslim: muslim as SahihIndex };
const SAHIH_SLUGS: SahihSlug[] = ['bukhari', 'muslim'];

function hadithHits(query: string): Extract<AppHit, { kind: 'hadith' }>[] {
  const forty = (/[ء-ي]/.test(query) ? searchForty(FORTY.entries, query) : [])
    .map(entry => ({ kind: 'hadith' as const, book: 'forty' as const, n: entry.n, title: sayingStart(entry.text), place: `${FORTY.books.nawawi.title}، ${entry.heading}` }));
  const babs = SAHIH_SLUGS.flatMap(slug => searchSahih([{ index: SAHIH[slug] }], query, FIND).babs).map(hit => {
    const book = SAHIH[hit.book];
    const kitab = book.kitabs.find(each => each.n === hit.kitab);
    return { kind: 'hadith' as const, book: hit.book, n: hit.n, kitab: hit.kitab, title: kitab?.babs[hit.bab ?? 0]?.title ?? '', place: `${book.title}، ${kitab?.title ?? ''}` };
  });
  return [...forty, ...babs];
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
