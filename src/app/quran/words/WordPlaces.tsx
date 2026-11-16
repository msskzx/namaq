'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import useSWR from 'swr';
import { BookOpen } from 'lucide-react';
import Button from '@/components/common/Button';
import LoadingDots from '@/components/common/LoadingDots';
import PageSpread, { type SpreadPage } from '@/components/quran/PageSpread';
import { num } from '@shared/quran/arabicNumber';
import { loadQuranText } from '@/lib/quran/quranText';
import surahRows from '@shared/data/quran/surahs.json';
import { countsBySurah } from '@shared/quran/words';
import { NOTE } from '../panel';
import SurahStrip from './SurahStrip';

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
const names = new Map(surahRows.map(row => [row.number, row.name]));
const surahName = (number: number) => names.get(number) ?? `سورة ${num(number)}`;

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
  const counts = useMemo(() => countsBySurah(data ?? []), [data]);
  const [chosen, setChosen] = useState<number | null>(null);
  const list = useRef<HTMLOListElement>(null);
  const [jump, setJump] = useState<string | null>(null);
  // Picking a bar brings that surah's first ayah into view, loading more ayat first if it is further down.
  useEffect(() => {
    if (!jump) return;
    const item = list.current?.querySelector<HTMLElement>(`[data-key="${jump}"]`);
    if (item) { item.scrollIntoView({ block: 'start' }); setJump(null); }
  }, [jump, shown]);
  const pickSurah = (picked: number) => {
    setChosen(picked);
    const first = (data ?? []).findIndex(place => place.key.startsWith(`${picked + 1}:`));
    if (first < 0) return;
    if (first >= shown) setShown(first + PLACES_STEP);
    setJump(data![first].key);
  };

  const heading = <h3 className="text-xl">{`مواضع «${word}»`}</h3>;
  if (error) return <div className="mt-4">{heading}<p className={NOTE}>تعذّر تحميل المواضع.</p></div>;
  if (!data) return <div className="mt-4">{heading}<LoadingDots /></div>;

  const pages = data.slice(0, shown).map(({ key, words, ayah }): SpreadPage => {
    const [surah, number] = key.split(':').map(Number);
    return {
      title: `${surahName(surah)} ${num(number)}`,
      rows: [[{ number, words: ayah.words, marks: Object.fromEntries(words.map(index => [index, { kind: 'exact' }])) }]],
      action: <Button size="icon" href={`/quran/read/${ayah.page}?a=${key}`} aria-label="قراءة الآية" title="قراءة الآية"><BookOpen aria-hidden /></Button>,
    };
  });

  return (
    <div className="mt-4 flex flex-col gap-3">
      <div>
        {heading}
        <p className={NOTE}>
          {`${num(count)} مرة في ${num(data.length)} آية`}
          {chosen !== null && <span className="text-[var(--home-accent)]">{`، منها ${num(counts[chosen])} في ${surahName(chosen + 1)}`}</span>}
        </p>
      </div>
      {data.length > 0 && <SurahStrip counts={counts} picked={chosen} onPick={pickSurah} name={surahName} />}
      <ol ref={list} aria-label={`مواضع «${word}»`} className="flex flex-col gap-3">
        {pages.map((page, i) => <li key={data[i].key} data-key={data[i].key} className="scroll-mt-20"><PageSpread pages={[page]} compact single /></li>)}
      </ol>
      {shown < data.length && (
        <Button className="self-center" onClick={() => setShown(shown + PLACES_STEP)}>
          {`المزيد (${num(data.length - shown)})`}
        </Button>
      )}
    </div>
  );
}
