'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { BookOpen } from 'lucide-react';
import Button from '@/components/common/Button';
import LoadingDots from '@/components/common/LoadingDots';
import PageSpread, { type SpreadPage } from '@/components/quran/PageSpread';
import { num } from '@shared/quran/arabicNumber';
import { loadQuranText } from '@/lib/quran/quranText';
import { NOTE } from '../panel';

export const PLACES_STEP = 20;

type Place = { key: string; words: number[] };

/** Groups "surah:ayah:word" entries by ayah, so an ayah that holds the word twice is shown once with both marked. */
export function placesByAyah(places: string): Place[] {
  const byKey = new Map<string, number[]>();
  for (const place of places.split(' ')) {
    const at = place.lastIndexOf(':');
    const key = place.slice(0, at);
    byKey.set(key, [...(byKey.get(key) ?? []), Number(place.slice(at + 1)) - 1]);
  }
  return [...byKey].map(([key, words]) => ({ key, words }));
}

const loadPlaces = () => import('./places.json').then(module => module.default.places as Record<string, string>);
const loadNames = () => fetch('/api/quran/surahs').then(res => (res.ok ? res.json() : [])).then((rows: { number: number; name: string }[]) => new Map(rows.map(row => [row.number, row.name])));

export default function WordPlaces({ word, count }: { word: string; count: number }) {
  const [shown, setShown] = useState(PLACES_STEP);
  const { data, error } = useSWR(['word-places', word], async () => {
    const [places, ayat] = await Promise.all([loadPlaces(), loadQuranText()]);
    const byKey = new Map(ayat.map(ayah => [ayah.key, ayah]));
    return placesByAyah(places[word] ?? '').flatMap(place => {
      const ayah = byKey.get(place.key);
      return ayah ? [{ ...place, ayah }] : [];
    });
  }, { revalidateOnFocus: false });
  const { data: names } = useSWR('surah-names', loadNames, { revalidateOnFocus: false });

  const heading = <h3 className="text-xl">{`مواضع «${word}»`}</h3>;
  if (error) return <div className="mt-4">{heading}<p className={NOTE}>تعذّر تحميل المواضع.</p></div>;
  if (!data) return <div className="mt-4">{heading}<LoadingDots /></div>;

  const pages = data.slice(0, shown).map(({ key, words, ayah }): SpreadPage => {
    const [surah, number] = key.split(':').map(Number);
    return {
      title: `${names?.get(surah) ?? `سورة ${num(surah)}`} ${num(number)}`,
      rows: [[{ number, words: ayah.words, marks: Object.fromEntries(words.map(index => [index, { kind: 'exact' }])) }]],
      action: <Button size="icon" href={`/quran/read/${ayah.page}?a=${key}`} aria-label="قراءة الآية" title="قراءة الآية"><BookOpen aria-hidden /></Button>,
    };
  });

  return (
    <div className="mt-4 flex flex-col gap-3">
      <div>
        {heading}
        <p className={NOTE}>{`${num(count)} مرة في ${num(data.length)} آية`}</p>
      </div>
      <ol aria-label={`مواضع «${word}»`} className="flex flex-col gap-3">
        {pages.map((page, i) => <li key={data[i].key}><PageSpread pages={[page]} compact single /></li>)}
      </ol>
      {shown < data.length && (
        <Button className="self-center" onClick={() => setShown(shown + PLACES_STEP)}>
          {`المزيد (${num(data.length - shown)})`}
        </Button>
      )}
    </div>
  );
}
