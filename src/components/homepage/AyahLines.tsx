'use client';

import { useMemo } from 'react';
import useSWR from 'swr';
import surahRows from '@shared/data/quran/surahs.json';
import { pageGroups, type MushafPage as MushafPageData } from '@shared/quran/readerPage';
import { pageModel, reciteView } from '@shared/quran/recitePage';
import { ayahSlice, pageEnd } from '@shared/quran/ayahSlice';
import MushafPage, { type Checked, type Write } from '@/app/quran/read/MushafPage';

type Page = { page: number; top?: number; data: MushafPageData };
type Pages = Page & { previous: Page | null };

const NAMES: Record<number, string> = Object.fromEntries(surahRows.map(row => [row.number, row.title]));
const load = async (url: string): Promise<Pages> => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url}: ${response.status}`);
  return response.json();
};

/** The page an ayah is on (and the page before it), from /api/home/feed, with the ayah's words as the page sets them. */
export function useAyahPage(ayah: string) {
  const { data: pages } = useSWR(`/api/home/feed?ayah=${ayah}`, load, { revalidateOnFocus: false });
  const words = useMemo(() => {
    if (!pages) return null;
    return pageGroups(pages.data.items, pages.top).flatMap(line => line?.filter(group => group.word && `${group.surah}:${group.ayah}` === ayah).map(group => group.word) ?? []);
  }, [pages, ayah]);
  return { pages, words };
}

/**
 * An ayah in the mushaf's own lines, as recite mode shows it (owner, 2026-11-14; the app's AyahLines): the reader's page
 * (MushafPage) cut to the lines around the ayah, words in their places. What comes before it shows, the ayah and what
 * follows are hidden, and `write` puts the boxes where the asked words are. `shown` reveals it, `checked` colouring what was written.
 */
export default function AyahLines({ ayah, pages, write, checked, shown }: { ayah: string; pages: Pages; write: Omit<Write, 'before'>; checked: Omit<Checked, 'before'> | null; shown: boolean }) {
  const parts = useMemo(() => {
    const model = pageModel(pages.data, pages.top);
    const slice = ayahSlice(model.lines, pages.data.items, ayah);
    return slice && { model, slice };
  }, [pages, ayah]);
  const view = useMemo(() => (parts ? reciteView(parts.model, { start: ayah, shown: shown ? ayah : null, words: 0 }) : null), [parts, ayah, shown]);
  if (!parts || !view) return null;
  return <div lang="ar">
    {parts.slice.before && pages.previous && <MushafPage page={pages.previous.page} data={pages.previous.data} top={pages.previous.top} names={NAMES} slice={pageEnd(pages.previous.data.items)} />}
    <MushafPage page={pages.page} data={pages.data} top={pages.top} names={NAMES} slice={parts.slice} hidden={view.hidden} titled={view.titled} next={view.upcoming}
      write={shown ? null : { ...write, before: 0 }} checked={shown && checked ? { ...checked, before: 0 } : null} />
  </div>;
}
