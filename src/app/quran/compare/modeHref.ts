import { RANGE_KEYS } from '@/lib/quran/compareRange';

type Query = Record<string, string | string[] | undefined>;
export type CompareTab = 'similar' | 'ayat' | 'themes';

function href(first: Record<string, string>, query: Query, keys: readonly string[]) {
  const params = new URLSearchParams(first);
  for (const key of [...keys, ...RANGE_KEYS]) {
    const value = query[key];
    if (typeof value === 'string') params.set(key, value);
  }
  const search = params.toString();
  return search ? `/quran/compare?${search}` : '/quran/compare';
}

export function modeHref(mode: 'text' | 'themes', query: Query) {
  return href(mode === 'themes' ? { mode } : {}, query, ['a', 'b']);
}

export function viewHref(ayat: boolean, query: Query) {
  const link = href({}, query, ['a', 'af', 'at', 'b', 'bf', 'bt']);
  return ayat ? `${link}${link.includes('?') ? '&' : '?'}view=ayat` : link;
}

export function tabHref(tab: CompareTab, query: Query) {
  return tab === 'themes' ? modeHref('themes', query) : viewHref(tab === 'ayat', query);
}

export function pairHref(tab: CompareTab, a: number, b: number, query: Query) {
  return tabHref(tab, { ...Object.fromEntries(RANGE_KEYS.map(key => [key, query[key]])), a: String(a), b: String(b) });
}

export function surahHref(surah: number, query: Query) {
  return href({ s: String(surah) }, query, []);
}

export function withRange(link: string, query: Query) {
  const extra = href({}, query, []).split('?')[1];
  return extra ? `${link}${link.includes('?') ? '&' : '?'}${extra}` : link;
}
