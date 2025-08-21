import React, { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import useSWR from 'swr';
import { fetcher } from '@/lib/swr';
import type { Ayah } from '@/types/quran';
import { AyahCard } from '@/components/quran/AyahCard';

// Chosen charity-related ayat (surah:ayah), displayed in this order
const QUERY_PAIRS = '2:261,2:262,2:274,3:92,3:134,25:67,57:7,63:10,64:16';

export default function CharitySlider() {
  const [index, setIndex] = useState(0);
  const { data } = useSWR<Ayah[] | Ayah>(`/api/quran/ayat?q=${QUERY_PAIRS}`, fetcher);

  const ayat = useMemo(() => {
    if (!data) return [] as Ayah[];
    return Array.isArray(data) ? data : [data];
  }, [data]);

  useEffect(() => {
    if (ayat.length === 0) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % ayat.length);
    }, 20000);
    return () => clearInterval(timer);
  }, [ayat.length]);

  useEffect(() => {
    if (index >= ayat.length) setIndex(0);
  }, [ayat.length, index]);

  const goTo = (i: number) => setIndex(i);
  const goPrev = () => ayat.length && setIndex((prev) => (prev - 1 + ayat.length) % ayat.length);
  const goNext = () => ayat.length && setIndex((prev) => (prev + 1) % ayat.length);

  return (
    <div className="max-w-5xl mx-auto flex flex-col items-center mb-12 bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-lg p-6 w-full h-full min-h-90" dir="rtl">
      <div className="relative w-full max-w-4xl mx-auto">
        <button
          onClick={goPrev}
          aria-label="السابق"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-900 text-amber-400 rounded-full p-2 shadow hover:bg-amber-400 hover:text-gray-800 transition"
          style={{ left: '-3rem' }}
        >
          <FontAwesomeIcon icon={faChevronLeft} className="w-6 h-6" />
        </button>
        <div className="bg-transparent px-8 py-8 flex flex-col items-center justify-center transition-all duration-300">
          {ayat.length > 0 ? <AyahCard ayah={ayat[index]} /> : null}
        </div>
        <button
          onClick={goNext}
          aria-label="التالي"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-900 text-amber-400 rounded-full p-2 shadow hover:bg-amber-400 hover:text-gray-800 transition"
          style={{ right: '-3rem' }}
        >
          <FontAwesomeIcon icon={faChevronRight} className="w-6 h-6" />
        </button>
      </div>
      <div className="flex gap-2 mt-4 justify-center">
        {ayat.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`w-3 h-3 rounded-full ${i === index ? 'bg-amber-400' : 'bg-gray-700'}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
