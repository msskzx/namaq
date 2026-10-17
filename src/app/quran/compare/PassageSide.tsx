'use client';

// docs/plans/quran-repetition-merge.md
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesDown, faAnglesUp } from '@fortawesome/free-solid-svg-icons';
import Button from '@/components/common/Button';
import { AyahCard } from '@/components/quran/AyahCard';
import { sideCards } from '@/lib/quran/cards';
import { ayahWords } from '@/lib/quran/normalize';
import { sharedSlots } from '@/lib/quran/wordDiff';
import type { Passage } from '@/lib/quran/passages';
import type { Ayah } from '@/types/quran';

export function PassageSide({ title, side, marks, ayat, count, surah }: { title: string; side: Passage['a']; marks: number[]; ayat: Record<string, string>; count: number; surah: Ayah['surah'] }) {
  const [after, setAfter] = useState(0);
  const [before, setBefore] = useState(0);
  const [fetched, setFetched] = useState<Record<string, string>>({});
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(false);
  const n = side.from.surah;
  const known = { ...fetched, ...ayat };
  const cards = sideCards(side, marks, known, { full: true, after, before });

  const fetchSurah = async () => {
    const res = await fetch(`/api/quran/surahs/${n}`);
    if (!res.ok) throw new Error(String(res.status));
    const body: { ayat: { number: number; text: string }[] } = await res.json();
    setFetched(Object.fromEntries(body.ayat.map(a => [`${n}:${a.number}`, ayahWords(a.text, a.number === 1 && n !== 1 && n !== 9).display.join(' ')])));
  };

  const more = async () => {
    setFailed(false);
    setLoading(true);
    if (!known[`${n}:${side.to.ayah + after + 1}`]) {
      try {
        await fetchSurah();
      } catch {
        setFailed(true);
        setLoading(false);
        return;
      }
    }
    setAfter(a => a + 1);
    setLoading(false);
  };

  const prev = async () => {
    setFailed(false);
    setLoading(true);
    if (!known[`${n}:${side.from.ayah - before - 1}`]) {
      try {
        await fetchSurah();
      } catch {
        setFailed(true);
        setLoading(false);
        return;
      }
    }
    setBefore(b => b + 1);
    setLoading(false);
  };

  return (
    <div>
      <h3 className="text-xl mb-2 text-amber-600 dark:text-amber-400">{title}</h3>
      <div className="flex flex-wrap gap-2 mb-2">
        {side.from.ayah - before > 1 && (
          <Button size="sm" disabled={loading} onClick={prev}>
            <FontAwesomeIcon icon={faAnglesUp} />
            عرض الآية السابقة
          </Button>
        )}
      </div>
      {cards.map(c => (
        <AyahCard key={c.ayah} ayah={{ id: `${c.surah}:${c.ayah}`, number: c.ayah, text: c.text, surah } as unknown as Ayah} slots={sharedSlots(c.text.split(' ').length, c.marks)} />
      ))}
      <div className="flex flex-wrap gap-2">
        {side.to.ayah + after < count && (
          <Button size="sm" disabled={loading} onClick={more}>
            <FontAwesomeIcon icon={faAnglesDown} />
            عرض الآية التالية
          </Button>
        )}
      </div>
      {failed && <p role="alert" className="text-sm text-red-600 dark:text-red-400 mt-2">تعذر تحميل الآية.</p>}
    </div>
  );
}
