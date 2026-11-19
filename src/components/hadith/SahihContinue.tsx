'use client';

import { useEffect, useState } from 'react';
import Button from '@/components/common/Button';
import { num } from '@shared/quran/arabicNumber';
import type { SahihSlug } from '@shared/sahih';

/** The last hadith opened in each book (the app keeps the same), for its card's «تابع». */
const KEY = 'sahih-last';
const read = (): Partial<Record<SahihSlug, number>> => { try { return JSON.parse(localStorage.getItem(KEY) ?? '{}') ?? {}; } catch { return {}; } };

/** Remembers a hadith as the last opened in its book. */
export function RememberOpened({ book, n }: { book: SahihSlug; n: number }) {
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify({ ...read(), [book]: n })); } catch {} }, [book, n]);
  return null;
}

/** «تابع: ٥٢» under a book's card, once a hadith of it was opened. */
export default function SahihContinue({ book }: { book: SahihSlug }) {
  const [last, setLast] = useState<number>();
  useEffect(() => setLast(read()[book]), [book]);
  return last ? <Button href={`/hadith/sahih/${book}/${last}`} className="self-start">{`تابع: ${num(last)}`}</Button> : null;
}
