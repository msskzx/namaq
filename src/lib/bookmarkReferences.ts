import type { Bookmark } from '@shared/bookmarks';
import { compareBookmarkAyat } from '@shared/compareBookmarks';
import { inJuzRange, parseJuzRange } from '@shared/quran/juz';
import { parseOccurrences } from './quran/branchTreeLinks';

export function bookmarkReferences(bookmark: Pick<Bookmark, 'id' | 'href'>, ayatById: Readonly<Record<string, readonly string[]>>) {
  if (bookmark.id.startsWith('ayah:')) {
    const [surah, ayah] = bookmark.id.slice(5).split(':').map(Number);
    return surah && ayah ? [{ surah, ayat: [ayah] }] : [];
  }
  let params: URLSearchParams;
  try {
    params = new URL(bookmark.href, 'http://localhost').searchParams;
  } catch {
    return [];
  }
  const occurrences = parseOccurrences(params.get('at')).map(value => value.split(':').slice(0, 2).join(':'));
  const juz = parseJuzRange(params.get('juzFrom'), params.get('juzTo'));
  const range = /\d-\d/.test(bookmark.id) && compareBookmarkAyat(bookmark).length > 0;
  const keys = [...new Set(ayatById[bookmark.id] ?? compareBookmarkAyat(bookmark))].filter(key => (!occurrences.length || occurrences.includes(key)) && (!juz || inJuzRange(key, juz)));
  const groups = new Map<number, number[]>();
  keys.map(key => key.split(':').map(Number)).sort(([a, b], [c, d]) => a - c || b - d).forEach(([surah, ayah]) => {
    groups.set(surah, [...(groups.get(surah) ?? []), ayah]);
  });
  return [...groups].map(([surah, ayat]) => ({ surah, ayat, ...(range && ayat.length > 1 ? { range: true } : {}) }));
}
