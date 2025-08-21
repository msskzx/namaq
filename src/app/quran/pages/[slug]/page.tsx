"use client";

import { useLanguage } from "@/components/language/LanguageContext";
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Ayah } from '@/types/quran';
import useSWR from "swr";
import ErrorMessage from '@/components/common/ErrorMessage';

import { fetcher } from '@/lib/swr';

export default function SurahPage() {
  const { language } = useLanguage();
  const params = useParams();
  const pageNumber = parseInt(params.slug as string);

  const { data: ayat, error, isLoading } = useSWR<Ayah[]>(`/api/quran/pages/${pageNumber}`, fetcher);

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
          <ErrorMessage title={language === 'ar' ? 'حدث خطأ أثناء تحميل الصفحة' : 'Error loading page'} description={String(error)} />
        </div>
      </div>
    );
  }

  if (!ayat) {
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

        <div className="mx-auto bg-gray-50 dark:bg-gray-900 rounded-xl shadow-lg p-6 max-w-3xl">

          {/* Surah Header */}

          {/* Ayat */}
          {ayat.map((ayah, index) => (
            <span key={ayah.id} className="mt-8">

              {/* Bismillah */}
              {ayah.number === 1 && (
                <div className="text-center mb-6">
                  <span className="text-5xl text-amber-600 dark:text-amber-400 font-bold">
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </span>
                  {ayah.globalNumber === 1 && (
                    <span className="inline-block w-8 h-8 bg-amber-100 dark:bg-amber-900 rounded-full text-center leading-8 mx-2 align-middle">
                      <span className="text-amber-600 dark:text-amber-400 font-bold text-xs">
                        1
                      </span>
                    </span>
                  )}
                </div>
              )}

              <span className="text-3xl mt-10 font-arabic">
                {ayah.number === 1 ? (
                  ayah.text.substring('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'.length + 1).trim()
                ) : (
                  ayah.text
                )}
              </span>
              {!(pageNumber === 1 && ayah.globalNumber === 1) && (
                <span className="inline-block w-8 h-8 bg-amber-100 dark:bg-amber-900 rounded-full text-center leading-8 align-middle">
                  <span className="text-amber-600 dark:text-amber-400 text-xs">
                    {ayah.number}
                  </span>
                </span>
              )}
              {index < ayat.length - 1 && ' '}
            </span>
          ))}

          {/* Navigation Buttons */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
            {/* Previous Surah */}
            {pageNumber > 1 && (
              <Link
                href={`/quran/pages/${pageNumber - 1}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-800 transition-colors duration-200"
              >
                <FontAwesomeIcon icon={language === 'ar' ? faChevronRight : faChevronLeft} className="w-4 h-4" />
                <span>{language === 'ar' ? 'الصفحة السابقة' : 'Previous Page'}</span>
              </Link>
            )}

            {/* Next Surah */}
            {pageNumber < 604 && (
              <Link
                href={`/quran/pages/${pageNumber + 1}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-800 transition-colors duration-200"
              >
                <span>{language === 'ar' ? 'الصفحة التالية' : 'Next Page'}</span>
                <FontAwesomeIcon icon={language === 'ar' ? faChevronLeft : faChevronRight} className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 