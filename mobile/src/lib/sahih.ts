import { useMemo } from 'react';
import bukhari from '@shared/data/hadith/bukhari.json';
import muslim from '@shared/data/hadith/muslim.json';
import type { SahihIndex, SahihSlug, SahihText } from '@shared/sahih';
import { bookState, readBook, useBooks, type BookState } from './books';
import { readJson, writeJson } from './storage';
import { FORTY } from './hadith';
import { useLoaded } from './hooks/useLoaded';

export const SAHIH: Record<SahihSlug, SahihIndex> = { bukhari: bukhari as SahihIndex, muslim: muslim as SahihIndex };
export const SAHIH_SLUGS: SahihSlug[] = ['bukhari', 'muslim'];
export const isSahihSlug = (slug: string | undefined): slug is SahihSlug => slug === 'bukhari' || slug === 'muslim';

export function useSahihText(slug: SahihSlug | undefined, wanted = true): { state: BookState; text: SahihText | null } {
  useBooks();
  const state = slug ? bookState(slug) : 'off';
  const text = useLoaded(slug && state === 'on' && wanted ? slug : null, asked => readBook<SahihText>(asked as SahihSlug));
  return { state, text };
}

export function useSahihTexts(wanted: boolean): { texts: Partial<Record<SahihSlug, SahihText>>; reading: boolean } {
  const b = useSahihText('bukhari', wanted);
  const m = useSahihText('muslim', wanted);
  const texts = useMemo(() => ({ ...(b.text && { bukhari: b.text }), ...(m.text && { muslim: m.text }) }), [b.text, m.text]);
  return { texts, reading: wanted && ((b.state === 'on' && !b.text) || (m.state === 'on' && !m.text)) };
}

const LAST = 'sahih-last';
const isLast = (value: unknown): value is Partial<Record<SahihSlug, number>> => !!value && typeof value === 'object';
export const lastOpened = (slug: SahihSlug) => readJson(LAST, isLast)?.[slug];
export type LastRead = { slug: SahihSlug; n: number; from?: string; words: string };
const READ = 'sahih-last-read';
const isRead = (value: unknown): value is LastRead => !!value && typeof value === 'object' && isSahihSlug((value as LastRead).slug) && typeof (value as LastRead).words === 'string';
export const lastRead = () => readJson(READ, isRead);
export const rememberOpened = (slug: SahihSlug, n: number, from: string | undefined, words: string) => {
  writeJson(LAST, { ...readJson(LAST, isLast), [slug]: n });
  writeJson(READ, { slug, n, from, words });
};

export const fortyOf = (slug: SahihSlug, n: number) => FORTY.entries.filter(entry => entry.records.some(record => record.book === slug && record.number === n));
