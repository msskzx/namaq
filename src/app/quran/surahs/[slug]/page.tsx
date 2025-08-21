"use client";

import { useLanguage } from "@/components/language/LanguageContext";
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Surah } from '@/types/quran';
import useSWR from "swr";
import ErrorMessage from '@/components/common/ErrorMessage';

import { fetcher } from '@/lib/swr';

export default function SurahPage() {
  const { language } = useLanguage();
  const params = useParams();
  const surahNumber = parseInt(params.slug as string);

  const { data: surah, error, isLoading } = useSWR<Surah>(`/api/quran/surahs/${surahNumber}`, fetcher);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="container mx-auto px-4 py-8">
          <ErrorMessage title={language === 'ar' ? 'حدث خطأ أثناء تحميل السورة' : 'Error loading surah'} description={String(error)} />
        </div>
      </div>
    );
  }

  if (!surah) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="container mx-auto px-4 py-8">
          <ErrorMessage title={language === 'ar' ? 'السورة غير موجودة' : 'Surah not found'} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <div className="mb-6">
          <Link
            href="/quran"
            className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
            <span>{language === 'ar' ? 'العودة إلى قائمة السور' : 'Back to Surahs'}</span>
          </Link>
        </div>

        <div className="bg-gray-50 dark:bg-gray-950 rounded-xl shadow-lg p-6">
          {/* Surah Header */}
          <div className="text-center mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
              {surah.name}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
              {surah.nameTransliterated} - {surah.nameTranslated}
            </p>
            <div className="flex justify-center gap-4 text-sm text-gray-500 dark:text-gray-500">
              <span>{language === 'ar' ? 'عدد الآيات:' : 'Ayahs:'} {surah.numberOfAyat}</span>
              <span>•</span>
              <span>{surah.revelationType}</span>
              <span>•</span>
              <span>{language === 'ar' ? 'رقم السورة:' : 'Surah:'} {surah.number}</span>
            </div>
          </div>

          {/* Ayahs */}
          <div>
            {/* Flowing text with ayah numbers at the end */}
            <div
              className="text-2xl leading-relaxed text-gray-800 dark:text-gray-200 font-arabic"
              style={{ fontFamily: 'Amiri, serif' }}
            >
              {/* Bismillah */}
              <div className="text-center mb-6">
                <span className="text-2xl text-amber-600 dark:text-amber-400 font-bold">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </span>
                {surahNumber === 1 && (
                  <span className="inline-block w-8 h-8 bg-amber-100 dark:bg-amber-900 rounded-full text-center leading-8 mx-2 align-middle">
                    <span className="text-amber-600 dark:text-amber-400 font-bold text-xs">
                      1
                    </span>
                  </span>
                )}
              </div>

              {/* Ayahs */}
              {surah.ayat.map((ayah, index) => (
                <span key={ayah.id}>
                  {index === 0
                    ? ayah.text.substring('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'.length + 1).trim()
                    : ayah.text
                  }
                  {!(surahNumber === 1 && index === 0) && (
                    <span className="inline-block w-8 h-8 bg-amber-100 dark:bg-amber-900 rounded-full text-center leading-8 mx-2 align-middle">
                      <span className="text-amber-600 dark:text-amber-400 font-bold text-xs">
                        {ayah.number}
                      </span>
                    </span>
                  )}
                  {index < surah.ayat.length - 1 && ' '}
                </span>
              ))}
            </div>

            {/* Surah details */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-500 flex flex-wrap gap-4 justify-center">
                <span>{language === 'ar' ? 'الجزء:' : 'Juz:'} {surah.ayat[0]?.juz}</span>
                <span>{language === 'ar' ? 'الصفحة:' : 'Page:'} {surah.ayat[0]?.page}</span>
                <span>{language === 'ar' ? 'المنزل:' : 'Manzil:'} {surah.ayat[0]?.manzil}</span>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
            {/* Previous Surah */}
            {surahNumber > 1 && (
              <Link
                href={`/quran/surahs/${surahNumber - 1}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-800 transition-colors duration-200"
              >
                <FontAwesomeIcon icon={language === 'ar' ? faChevronRight : faChevronLeft} className="w-4 h-4" />
                <span>{language === 'ar' ? 'السورة السابقة' : 'Previous Surah'}</span>
              </Link>
            )}

            {/* Next Surah */}
            {surahNumber < 114 && (
              <Link
                href={`/quran/surahs/${surahNumber + 1}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-800 transition-colors duration-200"
              >
                <span>{language === 'ar' ? 'السورة التالية' : 'Next Surah'}</span>
                <FontAwesomeIcon icon={language === 'ar' ? faChevronLeft : faChevronRight} className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 