import { useEffect, useMemo, useState } from 'react';
import bukhari from '@shared/data/hadith/bukhari.json';
import muslim from '@shared/data/hadith/muslim.json';
import type { SahihIndex, SahihSlug, SahihText } from '@shared/sahih';
import { bookState, readBook, useBooks, type BookState } from './books';
import { readJson, writeJson } from './storage';
import { FORTY } from './hadith';

/** Each Sahih's kitabs and babs, which ship with the app; their hadith are a library download (shared/books.ts). */
export const SAHIH: Record<SahihSlug, SahihIndex> = { bukhari: bukhari as SahihIndex, muslim: muslim as SahihIndex };
export const SAHIH_SLUGS: SahihSlug[] = ['bukhari', 'muslim'];
export const isSahihSlug = (slug: string | undefined): slug is SahihSlug => slug === 'bukhari' || slug === 'muslim';

/** A Sahih's text once it is on the phone, read from its file; `state` says whether it is there, coming or failed. */
export function useSahihText(slug: SahihSlug | undefined, wanted = true): { state: BookState; text: SahihText | null } {
  useBooks();
  const state = slug ? bookState(slug) : 'off';
  const [text, setText] = useState<SahihText | null>(null);
  useEffect(() => {
    let live = true;
    if (!slug || state !== 'on' || !wanted) { setText(null); return; }
    readBook<SahihText>(slug).then(data => { if (live) setText(data); });
    return () => { live = false; };
  }, [slug, state, wanted]);
  return { state, text };
}

/** Both books' texts that are on the phone, for search over every hadith; read only once `wanted` (something is typed). */
export function useSahihTexts(wanted: boolean): { texts: Partial<Record<SahihSlug, SahihText>>; reading: boolean } {
  const b = useSahihText('bukhari', wanted);
  const m = useSahihText('muslim', wanted);
  const texts = useMemo(() => ({ ...(b.text && { bukhari: b.text }), ...(m.text && { muslim: m.text }) }), [b.text, m.text]);
  return { texts, reading: wanted && ((b.state === 'on' && !b.text) || (m.state === 'on' && !m.text)) };
}

/** The last hadith opened in each book, for its card's «تابع». */
const LAST = 'sahih-last';
const isLast = (value: unknown): value is Partial<Record<SahihSlug, number>> => !!value && typeof value === 'object';
export const lastOpened = (slug: SahihSlug) => readJson(LAST, isLast)?.[slug];
export const rememberOpened = (slug: SahihSlug, n: number) => writeJson(LAST, { ...readJson(LAST, isLast), [slug]: n });

/** The ones of al-Nawawi's Forty whose records hold this hadith, so its page links to them. */
export const fortyOf = (slug: SahihSlug, n: number) => FORTY.entries.filter(entry => entry.records.some(record => record.book === slug && record.number === n));
