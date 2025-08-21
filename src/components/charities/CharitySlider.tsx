"use client";

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import useSWR from 'swr';
import { fetcher } from '@/lib/swr';
import type { Ayah } from '@/types/quran';
import { AyahCard } from '@/components/quran/AyahCard';
import { useLanguage } from '@/components/language/LanguageContext';
import LoadingSpinner from '../common/LoadingSpinner';

// Chosen charity-related ayat (surah:ayah), displayed in this order
const QUERY_PAIRS = '2:261,2:262,2:274,3:92,3:134,25:67,57:7,63:10,64:16';

export default function CharitySlider() {
  const { language } = useLanguage();
  const [current, setCurrent] = useState(0);
  const { data: ayat, error, isLoading } = useSWR<Ayah[]>(`/api/quran/ayat?q=${QUERY_PAIRS}`, fetcher);

  const goRight = () => ayat && setCurrent((prev) => (prev === 0 ? ayat.length - 1 : prev - 1));
  const goLeft = () => ayat && setCurrent((prev) => (prev === ayat.length - 1 ? 0 : prev + 1));

  // Auto-advance every few seconds
  useEffect(() => {
    if (!ayat) return;
    const interval = setInterval(() => {
      if (language === 'ar') {
        goLeft();
      } else {
        goRight();
      }
    }, 10000);
    return () => clearInterval(interval);
  });

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto flex flex-col items-center mb-12 bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-lg p-6 w-full h-full min-h-90">
        <div className="flex justify-center items-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error || !ayat) {
    return (
      <div className="max-w-5xl mx-auto flex flex-col items-center mb-12 bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-lg p-6 w-full h-full min-h-90">
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
            Error loading ayat
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto flex flex-col items-center mb-12 bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-lg p-6 w-full h-full min-h-90" dir="rtl">
      <div className="relative w-full max-w-4xl mx-auto">
        <button
          onClick={language === 'ar' ? goLeft : goRight}
          aria-label={language === 'ar' ? 'التالي' : 'Previous'}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-900 text-amber-400 rounded-full p-2 shadow hover:bg-amber-400 hover:text-gray-800 transition"
          style={{ left: '-3rem' }}
        >
          <FontAwesomeIcon icon={faChevronLeft} className="w-6 h-6" />
        </button>
        <div className="bg-transparent px-8 py-8 flex flex-col items-center justify-center transition-all duration-300">
          {ayat.length > 0 ? <AyahCard ayah={ayat[current]} /> : null}
        </div>
        <button
          onClick={language === 'ar' ? goRight : goLeft}
          aria-label={language === 'ar' ? 'السابق' : 'Next'}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-900 text-amber-400 rounded-full p-2 shadow hover:bg-amber-400 hover:text-gray-800 transition"
          style={{ right: '-3rem' }}
        >
          <FontAwesomeIcon icon={faChevronRight} className="w-6 h-6" />
        </button>
      </div>
      <div className="flex gap-2 mt-4 justify-center">
        {ayat.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-3 h-3 rounded-full ${idx === current ? 'bg-amber-400' : 'bg-gray-700'}`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
